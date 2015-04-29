var myAcMarker = [];
var Acsize=0;

var roadcross;
var roadblock_info;
var activity_info;
var scence_info;

$(document).ready(function () {
    var isZoomed = true;
    map.addEventListener("zoomend",function() {
        var Zoomrank = map.getZoom();//缩放等级从3到18，越大越细
        if(Zoomrank > 16)
        {
            if(isZoomed)
            {
                addRoadBlock();
                addScence();
            }
            isZoomed=false;
        }
        else
        {
            RemoveAc();
            isZoomed=true;
        }
    });
    getResourceNecessary();

});

function addMarker(point, type,title,content){
    if(type == "block")
        var myIcon = new BMap.Icon("img/block.png", new BMap.Size(18,17));
    else
        var myIcon = new BMap.Icon("img/park.png", new BMap.Size(15,15));
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
    $.each(roadblock_info,function(infoIndex,info){
        var point = new BMap.Point(info["longitude"],info["latitude"]);
        var marker = addMarker(point,info["type"],info["title"],info["content"]);
        myAcMarker.push(marker);
        Acsize += 1;
    });
}

function addScence(){
    $.each(scence_info,function(infoIndex,info){
        var point = new BMap.Point(info["longitude"],info["latitude"]);
        var marker = addSMarker(point,info["type"],info["title"],info["content"]);
        myAcMarker.push(marker);
        Acsize += 1;
    });
}

//function addTip(){
//    getResource("activity_info",function(data){
//        $.each(data,function(infoIndex,info){
//            var point = new BMap.Point(info["longitude"],info["latitude"]);
//            var marker = addSMarker(point,info["type"],info["title"],info["content"]);
//            myAcMarker.push(marker);
//            Acsize += 1;
//        });
//    });
//}

function addSMarker(point,type, title,content) {
    if(type == "activity")
        var myIcon = new BMap.Icon("img/act.png", new BMap.Size(22,22));
    else if(type =="monument")
        var myIcon = new BMap.Icon("img/tower.png", new BMap.Size(12,23));
    else
        var myIcon = new BMap.Icon("img/scenic.png", new BMap.Size(12,12));
    var marker = new BMap.Marker(point, {
        icon: myIcon});
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

function RemoveAc() {
    for (i = 0; i < Acsize; i++) {
        map.removeOverlay(myAcMarker[i]);
    }
    Acsize = 0;
    myAcMarker = [];
}

function addNewPoint(point) {
    var Nmarker = new BMap.Marker(point);  // 创建标注
    map.addOverlay(Nmarker);               // 将标注添加到地图中
}

function getResource(type,callback){
    $.ajax({
        cache:false,
        type:"POST",
        url:"data_resource",
        data:{
            data_res:type
        },
        dataType:"json",
        async: true,
        error: function(request) {

        },
        success: function(data) {
            callback(data);
        }
    });
}

function getIntroduction(type,callback){
    $.ajax({
        cache:false,
        type:"POST",
        url:"introduction",
        data:{
            data_res:type
        },
        dataType:"json",
        async: true,
        error: function(request) {

        },
        success: function(data) {
            callback(data);
        }
    });
}

function getResourceNecessary(){
    getResource("roadcross_info",function(data){
        roadcross = data;
    });
    getResource("roadblock_info", function (data) {
        roadblock_info = data;
    });
    getResource("activity_info", function (data) {
        activity_info = data;
        createMenuActivity(data);
    });
    getResource("scence_info",function(data){
        scence_info = data;
        createMenuScence(data);
    });
}