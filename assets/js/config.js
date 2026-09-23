/* ------------------------------------------------------------------
 * 청첩장 정보 — 내용을 바꾸고 싶으면 이 파일만 수정하면 됩니다.
 * ------------------------------------------------------------------ */
window.WEDDING = {
  /* 예식 일시 — KST 기준 (month 는 1~12 그대로 씁니다) */
  date: { year: 2027, month: 1, day: 23, hour: 14, minute: 0 },

  groom: {
    name: '임형근',
    father: '임기순',
    mother: '이선옥',
    relation: '아들'
  },
  bride: {
    name: '신상은',
    father: '신현익',
    mother: '유현정',
    relation: '딸'
  },

  /* 인사말 — 줄바꿈 단위로 배열에 넣습니다 */
  greeting: [
    '저희 두 사람,',
    '서로 배려하며 인생에 행복한 날들이',
    '가득하도록 함께 만들어 가겠습니다.',
    '귀한 걸음으로 축복해 주시면 감사하겠습니다.'
  ],

  venue: {
    name: 'MJ컨벤션',
    hall: '3층 다이너스티홀',
    area: '부천',          // 짧게 부를 때 쓰는 지역명 ("부천 MJ컨벤션")
    address: '경기 부천시 소사구 경인로 386',
    addressDetail: '(소사본동)',
    /* MJ컨벤션 건물 좌표 (네이버 지도 place 37537597 기준).
       지도 마커와 티맵 길안내 목적지가 이 좌표를 씁니다. */
    lat: 37.4818021,
    lng: 126.7984948,
    /* 지도 처음 확대 단계 (숫자가 클수록 가까이 · 15~19 권장) */
    mapZoom: 17,
    /* 길찾기 앱에서 검색할 이름 */
    searchKeyword: '부천MJ컨벤션',
    tel: '',            // 예식장 대표번호를 아시면 넣어주세요. 비우면 버튼이 숨겨집니다.

    /* 지도 앱 바로가기 — 비워두면 아래 좌표와 searchKeyword 로 자동 생성됩니다.
       티맵은 위 lat/lng(건물 좌표)로 길안내 목적지를 잡습니다. */
    mapLinks: {
      naver: 'https://map.naver.com/p/search/%EB%B6%80%EC%B2%9CMJ%EC%BB%A8%EB%B2%A4%EC%85%98/place/37537597',
      kakao: 'https://map.kakao.com/?q=%EB%B6%80%EC%B2%9CMJ%EC%BB%A8%EB%B2%A4%EC%85%98',
      tmap: ''
    },
    /* 교통편
       lines 에는 문자열을 넣거나, 정류장처럼 이름과 설명을 나누고 싶으면
       { name: '정류장 이름', desc: '버스 번호' } 형태로 넣습니다. */
    transport: [
      {
        icon: 'subway', label: '지하철 이용 시',
        lines: ['1호선 · 서해선 소사역 1번 출구 건너편 좌측 (70m)']
      },
      {
        icon: 'bus', label: '일반 버스 이용 시',
        lines: [
          { name: '소사어울마당삼거리 · MJ컨벤션', desc: '19, 83, 88, 88-1' },
          { name: '소사어울마당삼거리', desc: '53, 60-1' },
          { name: '소사역 · 소사지구대', desc: '19, 53, 83, 88' },
          { name: '소사 푸르지오', desc: '56, 56-1, 60' }
        ]
      },
      {
        icon: 'car', label: '자가용 이용 시',
        lines: [
          '내비게이션 입력 — 부천시 소사구 소사본동 65-7번지',
          '서울외곽순환고속도로(시흥IC) → 소사본3동 → 소사구청 옆',
          '건물 주차장 이용 (약 650대 수용)'
        ]
      }
    ]
  },

  /* 마음 전하실 곳 */
  accounts: [
    {
      side: '신랑측',
      items: [
        { role: '신랑', name: '임형근', bank: '토스뱅크', number: '1002-4094-0171' },
        { role: '아버지', name: '임기순', bank: '기업은행', number: '293-079798-01-016' },
        { role: '어머니', name: '이선옥', bank: '하나은행', number: '280-890653-47007' }
      ]
    },
    {
      side: '신부측',
      items: [
        { role: '신부', name: '신상은', bank: '토스뱅크', number: '1002-6790-0402' }
      ]
    }
  ],

  /* 카카오 JavaScript 키 — 카카오맵 지도와 카카오톡 공유에 씁니다.
     developers.kakao.com → 내 애플리케이션 → 앱 → 플랫폼 키 → JavaScript 키 에
     사이트 주소(https://root4146-del.github.io)가 등록되어 있어야 동작합니다.
     등록 전이거나 비워두면 지도는 OpenStreetMap 으로, 공유는 기본 공유창으로 대신합니다. */
  kakao: {
    jsKey: '36c74b5e01725b05e51d03687cf97d42',
    mapLevel: 3        // 카카오맵 확대 단계 (숫자가 작을수록 가까이 · 2~4 권장)
  },

  /* 화면 효과 — 꽃잎이 흩날리는 효과를 끄려면 petals 를 false 로 */
  effects: {
    petals: true
  },

  /* 갤러리 — assets/img/gallery, assets/img/thumb 안의 파일명 */
  gallery: {
    count: 18,
    prefix: 'g',
    ext: '.jpg'
  }
};
