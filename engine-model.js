import * as T from 'three';
import {engineTopology,assemblyLayout} from './engine-catalog.js';
// Engine axis is X. Every service assembly owns its geometry, selection and transform.
export function makeEngine(config,clip){
 const root=new T.Group(),rotors=[],shells=[],materials=new Set(),geometries=new Set(),topology=engineTopology(config);
 const material=(color,roughness=.35,metalness=.8)=>{const m=new T.MeshStandardMaterial({color,roughness,metalness,side:T.DoubleSide});materials.add(m);return m};
 const silver=material('#aab8c7'),titanium=material('#718497'),dark=material('#303b48'),hot=material('#95816b'),copper=material('#ac7750'),black=material('#273039',.5,.5),cowl=material(config.finish,.31,.65);
 const parts=assemblyLayout(config).map(a=>{const g=new T.Group();g.userData={...a,base:new T.Vector3()};g.visible=a.active;root.add(g);return g});
 const part=id=>parts.find(g=>g.userData.id===id);
 function mesh(geometry,mat,parent,x=0,y=0,z=0){geometries.add(geometry);const m=new T.Mesh(geometry,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
 function cylinder(r1,r2,length,mat,parent,x=0,y=0,z=0,open=false){const m=mesh(new T.CylinderGeometry(r1,r2,length,48,1,open),mat,parent,x,y,z);m.rotation.z=-Math.PI/2;return m}
 function ring(radius,tube,mat,parent,x=0,y=0,z=0){const m=mesh(new T.TorusGeometry(radius,tube,8,64),mat,parent,x,y,z);m.rotation.y=Math.PI/2;return m}
 function shell(profile,mat,parent){const m=mesh(new T.LatheGeometry(profile.map(([x,r])=>new T.Vector2(r,x)),72),mat.clone(),parent);materials.add(m.material);m.rotation.z=-Math.PI/2;shells.push(m.material);return m}
 function bolts(x,r,parent,count=24){const geo=new T.CylinderGeometry(.025,.025,.045,6);geo.rotateZ(Math.PI/2);geometries.add(geo);const inst=new T.InstancedMesh(geo,silver,count);const o=new T.Object3D();for(let i=0;i<count;i++){const a=i/count*Math.PI*2;o.position.set(x,Math.cos(a)*r,Math.sin(a)*r);o.updateMatrix();inst.setMatrixAt(i,o.matrix)}parent.add(inst)}
 function flange(x,r,parent){ring(r,.025,silver,parent,x);ring(r-.045,.012,dark,parent,x);bolts(x,r,parent)}
 function pipe(points,r,mat,parent){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),24,r,6,false),mat,parent)}
 // Closed airfoil surface with spanwise chord, sweep, camber and twist.
 function bladeGeometry(inner,outer,chord,sweep=0,twist=.65){const positions=[],indices=[],span=10,around=18;for(let j=0;j<=span;j++){const s=j/span,rad=inner+(outer-inner)*s,c=chord*(1-.42*s),angle=twist*(1-.6*s);for(let k=0;k<around;k++){const a=k/around*Math.PI*2,u=(1-Math.cos(a))/2,thickness=.10*c*Math.sin(a)*(1-.45*u),camber=.12*c*Math.sin(Math.PI*u),axial=(u-.5)*c;positions.push(axial*Math.cos(angle)-(thickness+camber)*Math.sin(angle)+sweep*s*s,rad,axial*Math.sin(angle)+(thickness+camber)*Math.cos(angle)+.16*s*s*chord)}}for(let j=0;j<span;j++)for(let k=0;k<around;k++){const a=j*around+k,b=j*around+(k+1)%around,c=a+around,d=b+around;indices.push(a,b,c,b,d,c)}for(const j of [0,span])for(let k=1;k<around-1;k++)indices.push(j*around,j*around+k,j*around+k+1);const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setIndex(indices);geo.computeVertexNormals();return geo}
 function row(x,inner,outer,count,chord,mat,parent,spool=null,sweep=0){const g=new T.Group();g.position.x=x;parent.add(g);const geo=bladeGeometry(inner,outer,chord,sweep,spool===null?-.55:.8);geometries.add(geo);const inst=new T.InstancedMesh(geo,mat,count),o=new T.Object3D();for(let i=0;i<count;i++){o.rotation.x=i/count*Math.PI*2;o.updateMatrix();inst.setMatrixAt(i,o.matrix)}inst.castShadow=true;g.add(inst);cylinder(inner,inner,.08,mat,g);if(spool!==null)rotors.push({group:g,spool});return g}
 function stageStack(parent,start,length,count,r0,r1,spool,mat){for(let i=0;i<count;i++){const s=i/Math.max(1,count-1),r=T.MathUtils.lerp(r0,r1,s),x=start+i*length/count;row(x,.23,r,32+i*2,.18,mat,parent,spool);row(x+length/count*.48,.25,r*1.025,34+i*2,.14,silver,parent);ring(r+.04,.012,titanium,parent,x)}cylinder(.25,.25,length+.1,dark,parent,start+length/2)}
 const fanR=.85+config.diameter*.29,coreR=.70,fan=part('fan'),inlet=part('inlet');
 shell([[-4.65,fanR*.94],[-4.57,fanR],[-4.35,fanR*1.025],[-3.55,fanR*1.015]],cowl,inlet);ring(fanR*.98,.09,silver,inlet,-4.51);for(let i=0;i<6;i++)ring(fanR*.985,.013,dark,inlet,-4.25+i*.105);
 row(-3.55,fanR*.19,fanR*.97,topology.fanBlades,.65,topology.composite?black:silver,fan,0,topology.composite?.34:.17);
 const spinner=cylinder(fanR*.205,.025,.85,dark,fan,-4.01); // Positive X end is the wide spinner root.
 ring(fanR*.20,.018,silver,fan,-3.60);flange(-3.48,fanR*.23,fan);
 const stators=part('stators');row(-3.08,.64,fanR*.95,30,.24,titanium,stators);ring(fanR*.96,.032,silver,stators,-3.08);cylinder(.55,.62,.4,dark,stators,-3.05,true);
 const boost=part('booster');if(topology.lpc)stageStack(boost,-2.85,1.35,topology.lpc,.79,.67,topology.spools===3?1:0,titanium);
 const hpc=part('hpc');stageStack(hpc,-1.38,1.75,topology.hpc,.66,.47,topology.spools-1,silver);
 const diffuser=part('diffuser');shell([[-1.48,.76],[-.8,.71],[.15,.57],[.42,.62],[.60,.77]],titanium,diffuser);flange(-1.43,.78,diffuser);flange(.54,.79,diffuser);for(let i=0;i<8;i++)ring(.72-i*.02,.012,dark,diffuser,-1.2+i*.19);
 const combustor=part('combustor');shell([[.55,.77],[.7,.83],[1.48,.80],[1.65,.67]],hot,combustor);shell([[.58,.35],[1.5,.37],[1.65,.39]],hot,combustor);ring(.55,.12,copper,combustor,.7);flange(.57,.81,combustor);flange(1.64,.70,combustor);
 // Cooling perforations are instanced dark inserts rather than oversized can combustors.
 const holeGeo=new T.SphereGeometry(.018,6,4);geometries.add(holeGeo);const holes=new T.InstancedMesh(holeGeo,dark,240),ho=new T.Object3D();for(let i=0;i<240;i++){const a=i%40/40*Math.PI*2;ho.position.set(.78+Math.floor(i/40)*.12,Math.cos(a)*.806,Math.sin(a)*.806);ho.updateMatrix();holes.setMatrixAt(i,ho.matrix)}combustor.add(holes);
 const hpt=part('hpt');stageStack(hpt,1.80,.48,topology.hpt,.60,.63,topology.spools-1,hot);flange(1.78,.69,hpt);
 const ipt=part('ipt');if(topology.ipt)stageStack(ipt,2.4,.47,topology.ipt,.65,.70,1,hot);
 const lpt=part('lpt'),lowStart=topology.ipt?2.99:2.48;if(topology.lpt)stageStack(lpt,lowStart,1.37,topology.lpt,.69,.85,0,hot);shell([[lowStart-.12,.79],[lowStart+.8,.90],[lowStart+1.45,.98]],titanium,lpt);flange(lowStart-.08,.81,lpt);flange(lowStart+1.40,.97,lpt);
 const shafts=part('shafts');for(let i=0;i<topology.spools;i++){const radius=.075+i*.055,start=-3.4+i*.78,end=i===topology.spools-1?2.1:4.2;const shaft=cylinder(radius,radius,end-start,i===0?dark:i===1?copper:silver,shafts,(end+start)/2,0,0,true);for(const x of [start+.15,end-.15]){ring(radius+.07,.032,titanium,shafts,x);for(let j=0;j<10;j++){const a=j/10*Math.PI*2;mesh(new T.SphereGeometry(.025,6,4),silver,shafts,x,Math.cos(a)*(radius+.07),Math.sin(a)*(radius+.07))}}}
 const accessories=part('accessories');mesh(new T.BoxGeometry(1.4,.32,.55),dark,accessories,-1.7,-.98,0);for(let i=0;i<3;i++)cylinder(.14,.14,.38,silver,accessories,-2.1+i*.45,-1.18,.18);const drive=cylinder(.055,.055,.70,titanium,accessories,-1.3,-.65,0);drive.rotation.z=0;mesh(new T.BoxGeometry(.45,.38,.36),copper,accessories,-.65,-.95,.1);pipe([[-.7,-.95,.1],[-.3,-.7,.5],[.2,-.6,.65]],.025,silver,accessories);
 const fuel=part('fuel');ring(.90,.035,copper,fuel,.7);for(let i=0;i<18;i++){const a=i/18*Math.PI*2,y=Math.cos(a),z=Math.sin(a);pipe([[.7,y*.90,z*.90],[.52,y*.75,z*.75],[.73,y*.58,z*.58]],.016,silver,fuel);cylinder(.035,.045,.15,dark,fuel,.73,y*.58,z*.58)}
 const exhaust=part('exhaust'),end=lowStart+1.55;row(end,.29,.85,10,.22,titanium,exhaust);shell([[end,.92],[end+.7,.80],[end+1,.66]],silver,exhaust);cylinder(.02,.30,1.65,dark,exhaust,end+.5);ring(.67,.025,dark,exhaust,end+1);
 const nacelle=part('nacelle');shell([[-3.48,fanR*1.02],[-2.5,fanR*1.01],[-.5,fanR*.95],[1.2,fanR*.84],[2.5,fanR*.70]],cowl,nacelle);flange(-3.48,fanR*1.02,nacelle);ring(fanR*.70,.035,silver,nacelle,2.5);for(let i=0;i<3;i++){const a=i*Math.PI*2/3;pipe([[-2.7,Math.cos(a)*fanR,Math.sin(a)*fanR],[.2,Math.cos(a)*fanR*.95,Math.sin(a)*fanR*.95]],.013,dark,nacelle)}
 const pickables=[];parts.forEach((g,i)=>g.traverse(o=>{if(o.isMesh){o.userData.component=i;o.material=o.material.clone();materials.add(o.material);if(o.geometry.type==='LatheGeometry'){shells.push(o.material)}pickables.push(o)}}));
 const layout=assemblyLayout(config,1);parts.forEach((g,i)=>{g.userData.exploded=new T.Vector3(...layout[i].offset);g.userData.velocity=new T.Vector3()});
 return{root,parts,rotors,shells,pickables,topology,fanRadius:fanR,dispose(){geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose())}};
}
