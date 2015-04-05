var map = new BMap.Map("allmap");
map.centerAndZoom(new BMap.Point(116.332836,40.009999), 15);
map.setCurrentCity("北京");

var locationLoop;

var myPosMarker;
var firstFlag = true;
var lastPoint = new BMap.Point(116.332836,40.009999);
var point = new BMap.Point(116.332836,40.009999);

var path, startPointMarker, endPointMarker;

function SetLocation() {
    Location(function (pos) {
        lastPoint = point;
        firstFlag = false;
        $("#begin-nav-button").removeAttr("disabled");
        point = new BMap.Point(pos.longitude, pos.latitude);
        var polyline = new BMap.Polyline([
            lastPoint,
            point
        ], {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});   //创建折线
        map.addOverlay(polyline);
        map.removeOverlay(myPosMarker);
        myPosMarker = new BMap.Marker(point);
        map.addOverlay(myPosMarker);
        //map.panTo(point); //TODO: make point center.
    });
}

function startLocation() {
    SetLocation();
    locationLoop = setInterval("SetLocation()", 5000);
}

function stopLocation() {
    clearInterval(locationLoop);
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