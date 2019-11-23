var http = require('http');
var url = require('url');
var fs = require('fs'); //file system
var events = require('events');
var eventEmitter = new events.EventEmitter();
var formidable = require('formidable'); //file uploads
var nodemailer = require('nodemailer'); //send emails
var express = require('express');
var mysql = require('mysql');
var app=express();
app.set('views', './views');
app.set('view engine', 'pug');
port=8080;

var testpages=[];
var testemails=[];



app.get('/', function (req, res) {
  res.render('index', { pages: 'Hey', water: 'billion liters' })
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

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

  var content = "";
  
  
  var mailOptions = { 
    from: 'printoverflow@gmail.com',
    to: to,
    subject: 'Sending Email using Node.js',
    
    html:'<script>    data=[20000,14000,12000,15000,18000,19000,22000];labels=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];varctx=document.getElementById("myChart").getContext(\'2d\');varmyChart=newChart(ctx,{type:\'line\',data:{labels:labels,datasets:[{label:\'Thisweek\',data:data,}]},});</script>'
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
  password: ""
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

  var sql = "INSERT IGNORE INTO mytable (name,netid,pages) VALUES ('Zayd','zm994','501')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("record inserted");
  });

  // con.query("UPDATE mytable SET netid='hsj276' WHERE name='Daniel'");
  // con.query("UPDATE mytable SET netid='yj1254' WHERE name='Yeojin'");
  // con.query("UPDATE mytable SET netid='zm994' WHERE name='Zayd'");

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
