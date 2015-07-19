queue()
	.defer(d3.json, "/json")
	.defer(d3.json, "static/geojson/countries.geojson")
	.await(makeGraphs);

function makeGraphs(error, sitesJson, worldJson) {

	/* Fill in the missing shit */

	var topSites = sitesJson;
	var worldChart = dc.geoChoroplethChart("#world-chart");

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
	var height = 800;
	var width = 1600;
	worldChart
		.height(800)
		.width(1200)
		.dimension(countryDim)
		.group(totalIpsByCountry)
		.colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])
		//.colorDomain([0, max_country])
		.colorDomain([0, 10])
		.colorCalculator(function (d) { return d ? worldChart.colors()(d) : '#ccc';})
		.overlayGeoJson(worldJson["features"], "country", function (d) {
			return d.properties.iso_a3;
		})
		
		//.projection(d3.geo.conicEquidistant()
		/* prefer this projection, but for some reason, all other variables held constant,
			draws most countries same color as ocean... not sure why:
		.projection(d3.geo.mercator()
		*/
		.projection(d3.geo.equirectangular())
		.title(function (d) {
			var country = d.key;
			var total = d.value ? d.value : 0;
			return "Country: " + country
				 + "\n"
				 + "Total Sites: " + total + " Sites";
		})
dc.renderAll();

}
