	var map=new BMap.Map("allmap"),point=new BMap.Point(116.331398,39.897445);
	map.centerAndZoom(point,12);
	var geolocation=new BMap.Geolocation;
	geolocation.getCurrentPosition(function(a){if(this.getStatus()==BMAP_STATUS_SUCCESS){var b=new BMap.Marker(a.point);map.addOverlay(b),map.panTo(a.point),alert("您的位置："+a.point.lng+","+a.point.lat)}else alert("failed"+this.getStatus())},{enableHighAccuracy:!0});
	var ac = new BMap.Autocomplete(
		{"input":"searchId",
		"location":map
	});

	ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
	//var str = "";
		var _value = e.fromitem.value;
		var value = "";
		if (e.fromitem.index > -1) {
			value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
		}    
		//str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
		
		value = "";
		if (e.toitem.index > -1) {
			_value = e.toitem.value;
			value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
		}    
		//str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
	//	G("searchResultPanel").innerHTML = str;
	});

	var myValue;
	ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
	var _value = e.item.value;
		myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
		//G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
		
		setPlace();
	});

	function setPlace(){
		map.clearOverlays();    //清除地图上所有覆盖物
		function myFun(){
			var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
			map.centerAndZoom(pp, 18);
			map.addOverlay(new BMap.Marker(pp));    //添加标注
		}
		var local = new BMap.LocalSearch(map, { //智能搜索
		  onSearchComplete: myFun
		});
		local.search(myValue);
	}
	
	function G(id){
		return document.getElementById(id);
	}
	
	function EntryPress(e){
		var e = e || window.event;
		if(e.keyCode == 13){
			var walking = new BMap.WalkingRoute(map, {renderOptions:{map:map,autoViewport:true}});
			walking.search(G("pathFrom").value,G("pathTo").value);
		}
	}