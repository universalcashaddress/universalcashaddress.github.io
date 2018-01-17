# [universalcashaddress.github.io](https://universalcashaddress.github.io)
configurable base58 bech32 translator

built from: 
- https://github.com/cashaddress/cashaddress.github.io
- https://github.com/davidshimjs/qrcodejs

relevant links are at the top
configuration dropdown on the left(preset for bitcoincash)

scroll down to find quick tests / suggestions
or try an address from an explorer:
- https://blockdozer.com/insight/
- https://blockchain.info
- https://live.blockcypher.com/ltc/
- https://xrpcharts.ripple.com/#/graph/

remember to set the correct P2PKH & P2SH prefix for a given coin, also not all coins use the same base58 alphabet. It also might be interesting to experiment with different base32 alphabets, to differentiate even more between different coins.
```
prefix: bitcoincash:
17VZNX1SN5NtKa8UQFxwQbFeFc3iqRYhem
3EktnHQD7RiAE6uzMj2ZifT9YgRrkSgzQX
P2PKH: 0
P2SH: 5
base32 = "qpzry9x8gf2tvdw0s3jn54khce6mua7l"
base58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

prefix: bitcoin:
1AJQ3jXhUF8WiisEcuVd8Xmfq4QJ7n1SdL
39KY4MiGabfDQSv3L7yA2RhoLUAgaFuvHu
P2PKH: 0
P2SH: 5
base32 = "bczry9x8gf2tvdw0s3jn54khpeqmua7l"
base58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

prefix: litecoin:
LcadVDrgopumZif7FLV52oDEirEExiJYFZ
32fQdTdkL5ZjxfyM6ewosgDKHVgaJXyLLq
P2PKH: 48
P2SH: 5
base32 = "lszry9x8gf2tvdw0p3jn54khce6mua7q"
base58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

prefix: ripple:
r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV
P2PKH: 0
P2SH: 255
base32 = "rpzqy9x8gf2tvdw0s3jn54khce6mua7l"
base58 = "rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz"

prefix: bchtest:
mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn
n1NEaQqQBJt9zy44PKm73UvuXqqFgWEZ17
2MzQwSSnBHWHqSAqtTVQ6v47XtaisrJa1Vc
P2PKH: 111
P2SH: 196
base32 = "qpzry9x8gf2tvdw0s3jn54khce6mua7l"
base58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

prefix: bitpaybch:
CNxSwZMWF8MRDi2u61Hrz6sfsjG8kqk5Lc
HKb1F5qHxjvprGo2DQgih3ygaLSsfAmcrt
P2PKH: 28
P2SH: 40
base32 = "qpzry9x8gf2tvdw0s3jn54khce6mua7l"
base58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

Also:
base32extendedhex:  "0123456789abcdefghijklmnopqrstuv"
base58Flickr = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
```