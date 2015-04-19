var map = new BMap.Map("allmap");
map.centerAndZoom(new BMap.Point(116.332836,40.009999), 15);
map.setCurrentCity("北京");
map.enableScrollWheelZoom(true);

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

function findRoadCross(startPoint) {
    var result = [5, 5];
    for (var i = 0; i < 6; i++) {
        if (startPoint.lng < roadcross[0][i]["longitude"]) {
            result[0] = i;
            break;
        }
    }
    for (var j = 0; j < 6; j++) {
        if (startPoint.lat > roadcross[1][j]["latitude"]){
            result[1] = j;
            break;
        }
    }
    if((result[0] > 0) && (startPoint.lng < (roadcross[0][result[0]-1]["longitude"]+roadcross[0][result[0]]["longitude"])/2)){
        result[0] -= 1;
    }
    if((result[1] > 0) && (startPoint.lat > (roadcross[1][result[1]-1]["latitude"]+roadcross[1][result[1]]["latitude"])/2)){
        result[1] -= 1;
    }
    return result;
}

var paths = [];

function resultToPoint(x,y){
    return new BMap.Point(roadcross[2][x][y]["longitude"], roadcross[2][x][y]["latitude"]);
}

function findRoad(result_0, result_1, walking){
    if((result_0[1] > 0) && (result_0[1] < 5)){
        if(result_0[0] != result_1[0]){
            walks.push([resultToPoint(result_0[0],result_0[1]),resultToPoint(result_1[0],result_0[1])]);
        }
        walks.push([resultToPoint(result_1[0],result_0[1]),resultToPoint(result_1[0],result_1[1])]);
    }
    else if((result_1[1] > 0) && (result_1[1] < 5)){;
        walks.push([resultToPoint(result_0[0],result_0[1]),resultToPoint(result_0[0],result_1[1])]);
        if(result_0[0] != result_1[0]){
            walks.push([resultToPoint(result_0[0],result_1[1]),resultToPoint(result_1[0],result_1[1])]);
        }
    }
    else if((result_0[1] == result_1[1])||(result_0[0] == result_1[0])){
        walks.push([resultToPoint(result_0[0],result_0[1]),resultToPoint(result_1[0],result_1[1])]);
    }
    else if(result_0[1] == 0){
        walks.push([resultToPoint(result_0[0],result_0[1]),resultToPoint(result_0[0],1)]);
        findRoad([result_0[0],1], result_1, walking);
    }
    else{
        walks.push([resultToPoint(result_0[0],result_0[1]),resultToPoint(result_1[0],4)]);
        findRoad([result_0[0],4], result_1, walking);
    }
}

var walks = [];
var now = 0;

function findWalkingRoute(startPoint, endPoint) {
    var result_0 = findRoadCross(startPoint);
    var result_1 = findRoadCross(endPoint);
    if((result_0[0] == result_1[0]) && (result_0[1] == result_1[1])){
        var walking = new BMap.WalkingRoute(map, {
            renderOptions: {
                map: map,
                autoViewport: true
            }
        });
        walking.setMarkersSetCallback(function(a) {
            startPointMarker = a[0].marker;
            endPointMarker = a[1].marker;
        });
        walking.setPolylinesSetCallback(function(a) {
            path = a[0].getPolyline();
        });
        walking.search(startPoint, endPoint);
    }
    else{
        paths = [];
        now = 0;
        walks = [];
        var walking = new BMap.WalkingRoute(map, {
            onSearchComplete:function(result){
                now += 1;
                if(now == 1){
                    startPointMarker = new BMap.Marker(result.getStart().point);
                    map.addOverlay(startPointMarker);
                }
                else if(now == walks.length){
                    endPointMarker = new BMap.Marker(result.getEnd().point);
                    map.addOverlay(endPointMarker);
                }
                paths = paths.concat(result.getPlan(0).getRoute(0).getPath());
                if(now < walks.length) {
                    walking.search(walks[now][0], walks[now][1]);
                }
                else{
                    path = new BMap.Polyline(paths);
                    map.addOverlay(path);
                    paths = [];
                    map.setViewport([startPointMarker.getPosition(), endPointMarker.getPosition()]);
                }
            }
        });
        walks.push([startPoint, resultToPoint(result_0[0],result_0[1])]);
        findRoad(result_0, result_1, walking);
        walks.push([resultToPoint(result_1[0],result_1[1]), endPoint]);
        walking.search(walks[0][0],walks[0][1]);
    }
}

