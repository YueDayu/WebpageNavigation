$.post("/location",function(result){
    //console.log(result);
    //console.log("nice!");
    wx.config({
        debug:false,
        appId:result.appId,
        timestamp:result.timestamp,
        nonceStr:result.nonceStr,
        signature:result.signature,
        jsApiList:result.jsApiList
    });

});
$(document).ready(function(){
    wx.ready(function(){
        wx.checkJsApi({
            jsApiList: [
                'getLocation'
            ],
            success: function (res) {

            }
        });
        wx.getLocation({
            success: function (res) {
                //var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                //var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                //var speed = res.speed; // 速度，以米/每秒计
                //var accuracy = res.accuracy; // 位置精度

                alert(JSON.stringify(res));
            },
            cancel: function (res) {
                //alert('用户拒绝授权获取地理位置');
            }
        });
    });
    wx.error(function(res){
        alert(JSON.stringify(res));
    });
});
