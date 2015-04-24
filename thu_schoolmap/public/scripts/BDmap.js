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
        if(callback) {
            callback();
        }
    });
}

function startLocation() {
    SetLocation(function() {});
    if (map.getDistance(point, endPoint) < 50) {
        endNavigation();
        showModel("导航结束", "您已经到达目的地附近");
    }
}

function findRoadCross_0(startPoint) {
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
    return result;
}

function dis(x, y, point){
    var dx = x - point.lng;
    var dy = y - point.lat;
    return dx * dx + dy * dy;
}

function findRoadCross(startPoint, endPoint){
    var x = startPoint.lng - endPoint.lng;
    var y = startPoint.lat - endPoint.lat;
    var dx, dy, i, j;
    var area = x * x + y * y;
    var point1 = new BMap.Point(116.335024,40.011907),
        point2 = new BMap.Point(116.335087,40.010412);
    x = point1.lng - point2.lng;
    y = point1.lat - point2.lat;
    if(area < x * x + y * y){
        return [[0,0],[0,0]];
    }
    var result_0 = findRoadCross_0(startPoint);
    var result_1 = findRoadCross_0(endPoint);
    console.log("begin:", result_0, result_1);
    if(result_0[0] > 0){
        dx = 2;
    }
    else{
        dx = 1;
    }
    if(result_0[1] > 0){
        dy = 2;
    }
    else {
        dy = 1;
    }
    var result = [result_0[0],result_0[1]];
    for(i = 0;i < dx;i++){
        for(j = 0;j < dy;j++){
            if(dis(roadcross[0][result_0[0]-i]["longitude"], roadcross[1][result_0[1]-j]["latitude"], endPoint) <
            dis(roadcross[0][result[0]]["longitude"], roadcross[1][result[1]]["latitude"], endPoint)){
                result[0] = result_0[0]-i;
                result[1] = result_0[1]-j;
            }
        }
    }
    var gap;
    if(dx == 2){
        gap = roadcross[0][result_0[0]]["longitude"] - roadcross[0][result_0[0]-1]["longitude"];
        if(Math.abs(startPoint.lng - roadcross[0][result_0[0]["longitude"]]) / gap < 0.15){
            result[0] = result_0[0];
        }
        else if(Math.abs(startPoint.lng - roadcross[0][result_0[0]-1]["longitude"]) / gap < 0.15){
            result[0] = result_0[0]-1;
        }
    }
    if(dy == 2){
        gap = roadcross[1][result_0[1]]["latitude"] - roadcross[1][result_0[1]-1]["latitude"];
        if(Math.abs(startPoint.lat - roadcross[1][result_0[1]["latitude"]]) / gap < 0.15){
            result[1] = result_0[1];
        }
        else if(Math.abs(startPoint.lat - roadcross[1][result_0[1]-1]["latitude"]) / gap < 0.15){
            result[1] = result_0[1]-1;
        }
    }
    result_0 = [result[0], result[1]];
    var point = new BMap.Point(roadcross[0][result_0[0]]["longitude"], roadcross[1][result_0[1]]["latitude"]);
    if(result_1[0] > 0){
        dx = 2;
    }
    else{
        dx = 1;
    }
    if(result_1[1] > 0){
        dy = 2;
    }
    else {
        dy = 1;
    }
    result = [result_1[0], result_1[1]];
    for(i = 0;i < dx;i++){
        for(j = 0;j < dy;j++){
            if(dis(roadcross[0][result_1[0]-i]["longitude"], roadcross[1][result_1[1]-j]["latitude"], point) <
                dis(roadcross[0][result[0]]["longitude"], roadcross[1][result[1]]["latitude"], point)){
                result[0] = result_1[0]-i;
                result[1] = result_1[1]-j;
            }
        }
    }
    console.log(result);
    if(dx == 2){
        gap = roadcross[0][result_1[0]]["longitude"] - roadcross[0][result_1[0]-1]["longitude"];
        if(Math.abs(endPoint.lng - roadcross[0][result_1[0]["longitude"]]) / gap < 0.15){
            console.log(endPoint.lng, roadcross[0][result_1[0]]["longitude"], Math.abs(endPoint.lng - roadcross[0][result_1[0]]["longitude"]) / gap);
            result[0] = result_1[0];
        }
        else if(Math.abs(endPoint.lng - roadcross[0][result_1[0]-1]["longitude"]) / gap < 0.15){
            console.log(endPoint.lng, roadcross[0][result_1[0]-1]["longitude"], Math.abs(endPoint.lng - roadcross[0][result_1[0]-1]["longitude"]) / gap);
            result[0] = result_1[0]-1;
        }
    }
    if(dy == 2){
        gap = roadcross[1][result_1[1]-1]["latitude"] - roadcross[1][result_1[1]]["latitude"];
        if(Math.abs(endPoint.lat - roadcross[1][result_1[1]["latitude"]]) / gap < 0.15){
            console.log(endPoint.lat, roadcross[1][result_1[1]]["latitude"], Math.abs(endPoint.lat - roadcross[1][result_1[1]]["latitude"]) / gap);
            result[1] = result_1[1];
        }
        else if(Math.abs(endPoint.lat - roadcross[1][result_1[1]-1]["latitude"]) / gap < 0.15){
            console.log(endPoint.lat, roadcross[1][result_1[1]-1]["latitude"], Math.abs(endPoint.lat - roadcross[1][result_1[1]-1]["latitude"]) / gap);
            result[1] = result_1[1]-1;
        }
    }
    result_1 = [result[0],result[1]];
    console.log("end:", result_0, result_1);
    return [result_0, result_1];
}

