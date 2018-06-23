// We use the built-in 'readline' module for reading console input
var ffi = require('ffi'),
    // WinAPI methods require various constants, so store them in named variables
    // Here we need the message id for the SETDRAW message along with the integer
    // values for FALSE and TRUE
    WM_SETTEXT = 0x000C,
    WM_CHAR = 0x0102,
    VK_RETURN = 0x0D,
    handle;
    cmd = 'fileIn @"D:\\GitHub\\SRUtility\\Main\\ScriptVault\\SRUtility_UE4Tools_Max2UE4.ms"'
var ref = require('ref');


//var LPARAM  = ref.refType(ref.types.int64);

// Get proxy functions for native WINAPI FindWindow and SendMessage functions

// ffi requires the name of a dll to call methods from, along with an object
// describing the methods we want access to - their names and an array which
// contains their return type and an array of input types
var winapi = new ffi.Library("User32", {
    "FindWindowA": ["int32", ["string", "string"]],
    "FindWindowExA": ["int32", ["int32", "int32", "string", "string"]],
    "SendMessageW": ["int64", ["int32", "uint32", "uint32", "string"]],
    "SetWindowTextW": ["bool", ["int32", "string"]]
});

function TEXT(text){
    return new Buffer(text, 'ucs2').toString('binary');
 }

// In order to loop calls to the async 'question' method, we use recursion as
// a naive approach. This is not a sustainable strategy as it eventually stack
// overflows, but is used here for code clarity.
function sendPrompt() {
    // Invoking the methods registered wif ffi is as simple as calling
    // them like any other javascript method
    handle = winapi.FindWindowA(null, "Untitled - Autodesk 3ds Max  2014 x64  ");
    //handle = winapi.FindWindowA(null, match[1]);
    console.log("Process ID", handle);

    scriptWindow = winapi.FindWindowExA(null, null, null, "MAXScript Listener");
    scirptEditor = winapi.FindWindowExA(scriptWindow, null, "MXS_Scintilla", null)
    
    console.log("child process ID", scriptWindow);
    console.log("child Script ID", scirptEditor);

    // Use SendMessage to stop all paints for the window,
    // effectively rendering it non-interactable

    // Disable drawing by sending SETDRAW message with FALSE
    winapi.SendMessageW(scirptEditor, WM_SETTEXT, 0, TEXT(cmd));
    winapi.SendMessageW(scirptEditor, WM_CHAR, VK_RETURN, String(0));
    scirptEditor = null;
    //winapi.SetWindowTextW(scriptWindow, TEXT(cmd));
    console.log("child Script Inject Done");
}

// Start the loop by calling sendPrompt
sendPrompt();