function findDrivingRoute(startPoint, endPoint){
    var driving = new BMap.DrivingRoute(map, {
        renderOptions:{
            map: map,
            autoViewport: true
        }
    });
    driving.setMarkersSetCallback(function(a) {
        startPointMarker = a[0].marker;
        endPointMarker = a[1].marker;
    });
    driving.setPolylinesSetCallback(function(a) {
        path = a[0].getPolyline();
    });
    driving.search(startPoint, endPoint);
}

function startNavigation(startPoint, endPoint) {
    findWalkingRoute(startPoint, endPoint);
    locationLoop = setInterval(startLocation(endPoint), 5000);
}

function endNavigation() {
    clearInterval(locationLoop);
}

function addMarker(point, imageFile, title,content){
    var myIcon = new BMap.Icon(imageFile, new BMap.Size(15,15));
    var marker = new BMap.Marker(point, {
        icon: myIcon
    });
    if(title){
        marker.addEventListener("click", function(){
            var infoWindow = new BMap.InfoWindow();
            infoWindow.setTitle(title);
            infoWindow.setContent(content);
            marker.openInfoWindow(infoWindow);
        });
    }
    map.addOverlay(marker);
    return marker;
}

function addRoadBlock(){
//    var blocks = [
//        new BMap.Point(116.337138,40.010476),
//        new BMap.Point(116.334111,40.011954)
//    ];
//    for(var i = 0;i < 2;i++){
//        var marker = addMarker(blocks[i], "scripts/RoadBlock.jpg");
//    }
    $.getJSON("../data/roadblock_info.json",function(data){
        $.each(data,function(infoIndex,info){
            var point = new BMap.Point(info["longitude"],info["latitude"]);
            var marker = addMarker(point,info["img"],info["title"],info["content"]);
        });
    });
}

function addTip(){
//    var points = [
//        new BMap.Point(116.336159,40.01565),
//        new BMap.Point(116.340166,40.007015),
//        new BMap.Point(116.332002,40.013724)
//    ];
//    var titles = [
//        "嘉年华",
//        "软件学院校庆",
//        "烧烤狂欢节"
//    ];
//    var label = [
//        "scripts/0.jpg",
//        "scripts/2.jpg",
//        "scripts/1.jpg"
//    ];
//    for(var i = 0;i < 3;i++){
//        var marker = addMarker(points[i], label[i], titles[i]);
//    }
    $.getJSON("../data/activity_info.json",function(data){
        $.each(data,function(infoIndex,info){
            var point = new BMap.Point(info["longitude"],info["latitude"]);
            var marker = addCMarker(point,info["img"],info["title"],info["content"]);
        });
    });
}

function GetZoom() {
    var Zoomrank = map.getZoom();//缩放等级从3到18，越大越细
    if (Zoomrank > 13)
        return 1;
    else return 0;
}

function addCMarker(point, imageFile, title,content) {
    function ComplexCustomOverlay(point, text, mouseoverText){
        this._point = point;
        this._text = text;
        this._overText = mouseoverText;
    }
    ComplexCustomOverlay.prototype = new BMap.Overlay();
    ComplexCustomOverlay.prototype.initialize = function(map){
        this._map = map;
        var div = this._div = document.createElement("div");
        div.className = "Markerstyle";
        div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
        var span = this._span = document.createElement("span");
        div.appendChild(span);
        span.appendChild(document.createTextNode(this._text));
        var that = this;

        var arrow = this._arrow = document.createElement("div");
        arrow.className = "Arrowstyle";
        arrow.style.left = "10px";
        div.appendChild(arrow);

        div.onmouseover = function(){
            //this.style.backgroundColor = "#6B00CA";
            //this.style.borderColor = "#0000ff";
            this.style.height = "50px"
            this.getElementsByTagName("span")[0].innerHTML = that._overText;
            arrow.style.backgroundPosition = "0px -20px";
        }

        div.onmouseout = function(){
            //this.style.backgroundColor = "#EE5D5B";
            //this.style.borderColor = "#BC3B3A";
            this.style.height = "20px"
            this.getElementsByTagName("span")[0].innerHTML = that._text;
            arrow.style.backgroundPosition = "0px 0px";
        }

        map.getPanes().labelPane.appendChild(div);

        return div;
    }
    ComplexCustomOverlay.prototype.draw = function(){
        var map = this._map;
        var pixel = map.pointToOverlayPixel(this._point);
        this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
        this._div.style.top  = pixel.y - 30 + "px";
    }
    var txt = title, mouseoverTxt = content ;

    var myCompOverlay = new ComplexCustomOverlay(point, title,mouseoverTxt);

    map.addOverlay(myCompOverlay);
}

function addNewPoint(point) {
    var Nmarker = new BMap.Marker(point);  // 创建标注
    map.addOverlay(Nmarker);               // 将标注添加到地图中
}