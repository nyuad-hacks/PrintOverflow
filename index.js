var http = require('http');
var url = require('url');
var fs = require('fs'); //file system
var events = require('events');
var eventEmitter = new events.EventEmitter();
var formidable = require('formidable'); //file uploads
var nodemailer = require('nodemailer'); //send emails
var express = require('express');
var mysql = require('mysql');
const path = require('path');
const router = express();


var testpages=[];
var testemails=[];

var avg=[];
var percentile=[];

function sendemail(to,num,id) {
    console.log("to: ",to);
    console.log("num: ",num);
    console.log("id: ", id);

    var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'printoverflow@gmail.com',
        pass: 'xxxpasswordxxx'
    }
    });


    var graph="<b><p>You have printed " + num + " pages."+
    "</p>"+"<p>That is around "+ parseInt(0.06*num)+" kg of CO2 or an equivalant of driving a car for "+parseInt(0.06*num*1.6/0.404)+" km.</p>"+
    "<a href=http://localhost:3000/"+id+"/>"+"Click for more statistics"+"</a>"+
    "It also used up "+ parseInt(20*num)+" litres of water.</b>"+
    '<canvas id="myChart" width="400" height="400"></canvas>\
    <script src="./myChart.js"></script>\
    ';

    var mailOptions = {
    from: 'printoverflow@gmail.com',
    to: to,
    subject: 'Sending Email using Node.js',

    html:graph
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


    var justID = testemails.map(v => {
        return v.netid;
        });

    var emailadd = testemails.map(v => {
    return v.netid+"@nyu.edu";
    });

    var finalpages = testpages.map(v => {
    return v.pages;
    })

    var average = avg.map(v =>{
        return v;
    });


    emailadd.forEach((v,index) => {
    if (finalpages[index]>500)
        return sendemail(emailadd[index],finalpages[index],justID[index], average);
    });
}

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password" //changed password
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

    var sql = "INSERT IGNORE INTO mytable (name,netid,pages) VALUES('Zayd','zm994','150'),('Daniel','hsj276','590'), ('Yeojin','yj1254','320'), ('Minwu','mw300','490')";
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


    //calculating average
    con.query("SELECT AVG(pages) FROM mytable", function(err, result){
        if (err) throw err;
        avg = Object.values(JSON.parse(JSON.stringify(result)));
        console.log(avg);
    });

    //calculating percentile
    con.query("SELECT netid, ROUND(PERCENT_RANK() OVER (ORDER BY pages),2) percentile_rank FROM mytable", function(err,result){
        if (err) throw err;
        percentile = Object.values(JSON.parse(JSON.stringify(result)));
        console.log(percentile);
    });


});

router.listen('3000', function(){
    console.log('Server started on port 3000');
})
