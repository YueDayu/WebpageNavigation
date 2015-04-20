
/**
 * Module dependencies.
 */
var debug = false;

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
          res.reply({ type: "text", content: "点击下方\"校园导航\"按钮进行定位与导航."});
    }
    if(message.MsgType == 'event' && message.Event == 'CLICK'){
        switch(message.EventKey){
            case "Navigation":
                var link = "<a href='shsf.thss.tsinghua.edu.cn/Navigation'>点击我进行定位与导航</a>\n如果网页长时间没有响应，请确保打开了GPS，并允许定位服务,之后重新进入网页。";
                res.reply({type:"text",content:link});
                break;
            default :
                break;
        }
    }
}));

//TODO:If you want to create Menu
//TODO:use this code just run at the first time.

menu.Menu();

app.get('/Navigation',function(req,res) {
    res.sendfile("./dist/Navigation.html");
});

app.post('/location', function(req, res){
    if (!debug) {
        var param = {
            debug:false,
            jsApiList: ['getLocation'],
            url:req.body.url
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