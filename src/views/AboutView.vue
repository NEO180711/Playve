<template>
  <article class="about-page">
    <header class="page__head">
      <RouterLink to="/" class="page__back">← 홈</RouterLink>
      <h1 class="page__title">Playve 소개</h1>
      <p class="page__desc">이 사이트의 목적, 콘텐츠 성격, 운영 방침을 투명하게 안내합니다.</p>
    </header>

    <div class="legal-body panel">
      <p>
        <strong>Playve</strong>는 모임·수업·동아리·친목 자리에서 <strong>공정하게 역할·당첨·순서를 정할 수 있도록</strong> 돕는
        웹 기반 도구 모음입니다. 사다리타기, 원판(룰렛), 제비뽑기, 랜덤 숫자·동전, 이름 추첨 등 각 기능은
        <strong>브라우저에서 바로 실행</strong>되도록 만들었으며, 별도 회원가입 없이 이용할 수 있습니다.
      </p>

      <h2>콘텐츠의 독창성과 가치</h2>
      <p>
        본 사이트의 화면 구성, 안내 문구, 도움말, 게임 규칙 설명, 접근성·동의 흐름 등은
        <strong>운영 목적에 맞게 직접 작성·구현한 콘텐츠</strong>입니다. 다른 사이트의 본문을 복사해 채우지 않으며,
        사용자가 각 기능을 <strong>스스로 이해하고 안전하게 쓸 수 있도록</strong> 설명을 보강해 나가고 있습니다.
        <strong>사용자에게 유용한 정보</strong>와 <strong>명확한 사이트 구조</strong>,
        <RouterLink to="/faq">FAQ</RouterLink>·<RouterLink to="/contact">문의</RouterLink>를 통한 소통을 지향합니다.
      </p>

      <h2>개인정보와 데이터</h2>
      <p>
        참가자 이름·항목 목록 등은 <strong>사용자 기기의 브라우저에서만 입력</strong>되며, Playve가 이를 서버에 저장하거나
        수집하는 구조로 설계하지 않았습니다. 광고·분석 등 <strong>제3자 서비스</strong>와 관련된 처리는
        <RouterLink to="/privacy">개인정보처리방침</RouterLink>과 쿠키 동의 안내에 따릅니다.
      </p>

      <h2>이용 안내</h2>
      <p>
        본 서비스는 <strong>오락·추첨·의사결정 보조</strong> 목적에 적합합니다. 실제 금전·법적 효력이 있는 판단에 사용할 때는
        관련 법령과 기관 규정을 반드시 확인하시기 바랍니다. 자세한 책임 한계는
        <RouterLink to="/terms">이용약관</RouterLink>을 참고해 주세요.
      </p>

      <h2>문의</h2>
      <p>
        운영자 연락처는 <RouterLink to="/contact">문의하기</RouterLink> 페이지에 안내합니다. 제휴·오류 신고·정책 관련
        질문을 받습니다.
      </p>
    </div>
  </article>
</template>

<style scoped>
.about-page {
  position: relative;
}
</style>
