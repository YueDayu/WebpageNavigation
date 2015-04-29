var myAcMarker = [];
var Acsize=0;

var roadcross;
var activity_info;
var roadblock_info;
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
    var myIcon;
    if(type == "block")
        myIcon = new BMap.Icon("img/block.png", new BMap.Size(18,17));
    else
        myIcon = new BMap.Icon("img/park.png", new BMap.Size(15,15));
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
        var marker = addSMarker(point,info["type"],"<span class = 'infostyle'>" + info["title"] + "</span>",info["content"]);
        map.addOverlay(marker);
        myAcMarker.push(marker);
        Acsize += 1;
    });
}

var lastActivityMarker;

function moveToJingDian(index) {
    hideSideBar();
    map.removeOverlay(lastActivityMarker);
    map.zoomTo(17);
    var point = new BMap.Point(scence_info[index]["longitude"], scence_info[index]["latitude"]);
    map.panTo(point);
}

function addActivityMarker(type, index) {
    hideSideBar();
    map.removeOverlay(lastActivityMarker);
    switch (type) {
        case 0:
            lastActivityMarker = indoor_act[index];
            break;
        case 1:
            lastActivityMarker = outdoor_act[index];
            break;
        case 2:
            lastActivityMarker = school_match[index];
            break;
        case 3:
            lastActivityMarker = school_exhibition[index];
            break;
        case 4:
            lastActivityMarker = school_meeting[index];
            break;
    }
    map.addOverlay(lastActivityMarker);
    map.zoomTo(17);
    map.panTo(lastActivityMarker.point);
}

function addSMarker(point,type, title,content) {
    var myIcon;
    if(type == "activity")
        myIcon = new BMap.Icon("img/act.png", new BMap.Size(22,22));
    else if(type =="monument")
        myIcon = new BMap.Icon("img/tower.png", new BMap.Size(12,23));
    else if(type =="building")
        myIcon = new BMap.Icon("img/building.png", new BMap.Size(12,12));
    else if(type =="scence")
        myIcon = new BMap.Icon("img/scence.png", new BMap.Size(20,20));
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
        createMenuActivity();
    });
    getResource("scence_info",function(data){
        scence_info = data;
        createMenuScence();
    });
}
