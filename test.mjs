import assert from 'node:assert/strict';
import * as r from './dist/rules.mjs';
import {phaseOf,findRoute,walkableGrid} from './dist/crew.mjs';
import {staticObstacles,bounds,start,spots,rosters,people,playerLook,wornLook,noise,mezz} from './dist/layout.mjs';
const IDS={operador:['hierarquia','ca','ficha','treinamento','ajuste','tarefa','conforto','dano','lentes','finalidade','respirador','altura','alteracao','higiene','extravio']};
const m='operador';
const correctOf=o=>o.choices.find(c=>c.correct);
const pos=id=>r.indexOf(m,id);
const obj=id=>r.objectivesOf(m)[pos(id)];
const at=id=>({...r.initialState(m),step:pos(id),completed:IDS[m].slice(0,pos(id))});
const after=id=>({...r.initialState(m),step:pos(id)+1,completed:IDS[m].slice(0,pos(id)+1),finished:pos(id)+1===IDS[m].length});

// 1. Módulo, ordem e quantidade das etapas
assert.deepEqual(r.MODULE_IDS,[m]);
assert.deepEqual(r.objectivesOf(m).map(o=>o.id),IDS[m],'Ordem das etapas');assert.equal(new Set(IDS[m]).size,15);
{const M=r.MODULES[m];assert.ok(M.name&&M.course&&M.role&&M.intro&&M.summary&&M.place&&M.short);assert.ok(rosters[m]&&playerLook[m]);}

// 2. Cada decisão: três opções, uma única correta, feedback didático em todas
for(const o of r.objectivesOf(m)){
 assert.ok(o.title&&o.description&&o.tip,`${o.id}: título, descrição e dica`);
 assert.equal(o.choices.length,3,`${o.id}: três opções`);
 assert.equal(o.choices.filter(c=>c.correct).length,1,`${o.id}: uma única correta`);
 assert.equal(new Set(o.choices.map(c=>c.id)).size,3,`${o.id}: ids das opções únicos`);
 for(const c of o.choices)assert.ok(c.label&&c.feedback&&c.feedback.length>25,`${o.id}/${c.id}: feedback didático`);
}

// 3. Referências: origem válida e itens da NR 6 conferidos no texto em vigor
// (Portaria MTP 2.175/2022, alterada pelas Portarias MTP 4.219/2022 e MTE 57/2025).
const NR6=['6.3.1','6.3.2','6.4.1','6.5.1','6.5.1.1','6.5.1.2','6.5.1.2.1','6.5.1.3','6.5.2','6.5.2.1','6.5.2.1.1','6.5.2.2','6.5.2.3','6.5.3','6.5.4','6.6.1','6.7.1','6.7.2','6.7.2.1',
 '6.8.1','6.8.1.1','6.8.1.2','6.9.1','6.9.2','6.9.2.1','6.9.2.1.1','6.9.3','6.9.3.1','6.9.4','6.9.5','6.10.1'];
