var map = new BMap.Map("allmap");
map.centerAndZoom(new BMap.Point(116.332836,40.009999), 15);
map.setCurrentCity("北京");

var locationLoop;

var myPosMarker;
var firstFlag = true;
var lastPoint = new BMap.Point(116.332836,40.009999);
var point = new BMap.Point(116.332836,40.009999);

var path, startPointMarker, endPointMarker;
var endPoint;

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

function startLocation() {
    SetLocation();
    if (map.getDistance(point, endPoint) < 50) {
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

function startNavigation(startPoint, _endPoint) {
    findRoute(startPoint, _endPoint);
    endPoint = _endPoint;
    locationLoop = setInterval("startLocation()", 5000);
}

function endNavigation() {
    clearInterval(locationLoop);
}

function addMarker(point, imageFile, title){
    var myIcon = new BMap.Icon(imageFile, new BMap.Size(15,15));
    var marker = new BMap.Marker(point, {
        icon: myIcon
    });
    if(title){
        marker.addEventListener("click", function(){
            var infoWindow = new BMap.InfoWindow();
            infoWindow.setTitle(title);
            infoWindow.setContent("More information about the event");
            marker.openInfoWindow(infoWindow);
        });
    }
    map.addOverlay(marker);
    return marker;
}

function addRoadBlock(){
    var blocks = [
        new BMap.Point(116.337138,40.010476),
        new BMap.Point(116.334111,40.011954)
    ];
    for(var i = 0;i < 2;i++){
        var marker = addMarker(blocks[i], "scripts/RoadBlock.jpg");
    }
}

function addTip(){
    var points = [
        new BMap.Point(116.336159,40.01565),
        new BMap.Point(116.340166,40.007015),
        new BMap.Point(116.332002,40.013724)
    ];
    var titles = [
        "嘉年华",
        "软件学院校庆",
        "烧烤狂欢节"
    ];
    var label = [
        "scripts/0.jpg",
        "scripts/2.jpg",
        "scripts/1.jpg"
    ];
    for(var i = 0;i < 3;i++){
        var marker = addMarker(points[i], label[i], titles[i]);
    }
}