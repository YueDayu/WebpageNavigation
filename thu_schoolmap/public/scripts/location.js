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
                var tempPoing = new BMap.Point(res.latitude, res.longitude);
                BMap.Convertor.translate(tempPoing, 2, function(point) {
                    location = {
                        latitude: point.x,
                        longitude: point.y,
                        accuracy: res.accuracy
                    };
                    callback(location);
                });
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

