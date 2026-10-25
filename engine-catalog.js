// Public specifications inform topology; procedural surfaces are educational approximations.
export const ENGINES={
 cfm56:{name:'CFM56-7B',aircraft:'Boeing 737 Next Generation',fanDiameter:1.5494,fanBlades:24,spools:2,lpc:3,hpc:9,hpt:1,ipt:0,lpt:4,bypass:5.1,pressure:20,tit:1500,composite:false,source:'https://www.cfmaeroengines.com/cfm56/CFM56-5B-CFM56-7B',technicalSource:'https://view.ceros.com/ceros-inspire/cfm-mobile/p/2'},
 ge90:{name:'GE90-115B',aircraft:'Boeing 777-300ER / 777F',fanDiameter:3.2512,fanBlades:22,spools:2,lpc:4,hpc:9,hpt:2,ipt:0,lpt:6,bypass:9,pressure:28,tit:1650,composite:true,source:'https://www.geaerospace.com/commercial/aircraft-engines/ge90',technicalSource:'https://www.geaerospace.com/news/press-releases/commercial-engines/ge90-115b-fan-completing-blade-testing-schedule-first-engine-test'},
 trent:{name:'Trent XWB',aircraft:'Airbus A350',fanDiameter:2.9972,fanBlades:22,spools:3,lpc:8,hpc:6,hpt:1,ipt:2,lpt:6,bypass:9.6,pressure:33,tit:1650,composite:false,source:'https://www.rolls-royce.com/products-and-services/civil-aerospace/widebody/trent-xwb.aspx',technicalSource:'https://www.rolls-royce.com/~/media/Files/R/Rolls-Royce/documents/civil-aerospace-downloads/High-Res-posters/High-Res-poster_Trent-XWB.pdf'}
};
export function engineTopology(config){const e=ENGINES[config.engineId];const turbojet=config.architecture==='turbojet';return {name:e?.name??'Custom engine',fanBlades:turbojet?28:e?.fanBlades??26,spools:turbojet?1:e?.spools??2,lpc:turbojet?0:e?.lpc??3,hpc:config.stages,hpt:e?.hpt??2,ipt:turbojet?0:e?.ipt??0,lpt:turbojet?0:e?.lpt??5,composite:!!e?.composite};}
export const ASSEMBLIES=[
 ['inlet','Inlet & acoustic liner','Rounded intake lip, acoustic lining and the outer inlet barrel guide air toward the fan.'],
 ['fan','Fan rotor & spinner','Swept, twisted fan blades attach to the fan disk. The spinner covers the hub; the fan rotates with the low-pressure shaft.'],
 ['stators','Outlet guide vanes','Stationary airfoil vanes remove fan-exit swirl and support the core inside the bypass duct.'],
 ['booster','LP / IP compressor','Rotating compressor disks alternate with stationary vane rows. On the three-shaft Trent this is the intermediate-pressure compressor.'],
 ['hpc','High-pressure compressor','Successively smaller airfoil rows compress the core flow. Rotor disks turn with the HP shaft; stator rows stay fixed.'],
 ['diffuser','Diffuser & compressor case','The diffuser slows the compressed air before combustion. Flanges and casing ribs support the compressor assembly.'],
 ['combustor','Annular combustor','Inner and outer perforated liners surround a continuous annular combustion chamber. Fuel injectors enter around the upstream dome.'],
 ['hpt','High-pressure turbine','Nozzle guide vanes direct hot gas onto turbine blades. The HP turbine drives the high-pressure compressor through its concentric shaft.'],
 ['ipt','Intermediate-pressure turbine','A separate turbine module powers the intermediate-pressure compressor in a three-shaft engine. It is absent on the two-shaft presets.'],
 ['lpt','Low-pressure turbine','Multiple turbine stages extract shaft power for the fan and booster. Rotor rows alternate with stationary nozzle vanes.'],
 ['shafts','Concentric shafts & bearings','Nested shafts connect the rotating compressor and turbine systems. Bearing rings and rolling elements locate the rotating assemblies.'],
 ['accessories','Accessory drive & oil system','An accessory gearbox, starter, pumps, oil tank and drive connection sit beneath the engine core. Their shapes and placement are illustrative.'],
 ['fuel','Fuel manifold & injectors','An annular fuel manifold feeds injector nozzles through individual pipes around the combustor dome.'],
 ['exhaust','Exhaust frame & core nozzle','Support struts, an exhaust cone and the core nozzle guide the hot flow leaving the turbines.'],
 ['nacelle','Fan cowl & bypass duct','The outer cowl encloses the bypass stream. The exploded view lifts the cowl away to expose internal assemblies.']
];
export function assemblyLayout(config,exploded=0){
 const t=engineTopology(config),jet=config.architecture==='turbojet';
 const active=id=>!(id==='ipt'&&!t.ipt)&&!(id==='booster'&&!t.lpc)&&!(id==='lpt'&&!t.lpt);
 const path=(jet?['inlet','stators','fan','hpc','diffuser','combustor','hpt','exhaust']:['inlet','fan','stators','booster','hpc','diffuser','combustor','hpt','ipt','lpt','exhaust']).filter(active);
 return ASSEMBLIES.map(([id,name,description],index)=>{
  if(jet&&id==='nacelle'){name='Engine casing';description='The turbojet casing surrounds the compressor, combustor and turbine. There is no separate bypass duct; the casing remains visible in assembled and exploded views.'}
  if(jet&&id==='stators'){name='Inlet guide vanes';description='Stationary inlet vanes sit immediately ahead of the first compressor rotor, directing air into the single-shaft compressor train.'}
  if(jet&&id==='fan'){name='First compressor rotor & spinner';description='A turbojet has no bypass fan. This first axial compressor rotor feeds the remaining compressor stages on the same shaft.'}
  const rank=path.indexOf(id),offset=[rank<0?0:(rank-(path.length-1)/2)*(jet?.52:.7)*exploded,0,0];
  if(id==='shafts')offset.splice(0,3,0,-1.3*exploded,1.3*exploded);
  if(id==='accessories')offset.splice(0,3,-.8*exploded,-1.6*exploded,-1.1*exploded);
  if(id==='fuel')offset.splice(0,3,.2*exploded,1.65*exploded,.8*exploded);
  if(id==='nacelle')offset.splice(0,3,0,2.7*exploded,-.4*exploded);
  return {id,name,description,index,active:active(id),offset};
 });
}