const ALINEAS={'6.5.1':'abcdefgh','6.5.2':'abcdefg','6.6.1':'abcde','6.7.2':'abcdef','6.8.1':'abcde'};
const ANEXO_I={A:['A.1','A.2'],B:['B.1','B.2','B.3'],C:['C.1'],D:['D.1','D.2','D.3','D.4','D.5'],E:['E.1'],F:['F.1','F.2','F.3','F.4'],G:['G.1','G.2','G.3','G.4'],H:['H.1','H.2'],I:['I.1','I.2']};
for(const o of r.objectivesOf(m)){
 assert.ok(o.refs?.length>=1,`${o.id}: referência`);
 for(const ref of o.refs){assert.ok(ref.norm&&ref.item,`${o.id}: norma e item`);assert.ok(r.KINDS[ref.kind],`${o.id}: origem válida`);
  if(ref.norm==='NR 6'){const n=ref.item.match(/^6(\.\d+)+/);assert.ok(n&&NR6.includes(n[0]),`${o.id}: item da NR 6 conferido (${ref.item})`);assert.equal(ref.kind,'vigente');assert.ok(!ref.check);
   const al=[...ref.item.matchAll(/\b([a-h])\)/g)];if(ALINEAS[n[0]]&&n[0]!=='6.5.1.1')for(const a of al)assert.ok(ALINEAS[n[0]].includes(a[1]),`${o.id}: alínea existente (${ref.item})`);
   if(!ALINEAS[n[0]])assert.equal(al.length,0,`${o.id}: item sem alíneas (${ref.item})`);}
  if(ref.norm==='NR 6 • Anexo I'){const it=ref.item.match(/^([A-I])\.\d/);assert.ok(it&&ANEXO_I[it[1]].includes(it[0]),`${o.id}: item do Anexo I (${ref.item})`);}
  if(/^(NR 1|NR 35|CLT)$/.test(ref.norm))assert.ok(ref.check,`${o.id}: item de outra norma pede conferência`);
  if(/Boa prática|Referência/.test(ref.norm))assert.equal(ref.kind,'pratica');
  assert.ok(/^(NR 6|NR 6 • Anexo I|NR 1|NR 35|CLT|Boa prática|Referência técnica)$/.test(ref.norm),`${o.id}: norma conhecida (${ref.norm})`);}
 assert.ok(r.refSummary(o).every(x=>x.label&&x.status));
}
// O jogo cobre todos os deveres do trabalhador (6.6.1 a–e) e os principais da organização (6.5.1 a–g).
const cited=item=>[...new Set(r.objectivesOf(m).flatMap(o=>o.refs).filter(x=>x.norm==='NR 6'&&x.item.startsWith(item+' ')).flatMap(x=>[...x.item.matchAll(/\b([a-h])\)/g)].map(a=>a[1])))].sort().join('');
assert.equal(cited('6.6.1'),'abcde','Todos os deveres do trabalhador');assert.equal(cited('6.5.1'),'abcdefg','Deveres da organização: a) a g)');
assert.ok(r.objectivesOf(m).some(o=>o.refs.some(x=>x.kind==='pratica')),'Há boa prática identificada');

// 4. Anexo I: grupos e catálogo de EPI coerentes
assert.deepEqual(Object.keys(r.GRUPOS).join(''),'ABCDEFGHI');
for(const [k,e] of Object.entries(r.EPI)){assert.ok(r.GRUPOS[e.grupo]&&e.nome,`${k}: grupo e nome`);assert.ok(ANEXO_I[e.grupo].includes(e.item)&&e.item.startsWith(e.grupo),`${k}: item do Anexo I`);}
for(const o of r.objectivesOf(m))for(const k of [...(o.need||[]),...(o.broken||[]),...(o.wear?.add||[]),...(o.wear?.remove||[]),...(o.enter?.add||[]),...(o.enter?.remove||[])])assert.ok(r.EPI[k],`${o.id}: EPI conhecido (${k})`);

// 5. Fluxo completo com erros
{let s=r.initialState(m);
 for(const o of r.objectivesOf(m)){
  assert.equal(r.interact(s,o.id).step,s.step,'Decisão exige escolha');
  for(const c of o.choices.filter(c=>!c.correct)){const n=r.answer(s,c.id);assert.equal(n.step,s.step,'Erro não avança');assert.equal(n.errors,s.errors+1);assert.equal(n.feedback,c.feedback);assert.deepEqual(r.wornOf(n),r.wornOf(s),'Erro não muda os EPI');s={...s,errors:n.errors};}
  const n=r.answer(s,correctOf(o).id);assert.equal(n.step,s.step+1);s=n;
 }
 assert.equal(s.finished,true);assert.equal(s.errors,30,'Dois erros por decisão');
 assert.deepEqual(r.wornOf(s),['capacete','oculos','auricular','luva','calcado'],'EPI no fim');}

