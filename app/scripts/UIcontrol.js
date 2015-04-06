//TODO:
function Search(id){
	//下拉列表
	var acSearch = new BMap.Autocomplete({
		"input":id, //to do..:to replace tmpId with your input ID
		"location":map
	});
	//鼠标放在下拉列表上，高亮事件
	acSearch.addEventListener("onhighlight", function(e){
		var _value = e.fromitem.value;
		var value = "";
		if(e.fromitem.index > -1)
			value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
		value = "";
		if(e.toitem.index > -1){
			_value = e.toitem.value;
			value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
		}
	});
	//鼠标点击下拉列表后的事件
	var searchValue;
	acSearch.addEventListener("onconfirm", function(e){
		var _value = e.item.value;
		searchValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
		setPlace();
	});

	function setPlace(){
		map.clearOverlays();
		function myFun(){
			var p_ = local.getResults().getPoi(0).point;
			map.centerAndZoom(p_,18);
			map.addOverlay(new BMap.Marker(p_));
		}
		var local = new BMap.LocalSearch(map,{
			onSearchComplete: myFun
		});
		local.search(searchValue);
	}	
}

