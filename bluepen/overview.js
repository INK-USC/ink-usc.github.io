/* Animated overview adapted from the job-talk full-pipeline diagram. */
(() => {
  'use strict';
  const figure = document.querySelector('#pipeline');
  if (!figure) return;
  const play = figure.querySelector('#pipeline-play');
  const steps = [...figure.querySelectorAll('[data-pipeline-step]')];
  const parts = [...figure.querySelectorAll('[data-phase]')];
  const title = figure.querySelector('#pipeline-caption-title');
  const text = figure.querySelector('#pipeline-caption-text');
  const viewport = figure.querySelector('.pipeline-scroll');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const captions = [
    ['Sample conversations', 'The interviewer asks, follows up, and decides when to stop. A downstream evaluator scores each completed conversation.'],
    ['Generate question-level critiques', 'The self-reviewer sees a sampled question, its dialogue, and gold user context. It identifies what the question could have done better.'],
    ['Self-distill the critiques', 'The student sees the conversation prefix. The self-teacher also sees the critique. Aligning their distributions trains the student without rewriting the sampled question.'],
    ['Update the model', 'GRPO uses group-relative rewards, including supervision for stopping. The critique loss adds feedback on question tokens. Their weighted sum updates the interviewer.']
  ];
  let current = -1;
  let timer = null;
  let started = false;
  const duration = 4400;

  function pause() {
    clearTimeout(timer);
    timer = null;
    figure.classList.remove('is-playing');
    play.setAttribute('aria-pressed', 'false');
    play.textContent = current < 0 || current === 3 ? 'Replay' : 'Continue';
  }

  function select(index, pan = true) {
    current = index;
    figure.classList.toggle('has-focus', index >= 0);
    parts.forEach(part => part.classList.toggle('is-current', Number(part.dataset.phase) === index));
    steps.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    title.textContent = index < 0 ? 'Training objective' : captions[index][0];
    text.textContent = index < 0 ? 'Follow the gold path for conversation-level rewards and the teal path for question-level feedback.' : captions[index][1];
    if (pan && viewport.scrollWidth > viewport.clientWidth) {
      const centers = [186, 621, 621, 1040];
      const scale = viewport.querySelector('svg').getBoundingClientRect().width / 1200;
      viewport.scrollTo({ left: index < 0 ? 0 : centers[index] * scale - viewport.clientWidth / 2, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    }
  }

  function advance() {
    if (current === 3) {
      pause();
      select(-1);
      return;
    }
    select(current + 1);
    timer = setTimeout(advance, duration);
  }

  function start() {
    started = true;
    if (current < 0 || current === 3) select(0);
    figure.classList.add('is-playing');
    play.setAttribute('aria-pressed', 'true');
    play.textContent = 'Pause';
    timer = setTimeout(advance, duration);
  }

  play.addEventListener('click', () => timer ? pause() : start());
  steps.forEach((button, index) => button.addEventListener('click', () => {
    started = true;
    pause();
    select(index);
    play.textContent = index === 3 ? 'Replay' : 'Continue';
  }));
  const observer = new IntersectionObserver(entries => {
    const visible = entries[0].isIntersecting;
    if (visible && !started && !reducedMotion.matches && !document.hidden) start();
    if (!visible && timer) pause();
  }, { threshold: 0.25 });
  observer.observe(figure);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) pause(); });
})();
