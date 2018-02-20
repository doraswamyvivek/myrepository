const program = require('commander')
const inquirer = require('inquirer')
const path = require('path')
const chalk = require('chalk')
const yaml = require('node-yaml')
const log = console.log
const { readFile } = require('./js/helpers')

const logoPath = path.join(__dirname, 'logo.txt')
const questions = require('./js/questions')

main()

async function main() {

  const configYaml = await readFile(path.join(__dirname, 'config.yml'))
    .catch(e => {

      log(chalk.red('config.yaml not found, is vincit/wordpress installed correctly?'))
      log(e)

      return `
development:
  domains:
    - sampledata.local
`
    })
  const config = yaml.parse(configYaml)

  program
    .option('--autorun', 'Automatic task runner meant to be used by vagrant-up-customizer.sh')
    .parse(process.argv)

  log(chalk.yellow(await readFile(logoPath)))
  if (program.autorun) {
    autorun(config)
  } else {
    manual(config)
  }
}

async function autorun(config = {}) {
  log(config)

  try {
    themeInstaller(config.development.domains[0])
  } catch(e) {
    console.error(e)
  }
}

async function manual(config = {}) {
  log('test')
}

async function themeInstaller(url) {
  const answers = await inquirer.prompt([
    questions.theme.install,
    questions.theme.name,
    questions.theme.correctURL(url),
    questions.theme.changeURL,
    questions.theme.trackInGit,
    questions.theme.activate,
  ])

  log(answers)
}
