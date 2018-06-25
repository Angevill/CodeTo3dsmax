"use strict";
// PLEASE make this FFI module rebuild by target electron version;
// cause vscode was build by electron!!
// current vscode 1.24.1 based on electron v1.7.12
// you should rebuild like "node-gyp rebuild --target=v1.7.12 --disturl="https://atom.io/download/electron" "
// otherwise , you will get tons of error~
var ffi = require('ffi');
const vscode = require('vscode');

const WM_SETTEXT = 0x000C;
const WM_CHAR = 0x0102;
const VK_RETURN = 0x0D;

// ffi requires the name of a dll to call methods from, along with an object
// describing the methods we want access to - their names and an array which
// contains their return type and an array of input types

let winapi = new ffi.Library("User32", {
    "FindWindowExA": ["int32", ["int32", "int32", "string", "string"]], 
    //TODO: i dont konw how to make lParam valid under this arg list....
    "SendMessageW": ["int32", ["int32", "uint32", "uint32", "string"]]
});

function TEXT(text){
    return new Buffer(text, 'ucs2').toString('binary');
 }

exports.sendPrompt = function(cmd) {
    let scriptWindow = winapi.FindWindowExA(null, null, null, "MAXScript Listener");
    let scirptEditor = winapi.FindWindowExA(scriptWindow, null, "MXS_Scintilla", null)
    
    console.log("child Script ID", scirptEditor);
    if (scirptEditor != 0) {
        let isCmdSent = winapi.SendMessageW(scirptEditor, WM_SETTEXT, 0, TEXT(cmd));
        let isEnterSent = winapi.SendMessageW(scirptEditor, WM_CHAR, VK_RETURN, String(0));
        console.log("cmd sent is " + isCmdSent);
        console.log("Enter sent is " + isEnterSent);
        scirptEditor = null;
        return true;
    }
    else {
        return false;
    }
};
