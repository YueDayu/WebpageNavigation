var pStart = new BMap.Point(116.320547,39.997177);
var pEnd = new BMap.Point(116.345052,40.020554);
var bs = new BMap.Bounds(pStart,pEnd);

var lastMarker;
var searchPoint;

var $lateral_menu_trigger = $('#cd-menu-trigger'),
    $content_wrapper = $('.cd-main-content'),
    $navigation = $('header');

function hideSideBar() {
    $lateral_menu_trigger.removeClass('is-clicked');
    $navigation.removeClass('lateral-menu-is-open');
    $content_wrapper.removeClass('lateral-menu-is-open').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
        $('body').removeClass('overflow-hidden');
    });
    $('#cd-lateral-nav').removeClass('lateral-menu-is-open');
    if($('html').hasClass('no-csstransitions')) {
        $('body').removeClass('overflow-hidden');
    }
}

function showMsg(a, b) {
    console.log("Hello" + a + b);
    hideSideBar()
}

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

    $("#location-model-button").click(function() {
        $("#location-model-button").attr({"disabled":"disabled"});
        $("#location-model").fadeOut(function() {
            $("#return-from-location-model").fadeIn();
        });
        $("#search-div").fadeOut();
        locationLoop = setInterval("startLocation()", 3000);
    });

    $("#return-from-location-model-button").click(function() {
        $("#return-from-location-model").fadeOut(function() {
            $("#location-model").fadeIn();
        });
        $("#search-div").fadeIn();
        $("#location-model-button").removeAttr("disabled");
        endNavigation();
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
                    $("#location-model").fadeOut(1000,function(){
                        $("#begin-nav-div").fadeIn();
						$("#return-begin-nav-div").fadeIn();
                        $("#search-div").fadeOut();
                    });
                    searchPoint = local.getResults().getPoi(0).point;
                    map.centerAndZoom(searchPoint, 18);
                    lastMarker = new BMap.Marker(searchPoint);
                    map.addOverlay(lastMarker);
                } else {
					showModel("搜索失败", "抱歉，我们没有在清华校内找到您要的地点。");
                }
            }
        };
		var options_customs = {
            onSearchComplete: function(results){
                if (local_custom.getStatus() == BMAP_STATUS_SUCCESS){
                    $("#location-model").fadeOut(1000,function(){
                        $("#begin-nav-div").fadeIn();
						$("#return-begin-nav-div").fadeIn();
                        $("#search-div").fadeOut();
                    });
					$("#search-content").val("");
                    searchPoint = local_custom.getResults().getPoi(0).point;
                    map.centerAndZoom(searchPoint, 18);
                    lastMarker = new BMap.Marker(searchPoint);
                    map.addOverlay(lastMarker);

                } else {
                    local.searchInBounds(document.getElementById("search-content").value, bs);
                }
            }
		};
        var local = new BMap.LocalSearch(map, options);
		var local_custom = new BMap.LocalSearch(map, options_customs);
        map.removeOverlay(lastMarker);
		local_custom.searchInBounds(document.getElementById("search-content").value, bs, {
			customData:{
				geotableId:99990
			}
		});
    });
    $("#begin-nav-button-foot").click(function(){
        map.removeOverlay(lastMarker);
        startNavigation(point, searchPoint, 0);
        $("#begin-nav-div").fadeOut(function() {
            $("#return-begin-nav-div").fadeOut();
            $("#stop-nav-div").fadeIn();
        });
        $("#search-div").fadeOut();
    });

    $("#begin-nav-button-car").click(function () {
        //TODO: add car nav
        map.removeOverlay(lastMarker);
        startNavigation(point, searchPoint, 1);
        $("#begin-nav-div").fadeOut(function() {
            $("#return-begin-nav-div").fadeOut();
            $("#stop-nav-div").fadeIn();
        });
        $("#search-div").fadeOut();
    });


    $("#return-begin-nav-button").click(function(){
        map.removeOverlay(path);
        map.removeOverlay(startPointMarker);
        map.removeOverlay(endPointMarker);
        map.removeOverlay(lastMarker);
        map.panTo(point);
        $("#return-begin-nav-div").fadeOut(function() {
            $("#begin-nav-div").fadeOut();
            $("#location-model").fadeIn();
        });
        $("#search-button").removeAttr("disabled");
        $("#search-div").fadeIn();
    });
    $("#stop-nav-button").click(function(){
        endNavigation();
        map.removeOverlay(path);
        map.removeOverlay(startPointMarker);
        map.removeOverlay(endPointMarker);
        $("#search-button").removeAttr("disabled");
        $("#search-div").fadeIn();
        $("#stop-nav-div").fadeOut(function() {
            $("#location-model").fadeIn();
        });
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

});

function showModel(title, content){
    $("#model-title").text(title);
    $("#model-content").text(content);
    $("#search-no-result").modal('show');
}

function resetfeedback(){
    $("#user-feedback")[0].reset();
}