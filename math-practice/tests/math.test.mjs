import assert from 'node:assert/strict';
import { OPERATIONS, DIFFICULTIES, calculate, generateQuestion, generateChoices, accuracy, difficultyRules } from '../math.js';

let count=0;
function test(name,fn){try{fn();console.log('✓ '+name);count++;}catch(e){console.error('✗ '+name);throw e;}}

test('calculate supports all four operations',()=>{
  assert.equal(calculate('addition',2,3),5);
  assert.equal(calculate('subtraction',9,4),5);
  assert.equal(calculate('multiplication',6,7),42);
  assert.equal(calculate('division',36,6),6);
});

test('all four required difficulty levels are available',()=>{
  assert.deepEqual(DIFFICULTIES,['beginner','easy','intermediate','advanced']);
  for(const d of DIFFICULTIES) assert.ok(difficultyRules(d));
});

test('generated questions are mathematically correct across every operation and difficulty',()=>{
  for(const op of OPERATIONS) for(const d of DIFFICULTIES) for(let i=0;i<200;i++){
    const q=generateQuestion(op,d);
    assert.equal(calculate(op,q.a,q.b),q.answer);
  }
});

test('division always has a nonzero divisor and whole-number answer',()=>{
  for(const d of DIFFICULTIES) for(let i=0;i<300;i++){
    const q=generateQuestion('division',d);
    assert.notEqual(q.b,0); assert.ok(Number.isInteger(q.answer));
  }
});

test('subtraction remains non-negative',()=>{
  for(const d of DIFFICULTIES) for(let i=0;i<300;i++) assert.ok(generateQuestion('subtraction',d).answer>=0);
});

test('every question has four unique choices containing the correct answer',()=>{
  for(const op of OPERATIONS) for(const d of DIFFICULTIES) for(let i=0;i<100;i++){
    const q=generateQuestion(op,d);
    assert.equal(q.choices.length,4);
    assert.equal(new Set(q.choices).size,4);
    assert.ok(q.choices.includes(q.answer));
  }
});

test('choice generation handles zero and small answers',()=>{
  for(const a of [0,1,2,3]){
    const c=generateChoices(a,'subtraction');
    assert.equal(new Set(c).size,4); assert.ok(c.includes(a)); assert.ok(c.every(x=>x>=0));
  }
});

test('accuracy handles zero attempts and rounding',()=>{
  assert.equal(accuracy(0,0),0); assert.equal(accuracy(8,10),80); assert.equal(accuracy(2,3),67);
});
console.log('\n'+count+' test groups passed.');
