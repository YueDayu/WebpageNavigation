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

    $("#search-button").click(function(){
        map.removeOverlay(path);
        map.removeOverlay(startPointMarker);
        map.removeOverlay(endPointMarker);
        map.removeOverlay(lastMarker);
        var options = {
            onSearchComplete: function(results){
				$("#search-content").val("");
                if (local.getStatus() == BMAP_STATUS_SUCCESS){
                    searchPoint = local.getResults().getPoi(0).point;
                    map.centerAndZoom(searchPoint, 18);
                    lastMarker = new BMap.Marker(searchPoint);
                    map.addOverlay(lastMarker);
                    $("#begin-nav-div").fadeIn();
                } else {
					showModel("搜索失败", "抱歉，我们没有在清华校内找到您要的地点。");
                }
            }
        };
		var options_customs = {
            onSearchComplete: function(results){
                if (local_custom.getStatus() == BMAP_STATUS_SUCCESS){
					$("#search-content").val("");
                    searchPoint = local_custom.getResults().getPoi(0).point;
                    map.centerAndZoom(searchPoint, 18);
                    lastMarker = new BMap.Marker(searchPoint);
                    map.addOverlay(lastMarker);
                    $("#begin-nav-div").fadeIn();
                } else {
                    local.searchInBounds(document.getElementById("search-content").value, bs);
                }
            }
		}
        var local = new BMap.LocalSearch(map, options);
		var local_custom = new BMap.LocalSearch(map, options_customs);
        map.removeOverlay(lastMarker);
        //TODO: 处理输入信息
		local_custom.searchInBounds(document.getElementById("search-content").value, bs, {
			customData:{
				geotableId:99990
			}
		});
    });
    $("#begin-nav-button").attr({"disabled":"disabled"}).click(function(){
        map.removeOverlay(lastMarker);
        startNavigation(point, searchPoint);
        $("#begin-nav-div").fadeOut(function() {
            $("#stop-nav-div").fadeIn();
        });
        $("#search-div").fadeOut();
    });
    $("#return-button").click(function(){
        map.removeOverlay(path);
        map.removeOverlay(startPointMarker);
        map.removeOverlay(endPointMarker);
        map.removeOverlay(lastMarker);
        map.panTo(point);
        $("#begin-nav-div").fadeOut();
    });
    $("#stop-nav-div").click(function(){
        endNavigation();
        map.removeOverlay(path);
        map.removeOverlay(startPointMarker);
        map.removeOverlay(endPointMarker);
        $("#search-div").fadeIn();
        $("#stop-nav-div").fadeOut();
        map.panTo(point);
        showModel("停止导航", "您已经手动停止导航。");
    });
    //TODO:You can use the following code to make navgation-bottom-bar show or disappear
    //$("#begin-nav-div").fadeOut();
    //  $("#begin-nav-div").fadeOut();
    //  $("#begin-nav-div").fadeIn();
    //  $("#stop-nav-div").fadeOut();
    //  $("#stop-nav-div").fadeIn();

    //TODO : You can use the following code to show or hide the modal which indicates that
    //you are trying to locate yourself
    // $("#begin-nav-model").modal('show');
    // $("#begin-nav-model").modal('hide');

    //TODO : Add function to locate-self button
    //$("#locate-button-div").click(function(){
    //
    //});
});

function showModel(title, content){
    $("#model-title").text(title);
    $("#model-content").text(content);
    $("#search-no-result").modal('show');
}