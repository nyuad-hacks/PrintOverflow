var http = require('http');
var url = require('url');
var fs = require('fs'); //file system
var events = require('events');
var eventEmitter = new events.EventEmitter();
var formidable = require('formidable'); //file uploads
var nodemailer = require('nodemailer'); //send emails
var express = require('express');
var mysql = require('mysql');
var schedule = require('node-schedule');

var sendEmail = require('./sendmailmodule.js');
var sendEmailwithTemp = require('./sendmailwithtemp.js');
var sqlcon = require('./createMysql.js');

var users=[];

function print() {

  users.forEach((v) => {
    console.log("vvvv",v);

    //send alert
    if (v.pages > 500) {
      console.log("over 500:",v);
      sendEmail(v);
    }

    //send monthly report
    var date = new Date(2019,10,23,11,57,0);
    schedule.scheduleJob(date, () => {
      sendEmailwithTemp('report',v);
    })
  })

}


////// CONNECT TO MYSQL //////

sqlcon.query("USE mydb", function (err, result) {
  if (err) throw err;
  console.log("sqlcon connected");
});

sqlcon.query("SELECT name,netid,pages FROM mytable", function (err, result, fields) {
    if (err) throw err;
    // console.log("all:", result);
    users = Object.values(JSON.parse(JSON.stringify(result)));
    console.log("users: ",users);
    // print();

    console.log(users[1]);
    sendEmailwithTemp('report',users[1]);

  });
