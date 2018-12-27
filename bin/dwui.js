#!/usr/bin/env node
require('commander')
    .version(require('../package').version)
    .usage('<command> [options]')
    .command('create', '从模板文件中生成项目')
    .command('new', '创建一个新的vue page')
    .parse(process.argv)
