const fs = require('fs')
const path = require('path')
const { toQwerty } = require('qwerty-to-colemak')
const configPath = path.resolve(process.argv[2] || './karabiner.json')
const config = require(configPath)
const karabinerConfigToMarkdown = require('karabiner-config-to-markdown')

// modify config to convert app launcher keys from COLEMAK to QWERTY since they are mnemonics
// do not convert other shortcuts since they are based only on their location on the keyboard
const appLauncherRule = config.profiles[0].complex_modifications.rules
  .find(rule => rule.description.startsWith('Launch apps'))
appLauncherRule.manipulators.forEach(manipulator => {
  manipulator.from.key_code = toQwerty(manipulator.from.key_code)
})

/** Simple string templeating. Replaces {{key}} with `value` in a template string for each key-value entry in an object. */
const template = (s, o) => {
  let output = s
  for (const [key, value] of Object.entries(o)) {
    output = output.replace(new RegExp(`\\{\\{\\w*${key}\\w*}}`), value)
  }
  return output
}

const readmeTemplate = fs.readFileSync('./readme-template.txt', 'utf-8')
const markdown = karabinerConfigToMarkdown(config)
const output = template(readmeTemplate, { rules: markdown })
console.log(output)
