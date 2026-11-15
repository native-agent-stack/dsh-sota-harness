# Harness instructions

When a request involves the DSH SOTA practice harness:

1. Load the dsh-plugin-sota skill.
2. Run the probes before changing scenarios or fixtures:
   node harness/run.mjs
3. Keep the harness boundary: this repo tests a small pinned surface, it does not
   install or execute third-party plugins in CI.
4. If a probe fails, fix the fixture or scenario, not the anchored catalog entry.
5. Sync from the catalog repo with:
   ./harness/scripts/sync-skill.sh
   Verify with diff -r; a READY brief does not prove the snapshot matches.
6. Do not edit the vendored catalog data by hand.
