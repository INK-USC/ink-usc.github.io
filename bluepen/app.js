'use strict';
const data = window.BLUEPEN_DATA;
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const robot = '<span class="role-icon" aria-hidden="true">🤖</span>';
const person = '<span class="role-icon" aria-hidden="true">👩🏻</span>';
function bubble(m, label) {
 if (m.content === '[END_OF_CONVERSATION]') return '<div class="margin-note"><span class="stop-pill">STOP</span> The interviewer ends the conversation.</div>';
 return `<div class="bubble ${m.role==='user'?'user':'assistant'}"><span class="speaker">${m.role==='user'?person:robot}${label || (m.role==='user'?'USER':'ASSISTANT')}</span>${esc(m.content)}</div>`;
}
const trainingUser = window.BLUEPEN_TRAINING_USER;
let stage = 0, tokenIndex = 0, playTimer = null;
const captions = ['Exercise prediction for User 566','Turn 7 in Conversation 1','Token probabilities for the music question','A training update for User 566’s conversation group'];
function chosen() {return data.examples[0];}
function setFocus(){tokenIndex=Math.max(0,chosen().tokens.findIndex(t=>t.token===chosen().focus));}
setFocus();
function stopPlaying(){clearInterval(playTimer);playTimer=null;$('#play-method').textContent='Play';$('#play-method').setAttribute('aria-pressed','false');}
function setStage(n){stage=Math.max(0,Math.min(3,n));renderMethod();}
function methodIntro(kicker,title,description){return `<div class="scene-kicker"><span class="status-dot"></span>${kicker}</div><h3>${title}</h3>${description?`<p class="scene-description">${description}</p>`:""}`;}

function trainingTranscript(c, excerpt=false) {
 let turn=0;
 const rows=[];
 for(let i=0;i<c.messages.length;i++) {
  const m=c.messages[i];
  if(m.content==='[END_OF_CONVERSATION]') {
   if(!excerpt)rows.push('<div class="training-stop"><span>'+robot+'BluePen</span><code>[END_OF_CONVERSATION]</code></div>');
   continue;
  }
  if(m.role!=='assistant')continue;
  turn++;
  if(excerpt&&(turn<6||turn>8))continue;
  const reply=c.messages[i+1];
  rows.push('<div class="training-exchange'+(c.sample===6388&&turn===7?' music-turn':'')+'"><span class="training-turn-label">Turn '+turn+'</span><div class="training-exchange-pair">'+bubble(m,'BLUEPEN')+(reply?.role==='user'?bubble(reply,'USER'):'')+'</div></div>');
 }
 return rows.join('');
}
function trainingConversations() {
 return '<div class="training-conversation-group"><div class="training-group-label">Conversation group <span>for User 566</span></div><div class="training-conversation-branch">'+trainingUser.conversations.map((c,i)=>'<article class="training-conversation-card"><header><div><h4>Conversation '+(i+1)+'</h4><span id="training-range-'+c.sample+'">'+(i===0?'Turns 6–8 of '+c.turns:c.turns+' turns')+'</span></div><button class="outline-button" data-expand-conversation="'+c.sample+'" aria-expanded="false" aria-controls="training-conversation-'+c.sample+'">Expand conversation</button></header><div class="training-conversation-content" id="training-conversation-'+c.sample+'"'+(i===0?'':' hidden')+'>'+ (i===0?trainingTranscript(c,true):'')+'</div></article>').join('')+'</div></div>';
}

