// eslint-disable
const yargs = require("yargs");
const replace = require('replace-in-file');


const options = yargs
    .option('copyright', { alias: "copyright", type: 'string', demandOption: true })
    .option('appName', { alias: "app",type: 'string', demandOption: true })
    .parseSync();

    const appNameSnakeCase = options.appName.split(/(?=[A-Z])/).join('_').toLowerCase();

    const replaceOptions = {
      files: ["../.vscode/tauri.code-snippets", 
      "../src/App.tsx", 
      "../src-tauri/tauri.conf.json", 
      "../Cargo.lock", 
      "../package.json", 
      "../package-lock.json",
      "../src-tauri/Cargo.toml",
      "../src-tauri/Cargo.lock"],
      from: ["#COPYRIGHT#", "TauriTemplate", "tauri_template"],
      to: [options.copyright, options.appName, appNameSnakeCase],
    };

    replace(replaceOptions)
    .then(results => {
      console.log('Replacement results:', results);
    })
    .catch(error => {
      console.error('Error occurred:', error);
    });