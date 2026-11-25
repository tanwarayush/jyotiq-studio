#!/usr/bin/env bash
# One-time machine setup for Devin Cloud (Ubuntu). Safe to re-run.
# Run from the repo root:  bash setup.sh
set -euo pipefail
REPO="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO"

echo "== system packages"
if [ "$(uname -s)" = "Linux" ]; then
  sudo apt-get update -y
  sudo apt-get install -y ffmpeg python3 python3-venv python3-pip git git-lfs curl unzip \
    fonts-noto-core fonts-noto-extra fonts-noto-color-emoji \
    libnss3 libdbus-1-3 libatk1.0-0 libgbm-dev libasound2t64 libxrandr2 libxkbcommon-dev \
    libxfixes3 libxcomposite1 libxdamage1 libatk-bridge2.0-0 libpango-1.0-0 libcairo2 libcups2 \
    || sudo apt-get install -y libasound2   # older Ubuntu names the sound lib libasound2
  git lfs install || true
elif [ "$(uname -s)" = "Darwin" ]; then
  command -v ffmpeg >/dev/null || brew install ffmpeg
  command -v git-lfs >/dev/null || brew install git-lfs
  git lfs install || true
else
  echo "Unsupported OS: $(uname -s)" >&2
  exit 1
fi

echo "== Node 24"
if ! command -v node >/dev/null || [ "$(node -v | cut -d. -f1)" != "v24" ]; then
  if [ "$(uname -s)" = "Linux" ]; then
    curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
    sudo apt-get install -y nodejs
  else
    brew install node
  fi
fi

echo "== Remotion project"
cd "$REPO/video"
if [ ! -d node_modules ]; then
  npm ci
fi
npx remotion browser ensure
cd "$REPO"

echo "== Python venv (numpy for score/mix scripts, earshot for listening, gradio_client for hf-video)"
if [ -x "$HOME/earshot/.venv/bin/python" ] && [ ! -x "$HOME/studio-venv/bin/python" ]; then
  ln -sfn "$HOME/earshot/.venv" "$HOME/studio-venv"
fi
if [ ! -x "$HOME/studio-venv/bin/python" ]; then
  python3 -m venv "$HOME/studio-venv"
  "$HOME/studio-venv/bin/pip" install -q --upgrade pip
  "$HOME/studio-venv/bin/pip" install -q numpy scipy soundfile pillow ephem gradio_client \
    "git+https://github.com/Leonxlnx/earshot"
else
  "$HOME/studio-venv/bin/pip" install -q ephem gradio_client
fi

echo "== whisper.cpp (word timings for captions)"
if ! command -v whisper-cli >/dev/null; then
  if [ "$(uname -s)" = "Linux" ]; then
    sudo apt-get install -y cmake build-essential
  else
    brew install whisper-cpp cmake
  fi
fi
if [ ! -x "$HOME/whisper.cpp/build/bin/whisper-cli" ] && ! command -v whisper-cli >/dev/null; then
  git clone --depth 1 https://github.com/ggml-org/whisper.cpp "$HOME/whisper.cpp"
  cmake -S "$HOME/whisper.cpp" -B "$HOME/whisper.cpp/build" -DCMAKE_BUILD_TYPE=Release
  cmake --build "$HOME/whisper.cpp/build" -j --config Release --target whisper-cli
fi
mkdir -p "$HOME/.cache/whisper-models"
if [ ! -f "$HOME/.cache/whisper-models/ggml-large-v3-turbo-q5_0.bin" ] && [ -x "$HOME/whisper.cpp/models/download-ggml-model.sh" ]; then
  bash "$HOME/whisper.cpp/models/download-ggml-model.sh" large-v3-turbo-q5_0 "$HOME/.cache/whisper-models"
fi

echo "== Mac path compatibility (old scripts and skills use these paths)"
#   ~/.kiro/crew/workspace          -> this repo
#   ~/.claude/skills, ~/.agents/skills -> .agents/skills in this repo
#   ~/.veo_spend.json               -> spend-ledger.json in this repo (so the spend total is committed)
#   ~/earshot/.venv, ~/hfvideo/.venv -> ~/studio-venv
mkdir -p "$HOME/.kiro/crew" "$HOME/.claude" "$HOME/earshot" "$HOME/hfvideo" "$HOME/.agents"
link_if_safe() {
  target="$1"
  link="$2"
  if [ -L "$link" ] || [ ! -e "$link" ]; then
    ln -sfn "$target" "$link"
  else
    echo "kept existing $link"
  fi
}
link_if_safe "$REPO" "$HOME/.kiro/crew/workspace"
link_if_safe "$REPO/.agents/skills" "$HOME/.claude/skills"
link_if_safe "$REPO/.agents/skills" "$HOME/.agents/skills"
link_if_safe "$REPO/spend-ledger.json" "$HOME/.veo_spend.json"
link_if_safe "$HOME/studio-venv" "$HOME/earshot/.venv"
link_if_safe "$HOME/studio-venv" "$HOME/hfvideo/.venv"
# Scripts written on the Mac use /Users/ayushrajput/... absolute paths.
if [ ! -e /Users/ayushrajput ]; then
  sudo mkdir -p /Users && sudo ln -sfn "$HOME" /Users/ayushrajput
fi

echo "== Google Vertex (optional: only if the GCP_SA_KEY_JSON secret is set)"
if [ -n "${GCP_SA_KEY_JSON:-}" ]; then
  if ! command -v gcloud >/dev/null; then
    curl -fsSL https://sdk.cloud.google.com | bash -s -- --disable-prompts --install-dir="$HOME"
    sudo ln -sf "$HOME/google-cloud-sdk/bin/gcloud" /usr/local/bin/gcloud
  fi
  printf '%s' "$GCP_SA_KEY_JSON" > "$HOME/.gcp-sa.json"; chmod 600 "$HOME/.gcp-sa.json"
  gcloud auth activate-service-account --key-file="$HOME/.gcp-sa.json" --quiet
  grep -q GOOGLE_APPLICATION_CREDENTIALS "$HOME/.bashrc" || \
    echo "export GOOGLE_APPLICATION_CREDENTIALS=$HOME/.gcp-sa.json" >> "$HOME/.bashrc"
  echo "Vertex: service account active"
else
  echo "Vertex: no GCP_SA_KEY_JSON secret -> Veo / Gemini image are Mac-only. That's fine."
fi

echo "== check"
node -v; ffmpeg -version | head -1; "$HOME/studio-venv/bin/earshot" --help >/dev/null && echo "earshot ok"
[ -n "${ELEVENLABS_API_KEY:-}" ] && echo "ElevenLabs key: set" || echo "ElevenLabs key: MISSING (add it in Devin Secrets)"
[ -n "${HF_TOKEN:-}" ] && echo "HF token: set" || echo "HF token: missing (free hf-video quota will run out fast on cloud IPs)"
echo "Setup done."
