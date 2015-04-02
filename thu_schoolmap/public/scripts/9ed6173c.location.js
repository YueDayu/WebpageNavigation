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

    wx.checkJsApi({
        jsApiList: ['getLocation'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
        success: function (res) {
            // 以键值对的形式返回，可用的api值true，不可用为false
            // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}

        }
    });
});
$.ready(function(){
    wx.ready(function(){
        wx.checkJsApi({
            jsApiList: [
                'getLocation'
            ],
            success: function (res) {
                alert(JSON.stringify(res));
            }
        });
        wx.getLocation({
            success: function (res) {
                alert(JSON.stringify(res));
            },
            cancel: function (res) {
                alert('用户拒绝授权获取地理位置');
            }
        });
    });
    wx.error(function(res){

        alert("1234");
    });
});
