#!/usr/bin/env python3
"""Convert the two supplied prop OBJs into one compact base64 asset.

Output: src/js/prop-models.js  ->  window.TTF_PROPS = { box: {...}, money: {...} }

Same buffer layout as the phone asset, one material slot per prop:
  positions  uint16[3 * V]   quantised over the bounding box
  normals    int8  [3 * V]
  indices    uint16[3 * T]

Sources are the presenter's own downloads (a cardboard parcel and a stack of
banknotes). Geometry only — no texture, no material file, nothing recoloured; the
deck shades them with its own gold and paper materials.
"""
import base64
import json
import math
import pathlib
import struct
import sys

OUT = pathlib.Path(__file__).parent.parent / "src" / "js" / "prop-models.js"

# key -> (obj path, weld grid or 0)
# The parcel arrives as 4,504 faces — coplanar panels subdivided far past anything
# visible at the size it is drawn. Welding its vertices onto a 64-cube grid and
# re-emitting flat-shaded triangles keeps the silhouette and cuts it to ~740
# triangles, which is what a venue laptop without a GPU can actually afford.
PROPS = {
    "box": ("/tmp/models/Cardboard box/Models and Textures/Cardboard box.obj", 64),
    "money": ("/tmp/models/b899524e-1e4q6cia46sgMoney/stacks of money.obj", 0),
}


def load(path):
    verts, norms, faces = [], [], []
    with open(path, errors="replace") as fh:
        for line in fh:
            if line.startswith("v "):
                s = line.split()
                verts.append((float(s[1]), float(s[2]), float(s[3])))
            elif line.startswith("vn "):
                s = line.split()
                norms.append((float(s[1]), float(s[2]), float(s[3])))
            elif line.startswith("f "):
                corners = []
                for tok in line.split()[1:]:
                    bits = tok.split("/")
                    vi = int(bits[0])
                    ni = int(bits[2]) if len(bits) > 2 and bits[2] else 0
                    corners.append((vi - 1 if vi > 0 else len(verts) + vi,
                                    ni - 1 if ni > 0 else (len(norms) + ni if ni else -1)))
                faces.append(corners)
    return verts, norms, faces


def weld(verts, faces, grid):
    """Cluster vertices onto a cube grid, then re-emit flat-shaded triangles."""
    lo = [min(v[a] for v in verts) for a in range(3)]
    hi = [max(v[a] for v in verts) for a in range(3)]
    m = max(hi[a] - lo[a] for a in range(3)) or 1.0

    def snap(v):
        c = tuple(int(round((v[a] - lo[a]) / m * grid)) for a in range(3))
        return c, tuple(lo[a] + c[a] * m / grid for a in range(3))

    out_v, out_n, out_f = [], [], []
    seen = set()
    for cs in faces:
        pts = [snap(verts[c[0]]) for c in cs]
        keys = [p[0] for p in pts]
        for k in range(1, len(keys) - 1):
            tri = (keys[0], keys[k], keys[k + 1])
            if len(set(tri)) < 3:
                continue
            sig = tuple(sorted(tri))
            if sig in seen:
                continue
            seen.add(sig)
            a, b, c = pts[0][1], pts[k][1], pts[k + 1][1]
            u = [b[i] - a[i] for i in range(3)]
            w = [c[i] - a[i] for i in range(3)]
            n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]]
            ln = math.sqrt(sum(x * x for x in n))
            if ln < 1e-12:
                continue
            n = [x / ln for x in n]
            base = len(out_v)
            out_v += [a, b, c]
            out_n += [n, n, n]
            out_f.append([(base, base), (base + 1, base + 1), (base + 2, base + 2)])
    return out_v, out_n, out_f


def pack(name, path, grid=0):
    verts, norms, faces = load(path)
    if grid:
        before = sum(max(0, len(cs) - 2) for cs in faces)
        verts, norms, faces = weld(verts, faces, grid)
        print("%-6s welded %d -> %d tris" % (name, before, len(faces)))
    used = {c[0] for cs in faces for c in cs}
    lo = [min(verts[i][a] for i in used) for a in range(3)]
    hi = [max(verts[i][a] for i in used) for a in range(3)]
    size = [hi[a] - lo[a] for a in range(3)]

    pairs, order, tris = {}, [], []
    for cs in faces:
        idx = []
        for pair in cs:
            k = pairs.get(pair)
            if k is None:
                k = len(order)
                pairs[pair] = k
                order.append(pair)
            idx.append(k)
        for i in range(1, len(idx) - 1):                # fan-triangulate n-gons
            tris.extend((idx[0], idx[i], idx[i + 1]))

    if len(order) > 65535:
        sys.exit("%s: too many vertices for uint16 indices: %d" % (name, len(order)))

    pos, nor = bytearray(), bytearray()
    for vi, ni in order:
        v = verts[vi]
        for a in range(3):
            q = 0 if size[a] == 0 else (v[a] - lo[a]) / size[a]
            pos += struct.pack("<H", max(0, min(65535, int(round(q * 65535)))))
        n = norms[ni] if 0 <= ni < len(norms) else (0.0, 0.0, 1.0)
        ln = math.sqrt(sum(c * c for c in n)) or 1.0
        for a in range(3):
            nor += struct.pack("b", max(-127, min(127, int(round(n[a] / ln * 127)))))

    idx_bytes = bytearray()
    for i in tris:
        idx_bytes += struct.pack("<H", i)

    blob = bytes(pos) + bytes(nor) + bytes(idx_bytes)
    print("%-6s %5d verts  %5d tris  %5.0f KB base64"
          % (name, len(order), len(tris) // 3, len(blob) * 4 / 3 / 1024))
    return {
        "v": len(order),
        "tri": len(tris) // 3,
        "lo": [round(c, 4) for c in lo],
        "size": [round(c, 4) for c in size],
        "b64": base64.b64encode(blob).decode(),
    }


def main():
    out = {}
    for name, (path, grid) in PROPS.items():
        if not pathlib.Path(path).exists():
            sys.exit("missing %s — extract the supplied archive to /tmp/models first" % path)
        out[name] = pack(name, path, grid)

    js = ("/* Cardboard parcel and banknote-stack props, converted from the OBJ files the\n"
          "   presenter supplied. Geometry only — uint16 quantised positions, int8 normals,\n"
          "   uint16 indices. No texture or material from the source is used; the deck shades\n"
          "   them with its own paper and gold materials. */\n"
          "window.TTF_PROPS = " + json.dumps(out, separators=(",", ":")) + ";\n")
    OUT.write_text(js)
    print("wrote %s (%.0f KB)" % (OUT, OUT.stat().st_size / 1024))


if __name__ == "__main__":
    main()