var paths = [];

function resultToPoint(x,y){
    return new BMap.Point(roadcross[2][x][y]["longitude"], roadcross[2][x][y]["latitude"]);
}

function findRoad(result_0, result_1){
    if((result_0[1] == result_1[1]) || (result_0[0] == result_1[0])){
        walks.push([resultToPoint(result_0[0],result_0[1]),resultToPoint(result_1[0],result_1[1])]);
        console.log("walking:", [result_0[0],result_0[1]], [result_1[0],result_1[1]]);
    }
    else if((result_0[0] > 1) && (result_0[0] < 4)){
        walks.push([resultToPoint(result_0[0],result_0[1]),resultToPoint(result_0[0],result_1[1])]);
        console.log("walking:", [result_0[0],result_0[1]], [result_0[0],result_1[1]]);
        if(result_0[0] != result_1[0]){
            walks.push([resultToPoint(result_0[0],result_1[1]),resultToPoint(result_1[0],result_1[1])]);
            console.log("walking:", [result_0[0],result_1[1]], [result_1[0],result_1[1]]);
        }
    }
    else if((result_1[0] > 1) && (result_1[0] < 4)) {
        if(result_0[0] != result_1[0]){
            walks.push([resultToPoint(result_0[0],result_0[1]),resultToPoint(result_1[0],result_0[1])]);
            console.log("walking:", [result_0[0],result_0[1]], [result_1[0],result_0[1]]);
        }
        walks.push([resultToPoint(result_1[0],result_0[1]),resultToPoint(result_1[0],result_1[1])]);
        console.log("walking:", [result_1[0],result_0[1]], [result_1[0],result_1[1]]);
    }
    else if((result_0[1] > 0) && (result_0[1] < 5)){
        if(result_0[0] != result_1[0]){
            walks.push([resultToPoint(result_0[0],result_0[1]),resultToPoint(result_1[0],result_0[1])]);
            console.log("walking:", [result_0[0],result_0[1]], [result_1[0],result_0[1]]);
        }
        walks.push([resultToPoint(result_1[0],result_0[1]),resultToPoint(result_1[0],result_1[1])]);
        console.log("walking:", [result_1[0],result_0[1]], [result_1[0],result_1[1]]);
    }
    else if((result_1[1] > 0) && (result_1[1] < 5)){
        walks.push([resultToPoint(result_0[0],result_0[1]),resultToPoint(result_0[0],result_1[1])]);
        console.log("walking:", [result_0[0],result_0[1]], [result_0[0],result_1[1]]);
        if(result_0[0] != result_1[0]){
            walks.push([resultToPoint(result_0[0],result_1[1]),resultToPoint(result_1[0],result_1[1])]);
            console.log("walking:", [result_0[0],result_1[1]], [result_1[0],result_1[1]]);
        }
    }
    else{
        walks.push([resultToPoint(result_0[0],result_0[1]),resultToPoint(result_0[0],result_1[1])]);
        console.log("walking:", [result_0[0],result_0[1]], [result_0[0],result_1[1]]);
        if(result_0[0] != result_1[0]){
            walks.push([resultToPoint(result_0[0],result_1[1]),resultToPoint(result_1[0],result_1[1])]);
            console.log("walking:", [result_0[0],result_1[1]], [result_1[0],result_1[1]]);
        }
    }
}

