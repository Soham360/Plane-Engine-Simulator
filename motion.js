// Exact critically damped spring: stable across frame rates and retargetable.
export function springStep(position, velocity, target, dt, response=.35) {
  const omega=4.6/response, offset=position-target, carry=velocity+omega*offset;
  const decay=Math.exp(-omega*dt);
  return [target+(offset+carry*dt)*decay,(velocity-omega*carry*dt)*decay];
}
export function visualMotionPaused(userPaused, reducedMotion) { return userPaused || reducedMotion; }
