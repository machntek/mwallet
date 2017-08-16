FlowRouter.route('/', {
    action: function () {
        BlazeLayout.render('home', {content:'walletlist'});
    }
});
/*
FlowRouter.route('/wallet/:walletAdderss', {
    action: function (params, queryParams) {
        console.log("Yeah! We are on the post:", params.walletAdderss);
        BlazeLayout.render('home', {content:'walletdetail'});
    }
});
*/
FlowRouter.route('/test', {
    action: function () {
        BlazeLayout.render('index');
    }
});
FlowRouter.route('/login', {
    action: function () {
        BlazeLayout.render('login');
    }
});
FlowRouter.route('/wallets', {
    action: function () {
        BlazeLayout.render('wallets');
    }
});
FlowRouter.route('/wallet/:walletAdderss', {
    action: function (params, queryParams) {
        BlazeLayout.render('wallet');
    }
});