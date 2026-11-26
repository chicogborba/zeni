#!/bin/sh
# Aplica ao app os ajustes de forma do personagem (queixo, ombros, sovaco, braços) definidos no topo de
# scripts/abrir-no-blender.py. Rode na pasta zeni-site:  sh scripts/aplicar-ajustes.sh
# Parte de scripts/fonte/zeni-personagem-montado.glb (sem ajustes) e grava src/assets/zeni-personagem.glb.
# Se o modelo for remontado (scripts/montar-personagem.sh), rode este script de novo depois.
set -e
cd "$(dirname "$0")/.."
BLENDER="${BLENDER:-/Applications/Blender.app/Contents/MacOS/Blender}"
TMP="$(mktemp -d)"
ZENI_AJUSTES_JSON="$TMP/movidos.json" "$BLENDER" -b --python scripts/abrir-no-blender.py > "$TMP/blender.log" 2>&1 || { cat "$TMP/blender.log"; exit 1; }
grep -E "ajustad|aproximad|movidos" "$TMP/blender.log" || true
node scripts/aplicar-ajustes.mjs scripts/fonte/zeni-personagem-montado.glb "$TMP/movidos.json" src/assets/zeni-personagem.glb
rm -rf "$TMP"
