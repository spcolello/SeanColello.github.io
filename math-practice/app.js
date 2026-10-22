import { OPERATIONS, generateQuestion, generateSimilarQuestion, accuracy, symbolFor } from './math.js';

const KEY='mathPracticeDataV1';
const DEFAULT_SETTINGS={soundEffectsEnabled:true,cardAnimationEnabled:true,showExplanations:true,defaultSessionLength:10,defaultDifficulty:'beginner',defaultOperations:[...OPERATIONS],masteryThreshold:3};
const empty=()=>({totalAttempted:0,totalCorrect:0,totalIncorrect:0,mistakes:[],history:[],reviewAttempted:0,reviewCorrect:0,byOperation:Object.fromEntries(OPERATIONS.map(x=>[x,{attempted:0,correct:0}])),settings:structuredClone(DEFAULT_SETTINGS)});
const el=s=>document.querySelector(s);
const app=el('#app');
let data=load(),setup=fromDefaults(),session=null,lastSummary=null,answerKeyHandler=null,mistakeTab='active';

function load(){try{const x=JSON.parse(localStorage.getItem(KEY));if(!x)return empty();const b=empty();return {...b,...x,byOperation:{...b.byOperation,...(x.byOperation||{})},settings:{...DEFAULT_SETTINGS,...(x.settings||{})},mistakes:Array.isArray(x.mistakes)?x.mistakes:[],history:Array.isArray(x.history)?x.history:[]};}catch{return empty();}}
function save(){localStorage.setItem(KEY,JSON.stringify(data));badge();}
function fromDefaults(){return {operations:[...(data.settings.defaultOperations?.length?data.settings.defaultOperations:OPERATIONS)],difficulty:data.settings.defaultDifficulty||'beginner',length:data.settings.defaultSessionLength??10};}
function announce(t){const r=el('#liveRegion');if(r){r.textContent='';setTimeout(()=>r.textContent=t,10);}}
function badge(){const b=el('#mistakeBadge');if(!b)return;const n=data.mistakes.filter(m=>!m.mastered).length;b.textContent=n;b.hidden=n===0;}
function tpl(id){if(answerKeyHandler){document.removeEventListener('keydown',answerKeyHandler);answerKeyHandler=null;}app.replaceChildren(el(id).content.cloneNode(true));scrollTo(0,0);app.focus({preventScroll:true});}
function active(route){document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===('#/'+(route==='practice'||route==='summary'?'home':route))));}
function route(){data=load();const raw=location.hash.replace('#/','')||'home',r=raw.startsWith('similar/')?'similar':raw;if(r==='home')home();else if(r==='practice')session?practice():location.hash='#/home';else if(r==='summary')lastSummary?summary():location.hash='#/home';else if(r==='mistakes')mistakes();else if(r==='stats')stats();else if(r==='settings')settings();else if(r==='similar')similar(raw.split('/')[1]);else location.hash='#/home';active(r==='similar'?'mistakes':r);badge();}

