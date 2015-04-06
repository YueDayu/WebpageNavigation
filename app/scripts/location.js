var geolocation = new BMap.Geolocation();
geolocation.getCurrentPosition(function(r){
	if(this.getStatus() == BMAP_STATUS_SUCCESS){
		var mk = new BMap.Marker(r.point);
		map.addOverlay(mk);
		map.panTo(r.point);
		alert('您的位置：'+r.point.lng+','+r.point.lat);
	}
	else {
		alert('failed'+this.getStatus());
	}        
},{enableHighAccuracy: true})