var isDebug = true;
var lastLocation = {
    latitude: 0,
    longitude: 0,
    accuracy: 0
};
var locationLoop;

$.post("/location", function (result) {
    isDebug = result.isDebug;
    if (!isDebug) {
        wx.config({
            debug: false,
            appId: result.appId,
            timestamp: result.timestamp,
            nonceStr: result.nonceStr,
            signature: result.signature,
            jsApiList: result.jsApiList
        });
        wx.ready(function() {
            locationLoop = setInterval("SetLocation()", 10000);
        });
    } else {
        locationLoop = setInterval("SetLocation()", 10000);
    }
});

function Location(callback) {
    var location = {};
    if (isDebug) { //Debug mode, use browser location
        var geo = new BMap.Geolocation();
        geo.getCurrentPosition(function(r){
            if(this.getStatus() == BMAP_STATUS_SUCCESS){
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
                pointTranslate(tempPoint, function(point) {
                    var accuracy = parseFloat(res.accuracy);
                    if (accuracy >= 50)
                    {
                        if (lastLocation.longitude == 0) {
                            location = {
                                latitude: point.lat,
                                longitude: point.lng,
                                accuracy: accuracy
                            };
                        } else {
                            location = lastLocation;
                        }
                    } else {
                        //TODO: show path
                        var polyline = new BMap.Polyline([
                            lastLocation,
                            location
                        ], {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});   //创建折线
                        map.addOverlay(polyline);

                        lastLocation = location;
                        location = {
                            latitude: point.lat,
                            longitude: point.lng,
                            accuracy: accuracy
                        };
                    }
                    callback(location);
                });
            },
            cancel: function (res) {
                clearInterval(locationLoop);
                alert('用户拒绝授权获取地理位置');
            }
        });
        wx.error(function (res) {
            clearInterval(locationLoop);
            alert("获取权限失败请重启应用");
        });
    }
}

