"use strict";
// PLEASE make this FFI module rebuild by target electron version;
// cause vscode was built by electron!!
// e.g current vscode 1.24.1 based on electron v1.7.12
// you should rebuild it like "node-gyp rebuild --target=v1.7.12 --disturl="https://atom.io/download/electron" "
// otherwise, you will get tons of error~
const ffi = require('ffi');
const path = require('path');

const WM_SETTEXT = 12//0x000C; //12
const WM_CHAR = 258//0x0102; //258
const VK_RETURN = 13//0x0D; //13

// ffi requires the name of a dll to call methods from, along with an object
// describing the methods we want access to - their names and an array which
// contains their return type and an array of input types
let winapi = new ffi.Library("User32", {
    "FindWindowExA": ["int32", ["int32", "int32", "string", "string"]], 
    //TODO: i dont konw how to make lParam valid under this arg list.... so use string instead
    "SendMessageW": ["int32", ["int32", "uint32", "uint32", "string"]]
});

function TEXT(text){
    return new Buffer(text, 'ucs2').toString('binary');
 }

function convertToSolidCMD(file) {
    if (path.extname(file) === ".ms") {
        return ('fileIn @' + "\"" + file + "\" ");
    } else if (path.extname(file) === ".py") {
        return ('python.executeFile @' + "\"" + file + "\" ");
    } else {
        return false;
    }
} 

function sendMXSToMAX(file) {
    let scriptWindow = winapi.FindWindowExA(null, null, null, "MAXScript Listener");
    let scirptEditor = winapi.FindWindowExA(scriptWindow, null, "MXS_Scintilla", null);

    let cmd = convertToSolidCMD(file);
    console.log(cmd);


    if ((scirptEditor != 0) && cmd) {
        let isCmdSent = winapi.SendMessageW(scirptEditor, WM_SETTEXT, 0, TEXT(cmd));
        let isEnterSent = winapi.SendMessageW(scirptEditor, WM_CHAR, VK_RETURN, "0");// kind of bugg still...Maybe js mess up with type convert?
        console.log("cmd sent is " + isCmdSent);
        console.log("Enter sent is " + isEnterSent);
        return true;
    }
    else {
        return false;
    }
};

exports.sendMXSToMAX = sendMXSToMAX;
