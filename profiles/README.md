# Profiles

No global profile edit is required for the probes.

Run DSH with this repository as the working directory; the project-local skill at
.dsh/skills/dsh-plugin-sota is discovered automatically. The harness only reads
the catalog and runs local fixtures.

If you attach the harness to a disposable profile, keep third-party plugin
installs out of CI and record the rollback path in the scenario.
