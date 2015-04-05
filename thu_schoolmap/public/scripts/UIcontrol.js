var pStart = new BMap.Point(116.320547,39.997177);
var pEnd = new BMap.Point(116.345052,40.020554);
var bs = new BMap.Bounds(pStart,pEnd);

var lastMarker;
var searchPoint;

$(document).ready(function(){
    var ac = new BMap.Autocomplete({
            "input" : "search-content",
            "location" : map
        });

    $("#allmap").click(function(){

       $("#search-content").blur();
       $("#search-button").blur();
       $("#begin-nav-button").blur();
       $("#return-button").blur();

    });
    //TODO: 在取消焦点的时候使用 startlocation 函数开始自定位。
    //$("#search-content").focus(function() {
    //    stopLocation();
    //});
    $("#search-button").click(function(){
        map.removeOverlay(path);
        map.removeOverlay(startPointMarker);
        map.removeOverlay(endPointMarker);
        var options = {
            onSearchComplete: function(results){
                if (local.getStatus() == BMAP_STATUS_SUCCESS){
                    searchPoint = local.getResults().getPoi(0).point;
                    map.centerAndZoom(searchPoint, 18);
                    lastMarker = new BMap.Marker(searchPoint);
                    map.addOverlay(lastMarker);
                    $("#navgation-bottom-bar").fadeIn();
                } else {
                    showModel("搜索失败", "抱歉，我们没有在清华校内找到您要的地点。");
                }
            }
        };
        var local = new BMap.LocalSearch(map, options);
        map.removeOverlay(lastMarker);
        //TODO: 处理输入信息
        local.searchInBounds(document.getElementById("search-content").value, bs);
    });
    $("#begin-nav-button").attr({"disabled":"disabled"}).click(function(){
        map.removeOverlay(lastMarker);
        findRoute(point, searchPoint);
    });
    $("#return-button").click(function(){

    });
    //TODO:You can use the following code to make navgation-bottom-bar show or disappear
    $("#navgation-bottom-bar").fadeOut();
    //  $("#navgation-bottom-bar").fadeIn();
});

function showModel(title, content){
    $("#model-title").text(title);
    $("#model-content").text(content);
    $("#search-no-result").modal('show');
}