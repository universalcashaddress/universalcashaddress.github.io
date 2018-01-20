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
/*
 MIT/X11 License
 Copyright (c) 2013 Artem S Vybornov
 Copyright base-x contributors (c) 2016

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
/*
 ISC License
 Copyright (c) 2013-2016 The btcsuite developers

 Permission to use, copy, modify, and/or distribute this software for any
 purpose with or without fee is hereby granted, provided that the above
 copyright notice and this permission notice appear in all copies.

 THE SOFTWARE IS PROVIDED "AS IS" AND ISC DISCLAIMS ALL WARRANTIES WITH REGARD
 TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
 FITNESS. IN NO EVENT SHALL ISC BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR
 CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE,
 DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS
 ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS
 SOFTWARE.
*/
/*
 https://github.com/cryptocoinjs/base-x/blob/master/index.js
 base-x encoding
 Forked from https://github.com/cryptocoinjs/bs58
 Originally written by Mike Hearn for BitcoinJ
 Copyright (c) 2011 Google Inc
 Ported to JavaScript by Stefan Thomas
 Merged Buffer refactorings from base58-native by Stephen Pair
 Copyright (c) 2013 BitPay Inc
 Copyright (c) 2017 Pieter Wuille
 Copyright (c) 2018 feet-wet
 all under Unlicense/MIT/X11/ISC License
*/
var PREFIX_ALPHABET = ":abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
                    //000000000011111111112222222
                    //012345678901234567890123456
var asciiprintables = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~" // 32-126
var correctedAddress = ""
/*
var base32bitcoincash = "qpzry9x8gf2tvdw0s3jn54khce6mua7l"
var base58bitcoincash = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
var base32ripple = "rpzqy9x8gf2tvdw0s3jn54khce6mua7l"
var base58ripple = "rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz"
var base32bitcoin = "bczry9x8gf2tvdw0s3jn54khpeqmua7l"
var base58bitcoin = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
var base32litecoin = "qszry9x8gf2tvdw0p3jn54khce6mua7l"
var base58litecoin = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
 */

function parseBase58Address(prefix, P2PKH, P2SH, alphabet32, alphabet58, payloadString) {
    //var ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
    //var ALPHABET_MAP = {86: 28, 100: 36, 118: 53, 50: 1, 54: 5, 57: 8, 71: 15, 74: 17, 66: 10, 77: 20, 99: 35, 75: 18, 111: 46, 112: 47, 117: 52, 52: 3, 83: 25, 113: 48, 67: 11, 68: 12, 98: 34, 104: 40, 121: 56, 85: 27, 122: 57, 109: 44, 115: 50, 56: 7, 72: 16, 90: 32, 97: 33, 102: 38, 76: 19, 84: 26, 107: 43, 78: 21, 81: 23, 88: 30, 101: 37, 65: 9, 51: 2, 103: 39, 106: 42, 116: 51, 49: 0, 53: 4, 82: 24, 105: 41, 114: 49, 70: 14, 55: 6, 69: 13, 87: 29, 89: 31, 120: 55, 80: 22, 110: 45, 119: 54}
    var ALPHABET_MAP = {}
    for (i=0;i<58;i++){
        ALPHABET_MAP[alphabet58.charCodeAt(i)] = i
        //ALPHABET_MAP[ALPHABET.charCodeAt(i)] = i
    }
    var bytes = [0]
    for (var i = 0; i < payloadString.length; i++) {
        var value = ALPHABET_MAP[payloadString.charCodeAt(i)]
        var carry = value
        for (var j = 0; j < bytes.length; j++) {
            carry += bytes[j] * 58
            bytes[j] = carry & 0xff
            carry = carry >> 8
        }
        while (carry > 0) {
            bytes.push(carry&0xff)
            carry = carry >> 8
        }
    }
    for (var numZeros = 0; numZeros < payloadString.length && ALPHABET_MAP[payloadString.charCodeAt(numZeros)] === 0; numZeros++) {
        //if (payloadString[numZeros] != '1') {
        //console.log("payloadString[numZeros] = " + payloadString[numZeros])
        //console.log("ALPHABET_MAP[payloadString[numZeros]] = " + ALPHABET_MAP[payloadString[numZeros]])
        //console.log("ALPHABET_MAP[payloadString.charCodeAt(numZeros)] = " + ALPHABET_MAP[payloadString.charCodeAt(numZeros)])
    }
    for (var i = 0; i < numZeros; i++) {
        bytes.push(0)
    }
    if (bytes.length < 5) {
        cleanBase32Address();cleanHexAddress();cleanBinaryAddress()
        return
    }
    var answer = bytes.reverse()
    var version = answer[0]
    //console.log("version = " + version)
    var h = sha256(Uint8Array.from(answer.slice(0,-4)))
    var h2 = sha256(h)
    if (h2[0] != answer[answer.length-4] || h2[1] != answer[answer.length-3] || h2[2] != answer[answer.length-2] || h2[3] != answer[answer.length-1]) {
        //    console.log("checksum doesn't match!")
        cleanBase32Address();cleanHexAddress();cleanBinaryAddress()
        return
    }
    var payload = answer.slice(1, answer.length-4)
    if (version == parseInt(P2PKH)) {
        craftBechThirtyTwoAddress(0, payload, prefix, alphabet32)
    } else if (version == parseInt(P2SH)) {
        craftBechThirtyTwoAddress(1, payload, prefix, alphabet32)
    } else {
        cleanBase32Address();cleanHexAddress();cleanBinaryAddress()
    }
    document.getElementById('binaryaddress').value = displayBinary(answer)
    document.getElementById('hexadecimaladdress').value = displayHexadecimal(answer)
}

