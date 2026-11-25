/* Illustrative inference flow; not a recorded evaluation transcript. */
(() => {
  'use strict';
  const figure = document.querySelector('#evaluation-demo');
  if (!figure) return;
  const play = figure.querySelector('#evaluation-play');
  const steps = [...figure.querySelectorAll('[data-eval-step]')];
  const phases = [...figure.querySelectorAll('[data-eval-phase]')];
  const status = figure.querySelector('#evaluation-status');
  const descriptions = ['BluePen asks about genre.', 'BluePen follows up about setting.', 'BluePen emits [END_OF_CONVERSATION].', 'The completed conversation is passed to a frozen model to rank candidate books.'];
  let current = 0;
  let timer = null;
  function render() {
    phases.forEach(part => {
      const phase = Number(part.dataset.evalPhase);
      part.classList.toggle('is-current', phase === current);
      part.classList.toggle('is-reached', phase <= current);
    });
    steps.forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
    status.textContent = descriptions[current];
    play.textContent = timer ? 'Pause' : current === 3 ? 'Replay' : current === 0 ? 'Play' : 'Continue';
    play.setAttribute('aria-pressed', String(Boolean(timer)));
  }
  function pause() { clearInterval(timer); timer = null; render(); }
  steps.forEach((button, i) => button.addEventListener('click', () => { pause(); current = i; render(); }));
  play.addEventListener('click', () => {
    if (timer) { pause(); return; }
    if (current === 3) current = 0;
    timer = setInterval(() => { current++; if (current === 3) pause(); else render(); }, 2100);
    render();
  });
  new IntersectionObserver(entries => { if (!entries[0].isIntersecting) pause(); }, { threshold: .1 }).observe(figure);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  render();
})();
