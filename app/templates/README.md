# <%= appName %>

<%= appDescription %>

## General Information

- [Wiki](<%= urlWiki %>)
- [Jira](<%= urlJira %>)
- [Frontend (http://<%= repositoryName %>.dev.queo-group.com)](http://<%= repositoryName %>.dev.queo-group.com) 
- ASP: 
  - [<%= appAuthorName %>](<%= appAuthorUrl %>)

##  Installation

**Requirements**
- Node.js (>= 4) installed globally
- NPM (>= 3) installed globally

**Installation**
`npm install`

**Tasks**

- `npm run-script development` Development version
- `npm run-script demo` Production version + local server
- `npm run-script production` Production version to deploy to website
- `npm run-script dist-patch` Create resources for the live system and increase patch version
- `npm run-script dist-update` Create resources for the live system and increase minor version
- `npm run-script dist-upgrade` Create resources for the live system and increase major version
