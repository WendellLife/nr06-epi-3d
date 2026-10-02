// Pictogramas dos EPI (caminhos SVG em uma grade de 24 x 24), usados no painel, no aviso de "você vestiu"
// e nas placas azuis de uso obrigatório do cenário.
export const ICONS = {
 capacete:'M4 15a8 8 0 0 1 16 0zM2 16h20v2.6H2z',
 oculos:'M2 8h20v2.2h-1V15a2.5 2.5 0 0 1-2.5 2.5h-3A2.5 2.5 0 0 1 13 15v-2h-2v2a2.5 2.5 0 0 1-2.5 2.5h-3A2.5 2.5 0 0 1 3 15v-4.8H2z',
 facial:'M4 3h16v3.4H4zM5.5 7.6h13V17a5 5 0 0 1-5 5h-3a5 5 0 0 1-5-5z',
 auricular:'M4.2 13v-2a7.8 7.8 0 0 1 15.6 0v2h-2.2v-2a5.6 5.6 0 0 0-11.2 0v2zM1.5 13h5.6v8H4a2.5 2.5 0 0 1-2.5-2.5zM16.9 13h5.6v5.5A2.5 2.5 0 0 1 20 21h-3.1z',
 respirador:'M7.5 6h9l2.2 6.5a6.9 6.9 0 0 1-13.4 0zM0.6 14a3.2 3.2 0 1 0 6.4 0a3.2 3.2 0 1 0-6.4 0zM17 14a3.2 3.2 0 1 0 6.4 0a3.2 3.2 0 1 0-6.4 0z',
 avental:'M9 2h6v4h3.2L20.5 22h-17L5.8 6H9z',
 luva:'M6.5 22V12.5L3 9l1.8-1.8L8 10.2V4h2.2v6h.9V2.5h2.2V10h.9V3.5h2.2V10h.9V6h2.2v10a6 6 0 0 1-6 6z',
 luvaQuimica:'M6.5 22V12.5L3 9l1.8-1.8L8 10.2V4h2.2v6h.9V2.5h2.2V10h.9V3.5h2.2V10h.9V6h2.2v10a6 6 0 0 1-6 6z',
 calcado:'M5 2.5h7.5V11l7.6 3a2.6 2.6 0 0 1 1.9 2.5V18H5zM4 19.2h18.5V22H4z',
 cinturao:'M9.8 4a2.2 2.2 0 1 0 4.4 0a2.2 2.2 0 1 0-4.4 0zM6.5 8h11v2.2h-3.3l3.2 5.2-1.9 1.1L12 11.6 8.5 16.5l-1.9-1.1 3.2-5.2H6.5zM6.5 16.5h11v2.2h-11zM7.8 19.5h2.8V23H7.8zM13.4 19.5h2.8V23h-2.8z'
};
export const iconSVG = (k,size=20) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true"><path fill="currentColor" d="${ICONS[k]}"/></svg>`;
