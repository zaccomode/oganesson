# Releasing oganesson-svelte

Releases follow the same path as the `sketchframe` CLI: the version in
`package.json` is the decision, merging it to `main` is the approval to build,
and publishing the draft GitHub release is the approval to put it on npm.

1. **Bump the version** in a pull request:

   ```sh
   npm version 0.2.0 --no-git-tag-version
   ```

   This updates `package.json` and `package-lock.json`.

2. **Merge it.** Once the `oganesson-svelte` CI workflow passes on `main`,
   `.github/workflows/svelte-tag-release.yml` sees the version change, tags the
   commit `svelte-v0.2.0` and starts `.github/workflows/svelte-release.yml` on
   that tag. Its `build` job runs lint, svelte-check and the tests and packs
   the package (`prepack` runs `svelte-package` and `publint`), all with a
   read-only token. Its `draft` job, the only one with write access, runs no
   repository or dependency code: it takes the tarball from `build` and leaves
   a **draft** release with `oganesson-svelte-0.2.0.tgz` attached and the
   tarball's SHA-256 at the top of the notes.

3. **Publish the draft** from the repository's Releases page. That starts
   `.github/workflows/svelte-publish-npm.yml`, which checks that the release
   has exactly one tarball, that it holds `oganesson-svelte` at the tag's
   version, and that its SHA-256 matches the line in the notes, then publishes
   it, unchanged, to npm with provenance. Edit the notes as you like, but keep
   the SHA-256 line: without it the publish fails. A release published with
   **Set as a pre-release** ticked stays on GitHub only; unticking it later
   publishes it then.

Every action in `.github/workflows` is pinned to a full commit SHA, with its
version in a comment. Dependabot's `github-actions` updates move both.

Pushing a tag by hand still works, and is the fallback if the tagging workflow
fails:

```sh
git tag svelte-v0.2.0 && git push origin svelte-v0.2.0
```

A version bump buried in the middle of a direct push of several commits is
missed by the tagging workflow, because it only compares the commit CI ran on
with its parent. Run **Actions → Tag oganesson-svelte release → Run workflow**
from `main` once CI is green, and it tags `main`'s head with its current
version.

To retry a failed npm publish, run **Actions → Publish oganesson-svelte to npm
→ Run workflow** and choose the release's tag in the ref picker. It skips a
version npm already has. A version can only be published to npm once, so a
broken release is fixed with a new version, not a re-publish.

## The first release

The package started at 0.1.0, so there is no version bump to see. While no
`svelte-v*` tag exists, the tagging workflow releases the current version on
the next green CI run on `main`, so merging the change that added these
workflows produces the `svelte-v0.1.0` draft.

## One-Off Setup

### The `release` Environment

**Settings → Environments → New environment**, named `release`:

- **Deployment branches and tags:** "Selected branches and tags", with a single
  tag rule `svelte-v*`. This keeps the right to publish to npm out of reach of
  a workflow run from any branch.
- No secrets: npm's trusted publishing needs none.

### npm

Publishing uses npm's trusted publishing, so there is no token to store or
renew. npm only lets a trusted publisher be added to a package that exists, so
the first version is published by hand:

1. Sign in to [npmjs.com](https://www.npmjs.com) with the account that will
   own the `oganesson-svelte` package.
2. Download `oganesson-svelte-0.1.0.tgz` from the `svelte-v0.1.0` draft release
   and run `npm publish oganesson-svelte-0.1.0.tgz --access public`.
3. On the package's **Settings → Trusted publishing**, add a GitHub Actions
   publisher:
   - **Organization or user:** `zaccomode`
   - **Repository:** `oganesson`
   - **Workflow filename:** `svelte-publish-npm.yml`
   - **Environment:** `release`
4. Optionally, under **Settings → Publishing access**, choose "Require
   two-factor authentication and disallow tokens", so only the workflow (and
   you, with 2FA) can publish.
5. Publish the draft release. The publish workflow finds 0.1.0 already on npm
   and does nothing; every release after that goes through it.

The publisher names the workflow by filename, so renaming
`svelte-publish-npm.yml` means updating it.
