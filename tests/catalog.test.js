import test from 'node:test';
import assert from 'node:assert/strict';
import {ENGINES,ASSEMBLIES,engineTopology,assemblyLayout} from '../engine-catalog.js';
import {presets,validateBuild} from '../engine.js';
test('named engine configurations survive saved-build validation',()=>{for(const id of Object.keys(ENGINES)){const restored=validateBuild(presets[id]);assert.equal(restored.engineId,id);assert.equal(engineTopology(restored).hpc,ENGINES[id].hpc)}assert.throws(()=>validateBuild({...presets.ge90,engineId:'unknown'}))});
test('GE90 and Trent retain their distinct shaft and turbine arrangements',()=>{assert.equal(engineTopology(presets.ge90).fanBlades,22);assert.equal(engineTopology(presets.ge90).hpt,2);assert.equal(engineTopology(presets.trent).spools,3);assert.equal(engineTopology(presets.trent).ipt,2);assert.equal(engineTopology(presets.cfm56).fanBlades,24)});
test('exploded module transforms distinguish service systems and preserve identities',()=>{const closed=assemblyLayout(presets.trent,0),open=assemblyLayout(presets.trent,1);assert.equal(closed.length,ASSEMBLIES.length);assert.ok(closed.every(p=>p.offset.every(x=>x===0)));assert.equal(open.find(p=>p.id==='nacelle').offset[1],2.7);assert.ok(open.find(p=>p.id==='shafts').offset[1]<0);assert.ok(!assemblyLayout(presets.ge90).find(p=>p.id==='ipt').active);assert.ok(open.find(p=>p.id==='ipt').active)});
test('custom compressor stages affect the named engine topology',()=>assert.equal(engineTopology({...presets.ge90,stages:12}).hpc,12));
