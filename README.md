# 임형근 ♥ 신상은 — 모바일 청첩장

GitHub Pages로 서비스하는 모바일 청첩장입니다.
외부 라이브러리나 API 키 없이 HTML·CSS·JavaScript만으로 동작합니다.

> **2027년 1월 23일 (토) 오후 2시 · 부천 MJ컨벤션 3층 다이너스티홀**

배포 방법은 [DEPLOY.md](DEPLOY.md)를 참고하세요.

---

## 구성

| 섹션 | 내용 |
| --- | --- |
| 표지 | 대표 사진, 신랑·신부 이름, 일시·장소 |
| 인사말 | 초대 글, 양가 혼주 |
| 예식 안내 | 2027년 1월 달력(예식일 표시), D-day |
| 갤러리 | 웨딩 사진 18장 · 탭하면 확대, 좌우 스와이프 |
| 오시는 길 | 지도, 길찾기(네이버·카카오·티맵), 주소 복사, 교통편 |
| 마음 전하실 곳 | 신랑측·신부측 계좌, 번호 복사 |
| 공유 | 공유하기(모바일 공유 시트), 링크 복사 |

## 폴더 구조

```text
wedding/
├─ index.html                 청첩장 본문
├─ assets/
│  ├─ css/style.css           디자인 (색상은 맨 위 :root 에서 한 번에 변경)
│  ├─ js/config.js            ← 이름·날짜·장소·계좌·교통편 등 모든 내용
│  ├─ js/main.js              달력·갤러리·지도·복사 동작
│  └─ img/
│     ├─ cover.jpg            표지 사진
│     ├─ og.jpg               카카오톡 미리보기 카드 이미지
│     ├─ gallery/g01~g18.jpg  확대용 (1200px)
│     └─ thumb/g01~g18.jpg    목록용 (640px)
├─ originals/                 원본 사진 보관함 (저장소에는 올리지 않음)
├─ tools/build_images.py      원본 → 웹용 이미지 재생성 스크립트
└─ DEPLOY.md                  배포 안내서
```

## 내용 수정

대부분의 내용은 [`assets/js/config.js`](assets/js/config.js) 한 파일에 모여 있습니다.
색상과 글꼴은 [`assets/css/style.css`](assets/css/style.css) 맨 위의 `:root` 변수에서 바꿉니다.

```css
--olive:    #7A8555;   /* 포인트 색 */
--paper:    #FDFCF8;   /* 청첩장 바탕 */
--font:     'Pretendard Variable', …   /* 본문 글꼴 */
--font-en:  var(--font);               /* WEDDING DAY 등 영문 소제목 */
```

글꼴은 **Pretendard**(jsDelivr CDN, 동적 서브셋)를 사용합니다.
`WEDDING DAY` 같은 영문 소제목만 명조/세리프로 바꾸고 싶다면 `--font-en` 값만 교체하면 됩니다.

## 미리 보기

```powershell
python -m http.server 8080
```

브라우저에서 <http://localhost:8080> 을 엽니다.

## 이미지

원본 18장(약 170MB, 장당 3500×5300px)을 웹용으로 줄여 **약 2MB**로 만들었습니다.
사진을 교체하거나 순서를 바꾸려면 `originals/`에 파일을 넣고
[`tools/build_images.py`](tools/build_images.py)의 `ORDER` 목록을 수정한 뒤 실행하세요.

```powershell
python tools/build_images.py
```