function parseBase32Address(prefix, P2PKH, P2SH, alphabet32, alphabet58, payloadString) {
    //PolyMod(append(ExpandPrefix("bitcoincash"), payload...)) != 0
    //payload := []byte(payloadString)
    //console.log("parseBase32Address() called")//debug
    var payloadUnparsed = []
    //var CHARSET_MAP = {"q": 0, "p": 1, "z": 2, "r": 3, "y": 4, "9": 5, "x": 6, "8": 7, "g": 8, "f": 9, "2": 10, "t": 11, "v": 12, "d": 13, "w": 14, "0": 15, "s": 16, "3": 17, "j": 18, "n": 19, "5": 20, "4": 21, "k": 22, "h": 23, "c": 24, "e": 25, "6": 26, "m": 27, "u": 28, "a": 29, "7": 30, "l": 31}
    CHARSET_MAP = {}
    for (i=0;i<32;i++){
        CHARSET_MAP[alphabet32[i]] = i
    }
    //console.log(CHARSET_MAP)
    for (var i = 0; i < payloadString.length; i++) {
        payloadUnparsed.push(CHARSET_MAP[payloadString[i]])
    }
    var expandPrefix = []
    for (var i=0; i<prefix.length; i++) {
        expandPrefix.push(PREFIX_ALPHABET.indexOf(prefix[i]))
    }
    var polymodInput = expandPrefix.concat(payloadUnparsed)
    var polymodResult = polyMod(polymodInput)
    for (var i = 0; i < polymodResult.length; i++) {
        if (polymodResult[i] != 0) {
            // alert("checksum doesn't match")
            var syndromes = {}
            var c = []
            var t = 0
            for (var p = 0; p < polymodInput.length; p ++) {
                for (var e = 1; e < 32; e++) {
                    polymodInput[p] ^= e
                    c = polyMod(polymodInput)
                    t = 0
                    for (var k = 0; k < c.length; k++) {
                        t += c[k]
                    }
                    if (t == 0) {
                        correctedAddress = rebuildAddress(polymodInput, alphabet32)
                        //console.log("correctedaddress = " + rebuildAddress(polymodInput))
                        //console.log("correctedaddress = " + correctedAddress)
                        document.getElementById('b32correctionrow').innerHTML = "autocorrect: " + correctedAddress
                        document.getElementById('b32correctionrow').style = "display: inline-block;" //"display: block;"
                        return
                    }
                    polymodInput[p] ^= e
                }
            }
            cleanBase58Address();cleanHexAddress();cleanBinaryAddress()
            return
        }
    }
    // Also drop the checsum
    var payload = convertBits(payloadUnparsed.slice(0,-8), 5, 8, false)
    if (payload.length == 0) {
        cleanBase58Address();cleanHexAddress();cleanBinaryAddress()
        return
    }
    var addressType = payload[0] >> 3 // 0 or 1
    craftBaseFiftyEightAddress(addressType, payload.slice(1,21), P2PKH, P2SH, alphabet58)
}

