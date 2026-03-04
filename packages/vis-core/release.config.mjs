// Check if GitHub Actions is currently running on the main branch
const isMain = process.env.GITHUB_REF_NAME === 'sandbox-main';

export default {
  branches: [
    "sandbox-main", 
    { name: "sandbox-dev", prerelease: "beta" }
  ],
  tagFormat: "sandbox-v${version}",
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    
    // ONLY run changelog generation if on main
    ...(isMain ? [
      ["@semantic-release/changelog", { "changelogFile": "CHANGELOG.md" }]
    ] : []),

    ["@semantic-release/npm", { "gitTagVersion": false }],

    // ONLY commit files back to the repo if on main
    ...(isMain ? [
      ["@semantic-release/git", {
        "assets": ["package.json", "package-lock.json", "CHANGELOG.md"],
        "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }]
    ] : []),

    ["@semantic-release/github", { "successComment": false, "failComment": false }]
  ]
};