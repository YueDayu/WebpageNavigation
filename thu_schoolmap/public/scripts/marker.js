var myAcMarker = [];
var Acsize=0;

var roadcross;
var activity_info;
var roadblock_info;
var scence_info;

var indoor_act=[];
var indoor_act_num=0;
var outdoor_act=[];
var outdoor_act_num=0;
var school_match=[];
var school_match_num=0;
var school_exhibition=[];
var school_exhibition_num=0;
var school_meeting=[];
var school_meeting_num=0;
var currentMarker=[];
var currentMarkrt_num=0;

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
//    map.addOverlay(marker);
    return marker;
}

function addRoadBlock(){
    $.each(roadblock_info,function(infoIndex,info){
        var point = new BMap.Point(info["longitude"],info["latitude"]);
        var marker = addMarker(point,info["type"],info["title"],info["content"]);
        map.addOverlay(marker);
        myAcMarker.push(marker);
        Acsize += 1;
    });
}

function addScence(){
    $.each(scence_info,function(infoIndex,info){
        var point = new BMap.Point(info["longitude"],info["latitude"]);
        var marker = addSMarker(point,info["type"],info["title"],info["content"]);
        map.addOverlay(marker);
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
    else if(type =="building")
        var myIcon = new BMap.Icon("img/building.png", new BMap.Size(12,12));
    else if(type =="scence")
        var myIcon = new BMap.Icon("img/scence.png", new BMap.Size(20,20));
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
    //map.addOverlay(marker);
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

function getResourceNecessary(){
    getResource("roadcross_info",function(data){
        roadcross = data;
    });
    getResource("roadblock_info", function (data) {
        roadblock_info = data;
    });
    getResource("activity_info", function (data) {
        activity_info = data;
        filterActivity(activity_info);
        createMenuActivity(activity_info);
    });
    getResource("scence_info",function(data){
        scence_info = data;
        createMenuScence(scence_info);
    });
}

function filterActivity(data){
    $.each(data,function(infoIndex,info){
        var point = new BMap.Point(info["longitude"],info["latitude"]);
        var marker = addSMarker(point,info["type"],info["title"],info["content"]);
        if(info["name"]=="indoor_act"){
            indoor_act.push(marker);
            indoor_act_num++;
        }
        else if(info["name"]=="outdoor_act"){
            outdoor_act.push(marker);
            outdoor_act_num++;
        }
        else if(info["name"]=="match"){
            school_match.push(marker);
            school_match_num++;
        }
        else if(info["name"]="exhibition"){
            school_exhibition.push(marker);
            school_exhibition_num++;
        }
        else if(info["name"]="meeting"){
            school_meeting.push(marker);
            school_meeting_num++;
        }
    });
}