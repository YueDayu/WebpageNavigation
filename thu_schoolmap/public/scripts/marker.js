var myAcMarker = [];
var Acsize=0;

var roadcross;

$(document).ready(function () {
    var p = 1;
    map.addEventListener("zoomend",function() {
        var Zoomrank = map.getZoom();//缩放等级从3到18，越大越细
        if(Zoomrank > 16)
        {
            if(p == 1)
            {
                addRoadBlock();
                addTip();
            }
            p = 0;
        }
        else
        {
            RemoveAc();
            p = 1;
        }
    });

    getResource("roadcross_info",function(data){
        roadcross = data;
    });
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
    getResource("roadblock_info", function (data) {
        $.each(data,function(infoIndex,info){
            var point = new BMap.Point(info["longitude"],info["latitude"]);
            var marker = addMarker(point,info["type"],info["title"],info["content"]);
            myAcMarker.push(marker);
            Acsize += 1;
        });
    })

}

function addTip(){
    $.getJSON("../data/activity_info.json",function(data){
        $.each(data,function(infoIndex,info){
            var point = new BMap.Point(info["longitude"],info["latitude"]);
            var marker = addSMarker(point,info["type"],info["title"],info["content"]);
            myAcMarker.push(marker);
            Acsize += 1;
        });
    });
}
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