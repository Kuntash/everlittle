# Agent instructions

## Production deployments

- Deploy to production only from the `main` branch.
- Merge the PR first. Then pull `origin/main` into the main checkout and deploy from that checkout.
- Do not deploy a feature branch or a worktree build to production.
- Test a branch locally or on a preview version. Do not replace the production deployment for a test.

Each deployment deletes the CSS and JavaScript files of the previous build. Open pages then lose their styles.
A branch deployment also replaces the bindings and variables of the Worker with those of the branch.