function craftBaseFiftyEightAddress(kind, addressHash, P2PKH, P2SH, alphabet58) {
    if (kind == 0) {
        //console.log("CheckEncodeBase58 P2PKH")
        //CheckEncodeBase58(addressHash, 0x00)//Pubkey hash (P2PKH address)
        CheckEncodeBase58(addressHash, parseInt(P2PKH), alphabet58)//Pubkey hash (P2PKH address)
    } else {
        //console.log("CheckEncodeBase58 P2SH")
        //CheckEncodeBase58(addressHash, 0x05)//Script hash (P2SH address)
        CheckEncodeBase58(addressHash, parseInt(P2SH), alphabet58)//Script hash (P2SH address)
    }
}

function CheckEncodeBase58(input, version, alphabet58) {
    var b = []
    // b := make([]byte, 0, 1+len(input)+4)
    b.push(version)
    b = b.concat(input)
    var h = sha256(Uint8Array.from(b))
    var h2 = sha256(h)
    //	fmt.Println("%x %x %v", checksum, []byte(h2[:4]), len(checksum))
    b = b.concat(Array.from(h2).slice(0,4))
    //fmt.Println("%x", b[len(b)-4:])
    //println(js.Global.Get("bs58").Call("encode", b).String())
    document.getElementById('base58address').value = EncodeBase58Simplified(b, alphabet58)
    document.getElementById('binaryaddress').value = displayBinary(b)
    document.getElementById('hexadecimaladdress').value = displayHexadecimal(b)
    //println(EncodeBase58(b))
}

function EncodeBase58Simplified(b, alphabet58) {
    // var bigRadix = big.NewInt(58)
    // var bigZero = big.NewInt(0)
    //var alphabetIdx0 = 0
    //var alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
    //var alphabet = "rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz"
    var digits = [0]
    for (var i = 0; i < b.length; i++) {
        for (var j = 0, carry = b[i]; j < digits.length; j++) {
            carry += digits[j] << 8
            digits[j] = carry % 58
            carry = (carry / 58) | 0
        }
        while (carry > 0) {
            digits.push(carry%58)
            carry = (carry / 58) | 0
        }
    }
    var answer = ""
    // leading zero bytes
    for (var i = 0; i < b.length && b[i] === 0; i++) {
        //digits.push(alphabetIdx0)
        //answer = answer.concat("1")
        answer = answer.concat(alphabet58[0])
    }
    // reverse
    for (var t = digits.length - 1; t >= 0; t--) {
        //console.log(alphabet[digits[t]])
        //console.log(alphabet[digits[t]])
        //answer = answer.concat(alphabet[digits[t]])
        answer = answer.concat(alphabet58[digits[t]])
        //alert(alphabet[digits[t]])
        //alert(digits[t])
    }
    return answer
}