function renderMethod(){
 $$('.step').forEach((b,i)=>{b.classList.toggle('active',i===stage);if(i===stage)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
 $('#prev-step').disabled=stage===0;$('#next-step').disabled=stage===3;
 $('#step-counter').textContent=`${stage+1} / 4`;$('#stage-caption').textContent=captions[stage];
 const e=chosen();let html='';
 if(stage===0){
 html=methodIntro('EXERCISE PREDICTION','Sample conversations','')+trainingConversations();
 }else if(stage===1){
 html=methodIntro('TURN 7 IN CONVERSATION 1','Generate question-level critiques','The same model reviews each question using the completed conversation and privileged user information. Its critique identifies missed information or repetition without revealing hidden user facts.')+`<div class="critique-layout"><div><div class="mini-label">${robot}QUESTION AT TURN ${e.turn}</div><div class="bubble assistant">${esc(e.question)}</div><div class="bubble user"><span class="speaker">${person}USER 566’S REPLY</span>${esc(e.history[13].content)}</div><p class="training-question-context">The user had already mentioned radio call-in programs in turns 1 and 4.</p><details class="context-details"><summary>What information can the self-critic use?</summary><p>The critic receives the completed conversation and privileged user information during training. Hidden user facts are not passed to the interviewer or self-teacher.</p></details><div class="micro">Same model with additional context</div></div><div class="critique-paper"><div class="micro">${robot}SELF-CRITIC</div><blockquote>“${esc(e.critique)}”</blockquote></div></div>`;
 }else if(stage===2){
 html=methodIntro('TURN 7 IN CONVERSATION 1','Self-distill the critiques','The student uses the conversation history; the self-teacher also receives the critique. Match their token distributions on the sampled question, holding teacher targets fixed. Select a token below.')+`<div class="token-sentence" aria-label="Select a token to inspect">${e.tokens.map((t,i)=>`<button class="token ${t.gap<-.3?'token-negative':t.gap>.3?'token-positive':''} ${i===tokenIndex?'active':''}" data-token="${i}" aria-pressed="${i===tokenIndex}" aria-label="Inspect token ${esc(t.token.trim())}">${esc(t.token)}</button>`).join('')}</div><div id="token-details"></div><details class="technical"><summary>How this becomes a training loss</summary><p>The same pre-update model evaluates each sampled question token with and without the critique. BluePen minimizes JSD to a stop-gradient self-teacher target, retaining its top 64 tokens and a tail bucket. Question losses are averaged; user replies and STOP tokens are masked.</p><p>Colors show the signed teacher-minus-student log-probability gap, not an attribution of the critique’s causal effect. Saved student and teacher decoding temperatures may differ.</p></details>`;
 }else{
 html=methodIntro('USER 566’S CONVERSATION GROUP','Combine both losses in one update','GRPO compares rewards within each user’s conversation group, using task performance and length penalties. Add question-token distillation, then update the model once.')+`<div class="training-group" aria-label="Available conversations for User 566">${trainingUser.conversations.map(c=>`<div><strong>Sample ${c.sample}</strong><span>${c.turns} question–answer turns</span><div class="training-turn-dots" aria-hidden="true">${Array.from({length:c.turns},(_,i)=>`<i class="${c.sample===6388&&i===6?'music-dot':''}"></i>`).join('')}</div><code>[END_OF_CONVERSATION]</code></div>`).join('')}</div><div class="loss-paths"><div class="loss grpo"><h4>GRPO</h4><p>Group-relative advantages<br>Question actions + STOP</p></div><div class="loss" id="critique-loss"><h4>Critique distillation</h4><p>Token-level feedback<br>Question tokens only</p></div></div><div class="equation" id="equation">L = L<sub>GRPO</sub> + λL<sub>critique</sub><small>Stop tokens are supervised by GRPO only.</small></div>`;
 }
 const panel=$('#method-stage');panel.innerHTML=html;panel.classList.remove('scene-enter');void panel.offsetWidth;panel.classList.add('scene-enter');
 $$('[data-token]').forEach(b=>b.addEventListener('click',()=>{stopPlaying();tokenIndex=Number(b.dataset.token);$$('[data-token]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});renderToken();}));
 $$('[data-expand-conversation]').forEach(button=>button.addEventListener('click',()=>{
  stopPlaying();
  const c=trainingUser.conversations.find(c=>c.sample===Number(button.dataset.expandConversation));
  const expanded=button.getAttribute('aria-expanded')!=='true';
  const primary=c.sample===trainingUser.conversations[0].sample;
  const content=$('#training-conversation-'+c.sample);
  button.setAttribute('aria-expanded',String(expanded));
  button.textContent=expanded?(primary?'Show turns 6–8':'Collapse conversation'):'Expand conversation';
  content.hidden=!primary&&!expanded;
  content.innerHTML=expanded?trainingTranscript(c):primary?trainingTranscript(c,true):'';
  $('#training-range-'+c.sample).textContent=primary&&!expanded?'Turns 6–8 of '+c.turns:c.turns+' turns';
 }));
 if(stage===2)renderToken();
}
function probRow(label,value,teacher=false){return `<div class="prob-row ${teacher?'teacher':''}"><span>${esc(label)}</span><div class="prob-track"><div class="prob-fill" style="width:${Math.max(0,Math.min(100,value*100))}%"></div></div><span>${value<.001?'<0.1':(value*100).toFixed(1)}%</span></div>`;}
function renderToken(){const t=chosen().tokens[tokenIndex];const available=Number.isFinite(t.teacher_prob);$('#token-details').innerHTML=`<div class="token-chart"><div><div class="mini-label">SAMPLED TOKEN: “${esc(t.token.trim())}”</div>${probRow('Student',t.student_prob||0)}${available?probRow('Self-teacher',t.teacher_prob,true):'<p class="micro">Teacher probability outside saved support.</p>'}<p class="micro">${available?`Teacher − student log probability: ${t.gap>=0?'+':''}${t.gap.toFixed(2)} nats`:'No exact gap displayed for censored values.'}</p></div><div class="teacher"><div class="mini-label">SELF-TEACHER’S LEADING ALTERNATIVES</div>${(t.top_candidates||[]).slice(0,3).map(c=>probRow(c.token.trim(),c.probability,true)).join('')}</div></div>`;}
$$('[data-step]').forEach(b=>b.addEventListener('click',()=>{stopPlaying();setStage(Number(b.dataset.step));}));
$('#prev-step').addEventListener('click',()=>{stopPlaying();setStage(stage-1);});$('#next-step').addEventListener('click',()=>{stopPlaying();setStage(stage+1);});
$('#play-method').addEventListener('click',()=>{if(playTimer){stopPlaying();return;}if(stage===3)setStage(0);$('#play-method').textContent='Ⅱ Pause';$('#play-method').setAttribute('aria-pressed','true');playTimer=setInterval(()=>{if(stage<3)setStage(stage+1);else stopPlaying();},5200);});
// Keyboard navigation for tab groups; the example tabs handle their own focus.
$$('[role=tablist]:not(#pair-tabs)').forEach(group=>group.addEventListener('keydown',ev=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(ev.key))return;const tabs=$$('[role=tab]',group),i=tabs.indexOf(document.activeElement);if(i<0)return;ev.preventDefault();const next=ev.key==='Home'?0:ev.key==='End'?tabs.length-1:(i+(ev.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[next].focus();tabs[next].click();}));
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopPlaying();});
renderMethod();
