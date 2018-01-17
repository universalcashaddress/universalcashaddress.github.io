/*
 Unlicense
 This is free and unencumbered software released into the public domain.
 
 Anyone is free to copy, modify, publish, use, compile, sell, or
 distribute this software, either in source code form or as a compiled
 binary, for any purpose, commercial or non-commercial, and by any
 means.
 
 In jurisdictions that recognize copyright laws, the author or authors
 of this software dedicate any and all copyright interest in the
 software to the public domain. We make this dedication for the benefit
 of the public at large and to the detriment of our heirs and
 successors. We intend this dedication to be an overt act of
 relinquishment in perpetuity of all present and future rights to this
 software under copyright law.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
 
 For more information, please refer to <http://unlicense.org/>
 */

var qrcode58 = new QRCode(document.getElementById('qrcode58'), {
                          width : 100,
                          height : 100,
                          //typeNumber : 6,//2,//4,//6,
                          //correctLevel : QRErrorCorrectLevel.M,
                          useSVG: true
                          });

var qrcode32 = new QRCode(document.getElementById('qrcode32'), {
                          width : 100,
                          height : 100,
                          //typeNumber : 6,//2,//4,//6,
                          //correctLevel : QRErrorCorrectLevel.M,
                          useSVG: true
                          });

var qrcodehex = new QRCode(document.getElementById('qrcodehex'), {
                           width : 100,
                           height : 100,
                           //typeNumber : 6,//2,//4,//6,
                           //correctLevel : QRErrorCorrectLevel.M,
                           useSVG: true
                           });

function makeCode() {
    //console.log("call makeCode")
    var elText58 = document.getElementById('base58address').value;
    var elText32 = document.getElementById('base32address').value;
    var elTextthex = document.getElementById('hexadecimaladdress').value;
    //console.log("elText58 = " + elText58)
    //console.log("elText32 = " + elText32)
    //console.log("elTextthex = " + elTextthex)
    if (!elText58 || !elText32 || !elTextthex) {
        //alert("Input a text");
        //elText.focus();
        //console.log("!elText58 || !elText32 || !elTextthex")
        document.getElementById('qrright58').style = "display: none;"
        document.getElementById('qrright32').style = "display: none;"
        document.getElementById('qrrighthex').style = "display: none;"
        document.getElementById('qrleft58').style = style="width: 95%;"
        document.getElementById('qrleft32').style = style="width: 95%;"
        document.getElementById('qrlefthex').style = style="width: 95%;"
        qrcode58.clear();
        qrcode32.clear();
        qrcodehex.clear();
        return;
    }
    document.getElementById('qrright58').style = "display: inline-block;"
    document.getElementById('qrright32').style = "display: inline-block;"
    document.getElementById('qrrighthex').style = "display: inline-block;"
    document.getElementById('qrleft58').style = style="width: 80%;"
    document.getElementById('qrleft32').style = style="width: 80%;"
    document.getElementById('qrlefthex').style = style="width: 80%;"
    qrcode58.makeCode(elText58);
    qrcode32.makeCode(elText32);
    qrcodehex.makeCode(elTextthex);
}

document.getElementById('prefix').oninput = function() {
    input = document.getElementById('prefix').value
    cleanBase32Address();cleanBase58Address();cleanHexAddress();cleanBinaryAddress()
}
document.getElementById('P2PKH').oninput = function() {
    input = document.getElementById('P2PKH').value
    cleanBase32Address();cleanBase58Address();cleanHexAddress();cleanBinaryAddress()
}
document.getElementById('P2SH').oninput = function() {
    input = document.getElementById('P2SH').value
    cleanBase32Address();cleanBase58Address();cleanHexAddress();cleanBinaryAddress()
}
document.getElementById('base32alphabet').oninput = function() {
    input = document.getElementById('base32alphabet').value
    cleanBase32Address();cleanBase58Address();cleanHexAddress();cleanBinaryAddress()
}
document.getElementById('base58alphabet').oninput = function() {
    input = document.getElementById('base58alphabet').value
    cleanBase32Address();cleanBase58Address();cleanHexAddress();cleanBinaryAddress()
}
document.getElementById('base58address').oninput = function() {
    document.getElementById('b32correctionrow').innerHTML = ""
    document.getElementById('b32correctionrow').style = "display: none;"
    input = document.getElementById('base58address').value
    var inprefix = document.getElementById('prefix').value
    if (inprefix[inprefix.length-1] != ":")
        inprefix = inprefix.concat(":")
        var inP2PKH = document.getElementById('P2PKH').value
        var inP2SH = document.getElementById('P2SH').value
        var alphabet32 = document.getElementById('base32alphabet').value
        var alphabet58 = document.getElementById('base58alphabet').value
        cleanBase32Address();cleanHexAddress();cleanBinaryAddress()
    parseBase58Address(inprefix, inP2PKH, inP2SH, alphabet32, alphabet58, input)
    makeCode()
}
document.getElementById('base32address').oninput = function() {
    document.getElementById('b32correctionrow').innerHTML = ""
    document.getElementById('b32correctionrow').style = "display: none;"
    //console.log("base32 text entered")//debug
    input = document.getElementById('base32address').value
    var inprefix = document.getElementById('prefix').value
    if (inprefix[inprefix.length-1] != ":")
        inprefix = inprefix.concat(":")
        var inP2PKH = document.getElementById('P2PKH').value
        var inP2SH = document.getElementById('P2SH').value
        var alphabet32 = document.getElementById('base32alphabet').value
        var alphabet58 = document.getElementById('base58alphabet').value
        cleanBase58Address();cleanHexAddress();cleanBinaryAddress()
    if (input[inprefix.length-1] == ':') {
        parseBase32Address(inprefix, inP2PKH, inP2SH, alphabet32, alphabet58, input.slice(inprefix.length))
    } else {
        parseBase32Address(inprefix, inP2PKH, inP2SH, alphabet32, alphabet58, input)
    }
    makeCode()
}
document.getElementById('hexadecimaladdress').oninput = function() {
    document.getElementById('b32correctionrow').innerHTML = ""
    document.getElementById('b32correctionrow').style = "display: none;"
    input = document.getElementById('hexadecimaladdress').value
    var inprefix = document.getElementById('prefix').value
    if (inprefix[inprefix.length-1] != ":")
        inprefix = inprefix.concat(":")
        var inP2PKH = document.getElementById('P2PKH').value
        var inP2SH = document.getElementById('P2SH').value
        var alphabet32 = document.getElementById('base32alphabet').value
        var alphabet58 = document.getElementById('base58alphabet').value
        cleanBase32Address();cleanBase58Address();cleanBinaryAddress()
    //parseHexadecimalAddress(inprefix, inP2PKH, inP2SH, alphabet32, alphabet58, input)
    //makeCode()
}
//document.getElementById('binaryaddress').oninput = function() {}
