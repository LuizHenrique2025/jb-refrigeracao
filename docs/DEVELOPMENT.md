# Desenvolvimento

Node.js 20.9 ou superior. Instalar com `npm ci`. Rodar `npm run dev` e abrir a URL informada. Verificações: `npm run typecheck`, `npm run lint`, `npm run build`. O build é uma exportação estática em `out/`, compatível com hospedagem estática HTTPS.

## Organização

- `app/page.tsx`: conteúdo institucional, serviços e contato.
- `components/ACExperience.tsx`: carregamento próximo à viewport, acessibilidade e fallback estático.
- `components/ACScene.tsx`: Canvas, câmera, luzes e ciclo de vida.
- `components/ACModel.tsx`: mock por peças e adaptador GLB.
- `components/ACLoading.tsx`: progresso do modelo.
- `lib/animation.ts`: timeline, scrub, etapas, destaques e cleanup.
- `lib/model-config.ts`: contrato de nomes e deslocamentos 3D.
- `lib/content.ts`: explicações e mensagem de WhatsApp.

### Rolagem da experiência 3D

A seção `#tecnologia` é **alta de propósito**: tem a altura de uma tela (`--exp-h`) mais a distância de rolagem da animação (`--exp-scroll`, 1800 px no desktop e 1500 px no celular). Dentro dela, `.experience-stage` usa `position: sticky` e fica fixo enquanto a página rola. O ScrollTrigger **não usa `pin`**: apenas faz o scrub da timeline, e a distância é derivada de `altura da seção - altura do stage`. Assim a altura da página não muda quando a cena carrega e o elemento é solto de forma nativa ao fim da animação.

Regras que não podem ser quebradas, ou o efeito para de funcionar:

- Nenhum ancestral de `.experience-stage` pode ter `overflow` diferente de `visible` (a própria seção usa `overflow: visible`; o corte fica no stage).
- Não sobrescrever `position`, `height` ou `transform` da seção via CSS `!important` para "soltar" a experiência. Ajustar `--exp-scroll`.
- O OrbitControls escreve `touch-action: none` no container do canvas. `ACScene` e `PartScene` reajustam para `pan-y` para o toque não travar a rolagem da página. Só se libera o toque total quando o visitante ativa "Girar com o toque".
- Sem JavaScript ou com `prefers-reduced-motion`, `--exp-scroll` vira 0 (não há animação para percorrer).

A interface é navegável por âncoras e inclui atalho para pular a experiência. Nenhuma animação do produto depende de mouse ou roda automaticamente.

## Conteúdo pendente do cliente

Fotos reais de trabalhos e endereço exato do perfil do Instagram não foram fornecidos. Não há fotos fictícias, avaliações inventadas nem link presumido do Instagram. A automação do atendimento é uma etapa posterior; o botão atual apenas abre a conversa com mensagem preenchida. O domínio final ainda não foi escolhido.

O telefone foi mantido exatamente como registrado no README original. Confirmar com João se o número está atual antes da divulgação pública.
