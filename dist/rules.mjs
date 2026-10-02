// Regras do jogo NR 6 • Equipamentos de Proteção Individual (EPI), no mesmo padrão dos demais jogos da série.
// O cenário é o primeiro dia de um operador de produção em uma metalúrgica.
// Cada etapa traz as referências normativas em "refs". O campo "kind" diz de onde vem o conteúdo:
//  vigente → NR 6 em vigor (redação da Portaria MTP 2.175/2022, com as alterações das Portarias MTP 4.219/2022 e MTE 57/2025) e outras normas citadas.
//  pratica → boa prática ou referência técnica, que não é item da NR 6.
// "check:true" marca item de outra norma que deve ser conferido no texto oficial antes de usar em treinamento.
// "need" são os EPI que a tarefa da etapa exige; "broken" são os que estão danificados durante a etapa.
// "enter" altera o que o jogador veste quando a etapa começa e "wear", quando a etapa é concluída.
// "fx" liga e desliga objetos do cenário quando a etapa é concluída; "during" mostra objetos só durante a etapa.
import {spots} from './layout.mjs';
export const KINDS = {
 vigente:'Em vigor',
 pratica:'Boa prática — não é item de NR'
};
const nr6=item=>({norm:'NR 6',item,kind:'vigente'});
const anexo=item=>({norm:'NR 6 • Anexo I',item,kind:'vigente'});
const nr=(norm,item,check=false)=>({norm,item,kind:'vigente',...(check?{check:true}:{})});
const pratica=(norm,item)=>({norm,item,kind:'pratica'});
const at=(p,r)=>({x:p.x,z:p.z,r});

// ---------------- Anexo I: grupos de proteção e os EPI usados no jogo ----------------
export const GRUPOS = {
 A:'Proteção da cabeça',B:'Proteção dos olhos e da face',C:'Proteção auditiva',D:'Proteção respiratória',E:'Proteção do tronco',F:'Proteção dos membros superiores',G:'Proteção dos membros inferiores',H:'Proteção do corpo inteiro',I:'Proteção contra quedas com diferença de nível'
};
// Nome curto de cada grupo, para o painel.
export const GRUPOS_CURTO = {A:'Cabeça',B:'Olhos e face',C:'Auditiva',D:'Respiratória',E:'Tronco',F:'Braços e mãos',G:'Pernas e pés',H:'Corpo inteiro',I:'Quedas'};
export const EPI = {
 capacete:{grupo:'A',item:'A.1',nome:'Capacete'},
 oculos:{grupo:'B',item:'B.1',nome:'Óculos'},
 facial:{grupo:'B',item:'B.2',nome:'Protetor facial'},
 auricular:{grupo:'C',item:'C.1',nome:'Protetor auditivo'},
 respirador:{grupo:'D',item:'D.1',nome:'Respirador com filtro químico'},
 avental:{grupo:'E',item:'E.1',nome:'Avental'},
 luva:{grupo:'F',item:'F.1',nome:'Luva de vaqueta'},
 luvaQuimica:{grupo:'F',item:'F.1',nome:'Luva química'},
 calcado:{grupo:'G',item:'G.1',nome:'Calçado'},
 cinturao:{grupo:'I',item:'I.2',nome:'Cinturão com talabarte'}
};
const BASE=['capacete','oculos','auricular','calcado'];

