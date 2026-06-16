# Branch Protection Setup

Configure these rules in GitHub: Settings → Branches → Add rule

## Main branch (`main`)

✅ Require a pull request before merging
  - ✅ Require approvals: 1
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  - ✅ Require review from Code Owners

✅ Require status checks to pass before merging
  - ✅ Require branches to be up to date before merging
  - Required checks:
    - `Backend — Build`
    - `Frontend — Build`

✅ Require conversation resolution before merging
✅ Require linear history (no merge commits)
✅ Include administrators (apply rules to admins too)

❌ Allow force pushes
❌ Allow deletions
