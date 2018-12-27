const Metalsmith = require('metalsmith')
const inquirer = require('inquirer')
const chalk = require('chalk')
const path = require('path')
const ora = require('ora')
const fs = require('fs-extra')
const writeFileTree = require('./utils/writeFileTree')
const transformIntoAbsolutePath = require('./local-path').transformIntoAbsolutePath
const renderTemplateFiles = require('./render-template-files')


module.exports = (tmpPath) => {
    const metalsmith = Metalsmith(tmpPath)
    inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: '输入项目名称',
        default: 'dwui-project'
    }, {
        type: 'input',
        name: 'destination',
        message: '输入项目保存路径(可跳过)',
        default: process.cwd()
    }]).then(answer => {
        console.info('start geng')
        //项目生成路径
        const destination = path.join(transformIntoAbsolutePath(answer.destination), answer.name)
        const spinner = ora('项目生成中...').start()
        //加入新的全局变量
        Object.assign(metalsmith.metadata(), answer)

        spinner.start()

        metalsmith
            .source('.')
            .destination(destination)
            .clean(false)
            .build(function (err) {
                spinner.stop()
                if (err) throw err
                console.log()
                console.log(chalk.green('开始更改 package.json 相关信息'))
                let packageJsonPath = path.join(destination, './package.json')
                const packageObj = fs.readJSONSync(packageJsonPath)
                fs.removeSync(packageJsonPath)
                packageObj.name = answer.name
                writeFileTree(destination, {
                    'package.json': JSON.stringify(packageObj, null, 2)
                })
                console.log(chalk.green('项目构建完成！'))
                console.log()
                console.log((`${chalk.green('Please cd')} ${destination} ${chalk.green('to start your coding')}`))
                console.log()
            })
    })
}

