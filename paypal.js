var express = require('express');
var router = express.Router();

var paypal = require('paypal-rest-sdk');
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'gjghjghj',
  'client_secret': 'hgjhgjghj'
});

router.get('/paynoww', function(req, res) {
	var payReq = JSON.stringify({
	  intent:'sale',
	  payer:{
	    payment_method:'paypal'
	  },
	  redirect_urls:{
	    return_url:'http://------:3020/success',
	    cancel_url:'http://----------:3020/cancel'
	  },
	  transactions:[{
	    amount:{
	      total:'1',
	      currency:'USD'
	    },
	    description:'This is the payment transaction description.'
	  }]
	});

	paypal.payment.create(payReq, function(error, payment){
	  var links = {};

	  if(error){
	    console.error(JSON.stringify(error));
	  } else {
	    // Capture HATEOAS links
	    payment.links.forEach(function(linkObj){
	      links[linkObj.rel] = {
	        href: linkObj.href,
	        method: linkObj.method
	      };
	    })

	    // If redirect url present, redirect user
	    if (links.hasOwnProperty('approval_url')){
	      //REDIRECT USER TO links['approval_url'].href
	      console.log(payment.links[1].href);
	      // console.log(payment.links['approval_url'].href);
	      // console.log(payment.links[0].rel === 'approval_url');
	    } else {
	      console.error('no redirect URI present');
	    }
	  }
	});
});

router.get('/success', function(req, res) {
  // res.send("Payment transfered successfully.");
  	var paymentId = req.query.paymentId;
	var payerId = { payer_id: req.query.PayerID };
	console.log(paymentId)
	console.log(payerId)

	paypal.payment.execute(paymentId, payerId, function(error, payment){
	  if(error){
	    console.error(JSON.stringify(error));
	  } else {
	  	console.log(payment)
	    if (payment.state == 'approved'){
	      res.send("payment completed successfully")
	    } else {
	    	res.send("payment not successful")
	      console.log('payment not successful');
	    }
	  }
	});
});
 
router.get('/cancel', function(req, res) {
  res.send("Payment canceled successfully.");
});

module.exports = router;