function home(){
  setup=fromDefaults();tpl('#homeTemplate');
  document.querySelectorAll('[data-op]').forEach(b=>{b.classList.toggle('active',setup.operations.includes(b.dataset.op));b.setAttribute('aria-pressed',setup.operations.includes(b.dataset.op));b.onclick=()=>{const o=b.dataset.op;setup.operations=setup.operations.includes(o)?setup.operations.filter(x=>x!==o):[...setup.operations,o];b.classList.toggle('active',setup.operations.includes(o));b.setAttribute('aria-pressed',setup.operations.includes(o));el('#setupError').hidden=setup.operations.length>0;};});
  el('#selectAllOps').onclick=()=>{setup.operations=[...OPERATIONS];document.querySelectorAll('[data-op]').forEach(b=>{b.classList.add('active');b.setAttribute('aria-pressed','true');});el('#setupError').hidden=true;};
  document.querySelectorAll('[data-difficulty]').forEach(b=>{const on=b.dataset.difficulty===setup.difficulty;b.classList.toggle('active',on);b.setAttribute('aria-checked',on);b.onclick=()=>{setup.difficulty=b.dataset.difficulty;document.querySelectorAll('[data-difficulty]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-checked',x===b);});};});
  document.querySelectorAll('[data-length]').forEach(b=>{const v=b.dataset.length==='continuous'?'continuous':Number(b.dataset.length),on=v===setup.length;b.classList.toggle('active',on);b.setAttribute('aria-checked',on);b.onclick=()=>{setup.length=v;document.querySelectorAll('[data-length]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-checked',x===b);});};});
  el('#startSession').onclick=()=>{if(!setup.operations.length){el('#setupError').hidden=false;return;}start(setup);};
}
function makeQ(c){return generateQuestion(c.operations[Math.floor(Math.random()*c.operations.length)],c.difficulty);}
function start(c,qs=null,review=false){session={config:structuredClone(c),questions:qs||[],index:0,correct:0,incorrect:0,results:[],answered:false,review};if(!qs){const n=c.length==='continuous'?1:c.length;session.questions=Array.from({length:n},()=>makeQ(c));}location.hash='#/practice';}

function practice(){
  tpl('#practiceTemplate');const q=session.questions[session.index],continuous=session.config.length==='continuous',count=session.index+1,total=continuous?'∞':session.questions.length;
  el('#progressText').textContent=`Question ${count} of ${total}`;el('#sessionScore').textContent=`${session.correct} correct`;
  const pct=continuous?0:(session.index/session.questions.length)*100;el('#progressBar').style.width=pct+'%';el('#progressTrack').setAttribute('aria-valuenow',String(Math.round(pct)));
  el('#questionOperation').textContent=`${q.operation} • ${q.difficulty}`;el('#questionText').textContent=`${q.text} = ?`;
  if(data.settings.cardAnimationEnabled&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.querySelector('.question-card').classList.add('animated');
  q.choices.forEach((v,i)=>{const b=document.createElement('button');b.type='button';b.className='answer-button';b.textContent=`${i+1}. ${v}`;b.setAttribute('aria-label',`Choice ${i+1}: ${v}`);b.dataset.value=v;b.onclick=()=>answer(v,b);el('#answers').appendChild(b);});
  answerKeyHandler=e=>{if(session?.answered||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)||document.activeElement?.isContentEditable)return;if(['1','2','3','4'].includes(e.key)){const b=document.querySelectorAll('.answer-button')[Number(e.key)-1];if(b){e.preventDefault();b.click();}}};document.addEventListener('keydown',answerKeyHandler);
  el('#revealAnswer').onclick=reveal;el('#markCorrect').onclick=()=>report(true);el('#markIncorrect').onclick=()=>report(false);el('#nextQuestion').onclick=next;
  el('#endContinuous').hidden=!continuous;el('#endContinuous').onclick=()=>{if(session.results.length===0)return alert('Answer at least one question first.');if(confirm('End this continuous practice session?'))finish();};
  el('#quitSession').onclick=()=>{if(confirm('Quit this practice session? Your unfinished session will not be counted.')){session=null;location.hash='#/home';}};
  announce(`Question ${count}: ${q.text}`);
}
function disable(q,chosen=null){document.querySelectorAll('.answer-button').forEach(b=>{b.disabled=true;const v=Number(b.dataset.value);if(v===q.answer)b.classList.add('correct');if(chosen!==null&&v===chosen&&v!==q.answer)b.classList.add('incorrect');});}
function feedback(ok,q){const f=el('#feedback');f.hidden=false;f.className='feedback '+(ok?'correct':'incorrect');f.textContent=ok?'✓ Correct! Keep going.':`✗ Not quite. The correct answer is ${q.answer}.`;if(data.settings.showExplanations){const x=el('#explanation');x.hidden=false;x.textContent=explain(q);}tone(ok);announce(f.textContent);}
function explain(q){const s=symbolFor(q.operation);if(q.operation==='division')return `${q.answer} × ${q.b} = ${q.a}, so ${q.a} ÷ ${q.b} = ${q.answer}.`;return `${q.a} ${s} ${q.b} = ${q.answer}.`;}
function tone(ok){if(!data.settings.soundEffectsEnabled)return;try{const C=window.AudioContext||window.webkitAudioContext,c=new C(),o=c.createOscillator(),g=c.createGain();o.frequency.value=ok?660:220;g.gain.setValueAtTime(.05,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.15);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.15);}catch{}}
function answer(v,b){if(session.answered)return;const q=session.questions[session.index],ok=Number(v)===q.answer;session.answered=true;disable(q,Number(v));feedback(ok,q);record(ok,Number(v),false);el('#revealAnswer').hidden=true;el('#nextQuestion').hidden=false;}
function reveal(){if(session.answered)return;const q=session.questions[session.index];disable(q);el('#feedback').hidden=false;el('#feedback').className='feedback correct';el('#feedback').textContent=`The answer is ${q.answer}.`;if(data.settings.showExplanations){el('#explanation').hidden=false;el('#explanation').textContent=explain(q);}el('#revealAnswer').hidden=true;el('#selfReport').hidden=false;announce(`The correct answer is ${q.answer}. Tell us how you did.`);}
function report(ok){if(session.answered)return;session.answered=true;record(ok,null,true);feedback(ok,session.questions[session.index]);el('#selfReport').hidden=true;el('#nextQuestion').hidden=false;}
function record(ok,selected,revealed){if(ok)session.correct++;else session.incorrect++;session.results.push({question:session.questions[session.index],isCorrect:ok,selectedAnswer:selected,revealed});}
function next(){if(!session.answered)return;if(session.config.length==='continuous'){session.questions.push(makeQ(session.config));session.index++;session.answered=false;practice();return;}if(session.index<session.questions.length-1){session.index++;session.answered=false;practice();}else finish();}

