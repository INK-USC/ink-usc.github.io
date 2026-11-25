/* Table 1 and the exact data behind the paper's stopping-criteria figure. */
(() => {
  'use strict';
  const {rows,curves}=window.BLUEPEN_RESULTS;
  const baselineRows=rows.filter(r=>!['method','oracle'].includes(r.id));
  const bestBaseline=Array.from({length:6},(_,i)=>(i%2?Math.min:Math.max)(...baselineRows.map(r=>r.cells[i][0])));
  const best=Array.from({length:6},(_,i)=>(i%2?Math.min:Math.max)(...rows.filter(r=>r.id!=='oracle').map(r=>r.cells[i][0])));
  const table=document.querySelector('#main-results-body');
  table.innerHTML=rows.map(r=>{
    const rowClass=[r.id==='method'?'bluepen-result':'',r.id==='oracle'?'oracle-result':'',['sft','method','oracle'].includes(r.id)?'result-divider':''].join(' ');
    const name=r.description?`<button class="baseline-name" data-baseline="${r.id}" aria-expanded="false" aria-controls="baseline-${r.id}">${r.label}<span aria-hidden="true">+</span></button>`:r.label;
    const cells=r.cells.map((cell,i)=>{
      if(!cell)return '<td class="result-na">N/A</td>';
      const improves=r.id==='method'&&(i%2?cell[0]<bestBaseline[i]:cell[0]>bestBaseline[i]);
      const isBest=r.id!=='oracle'&&cell[0]===best[i];
      const isBaseline=r.id!=='method'&&r.id!=='oracle'&&cell[0]===bestBaseline[i];
      return `<td class="${improves?'result-improved':''} ${i%2===0?'score-column':''}"><span class="result-estimate ${isBest?'best-value':''} ${isBaseline?'best-baseline':''}">${cell[0].toFixed(2)}</span>${r.id==='method'&&i%2===0?'<sup aria-label="statistically significant">*</sup>':''}<span class="result-sd"> ± ${cell[1].toFixed(2)}</span></td>`;
    }).join('');
    return `<tr class="${rowClass}"><th scope="row">${name}</th>${cells}</tr>${r.description?`<tr class="baseline-detail" id="baseline-${r.id}" hidden><td colspan="7"><div><strong>${r.label}.</strong> ${r.description}</div></td></tr>`:''}`;
  }).join('');
  table.querySelectorAll('[data-baseline]').forEach(button=>button.addEventListener('click',()=>{
    const open=button.getAttribute('aria-expanded')!=='true';
    table.querySelectorAll('[data-baseline]').forEach(other=>{
      const expanded=other===button&&open;
      other.setAttribute('aria-expanded',String(expanded));
      other.querySelector('span').textContent=expanded?'−':'+';
      document.querySelector('#baseline-'+other.dataset.baseline).hidden=!expanded;
    });
  }));
  const colors={zero_shot:'#808080',GRPO:'#E69F00',BluePen:'#0072B2'};
  const names={zero_shot:'Zero-shot',GRPO:'GRPO',BluePen:'BluePen'};
  const x=t=>48+(t+2)*59;
  const y=v=>235-(v+12.5)/30.5*200;
  function marker(method,cx,cy,label){
    const title=`<title>${label}</title>`;
    if(method==='zero_shot')return `<rect x="${cx-4}" y="${cy-4}" width="8" height="8">${title}</rect>`;
    if(method==='GRPO')return `<path d="M${cx} ${cy-5}l5 9h-10Z">${title}</path>`;
    return `<circle cx="${cx}" cy="${cy}" r="4.5">${title}</circle>`;
  }
  document.querySelector('#stopping-curves').innerHTML=curves.map(panel=>{
    let svg=`<svg viewBox="0 0 320 290" role="img" aria-labelledby="curve-title-${panel.dataset} curve-desc-${panel.dataset}"><title id="curve-title-${panel.dataset}">${panel.title}: change in downstream personalization relative to Q (%)</title><desc id="curve-desc-${panel.dataset}">Zero-shot, GRPO, and BluePen at two turns before stopping, one turn before, the voluntary stop, and one and two forced additional turns. The y-axis shows the percentage change in downstream personalization relative to each model’s score at its voluntary stop, Q.</desc><rect x="${x(0)}" y="35" width="136" height="200" fill="#f1f4f8"/>`;
    [-8,0,8,16].forEach(t=>{svg+=`<line x1="36" y1="${y(t)}" x2="302" y2="${y(t)}" stroke="${t===0?'#a3a9ad':'#e5e7e9'}"/><text x="29" y="${y(t)+4}" text-anchor="end">${t}%</text>`;});
    svg+=`<path d="M36 35V235H302" fill="none" stroke="#838b8f"/><line x1="${x(0)}" y1="35" x2="${x(0)}" y2="235" stroke="#9ca7ae" stroke-dasharray="3 3"/>`;
    [-2,-1,0,1,2].forEach(t=>{svg+=`<line x1="${x(t)}" y1="235" x2="${x(t)}" y2="241" stroke="#838b8f"/><text x="${x(t)}" y="259" text-anchor="middle">${t<0?'Q−'+Math.abs(t):t>0?'Q+'+t:'Q'}</text>`;});
    for(const method of ['zero_shot','GRPO','BluePen']){
      const points=panel.points.filter(p=>p.method===method).sort((a,b)=>a.offset-b.offset);
      svg+=`<g fill="${colors[method]}" stroke="white" stroke-width="1"><polyline points="${points.map(p=>`${x(p.offset)},${y(p.percent_change)}`).join(' ')}" fill="none" stroke="${colors[method]}" stroke-width="2.6"/>`;
      for(const p of points)svg+=marker(method,x(p.offset),y(p.percent_change),`${names[method]}, ${p.offset===0?'Q':p.offset>0?'Q+'+p.offset:'Q'+p.offset}: ${p.percent_change.toFixed(2)}%`);
      svg+='</g>';
    }
    svg+=`<text x="234" y="214" text-anchor="middle" class="forced-label">Forced continuation</text></svg>`;
    return `<div class="stopping-chart"><h4>${panel.title}</h4>${svg}</div>`;
  }).join('');
})();
