// Simplified separate-flow Brayton-cycle teaching model. SI units throughout.
export const defaults={architecture:'turbofan',diameter:2.4,bypass:8,stages:8,pressure:28,tit:1500,throttle:65,altitude:0,mach:0,finish:'#aab9c7'};
export const limits={diameter:[.7,3.5],bypass:[0,12],stages:[3,14],pressure:[8,45],tit:[1100,1800],throttle:[0,100],altitude:[0,15000],mach:[0,.95]};
export const presets={airliner:{...defaults},business:{...defaults,diameter:1.15,bypass:2.5,stages:6,pressure:20,tit:1450},turbojet:{...defaults,architecture:'turbojet',diameter:.95,bypass:0,stages:10,pressure:16,tit:1400}};
export function validateBuild(input){if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Choose an AERO build JSON file.');const c={...defaults};for(const [key,[min,max]]of Object.entries(limits)){if(typeof input[key]!=='number'||!Number.isFinite(input[key])||input[key]<min||input[key]>max)throw Error(`Invalid ${key}: expected ${min}–${max}.`);c[key]=input[key]}if(!['turbofan','turbojet'].includes(input.architecture))throw Error('Unknown engine architecture.');if(!Number.isInteger(c.stages))throw Error('Compressor stages must be a whole number.');c.architecture=input.architecture;if(!/^#[0-9a-f]{6}$/i.test(input.finish))throw Error('Invalid housing finish.');c.finish=input.finish;if(c.architecture==='turbojet')c.bypass=0;return c}
export function atmosphere(altitude){const h=Math.min(15000,Math.max(0,altitude)),temperature=288.15-.0065*Math.min(h,11000);const pressure=h<=11000?101325*(temperature/288.15)**5.25588:22632.06*Math.exp(-(h-11000)*9.80665/(287.05*216.65));return{temperature,pressure,density:pressure/(287.05*temperature)}}
export function cycle(c,spool=1){const a=atmosphere(c.altitude),gamma=1.4,cp=1005,R=287.05,V=c.mach*Math.sqrt(gamma*R*a.temperature),n=Math.max(0,Math.min(1,spool)),b=c.architecture==='turbojet'?0:c.bypass;
 const T2=a.temperature*(1+.2*c.mach*c.mach),P2=a.pressure*(T2/a.temperature)**3.5*.99;
 const fanPR=1+.5*n*n,fanT=T2*(1+(fanPR**(2/7)-1)/.9),fanP=P2*fanPR;
 const pr=1+(c.pressure-1)*n*n,etaC=Math.min(.9,.76+c.stages*.009),T3=fanT*(1+(pr**(2/7)-1)/etaC),P3=fanP*pr;
 const T4=Math.max(T3,T3+(c.tit-T3)*n),f=Math.max(0,cp*(T4-T3)/(43e6*.99-cp*T4));
 const shaftWork=cp*(T3-fanT)+cp*(fanT-T2)*(1+b),T5=Math.max(T4-shaftWork/(cp*(1+f)*.99),a.temperature);
 const P5=P3*.95*Math.max(.01,1-(T4-T5)/(T4*.92))**3.5;
 const nozzle=(T,P)=>Math.sqrt(Math.max(0,2*cp*T*.95*(1-(a.pressure/Math.max(P,a.pressure))**(2/7))));
 const coreV=nozzle(T5,P5),bypassV=nozzle(fanT,fanP),area=Math.PI*(c.diameter/2)**2*.78;
 const mass=a.density*area*(65+175*n+V*.45)*n,coreMass=mass/(1+b),fuel=coreMass*f;
 const thrust=n>0?Math.max(0,coreMass*((1+f)*coreV-V)+coreMass*b*(bypassV-V)):0;
 return{...a,speed:V,thrust:thrust/1000,rpm:n*5000*2.4/c.diameter,fuel,egt:n?T5-273.15:a.temperature-273.15,tsfc:thrust>1?fuel*1e6/thrust:0,mass,coreMass,bypassMass:coreMass*b,pr:pr*fanPR,stations:[T2,fanT,T3,T4,T5],coreV,bypassV};}
