var map = new BMap.Map("allmap");
map.centerAndZoom(new BMap.Point(116.332836,40.009999), 15);
map.setCurrentCity("北京");
map.addControl(new BMap.GeolocationControl());
map.enableScrollWheelZoom(true);

var locationLoop;

var myPosMarker;
var firstFlag = true;
var lastPoint = new BMap.Point(116.332836,40.009999);
var point = new BMap.Point(116.332836,40.009999);

var path, startPointMarker, endPointMarker;

function SetLocation(callback) {
    Location(function (pos) {
        lastPoint = point;
        firstFlag = false;
        $("#begin-nav-button").removeAttr("disabled");
        point = new BMap.Point(pos.longitude, pos.latitude);
        map.removeOverlay(myPosMarker);
        myPosMarker = new BMap.Marker(point);
        map.addOverlay(myPosMarker);
        //map.panTo(point); //TODO: make point center.
        if(callback) {
            callback();
        }
    });
}

function startLocation(endPoint) {
    SetLocation();
    if (map.getDistance(point, endPoint) < 30) {
        endNavigation();
        showModel("导航结束", "您已经到达目的地附近");
    }
}

function findRoute(startPoint, endPoint) {
    var walking = new BMap.WalkingRoute(map, {renderOptions:{map: map, autoViewport: true}});
    walking.setMarkersSetCallback(function(a) {
        startPointMarker = a[0].marker;
        endPointMarker = a[1].marker;
    });
    walking.setPolylinesSetCallback(function(a) {
        path = a[0].getPolyline();
    });
    walking.search(startPoint, endPoint);
}

function startNavigation(startPoint, endPoint) {
    findRoute(startPoint, endPoint);
    locationLoop = setInterval(startLocation(endPoint), 5000);
}

function endNavigation() {
    clearInterval(locationLoop);
}