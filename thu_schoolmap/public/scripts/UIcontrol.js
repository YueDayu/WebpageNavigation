//console.log("UIcontrol.js!");

$(document).ready(function(){
    $("#input-box").click(function(){
        $("#clear-button").css("display","block");

    });
    $("#clear-button").click(function(){
        //$("#search-content").attr("value","");
        //$("#clear-button").css("display","none");
        debugger;
        alert("1");
    });
    $("#search-button").click(function(){
        var cont = new BMap.Autocomplete(
            {
                "input": "search-content",
                "location": map
            });
        map.clearOverlays();    //清除地图上所有覆盖物
        function myFun() {
            var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
            map.centerAndZoom(pp, 18);
            map.addOverlay(new BMap.Marker(pp));    //添加标注
        }

        var local = new BMap.LocalSearch(map, { //智能搜索
            onSearchComplete: myFun
        });
        local.search(myValue);
    })
});
