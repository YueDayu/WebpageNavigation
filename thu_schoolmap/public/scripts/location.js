var isDebug = true;
var lastLocation = {
    latitude: 0,
    longitude: 0,
    accuracy: 0
};

$.ajax({
    url:"loaction",
    type:"post",
    data:{
        url:location.href.split('#')[0]
    },
    success: function(result) {
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
                SetLocation(function() {
                    map.panTo(point);
                });
            });
        }
        else {
            SetLocation(function() {
                map.panTo(point);
            });
        }
    }
});

//$.post("/location", function (result) {
//    isDebug = result.isDebug;
//    if (!isDebug) {
//        wx.config({
//            debug: true,
//            appId: result.appId,
//            timestamp: result.timestamp,
//            nonceStr: result.nonceStr,
//            signature: result.signature,
//            jsApiList: result.jsApiList
//        });
//        console.log(result);
//
//        wx.ready(function() {
//            SetLocation(function() {
//                map.panTo(point);
//            });
//        });
//    } else {
//        SetLocation(function() {
//            map.panTo(point);
//        });
//    }
//});

function Location(callback) {
    function setLocationByHand(e) {
        location = {
            latitude: e.point.lat,
            longitude: e.point.lng,
            accuracy: 0
        };
        $("#set-location").fadeIn();
        lastLocation = location;
        callback(location);
    }
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
                showModel("定位失败", "定位精度过低，请手动定位。");
                $("#search-div").fadeOut();
                map.addEventListener("click", function(e) {
                    location = {
                        latitude: e.point.lat,
                        longitude: e.point.lng,
                        accuracy: 0
                    };
                    $("#set-location").fadeIn();
                    callback(location);
                });
                console.log(location);
            }
        },{enableHighAccuracy: true})
    } else { //wechat location
        wx.getLocation({
            success: function (res) {
                var tempPoint = new BMap.Point(parseFloat(res.longitude), parseFloat(res.latitude));
                BMap.Convertor.translate(tempPoint, 0, function(point) {
                    var accuracy = parseFloat(res.accuracy);
                    if (accuracy >= 50 && accuracy <= 150)
                    {
                        if (lastLocation.longitude == 0) {
                            showModel("定位精度过低", "请确保打开GPS定位");
                            location = {
                                latitude: point.lat,
                                longitude: point.lng,
                                accuracy: accuracy
                            };
                            lastLocation = location;
                        } else {
                            location = lastLocation;
                            //callback(location);
                        }
                    }
                    else if(accuracy > 150){
                        showModel("定位失败", "定位精度过低，请手动定位。");
                        $("#search-div").fadeOut();
                        map.addEventListener("click", setLocationByHand);
                        $("#set-location").click(function() {
                            $("#search-div").fadeIn();
                            $("#set-location").fadeOut();
                            map.removeEventListener("click", setLocationByHand);
                        });
                    }
                    else {
                        lastLocation = location;
                        location = {
                            latitude: point.lat,
                            longitude: point.lng,
                            accuracy: accuracy
                        };
                        //callback(location);
                    }
                    callback(location);
                });
            },
            cancel: function (res) {
                alert('用户拒绝授权获取地理位置');
            }
        });
        wx.error(function (res) {
            //alert("获取权限失败请重启应用");
        });
    }
}

