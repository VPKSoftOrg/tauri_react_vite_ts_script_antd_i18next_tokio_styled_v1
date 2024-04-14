const yargs = require("yargs");
const replace = require('replace-in-file');


const options = yargs
    .option('copyright', { alias: "copyright", type: 'string', demandOption: true })
    .option('appName', { alias: "ap",type: 'string', demandOption: true })
    .parseSync();

    const greeting = `Hello, ${options.copyright}!`;

    const replaceOptions = {
      files: './vscode/tauri.code-snippets',
      from: "Petteri Kautonen",
      to: options.copyright,
    };

    try {
        const results = await replace(options)
        console.log('Replacement results:', results);
      }
      catch (error) {
        console.error('Error occurred:', error);
      }
