#!/usr/bin/env node
const path=require('path')
const userHome=require('user-home')
const exists = require('fs').existsSync
const inquirer=require('inquirer')
const download=require('download-git-repo')
const chalk=require('chalk')
const ora=require('ora')
const rm = require('rimraf').sync
const checkVersion=require('../lib/check-version.js')
const fetchTemplateList=require('../lib/fetch-template-list')
const generate=require('../lib/generate-project')



//检测版本并执行Main函数
checkVersion(()=>{
    Main()
})

/**
 * Main
 */
function Main(){
    //本地模板存放仓库
    const tmpRepo=path.resolve(userHome,'.dwui-templates')
    //获取模板列表
    fetchTemplateList((templateList)=>{
        const choices=templateList.map(template=>{
            return {
                name:`${template.name} - ${template.description}`,
                value:template.name
            }
        })
        inquirer.prompt([{
            type:'list',
            name:'template',
            choices,
            message:'请选择对应的模板'
        }]).then(answer=>{
            //模板名称
            const tmpName=answer.template
            //远程模板地址
            const tmpUrl=templateList.find(template=>template.name===tmpName).url
            const tmpDest=path.join(tmpRepo,tmpName)
            if(exists(tmpDest)){
                inquirer.prompt([
                    {
                        type:'confirm',
                        name:'override',
                        message:'当前模板已存在是否覆盖?'
                    }
                ]).then(answer=>{
                    if(answer.override) {
                        rm(tmpDest)
                        downloadAndGenerate(tmpRepo,tmpName,tmpUrl)
                    }else{
                        generate(tmpDest)
                    }
                });
            }else{
                downloadAndGenerate(tmpRepo,tmpName,tmpUrl)
            }
        })
    })
}
/**
 *
 * @param {String} tmpRepo
 * @param {String} tmpName
 * @param {String} tmpUrl
 */
async function downloadAndGenerate(tmpRepo,tmpName,tmpUrl){
    const spinner=ora('开始下载模板文件到模板库...')
    console.info('start to download, tempRepo=' + tmpRepo + '  tepName=' + tmpName + '  tepUrl=' + tmpUrl)
    const tmpDest=path.join(tmpRepo,tmpName)
    inquirer.prompt([{
        type:'input',
        name:'branch',
        message:`当前${tmpName}分支名称 `,
        default:'master'
    }]).then(answer=>{
        spinner.start()
        download(`${tmpUrl}#${answer.branch}`,tmpDest,{
            clone:false
        },(err)=>{
            if(err){
                spinner.fail(chalk.red('下载模板失败！'))
                console.log(err)
            }else{
                spinner.succeed(chalk.green('选组模板成功！'))
                generate(tmpDest)
            }
        })
    })
}
