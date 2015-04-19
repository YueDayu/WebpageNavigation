
/**
 * Module dependencies.
 */
var debug = true;

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var wechat = require('wechat');
var menu = require('./weixin/menu');
var app = express();
var API = require("./node_modules/wechat-api");
var config = require("./weixin/config");
var api = new API(config.appid, config.appsecret);
var fs = require('fs');

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

app.use(express.query());

// I add the following codes
// if someone sends a message,weixin will reply him
app.use('/wechat', wechat('thu_schoolmap', function (req, res, next) {
    var message = req.weixin;
    if(message.MsgType == 'text'){
          res.reply({ type: "text", content: "you input " + message.Content});  
    }
    if(message.MsgType == 'event' && message.Event == 'CLICK'){
        switch(message.EventKey){
            case "Navigation":
                var link = "<a href='http://123.56.155.236/Navigation'>点击我进行定位与导航</a>";
                res.reply({type:"text",content:link});
                break;
//            case "aaa":
//                res.reply({type:"text",content:"Just for test"});
//                break;
            default :
                break;
        }
    }
}));

//TODO:If you want to create Menu
//TODO:use this code just run at the first time.

//menu.Menu();

app.get('/Navigation',function(req,res) {
    res.sendfile("./dist/Navigation.html");
});

app.post('/location', function(req, res){
    if (!debug) {
        var param = {
            debug:false,
            jsApiList: ['getLocation'],
            url:"http://123.56.155.236/Navigation"
        };
        api.getJsConfig(param, function(err, result){
            result.isDebug = false;
            res.send(result);
        });
    } else {
        res.send({isDebug: true});
    }
});

app.post('/feedback',function(req,res){
    var feedback=req["body"];
    var f_string = "";

    for(var name in feedback){
        if(name=="problem"){
            f_string += "["+name+" ";
            for(var i= 0;i < feedback[name].length;i++){
                f_string += (i+1)+"-"+feedback[name][i] + " ";
            }
            f_string += "] ";
        }
        else{
            f_string += "["+name + " "+ feedback[name] + "] ";
        }
    }
    f_string += "\n";
    fs.appendFile('./userfeedback.txt', f_string, function (err) {
        if (err) throw err;
    });
    res.send("OK!");
});