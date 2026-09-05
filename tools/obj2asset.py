#!/usr/bin/env python3
"""Convert the supplied iPhone OBJ into a compact base64 asset for inlining.

Output: src/js/phone-model.js  ->  window.TTF_PHONE = {...}

Layout of the decoded buffer:
  positions  uint16[3 * V]   quantised over the bounding box
  normals    int8  [3 * V]
  indices    uint16[3 * T]

The 127k-face "Cube" object is the earpiece speaker grille: sub-millimetre
detail that is invisible at presentation scale and would triple the file.
It is dropped; the screen plane covers that area anyway.
"""
import base64
import json
import math
import pathlib
import struct
import sys

SRC = sys.argv[1] if len(sys.argv) > 1 else (
    "/root/.claude/uploads/d30e6539-39aa-58ef-81f9-9a5fd17f1e90/"
    "a030c6e0-Iphone_seceond_version_finished.obj")
OUT = pathlib.Path(__file__).parent.parent / "src" / "js" / "phone-model.js"

DROP_OBJECTS = {"Cube"}

# obj material name -> slot index used by the renderer
MAT_SLOT = {
    "default": 0,        # body shell
    "Metallic": 1,       # frame / buttons
    "schwarz glass": 2,  # camera bump glass
    "Mat": 3,            # camera lens glass
    "Mat.6": 4,          # lens ring
}


def main():
    verts, norms = [], []
    faces = []            # (slot, [(vi, ni), ...])
    obj = None
    mtl = "default"
    dropped = 0

    with open(SRC, errors="replace") as fh:
        for line in fh:
            if line.startswith("v "):
                s = line.split()
                verts.append((float(s[1]), float(s[2]), float(s[3])))
            elif line.startswith("vn "):
                s = line.split()
                norms.append((float(s[1]), float(s[2]), float(s[3])))
            elif line.startswith("o "):
                obj = line[2:].strip()
            elif line.startswith("usemtl"):
                mtl = line.split(None, 1)[1].strip()
            elif line.startswith("f "):
                if obj in DROP_OBJECTS:
                    dropped += 1
                    continue
                corners = []
                for tok in line.split()[1:]:
                    bits = tok.split("/")
                    vi = int(bits[0])
                    ni = int(bits[2]) if len(bits) > 2 and bits[2] else 0
                    corners.append((vi - 1 if vi > 0 else len(verts) + vi,
                                    ni - 1 if ni > 0 else (len(norms) + ni if ni else -1)))
                faces.append((MAT_SLOT.get(mtl, 0), corners))

    print("source: %d verts, %d normals, %d kept faces (%d dropped)"
          % (len(verts), len(norms), len(faces), dropped))

    # bounding box of the vertices actually used
    used = {c[0] for _, cs in faces for c in cs}
    xs = [verts[i][0] for i in used]
    ys = [verts[i][1] for i in used]
    zs = [verts[i][2] for i in used]
    lo = (min(xs), min(ys), min(zs))
    hi = (max(xs), max(ys), max(zs))
    size = [hi[i] - lo[i] for i in range(3)]
    print("bbox lo=%s hi=%s size=%s" % (
        [round(v, 2) for v in lo], [round(v, 2) for v in hi], [round(v, 2) for v in size]))

    # dedup (vertex, normal) pairs, emitting triangles grouped by material slot
    pairs = {}
    order = []
    tris_by_slot = {}

    def key_index(pair):
        k = pairs.get(pair)
        if k is None:
            k = len(order)
            pairs[pair] = k
            order.append(pair)
        return k

    for slot, cs in faces:
        idx = [key_index(c) for c in cs]
        bucket = tris_by_slot.setdefault(slot, [])
        for i in range(1, len(idx) - 1):          # fan-triangulate n-gons
            bucket.extend((idx[0], idx[i], idx[i + 1]))

    nv = len(order)
    if nv > 65535:
        sys.exit("too many vertices for uint16 indices: %d" % nv)

    pos = bytearray()
    nor = bytearray()
    for vi, ni in order:
        v = verts[vi]
        for a in range(3):
            q = 0 if size[a] == 0 else (v[a] - lo[a]) / size[a]
            pos += struct.pack("<H", max(0, min(65535, int(round(q * 65535)))))
        n = norms[ni] if 0 <= ni < len(norms) else (0.0, 0.0, 1.0)
        ln = math.sqrt(sum(c * c for c in n)) or 1.0
        for a in range(3):
            nor += struct.pack("b", max(-127, min(127, int(round(n[a] / ln * 127)))))

    groups = []
    idx_bytes = bytearray()
    for slot in sorted(tris_by_slot):
        tri = tris_by_slot[slot]
        groups.append({"start": len(idx_bytes) // 2, "count": len(tri), "slot": slot})
        for i in tri:
            idx_bytes += struct.pack("<H", i)

    blob = bytes(pos) + bytes(nor) + bytes(idx_bytes)
    meta = {
        "v": nv,
        "tri": sum(g["count"] for g in groups) // 3,
        "lo": [round(c, 4) for c in lo],
        "size": [round(c, 4) for c in size],
        "groups": groups,
    }
    print("output: %d verts, %d tris, %d groups, %.0f KB raw / %.0f KB base64"
          % (nv, meta["tri"], len(groups), len(blob) / 1024, len(blob) * 4 / 3 / 1024))

    js = ("/* iPhone model, converted from the supplied OBJ.\n"
          "   uint16 quantised positions + int8 normals + uint16 indices. */\n"
          "window.TTF_PHONE = " + json.dumps(meta, separators=(",", ":")) + ";\n"
          "window.TTF_PHONE.b64 = \"" + base64.b64encode(blob).decode() + "\";\n")
    OUT.write_text(js)
    print("wrote %s (%.0f KB)" % (OUT, OUT.stat().st_size / 1024))


if __name__ == "__main__":
    main()
