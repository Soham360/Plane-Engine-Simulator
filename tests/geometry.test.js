import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {makeEngine} from '../engine-model.js';
import {assemblyBounds} from '../assembly-bounds.js';
import {presets} from '../engine.js';

test('fan outlet vanes are fixed, coaxial and downstream of swept fan tips',()=>{
 for(const id of ['cfm56','ge90','trent']){
  const m=makeEngine(presets[id]),fan=m.parts.find(p=>p.userData.id==='fan'),vanes=m.parts.find(p=>p.userData.id==='stators');
  try{assert.ok(assemblyBounds(vanes).min.x>assemblyBounds(fan).max.x,`${id}: rotor/stator overlap`);assert.equal(vanes.position.y,0);assert.equal(vanes.position.z,0);assert.ok(!m.rotors.some(({group})=>group.parent===vanes));}finally{m.dispose()}
 }
});

test('selection envelope is constant and contains the fan at every rotation',()=>{
 const m=makeEngine(presets.ge90),fan=m.parts.find(p=>p.userData.id==='fan'),rotor=m.rotors.find(({group})=>group.parent===fan).group,initial=assemblyBounds(fan);
 try{for(const angle of [0,.2,.6,1.1,1.9,3.1,5.7]){rotor.rotation.x=angle;m.root.updateMatrixWorld(true);assert.deepEqual(assemblyBounds(fan),initial);const blades=rotor.children.find(o=>o.isInstancedMesh),matrix=new T.Matrix4(),point=new T.Vector3(),positions=blades.geometry.attributes.position;for(let i=0;i<blades.count;i++){blades.getMatrixAt(i,matrix);matrix.premultiply(blades.matrixWorld);for(let j=0;j<positions.count;j++){point.fromBufferAttribute(positions,j).applyMatrix4(matrix);assert.ok(initial.clone().expandByScalar(1e-6).containsPoint(point),'Rotating blade extends outside fixed envelope')}}}fan.position.set(2,1,-1);assert.deepEqual(assemblyBounds(fan),initial.clone().translate(fan.position));}finally{m.dispose()}
});

test('turbojet retains a real casing and a compact single-spool gas path',()=>{
 const jet=makeEngine(presets.turbojet),fan=makeEngine(presets.airliner);
 try{const part=id=>jet.parts.find(p=>p.userData.id===id),housing=part('nacelle');assert.ok(housing.visible);assert.ok(housing.children.some(c=>c.geometry?.type==='LatheGeometry'));assert.equal(housing.userData.name,'Engine casing');assert.ok(!part('booster').visible&&!part('ipt').visible&&!part('lpt').visible);assert.equal(jet.topology.spools,1);const bounds=new T.Box3();jet.parts.filter(p=>p.visible).forEach(p=>bounds.union(assemblyBounds(p)));const fanBounds=new T.Box3();fan.parts.filter(p=>p.visible).forEach(p=>fanBounds.union(assemblyBounds(p)));assert.ok(bounds.getSize(new T.Vector3()).x<fanBounds.getSize(new T.Vector3()).x*.75);const hptEnd=assemblyBounds(part('hpt')).max.x,exhaustStart=assemblyBounds(part('exhaust')).min.x;assert.ok(exhaustStart-hptEnd<.25,'Missing low-pressure turbine must not leave a long gap');assert.ok(assemblyBounds(part('hpc')).min.x>assemblyBounds(part('fan')).max.x,'First compressor rotor overlaps next stage');}finally{jet.dispose();fan.dispose()}
});

test('all preset geometries produce finite inspection bounds on repeated rebuilds',()=>{
 for(const c of Object.values(presets)){const m=makeEngine(c);try{for(const p of m.parts.filter(p=>p.visible)){const b=assemblyBounds(p);assert.ok([...b.min,...b.max].every(Number.isFinite));assert.ok(!b.isEmpty())}}finally{m.dispose()}}
});
