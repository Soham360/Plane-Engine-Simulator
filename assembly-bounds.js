import * as T from './vendor/three.module.js';

// Capture a rotation-invariant envelope once, in the assembly's local space.
export function cacheAssemblyBounds(parts,rotors){
 parts.forEach(part=>{
  part.updateWorldMatrix(true,true);
  const bounds=new T.Box3().setFromObject(part),inverse=part.matrixWorld.clone().invert();
  bounds.applyMatrix4(inverse);
  for(const {group} of rotors){
   let parent=group;while(parent&&parent!==part)parent=parent.parent;
   if(!parent||!group.userData.rotorEnvelope)continue;
   const transform=new T.Matrix4().multiplyMatrices(inverse,group.matrixWorld);
   bounds.union(group.userData.rotorEnvelope.clone().applyMatrix4(transform));
  }
  part.userData.inspectionBounds=bounds.expandByScalar(.005);
 });
}

export function assemblyBounds(part,position=part.position){
 return part.userData.inspectionBounds.clone().translate(position);
}