const operador = [
 {id:'hierarquia',who:'Carla',refs:[nr6('6.3.1'),nr6('6.5.2 b)'),nr('NR 1','1.4.1 g) — ordem de prioridade das medidas de prevenção',true)],
  title:'Antes do EPI',description:'É o seu primeiro dia na metalúrgica. Carla, a técnica de segurança, mostra a prensa, que ganhou enclausuramento, e pergunta onde o EPI entra na prevenção.',
  tip:'EPI é o dispositivo de uso individual que protege contra riscos à segurança e à saúde (6.3.1). Ele entra depois de eliminar o risco, da proteção coletiva e das medidas de organização do trabalho. O EPI não evita o acidente: reduz a lesão.',
  choices:[
   {id:'ultima',correct:true,label:'O EPI é a última barreira: primeiro se elimina o risco, depois vêm a proteção coletiva e a organização do trabalho. Ele completa essas medidas.',feedback:'Isso. O enclausuramento protege todo mundo; o EPI protege só quem usa, e só se usar direito.'},
   {id:'primeira',label:'O EPI é a primeira medida: com todo mundo equipado, a máquina nem precisa de proteção.',feedback:'O EPI não substitui a proteção da máquina. Ele é o último recurso da ordem de prioridade.'},
   {id:'opcional',label:'Com a prensa enclausurada, o EPI passa a ser opcional em toda a fábrica.',feedback:'A proteção coletiva reduz o risco na prensa, mas outros riscos continuam. O EPI indicado segue obrigatório.'}
  ]},
 {id:'ca',refs:[nr6('6.4.1'),nr6('6.9.3'),nr6('6.5.1 a)')],...at(spots.almox,1.7),
  title:'Confira o CA',description:'No almoxarifado, o seu kit está no balcão: capacete, óculos, protetor auditivo e calçado. Antes de aceitar, o que conferir em cada um?',
  tip:'O EPI só pode ser vendido ou usado com a indicação do Certificado de Aprovação, o CA (6.4.1). Ele traz, em marcação indelével e legível, o fabricante ou importador, o lote e o número do CA (6.9.3). A organização só adquire EPI aprovado (6.5.1 a).',
  choices:[
   {id:'marcacao',correct:true,label:'A marcação no próprio EPI: fabricante ou importador, lote e número do CA, legíveis. E se o equipamento está inteiro.',feedback:'CA conferido no equipamento. Sem essa marcação, não é EPI aprovado.'},
   {id:'nota',label:'Nada: o CA vem na nota fiscal, que fica com o setor de compras.',feedback:'A marcação fica no próprio EPI, em caracteres indeléveis (6.9.3). É nele que você confere.'},
   {id:'bonito',label:'Só o tamanho e a cor: equipamento novo é sempre aprovado.',feedback:'Novo não quer dizer aprovado. Sem número de CA, o equipamento não pode ser usado como EPI.'}
  ]},
 {id:'ficha',who:'Ivone',r:2.4,wear:{add:['capacete','oculos','calcado']},fx:{hide:['kit'],show:['ficha']},refs:[nr6('6.5.1 c)'),nr6('6.5.1 d)'),nr6('6.5.1.1')],
  title:'Registre o recebimento',description:'Ivone, a almoxarife, entrega o kit e abre a sua ficha de EPI. Ela comenta que em outra empresa o calçado era descontado do salário.',
  tip:'A organização fornece o EPI gratuitamente, adequado ao risco e em perfeito estado (6.5.1 c) e registra o fornecimento em livro, ficha ou sistema eletrônico, inclusive biométrico (6.5.1 d). O sistema eletrônico precisa permitir a extração de relatórios (6.5.1.1).',
  choices:[
   {id:'conferir',correct:true,label:'Conferir item por item o que recebi, com data e número do CA, e só então assinar o registro. O EPI é gratuito.',feedback:'Fornecimento registrado e sem custo. Capacete, óculos e calçado já estão com você.'},
   {id:'branco',label:'Assinar a ficha em branco, para a Ivone preencher depois com calma.',feedback:'O registro prova o que foi entregue e quando. Assinar em branco não protege você nem a empresa.'},
   {id:'pagar',label:'Autorizar o desconto do calçado em folha, como na outra empresa.',feedback:'O fornecimento é gratuito (6.5.1 c). EPI não se cobra do trabalhador.'}
  ]},
 {id:'treinamento',refs:[nr6('6.5.1 b)'),nr6('6.7.2 b)'),nr6('6.7.2 c)'),nr6('6.7.1')],...at(spots.board,2),
  title:'Receba a orientação',description:'No quadro de treinamento, Carla explica cada EPI do kit. Ela pergunta o que você precisa saber antes de usar.',
  tip:'A organização orienta e treina sobre o uso adequado, a guarda e a conservação (6.5.1 b). Na entrega, informa o que é o equipamento, contra qual risco protege, as restrições e limitações, o ajuste, a manutenção, a substituição e a limpeza (6.7.2), seguindo o manual do fabricante.',
  choices:[
   {id:'limites',correct:true,label:'Contra qual risco cada EPI protege, até onde ele protege, como ajustar, limpar e guardar, e quando trocar.',feedback:'Você sabe para que serve cada EPI e onde a proteção dele termina.'},
   {id:'pratica',label:'Nada: EPI se aprende usando, no dia a dia.',feedback:'Sem orientação, o uso errado só aparece no acidente. A informação vem junto com a entrega (6.7.2).'},
   {id:'tudo',label:'Só que estou protegido: com o kit completo, nenhum risco da fábrica me alcança.',feedback:'Todo EPI tem restrições e limitações (6.7.2 c). Óculos comuns, por exemplo, não seguram respingo de produto químico.'}
  ]},
 {id:'ajuste',need:['capacete','oculos','auricular','calcado'],wear:{add:['auricular']},refs:[nr6('6.6.1 a)'),nr6('6.7.2 d)'),anexo('C.1 — protetor auditivo')],...at(spots.ruido,1.6),
  title:'Entre na área de ruído',description:'A faixa amarela marca a área do esmeril, onde o protetor auditivo é obrigatório. Veja no painel o que falta. Como colocar o protetor de inserção?',
  tip:'Cabe ao trabalhador usar o EPI fornecido (6.6.1 a), do jeito ensinado (6.7.2 d). O protetor de inserção só atenua se vedar o canal: mãos limpas, puxar a orelha para cima e para trás, inserir e conferir. E só protege enquanto está no ouvido.',
  choices:[
   {id:'vedar',correct:true,label:'Com as mãos limpas, puxar a orelha para cima e para trás, inserir nos dois ouvidos até vedar e manter durante todo o tempo na área.',feedback:'Protetor bem colocado, nos dois ouvidos, o tempo todo. O painel mostra a proteção auditiva em dia.'},
   {id:'um',label:'Colocar só em um ouvido, para conseguir ouvir os colegas com o outro.',feedback:'O ouvido descoberto recebe todo o ruído. A perda auditiva é silenciosa e não volta.'},
   {id:'apoio',label:'Apoiar na entrada do ouvido, sem empurrar, que incomoda menos.',feedback:'Sem vedar o canal, a atenuação cai quase a zero. O ajuste é o que faz o EPI funcionar.'}
  ]},
 {id:'tarefa',need:['capacete','oculos','facial','auricular','luva','calcado'],wear:{add:['facial','luva']},during:['faisca'],refs:[nr6('6.5.2 a)'),nr6('6.5.2 g)'),anexo('B.2 — protetor facial'),anexo('F.1 — luvas')],...at(spots.esmeril,1.7),
  title:'Rebarbe a peça',description:'A sua primeira tarefa é rebarbar peças no esmeril: fagulhas, partículas e arestas cortantes. O painel mostra o que a tarefa exige e o que falta.',
  tip:'O EPI é selecionado conforme a atividade (6.5.2 a). Quando vários são usados juntos, precisam ser compatíveis, para um não tirar a eficácia do outro (6.5.2 g): o protetor facial vai sobre os óculos e encaixa no capacete.',
  choices:[
   {id:'completo',correct:true,label:'Buscar o que a tarefa pede: protetor facial sobre os óculos e luva de vaqueta, e conferir se o facial encaixa no capacete sem deslocar o protetor auditivo.',feedback:'Conjunto completo e compatível. Agora sim, pode ligar o esmeril.'},
   {id:'so-oculos',label:'Usar só os óculos: o protetor facial embaça e atrapalha a visão.',feedback:'Os óculos protegem os olhos, não o rosto. Fagulha e fragmento de rebolo pedem protetor facial.'},
   {id:'sem-luva',label:'Rebarbar sem luva, para sentir melhor a peça.',feedback:'Aresta e rebarba cortam. A luva indicada para a tarefa faz parte do conjunto.'}
  ]},
 {id:'conforto',who:'Jorge',need:BASE,refs:[nr6('6.5.1 e)'),nr6('6.6.1 e)'),nr6('6.5.2 f)'),nr6('6.5.2.2'),nr('CLT','art. 158, parágrafo único, b)',true)],
  title:'O protetor incomoda',description:'Depois de uma hora, o protetor de inserção machuca o seu ouvido. Jorge, o supervisor, passa cobrando o uso de todos na área.',
  tip:'A organização exige o uso (6.5.1 e) e o trabalhador cumpre as determinações sobre o uso adequado (6.6.1 e). Mas a seleção considera a adequação e o conforto (6.5.2 f) e ouve os usuários (6.5.2.2). Recusar o EPI sem justificativa é ato faltoso (CLT, art. 158).',
  choices:[
   {id:'relatar',correct:true,label:'Continuar usando na área e avisar o Jorge do incômodo, para a segurança avaliar outro tamanho ou um modelo tipo concha.',feedback:'Você seguiu protegido e o problema foi para quem resolve. Conforto também é critério de seleção.'},
   {id:'tirar',label:'Tirar o protetor e trabalhar sem ele até arranjarem outro.',feedback:'Na área de ruído o uso é obrigatório. O caminho é relatar, não ficar exposto.'},
   {id:'fingir',label:'Deixar o protetor pendurado no pescoço e colocar só quando o Jorge passar.',feedback:'O ruído não espera a fiscalização. EPI pendurado não protege ninguém.'}
  ]},
 {id:'dano',need:BASE,broken:['oculos'],fx:{show:['oculosNovo']},during:['trinca'],refs:[nr6('6.6.1 d)'),nr6('6.5.1 g)')],...at(spots.bancada,1.7),
  title:'Os óculos trincaram',description:'Você deixou os óculos na bancada e uma peça caiu em cima: a lente trincou. Faltam duas horas para o fim do turno.',
  tip:'O trabalhador comunica quando o EPI é extraviado, danificado ou alterado a ponto de ficar impróprio (6.6.1 d). A organização substitui imediatamente (6.5.1 g). Lente trincada perde a resistência ao impacto.',
  choices:[
   {id:'trocar',correct:true,label:'Parar a tarefa, avisar que os óculos estão danificados e pegar outros no almoxarifado, com registro na ficha.',feedback:'Dano comunicado e EPI substituído na hora. Você volta ao trabalho protegido.'},
   {id:'turno',label:'Terminar o turno com eles: a trinca é pequena e não atrapalha a visão.',feedback:'Lente trincada pode estilhaçar no próximo impacto. EPI danificado é para trocar, não para aguentar.'},
   {id:'fita',label:'Passar fita adesiva na lente e seguir trabalhando.',feedback:'Remendo não devolve a resistência e ainda prejudica a visão. Comunique e troque.'}
  ]},
 {id:'lentes',who:'Davi',need:BASE,refs:[nr6('6.5.4'),nr6('6.5.2 f)')],
  title:'Óculos de grau',description:'Davi, seu colega, usa óculos de grau. Ele trabalha sem os óculos de segurança, porque “um não cabe em cima do outro”, e pergunta o que você acha.',
  tip:'Quando o empregado precisa de correção visual no trabalho, a seleção considera óculos de segurança de sobrepor, usados com as lentes corretivas, ou a adaptação do EPI, sem ônus para o empregado (6.5.4). Óculos de grau comuns não são EPI.',
  choices:[
   {id:'sobrepor',correct:true,label:'Dizer que óculos de grau não protegem e que ele pode pedir os de sobrepor, ou de segurança com grau, sem pagar nada.',feedback:'Davi pediu os óculos de sobrepor. A correção visual não é motivo para ficar sem proteção.'},
   {id:'grau',label:'Dizer que os óculos de grau já servem: lente é lente.',feedback:'Lente comum não resiste a impacto e não tem proteção lateral. Pode estilhaçar no olho.'},
   {id:'comprar',label:'Sugerir que ele mande fazer por conta própria uns óculos de segurança com grau.',feedback:'A adaptação é sem ônus para o empregado (6.5.4). Quem fornece é a organização.'}
  ]},
 {id:'finalidade',who:'Lia',need:['oculos','respirador','avental','luvaQuimica','calcado'],enter:{remove:['facial']},wear:{remove:['luva'],add:['luvaQuimica','avental']},refs:[nr6('6.6.1 b)'),nr6('6.5.2 d)'),anexo('F.1 — luvas'),pratica('Boa prática','consultar a ficha de dados de segurança do produto')],
  title:'Cada EPI tem a sua finalidade',description:'Você foi ajudar na preparação de tinta. Lia, a pintora, pede que você transfira solvente do tambor. Você está com a luva de vaqueta do esmeril.',
  tip:'O EPI é usado apenas para a finalidade a que se destina (6.6.1 b) e precisa ter a eficácia necessária para o risco (6.5.2 d). Luva de couro protege contra corte e abrasão; ela absorve o solvente e o mantém em contato com a pele.',
  choices:[
   {id:'quimica',correct:true,label:'Não usar a luva de couro com solvente: pedir a luva para agentes químicos e o avental indicados para o produto.',feedback:'Luva e avental certos para o produto. Falta só a proteção respiratória, veja no painel.'},
   {id:'couro',label:'Usar a luva de vaqueta mesmo: luva é luva, e é rapidinho.',feedback:'O couro encharca e segura o solvente na pele. Cada luva protege contra um tipo de risco.'},
   {id:'mao',label:'Tirar a luva e fazer com as mãos, lavando depois.',feedback:'Solvente é absorvido pela pele e resseca até ferir. A proteção certa é a luva química.'}
  ]},
 {id:'respirador',need:['oculos','respirador','avental','luvaQuimica','calcado'],wear:{add:['respirador']},refs:[anexo('D.1 — respirador purificador de ar não motorizado'),nr6('6.5.3'),nr6('6.7.2 c)'),pratica('Referência técnica','Programa de Proteção Respiratória: ensaio de vedação e filtro adequado ao contaminante')],...at(spots.quimica,1.7),
  title:'Escolha o respirador',description:'Na bancada de tintas há vapor de solvente. No armário há máscara descartável contra poeira e respirador semifacial com filtro para vapores orgânicos.',
  tip:'O respirador purificador depende do filtro certo para o contaminante e da vedação no rosto. Filtro para poeira não retém vapor. Barba na área de selagem tira a vedação. Todo EPI tem restrições e limitações (6.7.2 c).',
  choices:[
   {id:'filtro',correct:true,label:'O semifacial com filtro para vapores orgânicos, ajustado ao rosto, com a vedação conferida e o filtro dentro da validade.',feedback:'Filtro certo e vedação conferida. A tinta foi preparada com a proteção completa.'},
   {id:'poeira',label:'A máscara descartável contra poeira: é mais leve e também cobre o nariz e a boca.',feedback:'Filtro para partículas não retém vapor de solvente. Você respiraria o contaminante achando que está protegido.'},
   {id:'pano',label:'Um pano úmido no rosto, que é o que o pessoal antigo fazia.',feedback:'Pano não filtra vapor. Improviso não é EPI e não tem CA.'}
  ]},
 {id:'altura',need:['capacete','oculos','luva','calcado','cinturao'],enter:{remove:['respirador','avental','luvaQuimica'],add:['luva']},wear:{add:['cinturao']},fx:{show:['talabarte']},refs:[nr6('6.5.2 e)'),anexo('I.2 — cinturão de segurança com talabarte'),nr('NR 35','trabalho em altura: acima de 2 m do nível inferior, com risco de queda',true)],...at(spots.altura,1.7),
  title:'Suba no mezanino',description:'Jorge pede que você troque uma lâmpada no mezanino, a 3 metros, em um trecho sem guarda-corpo. O painel mostra o que falta.',
  tip:'A seleção do EPI segue também as exigências das outras normas (6.5.2 e). Para risco de queda, o Anexo I traz o cinturão de segurança com talabarte ou com trava-queda. O trabalho em altura tem capacitação e regras próprias na NR 35.',
  choices:[
   {id:'cinturao',correct:true,label:'Só subir se eu for capacitado e autorizado para altura, com cinturão tipo paraquedista inspecionado e talabarte preso ao ponto de ancoragem.',feedback:'Cinturão inspecionado e talabarte ancorado. EPI contra queda só funciona preso a um ponto seguro.'},
   {id:'rapido',label:'Subir sem cinturão: é uma lâmpada só, dois minutos.',feedback:'A queda não escolhe a duração da tarefa. De 3 metros, pode ser fatal.'},
   {id:'corda',label:'Amarrar uma corda na cintura e prender no corrimão da escada.',feedback:'Corda na cintura quebra a coluna na parada da queda. Improviso não substitui cinturão com CA e ancoragem.'}
  ]},
 {id:'alteracao',who:'Tião',need:BASE,enter:{remove:['cinturao']},refs:[nr6('6.6.1 d)'),nr6('6.6.1 e)'),pratica('Boa prática','seguir o manual do fabricante: não furar, cortar, pintar nem colar')],
  title:'Não altere o EPI',description:'Tião, o soldador, mostra o capacete dele: fez furos para ventilar e colou adesivos. Diz que faz isso para todo mundo e oferece a furadeira.',
  tip:'O CA vale para o equipamento como foi aprovado. Furar, cortar, pintar ou colar pode tirar a resistência e esconder trincas. Alteração que torne o EPI impróprio para uso é comunicada (6.6.1 d). Se o calor incomoda, peça um modelo ventilado, que já é aprovado assim.',
  choices:[
   {id:'original',correct:true,label:'Recusar: EPI se usa como veio do fabricante. Se o calor incomoda, pedir à segurança um modelo ventilado. E avisar que o capacete do Tião precisa ser trocado.',feedback:'EPI mantido como foi aprovado, e o capacete furado do Tião vai ser substituído.'},
   {id:'furar',label:'Aceitar: uns furinhos não fazem diferença e refrescam.',feedback:'Furo enfraquece o casco e deixa passar respingo e eletricidade. O capacete deixa de ser o que o CA aprovou.'},
   {id:'adesivo',label:'Furar não, mas cobrir o capacete de adesivos e tinta para personalizar.',feedback:'Tinta e cola podem atacar o plástico e esconder trincas. Alteração só a prevista pelo fabricante.'}
  ]},
 {id:'higiene',fx:{show:['guardado']},refs:[nr6('6.6.1 c)'),nr6('6.5.1 f)'),nr6('6.7.2 f)')],...at(spots.armario,1.7),
  title:'Limpe e guarde',description:'Fim do turno. Os seus EPI estão sujos de pó e suor. O armário individual fica no vestiário.',
  tip:'O trabalhador se responsabiliza pela limpeza, guarda e conservação (6.6.1 c), do jeito orientado (6.7.2 f). A higienização e a manutenção periódica, quando aplicáveis, são da organização (6.5.1 f). Calor, sol e produto químico estragam o EPI.',
  choices:[
   {id:'armario',correct:true,label:'Limpar cada EPI como foi orientado, conferir se algum está danificado e guardar no armário, seco e separado da roupa de casa.',feedback:'EPI limpo, conferido e guardado. Amanhã ele protege de novo.'},
   {id:'carro',label:'Deixar o capacete e os óculos no painel do carro, para não esquecer.',feedback:'Sol e calor ressecam o casco e deformam a lente. A guarda faz parte da conservação.'},
   {id:'casa',label:'Levar tudo para lavar em casa, junto com a roupa da família.',feedback:'O que está no EPI vai para a sua casa. A limpeza segue a orientação e fica no local indicado.'}
  ]},
 {id:'extravio',who:'Ivone',r:2.4,enter:{remove:['auricular']},wear:{add:['auricular']},fx:{show:['ficha2']},refs:[nr6('6.6.1 d)'),nr6('6.5.1 g)'),nr6('6.5.1.2')],
  title:'O protetor sumiu',description:'No dia seguinte, você não encontra o seu protetor auditivo. O turno no esmeril começa em dez minutos.',
  tip:'O trabalhador comunica o extravio (6.6.1 d) e a organização substitui imediatamente (6.5.1 g). Para EPI descartável sem registro individual viável, a organização garante a disponibilização no local, na embalagem original (6.5.1.2).',
  choices:[
   {id:'comunicar',correct:true,label:'Avisar o extravio no almoxarifado e retirar outro, com registro, antes de entrar na área de ruído.',feedback:'Extravio comunicado e protetor reposto. Você entra na área protegido.'},
   {id:'sem',label:'Trabalhar hoje sem protetor e pedir outro no fim do mês.',feedback:'Um turno inteiro de ruído já causa dano. A substituição é imediata (6.5.1 g).'},
   {id:'emprestado',label:'Pegar emprestado o protetor de inserção usado de um colega.',feedback:'Protetor de inserção é de uso individual: emprestado, leva infecção de um ouvido para outro.'}
  ]}
];
export const MODULES = {
 operador:{id:'operador',name:'Equipamentos de Proteção Individual',short:'EPI',course:'NR 6 • EPI',role:'Operador de produção',place:'METALÚRGICA • PRODUÇÃO',on:['kit'],
  intro:'Você é o novo operador de produção de uma metalúrgica. Receba os seus EPI, confira o CA, aprenda a usar, escolha a proteção certa para cada tarefa, cuide dela e comunique dano e extravio.',
  summary:'Você entendeu que o EPI é a última barreira, conferiu o CA, registrou o recebimento, recebeu a orientação, ajustou o protetor auditivo, montou o conjunto compatível para o esmeril, relatou o desconforto sem ficar exposto, trocou o EPI danificado, usou cada equipamento para a sua finalidade, não alterou o EPI, limpou, guardou e comunicou o extravio.',objectives:operador}
};
export const MODULE_IDS = Object.keys(MODULES);
export const objectivesOf = m => MODULES[m].objectives;
export const indexOf = (m,id) => objectivesOf(m).findIndex(o => o.id === id);
export const refLabel = r => `${r.norm} • ${/^\d/.test(r.item)?'item ':''}${r.item}`;
// Linha de referência mostrada no painel. A origem (em vigor ou boa prática) sempre aparece.
export const refSummary = o => o.refs.map(r => ({label:refLabel(r),kind:r.kind,status:KINDS[r.kind],check:!!r.check}));

