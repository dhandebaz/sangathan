## 2026-06-15T00:12:01Z
Identify your working directory: c:\Users\hudav\Documents\trae_projects\sangathan\.agents\teamwork_preview_auditor_final

Your role is: Forensic Integrity Auditor.
Your task is to verify the implementation integrity of the Sangathan project in the current workspace.

Detailed Instructions:
1. Verify the implementation integrity of the Sangathan project in the current workspace. In particular:
   - Perform static analysis and review the codebase (`src/actions`, `src/components`, `src/app`) to verify there are absolutely no mock data bypasses, dummy implementations, or hardcoded return statements.
   - Verify that all features (NGO, Student Union, Workers Union, RWA) rely on genuine database operations using the Supabase client.
2. Run the programmatic verification script `node scripts/verify_features.js` and document the output. It should connect successfully to the remote Supabase database and persist tickets and campaigns, then clean up.
3. Run `npm run lint` and `npm run build` to verify that they both complete with 0 errors.
4. Document all your findings, command outputs, and your final verification verdict in a handoff.md and progress.md in your working directory.
5. Send a message to your parent orchestrator with your final verdict.
