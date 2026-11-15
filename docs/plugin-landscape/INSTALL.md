# Install and validate on another machine

This installs the finalized DSH plugin landscape workflow without installing any
third-party DSH plugin. It is a local skill pack plus generated documentation.

## Prerequisites

Required:

- Node.js 22 or newer.
- Python 3 for the HTML renderer.
- rsync for prune-safe user-scope sync (standard on macOS/Linux).
- The repository files listed below.

Optional:

- Chrome or Chromium for the light/print theme check.
- A DSH profile if you want the skill discovered by an agent.

## Path contract

The scripts resolve docs at the repo layout by default:

~~~text
<root>/.dsh/skills/dsh-plugin-sota
<root>/docs/plugin-landscape
~~~

That is the recommended layout because build-html.py, build-coverage.mjs,
build-report-summary.mjs, validate-docs.mjs, validate-anchors.mjs,
validate-themes.mjs, and test-docs.mjs all resolve docs through it.

If docs live somewhere else, set DSH_DOCS_DIR to the absolute docs directory.
Do not rely on the old split-copy layout without this variable.

## What to copy

### Recommended: preserve the repository layout

~~~sh
mkdir -p ~/dsh-landscape
cp -R /path/to/dsh-landscape/. ~/dsh-landscape/
cd ~/dsh-landscape/.dsh/skills/dsh-plugin-sota
~~~

The default docs path is now:

~~~text
~/dsh-landscape/docs/plugin-landscape
~~~

### Split skill and docs

~~~sh
mkdir -p ~/.dsh/skills ~/Documents/dsh-landscape
cp -R .dsh/skills/dsh-plugin-sota ~/.dsh/skills/
cp -R docs/plugin-landscape/. ~/Documents/dsh-landscape/
export DSH_DOCS_DIR="$HOME/Documents/dsh-landscape"
~~~

DSH_DOCS_DIR must be absolute. The same variable is used by the HTML builder,
report summary, coverage builder, and validators.

### Project-local skill

Copy the skill to:

~~~text
<project>/.dsh/skills/dsh-plugin-sota
~~~

Also copy docs/plugin-landscape beside it under the project root, or set
DSH_DOCS_DIR. The skill discovers at the project root when a .git root is
present; otherwise the current directory is the project root. User scope is
~/.dsh/skills.

## Routing

### Project routing

Copy the DSH plugin routing block from AGENTS.md into the target project's
AGENTS.md so agents load the skill for plugin work. The block is short:

~~~text
When a request involves discovering, comparing, evaluating, installing,
authoring, reviewing, or mapping DSH plugins, load the dsh-plugin-sota skill
before acting.
~~~

### Global routing for every workspace

DSH loads a user-global instruction chain from $DSH_HOME/AGENTS.md and
<agentsHome>/AGENTS.md in every workspace, before the project chain. Install the
skill at user scope, put docs on the matching default path, and copy the routing
template:

~~~sh
mkdir -p ~/.dsh/skills/dsh-plugin-sota ~/docs/plugin-landscape
rsync -a --delete .dsh/skills/dsh-plugin-sota/ ~/.dsh/skills/dsh-plugin-sota/
rsync -a --delete docs/plugin-landscape/ ~/docs/plugin-landscape/
cp docs/plugin-landscape/AGENTS.global.md ~/.dsh/AGENTS.md
~~~

The user-scope skill resolves its default docs at ~/docs/plugin-landscape, which
is why that path is used here. It works without exporting DSH_DOCS_DIR in every
session.

rsync --delete prunes files removed or renamed in the repo. A plain cp -R does
not. Verify the mirror explicitly:

~~~sh
diff -r .dsh/skills/dsh-plugin-sota ~/.dsh/skills/dsh-plugin-sota
diff -r docs/plugin-landscape ~/docs/plugin-landscape
~~~

A READY brief only proves the installed files work; it does not prove they match
the repo. Run the diffs after every sync.

If ~/.dsh/AGENTS.md already exists, append the template instead of overwriting
it. The template resolves the skill at ./.dsh/skills/dsh-plugin-sota first, then
~/.dsh/skills/dsh-plugin-sota, and tells the agent to run the brief for plugin
work. Project AGENTS.md still takes precedence for project-specific rules.

This host now has that global file installed. A new session in any workspace
loads the routing, resolves the skill, and runs the brief when relevant — without
the user asking to load the skill.

A SessionStart hook can inject context even earlier, but the bridge runs it
detached and it can miss the first request. The global instruction chain is the
portable baseline.

## Enable future sessions

Discovery alone does not guarantee routing. Make the workflow self-starting:

1. Put the skill where DSH discovers it:
   - project: <project>/.dsh/skills/dsh-plugin-sota
   - user: ~/.dsh/skills/dsh-plugin-sota
