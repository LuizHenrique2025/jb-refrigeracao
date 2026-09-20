# Modelo do ar-condicionado

A primeira versão usa geometrias Three.js genéricas, sem marcas. É uma ilustração técnica simplificada, não um modelo CAD nem uma reprodução fiel de produto. As imagens em `public/references` são referências recebidas do cliente; não são fotografias de serviços da JB.

## Substituição pelo GLB

1. Salvar o arquivo otimizado em `public/models/split-ac.glb`.
2. Exportar a montagem com origem no centro, Y para cima e frente no eixo +Z. Largura aproximada 7.2 unidades, altura 2 e profundidade 1.8. Aplicar escala e rotação antes de exportar.
3. Exportar `AC_ROOT` com os grupos abaixo como filhos diretos. Cada grupo deve incluir toda a geometria daquela peça. Não aninhar uma peça animada dentro de outra.
4. Manter os pivôs de cada grupo no centro da peça e as posições locais correspondentes ao equipamento montado. Os deslocamentos em `lib/model-config.ts` são relativos a essas posições.
5. Alterar `MODEL_URL` em `lib/model-config.ts` de `null` para `/models/split-ac.glb`.

```text
AC_ROOT
├── Panel_Front
├── Air_Grid
├── Filter_Left
├── Filter_Right
├── Evaporator_Coil
├── Blower_Fan
├── Fan_Motor
├── Main_Chassis
├── PCB
├── Horizontal_Flap
├── Flap_Motor
├── Side_Left
└── Side_Right
```

A busca usa `getObjectByName`, nunca índices. O carregador valida os nomes e retorna ao modelo simplificado em caso de erro. Não se faz requisição nem preload de um GLB inexistente. Quando configurado, `useGLTF.preload` e `Suspense` oferecem carregamento antecipado e progresso.

## Orçamento de desempenho

- Preferir GLB abaixo de 3 MB e 100 mil triângulos. Conferir visualmente depois de otimizar.
- Meshopt é suportado por useGLTF; preservar nomes e hierarquia na otimização. Draco pode reduzir transporte, mas adiciona decodificação; medir em celular antes de adotar. Para deployment sem dependência de CDN, hospedar os decodificadores localmente e configurar o caminho.
- O mock usa materiais PBR sem texturas e instâncias para as aletas da serpentina e grades. Evitar texturas maiores que 1024 px; KTX2 exige configurar o transcoder e medir compatibilidade antes de usar.
- DPR máximo 1.5. Sombras dinâmicas desativadas abaixo de 640 px. Renderização sob demanda: GSAP chama `invalidate`, sem estado React a cada scroll.
- A cena é importada apenas quando a seção se aproxima da janela. Redução de movimento e ausência/perda de WebGL mostram imagem estática e descrições, sem a seção fixa durante a rolagem.
- Resize destrói a timeline, restaura transforms/materiais e reconstrói o enquadramento. GSAP controla as mesmas posições ao avançar e retroceder.

## Validação manual após substituir o modelo

Verificar montagem inicial, todas as peças, labels, iluminação, ida/volta da rolagem, mudança de largura e orientação, DPR, carregamento com rede lenta, erro no arquivo e preferência de movimento reduzido. Evitar juntar meshes de peças diferentes durante a otimização.