var walks = [];
var now = 0;

function Modified_0(walks, point, result){
    var result_ = findRoadCross_0(point);
    if(result[0] == 2 && result[1] == 2 && result_[0] == 3 && result_[1] == 3){
        var tmp = new BMap.Point(116.334378, 40.009044);
        if(point.lat < tmp.lat){
            walks.push([point, tmp]);
            walks.push([tmp, resultToPoint(result[0], result[1])]);
        }
        else{
            var tmp = new BMap.Point(116.33559, 40.010405);
            if(point.lng < tmp.lng){
                walks.push([point, resultToPoint(result[0],result[1])]);
            }
            else{
                walks.push([point, resultToPoint(3,2)]);
                walks.push([resultToPoint(3,2), resultToPoint(2,2)]);
            }
        }
    }
    else if(result_[0] == 3 && result_[1] == 2){
        var tmp = new BMap.Point(116.335647,40.011295);
        if(point.lng > tmp.lng){
            if(point.lat < tmp.lat){
                walks.push([point, resultToPoint(3,2)]);
                if(result[1] != 2){
                    walks.push([resultToPoint(3,2), resultToPoint(3, result[1])]);
                }
                walks.push([resultToPoint(3, result[1]), resultToPoint(result[0], result[1])]);
            }
            else{
                walks.push([point, resultToPoint(3,1)]);
                if(result[1] != 1){
                    walks.push([resultToPoint(3,1), resultToPoint(3, result[1])]);
                }
                walks.push([resultToPoint(3, result[1]), resultToPoint(result[0], result[1])]);
            }
        }
        else{
            if(point.lat < tmp.lat){
                walks.push([point, resultToPoint(2,2)]);
                if(result[1] != 2){
                    walks.push([resultToPoint(2,2), resultToPoint(2, result[1])]);
                }
                walks.push([resultToPoint(2, result[1]), resultToPoint(result[0], result[1])]);
            }
            else{
                walks.push([point, resultToPoint(2,1)]);
                if(result[1] != 1){
                    walks.push([resultToPoint(2,1), resultToPoint(2, result[1])]);
                }
                walks.push([resultToPoint(2, result[1]), resultToPoint(result[0], result[1])]);
            }
        }
    }
    else if(result_[0] == 3 && result_[1] == 1){
        var tmp = new BMap.Point(116.335629,40.013685);
        if(point.lat < tmp.lat){
            if(point.lng < tmp.lng){
                if(result[1] == 0){
                    var pp = new BMap.Point(116.333985,40.013674);
                    walks.push([point, pp]);
                    walks.push([pp, resultToPoint(2,0)]);
                    if(result[0] != 2){
                        walks.push([resultToPoint(2,0), resultToPoint(3,0)]);
                    }
                }
                else{
                    var pp = new BMap.Point(116.334973,40.012262);
                    walks.push([point, pp]);
                    walks.push([pp, resultToPoint(result[0],result[1])]);
                }
            }
            else{
                if(result[1] == 0){
                    var pp = new BMap.Point(116.336959,40.013695);
                    walks.push([point, pp]);
                    walks.push([pp, resultToPoint(3,0)]);
                    if(result[0] != 3){
                        walks.push([resultToPoint(3,0), resultToPoint(2,0)]);
                    }
                }
                else{
                    walks.push([point, resultToPoint(3,1)]);
                    if(result[1] != 3){
                        walks.push([resultToPoint(3,1), resultToPoint(2,1)]);
                    }
                }
            }
        }
        else{
            walks.push([point, resultToPoint(result[0],result[1])]);
        }
    }
    else{
        walks.push([point, resultToPoint(result[0],result[1])]);
    }
}

