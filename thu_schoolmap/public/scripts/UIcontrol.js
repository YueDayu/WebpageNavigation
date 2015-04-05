var pStart = new BMap.Point(116.320547,39.997177);
var pEnd = new BMap.Point(116.345052,40.020554);
var bs = new BMap.Bounds(pStart,pEnd);

var lastMarker;

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
        var options = {
            onSearchComplete: function(results){
                if (local.getStatus() == BMAP_STATUS_SUCCESS){
                    var pp = local.getResults().getPoi(0).point;
                    map.centerAndZoom(pp, 18);
                    lastMarker = new BMap.Marker(pp);
                    map.addOverlay(lastMarker);
                } else {
                    //$("#search-no-result").modal('show');
                    showModel("搜索失败", "抱歉，我们没有在清华校内找到您要的地点。");
                }
            }
        };
        var local = new BMap.LocalSearch(map, options);
        map.removeOverlay(lastMarker);
        //TODO: 处理输入信息
        local.searchInBounds(document.getElementById("search-content").value, bs);
    });
    $("#begin-nav-button").click(function(){

    });
    $("#return-button").click(function(){

    });
    //TODO:You can use the following code to make navgation-bottom-bar show or disappear
    //  $("#navgation-bottom-bar").fadeOut();
    //  $("#navgation-bottom-bar").fadeIn();
});

function showModel(title, content){
    $("#model-title").text(title);
    $("#model-content").text(content);
    $("#search-no-result").modal('show');
}