// eslint-disable
import yargs from 'yargs';
import { replaceInFile } from 'replace-in-file';

const options = yargs(process.argv.splice(2)).option('copyright', { alias: "copyright", type: 'string', demandOption: true })
    .option('appName', { alias: "app",type: 'string', demandOption: true })
    .option('initialVersion', { alias: "initialVersion",type: 'string', demandOption: true })
    .option('appUrl', { alias: "appUrl",type: 'string', demandOption: true })
    .option('sourceUrl', { alias: "sourceUrl",type: 'string', demandOption: true })
    .option('manualDownloadUri', { alias: "manualDownloadUri",type: 'string', demandOption: true })
    .option('shortDescription', { alias: "shortDescription",type: 'string', demandOption: true })
    .parseSync();

    const appNameSnakeCase = options.appName.match(/[A-Z]?[a-z]+|[0-9]+|[A-Z]+(?![a-z])/g).join("_").toLowerCase()

    const appNameCamelCase = options.appName.match(/[A-Z]?[a-z]+|[0-9]+|[A-Z]+(?![a-z])/g).join("").charAt(0).toUpperCase() + options.appName.match(/[A-Z]?[a-z]+|[0-9]+|[A-Z]+(?![a-z])/g).join("").slice(1).toLowerCase()

    const replaceOptions = {
      files: [
        "../.vscode/tauri.code-snippets", 
        "../src/App.tsx", 
        "../src-tauri/tauri.conf.json", 
        "../Cargo.lock", 
        "../package.json", 
        "../package-lock.json",
        "../src-tauri/Cargo.toml",
        "../src-tauri/Cargo.lock",
        "../src-tauri/src/config.rs",
        "../src/components/popups/AboutPopup.tsx"],
      from: [
        /#COPYRIGHT#/g,
        /TauriTemplate/g,
        /tauri_template/g, 
        /0\.0\.0/g, 
        /https:\/\/tauri.app/g,
        /https:\/\/github.com\/VPKSoftOrg\/tauri_react_vite_ts_script/g,
        /https:\/\/github.com\/VPKSoftOrg\/tauri_react_vite_ts_script\/releases\/latest/g,
        /authors = \["you"\]/g,
        /description = "A Tauri App"/g,
        /"identifier": "?.*"/g],
      to: [
        options.copyright, 
        options.appName, 
        appNameSnakeCase,
        options.initialVersion, 
        options.appUrl,
        options.sourceUrl,
        options.manualDownloadUri,
        `authors = ["${options.copyright}"]`,
        `description = "${options.shortDescription}"`,
        `"identifier": "${appNameCamelCase}"`],
    };

    replaceInFile(replaceOptions)
    .then(results => {
      console.log('Replacement results:', results);
    })
    .catch(error => {
      console.error('Error occurred:', error);
    });