function displayBinary(b) {
    var alphabet = "01"
    var answer = ""
    var digits = [] // empty
    for (var i = 0; i < b.length; i++) { //0 - 24
        //console.log(i) //0 - 24 -> 200 bits (8 version + 160 payload + 32 checksum)
        var num256 = b[i]
        //for (var j = 0, carry = b[i]; j < digits.length; j++) {
        for (var j = 0; j < 8; j++) {
            //console.log(num256)
            digits.push(num256 % 2)
            num256 = (num256 / 2) | 0
        }
    }
    // little-to-big endian
    for (var i=0; i<digits.length/8; i++) {
        //reverse bits
        for (var t=7; t>=0; t--) {
            //console.log(alphabet[digits[t]])
            answer = answer.concat(alphabet[digits[8*i + t]])
            //alert(alphabet[digits[t]])
            //alert(digits[t])
        }
    }
    return answer
}

function displayHexadecimal(b) {
    var alphabet = "0123456789ABCDEF"
    var answer = "0x"
    var digits = [] // empty
    for (var i = 0; i < b.length; i++) { //0 - 24
        //console.log(i) //0 - 24 -> 200 bits (8 version + 160 payload + 32 checksum)
        var num256 = b[i]
        //for (var j = 0, carry = b[i]; j < digits.length; j++) {
        for (var j = 0; j < 2; j++) {
            //console.log(num256)
            digits.push(num256 % 16)
            num256 = (num256 / 16) | 0
        }
    }
    // little-to-big endian
    for (var i=0; i<digits.length/2; i++) {
        //reverse bits
        for (var t=1; t>=0; t--) {
            //console.log(alphabet[digits[t]])
            answer = answer.concat(alphabet[digits[2*i + t]])
            //alert(alphabet[digits[t]])
            //alert(digits[t])
        }
    }
    return answer
}


function packBechThirtyTwoAddressData(addressType, addressHash) {
    // Pack addr data with version byte.
    var versionByte = addressType << 3// 0 or 1 -> 0(0000) or 8(1000)
    //console.log("addressType: " + addressType)// debug
    //console.log("versionByte: " + versionByte)// debug// debug
    var encodedSize = (addressHash.length - 20) / 4
    //console.log("encodedSize: " + encodedSize)// debug// debug
    if ((addressHash.length-20)%4 != 0) {
        return []
    }
    if (encodedSize < 0 || encodedSize > 8) {
        return []
    }
    versionByte |= encodedSize
    //console.log("versionByte |= encodedSize: " + versionByte)// debug// debug
    var data = [versionByte].concat(addressHash)// prepend: 0 p2pkh or 8 p2sh
    //console.log(data)// debug// debug
    return convertBits(data, 8, 5, true)
}

function convertBits(data, fromBits, tobits, pad) {
    // General power-of-2 base conversion.
    var acc = 0
    var bits = 0
    var ret = []
    var maxv = (1 << tobits) - 1
    var maxAcc = (1 << (fromBits + tobits - 1)) - 1
    for (var i = 0; i < data.length; i++) {
        var value = data[i]
        if (value < 0 || (value >> fromBits) !== 0) {
            return null;
        }
        acc = ((acc << fromBits) | value) & maxAcc
        bits += fromBits
        while (bits >= tobits) {
            bits -= tobits
            ret.push((acc>>bits)&maxv)
        }
    }
    if (pad) {
        if (bits > 0) {
            ret.push((acc<<(tobits-bits))&maxv)
        }
    } else if (bits >= fromBits || ((acc<<(tobits-bits))&maxv) != 0) {
        return []
    }
    //console.log(ret)// debug// debug
    return ret
}

