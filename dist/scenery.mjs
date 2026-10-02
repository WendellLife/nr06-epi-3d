// Cenário estático da metalúrgica, construído conforme layout.mjs: almoxarifado de EPI, prensa enclausurada, área de ruído
// com o esmeril, bancada de peças, bancada de tintas, mezanino, posto de solda, quadro de treinamento e vestiário.
// Devolve "items": objetos que o jogo liga e desliga conforme as etapas (kit, ficha, fagulhas, óculos trincados, linha de vida…).
import * as T from './three.module.js';
import {structures as ST,spots as SP,noise,mezz,LOT} from './layout.mjs';
import {glowSprite} from './graphics.mjs';
export function buildScenery(scene,TX){
 const mats={};
 const mat=(c,metal=0,rough=.7)=>mats[c+'-'+metal+'-'+rough]??=new T.MeshStandardMaterial({color:c,metalness:metal,roughness:rough});
 const shadowed=(m,cast=true)=>{m.castShadow=cast;m.receiveShadow=true;return m;};
 const out={trees:[],groundMats:[],items:{},see:[]};
 function canvasPlane(w,h,draw,res=768){const cv=document.createElement('canvas');cv.width=res;cv.height=Math.max(8,Math.round(res*h/w));const g=cv.getContext('2d');draw(g,cv.width,cv.height);const tx=new T.CanvasTexture(cv);tx.colorSpace=T.SRGBColorSpace;tx.anisotropy=4;return new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:tx,roughness:.8}));}
 // Ferramentas de construção presas a um grupo (o lote), em coordenadas locais.
 function tools(P){
  const box=(w,h,d,c,x,y,z,parent=P,metal=0)=>{const m=shadowed(new T.Mesh(new T.BoxGeometry(w,h,d),typeof c==='object'?c:mat(c,metal)));m.position.set(x,y,z);parent.add(m);return m;};
  const cyl=(r,rb,h,c,x,y,z,parent=P,n=16)=>{const m=shadowed(new T.Mesh(new T.CylinderGeometry(r,rb,h,n),typeof c==='object'?c:mat(c,.2)));m.position.set(x,y,z);parent.add(m);return m;};
  const sphere=(r,c,x,y,z,parent=P)=>{const m=shadowed(new T.Mesh(new T.SphereGeometry(r,16,12),typeof c==='object'?c:mat(c)),true);m.position.set(x,y,z);parent.add(m);return m;};
  const rod=(a,b,r,c,parent=P)=>{const av=new T.Vector3(...a),bv=new T.Vector3(...b);const m=cyl(r,r,av.distanceTo(bv),c,0,0,0,parent,8);m.position.copy(av.clone().add(bv).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),bv.sub(av).normalize());return m;};
  const sign=(text,w,h,x,y,z,bg='#173e31',fg='#ffffff',parent=P,ry=0)=>{
   const m=canvasPlane(w,h,(g,W,H)=>{g.fillStyle=bg;g.fillRect(0,0,W,H);g.strokeStyle=fg;g.lineWidth=6;g.strokeRect(12,12,W-24,H-24);g.fillStyle=fg;g.textAlign='center';g.textBaseline='middle';const lines=text.split('\n');g.font=`bold ${Math.min(110,H/(lines.length+1))}px Arial`;lines.forEach((s,i)=>g.fillText(s,W/2,H*(i+1)/(lines.length+1),W-54));});
   m.position.set(x,y,z);m.rotation.y=ry;parent.add(m);return m;};
  const flat=(w,d,c,x,z,y=.012,parent=P,opacity=1)=>{const m=new T.Mesh(new T.PlaneGeometry(w,d),new T.MeshStandardMaterial({color:c,roughness:.9,transparent:opacity<1,opacity}));m.rotation.x=-Math.PI/2;m.position.set(x,y,z);m.receiveShadow=true;parent.add(m);return m;};
  const disc=(r,c,x,z,y=.014,parent=P,opacity=1)=>{const m=new T.Mesh(new T.CircleGeometry(r,28),new T.MeshStandardMaterial({color:c,roughness:.15,metalness:.2,transparent:opacity<1,opacity}));m.rotation.x=-Math.PI/2;m.position.set(x,y,z);parent.add(m);return m;};
  const cone=(x,z,parent=P)=>{const c=new T.Group();c.position.set(x,0,z);parent.add(c);cyl(.05,.2,.6,'#f07a28',0,.3,0,c);cyl(.11,.13,.08,'#f4f1e6',0,.38,0,c);box(.42,.04,.42,'#23282c',0,.02,0,c);return c;};
  // Fita de isolamento entre pontos, com cones nas pontas.
  const cordon=(pts,parent=P)=>{const g=new T.Group();parent.add(g);pts.forEach(([x,z])=>cone(x,z,g));for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];rod([a[0],.55,a[1]],[b[0],.55,b[1]],.014,'#f5c518',g);}return g;};
  const group=()=>{const g=new T.Group();P.add(g);return g;};
  const item=(name,obj,def=false)=>{out.items[name]={obj,def};obj.visible=def;return obj;};
  // Cartaz do mapa de riscos (círculos coloridos sobre a planta).
  const riskPoster=(title,w,h,x,y,z,parent=P)=>{const m=canvasPlane(w,h,(g,W,H)=>{g.fillStyle='#f6f6f2';g.fillRect(0,0,W,H);g.fillStyle='#173e31';g.fillRect(0,0,W,H*.16);g.fillStyle='#fff';g.font=`bold ${H*.09}px Arial`;g.textAlign='center';g.fillText(title,W/2,H*.115,W-30);
    g.strokeStyle='#9aa4a8';g.lineWidth=4;g.strokeRect(W*.08,H*.24,W*.84,H*.56);g.beginPath();g.moveTo(W*.45,H*.24);g.lineTo(W*.45,H*.8);g.moveTo(W*.45,H*.5);g.lineTo(W*.92,H*.5);g.stroke();
    [['#2e9e4f',.22,.4,.1],['#d6362b',.62,.36,.075],['#f2c21c',.3,.66,.06],['#2a6fd6',.72,.66,.1],['#8a5a2b',.56,.6,.035]].forEach(([c,cx,cy,r])=>{g.fillStyle=c;g.beginPath();g.arc(W*cx,H*cy,H*r,0,7);g.fill();});
    g.font=`${H*.05}px Arial`;g.fillStyle='#23282c';g.textAlign='left';['Físico','Químico','Biológico','Ergonômico','Acidente'].forEach((t,i)=>{g.fillStyle=['#2e9e4f','#d6362b','#8a5a2b','#f2c21c','#2a6fd6'][i];g.fillRect(W*(.06+i*.185),H*.87,H*.05,H*.05);g.fillStyle='#23282c';g.fillText(t,W*(.06+i*.185)+H*.065,H*.915,W*.13);});},640);
   m.position.set(x,y,z);parent.add(m);return m;};
  const easel=(x,z,parent=P)=>{rod([x-.5,0,z-.25],[x-.35,1.9,z-.02],.03,'#6b747a',parent);rod([x+.5,0,z-.25],[x+.35,1.9,z-.02],.03,'#6b747a',parent);};
  const table=(s,c='#d8cfb7',h=.78)=>{box(s.w,.06,s.d,c,s.x,h,s.z);for(const dx of [-s.w/2+.12,s.w/2-.12])box(.07,h,s.d-.2,'#5e666b',s.x+dx,h/2,s.z);};
  const board=(s,title,lines)=>{rod([s.x-1.1,0,s.z],[s.x-1.1,2.5,s.z],.05,'#6b747a');rod([s.x+1.1,0,s.z],[s.x+1.1,2.5,s.z],.05,'#6b747a');box(2.4,1.3,.08,'#3a4349',s.x,1.85,s.z+.08);
   const m=canvasPlane(2.3,1.2,(g,W,H)=>{g.fillStyle='#10303f';g.fillRect(0,0,W,H);g.fillStyle='#f5c948';g.fillRect(0,0,W,H*.2);g.fillStyle='#10303f';g.font=`bold ${H*.12}px Arial`;g.textAlign='left';g.fillText(title,W*.03,H*.145,W*.94);g.fillStyle='#e8f1f5';g.font=`${H*.095}px Arial`;lines.forEach((t,i)=>g.fillText(t,W*.03,H*(.34+i*.15),W*.94));},1024);
   m.material.emissive=new T.Color('#ffffff');m.material.emissiveMap=m.material.map;m.material.emissiveIntensity=.3;m.position.set(s.x,1.85,s.z+.14);P.add(m);};
  return {box,cyl,sphere,rod,sign,flat,disc,cone,cordon,group,item,riskPoster,easel,table,board};
 }
 // ---- Terreno comum: gramado, via ao norte e calçada ----
 const grassMat=new T.MeshStandardMaterial({map:TX.grass,roughness:1});
 const grass=new T.Mesh(new T.PlaneGeometry(320,240),grassMat);grass.rotation.x=-Math.PI/2;grass.position.y=-.32;grass.receiveShadow=true;scene.add(grass);
 const asphaltMat=new T.MeshStandardMaterial({map:TX.asphalt,normalMap:TX.asphaltN,normalScale:new T.Vector2(.6,.6),color:'#8d9498',roughness:.95});
 const road=new T.Mesh(new T.BoxGeometry(240,.3,6),asphaltMat);road.position.set(0,-.17,-16.4);road.receiveShadow=true;scene.add(road);
 {const S=tools(scene);for(let x=-110;x<112;x+=3)S.box(1.4,.02,.14,'#e9e2c8',x,-.015,-16.4);S.box(240,.12,2,'#b7b4aa',0,-.06,-12.6);}
 out.groundMats.push(grassMat,asphaltMat);
 function tree(x,z,s=1){const g=new T.Group();g.position.set(x,0,z);scene.add(g);const S=tools(g);S.cyl(.2*s,.28*s,3*s,'#5b4632',0,1.5*s,0,g,10);
  const foliage=new T.Group();foliage.position.y=3*s;g.add(foliage);for(const [dx,dy,dz,r,c] of [[0,.8,0,1.5,'#4f7a3f'],[.9,.1,.3,1.1,'#5a8845'],[-.9,.2,-.2,1.15,'#476f39'],[.1,1.6,.2,.95,'#5f9148']])S.sphere(r*s,c,dx*s,dy*s,dz*s,foliage);
  out.trees.push({g,foliage,seed:Math.random()*6});}

 const S=tools(scene);const R=k=>ST[k];
 const floor=new T.MeshStandardMaterial({map:TX.concrete,normalMap:TX.concreteN,normalScale:new T.Vector2(.5,.5),color:'#c8cac4',roughness:.88});
 const slab=new T.Mesh(new T.BoxGeometry(LOT.halfW*2+.6,.3,LOT.halfD*2+.6),floor);slab.position.set(0,-.15,0);slab.receiveShadow=true;scene.add(slab);out.groundMats.push(floor);
 for(const [x,z] of [[-17,-6],[17,-4],[-17,6],[17,7]])tree(x,z,1.2);
 // Galpão sem teto: parede do fundo e laterais baixas, com pilares.
 const wallM=new T.MeshStandardMaterial({map:TX.wall,color:'#d9dcd6',roughness:.9});
 S.box(LOT.halfW*2+.6,3.4,.3,wallM,0,1.7,-LOT.halfD-.15);for(const sx of [-1,1]){S.box(.3,1.3,LOT.halfD*2+.6,wallM,sx*(LOT.halfW+.15),.65,0);for(let z=-11;z<12;z+=5.5)S.box(.4,3.4,.4,'#8e979c',sx*(LOT.halfW+.15),1.7,z);}
 S.box(LOT.halfW*2+.6,.5,.34,'#f2c21c',0,3.15,-LOT.halfD-.12);
 // Faixas de circulação.
 for(let x=-12;x<12.5;x+=1.2)S.flat(.6,.12,'#f2c230',x,3.2);for(let z=-4.6;z<3;z+=1.2)S.flat(.12,.6,'#f2c230',6.6,z);
 S.sign('NR 6 • EQUIPAMENTO DE PROTEÇÃO INDIVIDUAL\nMETALÚRGICA • PRODUÇÃO',5.2,1,-9.6,.9,11.2,'#10303f','#f5c948');S.rod([-12,0,11.15],[-12,1.3,11.15],.05,'#6b747a');S.rod([-7.2,0,11.15],[-7.2,1.3,11.15],.05,'#6b747a');
 // Peças de EPI usadas no almoxarifado, na bancada e no armário.
 const helmetAt=(x,y,z,c,parent)=>{const m=new T.Mesh(new T.SphereGeometry(.15,18,10,0,Math.PI*2,0,Math.PI/2),mat(c,.1,.4));m.position.set(x,y,z);m.castShadow=true;parent.add(m);S.cyl(.17,.17,.02,c,x,y+.005,z,parent,18);return m;};
 const gogglesAt=(x,y,z,parent,c='#9fe3ff')=>{S.box(.2,.06,.05,c,x,y+.03,z,parent,.3);S.box(.22,.015,.06,'#1d2427',x,y+.065,z,parent);};
 const bootsAt=(x,y,z,parent)=>{for(const dx of [-.09,.09]){S.box(.11,.14,.26,'#2b2622',x+dx,y+.07,z,parent);S.box(.11,.1,.12,'#2b2622',x+dx,y+.19,z-.07,parent);}};
 // ---- Almoxarifado de EPI ----
 {const b=R('balcao');S.box(b.w,1,b.d,'#c9a16b',b.x,.5,b.z);S.box(b.w+.1,.06,b.d+.1,'#e7dcc3',b.x,1.03,b.z);S.sign('ALMOXARIFADO DE EPI',3.4,.4,b.x,.55,b.z+.41,'#173e31','#ffffff');
  for(const k of ['estante','estanteL']){const e=R(k);S.box(e.w,2.2,e.d,'#6b747a',e.x,1.1,e.z,undefined,.3);}
  {const e=R('estante');const cols=['#e8aa21','#f2f2ec','#2f7fb8','#d6362b','#2f8a57'];for(let i=0;i<9;i++){const x=e.x-2.3+i*.58;helmetAt(x,2.2,e.z,cols[i%5],scene);S.box(.44,.3,.5,i%2?'#b98a56':'#a87c4c',x,1.5,e.z+.2);S.box(.44,.3,.5,i%3?'#a87c4c':'#b98a56',x,.9,e.z+.2);}
   S.sign('SÓ EPI COM CA',2.2,.34,e.x,2.75,e.z+.42,'#1f5fa0','#ffffff');}
  const kit=S.group();helmetAt(b.x-1.3,1.06,b.z,'#e8aa21',kit);gogglesAt(b.x-.6,1.06,b.z,kit);S.box(.16,.08,.12,'#f07a28',b.x,1.1,b.z,kit);S.cyl(.02,.02,.05,'#f5c518',b.x+.2,1.09,b.z,kit,8);bootsAt(b.x+.9,1.06,b.z,kit);S.sign('SEU KIT',.7,.2,b.x+1.6,1.25,b.z,'#25ddff','#111',kit);S.item('kit',kit);
  const f=S.group();S.box(.34,.012,.46,'#f6f6f2',b.x+.2,1.065,b.z,f);S.box(.2,.004,.02,'#1f5fa0',b.x+.2,1.075,b.z+.15,f);S.sign('FICHA DE EPI\nASSINADA ✓',.9,.42,b.x+1.5,1.35,b.z,'#2f8a57','#ffffff',f);S.item('ficha',f);
  const f2=S.group();S.sign('EXTRAVIO COMUNICADO\nPROTETOR REPOSTO ✓',1.5,.42,b.x-1.2,1.35,b.z,'#2f8a57','#ffffff',f2);S.item('ficha2',f2);}
 // ---- Prensa com enclausuramento (proteção coletiva) ----
 {const p=R('prensa');S.box(1.5,1,1.2,'#3a6f9f',p.x,.5,p.z,undefined,.4);S.box(1.5,1.5,.5,'#3a6f9f',p.x,1.75,p.z-.35,undefined,.4);S.box(1.3,.3,.9,'#2a4e73',p.x,2.6,p.z-.1,undefined,.4);S.cyl(.2,.2,.9,'#c9d1d4',p.x,1.55,p.z+.1,undefined,14);
  const cage=new T.MeshStandardMaterial({color:'#f2c21c',transparent:true,opacity:.28,roughness:.4,side:T.DoubleSide,depthWrite:false});
  for(const [w,d,dx,dz] of [[p.w,.04,0,p.d/2],[.04,p.d,-p.w/2,0],[.04,p.d,p.w/2,0]]){const m=new T.Mesh(new T.BoxGeometry(w,2,d),cage);m.position.set(p.x+dx,1.05,p.z+dz);scene.add(m);}
  for(const dx of [-1,1])for(const dz of [-1,1])S.rod([p.x+dx*p.w/2,0,p.z+dz*p.d/2],[p.x+dx*p.w/2,2.1,p.z+dz*p.d/2],.035,'#d9a116');for(const dx of [-1,1])S.rod([p.x+dx*p.w/2,2.08,p.z-p.d/2],[p.x+dx*p.w/2,2.08,p.z+p.d/2],.03,'#d9a116');S.rod([p.x-p.w/2,2.08,p.z+p.d/2],[p.x+p.w/2,2.08,p.z+p.d/2],.03,'#d9a116');
  S.sign('PRENSA ENCLAUSURADA\nPROTEÇÃO COLETIVA',1.9,.5,p.x,2.45,p.z+p.d/2+.03,'#2f8a57','#ffffff');}
 // ---- Área de ruído: esmeril ----
 {const n=noise,x0=n.x-n.w/2,x1=n.x+n.w/2,z0=n.z-n.d/2,z1=n.z+n.d/2;S.flat(n.w,n.d,'#f2c21c',n.x,n.z,.012,undefined,.12);S.flat(n.w,.14,'#f2c21c',n.x,z1,.016);S.flat(.14,n.d,'#f2c21c',x0,n.z,.016);S.flat(.14,n.d,'#f2c21c',x1,n.z,.016);
  S.rod([x0,0,z1],[x0,2,z1],.04,'#6b747a');S.sign('USO OBRIGATÓRIO\nPROTETOR AUDITIVO',1.7,.6,x0+.9,1.75,z1,'#1f5fa0','#ffffff');S.rod([x0+1.8,0,z1],[x0+1.8,2,z1],.04,'#6b747a');
  const e=R('esmeril');S.table(e,'#8e979c',.85);for(const x of [1.9,4.3]){S.box(.34,.3,.3,'#3a8f5a',x,1.05,e.z,undefined,.4);for(const dx of [-.27,.27]){const w=S.cyl(.16,.16,.06,'#b7b4aa',x+dx,1.1,e.z,undefined,18);w.rotation.z=Math.PI/2;}S.box(.5,.14,.3,'#2b3033',x,.93,e.z);}
  S.sign('ESMERIL',1,.24,e.x,1.9,e.z-.3,'#23282c','#f5c948');
  const g=S.group();const gl=glowSprite('#ffb347',.9);gl.position.set(2.17,1.12,e.z+.2);g.add(gl);const l=new T.PointLight('#ffb347',3,5,1.6);l.position.set(2.17,1.3,e.z+.5);g.add(l);S.item('faisca',g);}
 // ---- Bancada de peças e coletor de EPI danificado ----
 {const b=R('bancada');S.table(b,'#d8cfb7',.85);for(const [dx,dz,w] of [[-.7,0,.3],[-.2,.1,.4],[.6,-.1,.34]])S.box(w,.12,.24,'#8e979c',b.x+dx,.94,b.z+dz,undefined,.7);
  S.cyl(.3,.26,.8,'#d6362b',b.x+1.9,.4,b.z,undefined,16);S.sign('EPI DANIFICADO',.9,.22,b.x+1.9,1.05,b.z+.31,'#d6362b','#ffffff');
  const t=S.group();gogglesAt(b.x+.2,.88,b.z+.25,t,'#ff8f7a');S.sign('LENTE TRINCADA',.9,.22,b.x+.2,1.35,b.z+.25,'#d6362b','#ffffff',t);S.item('trinca',t);
  const o=S.group();S.sign('ÓCULOS SUBSTITUÍDOS ✓',1.3,.24,b.x,1.35,b.z+.25,'#2f8a57','#ffffff',o);S.item('oculosNovo',o);}
 // ---- Bancada de tintas e produtos químicos ----
 {const t=R('tintas');S.table(t,'#c9ced1',.85);for(const [dx,c] of [[-.9,'#d6362b'],[-.5,'#2a6fd6'],[-.1,'#f2c21c'],[.5,'#f2f2ec'],[.9,'#2f8a57']])S.cyl(.12,.12,.26,c,t.x+dx,1.01,t.z,undefined,14);
  S.sign('TINTAS E SOLVENTES',2.2,.3,t.x,1.8,t.z-.3,'#8f5a10','#ffffff');S.rod([t.x-1.1,.8,t.z-.35],[t.x-1.1,1.95,t.z-.35],.03,'#7a858b');S.rod([t.x+1.1,.8,t.z-.35],[t.x+1.1,1.95,t.z-.35],.03,'#7a858b');
  const d=R('tambores');for(const [dx,dz,c] of [[-.38,-.3,'#2a6fd6'],[.38,-.3,'#d6362b'],[0,.4,'#2a6fd6']]){S.cyl(.33,.33,.95,c,d.x+dx,.48,d.z+dz,undefined,18);S.cyl(.34,.34,.04,'#c9d1d4',d.x+dx,.72,d.z+dz,undefined,18);}
  S.sign('SOLVENTE\nINFLAMÁVEL',.9,.5,d.x,1.5,d.z+.78,'#d6362b','#ffffff');S.rod([d.x,0,d.z+.76],[d.x,1.25,d.z+.76],.03,'#6b747a');
  const a=R('armarioResp');S.box(a.w,1.8,a.d,'#e9e4d6',a.x,.9,a.z,undefined,.2);S.sign('RESPIRADORES',1.3,.24,a.x-.36,1.5,a.z,'#1f5fa0','#ffffff',undefined,-Math.PI/2);}
 // ---- Mezanino a 3 m, com escada, ponto de ancoragem e trecho sem guarda-corpo ----
 {const m=mezz,x0=m.x-m.w/2,x1=m.x+m.w/2,z0=m.z-m.d/2,z1=m.z+m.d/2;S.box(m.w,.16,m.d,'#7d868b',m.x,m.h,m.z,undefined,.5);for(const x of [x0+.2,x1-.2])for(const z of [z0+.2,z1-.2])S.box(.22,m.h,.22,'#5e666b',x,m.h/2,z,undefined,.5);
  const rail=(a,b)=>{for(const y of [.55,1.1])S.rod([a[0],m.h+y,a[1]],[b[0],m.h+y,b[1]],.03,'#f2c21c');for(const p of [a,b])S.rod([p[0],m.h,p[1]],[p[0],m.h+1.1,p[1]],.035,'#f2c21c');};
  rail([x0,z0],[x1,z0]);rail([x0,z0],[x0,z1]);rail([x1,z0],[x1,z1]);rail([x0,z1],[m.x-1.3,z1]);
  for(const dx of [-.28,.28])S.rod([m.x+dx,0,z1+.75],[m.x+dx,m.h+1,z1+.05],.035,'#d9a116');for(let i=1;i<10;i++){const k=i/10.5;S.rod([m.x-.28,k*(m.h+1),z1+.75-k*.7],[m.x+.28,k*(m.h+1),z1+.75-k*.7],.022,'#d9a116');}
  S.sign('MEZANINO • 3 m\nRISCO DE QUEDA',1.8,.5,m.x-1.7,2.4,z1+.03,'#f2c21c','#111');S.box(.5,.1,.16,'#f6f6f2',m.x+1.6,m.h+2.2,m.z);S.rod([m.x+1.6,m.h+2.25,m.z],[m.x+1.6,m.h+3,m.z],.012,'#23282c');
  S.rod([m.x+.9,m.h,z1-.3],[m.x+.9,m.h+2.1,z1-.3],.05,'#d6362b');S.sphere(.08,'#d6362b',m.x+.9,m.h+2.1,z1-.3);
  const g=S.group();S.rod([m.x+.9,m.h+2.05,z1-.3],[m.x+1.6,m.h+1.15,z1-.5],.018,'#25ddff',g);S.rod([m.x-1.3,m.h+1.1,z1],[x1,m.h+1.1,z1],.02,'#25ddff',g);S.sign('TALABARTE ANCORADO ✓',1.6,.26,m.x+1.6,2.4,z1+.03,'#2f8a57','#ffffff',g);S.item('talabarte',g);}
 // ---- Posto de solda ----
 {const b=R('solda');S.table(b,'#6b747a',.85);S.box(.5,.6,.7,'#c62b20',b.x+.05,.3,b.z-1.5,undefined,.3);S.box(.4,.08,.5,'#8e979c',b.x-.1,.93,b.z);const gl=glowSprite('#9fd8ff',.5);gl.position.set(b.x-.25,1.02,b.z);scene.add(gl);
  const w=R('biombo');const cm=new T.MeshStandardMaterial({color:'#e2732a',transparent:true,opacity:.5,roughness:.6,side:T.DoubleSide});const c=new T.Mesh(new T.BoxGeometry(w.w,1.7,.05),cm);c.position.set(w.x,1.05,w.z);scene.add(c);for(const dx of [-w.w/2,0,w.w/2])S.rod([w.x+dx,0,w.z],[w.x+dx,2,w.z],.04,'#5e666b');S.sign('SOLDA',1,.26,w.x,2.1,w.z+.04,'#23282c','#f5c948');}
 // ---- Quadro de treinamento ----
 S.board(R('board'),'NR 6 • SEU EPI',['Só com CA (6.4.1)','Gratuito e registrado (6.5.1)','Use para a finalidade certa','Limpe, guarde e conserve','Avise dano ou extravio (6.6.1)']);
 // ---- Vestiário: armários individuais e pia ----
 {const a=R('armarios');for(let i=0;i<4;i++){const x=a.x-1.2+i*.8;S.box(.76,1.9,a.d,i===1?'#3a8fcf':'#8fa4b3',x,.95,a.z,undefined,.4);S.box(.04,.2,.03,'#23282c',x+.26,1,a.z+a.d/2+.02);}
  S.sign('VESTIÁRIO • ARMÁRIOS',2.4,.26,a.x,2.1,a.z+.2,'#10303f','#f5c948');
  const g=S.group();helmetAt(a.x-.4,1.9,a.z,'#e8aa21',g);S.sign('EPI LIMPO E GUARDADO ✓',1.6,.26,a.x-.4,2.5,a.z+.2,'#2f8a57','#ffffff',g);S.item('guardado',g);
  const p=R('pia');S.box(p.w,.85,p.d,'#e9e4d6',p.x,.43,p.z);S.box(p.w-.2,.06,p.d-.2,'#9fd0e6',p.x,.87,p.z);S.rod([p.x,.86,p.z-.25],[p.x,1.15,p.z-.25],.025,'#c9d1d4');S.sign('HIGIENIZAÇÃO',1,.2,p.x,1.45,p.z-.3,'#1f5fa0','#ffffff');}
 out.mats=mats;
 return out;
}
