const request=require('request')
const ora=require('ora')
const chalk=require('chalk')
const cliConfig = require('../config/cli-config.json')

module.exports=(callback)=>{
  const spinner = ora('开始获取模板列表...')
  spinner.start()
  request({
    uri: cliConfig.templateListInfoUrl,
    timeout:5000
  },(err, response, body)=>{
    if(err) {
      spinner.fail(chalk.red('获取模板列表失败！'))
      console.log(err)
    }
    if(response&&response.statusCode===200){
      spinner.succeed(chalk.green('获取模板列表成功！'))
      callback(JSON.parse(body));
    }
  })
}
