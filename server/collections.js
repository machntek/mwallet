Meteor.publish("wallets", function () {
  return Wallets.find({});
});

Meteor.publish("mywallet", function (_id) {
  return Wallets.find({_id:this._id});
});

Meteor.publish("price", function () {
  return Price.find({_id:'btc_bithumb'});
});