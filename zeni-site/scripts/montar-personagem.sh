#!/bin/bash
# Monta src/assets/zeni-personagem.glb a partir do modelo do Blender, em três passos (rode na pasta zeni-site):
#   1. alinhar-ossos   : ossos do braço no meio da malha
#   2. ajustar-clipes  : poses de A_girar_o_punho e D_tocar_na_mesa
#   3. adicionar-dedos : ossos dos dedos e pegada do ZENI
set -e
cd "$(dirname "$0")/.."
node scripts/alinhar-ossos.mjs scripts/fonte/zeni-personagem-blender.glb scripts/zeni-personagem-alinhado.glb
node scripts/ajustar-clipes.mjs
node scripts/adicionar-dedos.mjs
