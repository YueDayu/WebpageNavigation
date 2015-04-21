var isDebug = true;
var isFirstTime = true;

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
        isFirstTime = false;
        callback(location);
    }
    var location = {};
    wx.getLocation({
        success: function (res) {
            var tempPoint = new BMap.Point(parseFloat(res.longitude), parseFloat(res.latitude));
            BMap.Convertor.translate(tempPoint, 0, function (point) {
                var accuracy = parseFloat(res.accuracy);
                //alert("Hello" + isFirstTime + point.lat);
                if (accuracy >= 50) {
                    if (isFirstTime == true) {
                        if (accuracy <= 150) {
                            showModel("定位精度过低", "请确保打开GPS定位");
                            location = {
                                latitude: parseFloat(point.lat),
                                longitude: parseFloat(point.lng),
                                accuracy: accuracy
                            };
                            isFirstTime = false;
                            callback(location);
                        } else {
                            if (isFirstTime == true) {
                                isFirstTime = false;
                                showModel("定位失败", "定位精度过低，请手动定位。");
                                $("#search-div").fadeOut();
                                map.addEventListener("click", setLocationByHand);
                                $("#set-location").click(function () {
                                    $("#search-div").fadeIn();
                                    $("#set-location").fadeOut();
                                    map.removeEventListener("click", setLocationByHand);
                                });
                            }
                        }
                    }
                } else {
                    location = {
                        latitude: parseFloat(point.lat),
                        longitude: parseFloat(point.lng),
                        accuracy: accuracy
                    };
                    isFirstTime = false;
                    callback(location);
                }
            });
        },
        fail:function(){
            if (isFirstTime) {
                isFirstTime = false;
                showModel("定位失败", "定位精度过低，请手动定位。");
                $("#search-div").fadeOut();
                map.addEventListener("click", setLocationByHand);
                $("#set-location").click(function () {
                    $("#search-div").fadeIn();
                    $("#set-location").fadeOut();
                    map.removeEventListener("click", setLocationByHand);
                });
            }
        },
        cancel: function (res) {
            alert('用户拒绝授权获取地理位置');
        }
    });
    wx.error(function (res) {
        alert("获取权限失败，无法获取地理位置。");
    });
}

