# NR 6 • Equipamentos de Proteção Individual (jogo educativo 3D)

Jogo educativo da série de jogos de segurança do trabalho, sobre **Equipamentos de Proteção Individual (NR 6)**.

Você é o **novo operador de produção** de uma metalúrgica. No primeiro dia, você entende onde o EPI entra na prevenção, confere o CA, registra o recebimento, recebe a orientação, ajusta o protetor auditivo, monta o conjunto certo para o esmeril, relata o desconforto sem ficar exposto, troca o EPI danificado, usa cada equipamento para a sua finalidade, não altera o EPI, limpa, guarda e comunica o extravio.

> **Conteúdo educativo.** Não substitui o treinamento da empresa, a seleção de EPI registrada no PGR nem o manual do fabricante. Leia o [SAFETY-NOTES.md](SAFETY-NOTES.md).

## Como abrir

Requer Node.js 18 ou superior (ou Python 3).

- **Windows:** dê dois cliques em `INICIAR.cmd` e abra http://127.0.0.1:8765
- **Qualquer sistema:** `npm start` (ou `node server.mjs`) e abra http://127.0.0.1:8765
- **Hospedagem estática:** publique a pasta `dist/` como está. Não há build nem dependências npm. O Three.js 0.170.0 está em `dist/`.

## Controles

| Ação | Teclado | Celular |
|---|---|---|
| Mover | WASD ou setas | botões de seta na tela |
| Correr | Shift | — |
| Interagir | E | botão AÇÃO |
| Fontes e origem do conteúdo | botão **Fontes** | botão **Fontes** |
| Pausar | Esc ou botão Ⅱ | botão Ⅱ |

O losango verde é você. O losango azul, o alvo luminoso e as setas no chão marcam o destino.

**Painel “Seus EPI”** (canto superior direito): os nove grupos de proteção do Anexo I, de A a I, e embaixo o pictograma de cada EPI. **Verde**: exigido pela tarefa e em uso. **Vermelho** (piscando, com “falta” ou “danificado”): exigido e ausente ou impróprio. **Azul**: em uso, sem exigência na etapa.

**Você vestiu:** a cada EPI novo, aparece um aviso com o pictograma, a câmera se aproxima e o personagem vira de frente por alguns segundos, mostrando o equipamento. Capacete, óculos, protetor facial, protetor auditivo, respirador, avental, luvas, calçado e cinturão aparecem no personagem.

**Placas azuis:** cada setor tem a placa de uso obrigatório com os pictogramas dos EPI daquela área (ruído, esmeril, tintas, altura, solda).

**Fábrica sem teto:** o galpão aparece aberto em cima, para o jogador ver todos os setores.

## Origem do conteúdo (muito importante)

| Etiqueta | Significa |
|---|---|
| **Em vigor** | NR 6 com a redação da Portaria MTP 2.175/2022 e as alterações das Portarias MTP 4.219/2022 e MTE 57/2025, incluído o Anexo I (lista de EPI). Também NR 1, NR 35 e CLT quando citadas. |
| **Boa prática — não é item de NR** | Orientações técnicas úteis: consultar a ficha de dados de segurança do produto, seguir o manual do fabricante, conferir a vedação do respirador. |

Etiquetas com **“conferir subitem”** marcam itens de outras normas (NR 1, NR 35, CLT), que devem ser conferidos no texto oficial antes do uso em sala de aula.

## Sequência das 15 etapas