// ---------------- Estado do jogo ----------------
export const initialState = (module=MODULE_IDS[0]) => ({module,step:0,feedback:'',errors:0,completed:[],finished:false});
export const done = (s,id) => s.completed.includes(id);
export const currentTarget = s => objectivesOf(s.module)[s.step];
function advance(s,next,id){
 const list=objectivesOf(s.module);next.completed=[...s.completed,id];next.step=s.step+1;next.finished=next.step===list.length;
 return next;
}
export function answer(s,choiceId){
 const o=currentTarget(s);const c=o?.choices?.find(x=>x.id===choiceId);if(!c)return s;
 if(!c.correct)return {...s,errors:s.errors+1,feedback:c.feedback};
 return advance(s,{...s,feedback:c.feedback},o.id);
}
export function interact(s,id){
 const o=currentTarget(s);if(!o||o.id!==id)return s;
 if(o.choices)return {...s,feedback:'Escolha uma das opções.'};
 return advance(s,{...s,feedback:''},id);
}
// EPI que o jogador está usando: "enter" vale quando a etapa começa e "wear" quando ela é concluída.
export function wornOf(s){
 const list=objectivesOf(s.module),set=new Set();
 const apply=d=>{if(!d)return;for(const k of d.remove||[])set.delete(k);for(const k of d.add||[])set.add(k);};
 for(let i=0;i<list.length&&i<=s.step;i++){apply(list[i].enter);if(i<s.step)apply(list[i].wear);}
 return Object.keys(EPI).filter(k=>set.has(k));
}
// Situação da proteção na etapa atual: o que a tarefa exige, o que falta e como fica cada grupo do Anexo I.
// Grupo: ok (exigido e atendido), falta (exigido e não atendido), usa (em uso, sem exigência) ou vazio.
export function protectionOf(s){
 const cur=currentTarget(s),worn=wornOf(s),need=cur?.need||[],broken=cur?.broken||[];
 const missing=need.filter(k=>!worn.includes(k)),damaged=need.filter(k=>worn.includes(k)&&broken.includes(k));
 const groups={};
 for(const g of Object.keys(GRUPOS)){
  const n=need.filter(k=>EPI[k].grupo===g),w=worn.filter(k=>EPI[k].grupo===g);
  groups[g]=n.length?(n.every(k=>worn.includes(k)&&!broken.includes(k))?'ok':'falta'):w.length?'usa':'';
 }
 const ok=!missing.length&&!damaged.length;
 const label=!need.length?'Sem tarefa de risco nesta etapa':ok?'Proteção completa para a tarefa':[missing.length?'Falta: '+missing.map(k=>EPI[k].nome).join(', '):'',damaged.length?'Danificado: '+damaged.map(k=>EPI[k].nome).join(', '):''].filter(Boolean).join(' • ');
 return {worn,need,missing,damaged,groups,ok,required:need.length>0,label};
}
// Objetos do cenário visíveis: começa pelos do módulo ("on"), aplica o "fx" das etapas concluídas e o "during" da etapa atual.
export function visibleItems(s,defaults={}){
 const v={...defaults};for(const k of MODULES[s.module].on||[])v[k]=true;
 for(const o of objectivesOf(s.module)){if(!done(s,o.id)||!o.fx)continue;for(const k of o.fx.show||[])v[k]=true;for(const k of o.fx.hide||[])v[k]=false;}
 const cur=currentTarget(s);
 for(const o of objectivesOf(s.module))for(const k of o.during||[])v[k]=false;
 for(const k of cur?.during||[])v[k]=true;
 return v;
}
// Áreas caminháveis: o piso da fábrica; estruturas entram como obstáculos {x,z,w,d}.
export function canMove(x,z,obstacles,bounds){
 if(bounds&&!(x>bounds.minX&&x<bounds.maxX&&z>bounds.minZ&&z<bounds.maxZ))return false;
 return !obstacles.some(o=>Math.abs(x-o.x)<o.w/2+.32&&Math.abs(z-o.z)<o.d/2+.32);
}
