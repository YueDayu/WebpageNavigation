$.post("/location",function(result){
    //console.log(result);
    //console.log("nice!");
    wx.config({
        debug:true,
        appId:result.appId,
        timestamp:result.timestamp,
        nonceStr:result.nonceStr,
        signature:result.signature,
        jsApiList:result.jsApiList
    });

});