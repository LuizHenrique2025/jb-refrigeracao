# Desenvolvimento

Node.js 20.9 ou superior. Instalar com `npm ci`. Rodar `npm run dev` e abrir a URL informada. Verificações: `npm run typecheck`, `npm run lint`, `npm run build`. O build é uma exportação estática em `out/`, compatível com hospedagem estática HTTPS.

## Organização

- `app/page.tsx`: conteúdo institucional, serviços e contato.
- `components/ACExperience.tsx`: carregamento próximo à viewport, acessibilidade e fallback estático.
- `components/ACScene.tsx`: Canvas, câmera, luzes e ciclo de vida.
- `components/ACModel.tsx`: mock por peças e adaptador GLB.
- `components/ACLabels.tsx`: projeção da peça na tela, sem render React a cada quadro.
- `components/ACLoading.tsx`: progresso do modelo.
- `lib/animation.ts`: timeline, pin, scrub, etapas, destaques e cleanup.
- `lib/model-config.ts`: contrato de nomes e deslocamentos 3D.
- `lib/content.ts`: explicações e mensagem de WhatsApp.

A timeline dura 5000 px de scroll no desktop e 3600 no celular. A interface é navegável por âncoras e inclui atalho para pular a experiência. Nenhuma animação do produto depende de mouse ou roda automaticamente.

## Conteúdo pendente do cliente

Fotos reais de trabalhos e endereço exato do perfil do Instagram não foram fornecidos. Não há fotos fictícias, avaliações inventadas nem link presumido do Instagram. A automação do atendimento é uma etapa posterior; o botão atual apenas abre a conversa com mensagem preenchida. O domínio final ainda não foi escolhido.

O telefone foi mantido exatamente como registrado no README original. Confirmar com João se o número está atual antes da divulgação pública.
