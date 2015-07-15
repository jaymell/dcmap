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
        var countryDim = ndx.dimension(function(d) { return d["school_state"]; });

	// metrics
	var totalIpsByCountry = countryDim.group().reduceCount(function(d) {
		if (typeof d["ips"][0]["country"] !== 'undefined' ) {
			return d["ips"][0]["country"];
		}
        });

	var max_country = totalIpsByCountry.top(1)[0].value;

	//var worldDim = ndx.dimension(function(d) { return d['
	worldChart.width(1000)
		.height(330)
		.dimension(countryDim)
		.group(totalIpsByCountry)
		.colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])
		.colorDomain([0, max_country])
		.overlayGeoJson(worldJson["features"], "country", function (d) {
			if (d.properties.featurecla == "Admin-0 country") {
				return d.properties.sov_a3;
			}
		})
		.projection(d3.geo.conicEquidistant()
				.scale(600)
				// .translate([340, 150]))
				//.translate([400, 200]))
		/*.title(function (p) {
			return "State: " + p["key"]
				 + "\n"
				 + "Total Donations: " + Math.round(p["value"]) + " $";
		}*/)

dc.renderAll();

}
