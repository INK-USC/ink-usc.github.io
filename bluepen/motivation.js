/* All four poster turns remain visible; progress accumulates information and effort. */
(() => {
  'use strict';
  const root = document.querySelector('.motivation-demo');
  if (!root) return;
  const cards = [...root.querySelectorAll('[data-turn-card]')];
  const buttons = [...root.querySelectorAll('[data-motivation-turn]')];
  const play = root.querySelector('#motivation-play');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let running = false;
  let started = false;
  let timer = null;

  const graphPoints = [[32, 130], [120, 88], [220, 46], [320, 46], [420, 46]];
  const graphDistances = [0];
  for (let i = 1; i < graphPoints.length; i++) {
    graphDistances.push(graphDistances[i - 1] + Math.hypot(
      graphPoints[i][0] - graphPoints[i - 1][0],
      graphPoints[i][1] - graphPoints[i - 1][1]
    ));
  }

  function render() {
    cards.forEach((card, i) => {
      card.classList.toggle('is-current', i === current);
      card.classList.toggle('is-future', i > current);
      card.querySelector('.motivation-turn-gain').setAttribute('aria-hidden', String(i > current));
      buttons[i].setAttribute('aria-pressed', String(i === current));
    });
    [['genre', 'Fantasy'], ['setting', 'Medieval worlds']].forEach(([key, value], i) => {
      const fact = root.querySelector(`[data-fact="${key}"]`);
      const known = i <= current;
      const wasUnknown = fact.classList.contains('is-unknown');
      fact.classList.toggle('is-unknown', !known);
      fact.classList.remove('is-new');
      fact.querySelector('strong').textContent = known ? value : '—';
      if (known && wasUnknown) fact.classList.add('is-new');
    });
    root.querySelector('#motivation-count').textContent = current + 1;
    root.querySelector('#motivation-count-unit').textContent = current === 0 ? 'interaction' : 'interactions';
    const [graphX, graphY] = graphPoints[current + 1];
    root.querySelector('.motivation-graph-line').style.strokeDashoffset =
      1 - graphDistances[current + 1] / graphDistances[4];
    root.querySelector('.motivation-graph-cursor').style.transform = `translate(${graphX}px, ${graphY}px)`;
    root.querySelector('.motivation-graph').classList.toggle('is-plateau', current >= 2);
    root.querySelectorAll('.motivation-graph-points circle').forEach((point, i) => {
      point.classList.toggle('is-reached', i <= current);
    });
    play.setAttribute('aria-pressed', String(running));
    play.textContent = running ? 'Pause' : current === 3 ? 'Replay' : started ? 'Continue' : 'Play';
    const gain = current === 0 ? 'Genre learned.' : current === 1 ? 'Setting learned.' : 'No new information.';
    root.querySelector('#motivation-status').textContent = `Turn ${current + 1}. ${gain} ${current + 1} ${current === 0 ? 'interaction' : 'interactions'}.`;
  }

  function pause() {
    clearTimeout(timer);
    timer = null;
    running = false;
    render();
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (current === 3) { pause(); return; }
      current += 1;
      render();
      schedule();
    }, 2900);
  }

  function start() {
    if (!started || current === 3) current = 0;
    started = true;
    running = true;
    render();
    schedule();
  }

  buttons.forEach((button, index) => button.addEventListener('click', () => {
    clearTimeout(timer);
    timer = null;
    started = true;
    running = false;
    current = index;
    render();
  }));
  play.addEventListener('click', () => running ? pause() : start());
  new IntersectionObserver(entries => {
    const visible = entries[0].isIntersecting;
    // On small screens, keep all turns readable without starting playback off-screen.
    if (visible && !started && !reducedMotion.matches && !document.hidden && window.innerWidth > 760) start();
    else if (!visible && running) pause();
  }, {threshold:0.15}).observe(root);
  document.addEventListener('visibilitychange', () => { if (document.hidden && running) pause(); });
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) pause(); });
  render();
})();
