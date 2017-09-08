import {
  Template
} from 'meteor/templating';
import {
  ReactiveVar
} from 'meteor/reactive-var';

import './main.html';

Wallets = new Mongo.Collection('wallets');
Price = new Mongo.Collection('price');
client = new CoinStack('c7dbfacbdf1510889b38c01b8440b1', '10e88e9904f29c98356fd2d12b26de');

Template.home.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);

  Meteor.subscribe('wallets');
});

Template.home.onCreated(function homeOnCreated() {
  Meteor.subscribe('wallets');
});

Template.walletlist.helpers({
  myWalletlist() {
    return Wallets.find();
  }
});

Template.walletlist.events({
  'click [name="wallet"]' (event, instance) {
    FlowRouter.go('/wallet/' + $(event.currentTarget).attr('data-address'));
  },
});

Template.walletdetail.onCreated(function walletdetailOnCreated() {
  var address = FlowRouter.getParam('walletAdderss');
  Meteor.subscribe('mywallet', address);
  Meteor.subscribe('price');
});

Template.walletdetail.rendered = function () {
  if (!this.qrloaded) {
    this.qrloaded = true;

    var address = FlowRouter.getParam('walletAdderss');

    var param = {
      address: address
    };

    Meteor.call('getBalance', param, function (err, res) {
      if (!err) {
        Session.set(address + 'balance', res);
      }
    });

    qrContents = "bitcoin:" + address;
    var qrcodesvg = new Qrcodesvg(qrContents, "qrcode", 250, {
      "ecclevel": 1
    });
    qrcodesvg.draw({
      "method": "classic",
      "fill-colors": ["#003658", "#0085CB", "#0085CB"]
    }, {
      "stroke-width": 1
    });
  }
}

Template.walletdetail.helpers({
  walletaddress() {
    return FlowRouter.getParam('walletAdderss');
  },
  mywallet() {
    return Wallets.findOne();
  },
  mywalletbalance() {
    var address = FlowRouter.getParam('walletAdderss');
    return Session.get(address + 'balance');
  },
  price() {
    return Price.findOne({_id:'btc_bithumb'}).price;
  }
});
/*
Template.walletdetail.events({
  'click [name="wallet"]' (event, instance) {

  },
});
*/