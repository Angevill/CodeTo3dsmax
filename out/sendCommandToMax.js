var exports = module.exports = {};

// PLEASE make this FFI module rebuild by target electron version;
// cause vscode was build by electron!!
// current vscode 1.24.1 based on electron v1.7.12
// you should rebuild like "node-gyp rebuild --target=v1.7.12 --disturl="https://atom.io/download/electron" "
// otherwise , you will get tons of error~
const ffi = require('ffi');
    // WinAPI methods require various constants, so store them in named variables
    // Here we need the message id for the SETDRAW message along with the integer
    // values for FALSE and TRUE
const WM_SETTEXT = 0x000C;
const WM_CHAR = 0x0102;
const VK_RETURN = 0x0D;




// Get proxy functions for native WINAPI FindWindow and SendMessage functions

// ffi requires the name of a dll to call methods from, along with an object
// describing the methods we want access to - their names and an array which
// contains their return type and an array of input types
var winapi = new ffi.Library("User32", {
    "FindWindowA": ["int32", ["string", "string"]],
    "FindWindowExA": ["int32", ["int32", "int32", "string", "string"]],
    //TODO: i dont konw how to make lParam valid under this arg list....
    "SendMessageW": ["int64", ["int32", "uint32", "uint32", "string"]],
    "SetWindowTextW": ["bool", ["int32", "string"]]
});

function TEXT(text){
    return new Buffer(text, 'ucs2').toString('binary');
 }


exports.sendPrompt = function(cmd) {
    let scriptWindow;
    let scirptEditor;

    //handle = winapi.FindWindowA(null, "Untitled - Autodesk 3ds Max  2014 x64  ");

    //console.log("Process ID", handle);

    scriptWindow = winapi.FindWindowExA(null, null, null, "MAXScript Listener");
    scirptEditor = winapi.FindWindowExA(scriptWindow, null, "MXS_Scintilla", null)
    
    console.log("child Script ID", scirptEditor);


    winapi.SendMessageW(scirptEditor, WM_SETTEXT, 0, TEXT(cmd));
    winapi.SendMessageW(scirptEditor, WM_CHAR, VK_RETURN, String(0));// kind of buggy with String(int)...
    console.log("child Script Inject Done");
    scirptEditor = null;
    
}