// 6. EPI em uso e proteção exigida em cada etapa
const W=id=>r.wornOf(at(id)),PR=id=>r.protectionOf(at(id));
assert.deepEqual(r.wornOf(r.initialState(m)),[],'Começa sem EPI');assert.equal(r.protectionOf(r.initialState(m)).required,false);
assert.deepEqual(W('ficha'),[]);assert.deepEqual(W('treinamento'),['capacete','oculos','calcado'],'Kit recebido com registro');
{const p=PR('ajuste');assert.deepEqual(p.missing,['auricular']);assert.equal(p.groups.C,'falta');assert.equal(p.groups.A,'ok');assert.equal(p.ok,false);assert.match(p.label,/Falta: Protetor auditivo/);}
{const p=PR('tarefa');assert.deepEqual(p.missing,['facial','luva']);assert.equal(p.groups.B,'falta','Óculos sem o facial não bastam');assert.equal(p.groups.C,'ok');assert.equal(p.groups.F,'falta');}
{const p=PR('conforto');assert.ok(p.ok&&p.required);assert.equal(p.groups.F,'usa');assert.equal(p.label,'Proteção completa para a tarefa');}
{const p=PR('dano');assert.deepEqual(p.damaged,['oculos']);assert.equal(p.groups.B,'falta');assert.equal(p.ok,false);assert.match(p.label,/Danificado: Óculos/);assert.ok(PR('lentes').ok,'Óculos substituídos');}
{const p=PR('finalidade');assert.deepEqual(p.missing,['respirador','avental','luvaQuimica']);assert.equal(p.groups.F,'falta','Luva de couro não atende o risco químico');assert.ok(p.worn.includes('luva')&&!p.worn.includes('facial'));}
{const p=PR('respirador');assert.deepEqual(p.missing,['respirador']);assert.equal(p.groups.F,'ok');assert.equal(p.groups.E,'ok');assert.equal(p.groups.D,'falta');assert.ok(!p.worn.includes('luva'));}
{const p=PR('altura');assert.deepEqual(p.missing,['cinturao']);assert.equal(p.groups.I,'falta');assert.ok(!p.worn.includes('respirador')&&!p.worn.includes('avental')&&p.worn.includes('luva'));}
{const p=PR('alteracao');assert.ok(p.ok);assert.ok(!p.worn.includes('cinturao'));}
assert.ok(!W('extravio').includes('auricular'),'Protetor extraviado');assert.ok(r.wornOf(after('extravio')).includes('auricular'),'Protetor reposto');
assert.equal(PR('higiene').required,false);
// A resposta certa sempre resolve o que o painel mostra faltando.
for(const o of r.objectivesOf(m)){const p=r.protectionOf(at(o.id));if(!p.missing.length)continue;const w=o.wear?.add||[];
 const fixed=p.missing.filter(k=>w.includes(k));assert.ok(fixed.length>=1,`${o.id}: a resposta certa traz EPI que faltava`);}
for(const o of r.objectivesOf(m))for(const g of Object.keys(r.GRUPOS))assert.ok(['','ok','falta','usa'].includes(r.protectionOf(at(o.id)).groups[g]));
assert.equal(r.protectionOf(at('tarefa')).groups.H,'','Grupo H não é usado');
// Aparência do jogador acompanha os EPI.
assert.equal(wornLook([]).helmet,null);{const l=wornLook(['capacete','oculos','luvaQuimica','cinturao']);assert.ok(l.helmet&&l.goggles&&l.harness&&!l.respirator&&l.gloves==='#2fbf6b'&&!l.safetyBoots);assert.ok(wornLook(['calcado']).safetyBoots,'Calçado aparece no personagem');}
// Todo EPI tem pictograma (painel, aviso e placas do cenário).
{const {ICONS,iconSVG}=await import('./dist/icons.mjs');for(const k of Object.keys(r.EPI)){assert.ok(/^M[\d\s.a-zA-Z-]+$/.test(ICONS[k]),`Pictograma de ${k}`);assert.ok(iconSVG(k).includes(ICONS[k]));}assert.deepEqual(Object.keys(ICONS).sort(),Object.keys(r.EPI).sort());}

// 7. Conteúdo: pontos que os textos precisam afirmar
assert.match(correctOf(obj('hierarquia')).label,/última barreira/);assert.match(correctOf(obj('ca')).label,/número do CA/);assert.match(correctOf(obj('ficha')).label,/gratuito/);
assert.match(obj('ficha').tip,/gratuitamente/);assert.match(obj('lentes').tip,/sem ônus/);assert.match(correctOf(obj('dano')).label,/danificados/);assert.match(obj('extravio').tip,/substitui imediatamente/);
assert.ok(pos('ca')<pos('ficha')&&pos('ficha')<pos('treinamento')&&pos('treinamento')<pos('ajuste')&&pos('ajuste')<pos('tarefa')&&pos('finalidade')<pos('respirador'),'Ordem: CA, registro, orientação, uso');

