const sdk = require('stellar-sdk')
const request = require('request');

function create(pubkey){
    request.get({
        url: 'https://horizon-testnet.stellar.org/friendbot',
        qs: { addr: pubkey },
        json: true
    });
}

const a_keys = sdk.Keypair.random()
const b_keys = sdk.Keypair.random()
const d_keys = sdk.Keypair.random()
const keys = {
    A: {public: a_keys.publicKey(), secret: a_keys.secret()},
    B: {public: b_keys.publicKey(), secret: b_keys.secret()},
    D: {public: d_keys.publicKey(), secret: d_keys.secret()}
}
create(keys.A.public)
create(keys.B.public)
create(keys.D.public)

console.log(JSON.stringify(keys))
