<template>
  <article class="faq-page">
    <header class="page__head">
      <RouterLink to="/" class="page__back">← 홈</RouterLink>
      <h1 class="page__title">자주 묻는 질문</h1>
      <p class="page__desc">Playve 이용 시 자주 나오는 질문과 답변입니다.</p>
    </header>

    <div class="legal-body panel">
      <dl class="faq-list">
        <dt>Playve는 무료인가요?</dt>
        <dd>
          네. 브라우저에서 바로 쓰는 추첨·미니게임 기능은 별도 결제 없이 이용할 수 있습니다. 사이트 운영을 위해 광고가
          표시될 수 있습니다.
        </dd>

        <dt>입력한 이름이나 목록이 서버에 저장되나요?</dt>
        <dd>
          설계상 참가자·항목 입력은 사용자 기기에서 처리되며, Playve가 회원 DB에 저장하는 구조가 아닙니다. 다만 광고·호스팅
          등 제3자 처리는 <RouterLink to="/privacy">개인정보처리방침</RouterLink>을 참고하세요.
        </dd>

        <dt>모바일에서도 되나요?</dt>
        <dd>
          반응형 레이아웃으로 휴대폰·태블릿·PC 브라우저에서 이용할 수 있도록 구성했습니다.
        </dd>

        <dt>결과는 정말 무작위인가요?</dt>
        <dd>
          각 게임은 브라우저에서 난수를 사용해 결과를 만듭니다. 공정한 추첨·내기 보조 용도에 맞게 동작합니다.
        </dd>

        <dt>광고가 왜 보이나요?</dt>
        <dd>
          서비스를 지속하기 위해 제3자 광고가 표시될 수 있습니다. 맞춤 광고는 동의 여부에 따라 달라질 수 있으며, 자세한
          내용은 개인정보처리방침과 화면 하단 쿠키 안내를 참고하세요.
        </dd>

        <dt>사이트 소개·약관은 어디에 있나요?</dt>
        <dd>
          <RouterLink to="/about">사이트 소개</RouterLink>,
          <RouterLink to="/terms">이용약관</RouterLink>,
          <RouterLink to="/contact">문의하기</RouterLink>에서 확인할 수 있습니다.
        </dd>
      </dl>
    </div>
  </article>
</template>

<style scoped>
.faq-page {
  position: relative;
}
</style>
