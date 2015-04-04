var map = new BMap.Map("allmap");
map.centerAndZoom(new BMap.Point(116.332836,40.009999), 15);
map.setCurrentCity("北京");

var myPosMarker;
var firstFlag = true;

function SetLocation() {
    Location(function (pos) {
        if (!firstFlag) {
            map.removeOverlay(myPosMarker);
            firstFlag = false;
        }
        var point = new BMap.Point(pos.longitude, pos.latitude);
        var b = new BMap.Marker(point);
        map.addOverlay(b);
        map.panTo(point);
    });
}
//
//var ac = new BMap.Autocomplete(
//    {
//        "input": "searchId",
//        "location": map
//    });
//
//ac.addEventListener("onhighlight", function (e) {  //鼠标放在下拉列表上的事件
//    //var str = "";
//    var _value = e.fromitem.value;
//    var value = "";
//    if (e.fromitem.index > -1) {
//        value = _value.province + _value.city + _value.district + _value.street + _value.business;
//    }
//    //str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
//
//    value = "";
//    if (e.toitem.index > -1) {
//        _value = e.toitem.value;
//        value = _value.province + _value.city + _value.district + _value.street + _value.business;
//    }
//    //str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
//    //	G("searchResultPanel").innerHTML = str;
//});
//
//var myValue;
//ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
//    var _value = e.item.value;
//    myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
//    //G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
//
//    setPlace();
//});
//
//function setPlace() {
//    map.clearOverlays();    //清除地图上所有覆盖物
//    function myFun() {
//        var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
//        map.centerAndZoom(pp, 18);
//        map.addOverlay(new BMap.Marker(pp));    //添加标注
//    }
//
//    var local = new BMap.LocalSearch(map, { //智能搜索
//        onSearchComplete: myFun
//    });
//    local.search(myValue);
//}
//
//function G(id) {
//    return document.getElementById(id);
//}
//
//function EntryPress(e) {
//    var e = e || window.event;
//    if (e.keyCode == 13) {
//        var walking = new BMap.WalkingRoute(map, {renderOptions: {map: map, autoViewport: true}});
//        walking.search(G("pathFrom").value, G("pathTo").value);
//    }
//}
//
//var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
//var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
//var top_right_navigation = new BMap.NavigationControl({
//    anchor: BMAP_ANCHOR_TOP_RIGHT,
//    type: BMAP_NAVIGATION_CONTROL_SMALL
//}); //右上角，仅包含平移和缩放按钮
///*缩放控件type有四种类型:
// BMAP_NAVIGATION_CONTROL_SMALL：仅包含平移和缩放按钮；BMAP_NAVIGATION_CONTROL_PAN:仅包含平移按钮；BMAP_NAVIGATION_CONTROL_ZOOM：仅包含缩放按钮*/
//
////添加控件和比例尺
//function add_control() {
//    map.addControl(top_left_control);
//    map.addControl(top_left_navigation);
//    map.addControl(top_right_navigation);
//}
//
////移除控件和比例尺
//function delete_control() {
//    map.removeControl(top_left_control);
//    map.removeControl(top_left_navigation);
//    map.removeControl(top_right_navigation);
//}
//
//
//// 复杂的自定义覆盖物
//function ComplexCustomOverlay(point, text, mouseoverText) {
//    this._point = point;
//    this._text = text;
//    this._overText = mouseoverText;
//}
//
//ComplexCustomOverlay.prototype = new BMap.Overlay();
//ComplexCustomOverlay.prototype.initialize = function (map) {
//    this._map = map;
//    var div = this._div = document.createElement("div");
//    div.style.position = "absolute";
//    div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
//    div.style.backgroundColor = "#EE5D5B";
//    div.style.border = "1px solid #BC3B3A";
//    div.style.color = "white";
//    div.style.height = "18px";
//    div.style.padding = "2px";
//    div.style.lineHeight = "18px";
//    div.style.whiteSpace = "nowrap";
//    div.style.MozUserSelect = "none";
//    div.style.fontSize = "12px"
//    var span = this._span = document.createElement("span");
//    div.appendChild(span);
//    span.appendChild(document.createTextNode(this._text));
//    var that = this;
//
//    var arrow = this._arrow = document.createElement("div");
//    arrow.style.background = "url(http://map.baidu.com/fwmap/upload/r/map/fwmap/static/house/images/label.png) no-repeat";
//    arrow.style.position = "absolute";
//    arrow.style.width = "11px";
//    arrow.style.height = "10px";
//    arrow.style.top = "22px";
//    arrow.style.left = "10px";
//    arrow.style.overflow = "hidden";
//    div.appendChild(arrow);
//
//    div.onmouseover = function () {
//        this.style.backgroundColor = "#6BADCA";
//        this.style.borderColor = "#0000ff";
//        this.getElementsByTagName("span")[0].innerHTML = that._overText;
//        arrow.style.backgroundPosition = "0px -20px";
//    }
//
//    div.onmouseout = function () {
//        this.style.backgroundColor = "#EE5D5B";
//        this.style.borderColor = "#BC3B3A";
//        this.getElementsByTagName("span")[0].innerHTML = that._text;
//        arrow.style.backgroundPosition = "0px 0px";
//    }
//
//    map.getPanes().labelPane.appendChild(div);
//
//    return div;
//}
//ComplexCustomOverlay.prototype.draw = function () {
//    var map = this._map;
//    var pixel = map.pointToOverlayPixel(this._point);
//    this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
//    this._div.style.top = pixel.y - 30 + "px";
//}
////var txt = "银湖海岸城", mouseoverTxt = txt + " " + parseInt(Math.random() * 1000, 10) + "套";
////
////var myCompOverlay = new ComplexCustomOverlay(new BMap.Point(116.407845, 39.914101), "银湖海岸城", mouseoverTxt);
//
////map.addOverlay(myCompOverlay);
