queue()
	.defer(d3.json, "/json")
	.defer(d3.json, "static/geojson/countries.geojson")
	.await(makeGraphs);

function makeGraphs(error, sitesJson, worldJson) {

	var topSites = sitesJson;
	var worldChart = dc.geoChoroplethChart("#world-chart")

	// crossfilter
	var ndx = crossfilter(topSites);

	// dimensions
        var countryDim = ndx.dimension(function(d) { 
		if (typeof d["ips"][0] !== 'undefined' ) {
			if (typeof d["ips"][0]["country"] !== 'undefined' ) {
				return d["ips"][0]["country"];
			}
		}});

	// metrics
	var totalIpsByCountry = countryDim.group().reduceCount(function(d) {
                if (typeof d["ips"][0] !== 'undefined' ) {
                        if (typeof d["ips"][0]["country"] !== 'undefined' ) {
                                return d["ips"][0]["country"];
                        }
                }});

	var max_country = totalIpsByCountry.top(1)[0].value;
	//var height = 800;
	//var width = 1600;

	var height = 800;
	var width = 1600;

	var projection = d3.geo.equirectangular()
                        .scale(200)
                        .center([-97,33]);

	function zoomed() {
	    projection 
	    .translate(d3.event.translate)
	    .scale(d3.event.scale);
	    worldChart.render();
	}

	var zoom = d3.behavior.zoom()
		.translate(projection.translate())
		//.scale(projection.scale())
		.scale(1 << 8) // not sure why, but 8 seems like a good number
		//.scaleExtent([height/2, 8 * height]) // defines the max amount you can zoom
		.on("zoom", zoomed);

	var svg = d3.select("#world-chart")
	    .attr("width", width)
	    .attr("height", height)
	    .call(zoom);

	worldChart
		.height(height)
		.width(width)
		.dimension(countryDim)
		.group(totalIpsByCountry)
		.colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])
		//.colorDomain([0, max_country])
		.colorDomain([0, 10])
		.colorCalculator(function (d) { return d ? worldChart.colors()(d) : '#ccc';})
		.overlayGeoJson(worldJson["features"], "country", function (d) {
			return d.properties.iso_a3;
		})
		.projection(projection)
		.title(function (d) {
			var country = d.key;
			var total = d.value ? d.value : 0;
			return "Country: " + country
				 + "\n"
				 + "Total Sites: " + total + " Sites";
		})

dc.renderAll();

}
