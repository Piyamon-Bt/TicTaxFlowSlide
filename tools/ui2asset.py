#!/usr/bin/env python3
"""Pack the TicTaxFlow product screenshots into src/js/ui-assets.js as data URIs.

Four screens, all supplied by the presenter and all shown unmodified apart from
framing: a 2 px window-border trim, an optional crop of the browser chrome so
every screen is page content, and padding at the bottom with the page's own white
to reach the laptop's 16:10 — the page simply continues below the fold, rather
than cropping the navigation or the hero off the sides.

  landing  chapter 07 laptop — the live marketing page
  step1    chapter 08 — Features / AI-Powered Receipt Analysis
  step2    chapter 08 — Dashboard, a receipt being processed
  step3    chapter 08 — Dashboard, the deductions that came out of it
"""
import base64
import io
import pathlib
import sys

from PIL import Image

OUT = pathlib.Path(__file__).parent.parent / "src" / "js" / "ui-assets.js"
UP = pathlib.Path("/root/.claude/uploads/d30e6539-39aa-58ef-81f9-9a5fd17f1e90")

# key -> (file, top crop in px — removes browser chrome so all four match)
SRC = {
    "landing": ("0e57d233-image.jpg", 0),
    "step1": ("13785afc-image.jpg", 0),
    "step2": ("8ce515c6-image.jpg", 80),      # tab strip + address bar
    "step3": ("7ede0c3c-image.jpg", 0),
}
TARGET_W = 1440          # plenty for a laptop screen on a 1080p projector
ASPECT = 16 / 10


def frame(path, top):
    im = Image.open(path).convert("RGB")
    im = im.crop((2, 3 + top, im.width - 2, im.height))   # trim border + chrome
    need_h = round(im.width / ASPECT)
    if need_h > im.height:                                # pad with the page's own white
        pad = Image.new("RGB", (im.width, need_h), (255, 255, 255))
        pad.paste(im, (0, 0))
        im = pad
    else:
        im = im.crop((0, 0, im.width, need_h))
    return im.resize((TARGET_W, round(TARGET_W / ASPECT)), Image.LANCZOS)


def main():
    rows = []
    for key, (fn, top) in SRC.items():
        path = UP / fn
        if not path.exists():
            sys.exit("missing %s" % path)
        im = frame(path, top)
        buf = io.BytesIO()
        im.save(buf, "JPEG", quality=82, optimize=True, progressive=True)
        raw = buf.getvalue()
        print("%-8s %d x %d  %5.1f KB" % (key, im.width, im.height, len(raw) / 1024))
        rows.append('  %s: { w: %d, h: %d, uri: "data:image/jpeg;base64,%s" }'
                    % (key, im.width, im.height, base64.b64encode(raw).decode()))

    js = ('/* TicTaxFlow product screenshots supplied by the presenter, framed to 16:10\n'
          '   for the laptop screens in chapters 07 and 08. Unmodified otherwise. */\n'
          'window.TTF_UI = {\n' + ',\n'.join(rows) + '\n};\n')
    OUT.write_text(js)
    print("wrote %s (%.0f KB)" % (OUT, OUT.stat().st_size / 1024))


if __name__ == "__main__":
    main()