2. Add the routing block to the project's AGENTS.md and/or the user-global
   ~/.dsh/AGENTS.md. It says to load dsh-plugin-sota and run the session brief
   before plugin work.
3. Run the brief at the start of a plugin task:

~~~sh
# project scope
node .dsh/skills/dsh-plugin-sota/scripts/session-brief.mjs
# user scope
node ~/.dsh/skills/dsh-plugin-sota/scripts/session-brief.mjs
~~~

The brief prints READY or NOT READY, the snapshot, catalog counts, docs path,
HTML size, Python status, and the next query command. It exits non-zero if the
catalog, docs, renderer, or final HTML is missing.

A DSH SessionStart hook can run the same command if the profile supports hooks,
but the AGENTS.md route plus the brief is the portable baseline.

## Validate the core workflow

Recommended repository layout:

~~~sh
cd ~/dsh-landscape/.dsh/skills/dsh-plugin-sota
node scripts/session-brief.mjs
node scripts/test-brief.mjs
node scripts/test-catalog-offline.mjs
node scripts/refresh-catalog.mjs --check
node scripts/validate-anchors.mjs
node scripts/test-anchors.mjs
node scripts/test-warnings.mjs
node scripts/test-docs.mjs
python3 scripts/build-html.py --check
node scripts/validate-docs.mjs
~~~

Split layout: prefix the docs-dependent commands with DSH_DOCS_DIR:

~~~sh
export DSH_DOCS_DIR="$HOME/Documents/dsh-landscape"
node scripts/session-brief.mjs
node scripts/test-brief.mjs
node scripts/test-catalog-offline.mjs
python3 scripts/build-html.py --check
node scripts/validate-docs.mjs
node scripts/validate-anchors.mjs
node scripts/test-docs.mjs
~~~

Offline refresh uses the committed data/raw snapshot:

~~~sh
node scripts/refresh-catalog.mjs --offline
~~~

## Test the copy in a temp home

Run this once after copying, before trusting the layout:

~~~sh
TMPHOME=$(mktemp -d)
mkdir -p "$TMPHOME/.dsh/skills" "$TMPHOME/Documents/dsh-landscape"
cp -R .dsh/skills/dsh-plugin-sota "$TMPHOME/.dsh/skills/"
cp -R docs/plugin-landscape/. "$TMPHOME/Documents/dsh-landscape/"
cd "$TMPHOME/.dsh/skills/dsh-plugin-sota"
export DSH_DOCS_DIR="$TMPHOME/Documents/dsh-landscape"

node scripts/session-brief.mjs
node scripts/test-brief.mjs
node scripts/test-catalog-offline.mjs
node scripts/refresh-catalog.mjs --check
python3 scripts/build-html.py --check
node scripts/validate-anchors.mjs
node scripts/test-docs.mjs
node scripts/validate-docs.mjs
~~~

This proves the split layout works without falling back to the original repo.

## Optional light/print check

The theme validator needs Node.js 22+ global WebSocket and Chrome/Chromium.

~~~sh
node scripts/validate-themes.mjs
~~~

If Chrome is not in a standard path:

~~~sh
DSH_CHROME="/path/to/chrome" node scripts/validate-themes.mjs
~~~

Without Chrome or WebSocket the check prints SKIP and exits 0, so the core
pipeline remains portable. For CI where the check is mandatory:

~~~sh
node scripts/validate-themes.mjs --require
~~~

That exits non-zero with a clear error if the prerequisites are missing.

## Regenerate the surfaces

~~~sh
node scripts/refresh-catalog.mjs
node scripts/build-landscape.mjs
node scripts/build-coverage.mjs
node scripts/build-report-summary.mjs
python3 scripts/build-html.py
~~~

The rendered manifest is docs/plugin-landscape/final-manifest.html.

## Use the SOTA workflow

1. Frame the outcome, host/profile, constraints, and evidence bar.
2. Query the local catalog:

~~~sh
node scripts/query.mjs search "outcome words" --limit 15
node scripts/query.mjs category <key> --limit 20
node scripts/query.mjs exemplars --category <key>
~~~

3. Classify by the primary layer L0–L9.
4. Shortlist three architectures and evaluate E0–E4.
5. Record adoption, trial, build, avoid, or insufficient evidence.
6. Install only with explicit consent; record verify and rollback.
7. Refresh before making a landscape claim.

## Revisit

The accepted architecture and exact counts are in
[ADR-0001-final-architecture.md](ADR-0001-final-architecture.md). Revisit on a
DSH version bump, upstream schema change, category or anchor change, or annually.

The evidence record is [VALIDATION.md](VALIDATION.md). The generated manifest is
[final-manifest.html](final-manifest.html).