function craftBechThirtyTwoAddress(kind, addressHash, prefix, alphabet32) {
    var payload = packBechThirtyTwoAddressData(kind, addressHash)
    //checksum := CreateChecksum(prefix, payload)
    if (payload.length == 0) {
        cleanBase32Address();cleanHexAddress();cleanBinaryAddress()
        return
    }
    var expandPrefix = []
    for (var i=0; i<prefix.length; i++) {
        expandPrefix.push(PREFIX_ALPHABET.indexOf(prefix[i]))
    }
    //console.log(expandPrefix)// debug // debug
    var enc = expandPrefix.concat(payload)
    //console.log(enc)// debug // debug
    var mod = polyMod(enc.concat([0,0,0,0,0,0,0,0]))
    var retChecksum = []
    for (var i = 0; i < 8; i++) {
        // Convert the 5-bit groups in mod to checksum values.
        // retChecksum[i] = (mod >> uint(5*(7-i))) & 0x1f
        retChecksum[i] = simplify(and(rShift(mod, 5 * (7 - i)), [31]))[0];
    }
    //  console.log(mod/*.slice(-5)*/)
    var combined = payload.concat(retChecksum)
    //  console.log(polyMod(combined))
    //var ret = ""
    var ret = prefix

    for (var i = 0; i < combined.length; i++) {
        ret = ret.concat(alphabet32[combined[i]])
    }
    //console.log("prefix.length = " + prefix.length)
    //console.log("combined.length = " + combined.length)
    //console.log("ret.length = " + ret.length)
    //console.log("ret = " + ret)
    //if (ret.length == 54 || ret.length == 50) {
    if (combined.length == 42 || combined.length == 38) {
        document.getElementById('base32address').value = ret
    } else {
        cleanBase32Address();cleanHexAddress();cleanBinaryAddress()
    }
}


function cleanBase32Address() {
    document.getElementById('base32address').value = ""
}

function cleanBase58Address() {
    document.getElementById('base58address').value = ""
}

function cleanHexAddress() {
    document.getElementById('hexadecimaladdress').value = ""
}

function cleanBinaryAddress() {
    document.getElementById('binaryaddress').value = ""
}

/*function parseHexadecimalAddress(prefix, P2PKH, P2SH,     alphabet32, alphabet58, payloadString) {

 }*/

