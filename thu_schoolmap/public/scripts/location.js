var isDebug = true;

$.post("/location", function (result) {
    isDebug = result.isDebug;
    console.log(isDebug);
    if (!isDebug) {
        wx.config({
            debug: false,
            appId: result.appId,
            timestamp: result.timestamp,
            nonceStr: result.nonceStr,
            signature: result.signature,
            jsApiList: result.jsApiList
        });
    }
    SetLocation();
});

function Location(callback) {
    var location = {};
    if (isDebug) { //Debug mode, use browser location
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r){
            if(this.getStatus() == BMAP_STATUS_SUCCESS){
                console.log(r.point);
                location = {
                    latitude: r.point.lat,
                    longitude: r.point.lng,
                    accuracy: 0
                };
                console.log(location);
                callback(location);
            }
        },{enableHighAccuracy: true})
    } else { //wechat location
        wx.getLocation({
            success: function (res) {
                var tempPoint = new BMap.Point(parseFloat(res.longitude), parseFloat(res.latitude));
                alert(tempPoint.lng + " " + tempPoint.lat);

                translateCallback = function(point) {
                    alert("1");
                    location = {
                        latitude: point.lat,
                        longitude: point.lng,
                        accuracy: parseFloat(res.accuracy)
                    };
                    callback(location);
                };
                setTimeout(function(){
                    BMap.Convertor.translate(tempPoint, 2, translateCallback);
                }, 1000);

            },
            cancel: function (res) {
                alert('用户拒绝授权获取地理位置');
            }
        });
        wx.error(function (res) {
            alert("获取权限失败请重启应用");
        });
    }
}