| # | Etapa | Origem |
|---|---|---|
| 1 | Antes do EPI | 6.3.1 • 6.5.2 b) • NR 1 — 1.4.1 g) — ordem de prioridade das medidas de prevenção |
| 2 | Confira o CA | 6.4.1 • 6.9.3 • 6.5.1 a) |
| 3 | Registre o recebimento | 6.5.1 c) • 6.5.1 d) • 6.5.1.1 |
| 4 | Receba a orientação | 6.5.1 b) • 6.7.2 b) • 6.7.2 c) • 6.7.1 |
| 5 | Entre na área de ruído | 6.6.1 a) • 6.7.2 d) • Anexo I — C.1 — protetor auditivo |
| 6 | Rebarbe a peça | 6.5.2 a) • 6.5.2 g) • Anexo I — B.2 — protetor facial • Anexo I — F.1 — luvas |
| 7 | O protetor incomoda | 6.5.1 e) • 6.6.1 e) • 6.5.2 f) • 6.5.2.2 • CLT — art. 158, parágrafo único, b) |
| 8 | Os óculos trincaram | 6.6.1 d) • 6.5.1 g) |
| 9 | Óculos de grau | 6.5.4 • 6.5.2 f) |
| 10 | Cada EPI tem a sua finalidade | 6.6.1 b) • 6.5.2 d) • Anexo I — F.1 — luvas • Boa prática — consultar a ficha de dados de segurança do produto |
| 11 | Escolha o respirador | Anexo I — D.1 — respirador purificador de ar não motorizado • 6.5.3 • 6.7.2 c) • Referência técnica — Programa de Proteção Respiratória: ensaio de vedação e filtro adequado ao contaminante |
| 12 | Suba no mezanino | 6.5.2 e) • Anexo I — I.2 — cinturão de segurança com talabarte • NR 35 — trabalho em altura: acima de 2 m do nível inferior, com risco de queda |
| 13 | Não altere o EPI | 6.6.1 d) • 6.6.1 e) • Boa prática — seguir o manual do fabricante: não furar, cortar, pintar nem colar |
| 14 | Limpe e guarde | 6.6.1 c) • 6.5.1 f) • 6.7.2 f) |
| 15 | O protetor sumiu | 6.6.1 d) • 6.5.1 g) • 6.5.1.2 |

Cada decisão tem três opções, uma única correta, e cada opção tem um feedback didático. O jogo cobre todos os deveres do trabalhador (6.6.1, alíneas a a e) e os da organização nas alíneas a a g do item 6.5.1.

## Personagens

Você é: **Operador de produção**. Com você na fábrica: Carla (técnica de segurança), Ivone (almoxarife), Jorge (supervisor de produção), Davi (operador), Lia (pintora) e Tião (soldador).

## Arquivos

| Arquivo | Conteúdo |
|---|---|
| `dist/index.html`, `dist/style.css` | Interface (mesma da série, com painel dos EPI e etiquetas de origem) |
| `dist/rules.mjs` | Regras puras e testáveis: etapas, decisões, referências, grupos do Anexo I, EPI em uso e exigido em cada etapa, objetos do cenário |
| `dist/layout.mjs` | Planta da fábrica, equipe, estados de cada pessoa e aparência dos EPI |
| `dist/crew.mjs` | Fase de cada pessoa conforme o andamento e busca de rotas |
| `dist/scenery.mjs` | Cenário 3D |
| `dist/icons.mjs` | Pictogramas dos EPI (painel, aviso e placas) |
| `dist/game.mjs` | Jogo: câmera, equipe, painel dos EPI e diálogos |
| `dist/graphics.mjs` | Qualidade, pós-processamento e texturas |
| `dist/characters.mjs` | Personagens com esqueleto, animações, poses de ação e EPI |
| `dist/models/` | Modelos GLB dos personagens |
| `server.mjs`, `INICIAR.cmd` | Servidor local (127.0.0.1:8765) |
| `manifest.mjs` | Gera o `MANIFESTO-SHA256.json` (`npm run manifest`) |
| `test.mjs` | Testes em Node puro (`npm test`) |

## Testes

```
npm test
```

Cobrem: ordem das etapas; uma única resposta certa por decisão, com feedback; todo item e alínea da NR 6 citados existem no texto em vigor; todos os deveres do trabalhador aparecem; itens do Anexo I; EPI em uso e exigido em cada etapa, coerentes com os textos; a resposta certa sempre traz o EPI que o painel mostra faltando; objetos do cenário; e acessibilidade de todos os destinos.
