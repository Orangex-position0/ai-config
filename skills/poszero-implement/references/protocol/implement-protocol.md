# Implement Protocol

- Read the active `change.md`, Approved Ready task, or Execution Packet before other source documents.
- Record changed files, targeted tests, unresolved issues, and the key call path, module mapping, or decision deviations when relevant to understanding the implementation.
- Use the project's approved testing approach; record a TDD exception when a required test-first gate cannot be followed. Do not create a second TDD document.
- Before recording a change Result, marking a task Done, or committing it, run relevant target tests and required local regression checks from the project quality gates. Record command, result, and any unavailable check; unrun/failed required checks cannot pass the gate. Do not hard-code a test runner by language.
- Local commits follow the approved Version Control Policy after the task gate; a failed independent validation returns to Implement for a corrective change and commit, not a reset. Push or publish only after final validation passes and explicit authorization.
