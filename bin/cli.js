#!/usr/bin/env node

const { program } = require('commander');
const app = require('../main');
const pkg = require('../package.json');

program
    .command('ls')
    .description('list all the users')
    .action(app.showUserList);

program
    .command('current')
    .description('show current user name')
    .action(app.showCurrentUser);

program
    .command('use [name]')
    .description('change current user')
    .action(app.changeUser);

program
    .name(pkg.name)
    .parse(process.argv);

if (process.argv.length === 2) {
    program.outputHelp();
}
