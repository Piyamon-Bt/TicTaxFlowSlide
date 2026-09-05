#!/usr/bin/env python3
"""Assemble the single self-contained index.html for the TicTaxFlow pitch site.

Everything — CSS, markup, Three.js r149 (UMD) and the app scripts — is inlined,
so the deck opens by double-clicking the file, works from a USB stick, and makes
zero network requests (nothing can 404 on stage).
"""
import pathlib
import sys

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src"
OUT = ROOT / "index.html"

FAVICON = (
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E"
    "%3Crect width='32' height='32' rx='7' fill='%2312100E'/%3E"
    "%3Cpath d='M9 21.5l4.9-5.7 3.4 3.2 5.4-7.3 2.5 1.8-7.6 10.3-3.5-3.3-3.2 3.7z' fill='%23FF2D78'/%3E"
    "%3C/svg%3E"
)

HEAD = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="dark light">
<title>TicTaxFlow — Tax visibility for online sellers</title>
<meta name="description" content="A 12-chapter interactive pitch: TicTaxFlow turns fragmented multi-channel sales into simple, timely tax visibility for small online sellers in Thailand.">
<meta name="robots" content="noindex">
<link rel="icon" href="%s">
<style>
%s
</style>
</head>
<body>
"""

TAIL = """
<script>
%s
</script>
<script>
%s
</script>
<script>
%s
</script>
<script>
%s
</script>
<script>
%s
</script>
<script>
%s
</script>
<script>
%s
</script>
<script>
%s
</script>
<script>
%s
</script>
<script>
%s
</script>
<script>
%s
</script>
</body>
</html>
"""


def read(p):
    return (SRC / p).read_text(encoding="utf-8")


def main():
    candidates = [
        ROOT / "vendor" / "three.min.js",
        ROOT / "vendor" / "package" / "build" / "three.min.js",
    ]
    src_three = next((c for c in candidates if c.exists()), None)
    if src_three is None:
        sys.exit("three.min.js not found under vendor/")
    three = src_three.read_text(encoding="utf-8")
    for name, blob in (("three.min.js", three),):
        if "</script" in blob.lower():
            sys.exit("%s contains a literal </script> and cannot be inlined as-is" % name)

    body = "\n".join(
        read(p)
        for p in (
            "html/a_chrome.html",
            "html/b_ch01_04.html",
            "html/c_ch05_08.html",
            "html/d_ch09_12.html",
        )
    )

    html = (
        HEAD % (FAVICON, read("styles.css"))
        + body
        + TAIL % (three, read("js/content.js"), read("js/brand-assets.js"),
                  read("js/ui-assets.js"), read("js/team-assets.js"),
                  read("js/seller-asset.js"), read("js/prop-models.js"),
                  read("js/phone-model.js"), read("js/phone.js"),
                  read("js/three-layer.js"), read("js/app.js"))
    )
    OUT.write_text(html, encoding="utf-8")
    kb = OUT.stat().st_size / 1024
    print("wrote %s  (%.0f KB)" % (OUT, kb))


if __name__ == "__main__":
    main()
