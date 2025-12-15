# Relicta Demo Recording Playbook

This is a reproducible checklist for generating the release demo assets (GIF/MP4) shown on the marketing site.

## Prerequisites
- macOS with Homebrew
- Relicta v2.1.0 in PATH (`relicta version` → v2.1.0)
- Tools: `asciinema`, `agg`, `ffmpeg`
  - Install: `brew install asciinema agg ffmpeg`
- Node/npm available (for marketing build)

## Repo setup for recording
1) Clone a fresh demo repo:
```
git clone https://github.com/felixgeelhaar/test_project_service /tmp/relicta-demo
cd /tmp/relicta-demo
git tag v0.0.0
```
2) Add realistic commits (feature, fix, docs, refactor, perf, tests) with descriptive bodies. Example bodies used in the latest recording:
- feat: ship search API — adds /v1/search with tag/owner filters, stable cursors, metrics
- fix: scope cache keys — include tenant+env to avoid cross-tenant bleed
- docs: add rollout checklist — smoke tests, traffic mirroring, rollback steps
- refactor: split worker pipeline — separate queue polling from execution
- perf: trim allocations — pool buffers; ~18% fewer allocs, smoother p99
- test: cover search + cache — integration coverage for filters/pagination/scoping

3) Configure Relicta (release.config.yaml):
```
changelog:
  file: CHANGELOG.md
  format: keep-a-changelog
  link_commits: false
  link_issues: false
  repository_url: https://github.com/relicta-tech/relicta
  issue_url: https://github.com/relicta-tech/relicta/issues
workflow:
  autocommitchangelog: true
```

## Env to silence link warnings (demo only)
```
export RELICTA_CHANGELOG_LINK_COMMITS=false
export RELICTA_CHANGELOG_LINK_ISSUES=false
export RELICTA_CHANGELOG_REPOSITORY_URL=https://github.com/relicta-tech/relicta
export RELICTA_CHANGELOG_ISSUE_URL=https://github.com/relicta-tech/relicta/issues
```

## Typed recording script
Create `relicta-typed.sh` in the repo:
```
#!/usr/bin/env bash
set -euo pipefail
PS1="$ "
input_delay=0.045

type_and_run() {
  cmd="$1"; delay=${2:-0.045}
  for ((i=0; i<${#cmd}; i++)); do printf "%s" "${cmd:$i:1}"; sleep "$delay"; done
  printf "\n"; eval "$cmd"; printf "\n"; sleep 1.0
}

type_and_run "relicta plan" "$input_delay"
type_and_run "relicta blast" "$input_delay"
type_and_run "relicta bump" "$input_delay"
type_and_run "relicta notes --ai --model ollama/llama3.2 --audience users --tone friendly" "$input_delay"
type_and_run "relicta approve --yes" "$input_delay"
type_and_run "relicta publish --skip-push" "$input_delay"

sleep 5
```

Record the cast:
```
asciinema rec --idle-time-limit 1.0 --headless --capture-input /tmp/relicta.cast --command \
  "/bin/bash ./relicta-typed.sh"
```

## Render to GIF/MP4
```
agg --theme dracula --font-size 16 --cols 80 --rows 24 --idle-time-limit 1.0 --speed 1.0 --last-frame-duration 5 \
  /tmp/relicta.cast relicta.gif
ffmpeg -y -i relicta.gif -vf "fps=12,scale=trunc(iw/2)*2:trunc(ih/2)*2:flags=lanczos" \
  -movflags faststart -pix_fmt yuv420p relicta.mp4
```

## Place assets into marketing site
```
cp relicta.gif relicta.mp4 /Users/felixgeelhaar/Developer/projects/relicta-site/public/brand/relicta-preview.{gif,mp4}
cd /Users/felixgeelhaar/Developer/projects/relicta-site
npm run build
```
Commit and push the asset update separately from other content changes.

## Optional: approvals-focused clip
Follow the same flow but focus on `relicta approve`/checklist; render to `relicta-approval.gif`/`.mp4` and drop into `public/brand`.
