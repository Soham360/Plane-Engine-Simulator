// Keep instruments mounted so navigation never resets a running engine.
export function setupWorkspace(){
 const $=s=>document.querySelector(s),main=$('main'),workspace=$('.workspace'),aside=$('aside'),guide=$('#guide');
 $('.intro').remove();
 const bar=$('.project-bar');bar.classList.add('workspace-bar');main.prepend(bar);
 const bottom=document.createElement('div');bottom.className='instrument-row';bottom.append($('.component-card'),$('.chart-card'));workspace.append(bottom);
 const instrumentTabs=document.createElement('div');instrumentTabs.className='instrument-tabs';instrumentTabs.setAttribute('role','group');instrumentTabs.setAttribute('aria-label','Engine instruments');instrumentTabs.innerHTML='<button data-instrument="component" aria-pressed="true">Component</button><button data-instrument="chart" aria-pressed="false">Thrust graph</button>';workspace.insertBefore(instrumentTabs,bottom);document.body.dataset.instrument='component';instrumentTabs.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{document.body.dataset.instrument=b.dataset.instrument;instrumentTabs.querySelectorAll('button').forEach(t=>t.setAttribute('aria-pressed',String(t===b)))}));
 const note=$('#motion-note'),footnote=$('.footnote');const help=document.createElement('div');help.className='workspace-help';help.append(note,footnote);workspace.append(help);
 guide.classList.add('reading-page');main.append(guide);
 const switcher=document.createElement('div');switcher.className='workspace-switcher';switcher.setAttribute('role','group');switcher.setAttribute('aria-label','Workspace panels');switcher.innerHTML='<button data-workspace-panel="simulation" aria-pressed="true">Engine & data</button><button data-workspace-panel="controls" aria-pressed="false">Controls</button>';bar.prepend(switcher);
 const mobile=matchMedia('(max-width:800px)');let panel='simulation';
 function setPanel(value){panel=value;document.body.dataset.workspacePanel=value;switcher.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.workspacePanel===value)))}
 switcher.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>setPanel(b.dataset.workspacePanel)));
 function showPage(){const reading=location.hash==='#guide';document.body.dataset.page=reading?'guide':'simulation';guide.hidden=!reading;workspace.hidden=reading;aside.hidden=reading;bar.hidden=reading;document.querySelectorAll('header nav a').forEach(a=>{const active=a.hash===(reading?'#guide':'#simulator');a.classList.toggle('selected',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});main.scrollTop=0;}
 window.addEventListener('hashchange',showPage);mobile.addEventListener('change',()=>setPanel('simulation'));setPanel(panel);showPage();
 // A keyboard skip link must also reveal the controls on a small screen.
 $('.skip').addEventListener('click',()=>{setPanel('controls');requestAnimationFrame(()=>aside.focus())});
}
