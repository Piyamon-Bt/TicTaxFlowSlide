#!/usr/bin/env python3
"""Pack the supplied platform logos into src/js/brand-assets.js as data URIs.

The logos are used **unmodified** — the only operations are trimming the empty
margin, scaling to a common height, and (for a mark supplied on a white JPEG
background) keying that white out so the mark sits on the page itself rather than
on a tile. Every mark keeps its own proportions, colours and shape. Referential
use: they name the channels a seller actually sells through. Nothing is
recoloured, redrawn or combined with other marks.
"""
import base64
import io
import pathlib
import sys

from PIL import Image

OUT = pathlib.Path(__file__).parent.parent / "src" / "js" / "brand-assets.js"
UP = pathlib.Path("/root/.claude/uploads/d30e6539-39aa-58ef-81f9-9a5fd17f1e90")

# name -> (file, treat white as background?)
SRC = {
    "Shopee": ("7240fdb3-image.webp", False),
    "Lazada": ("309bb1ad-image.jpg", True),
    "Facebook": ("9cced58e-image.webp", False),
    "LINE": ("43003333-image.webp", False),
}
HEIGHT = 96


def trim(im, white_bg):
    import numpy as np
    a = np.array(im)
    ink = (255 - a[:, :, :3].min(axis=2)) if white_bg else a[:, :, 3]
    ys, xs = np.nonzero(ink > 24)
    return im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))


def unwhite(im):
    """Turn a white JPEG backdrop into transparency without altering the mark.

    Alpha comes from how far the pixel is from white; the colour is then
    un-composited (O = C*a + 255*(1-a)  ->  C = (O - 255*(1-a)) / a) so the mark's
    own colours come back exactly, with clean antialiased edges.
    """
    import numpy as np
    a = np.array(im).astype(np.float32)
    rgb = a[:, :, :3]
    alpha = 255.0 - rgb.min(axis=2)
    safe = np.maximum(alpha, 1.0)[:, :, None]
    col = (rgb - (255.0 - safe)) / (safe / 255.0)
    out = np.dstack([np.clip(col, 0, 255), alpha]).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def main():
    out = {}
    for name, (fn, white_bg) in SRC.items():
        path = UP / fn
        if not path.exists():
            sys.exit("missing %s" % path)
        im = Image.open(path).convert("RGBA")
        im = trim(im, white_bg)
        w = max(1, round(im.width * HEIGHT / im.height))
        im = im.resize((w, HEIGHT), Image.LANCZOS)
        if white_bg:                      # key the supplied white backdrop out
            im = unwhite(im)
        buf = io.BytesIO()
        im.save(buf, "PNG", optimize=True)
        raw = buf.getvalue()
        out[name] = {
            "uri": "data:image/png;base64," + base64.b64encode(raw).decode(),
            "w": im.width, "h": im.height,
        }
        print("%-9s %4d x %3d  %5.1f KB" % (name, im.width, im.height, len(raw) / 1024))

    body = ",\n".join(
        '  "%s": { w: %d, h: %d, uri: "%s" }' % (k, v["w"], v["h"], v["uri"])
        for k, v in out.items()
    )
    js = ("/* Platform logos supplied by the presenter, trimmed and scaled to a common\n"
          "   height. Used referentially to name the channels a seller sells through —\n"
          "   unmodified, never recoloured, and never implying any partnership. */\n"
          "window.TTF_BRAND = {\n" + body + "\n};\n")
    OUT.write_text(js)
    print("wrote %s (%.0f KB)" % (OUT, OUT.stat().st_size / 1024))


if __name__ == "__main__":
    main()
