import React from 'react';
import Savebooking from './Savebooking';
import Providerlist from '../providerlist/Providerlist';
import Login from '../Login';
import { host, apihost, smsAPIKey, SMSmessage } from '../../config';
import {getSessionid} from '../../scripts/util';
var request = require('request');

var message = 'Booking done Sucessfully  '
var href = `http://${host}/`;
var message1 = 'Click here to login'
var status = true;
var email;
var phone;
var bookingid;
var providerlist;
var sessionid;
var bookingtype;
var needCatering;
var cateringProviderlist;

export default {

path: '/savebooking',

 async action({query}, {path}) {
    console.log("Query String - index.js - Savebooking: " + JSON.stringify(query));
    phone = query.mobile;
    email = query.email;
    bookingtype = query.bookingtype;
   // console.log("Bookingtype: "+bookingtype);
    console.log("Email: "+email);
    sessionid = query.sessionid;
    bookingid=query.bookingid;
    needCatering=query.catering;

    console.log("Sessionid - index.js - Savebooking "+sessionid);

    if ( sessionid === undefined || sessionid == '')
       {
         var sessionbody = await getSessionid();
         return <Login sessionid = {sessionbody}/>
       }        
      
       
    var body = await SavebookingData(query);
    /*console.log("Calling SendEmail");
    var mail = await sendEmail();
    console.log("Calling sendSMS");
    var sms = await sendSMS();
    console.log("Body: "+body);*/
    if (!status) {
      message = 'Unable to book the Event';
      href = `http://${host}/booking`;
      message1 = 'Click here to Register.';
      return <Savebooking message={message} redirectlink={href} message1={message1} sessionid = {sessionid} />;
    }
    else
    {
      providerlist = await getProviderData();
      if ( needCatering != undefined)
      {
      bookingtype = 'Catering';
      cateringProviderlist=await getProviderData();
      console.log("Catering Service Providers: "+cateringProviderlist)
      }
      console.log("Service Provider List: "+providerlist);
      return <Providerlist providerlist={providerlist} cateringProviderlist={cateringProviderlist} customeremail={email} sessionid = {sessionid} bookingid={bookingid} />
     // return <Savebooking message={message} redirectlink={href} message1={message1} />;
    }
   
  },

};

function SavebookingData(data) {

  console.log('calling API - SavebookingData method');
  var url = `http://${apihost}/newBooking`;
  console.log("URL: " + url);
  delete data.bookingtype;
return new Promise(function(resolve, reject) {
  request.post(url, { form: data }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('Inside SavebookingData Response from API (body)' + body);

      if (body == 'true')
        status = true;
        resolve(body);
        //sendSMS();
      //var result = await sendEmail();
    }
    if (error) {
      console.log("Error in storing customer data");
      status = false;
      return reject(error);
    }

  });
 
  console.log('returning');
   });
}

function sendSMS() {
  console.log('calling API - sendSMS method');
  
  var url = `http://${apihost}/sendSMS?authkey=`+ smsAPIKey+'&mobiles='+ phone +'&message='+SMSmessage+'&sender=DTSBMF&route=4&country=91';
  console.log("URL: " + url);
   return new Promise(function(resolve, reject) {
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('Inside sendSMS - Response from API (body)' + body);

   if (error) {
      console.log("Error in Sending SMS");
      status = false;
      return reject(error);
    }

  if (body == 'true')
        status = true;
        resolve(body)
    }
    
      });
   });
}


function sendEmail() {
  console.log('calling API - sendEmail');
  var url = `http://${apihost}/sendmail`;
  console.log("URL: " + url);

  var subject = "Your booking for the event in BMY";
  var message = "<b>Thank you for booking and service provider will get in touch shortly. </b> <br> <b> Your Booking id is <b> "+bookingid;
  var formdata = { 
  tomail: email, 
  subject: subject, 
  message: message
};
  
  //data = JSON.stringify('{\"tomail\": \"'+email+'\", \"subject\": '+subject+'\", \"message\": \" '+message+'\"}');
  console.log("Data: "+formdata);
  return new Promise(function(resolve, reject) {
  request.post(url, { form: formdata }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('Inside sendEmail - Response from API (body)' + body);

      if (body == 'true')
        resolve(body)
        status = true;
    }
    if (error) {
      console.log("Error in Sending Mail");
      status = false;
      return reject(error);
    }

  });
   });
}


function getProviderData() {
  var request = require('request');
  console.log("Booking Type: "+bookingtype);
  console.log('calling API');
  var url = `http://${apihost}/searchByType?servicetype=`+bookingtype;
  console.log("URL: " + url);
  return new Promise(function(resolve, reject) {
    request(url,  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('Inside getProviderData Response from API (body)' + body);
      //providerlist = body;
      //console.log("Providerlist: "+providerlist);
      resolve(body);    
    }

    else
    {
      return reject(body);
    }

  });
  });
}


/*function getSessionid() {
  var request = require('request');
  console.log('genSessionid - calling API');
  var url = `http://${apihost}/genSessionid`;
  console.log("getSeesionid - URL: " + url);
  
  return new Promise(function(resolve, reject) {
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('genSessionid - Response from API' + body);
      //sessionid = body;
      resolve(body);
    }
    else {
      
      console.log("genSessionid -API Server not running: "+error);
      return reject(error);
    }
    console.log("getSessionid - Returning from API call")
  });

 });
 
}*/