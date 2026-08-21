#!/bin/bash
# Strategie "salle de debordement ephemere" — v2
set -e
if [ ! -f "package.json" ]; then
  echo "ERREUR : lance ce script depuis la racine du projet"
  exit 1
fi
PROJECT_NAME=$(basename "$(pwd)")
EPHEMERAL_BASE="/tmp/workdir/${PROJECT_NAME}"
NODE_MODULES_EPHEMERAL="${EPHEMERAL_BASE}/node_modules"
PLAYWRIGHT_BROWSERS_PATH="/tmp/ms-playwright"
echo "=== BOOTSTRAP v2 ==="
echo "Projet    : ${PROJECT_NAME}"
echo "Ephemere  : ${EPHEMERAL_BASE}"
mkdir -p "${NODE_MODULES_EPHEMERAL}"
mkdir -p "${PLAYWRIGHT_BROWSERS_PATH}"
rm -rf node_modules
ln -s "${NODE_MODULES_EPHEMERAL}" node_modules
echo "Lien symbolique cree : node_modules -> ${NODE_MODULES_EPHEMERAL}"
echo "1/3 — npm install..."
npm install
if [ ! -L "node_modules" ]; then
  echo "npm a supprime le symlink — deplacement vers l'ephemere..."
  rm -rf "${NODE_MODULES_EPHEMERAL}"
  mv node_modules "${NODE_MODULES_EPHEMERAL}"
  ln -s "${NODE_MODULES_EPHEMERAL}" node_modules
  echo "OK : node_modules deplace et symlink recree"
fi
echo "2/3 — Playwright Chromium..."
export PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_PATH}"
npx playwright install chromium
echo "3/3 — Verification df -h ~ :"
df -h ~
echo "=== BOOTSTRAP TERMINE ==="
echo "Espace $HOME :"
du -sh . 2>/dev/null || true
echo "Espace node_modules ephemere :"
du -sh "${NODE_MODULES_EPHEMERAL}" 2>/dev/null || true
echo "Espace Playwright :"
du -sh "${PLAYWRIGHT_BROWSERS_PATH}" 2>/dev/null || true
