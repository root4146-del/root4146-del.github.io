# -*- coding: utf-8 -*-
"""
파비콘 / 홈 화면 아이콘을 만듭니다.

    python tools/build_icons.py

올리브 타일 위에 맞물린 두 개의 반지(웨딩링) 마크를 그립니다.
색을 바꾸려면 아래 OLIVE / IVORY 값을 수정하세요.
"""
import os
import sys

try:
    from PIL import Image, ImageDraw
except ImportError:
    sys.exit("Pillow 가 필요합니다.  pip install pillow")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "assets", "img")

OLIVE = (122, 133, 85)
IVORY = (253, 252, 248)
SS = 8                      # 안티에일리어싱용 수퍼샘플링 배수


def rounded_rect(d, box, r, fill):
    """Pillow 구버전에는 rounded_rectangle 이 없어 직접 그립니다."""
    x0, y0, x1, y1 = box
    d.rectangle([x0 + r, y0, x1 - r, y1], fill=fill)
    d.rectangle([x0, y0 + r, x1, y1 - r], fill=fill)
    d.pieslice([x0, y0, x0 + 2 * r, y0 + 2 * r], 180, 270, fill=fill)
    d.pieslice([x1 - 2 * r, y0, x1, y0 + 2 * r], 270, 360, fill=fill)
    d.pieslice([x0, y1 - 2 * r, x0 + 2 * r, y1], 90, 180, fill=fill)
    d.pieslice([x1 - 2 * r, y1 - 2 * r, x1, y1], 0, 90, fill=fill)


def draw_mark(size, bg, fg, radius_ratio=0.22):
    """올리브 타일 + 맞물린 두 반지."""
    s = size * SS
    im = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    if bg is not None:
        rounded_rect(d, [0, 0, s - 1, s - 1], int(s * radius_ratio), bg)

    # 맞물린 반지 두 개
    rad = s * 0.185                       # 반지름
    stroke = max(2, int(s * 0.052))
    cy = s * 0.5
    dx = s * 0.135                         # 중심에서 좌우로 벌린 거리
    lx, rx = s / 2 - dx, s / 2 + dx

    def ring(cx, box_only=False):
        return [cx - rad, cy - rad, cx + rad, cy + rad]

    d.ellipse(ring(lx), outline=fg, width=stroke)
    d.ellipse(ring(rx), outline=fg, width=stroke)
    # 왼쪽 반지의 오른쪽 호를 다시 덮어 그려 서로 엮인 것처럼 보이게 합니다.
    d.arc(ring(lx), -52, 52, fill=fg, width=stroke)

    return im.resize((size, size), Image.LANCZOS)


def main():
    if not os.path.isdir(IMG):
        os.makedirs(IMG)

    made = []

    # 홈 화면 / PWA 아이콘 — 올리브 배경
    for size, name in ((180, "icon-180.png"), (192, "icon-192.png"), (512, "icon-512.png")):
        im = draw_mark(size, OLIVE, IVORY)
        p = os.path.join(IMG, name)
        im.save(p)
        made.append((name, os.path.getsize(p)))

    # favicon.ico — 탭에서 작게 보이므로 같은 마크를 여러 크기로
    ico_sizes = [16, 32, 48, 64]
    frames = [draw_mark(n, OLIVE, IVORY) for n in ico_sizes]
    ico = os.path.join(ROOT, "favicon.ico")
    frames[-1].save(ico, format="ICO",
                    sizes=[(n, n) for n in ico_sizes])
    made.append(("favicon.ico", os.path.getsize(ico)))

    # favicon.svg — 벡터 (모던 브라우저 탭에서 가장 선명)
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">\n'
        '  <rect width="64" height="64" rx="14" fill="#7A8555"/>\n'
        '  <g fill="none" stroke="#FDFCF8" stroke-width="3.33" stroke-linecap="round">\n'
        '    <circle cx="23.36" cy="32" r="11.84"/>\n'
        '    <circle cx="40.64" cy="32" r="11.84"/>\n'
        '    <path d="M30.65 22.67a11.84 11.84 0 0 1 0 18.66"/>\n'
        '  </g>\n'
        '</svg>\n'
    )
    svgp = os.path.join(ROOT, "favicon.svg")
    with open(svgp, "w", encoding="utf-8") as f:
        f.write(svg)
    made.append(("favicon.svg", os.path.getsize(svgp)))

    for name, size in made:
        print("%-16s %6d bytes" % (name, size))


if __name__ == "__main__":
    main()
