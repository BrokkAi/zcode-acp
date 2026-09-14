# BrokkAi adapter releases

Publish `@brokkai/zcode-acp` from `BrokkAi/zcode-acp`. Keep the `zcode-acp` and `zcode-acp-server` executable names. Upstream `william0wang/zcode-acp` is a source of updates, not a publication destination.

Each fix is developed on a branch taken from `upstream/main`, opened as a pull request to `william0wang/zcode-acp`, and merged into the fork's `main`. Upstream releases are merged into `main`, never rebased onto it, so the fork keeps a normal merge history against upstream. The fork's version numbers continue upstream's numbering rather than starting a separate scheme.

Run `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm test`, `pnpm smoke`, and `npm pack`. Check the packed tarball contains `dist/`, `assets/`, `docs/`, `README.md`, `LICENSE`, and `package.json`. Validate the packaged adapter against a live editor session before publishing.

Update the version and changelog, commit `package.json` and `pnpm-lock.yaml` together, and push the tested commit to BrokkAi `main`. Create and push its matching `vX.Y.Z` tag on that exact commit. The `publish.yml` workflow verifies package identity and version, runs the checks, packs the artifact, then publishes that exact tarball to npm and attaches it to a GitHub release. There is no preview channel and no automatic version bump.

The npm package must have a trusted publisher for repository `BrokkAi/zcode-acp`, workflow `publish.yml`, environment `release`. Bootstrap the package with an authorized npm maintainer if necessary, then configure trusted publishing. No npm tokens are stored in this repository. The release environment must allow version tags. Enable Actions after installing this fork's workflows.

For recovery, dispatch `publish.yml` with the existing tag. Published npm versions are immutable and are skipped during recovery. Never move a published tag. Verify the npm version and the GitHub release tarball, then update mj's exact package pin, its lockfile, and its container image installation.
