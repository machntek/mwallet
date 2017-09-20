import {
  Meteor
} from 'meteor/meteor';
import {
  Mongo
} from 'meteor/mongo';
import {
  HTTP
} from 'meteor/http'
var CryptoJS = require("crypto-js");

var client = new CoinStack('c7dbfacbdf1510889b38c01b8440b1', '10e88e9904f29c98356fd2d12b26de');
client.endpoint = "testchain.blocko.io";
client.protocol = "http://";

var myAddress = "17iZeCxT5tdL6ZNLirGVfNspgXiSN8yKo6";
var privateKey = "KzNe5FueW7abygTdDDyfizKPmCe36ebgGmixpZXaHST7i3Sxa6Aq";
Wallets = new Mongo.Collection('wallets');
Price = new Mongo.Collection('price');

Meteor.startup(() => {
  //console.log(ciphertext);

  var walletsCnt = Wallets.find().count();

  var privateKey = CoinStack.ECKey.createKey();
  var address = CoinStack.ECKey.deriveAddress(privateKey);

  if (walletsCnt == 0) {
    var documnet = {
      _id: address,
      privateKey: privateKey,
      createAt: new Date()
    };
    Wallets.insert(documnet);
    console.log('insert wallet');
  } else {
    console.log('ended');
  }

  Meteor.setInterval(function () {
    console.log('timer');
    HTTP.get('https://api.bithumb.com/public/ticker', {}, function (err, data) {
      if (err) {
        console.log('으악 에러남');
        return false;
      }

      var btc_price = data.data.data.closing_price;
      console.log(btc_price);
      Price.upsert({
        _id: 'btc_bithumb'
      }, {
          price: btc_price
        });
    });
  }, 100000);
});

Meteor.methods({
  getBalance: function(f_ddress) {
    console.log('check balance: ' + f_ddress);
    var balance = CoinStack.Math.toBitcoin(client.getBalanceSync(f_ddress));
    console.log('check balance: ' + balance);
    return balance;
  },
  getTxHistory: function(f_address) {
    console.log('check balance: ' + f_address);
    client.getTransactionsSync(f_address);
    //console.log('check balance: ' + balance);
    return balance;
  },
  transactionBitcoin: function(bitcoin, f_address) {
    console.log('check address: ' + f_address);
    // client.getTransactionsSync(address);
    console.log('check balance: ' + bitcoin);

    var txBuilder = client.createTransactionBuilder();
    txBuilder.addOutput(f_address, CoinStack.Math.toSatoshi(bitcoin));
    txBuilder.setInput(myAddress);
    txBuilder.setFee(CoinStack.Math.toSatoshi("0.0001"));

    var tx = client.buildTransactionSync(txBuilder);
    tx.sign(privateKey);
    var rawSignedTx = tx.serialize();
    console.log(rawSignedTx);

    try {

        // send tx
        client.sendTransactionSync(rawSignedTx);
    } catch (e) {
        console.log("failed to send tx");
    }
    var balance = CoinStack.Math.toBitcoin(client.getBalanceSync(myAddress));
    console.log('my Wallet: ' + balance);
  }
});
