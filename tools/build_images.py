# -*- coding: utf-8 -*-
"""
originals/ 안의 원본 사진을 웹용으로 다시 만들어 assets/img/ 에 넣습니다.

    python tools/build_images.py

필요한 것: Pillow  (없으면  pip install pillow)
"""
import os
import sys

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow 가 필요합니다.  pip install pillow  를 먼저 실행해 주세요.")

ROOT  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIG  = os.path.join(ROOT, "originals")
IMG   = os.path.join(ROOT, "assets", "img")
FULL  = os.path.join(IMG, "gallery")
THUMB = os.path.join(IMG, "thumb")

P = "KakaoTalk_20260920_223627497"

# ── 갤러리에 넣을 순서 (originals 파일의 번호) ──────────────────────
# 사진 순서를 바꾸고 싶으면 이 목록의 숫자 순서만 바꾸면 됩니다.
ORDER = [0, 1, 2, 3, 4, 5, 8, 9, 7, 10, 6, 11, 12, 13, 14, 17, 15, 16]
COVER = 17   # 표지 사진 (0123 풍선)
OG    = 0    # 카카오톡 미리보기용 가로 사진

# ── 출력 크기 / 품질 ───────────────────────────────────────────────
COVER_PX,  COVER_Q  = 1400, 84
FULL_PX,   FULL_Q   = 1200, 80
THUMB_PX,  THUMB_Q  = 640, 74
OG_W, OG_H, OG_Q    = 1200, 630, 82


def src(n):
    name = "%s.jpg" % P if n == 0 else "%s_%02d.jpg" % (P, n)
    return os.path.join(ORIG, name)


def load(n):
    path = src(n)
    if not os.path.exists(path):
        sys.exit("원본을 찾을 수 없습니다: %s" % path)
    return ImageOps.exif_transpose(Image.open(path)).convert("RGB")


def save(im, path, q):
    im.save(path, "JPEG", quality=q, optimize=True, progressive=True)
    return os.path.getsize(path)


def fit(im, longest):
    out = im.copy()
    out.thumbnail((longest, longest), Image.LANCZOS)
    return out


def main():
    for d in (IMG, FULL, THUMB):
        if not os.path.isdir(d):
            os.makedirs(d)

    total = 0

    total += save(fit(load(COVER), COVER_PX), os.path.join(IMG, "cover.jpg"), COVER_Q)
    print("cover.jpg")

    im = load(OG)
    w, h = im.size
    th = int(w / (float(OG_W) / OG_H))
    top = max(0, int((h - th) * 0.42))          # 인물 머리가 잘리지 않게 살짝 위로
    og = im.crop((0, top, w, top + th)).resize((OG_W, OG_H), Image.LANCZOS)
    total += save(og, os.path.join(IMG, "og.jpg"), OG_Q)
    print("og.jpg")

    for i, n in enumerate(ORDER, start=1):
        im = load(n)
        f = save(fit(im, FULL_PX), os.path.join(FULL, "g%02d.jpg" % i), FULL_Q)
        t = save(fit(im, THUMB_PX), os.path.join(THUMB, "g%02d.jpg" % i), THUMB_Q)
        total += f + t
        print("g%02d  full %3dKB / thumb %3dKB" % (i, f // 1024, t // 1024))

    print("")
    print("총 %.2f MB  (사진 %d장)" % (total / 1024.0 / 1024.0, len(ORDER)))
    print("사진 개수를 바꿨다면 assets/js/config.js 의 gallery.count 도 함께 고쳐주세요.")


if __name__ == "__main__":
    main()
