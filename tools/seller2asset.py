#!/usr/bin/env python3
"""Pack the cut-out seller photograph supplied by the presenter into
src/js/seller-asset.js as a transparent PNG data URI.

This is the centre figure of chapter 02 ("4 Channels. 1 Taxpayer.") and replaces
the drawn halftone sticker that stood in for it.

The photo is used as supplied. The only operations are: trim the empty margin
around the subject, resize, and convert to greyscale so it sits inside the
black / white / gold palette. Nothing is generated, retouched or composited, and
the face is never altered.
"""
import base64
import io
import pathlib
import sys

from PIL import Image, ImageOps

OUT = pathlib.Path(__file__).parent.parent / "src" / "js" / "seller-asset.js"
UP = pathlib.Path("/root/.claude/uploads/d30e6539-39aa-58ef-81f9-9a5fd17f1e90")
SRC = UP / "56bf3f39-image.png"
TARGET_W = 900           # plenty at the size it is drawn on a 1080p projector
GREYSCALE = False        # presenter asked to keep the original colours


def main():
    if not SRC.exists():
        sys.exit("missing %s" % SRC)
    im = ImageOps.exif_transpose(Image.open(SRC)).convert("RGBA")

    box = im.getbbox()                       # drop the transparent margin
    if box:
        im = im.crop(box)

    if GREYSCALE:
        rgb = ImageOps.grayscale(im.convert("RGB")).convert("RGB")
        im = Image.merge("RGBA", (*rgb.split(), im.split()[3]))

    if im.width > TARGET_W:
        im = im.resize((TARGET_W, round(im.height * TARGET_W / im.width)),
                       Image.LANCZOS)

    buf = io.BytesIO()
    im.save(buf, "PNG", optimize=True)
    raw = buf.getvalue()
    print("seller %d x %d  %.1f KB" % (im.width, im.height, len(raw) / 1024))

    js = ('/* Seller photograph supplied by the presenter — the centre figure of\n'
          '   chapter 02. Trimmed and resized only — original colours kept;\n'
          '   never generated, retouched or composited. */\n'
          'window.TTF_SELLER = { w: %d, h: %d, uri: "data:image/png;base64,%s" };\n'
          % (im.width, im.height, base64.b64encode(raw).decode()))
    OUT.write_text(js)
    print("wrote %s (%.0f KB)" % (OUT, OUT.stat().st_size / 1024))


if __name__ == "__main__":
    main()
