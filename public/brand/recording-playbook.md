# Relicta Demo Recording Playbook

This is a reproducible checklist for generating the release demo assets (GIF/MP4) shown on the marketing site.

## Prerequisites
- macOS with Homebrew
- Relicta v2.6.0+ in PATH (`relicta version` → v2.6.0)
- Tools: `asciinema`, `agg`, `ffmpeg`
  - Install: `brew install asciinema agg ffmpeg`
- Node/npm available (for marketing build)

## Repo setup for recording
1) Clone a fresh demo repo:
```bash
git clone https://github.com/felixgeelhaar/test_project_service /tmp/relicta-demo
cd /tmp/relicta-demo
git tag v0.0.0
```

2) Add realistic commits (feature, fix, docs, refactor, perf, tests) with descriptive bodies:
```
feat: ship search API — adds /v1/search with tag/owner filters, stable cursors, metrics
fix: scope cache keys — include tenant+env to avoid cross-tenant bleed
docs: add rollout checklist — smoke tests, traffic mirroring, rollback steps
refactor: split worker pipeline — separate queue polling from execution
perf: trim allocations — pool buffers; ~18% fewer allocs, smoother p99
test: cover search + cache — integration coverage for filters/pagination/scoping
```

3) Configure Relicta (release.config.yaml):
```yaml
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
```bash
export RELICTA_CHANGELOG_LINK_COMMITS=false
export RELICTA_CHANGELOG_LINK_ISSUES=false
export RELICTA_CHANGELOG_REPOSITORY_URL=https://github.com/relicta-tech/relicta
export RELICTA_CHANGELOG_ISSUE_URL=https://github.com/relicta-tech/relicta/issues
```

---

## Hero Demo: One-Command Release (v2.6.0+)

The recommended demo showcasing `relicta release`:

### Script: `relicta-hero.sh`
```bash
#!/usr/bin/env bash
set -euo pipefail
PS1="$ "

type_and_run() {
  cmd="$1"; delay=${2:-0.04}
  for ((i=0; i<${#cmd}; i++)); do printf "%s" "${cmd:$i:1}"; sleep "$delay"; done
  printf "\n"; eval "$cmd"; printf "\n"; sleep 1.5
}

echo "# Recent commits ready for release"
type_and_run "git log --oneline -5"

echo ""
echo "# One command. Complete workflow."
type_and_run "relicta release --yes --skip-push"

sleep 3
```

### Record
```bash
asciinema rec /tmp/relicta-hero.cast \
  --overwrite \
  --command "bash relicta-hero.sh" \
  --cols 80 --rows 24 \
  --idle-time-limit 1.5
```

### Render
```bash
# GIF
agg --theme dracula --font-size 16 \
  --cols 80 --rows 24 \
  --idle-time-limit 1.0 --speed 1.0 \
  --last-frame-duration 5 \
  /tmp/relicta-hero.cast relicta-preview.gif

# MP4
ffmpeg -y -i relicta-preview.gif \
  -vf "fps=12,scale=trunc(iw/2)*2:trunc(ih/2)*2:flags=lanczos" \
  -movflags faststart -pix_fmt yuv420p \
  relicta-preview.mp4
```

---

## Alternative: Step-by-Step Demo

For tutorials showing individual commands:

### Script: `relicta-steps.sh`
```bash
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
type_and_run "relicta bump" "$input_delay"
type_and_run "relicta notes --ai --model ollama/llama3.2 --audience users --tone friendly" "$input_delay"
type_and_run "relicta approve --yes" "$input_delay"
type_and_run "relicta publish --skip-push" "$input_delay"

sleep 5
```

### Record
```bash
asciinema rec /tmp/relicta-steps.cast \
  --overwrite \
  --command "bash relicta-steps.sh" \
  --cols 80 --rows 24 \
  --idle-time-limit 1.0
```

---

## Render to GIF/MP4

Standard render settings for all demos:
```bash
# GIF
agg --theme dracula --font-size 16 --cols 80 --rows 24 \
  --idle-time-limit 1.0 --speed 1.0 --last-frame-duration 5 \
  /tmp/input.cast output.gif

# MP4
ffmpeg -y -i output.gif \
  -vf "fps=12,scale=trunc(iw/2)*2:trunc(ih/2)*2:flags=lanczos" \
  -movflags faststart -pix_fmt yuv420p \
  output.mp4
```

---

## Place assets into marketing site
```bash
cp relicta-preview.gif relicta-preview.mp4 \
  /Users/felixgeelhaar/Developer/projects/relicta-tech/relicta-site/public/brand/

cd /Users/felixgeelhaar/Developer/projects/relicta-tech/relicta-site
npm run build
```

Commit and push the asset update separately from other content changes.

---

## Video Variants

| Name | Focus | Duration | Script |
|------|-------|----------|--------|
| Hero | `relicta release` one-liner | 15-30s | relicta-hero.sh |
| Tutorial | Step-by-step commands | 45-60s | relicta-steps.sh |
| Approval | CGP governance workflow | 30-45s | relicta-approval.sh |
| CI/CD | GitHub Action usage | 30s | relicta-cicd.sh |

---

## Tips

- Always use `--skip-push` for demo recordings
- Use `--yes` to skip interactive prompts
- Test playback on mobile before deploying
- Keep recordings under 60 seconds for engagement
- Use `--dry-run` for preview-focused demos