function key(q){return `${q.operation}|${q.a}|${q.b}|${q.answer}`;}
function addMistake(r){
  const q=r.question,k=key(q),m=data.mistakes.find(x=>x.key===k);
  if(m){m.incorrectCount=(m.incorrectCount||1)+1;m.similarCorrectCount=0;m.mastered=false;m.lastIncorrectAt=new Date().toISOString();m.selectedAnswer=r.selectedAnswer;return;}
  data.mistakes.unshift({id:'m-'+Date.now()+'-'+Math.random().toString(36).slice(2),key:k,operation:q.operation,difficulty:q.difficulty,a:q.a,b:q.b,answer:q.answer,text:q.text,selectedAnswer:r.selectedAnswer,incorrectCount:1,similarCorrectCount:0,mastered:false,lastIncorrectAt:new Date().toISOString(),createdAt:new Date().toISOString()});
}
function reviewProgress(r){
  if(!session.review)return;data.reviewAttempted++;if(r.isCorrect)data.reviewCorrect++;
  const source=session.reviewSource,pattern=data.mistakes.find(x=>x.id===source?.id);if(!pattern)return;
  if(r.isCorrect){pattern.similarCorrectCount=(pattern.similarCorrectCount||0)+1;if(pattern.similarCorrectCount>=data.settings.masteryThreshold)pattern.mastered=true;}else{pattern.similarCorrectCount=0;pattern.incorrectCount=(pattern.incorrectCount||1)+1;pattern.mastered=false;pattern.lastIncorrectAt=new Date().toISOString();}
}
function finish(){
  const attempted=session.results.length;data.totalAttempted+=attempted;data.totalCorrect+=session.correct;data.totalIncorrect+=session.incorrect;
  session.results.forEach(r=>{const o=data.byOperation[r.question.operation]||{attempted:0,correct:0};o.attempted++;if(r.isCorrect)o.correct++;data.byOperation[r.question.operation]=o;if(!r.isCorrect&&!session.review)addMistake(r);reviewProgress(r);});
  data.mistakes=data.mistakes.slice(0,100);data.history.unshift({id:'s-'+Date.now(),date:new Date().toISOString(),attempted,correct:session.correct,incorrect:session.incorrect,accuracy:accuracy(session.correct,attempted),operations:[...new Set(session.questions.slice(0,attempted).map(q=>q.operation))],difficulty:session.config.difficulty,length:session.config.length,review:session.review});data.history=data.history.slice(0,30);save();
  lastSummary={attempted,correct:session.correct,incorrect:session.incorrect,accuracy:accuracy(session.correct,attempted),config:structuredClone(session.config),review:session.review};session=null;location.hash='#/summary';
}
function summary(){
  tpl('#summaryTemplate');el('#summaryAccuracy').textContent=lastSummary.accuracy+'%';el('#summaryCorrect').textContent=lastSummary.correct;el('#summaryIncorrect').textContent=lastSummary.incorrect;el('#summarySubtitle').textContent=`You answered ${lastSummary.correct} of ${lastSummary.attempted} questions correctly.`;el('#summaryTitle').textContent=lastSummary.accuracy>=90?'Excellent work!':lastSummary.accuracy>=70?'Nice work!':'Keep practicing!';el('#summaryDetails').textContent=`${lastSummary.review?'Mistake review':'Regular practice'} • ${lastSummary.config.difficulty} • ${lastSummary.config.length==='continuous'?'continuous':lastSummary.config.length+' questions'}`;el('#practiceAgain').onclick=()=>start(lastSummary.config,null,lastSummary.review);
}
function mistakes(){
  tpl('#mistakesTemplate');document.querySelectorAll('[data-mistake-tab]').forEach(b=>{b.classList.toggle('active',b.dataset.mistakeTab===mistakeTab);b.onclick=()=>{mistakeTab=b.dataset.mistakeTab;mistakes();};});const list=el('#mistakesList'),items=data.mistakes.filter(m=>Boolean(m.mastered)===(mistakeTab==='mastered')).sort((a,b)=>(b.incorrectCount||1)-(a.incorrectCount||1));
  if(!items.length){list.innerHTML=`<div class="empty-state"><strong>No ${mistakeTab} mistakes</strong>${mistakeTab==='active'?'Missed questions will appear here after practice.':'Mastered patterns will appear here after enough correct similar answers.'}</div>`;return;}
  items.forEach(m=>{const c=document.createElement('article');c.className='mistake-card';c.innerHTML=`<div><p class="eyebrow">${m.operation} • ${m.difficulty}</p><h3>${m.text} = ${m.answer}</h3><p>Missed ${m.incorrectCount||1} time(s) • Mastery ${m.similarCorrectCount||0}/${data.settings.masteryThreshold}</p></div><div class="mistake-actions"><button type="button" class="primary-button similar">Practice similar</button><button type="button" class="secondary-button remove">Remove</button></div>`;c.querySelector('.similar').onclick=()=>location.hash='#/similar/'+encodeURIComponent(m.id);c.querySelector('.remove').onclick=()=>{data.mistakes=data.mistakes.filter(x=>x.id!==m.id);save();mistakes();};list.append(c);});
}
function similar(id){const m=data.mistakes.find(x=>x.id===decodeURIComponent(id||''));if(!m){location.hash='#/mistakes';return;}const c={operations:[m.operation],difficulty:m.difficulty,length:5},qs=Array.from({length:5},()=>generateSimilarQuestion(m));start(c,qs,true);session.reviewSource=m;}

