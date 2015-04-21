var pStart = new BMap.Point(116.320547,39.997177);
var pEnd = new BMap.Point(116.345052,40.020554);
var bs = new BMap.Bounds(pStart,pEnd);

var lastMarker;
var searchPoint;

var roadcross;

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
        $("#search-button").attr({"disabled":"disabled"});
        var options = {
            onSearchComplete: function(results){
				$("#search-content").val("");
                $("#search-button").removeAttr("disabled");
                if (local.getStatus() == BMAP_STATUS_SUCCESS){
                    searchPoint = local.getResults().getPoi(0).point;
                    map.centerAndZoom(searchPoint, 18);
                    lastMarker = new BMap.Marker(searchPoint);
                    map.addOverlay(lastMarker);
                    $("#begin-nav-div").fadeIn();
                    $("#search-div").fadeOut();
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
        $("#begin-nav-button").removeAttr("disabled");
    });
    $("#begin-nav-button").attr({"disabled":"disabled"}).click(function(){
        map.removeOverlay(lastMarker);
        //point = new BMap.Point(116.332852,40.015323);
        //point = new BMap.Point(116.332394,40.009962);
        //point = new BMap.Point(116.332395,40.009959);
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
        $("#search-div").fadeIn();
    });
    $("#stop-nav-button").click(function(){
        endNavigation();
        map.removeOverlay(path);
        map.removeOverlay(startPointMarker);
        map.removeOverlay(endPointMarker);
        $("#search-div").fadeIn();
        $("#stop-nav-div").fadeOut();
        map.panTo(point);
        showModel("停止导航", "您已经手动停止导航。");
    });
    $("#locate-button").click(function() {
        map.panTo(point);
    });
    $("#feedback-button-div").click(function(){
        $("#feed-back-model").modal('show');
    });
    $("#post-feedback").click(function(){
        $.ajax({
            cache:false,
            type:"POST",
            url:"feedback",
            data:$("#user-feedback").serialize(),
            async: true,
            error: function(request) {
                $("#feed-back-model").modal("hide");
                resetfeedback();
                showModel("发送失败","网络错误，请检查网络连接设置");
            },
            success: function(data) {
                $("#feed-back-model").modal("hide");
                resetfeedback();
                showModel("发送成功","感谢您的合作！");
            }
        });
    });
    $("#cancel-post-feedback").click(function () {
        $("#feed-back-model").modal("hide");
        resetfeedback();
    });

    var p = 1;
    map.addEventListener("zoomend",function() {
        var Zoomrank = map.getZoom();//缩放等级从3到18，越大越细
        if(Zoomrank > 15)
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

    $.getJSON("../data/roadcross_info.json", function(data){
        roadcross = data;
    });
});

function showModel(title, content){
    $("#model-title").text(title);
    $("#model-content").text(content);
    $("#search-no-result").modal('show');
}

function resetfeedback(){
    $("#user-feedback")[0].reset();
}