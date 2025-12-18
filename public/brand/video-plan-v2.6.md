# Relicta v2.6.0 Video Plan

## Overview

This document outlines the video content strategy for Relicta v2.6.0, featuring the new `relicta release` single-command workflow.

## Video Categories

### 1. Marketing Hero Video (30-45 seconds)
**Purpose:** Landing page hero, social media, README
**Focus:** Show the magic of `relicta release` in one command

**Script:**
```bash
# Show a repo with commits
git log --oneline -5

# One command to rule them all
relicta release

# Output shows: plan → bump → notes → approve → publish
# End with success message and release URL
```

**Key Messages:**
- "One command. Complete release workflow."
- "AI-powered release notes"
- "Built-in governance and approval"

### 2. Quick Start Video (60-90 seconds)
**Purpose:** Getting started documentation
**Focus:** From install to first release

**Script:**
```bash
# Install
brew install relicta-tech/tap/relicta

# Initialize
relicta init

# Release
relicta release --dry-run   # Preview first
relicta release             # Interactive
relicta release --yes       # CI/CD mode
```

### 3. CI/CD Integration Video (60-90 seconds)
**Purpose:** GitHub Actions documentation
**Focus:** Automated releases in pipelines

**Script:**
```yaml
# Show workflow file
- uses: relicta-tech/relicta-action@v2
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

```bash
# Or with CLI directly
relicta release --yes --json
```

### 4. Updated Tutorial Videos

#### Tutorial 1: Basic Release Workflow (UPDATE NEEDED)
- Replace step-by-step flow with `relicta release`
- Show both interactive and --yes modes
- Keep existing commits setup

#### Tutorial 6: One-Command Release (NEW)
- Deep dive into `relicta release`
- All flags: --yes, --skip-push, --force, --dry-run
- Error handling and recovery

## Recording Specifications

### Technical Setup
- Terminal: 80 columns x 24 rows
- Theme: Dracula
- Font Size: 16px
- Idle Time Limit: 1.0s
- Speed: 1.0x (real-time feel)

### Tools Required
```bash
brew install asciinema agg ffmpeg
```

### Output Formats
- `.cast` - Raw recording (for editing)
- `.gif` - Web embeds, README
- `.mp4` - Video players, social media

## Marketing Video Script (Hero)

```bash
#!/usr/bin/env bash
# relicta-hero-v2.6.sh

set -euo pipefail
PS1="$ "

type_and_run() {
  cmd="$1"; delay=${2:-0.04}
  for ((i=0; i<${#cmd}; i++)); do printf "%s" "${cmd:$i:1}"; sleep "$delay"; done
  printf "\n"; eval "$cmd"; printf "\n"; sleep 1.5
}

echo "# Conventional commits ready for release"
type_and_run "git log --oneline -5"

echo ""
echo "# One command. Complete workflow."
type_and_run "relicta release --yes"

sleep 3
```

### Recording Commands
```bash
# Setup demo repo
cd /tmp/relicta-demo

# Record
asciinema rec /tmp/hero-v2.6.cast \
  --overwrite \
  --command "bash relicta-hero-v2.6.sh" \
  --cols 80 --rows 24 \
  --idle-time-limit 1.5

# Render GIF
agg --theme dracula --font-size 16 \
  --cols 80 --rows 24 \
  --idle-time-limit 1.0 --speed 1.0 \
  --last-frame-duration 5 \
  /tmp/hero-v2.6.cast hero-v2.6.gif

# Render MP4
ffmpeg -y -i hero-v2.6.gif \
  -vf "fps=12,scale=trunc(iw/2)*2:trunc(ih/2)*2:flags=lanczos" \
  -movflags faststart -pix_fmt yuv420p \
  hero-v2.6.mp4
```

## Deployment Locations

| Video | Location |
|-------|----------|
| Hero v2.6 | `/public/brand/relicta-preview.{gif,mp4}` |
| Quick Start | `/public/videos/quickstart.{gif,mp4}` |
| Tutorial 1 (updated) | `/public/videos/tutorial1-*.{gif,mp4}` |
| Tutorial 6 (new) | `/public/videos/tutorial6-*.{gif,mp4}` |

## Timeline

1. **Day 1:** Record and render hero video
2. **Day 2:** Update Tutorial 1 recording
3. **Day 3:** Create Tutorial 6 (one-command release)
4. **Day 4:** Deploy and test on staging
5. **Day 5:** Push to production

## Social Media Assets

### Twitter/X
- 15-second GIF loop showing `relicta release`
- Square crop (1:1) for better engagement

### LinkedIn
- 30-second MP4 with captions
- Professional tone, enterprise focus

### YouTube
- Full tutorial playlist
- Each video 2-5 minutes with narration (optional)

## Notes

- Always use `--skip-push` for demo recordings
- Silence link warnings with env vars (see recording-playbook.md)
- Test playback on mobile before deploying