function stats(){
  tpl('#statsTemplate');[['Total attempted',data.totalAttempted],['Correct',data.totalCorrect],['Incorrect',data.totalIncorrect],['Overall accuracy',accuracy(data.totalCorrect,data.totalAttempted)+'%']].forEach(([l,v])=>{const c=document.createElement('div');c.className='stat-card';c.innerHTML=`<strong>${v}</strong><span>${l}</span>`;el('#statsCards').append(c);});
  OPERATIONS.forEach(o=>{const s=data.byOperation[o]||{attempted:0,correct:0},p=accuracy(s.correct,s.attempted),r=document.createElement('div');r.innerHTML=`<div class="bar-label"><span>${symbolFor(o)} ${o[0].toUpperCase()+o.slice(1)}</span><span>${s.correct}/${s.attempted} • ${p}%</span></div><div class="bar-track"><div class="bar-fill" style="width:${p}%"></div></div>`;el('#operationStats').append(r);});
  const activeN=data.mistakes.filter(m=>!m.mastered).length,masteredN=data.mistakes.filter(m=>m.mastered).length,opCounts={};data.mistakes.forEach(m=>opCounts[m.operation]=(opCounts[m.operation]||0)+(m.incorrectCount||1));const most=Object.entries(opCounts).sort((a,b)=>b[1]-a[1])[0]?.[0]||'None yet',top=[...data.mistakes].sort((a,b)=>(b.incorrectCount||1)-(a.incorrectCount||1)).slice(0,5);el('#mistakeInsights').innerHTML=`<p><strong>${activeN}</strong> active patterns • <strong>${masteredN}</strong> mastered • <strong>${data.reviewAttempted||0}</strong> similar questions practiced • <strong>${data.reviewCorrect||0}</strong> correct</p><p>Most missed operation: <strong>${most}</strong></p>${top.length?'<div class="fact-list">'+top.map(m=>`<span>${m.text} = ${m.answer} <small>×${m.incorrectCount||1}</small></span>`).join('')+'</div>':'<p>No saved mistakes yet.</p>'}`;
  const h=el('#historyList');if(!data.history.length)h.innerHTML='<div class="empty-state"><strong>No sessions yet</strong>Complete a practice session to start your history.</div>';else data.history.forEach(i=>{const r=document.createElement('div');r.className='history-item';r.innerHTML=`<div><p><strong>${i.review?'Mistake review':i.operations.join(', ')}</strong></p><small>${new Date(i.date).toLocaleString()} • ${i.difficulty} • ${i.attempted} questions</small></div><div class="history-score">${i.accuracy}%</div>`;h.append(r);});
}
function settings(){
  tpl('#settingsTemplate');const s=data.settings;el('#soundEffectsSetting').checked=s.soundEffectsEnabled;el('#animationSetting').checked=s.cardAnimationEnabled;el('#explanationsSetting').checked=s.showExplanations;el('#defaultDifficulty').value=s.defaultDifficulty;el('#defaultLength').value=String(s.defaultSessionLength);el('#masteryThreshold').value=s.masteryThreshold;
  document.querySelectorAll('[data-default-op]').forEach(c=>{c.checked=s.defaultOperations.includes(c.dataset.defaultOp);c.onchange=()=>{const ops=[...document.querySelectorAll('[data-default-op]:checked')].map(x=>x.dataset.defaultOp);if(!ops.length){c.checked=true;return alert('Keep at least one default operation selected.');}data.settings.defaultOperations=ops;save();};});
  [['#soundEffectsSetting','soundEffectsEnabled'],['#animationSetting','cardAnimationEnabled'],['#explanationsSetting','showExplanations']].forEach(([id,k])=>el(id).onchange=e=>{data.settings[k]=e.target.checked;save();});
  el('#defaultDifficulty').onchange=e=>{data.settings.defaultDifficulty=e.target.value;save();};el('#defaultLength').onchange=e=>{data.settings.defaultSessionLength=e.target.value==='continuous'?'continuous':Number(e.target.value);save();};el('#masteryThreshold').onchange=e=>{data.settings.masteryThreshold=Math.min(10,Math.max(1,Number(e.target.value)||3));e.target.value=data.settings.masteryThreshold;save();};
  el('#clearAllData').onclick=()=>{if(confirm('Clear ALL Math Practice data? This cannot be undone.')){data=empty();save();setup=fromDefaults();location.hash='#/home';}};
}

window.addEventListener('hashchange',route);window.addEventListener('storage',()=>{data=load();badge();});route();
