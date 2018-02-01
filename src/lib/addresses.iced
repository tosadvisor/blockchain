if !module.parent
  global.CONFIG = (require('dotenv').config({
    path: __dirname + '/../../config'
  })).parsed

_ = require('wegweg')({
  globals: on
})

elliptic = require 'elliptic'
curve = new elliptic.ec 'secp256k1'

hash = require './hash'

TEST_ADDRESSES = {
  "DAN": {
    "pub": "0427370d20225a64eb86a11e8b2fcbfaa3454d2644f9bc4e6f95b592dbee70deb58aca3227f5daa87033b87e274968bc027f4872e51c0c6d23ed7ad2a3d87d8761",
    "priv": "474b9101f2c61e9ad61051e269e832c4"
  },
  "BOB": {
    "pub": "04db04a686696bf7f84509759f1c20c9878950bfd6fea41d3f4becce346789e72c364676a69e4b5e0b0bbdef0f58451be8e9825ec6348617b8ac72482e184da883",
    "priv": "599c7289b866bab7c55b0f07d26d3866"
  },
  "JOHN": {
    "pub": "045989a7fde16b46d874f5fbcc2cb63114622cbfcc41878bdf877e99c90a3c4760ff42f5cef083f4d816d4093909c7544b5fffc7dffed0a6223c7106f61bece690",
    "priv": "7df5ca5e1bfb6cd39598ad157fa8d9da"
  },
  "LARRY": {
    "pub": "04f20d7b07c9cf44c48df0454e7666778a04f6fd58a3593acf9b2c1fc682c0cefbf716710c2ad3f585e7b26ae998d5677e5f73c81b67d1b5b675a9aa2d5602c7a2",
    "priv": "de82c4bce91b1f2aa1bdafaf586fc955"
  }
}

# export
module.exports = addresses = {
  TEST_ADDRESSES
}

addresses.sign = ((str,priv) ->
  key = curve.keyFromPrivate(priv,'hex')
  signature = @_to_hex_str(key.sign(str).toDER())
  return signature
)

addresses.verify = ((str,sig,pub) ->
  key = curve.keyFromPublic(pub,'hex')
  return key.verify(str,sig)
)

addresses.generate = ((priv_str=null) ->
  if !priv_str
    priv_str = @_random_str(32)

  key = curve.keyFromPrivate(priv_str,'hex')

  tmp = {
    pub: key.getPublic().encode('hex')
    priv: key.getPrivate().toString('hex')
  }

  return tmp
)

addresses.load_from_priv = (priv_str) -> @generate(priv_str)

addresses._to_hex_str = ((arr) ->
  return (_.map Array.from(arr), (byte) ->
    return ('0' + (byte & 0xFF).toString(16)).slice(-2)
  ).join('')
)

addresses._random_str = ((len=128) ->
  abc = "abcdefghijklmnopqrstuvwxyz"
  abc += abc.toUpperCase()

  chars = _.map [0..9], (x) -> x.toString()
  chars = chars.concat abc.split('')

  tmp = ''; while tmp.length isnt len
    tmp += _.first(_.shuffle(chars))

  return tmp
)

##
if !module.parent
  log /TEST/

  DAN = TEST_ADDRESSES.DAN
  BOB = TEST_ADDRESSES.BOB

  bulk = """
    Hello, this is a message that will be signed.
  """

  ###
  addr = addresses.generate()
  log /generated_addr/
  log addr
  ###

  signed = addresses.sign(bulk,DAN.priv)
  log /signed/, /DAN/
  log signed

  verified = addresses.verify(bulk,signed,DAN.pub)
  log /verified/, /DAN/, /should be true/
  log verified

  verified = addresses.verify(bulk,signed,BOB.pub)
  log /verified/, /BOB/, /should be false/
  log verified

  exit 0

