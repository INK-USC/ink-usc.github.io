(() => {
  const pairs = window.BLUEPEN_PAIRS;
  const tabs = document.getElementById('pair-tabs');
  const panel = document.getElementById('pair-panel');
  if (!pairs || !tabs || !panel) return;
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const number = value => Number(value.toFixed(1)).toString();
  const quality = {
    turns: {label:'Fewer turns', unit:'turns', format: number},
    tokens: {label:'Shorter questions', unit:'tokens per question', format: number},
    words: {label:'Shorter questions', unit:'words per question', format: number},
    bundling: {label:'Less question bundling', unit:'turns with multiple requests', format: n => `${number(n * 100)}%`}
  };
  let selected = 0;
  let expanded = false;
  tabs.innerHTML = pairs.map((pair, i) => `<button type="button" id="tab-${pair.key}" role="tab" aria-controls="pair-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-pair="${i}"><span>${escape(pair.datasetLabel)}</span><strong>${escape(pair.title)}</strong></button>`).join('');

  function conversation(pair, name) {
    const model = pair[name];
    const label = name === 'grpo' ? 'GRPO' : 'BluePen';
    return `<article class="pair-conversation ${name}"><header><h4>${label}</h4><span>${model.turns.length} turns</span></header><div class="pair-transcript" tabindex="0" role="region" aria-label="${label} conversation">${model.turns.map((turn, i) => `<div class="pair-turn ${pair.focus[name].includes(i + 1) ? 'pair-turn-focus' : ''}"><div class="pair-turn-label">Turn ${i + 1}</div><p class="pair-question"><span class="pair-speaker"><span class="role-icon" aria-hidden="true">🤖</span>${label}</span>${escape(turn.question)}</p><p class="pair-answer"><span class="pair-speaker"><span class="role-icon" aria-hidden="true">👩🏻</span>User</span>${escape(turn.answer)}</p></div>`).join('')}<p class="pair-stop">[END_OF_CONVERSATION]</p></div></article>`;
  }

  function render() {
    const pair = pairs[selected];
    tabs.querySelectorAll('[role=tab]').forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === selected));
      tab.tabIndex = i === selected ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', `tab-${pair.key}`);
    panel.classList.toggle('pair-expanded', expanded);
    const gain = (pair.bluepen.score - pair.grpo.score) * 100;
    panel.innerHTML = `<div class="pair-heading"><h3>${escape(pair.title)}</h3><span>${escape(pair.datasetLabel)}</span></div>
      <div class="pair-outcomes"><div class="pair-performance"><div class="pair-score-title"><h4>${escape(pair.metricLabel)}</h4><strong>+${number(gain)} <span>points</span></strong></div>
      ${['grpo','bluepen'].map(name => `<div class="pair-score-row"><span>${name === 'grpo' ? 'GRPO' : 'BluePen'}</span><div class="pair-score-track"><span class="${name}" style="width:${pair[name].score * 100}%"></span></div><b>${number(pair[name].score * 100)}</b></div>`).join('')}<p>${escape(pair.metricNote)}</p></div>
      <div class="pair-quality"><div class="pair-quality-heading"><h4>Improved conversation quality</h4><span>GRPO → BluePen</span></div><div class="pair-quality-cards">${pair.qualityKeys.map(key => { const metric = quality[key]; return `<div class="pair-quality-card"><h5>${metric.label}</h5><div><span>${metric.format(pair.grpo.quality[key])}</span><span class="pair-value-arrow" aria-hidden="true">→</span><strong>${metric.format(pair.bluepen.quality[key])}</strong></div><p>${metric.unit}</p></div>`; }).join('')}</div></div></div>
      <div class="pair-conversations">${conversation(pair, 'grpo')}${conversation(pair, 'bluepen')}</div>
      <div class="pair-controls"><button type="button" class="outline-button" id="expand-pair" aria-expanded="${expanded}">${expanded ? 'Collapse conversations −' : 'Expand conversations +'}</button></div>`;
    document.getElementById('expand-pair').addEventListener('click', event => {
      expanded = !expanded;
      panel.classList.toggle('pair-expanded', expanded);
      event.currentTarget.setAttribute('aria-expanded', String(expanded));
      event.currentTarget.textContent = expanded ? 'Collapse conversations −' : 'Expand conversations +';
    });
  }
  tabs.addEventListener('click', event => {
    const tab = event.target.closest('[data-pair]');
    if (!tab) return;
    selected = Number(tab.dataset.pair);
    expanded = false;
    render();
  });
  tabs.addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? pairs.length - 1 : (selected + (event.key === 'ArrowRight' ? 1 : -1) + pairs.length) % pairs.length;
    tabs.querySelector(`[data-pair="${next}"]`).focus();
    tabs.querySelector(`[data-pair="${next}"]`).click();
  });
  render();
})();
