/**
 * Created by yi on 2015/3/27.
 */

exports.webjsconfig = function(){
    var API = require("../node_modules/wechat-api");
    var config = require("./config");
    var api = new API(config.appid,config.appsecret);
    var express = require('express');
    var app = express();

    app.post('ajax/Navigation',function(req,res){
        var param = {
            debug:false,
            jsApiList: ['getLocation'],
            url:"http://yuedayu.github.io/WebpageNavigation/Navigation.html"
        };
        api.getJsConfig(param,callback);

        function callback(err,result) {
            res.send(result.toJSON());
        }
    });


}
