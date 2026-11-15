# DSH plugin landscape routing

This is a user-global instruction file. It applies in every workspace, not only
the repository that owns the plugin landscape.

## When this applies

Use this routing when a request involves DeepSeek Harness plugins, skills, the
plugin ecosystem, or complex plugin architecture: discovery, comparison,
evaluation, installation, authoring, review, or landscape mapping.

For unrelated tasks, ignore this block.

Project-level instructions take precedence. If a project forbids plugin
workflows or defines its own routing, skip this block.

## Native default

Do not ask whether to load the plugin landscape skill. Resolve it first.

1. Find the skill directory, in this order:
   - ./.dsh/skills/dsh-plugin-sota
   - ~/.dsh/skills/dsh-plugin-sota
   Set SKILL_DIR to the first existing directory.
2. If found, load the dsh-plugin-sota skill.
3. Run its session brief once:

~~~sh
node "$SKILL_DIR/scripts/session-brief.mjs"
~~~

If the brief is NOT READY, report the missing artifacts and continue only with
the parts that are available.

4. Query the local catalog before searching the open web:

~~~sh
node "$SKILL_DIR/scripts/query.mjs" search "<outcome>"
node "$SKILL_DIR/scripts/query.mjs" category <key>
~~~

5. Classify the work by its primary layer L0–L9.
6. State E0–E4 evidence for material claims. A catalog description is E0.
7. For complex tasks, inspect the upstream GitHub repository — package manifest,
   patch, tests, issues — and cite it. Do not rely on one-line descriptions.
8. Do not install a plugin without explicit consent for the exact spec. State
   verification and rollback.
9. Refresh the catalog before making a landscape claim:

~~~sh
node "$SKILL_DIR/scripts/refresh-catalog.mjs"
~~~

If neither skill path exists, proceed normally and do not invent catalog counts.
