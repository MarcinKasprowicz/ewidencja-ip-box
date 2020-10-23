require('dotenv').config();
const { Octokit } = require('@octokit/rest');
const fs = require('fs');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  baseUrl: process.env.GITHUB_HOST,
});

const file = 'ewidencja.csv';

octokit
  .request('GET /user/orgs')
  .then(mapToOrgNames)
  .then(listRepos)
  .then(mapToReposNames)
  .then(listCommits)
  .then(mapToRecordRow)
  .then(writeToCSV)

function mapToOrgNames(response) {
  return response.data.map(d => d.login);
}

function listRepos(orgs) {
  console.log(`Collected ${orgs.length} organizations`);
  return Promise.all(
    orgs.map(org => octokit.paginate(`GET /orgs/${org}/repos`))
  );
}

function mapToReposNames(response) {
  return response.reduce(
    (repos, response) => [...repos, ...response.map(r => r.full_name)],
    []
  );
}

function listCommits(repos) {
  console.log(`Collected ${repos.length} repositories`);
  return Promise.all(
    repos.map(repo =>
      octokit
        .paginate(`GET /repos/${repo}/commits`, {
          sha: 'master',
          author: process.env.GITHUB_USERNAME,
        })
        .catch(() => [])
    )
  );
}

function mapToRecordRow(response) {
  return response
    .filter(response => response.length)
    .reduce((commits, response) => [...commits, ...response], [])
    .map(commit => ({
      repo: commit.html_url.split('/')[4],
      name: commit.commit.message.split('\n')[0],
      date: commit.commit.author.date,
      url: commit.html_url,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function writeToCSV(changes) {
  console.log(`Collected ${changes.length} commits`);

  var writer = fs.createWriteStream(file);

  writer.write('Lp.;Nazwa repozytorium;Nazwa zmiany;Data publikacji;Link URL\n');
  changes.forEach((change, index) =>
    writer.write(`${index + 1};${change.repo};${change.name};${change.date};${change.url}\n`
    )
  );

  console.log(`File "${file}" with change records has been created`);
}
