
/**
 * Module dependencies.
 */


var express = require('express');
var routes = require('./routes');
var hadle_post = require("./routes/handle_post");
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var wechat = require('wechat');
var menu = require('./weixin/menu');
var app = express();

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
app.get('/Navigation',function(req,res) {
    res.sendfile("./dist/Navigation.html");
});
hadle_post(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

app.use(express.query());

// I add the following codes
// if someone sends a message,weixin will reply him
app.use('/wechat', wechat('thu_schoolmap', function (req, res, next) {
    var message = req.weixin;
    if(message.MsgType == 'text'){
        var link = "<a href='http://shsf.thss.tsinghua.edu.cn/Navigation'>点击我进行定位与导航</a>";
//          var link = "<a href='http://123.56.155.236/Navigation'>点击我进行定位与导航</a>";
        res.reply({type:"text",content:link});
    }
    if(message.MsgType == 'event' && message.Event == 'CLICK'){
        switch(message.EventKey){
            case "Navigation":
                var link = "<a href='http://shsf.thss.tsinghua.edu.cn/Navigation'>点击我进行定位与导航</a>";
//                var link = "<a href='http://123.56.155.236/Navigation'>点击我进行定位与导航</a>";
                res.reply({type:"text",content:link});
                break;
            default :
                break;
        }
    }
}));

//TODO:If you want to create Menu
//TODO:use this code just run at the first time.

//menu.Menu();

