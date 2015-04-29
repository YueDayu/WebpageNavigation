/**
 * Created by xuyi on 4/29/15.
 */
var debug = true;

var API = require("../node_modules/wechat-api");
var config = require("../weixin/config");
var api = new API(config.appid, config.appsecret);
var fs = require('fs');

module.exports = function(app){


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
                if(typeof feedback[name] == "string"){
                    f_string += "1-"+feedback[name];
                }
                else{
                    var i;
                    for(i = 0;i < (feedback[name].length - 1);i++){
                        f_string += (i+1)+"-"+feedback[name][i] + " ";
                    }
                    f_string += (i+1)+"-"+feedback[name][i];
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

    app.post('/data_resource',function(req,res){
        var path = "./data/"+req.body.data_res+".json";
        fs.readFile(path, 'utf8', function (err, data) {
            if (err) throw err; // we'll not consider error handling for now
            var resource = JSON.parse(data);
            res.send(resource);
        });
    });

};