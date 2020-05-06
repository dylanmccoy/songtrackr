require('dotenv').config({ path: './.env' });
const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({
  auth: process.env.GITHUB_API_KEY,
  baseUrl: 'https://api.github.com'
});

const getCommits = async () => {
    try {
        const commitData = await octokit.repos.listContributors({ owner: process.env.REPO_OWNER, repo: process.env.REPO_NAME });
        return commitData.data.map(user => ({ userName: user.login, commitCount: user.contributions }));
    } catch(err) {
        console.log(err);
    }
};

const getIssues = async () => {
    try {
        const numIssues = {};
        const issueData = await octokit.issues.listForRepo({ owner: process.env.REPO_OWNER, repo: process.env.REPO_NAME });
        issueData.data.forEach(issue => {
            for (let assignee of issue.assignees) {
                if (numIssues[assignee.login]) {
                    numIssues[assignee.login]++;
                } else {
                    numIssues[assignee.login] = 1;
                }
            }
        });
        return numIssues;
    } catch(err) {
        console.log(err);
    }
};

module.exports = {
    getCommits,
    getIssues
};