function Modified_1(walks, point, result){
    var result_ = findRoadCross_0(point);
    if(result[0] == 2 && result[1] == 2 && result_[0] == 3 && result_[1] == 3){
        var tmp = new BMap.Point(116.334378, 40.009044);
        if(point.lat < tmp.lat){
            walks.push([resultToPoint(result[0], result[1]), tmp]);
            walks.push([tmp, point]);
        }
        else{
            var tmp = new BMap.Point(116.33559, 40.010405);
            if(point.lng < tmp.lng){
                walks.push([resultToPoint(result[0],result[1]), point]);
            }
            else{
                walks.push([resultToPoint(2,2), resultToPoint(3,2)]);
                walks.push([resultToPoint(3,2), point]);
            }
        }
    }
    else if(result_[0] == 3 && result_[1] == 2){
        var tmp = new BMap.Point(116.335647,40.011295);
        if(point.lng > tmp.lng){
            if(point.lat < tmp.lat){
                walks.push([resultToPoint(result[0], result[1]), resultToPoint(3, result[1])]);
                if(result[1] != 2){
                    walks.push([resultToPoint(3, result[1]), resultToPoint(3,2)]);
                }
                walks.push([resultToPoint(3,2), point]);
            }
            else{
                walks.push([resultToPoint(result[0], result[1]), resultToPoint(3, result[1])]);
                if(result[1] != 1){
                    walks.push([resultToPoint(3, result[1]), resultToPoint(3,1)]);
                }
                walks.push([resultToPoint(3,1), point]);
            }
        }
        else{
            if(point.lat < tmp.lat){
                walks.push([resultToPoint(result[0], result[1]), resultToPoint(2, result[1])]);
                if(result[1] != 2){
                    walks.push([resultToPoint(2, result[1]), resultToPoint(2,2)]);
                }
                walks.push([resultToPoint(2,2), point]);
            }
            else{
                walks.push([resultToPoint(result[0], result[1]), resultToPoint(2, result[1])]);
                if(result[1] != 1){
                    walks.push([resultToPoint(2, result[1]), resultToPoint(2,1)]);
                }
                walks.push([resultToPoint(2,1), point]);
            }
        }
    }
    else if(result_[0] == 3 && result_[1] == 1){
        var tmp = new BMap.Point(116.335629,40.013685);
        if(point.lat < tmp.lat){
            if(point.lng < tmp.lng){
                if(result[1] == 0){
                    var pp = new BMap.Point(116.333985,40.013674);
                    if(result[0] != 2){
                        walks.push([resultToPoint(3,0), resultToPoint(2,0)]);
                    }
                    walks.push([resultToPoint(2,0), pp]);
                    walks.push([pp, point]);
                }
                else{
                    var pp = new BMap.Point(116.334973,40.012262);
                    walks.push([resultToPoint(result[0],result[1]), pp]);
                    walks.push([pp, point]);
                }
            }
            else{
                if(result[1] == 0){
                    var pp = new BMap.Point(116.336959,40.013695);
                    if(result[0] != 3){
                        walks.push([resultToPoint(2,0), resultToPoint(3,0)]);
                    }
                    walks.push([resultToPoint(3,0), pp]);
                    walks.push([pp, point]);
                }
                else{
                    if(result[1] != 3){
                        walks.push([resultToPoint(2,1), resultToPoint(3,1)]);
                    }
                    walks.push([resultToPoint(3,1), point]);
                }
            }
        }
        else{
            walks.push([resultToPoint(result[0],result[1]), point]);
        }
    }
    else{
        walks.push([resultToPoint(result[0],result[1]), point]);
    }
}

function findWalkingRoute(startPoint, endPoint) {
    var result = findRoadCross(startPoint, endPoint);
    if((result[0][0] == result[1][0]) && (result[0][1] == result[1][1])){
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
        Modified_0(walks, startPoint, result[0]);
        findRoad(result[0], result[1]);
        Modified_1(walks, endPoint, result[1]);
        console.log(walks[0]);
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
    locationLoop = setInterval("startLocation()", 3000);
}

function endNavigation() {
    clearInterval(locationLoop);
}
