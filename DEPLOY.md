# 배포 안내서

이 청첩장은 아래 주소로 배포되어 있습니다.

## 🔗 <https://root4146-del.github.io/>

GitHub 저장소: <https://github.com/root4146-del/root4146-del.github.io>

---

## 1. 내용을 고치고 다시 올리기

수정 후 아래 3줄이면 사이트에 반영됩니다. (반영까지 1~2분)

```powershell
git add .
git commit -m "내용 수정"
git push
```

| 바꾸고 싶은 것 | 고칠 파일 |
| --- | --- |
| 이름 · 날짜 · 장소 · 인사말 · 계좌 · 교통편 · 지도 링크 | [`assets/js/config.js`](assets/js/config.js) |
| 색상 · 글꼴 · 여백 | [`assets/css/style.css`](assets/css/style.css) 맨 위 `:root` |
| 카카오톡 미리보기 문구, 섹션 추가/삭제 | [`index.html`](index.html) |
| 배경음악 | `assets/audio/bgm.mp3` 파일을 교체 |
| 파비콘 · 홈 화면 아이콘 | `python tools/build_icons.py` |
| 사진 | `originals/`에 넣고 `python tools/build_images.py` |

---

## 2. 내 컴퓨터에서 미리 보기

```powershell
python -m http.server 8080
```

브라우저에서 <http://localhost:8080> 을 엽니다.
파일을 더블클릭해 여는 방식(`file://`)은 일부 기능이 막히니 꼭 위 방법으로 확인하세요.
확인이 끝나면 터미널에서 `Ctrl + C` 를 누르면 종료됩니다.

크롬 개발자도구(F12)에서 휴대폰 모양 아이콘을 누르면 모바일 화면으로 볼 수 있습니다.

---

## 3. 카카오톡 미리보기가 안 뜰 때

카카오톡은 링크 미리보기를 한 번 저장해두기 때문에, 예전에 보낸 적이 있으면 옛날 정보가 그대로 뜹니다.

<https://developers.kakao.com/tool/debugger/sharing> 에 주소를 넣고 **초기화**를 누르면 새로 읽어옵니다.

미리보기에 쓰이는 정보는 [`index.html`](index.html) 맨 위 `og:` 태그들입니다.

| 항목 | 현재 값 |
| --- | --- |
| 제목 | 임형근 ♥ 신상은 결혼합니다 |
| 설명 | 2027년 1월 23일 토요일 오후 2시 · 부천 MJ컨벤션 3층 다이너스티홀 |
| 이미지 | `assets/img/og.jpg` (1200×630) |

---

## 4. 처음부터 다시 배포해야 할 때

저장소 이름이 `계정명.github.io` 이면 GitHub Pages가 **자동으로 켜집니다.**
다른 이름으로 만들었다면 저장소 → **Settings → Pages** 에서
**Source** `Deploy from a branch`, **Branch** `main` / `/ (root)` 로 지정하세요.

```powershell
git remote add origin https://github.com/계정명/저장소명.git
git branch -M main
git push -u origin main
```

저장소는 **Public** 이어야 무료로 Pages를 쓸 수 있습니다.

---

## 5. 카카오맵 · 카카오톡 공유 켜기

JavaScript 키는 [`assets/js/config.js`](assets/js/config.js) 의 `kakao.jsKey` 에 들어 있습니다.
카카오 쪽에 사이트 주소를 등록해야 동작합니다. 등록 전에는 지도가 OpenStreetMap 으로,
공유 버튼은 휴대폰 기본 공유창으로 대신 동작합니다.

1. <https://developers.kakao.com> → **내 애플리케이션** → 해당 앱
2. **앱 → 플랫폼 키 → JavaScript 키** 에서 **JavaScript SDK 도메인**에 아래 주소 추가
   - `https://root4146-del.github.io`
   - (내 컴퓨터에서 확인하려면) `http://localhost:8080`
3. **앱 → 제품 링크 관리 → 웹 도메인** 에도 `https://root4146-del.github.io` 추가
   (예전 화면: **플랫폼 → Web → 사이트 도메인**)
   — 빠뜨리면 카카오톡 카드의 '청첩장 보기'가 앱에 먼저 등록된 다른 사이트로 연결됩니다.
4. **제품 설정 → 카카오맵** 에서 사용 설정 **ON**
5. 저장 후 1~2분 뒤 사이트를 새로고침하고, 카카오톡 공유는 **새로 보내서** 확인
   (이미 보낸 카드는 예전 링크를 그대로 가지고 있습니다)

---

## 확인 목록

- [x] 교통편(지하철·버스·자가용) 실제 정보 반영
- [x] 계좌번호 2개
- [x] og 미리보기 주소
- [x] 파비콘 · 홈 화면 아이콘
- [ ] 카카오 개발자 사이트에 도메인 등록 · 카카오맵 사용 설정 (5번 참고)
- [ ] 휴대폰에서 직접 열어 사진 · 지도 · 복사 버튼 · 음악 동작 확인
- [ ] 카카오톡으로 본인에게 링크를 보내 미리보기 카드 확인
