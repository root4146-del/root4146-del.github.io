# 배포 안내서

GitHub Pages로 청첩장을 인터넷에 올리는 방법입니다. 순서대로 따라 하시면 됩니다.

---

## 1. 미리 보기 (내 컴퓨터에서 확인)

프로젝트 폴더에서 아래 명령을 실행하고, 브라우저에서 <http://localhost:8080> 을 엽니다.

```powershell
python -m http.server 8080
```

> 파일을 더블클릭해서 여는 방식(`file://`)은 일부 기능이 막히니 꼭 위 방법으로 확인하세요.
> 확인이 끝나면 터미널에서 `Ctrl + C` 를 누르면 종료됩니다.

크롬 개발자도구(F12)에서 휴대폰 모양 아이콘을 누르면 모바일 화면으로 볼 수 있습니다.

---

## 2. GitHub에 올리기

### 2-1. GitHub에서 저장소 만들기

1. <https://github.com/new> 접속
2. **Repository name** 에 `wedding` 입력 (원하는 이름 아무거나 가능)
3. **Public** 선택 — *GitHub Pages 무료 사용은 공개 저장소에서만 됩니다*
4. 아래 체크박스(README, .gitignore, license)는 **모두 체크 해제**
5. **Create repository** 클릭

### 2-2. 내 컴퓨터에서 올리기

만들어진 저장소 주소를 복사해서, 아래 `USERNAME` 과 `REPO` 를 바꿔 실행합니다.

```powershell
git remote add origin https://github.com/USERNAME/REPO.git
git branch -M main
git push -u origin main
```

### 2-3. GitHub Pages 켜기

1. 저장소 페이지 → **Settings** 탭
2. 왼쪽 메뉴 **Pages**
3. **Source** 를 `Deploy from a branch` 로 두고
   **Branch** 를 `main` / `/ (root)` 로 선택 → **Save**
4. 1~2분 뒤 새로고침하면 주소가 나옵니다:
   `https://USERNAME.github.io/REPO/`

---

## 3. ⚠️ 마지막 한 단계 — 카카오톡 미리보기 주소 고치기

2-3에서 받은 실제 주소를 [`index.html`](index.html) 에 넣어야
카카오톡·문자로 링크를 보냈을 때 **사진과 문구가 있는 미리보기 카드**가 뜹니다.

`index.html` 상단에서 `https://USERNAME.github.io/REPO` 를 찾아 **2군데** 모두 바꿔 주세요.

```html
<meta property="og:url"   content="https://내아이디.github.io/wedding/">
<meta property="og:image" content="https://내아이디.github.io/wedding/assets/img/og.jpg">
```

바꾼 뒤 다시 올립니다.

```powershell
git add index.html
git commit -m "og 주소 설정"
git push
```

> 카카오톡은 링크 미리보기를 한 번 저장해두기 때문에, 주소를 고치기 **전에** 링크를 보낸 적이 있다면
> <https://developers.kakao.com/tool/debugger/sharing> 에서 주소를 넣고 **초기화**를 눌러주세요.

---

## 4. 내용 수정하기

| 바꾸고 싶은 것 | 고칠 파일 |
| --- | --- |
| 이름 · 날짜 · 장소 · 인사말 · 계좌 · 교통편 | [`assets/js/config.js`](assets/js/config.js) |
| 색상 · 글꼴 · 여백 | [`assets/css/style.css`](assets/css/style.css) (맨 위 `:root` 부분) |
| 섹션 추가/삭제, 미리보기 문구 | [`index.html`](index.html) |

수정 후에는 항상 아래 3줄을 실행하면 사이트에 반영됩니다. (1~2분 소요)

```powershell
git add .
git commit -m "내용 수정"
git push
```

### 사진을 바꾸고 싶을 때

원본 사진은 [`originals/`](originals/) 폴더에 그대로 보관되어 있습니다.
사진을 교체하려면 원본을 `originals/` 에 넣고 아래를 실행하면
웹용(가벼운) 이미지가 `assets/img/` 에 다시 만들어집니다.

```powershell
python tools/build_images.py
```

---

## 확인 목록

배포 전에 한 번씩 확인해 주세요.

- [ ] `assets/js/config.js` 의 **교통편**(지하철·버스·주차)이 실제와 맞는지
- [ ] 계좌번호 2개가 정확한지
- [ ] `index.html` 의 og 주소 2군데를 실제 주소로 바꿨는지
- [ ] 휴대폰에서 직접 열어보고 사진·지도·복사 버튼이 잘 되는지
