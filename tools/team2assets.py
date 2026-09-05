#!/usr/bin/env python3
"""Pack the team photos supplied by the presenter into src/js/team-assets.js.

The photos are used as supplied — the only operations are a 3:4 crop (so the
cards share one frame) and a resize. Nothing is generated, retouched or
composited; faces are never altered.

Add a member by appending to MEMBERS: (key, filename, focus_x, focus_y, zoom).
The focus point is 0..1 in the ORIGINAL image and marks roughly the face, so the
crop keeps the head in the upper third; zoom is the fraction of the frame to keep
(1.0 = the whole picture, 0.6 = tighter on the person).
"""
import base64
import io
import pathlib
import sys

from PIL import Image, ImageOps

OUT = pathlib.Path(__file__).parent.parent / "src" / "js" / "team-assets.js"
UP = pathlib.Path("/root/.claude/uploads/d30e6539-39aa-58ef-81f9-9a5fd17f1e90")

MEMBERS = [
    ("p1", "cd5b4bd6-image.jpg", 0.50, 0.19, 1.00),
    ("p2", "c58cbf92-image.jpg", 0.33, 0.38, 0.66),
    ("p3", "fcc116d2-image.jpg", 0.50, 0.30, 1.00),
]
W, H = 560, 747          # 3:4, plenty for a card on a 1080p projector


def crop34(im, fx, fy, zoom=1.0):
    """Crop to 3:4 around a focus point, keeping the head in the upper third."""
    target = 3 / 4
    w, h = im.size
    if w / h > target:                       # too wide -> trim width
        nw, nh = round(h * target), h
    else:                                    # too tall -> trim height
        nw, nh = w, round(w / target)
    nw, nh = round(nw * zoom), round(nh * zoom)
    cx, cy = fx * w, fy * h
    left = min(max(0, round(cx - nw / 2)), w - nw)
    top = min(max(0, round(cy - nh * 0.33)), h - nh)   # face at ~1/3 from the top
    return im.crop((left, top, left + nw, top + nh))


def main():
    out = {}
    for key, fn, fx, fy, zoom in MEMBERS:
        path = UP / fn
        if not path.exists():
            sys.exit("missing %s" % path)
        im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
        im = crop34(im, fx, fy, zoom).resize((W, H), Image.LANCZOS)
        buf = io.BytesIO()
        im.save(buf, "JPEG", quality=82, optimize=True, progressive=True)
        raw = buf.getvalue()
        out[key] = "data:image/jpeg;base64," + base64.b64encode(raw).decode()
        print("%-4s %s  %d x %d  %.1f KB" % (key, fn, W, H, len(raw) / 1024))

    body = ",\n".join('  %s: "%s"' % (k, v) for k, v in out.items())
    js = ("/* Team photos supplied by the presenter. Cropped to a shared 3:4 frame and\n"
          "   resized — never generated, retouched or composited. */\n"
          "window.TTF_TEAM = {\n" + body + "\n};\n")
    OUT.write_text(js)
    print("wrote %s (%.0f KB)" % (OUT, OUT.stat().st_size / 1024))


if __name__ == "__main__":
    main()
