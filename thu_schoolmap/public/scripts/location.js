var isDebug = true;
var lastLocation_my = {
    latitude: 0,
    longitude: 0,
    accuracy: 0
};
$.ajax({
    url: "location",
    type: "post",
    data: {
        url: location.href.split('#')[0]
    },
    success: function (result) {
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
            wx.ready(function () {
                SetLocation(function () {
                    map.panTo(point);
                });
            });
        }
        else {
            SetLocation(function () {
                map.panTo(point);
            });
        }
    }
});

function Location(callback) {
    function setLocationByHand(e) {
        location = {
            latitude: e.point.lat,
            longitude: e.point.lng,
            accuracy: 0
        };
        $("#set-location").fadeIn();
        lastLocation_my = location;
        callback(location);
    }
    var location = {};
    wx.getLocation({
        success: function (res) {
            var tempPoint = new BMap.Point(parseFloat(res.longitude), parseFloat(res.latitude));
            BMap.Convertor.translate(tempPoint, 0, function (point) {
                var accuracy = parseFloat(res.accuracy);
                alert("Hello" + lastLocation_my.latitude);
                if (accuracy >= 50) {
                    if (lastLocation_my.longitude == 0 && lastLocation_my.latitude == 0) {
                        if (accuracy <= 150) {
                            showModel("定位精度过低", "请确保打开GPS定位");
                            location = {
                                latitude: point.lat,
                                longitude: point.lng,
                                accuracy: accuracy
                            };
                            lastLocation_my.latitude = location.latitude;
                            lastLocation_my.longitude = location.longitude;
                            lastLocation_my.accuracy = location.accuracy;
                            callback(location);
                        }
                        else {
                            showModel("定位失败", "定位精度过低，请手动定位。");
                            $("#search-div").fadeOut();
                            map.addEventListener("click", setLocationByHand);
                            $("#set-location").click(function () {
                                $("#search-div").fadeIn();
                                $("#set-location").fadeOut();
                                map.removeEventListener("click", setLocationByHand);
                            });
                        }
                    } else {
                        callback(location);
                    }
                } else {
                    location = {
                        latitude: point.lat,
                        longitude: point.lng,
                        accuracy: accuracy
                    };
                    lastLocation_my.latitude = location.latitude;
                    lastLocation_my.longitude = location.longitude;
                    lastLocation_my.accuracy = location.accuracy;
                    callback(location);
                }
            });
        },
        fail:function(){
            showModel("定位失败", "定位精度过低，请手动定位。");
            $("#search-div").fadeOut();
            map.addEventListener("click", setLocationByHand);
            $("#set-location").click(function () {
                $("#search-div").fadeIn();
                $("#set-location").fadeOut();
                map.removeEventListener("click", setLocationByHand);
            });
        },
        cancel: function (res) {
            alert('用户拒绝授权获取地理位置');
        }
    });
    wx.error(function (res) {
        alert("获取权限失败，无法获取地理位置。");
    });
}

