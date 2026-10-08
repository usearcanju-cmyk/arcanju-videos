# Use Arcanju · Vídeos de produto

Três lugares de vídeo na loja, ligados pelo Google Tag Manager:

1. **Bolha flutuante** (canto da tela) na home e nas categorias.
2. **Carrossel "Descubra cada detalhe em vídeo"** logo antes do rodapé.
3. **3 bolinhas na página do produto**, entre o botão Comprar e o bloco "Compra segura".

Tocar em qualquer um abre o **player em tela cheia** (estilo stories): passa para o lado, fecha arrastando para baixo, segura para pausar, liga e desliga o som, e mostra o cartão do produto com preço, a promoção e o botão **Comprar**. Nome, foto e preço são lidos da própria página do produto na Nuvemshop, então mudam sozinhos quando o preço muda.

## Arquivos

| Arquivo | O que é |
|---|---|
| `arcanju-videos.js` | O widget (não precisa mexer) |
| `videos.json` | **Toda a configuração**: quais vídeos, onde aparece cada um, textos e cores |
| `videos/` | Os vídeos já comprimidos |
| `comprimir.sh` | Comprime os vídeos originais (precisa do ffmpeg) |
| `demo/` | Página de teste (não é usada pela loja) |
| `vercel.json` | Cache e permissões |

## Publicar (uma vez)

1. Crie o repositório **arcanju-videos** no GitHub e suba estes arquivos.
2. Na Vercel: **Add New → Project → arcanju-videos → Deploy**. Sem variáveis.
3. Confira se abre: `https://arcanju-videos.vercel.app/videos.json`
4. No **Google Tag Manager** da loja:
   - **Tags → Nova → HTML personalizado**, nome `Arcanju · Vídeos`:
     ```html
     <script src="https://arcanju-videos.vercel.app/arcanju-videos.js" defer></script>
     ```
   - **Acionamento:** `DOM Ready` (ou "Todas as páginas").
   - **Visualizar** para testar na loja e depois **Enviar → Publicar**.

Se a Vercel der outro endereço (por exemplo `arcanju-videos-xyz.vercel.app`), use esse no `src`.

## Adicionar ou trocar vídeos

1. Comprima: `./comprimir.sh originais/ videos/` gera, para cada vídeo, `nome.mp4` (player), `nome-previa.mp4` (prévia leve, 6 s, sem som) e `nome.jpg` (capa).
2. Cadastre em `videos.json`:
   ```json
   { "id": "teresinha-1", "src": "videos/teresinha-1.mp4", "previa": "videos/teresinha-1-previa.mp4",
     "poster": "videos/teresinha-1.jpg", "produto": "camiseta-off-white-premium-santa-teresinha" }
   ```
   `produto` é o final do link do produto (o que vem depois de `/produtos/`).
3. Diga onde aparece:
   - `bolha.videos`: os vídeos da bolha flutuante, na ordem.
   - `carrossel.videos`: os cards do carrossel, na ordem (vazio = todos).
   - `produto.porProduto`: `{ "slug-do-produto": ["id1","id2","id3"] }`. Sem isso, o produto mostra os vídeos cujo `produto` é ele.
   - `produto.padrao`: vídeos para produtos que não têm vídeo próprio (vazio = não mostra nada).
4. Commit → a Vercel publica → a loja atualiza em até 1 minuto.

## Opções úteis em `videos.json`

- `"ativo": false` desliga tudo de uma vez.
- `bolha.lado`: `"direita"` ou `"esquerda"`; `bolha.distanciaBaixo` em pixels; `bolha.paginas`: `home`, `categoria`, `produto` ou `todas`.
- `promo`: a linha da promoção no cartão do player.
- `carrossel.seletorRodape` / `produto.seletorAntes`: seletor CSS para forçar a posição, se o tema mudar.

## Medição

Cada ação envia um evento para o `dataLayer` do GTM: `arcv_abrir`, `arcv_ver`, `arcv_comprar` e `arcv_fechar_bolha`, com `arcv_video`, `arcv_produto` e `arcv_origem` (bolha, carrossel ou produto). Dá para criar acionadores com eles no GTM ou mandar para o GA4.

## Leveza

- As prévias só carregam quando aparecem na tela e pausam quando saem.
- O vídeo completo só baixa quando a pessoa abre o player.
- Com "economia de dados" ou "reduzir movimento" ligados, mostra só a capa.
- Não aparece no carrinho nem no checkout.
