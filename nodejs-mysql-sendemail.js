var http = require('http');
var url = require('url');
var fs = require('fs'); //file system
var events = require('events');
var eventEmitter = new events.EventEmitter();
var formidable = require('formidable'); //file uploads
var nodemailer = require('nodemailer'); //send emails
var express = require('express');
var mysql = require('mysql');

var testpages=[];
var testemails=[];

function sendemail(to,num) {

  console.log("to: ",to);
  console.log("num: ",num);

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'printoverflow@gmail.com',
      pass: 'xxxpasswordxxx'
    }
  });

  var content = "You have printed " + num + " pages.";

  var mailOptions = {
    from: 'printoverflow@gmail.com',
    to: to,
    subject: 'Sending Email using Node.js',
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
}

function print() {

  var emailadd = testemails.map(v => {
    return v.netid+"@nyu.edu";
  });

  var finalpages = testpages.map(v => {
    return v.pages;
  })

  emailadd.forEach((v,index) => {
    if (finalpages[index]>500)
      return sendemail(emailadd[index],finalpages[index]);
  });
}

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  con.query("CREATE DATABASE IF NOT EXISTS mydb", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });

  con.query("USE mydb", function (err, result) {
    if (err) throw err;
    console.log("Database mydb selected");
  });

  con.query("DROP TABLE mytable", function (err, result) {
    if (err) throw err;
    console.log("mytable dropped");
  });

  var sql = "CREATE TABLE IF NOT EXISTS mytable (id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(255), netid VARCHAR(10), pages INT)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });

  var sql = "INSERT IGNORE INTO mytable (name,netid,pages) VALUES ('Daniel', 'hsj276','307'),('Yeojin','yj1254','503'),('Zayd','ds994','242')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("record inserted");
  });

  // con.query("UPDATE mytable SET netid='hsj276' WHERE name='Daniel'");
  // con.query("UPDATE mytable SET netid='yj1254' WHERE name='Yeojin'");
  // con.query("UPDATE mytable SET netid='ds994' WHERE name='Zayd'");

  con.query("SELECT pages FROM mytable", function (err, result, fields) {
    if (err) throw err;
    testpages = Object.values(JSON.parse(JSON.stringify(result)));
  });

  con.query("SELECT netid FROM mytable", function (err, result, fields) {
    if (err) throw err;
    testemails = Object.values(JSON.parse(JSON.stringify(result)));
    console.log(result);
    print();
  });
});
