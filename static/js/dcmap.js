queue()
	.defer(d3.json, "/json/country")
	.defer(d3.json, "static/geojson/countries.geojson")
	.await(makeGraphs);

function makeGraphs(error, sitesJson, worldJson) {

	/* Fill in the missing shit */

	var topSites = sitesJson;
	var worldChart = dc.geoChoroplethChart("#world-chart");
	worldChart.width(1000)
		.height(330)
		.dimension(stateDim)
		.group(totalDonationsByState)
		.colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])
		.colorDomain([0, max_state])
		.overlayGeoJson(WorldJson["features"], "state", function (d) {
			return d.properties.name;
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
