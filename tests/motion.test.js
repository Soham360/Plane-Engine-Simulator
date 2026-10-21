import test from 'node:test';
import assert from 'node:assert/strict';
import {springStep,visualMotionPaused} from '../motion.js';
test('camera motion settles equally at different display refresh rates',()=>{function run(hz){let p=0,v=0;for(let i=0;i<hz;i++)[p,v]=springStep(p,v,10,1/hz);return p}assert.ok(Math.abs(run(30)-run(144))<1e-9);assert.ok(Math.abs(run(60)-10)<.001)});
test('retargeting carries the current position and velocity without a jump',()=>{let [p,v]=springStep(0,0,10,.1);const [q,w]=springStep(p,v,-10,0);assert.ok(Math.abs(p-q)<1e-12);assert.ok(Math.abs(v-w)<1e-12);const [next]=springStep(p,v,-10,1/60);assert.ok(Number.isFinite(next));assert.ok(Math.abs(next-p)<1)});
test('reduced motion and user pause independently disable visual motion',()=>{assert.equal(visualMotionPaused(false,true),true);assert.equal(visualMotionPaused(true,false),true);assert.equal(visualMotionPaused(false,false),false)});
