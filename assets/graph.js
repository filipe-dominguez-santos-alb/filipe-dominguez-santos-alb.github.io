document.querySelectorAll("canvas[data-graph]").forEach(cv=>{
const mini=cv.dataset.graph==="mini",cur=cv.dataset.current||"",ctx=cv.getContext("2d");
const info=document.getElementById("info"),q=document.getElementById("q");
const css=getComputedStyle(document.documentElement),col=g=>css.getPropertyValue("--c-"+g).trim();
let N=[],E=[],W,H,dpr,s=1,ox=0,oy=0,alpha=1,hover=null,sel=null,dragN=null,pan=false,moved=0,last={x:0,y:0};
const FONT="JetBrains Mono, monospace";
function resize(){const r=cv.getBoundingClientRect();dpr=devicePixelRatio||1;W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;if(!mini){ox=W/2;oy=H/2}alpha=Math.max(alpha,.3)}
addEventListener("resize",resize);
function fail(m){resize();ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle="#ff6b6b";ctx.font="13px monospace";ctx.fillText(m,12,H/2)}
addEventListener("error",e=>fail("Erro: "+e.message));
(function(){let d;try{d=JSON.parse(document.getElementById("graph-data").textContent)}catch(err){fail("Erro nos dados do grafo: "+err.message);return}
  const by={};
  d.nodes.forEach((n,i)=>{const a=i/d.nodes.length*6.283;Object.assign(n,{x:Math.cos(a)*110+Math.random(),y:Math.sin(a)*110+Math.random(),vx:0,vy:0,deg:0,nb:new Set()});by[n.id]=n});
  N=d.nodes;if(!N.length){fail("Sem nodes: verifica a pasta _posts.");return}
  d.links.forEach(l=>{const a=by[l.s],b=by[l.t];if(a&&b){E.push({a,b});a.deg++;b.deg++;a.nb.add(b);b.nb.add(a)}});
  N.forEach(n=>n.r=4+Math.sqrt(n.deg)*2.4);
  resize();requestAnimationFrame(draw);
})();
function tick(){
  if(alpha<.005&&!dragN)return;
  for(let i=0;i<N.length;i++){const a=N[i];
    for(let j=i+1;j<N.length;j++){const b=N[j];let dx=b.x-a.x,dy=b.y-a.y,d2=dx*dx+dy*dy+.01,d=Math.sqrt(d2),f=2600/d2*alpha;dx/=d;dy/=d;a.vx-=dx*f;a.vy-=dy*f;b.vx+=dx*f;b.vy+=dy*f}}
  E.forEach(({a,b})=>{const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1,f=(d-75)*.04*alpha,fx=dx/d*f,fy=dy/d*f;a.vx+=fx;a.vy+=fy;b.vx-=fx;b.vy-=fy});
  N.forEach(n=>{n.vx-=n.x*.012*alpha;n.vy-=n.y*.012*alpha;if(n!==dragN){n.vx*=.82;n.vy*=.82;n.x+=n.vx;n.y+=n.vy}else n.vx=n.vy=0});
  if(!dragN)alpha*=.992;
}
function fit(){
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;N.forEach(n=>{x0=Math.min(x0,n.x);x1=Math.max(x1,n.x);y0=Math.min(y0,n.y);y1=Math.max(y1,n.y)});
  const ts=Math.min(1.5,Math.max(.3,Math.min(W/(x1-x0+90),H/(y1-y0+90)))),tx=W/2-(x0+x1)/2*ts,ty=H/2-(y0+y1)/2*ts;
  s+=(ts-s)*.1;ox+=(tx-ox)*.1;oy+=(ty-oy)*.1;
}
const match=n=>{const v=q&&q.value.trim().toLowerCase();return !v||n.label.toLowerCase().includes(v)};
function draw(){
  tick();if(mini)fit();
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);ctx.translate(ox,oy);ctx.scale(s,s);
  const f=hover||sel;
  E.forEach(({a,b})=>{const on=!f||a===f||b===f;ctx.strokeStyle=on?(f?"#4dff9a99":"#2a3a30"):"#131b16";ctx.lineWidth=(on&&f?1.4:1)/s;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()});
  N.forEach(n=>{
    const ok=(!f||n===f||f.nb.has(n))&&match(n),isCur=n.id===cur;
    ctx.globalAlpha=ok?1:.15;ctx.fillStyle=col(n.group);ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,6.283);ctx.fill();
    if(n===f||isCur){ctx.strokeStyle=isCur?"#fff":col(n.group);ctx.lineWidth=1.5/s;ctx.beginPath();ctx.arc(n.x,n.y,n.r+4,0,6.283);ctx.stroke()}
    const show=mini?(n===f||isCur||n.group==="core"):(ok&&(s>.8||n===f||n.deg>3||(q&&q.value)));
    if(show){const fs=12/Math.max(s,.7);ctx.fillStyle=n===f||isCur?"#fff":"#9fb0a5";ctx.font=fs+"px "+FONT;ctx.textAlign="center";ctx.fillText(n.label,n.x,n.y-n.r-2)}
  });
  ctx.globalAlpha=1;requestAnimationFrame(draw);
}
const pos=e=>{const r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
function pick(x,y){const wx=(x-ox)/s,wy=(y-oy)/s;let best=null,bd=1e9;N.forEach(n=>{const d=Math.hypot(n.x-wx,n.y-wy);if(d<n.r+7/s&&d<bd){best=n;bd=d}});return best}
function go(n){if(n&&n.url)location.href=n.url}
function select(n){
  sel=n;if(!info)return;
  if(!n){info.style.display="none";return}
  info.style.display="block";info.innerHTML="<strong></strong><span></span>"+(n.url?'<a>open</a>':"");
  info.children[0].textContent=n.label;info.children[1].textContent=n.group+" · "+n.deg+" links";
  if(n.url)info.querySelector("a").href=n.url;
}
cv.addEventListener("pointermove",e=>{const p=pos(e);
  if(dragN){const wx=(p.x-ox)/s,wy=(p.y-oy)/s;dragN.x=wx;dragN.y=wy;moved+=Math.abs(p.x-last.x)+Math.abs(p.y-last.y);alpha=Math.max(alpha,.3)}
  else if(pan){ox+=p.x-last.x;oy+=p.y-last.y;moved+=Math.abs(p.x-last.x)+Math.abs(p.y-last.y)}
  else{hover=pick(p.x,p.y);cv.style.cursor=hover?"pointer":(mini?"default":"grab")}
  last=p});
cv.addEventListener("pointerleave",()=>{hover=null});
if(mini){cv.addEventListener("click",e=>{const p=pos(e);go(pick(p.x,p.y))})}
else{
  cv.addEventListener("pointerdown",e=>{const p=pos(e),n=pick(p.x,p.y);cv.setPointerCapture(e.pointerId);moved=0;last=p;if(n){dragN=n;alpha=Math.max(alpha,.4)}else pan=true});
  cv.addEventListener("pointerup",()=>{if(moved<5)select(dragN);dragN=null;pan=false});
  cv.addEventListener("wheel",e=>{e.preventDefault();const p=pos(e),ns=Math.min(3,Math.max(.35,s*Math.exp(-e.deltaY*.0012)));ox=p.x-(p.x-ox)*ns/s;oy=p.y-(p.y-oy)*ns/s;s=ns},{passive:false});
  if(q)q.addEventListener("input",()=>{alpha=Math.max(alpha,.05)});
}
});
