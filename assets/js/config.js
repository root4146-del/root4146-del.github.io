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
    '저희 두사람,',
    '서로 배려하며 인생에 행복한 날들이',
    '가득하도록 함께 만들어 가겠습니다.',
    '귀한 걸음으로 축복해주시면 감사하겠습니다.'
  ],

  venue: {
    name: 'MJ컨벤션',
    hall: '3층 다이너스티홀',
    area: '부천',          // 짧게 부를 때 쓰는 지역명 ("부천 MJ컨벤션")
    address: '경기 부천시 소사구 경인로 386',
    addressDetail: '(소사본동)',
    lat: 37.4820441,
    lng: 126.7997547,
    /* 길찾기 앱에서 검색할 이름 */
    searchKeyword: '부천MJ컨벤션',
    tel: '',            // 예식장 대표번호를 아시면 넣어주세요. 비우면 버튼이 숨겨집니다.

    /* 지도 앱 바로가기 — 비워두면 검색어/좌표로 자동 생성됩니다. */
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
        { role: '신랑', name: '임형근', bank: '토스뱅크', number: '1002-4094-0171' }
      ]
    },
    {
      side: '신부측',
      items: [
        { role: '신부', name: '신상은', bank: '토스뱅크', number: '1002-6790-0402' }
      ]
    }
  ],

  /* 갤러리 — assets/img/gallery, assets/img/thumb 안의 파일명 */
  gallery: {
    count: 18,
    prefix: 'g',
    ext: '.jpg'
  }
};
