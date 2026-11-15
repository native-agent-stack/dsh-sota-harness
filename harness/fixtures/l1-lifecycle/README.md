# L1 lifecycle fixture

A reversible lifecycle probe.

- E1: read the source before claiming behavior.
- Inject one effect.
- Verify a clean unload.
- Verify rollback to the previous profile state.