// SHA256
!function(t,e){var i={};!function(t){"use strict";function e(t,e,i,r,n){for(var h,f,a,o,u,d,p,c,b,g,l,y,v;n>=64;){for(h=e[0],f=e[1],a=e[2],o=e[3],u=e[4],d=e[5],p=e[6],c=e[7],g=0;g<16;g++)l=r+4*g,t[g]=(255&i[l])<<24|(255&i[l+1])<<16|(255&i[l+2])<<8|255&i[l+3];for(g=16;g<64;g++)b=t[g-2],y=(b>>>17|b<<15)^(b>>>19|b<<13)^b>>>10,b=t[g-15],v=(b>>>7|b<<25)^(b>>>18|b<<14)^b>>>3,t[g]=(y+t[g-7]|0)+(v+t[g-16]|0);for(g=0;g<64;g++)y=(((u>>>6|u<<26)^(u>>>11|u<<21)^(u>>>25|u<<7))+(u&d^~u&p)|0)+(c+(s[g]+t[g]|0)|0)|0,v=((h>>>2|h<<30)^(h>>>13|h<<19)^(h>>>22|h<<10))+(h&f^h&a^f&a)|0,c=p,p=d,d=u,u=o+y|0,o=a,a=f,f=h,h=y+v|0;e[0]+=h,e[1]+=f,e[2]+=a,e[3]+=o,e[4]+=u,e[5]+=d,e[6]+=p,e[7]+=c,r+=64,n-=64}return r}function i(t){var e=(new r).update(t),i=e.digest();return e.clean(),i}t.__esModule=!0,t.digestLength=32,t.blockSize=64;var s=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]);var r=function(){function i(){this.digestLength=t.digestLength,this.blockSize=t.blockSize,this.state=new Int32Array(8),this.temp=new Int32Array(64),this.buffer=new Uint8Array(128),this.bufferLength=0,this.bytesHashed=0,this.finished=!1,this.reset()}return i.prototype.reset=function(){return this.state[0]=1779033703,this.state[1]=3144134277,this.state[2]=1013904242,this.state[3]=2773480762,this.state[4]=1359893119,this.state[5]=2600822924,this.state[6]=528734635,this.state[7]=1541459225,this.bufferLength=0,this.bytesHashed=0,this.finished=!1,this},i.prototype.clean=function(){for(t=0;t<this.buffer.length;t++)this.buffer[t]=0;for(var t=0;t<this.temp.length;t++)this.temp[t]=0;this.reset()},i.prototype.update=function(t,i){if(void 0===i&&(i=t.length),this.finished)throw new Error("SHA256: can't update because hash was finished.");var s=0;if(this.bytesHashed+=i,this.bufferLength>0){for(;this.bufferLength<64&&i>0;)this.buffer[this.bufferLength++]=t[s++],i--;64===this.bufferLength&&(e(this.temp,this.state,this.buffer,0,64),this.bufferLength=0)}for(i>=64&&(s=e(this.temp,this.state,t,s,i),i%=64);i>0;)this.buffer[this.bufferLength++]=t[s++],i--;return this},i.prototype.finish=function(t){if(!this.finished){var i=this.bytesHashed,s=this.bufferLength,r=i/536870912|0,n=i<<3,h=i%64<56?64:128;this.buffer[s]=128;for(f=s+1;f<h-8;f++)this.buffer[f]=0;this.buffer[h-8]=r>>>24&255,this.buffer[h-7]=r>>>16&255,this.buffer[h-6]=r>>>8&255,this.buffer[h-5]=r>>>0&255,this.buffer[h-4]=n>>>24&255,this.buffer[h-3]=n>>>16&255,this.buffer[h-2]=n>>>8&255,this.buffer[h-1]=n>>>0&255,e(this.temp,this.state,this.buffer,0,h),this.finished=!0}for(var f=0;f<8;f++)t[4*f+0]=this.state[f]>>>24&255,t[4*f+1]=this.state[f]>>>16&255,t[4*f+2]=this.state[f]>>>8&255,t[4*f+3]=this.state[f]>>>0&255;return this},i.prototype.digest=function(){var t=new Uint8Array(this.digestLength);return this.finish(t),t},i.prototype._saveState=function(t){for(var e=0;e<this.state.length;e++)t[e]=this.state[e]},i.prototype._restoreState=function(t,e){for(var i=0;i<this.state.length;i++)this.state[i]=t[i];this.bytesHashed=e,this.finished=!1,this.bufferLength=0},i}();t.Hash=r;var n=function(){function t(t){this.inner=new r,this.outer=new r,this.blockSize=this.inner.blockSize,this.digestLength=this.inner.digestLength;var e=new Uint8Array(this.blockSize);if(t.length>this.blockSize)(new r).update(t).finish(e).clean();else for(i=0;i<t.length;i++)e[i]=t[i];for(i=0;i<e.length;i++)e[i]^=54;this.inner.update(e);for(i=0;i<e.length;i++)e[i]^=106;this.outer.update(e),this.istate=new Uint32Array(8),this.ostate=new Uint32Array(8),this.inner._saveState(this.istate),this.outer._saveState(this.ostate);for(var i=0;i<e.length;i++)e[i]=0}return t.prototype.reset=function(){return this.inner._restoreState(this.istate,this.inner.blockSize),this.outer._restoreState(this.ostate,this.outer.blockSize),this},t.prototype.clean=function(){for(var t=0;t<this.istate.length;t++)this.ostate[t]=this.istate[t]=0;this.inner.clean(),this.outer.clean()},t.prototype.update=function(t){return this.inner.update(t),this},t.prototype.finish=function(t){return this.outer.finished?this.outer.finish(t):(this.inner.finish(t),this.outer.update(t,this.digestLength).finish(t)),this},t.prototype.digest=function(){var t=new Uint8Array(this.digestLength);return this.finish(t),t},t}();t.HMAC=n;t.hash=i,t.default=i;t.hmac=function(t,e){var i=new n(t).update(e),s=i.digest();return i.clean(),s};t.pbkdf2=function(t,e,i,s){for(var r=new n(t),h=r.digestLength,f=new Uint8Array(4),a=new Uint8Array(h),o=new Uint8Array(h),u=new Uint8Array(s),d=0;d*h<s;d++){var p=d+1;f[0]=p>>>24&255,f[1]=p>>>16&255,f[2]=p>>>8&255,f[3]=p>>>0&255,r.reset(),r.update(e),r.update(f),r.finish(o);for(b=0;b<h;b++)a[b]=o[b];for(b=2;b<=i;b++){r.reset(),r.update(o).finish(o);for(var c=0;c<h;c++)a[c]^=o[c]}for(var b=0;b<h&&d*h+b<s;b++)u[d*h+b]=a[b]}for(d=0;d<h;d++)a[d]=o[d]=0;for(d=0;d<4;d++)f[d]=0;return r.clean(),u}}(i);var s=i.default;for(var r in i)s[r]=i[r];"object"==typeof module&&"object"==typeof module.exports?module.exports=s:"function"==typeof define&&define.amd?define(function(){return s}):t.sha256=s}(this);

