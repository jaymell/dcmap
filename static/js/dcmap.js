queue()
    .defer(d3.json, "/donorschoose/projects")
    .defer(d3.json, "static/geojson/us-states.json")
    .await(makeGraphs);

function makeGraphs(error, projectsJson, statesJson) {

	var usChart = dc.geoChoroplethChart("#us-chart");

	usChart.width(1000)
		.height(330)
		.dimension(stateDim)
		.group(totalDonationsByState)
		.colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])
		.colorDomain([0, max_state])
		.overlayGeoJson(statesJson["features"], "state", function (d) {
			return d.properties.name;
		})
		.projection(d3.geo.albersUsa()
				.scale(600)
				// .translate([340, 150]))
				.translate([400, 200]))
		.title(function (p) {
			return "State: " + p["key"]
				 + "\n"
				 + "Total Donations: " + Math.round(p["value"]) + " $";
		})

dc.renderAll();

}
