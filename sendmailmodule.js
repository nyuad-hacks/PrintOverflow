var http = require('http');
var url = require('url');
var fs = require('fs'); //file system
var events = require('events');
var eventEmitter = new events.EventEmitter();
var formidable = require('formidable'); //file uploads
var nodemailer = require('nodemailer'); //send emails
var express = require('express');
var mysql = require('mysql');


  // console.log("to: ",to);
  // console.log("num: ",num);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'printoverflow@gmail.com',
      pass: 'xxxpasswordxxx'
    }
  });

  module.exports = function sendEmail(context) {

    var content = "You have printed " + context.pages + " pages.";

    const mailOptions = {
      from: 'printoverflow@gmail.com',
      to: context.netid,
      subject: 'PRINT OVERFLOW!',
      text: content,
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log(info);
        console.log('Email sent: ' + info.response);
      }
    });

  };
