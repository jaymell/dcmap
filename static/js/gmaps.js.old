function detectBrowser() {
	var useragent = navigator.userAgent;
	var mapdiv = document.getElementById("map-canvas");

	if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
		mapdiv.style.width = '100%';
		mapdiv.style.height = '100%';
	} /*else {
		mapdiv.style.width = '600px';
		mapdiv.style.height = '800px';
	}*/
}
function initialize() {
	var mapOptions = {
		// center: new google.maps.LatLng(33, -97),
		center: new google.maps.LatLng(0,0),
		zoom:2,
	};
	var map = new google.maps.Map(document.getElementById('map-canvas'),
	    mapOptions);
	/*
	// put marker on center of map:
	var marker = new google.maps.Marker({
		position: map.getCenter(),
		map: map,
		title: 'Click to zoom'
	});
	// zoom to marker when clicked:
	google.maps.event.addListener(marker, 'click', function() {
		map.setZoom(8);
		map.setCenter(marker.getPosition());
	});
	*/

	var xhReq = new XMLHttpRequest();
	var url = '/json';
	xhReq.open("GET", url, false);
	xhReq.send(null);
	var json = JSON.parse(xhReq.responseText);
	console.log(json);
	for( i = 0; i < json.length; i++ ) {
		for ( site in json[i] ) {
			console.log('site: ',site);
			for ( ip in json[i][site] ) {
				console.log('ip: ',ip);
				var latitude = json[i][site][ip]['latitude'];
				var longitude = json[i][site][ip]['longitude'];
				var locale = new google.maps.LatLng(latitude, longitude);

				if ( latitude && longitude ) {
					var marker = new google.maps.Marker({
						position: locale,
						title: site,
					});
					console.log(typeof(latitude), typeof(longitude));
					// console.log(marker);
					marker.setMap(map);
				}
			}
		}
	}
	/* Instead of using zoom, you can explicitly define the bounds
 		of the map view:
	var southWest = new google.maps.LatLng(-61.203405, 125.244141);
	var northEast = new google.maps.LatLng(-25.363882, 131.044922);
	var bounds = new google.maps.LatLngBounds(southWest, northEast);
	map.fitBounds(bounds);
	*/
}

google.maps.event.addDomListener(window, 'load', initialize);
detectBrowser();
