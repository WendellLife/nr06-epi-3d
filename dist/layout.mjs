// Planta da metalúrgica (vista sem teto): almoxarifado de EPI, prensa enclausurada, área de ruído com o esmeril,
// bancada de peças, bancada de tintas, mezanino, posto de solda, quadro de treinamento e vestiário.
// Usado pelo cenário 3D (scenery.mjs, game.mjs) e pelos testes, para garantir que todo destino é alcançável.
export const LOT = {halfW:13.4,halfD:11.4};
export const bounds = {minX:-LOT.halfW,maxX:LOT.halfW,minZ:-LOT.halfD,maxZ:LOT.halfD};
const wall = (x,z,w,d) => ({x,z,w,d});
// Área de ruído (uso obrigatório de protetor auditivo), marcada no piso.
export const noise = {x:3,z:-8.2,w:6.4,d:5.2};
// Mezanino: plataforma a 3 m, com escada na frente.
export const mezz = {x:9.9,z:-9.2,w:5.2,d:3.2,h:3};
export const structures = {
 balcao:wall(-8,-7.2,4.2,.8),estante:wall(-8,-10.3,5.6,.8),estanteL:wall(-11.2,-8.7,.8,2.2),
 prensa:wall(-4.6,-1.6,2.2,1.7),
 esmeril:wall(3,-9.4,4.6,.9),bancada:wall(-2,-5.4,2.2,.9),
 mezanino:wall(mezz.x,mezz.z,mezz.w,mezz.d),
 tintas:wall(10,-1.6,2.6,.9),tambores:wall(12.3,-3.6,1.5,1.5),armarioResp:wall(12.6,-.6,.7,1.6),
 solda:wall(11.7,6.4,.9,2.2),biombo:wall(9.9,4.5,4.4,.2),
 board:wall(-9.5,5.2,2.4,.3),armarios:wall(-4,6.1,3.2,.7),pia:wall(-1.4,6.1,1.1,.7)
};
export const staticObstacles = Object.values(structures);
export const start = {x:1.6,z:8.8};
export const spots = {
 almox:{x:-8,z:-5.9},prensa:{x:-4.6,z:.2},board:{x:-9.5,z:6.5},ruido:{x:3,z:-5.1},esmeril:{x:1.9,z:-8.1},bancada:{x:-2,z:-4.2},
 quimica:{x:10,z:-.4},altura:{x:9.9,z:-6.7},solda:{x:10.2,z:6.4},armario:{x:-4,z:7.3}
};
const U={pants:'#3b4a5a',shoes:'#2b2622',helmet:'#e8aa21',vest:null,gloves:null};
// Aparência e função de cada pessoa. Os EPI extras (óculos, protetor auditivo, respirador…) são desenhados por characters.mjs.
export const people = {
 Carla:{role:'Técnica de segurança',look:{body:'female',surface:'#e9e4d6',skin:'#c68642',...U,helmet:'#f2f2ec',vest:'#2f8a57',goggles:true,backLabel:{text:'SEGURANÇA',bg:'#173e31'}}},
 Ivone:{role:'Almoxarife',look:{body:'female',surface:'#4a6fa5',skin:'#8d5524',...U,helmet:null}},
 Jorge:{role:'Supervisor de produção',look:{body:'male',surface:'#2f6f8f',skin:'#e0ac69',beard:true,...U,helmet:'#2f7fb8',goggles:true,earmuffs:true}},
 Davi:{role:'Operador de produção',look:{body:'male',surface:'#c8772b',skin:'#f1c27d',...U,gloves:'#b08a55',goggles:'hidden',earmuffs:true}},
 Lia:{role:'Pintora',look:{body:'female',surface:'#dfe5e8',skin:'#e0ac69',...U,helmet:null,goggles:true,respirator:true,apron:'#3d6b4f',gloves:'#2f8a57'}},
 'Tião':{role:'Soldador',look:{body:'male',surface:'#5a5148',skin:'#8d5524',...U,helmet:'#c96a2b',goggles:true,apron:'#7a5a36',gloves:'#7a5a36'}}
};
const P=(name,x,z,angle,pose,task,states=[])=>[name,{...people[name],x,z,angle,pose,task,states:states.map(s=>s.at?{...s,at:{x:s.at[0],z:s.at[1]}}:s)}];
export const rosters = {
 operador:Object.fromEntries([
  P('Carla',-3,.3,-Math.PI/2,'inspect','Conferindo a proteção da prensa',[{cur:'hierarquia',label:'“Onde o EPI entra na prevenção?”',tone:'info',pose:'point'},{after:'ca',label:'Orientação sobre os EPI do kit',tone:'info',pose:'point',at:[-8,6.5],angle:0},{after:'treinamento',label:'Ronda de segurança',tone:'info',pose:'inspect',at:[-.4,1.6],angle:Math.PI},{after:'alteracao',label:'Recolheu o capacete alterado',tone:'ok',pose:'inspect',at:[8.2,5.8],angle:Math.PI/2}]),
  P('Ivone',-8,-8.3,0,'type','Almoxarifado de EPI',[{cur:'ficha',label:'“Confira e assine a sua ficha”',tone:'info',pose:'point'},{cur:'extravio',label:'“Perdeu? Vamos registrar outro”',tone:'info',pose:'point'}]),
  P('Jorge',5.4,-4.2,Math.PI,'inspect','Supervisionando a produção',[{cur:'conforto',label:'“Protetor no ouvido, pessoal!”',tone:'alerta',pose:'point'},{after:'conforto',label:'Pediu outro modelo de protetor para você',tone:'ok',pose:'phone'},{after:'dano',label:'Supervisionando a produção',tone:'info',pose:'inspect'},{cur:'altura',label:'“Troca a lâmpada do mezanino?”',tone:'info',pose:'point',at:[7.6,-5.6],angle:Math.PI/2}]),
  P('Davi',4.3,-8.2,Math.PI,'repair','Rebarbando peças',[{cur:'lentes',label:'Sem óculos de segurança!',tone:'alerta',pose:'none',at:[4.3,-7.4],angle:0},{after:'lentes',label:'Com óculos de sobrepor',tone:'ok',pose:'repair',gear:{goggles:true}}]),
  P('Lia',8.2,-.6,Math.PI/2,'spray','Preparando tinta',[{cur:'finalidade',label:'“Passa o solvente do tambor?”',tone:'info',pose:'point'}]),
  P('Tião',10.6,6.4,Math.PI/2,'repair','Soldando suportes',[{cur:'alteracao',label:'“Quer que eu fure o seu também?”',tone:'alerta',pose:'point'},{after:'alteracao',label:'Capacete novo, sem furos',tone:'ok',pose:'repair'}])
 ])
};
// Uniforme do jogador. Os EPI que ele veste vêm das regras (wornOf) e são aplicados pelo jogo.
export const playerLook = {operador:{body:'male',surface:'#c8772b',skin:'#c68642',...U,helmet:null,armband:'#25ddff'}};
// Como cada EPI aparece no personagem do jogador.
export const wornLook = worn => ({
 helmet:worn.includes('capacete')?'#e8aa21':null,goggles:worn.includes('oculos'),faceShield:worn.includes('facial'),earmuffs:worn.includes('auricular'),
 respirator:worn.includes('respirador'),apron:worn.includes('avental')?'#3d6b4f':null,harness:worn.includes('cinturao'),
 gloves:worn.includes('luvaQuimica')?'#2f8a57':worn.includes('luva')?'#b08a55':null
});
export const W = bounds;
