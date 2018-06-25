// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');
let sendCommand = require("./sendCommandToMax.js");



// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "codeto3dsmax" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand
    (
        'extension.sendMXScriptFile', 
        function () {
            let currentlyOpenTabfilePath = vscode.window.activeTextEditor.document.fileName;
            let currentlyOpenTabfileName = path.basename(currentlyOpenTabfilePath);
            let cmd = 'fileIn @' + "\"" + currentlyOpenTabfilePath + "\" ";
            console.log(cmd);
            sendCommand.sendPrompt(cmd);
            let vsInfoMsg = 'Send ' + currentlyOpenTabfileName + ' to Max';
            vscode.window.showInformationMessage(vsInfoMsg);
        }
    );

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;