function xor(a, b) {
    var t = a.length - b.length;
    var c = [];
    if (t > 0) {
        b = Array(t)
        .fill(0)
        .concat(b);
    } else if (t < 0) {
        a = Array(-t)
        .fill(0)
        .concat(a);
    }
    for (var i = 0; i < a.length; i++) {
        c.push(a[i] ^ b[i]);
    }
    return c;
}

function rShift(a, b) {
    // 35 >= b >= 0
    var t = a.slice(0);
    if (t.length === 0) {
        return [0];
    }
    if (b > 31) {
        t = a.slice(0, -1);
        b -= 32;
    }
    if (b === 0) {
        return t;
    }
    for (var i = t.length - 1; i > 0; i--) {
        t[i] >>>= b;
        // alternative code:
        t[i] |= (t[i - 1] & ((2 << (b + 1)) - 1)) << (32 - b);
        // a[i] |= (a[i-1] << (32 - b)) >>> (32 - b)
    }
    t[0] >>>= b;
    if (t[0] === 0) {
        return t.slice(1);
    }
    return t;
}

function polyMod(v) {
    var c = [0, 1];
    var c0 = [0];
    var temp = [];
    for (var i = 0; i < v.length; i++) {
        c0 = rShift(c, 35);
        c = xor(addFiveZerosAtTheEnd(and(c, [7, -1])), [v[i]]);
        if (c0.length === 0) {
            c0 = [0];
        }
        if (c0[0] & 1) {
            c = xor(c, [0x98, 0xf2bc8e61]);
        }
        if (c0[0] & 2) {
            c = xor(c, [0x79, 0xb76d99e2]);
        }
        if (c0[0] & 4) {
            c = xor(c, [0xf3, 0x3e5fb3c4]);
        }
        if (c0[0] & 8) {
            c = xor(c, [0xae, 0x2eabe2a8]);
        }
        if (c0[0] & 16) {
            c = xor(c, [0x1e, 0x4f43e470]);
        }
    }
    return xor(c, [1]);
}

function rebuildAddress(bytes, alphabet32) {
    // console.log("called")
    var ret = ""
    var i = 0
    while (bytes[i] != 0) {
        // (ord('a') & 0xe0)
        ret = ret.concat(String.fromCharCode(96 + bytes[i]))
        i++
    }
    ret = ret.concat(":")
    for (i++; i < bytes.length; i++) {
        ret = ret.concat(alphabet32[bytes[i]])
    }
    return ret
}

function simplify(v) {
    var i = 0;
    while (v[i] == 0) {
        i++
    }
    return v.slice(i)
}

function addFiveZerosAtTheEnd(a) {
    a = [0].concat(a);
    for (var i = 1; i < a.length; i++) {
        a[i - 1] |= a[i] >>> 27;
        a[i] <<= 5;
    }
    return a;
}

function and(a, b) {
    var t = a.length - b.length;
    c = [];
    if (t >= 0) {
        for (var i = 0; i < b.length; i++) {
            c.push(a[i + t] & b[i]);
        }
    } else {
        for (var i = 0; i < a.length; i++) {
            c.push(a[i] & b[i - t]);
        }
    }
    return c;
}
