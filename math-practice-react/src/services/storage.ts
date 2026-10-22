import type {ActivePracticeSnapshot,AppSettings,MistakePattern,PracticeAttempt,PracticeSession} from '../types';
const K={settings:'mathPractice.settings',sessions:'mathPractice.sessions',attempts:'mathPractice.attempts',mistakes:'mathPractice.mistakes',active:'mathPractice.activeSession',archive:'mathPractice.archive'};
export const DEFAULT_SETTINGS:AppSettings={soundEffectsEnabled:true,cardAnimationEnabled:true,showExplanations:true,feedbackMessagesEnabled:true,defaultSessionLength:10,defaultDifficulty:2,defaultOperations:['addition','subtraction','multiplication','division'],masteryThreshold:3};
const WARNING='mathPractice.storageRecoveryWarning';
function markRecovery(key:string){try{const prior=sessionStorage.getItem(WARNING);const list=prior?prior.split(','):[];if(!list.includes(key))list.push(key);sessionStorage.setItem(WARNING,list.join(','));}catch{return;}}
function read<T>(key:string,fallback:T,valid:(x:unknown)=>boolean=()=>true):T{try{const raw=localStorage.getItem(key);if(!raw)return fallback;const x=JSON.parse(raw);if(!valid(x)){localStorage.removeItem(key);markRecovery(key);return fallback;}return x as T;}catch{localStorage.removeItem(key);markRecovery(key);return fallback;}}
function write(key:string,v:unknown){try{localStorage.setItem(key,JSON.stringify(v));return true;}catch{return false;}}
export const loadSettings=()=>read<AppSettings>(K.settings,DEFAULT_SETTINGS,x=>!!x&&typeof x==='object');
export const saveSettings=(x:AppSettings)=>write(K.settings,x);
export const loadSessions=()=>read<PracticeSession[]>(K.sessions,[],Array.isArray);
export const saveSession=(s:PracticeSession)=>write(K.sessions,[s,...loadSessions()].slice(0,100));
export const loadAttempts=()=>read<PracticeAttempt[]>(K.attempts,[],Array.isArray);
export function saveAttempts(items:PracticeAttempt[]){const all=[...loadAttempts(),...items];const max=5000;if(all.length>max){const old=all.slice(0,all.length-max);const arc=read<{attempted:number;correct:number;incorrect:number}>(K.archive,{attempted:0,correct:0,incorrect:0});arc.attempted+=old.length;arc.correct+=old.filter(x=>x.selfReportedCorrect).length;arc.incorrect+=old.filter(x=>!x.selfReportedCorrect).length;write(K.archive,arc);return write(K.attempts,all.slice(-max));}return write(K.attempts,all);}
export const loadMistakes=()=>read<MistakePattern[]>(K.mistakes,[],Array.isArray);
export const saveMistakes=(x:MistakePattern[])=>write(K.mistakes,x.slice(0,500));
export const loadActiveSession=()=>read<ActivePracticeSnapshot|null>(K.active,null,x=>x===null||(!!x&&typeof x==='object'));
export const saveActiveSession=(x:ActivePracticeSnapshot)=>write(K.active,x);
export const clearActiveSession=()=>localStorage.removeItem(K.active);
export const loadArchive=()=>read<{attempted:number;correct:number;incorrect:number}>(K.archive,{attempted:0,correct:0,incorrect:0});
export function clearAll(){Object.values(K).forEach(k=>localStorage.removeItem(k));}
export function storageUsage(){return Object.values(K).reduce((n,k)=>n+(localStorage.getItem(k)?.length??0),0);}
export function getRecoveryWarning(){try{const raw=sessionStorage.getItem(WARNING);return raw?raw.split(',').filter(Boolean):[];}catch{return[];}}
export function clearRecoveryWarning(){try{sessionStorage.removeItem(WARNING);}catch{return;}}
