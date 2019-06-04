var Web3 = require("web3");
var axios = require("axios");
var sigUtil = require("eth-sig-util")
var ethUtil = require('ethereumjs-util')
var web3 = new Web3();

// create an random wallet account
const account = web3.eth.accounts.create('random seed here');
console.log("TCL: account", account.address)

const serverJWT = 'http://localhost:3000'
// sign payload 
const baseUrl = "http://localhost";

const serverURL = (endpoint) => {
    return serverJWT + "/" + endpoint
}
// endpoints
const SERVER = {
    SIGN_IN: serverURL('sign-in'),
    WHO: serverURL('who')
}
const privKey = Buffer.from(account.privateKey.slice(2), 'hex')
const msgParams = {
    data: ethUtil.bufferToHex(Buffer.from("Sign into " + baseUrl, 'utf8')),
}
const signedMessage = sigUtil.personalSign(privKey, msgParams)

// sending post 
axios.post(SERVER.SIGN_IN, {
        account: account.address.toLowerCase(),
        signed: signedMessage,
    })
    .then((response) => {
        console.log('\n Response: ', response.data);
        // Adds the token to the header
        axios.get(SERVER.WHO, {
            headers: {
                Authorization: "Bearer " + response.data.token
            }
        }).then(response => {
            console.log("\n who am i ????????????? ", response.data)
        }).catch(console.log);
    })
    .catch(console.log);
