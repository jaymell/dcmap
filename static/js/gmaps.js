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

var Map = {
	build: function() {
		var locale = new google.maps.LatLng(33,-97);
		var mapOptions = {
			center: locale,
			zoom: 2,
		};
		Map.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		Map.addTopSites()
		
	},
	addMarker: function(lat, lon, title) {
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(lat, lon),
			title: title,
		});
		marker.setMap(Map.map);
	},
	addTopSites: function() {
		// the following sucks:
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
					if ( latitude && longitude ) {
						Map.addMarker(latitude, longitude, site); 	
					}
				}
			}
		}
	}
};
				

detectBrowser();
google.maps.event.addDomListener(window, 'load', Map.build);