// 8. Objetos do cenário
const ITEMS=['kit','ficha','ficha2','faisca','trinca','oculosNovo','talabarte','guardado'];
for(const k of r.MODULES[m].on||[])assert.ok(ITEMS.includes(k));
for(const o of r.objectivesOf(m)){for(const k of [...(o.fx?.show||[]),...(o.fx?.hide||[]),...(o.during||[])])assert.ok(ITEMS.includes(k),`${o.id}: objeto conhecido (${k})`);
 for(const k of o.fx?.show||[]){assert.ok(!r.visibleItems(at(o.id))[k],`${k}: oculto antes`);assert.ok(r.visibleItems(after(o.id))[k],`${k}: visível depois`);}
 for(const k of o.during||[]){assert.ok(r.visibleItems(at(o.id))[k],`${k}: visível durante ${o.id}`);assert.ok(!r.visibleItems(after(o.id))[k],`${k}: some depois`);}}
assert.ok(r.visibleItems(r.initialState(m)).kit&&!r.visibleItems(after('ficha')).kit,'Kit sai do balcão ao ser entregue');
{const used=new Set(r.objectivesOf(m).flatMap(o=>[...(o.fx?.show||[]),...(o.fx?.hide||[]),...(o.during||[])]));for(const k of ITEMS)assert.ok(used.has(k),`Objeto usado (${k})`);}

// 9. Planta e equipe: tudo livre e alcançável
const grid=walkableGrid(staticObstacles,bounds),free=p=>r.canMove(p.x,p.z,staticObstacles,bounds);
const reach=(from,target,radius)=>{const route=findRoute(from,target,staticObstacles,grid);if(!route.length)return false;const end=route.at(-1);return Math.hypot(end.x-target.x,end.z-target.z)<=radius;};
assert.ok(free(start),'Início livre');for(const [k,p] of Object.entries(spots))assert.ok(free(p),`Ponto ${k} livre`);
const inNoise=p=>Math.abs(p.x-noise.x)<noise.w/2&&Math.abs(p.z-noise.z)<noise.d/2;
assert.ok(inNoise(spots.esmeril)&&!inNoise(spots.ruido)&&!inNoise(spots.almox),'Área de ruído');assert.ok(inNoise(obj('tarefa'))&&!inNoise(obj('ajuste')),'O protetor é colocado antes de entrar na área');
assert.equal(r.canMove(mezz.x,mezz.z,staticObstacles,bounds),false,'Mezanino não é atravessado');assert.equal(mezz.h,3);assert.match(obj('altura').description,/3 metros/);
{const ids=IDS[m];
 for(const [n,p] of Object.entries(rosters[m])){assert.ok(people[n]&&p.role&&p.task&&p.look,`${n}: função, tarefa e aparência`);assert.ok(free(p),`${n}: posição livre`);
  for(const s of p.states){for(const k of ['cur','after','before'])if(s[k])assert.ok(ids.includes(s[k]),`${n}: etapa conhecida (${s[k]})`);if(s.at){assert.ok(free(s.at),`${n}: destino livre (${s.label})`);assert.ok(reach(p,s.at,.5),`${n}: rota (${s.label})`);}}}
 for(const o of r.objectivesOf(m)){const a=o.who?phaseOf(m,o.who,at(o.id)).at:o;assert.ok(a&&a.x!==undefined,`${o.id}: âncora`);assert.ok(reach(start,a,o.r??2),`${o.id}: destino acessível`);
  if(o.who)assert.ok(rosters[m][o.who],`${o.id}: pessoa existe`);}
 // Quem trabalha na área de ruído usa protetor auditivo.
 for(const [n,p] of Object.entries(rosters[m]))if(inNoise(p))assert.ok(p.look.earmuffs,`${n}: protetor auditivo na área de ruído`);
 assert.equal(phaseOf(m,'Davi',at('lentes')).gear,null);assert.deepEqual(phaseOf(m,'Davi',after('lentes')).gear,{goggles:true},'Davi passa a usar óculos');assert.equal(people.Davi.look.goggles,'hidden');
 assert.equal(phaseOf(m,'Tião',at('alteracao')).tone,'alerta');assert.equal(phaseOf(m,'Tião',after('alteracao')).tone,'ok');}
console.log(`PASS: ${r.MODULES[m].name} (${r.objectivesOf(m).length} etapas) — uma resposta certa por decisão, itens da NR 6 em vigor, deveres do trabalhador e da organização, Anexo I, EPI exigido e em uso em cada etapa, objetos do cenário, equipe e acessibilidade`);
