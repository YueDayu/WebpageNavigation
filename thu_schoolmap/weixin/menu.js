/**
 * Created by yi on 2015/3/24.
 */

exports.Menu = function(){
    var API = require("../node_modules/wechat-api");
    var config = require("./config");
    var api = new API(config.appid,config.appsecret);
    var menu = JSON.stringify(require('./fixture/menu.json'));
    api.createMenu(menu,function(err,result){

    });
};
