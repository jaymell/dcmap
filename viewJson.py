#!/usr/bin/python

import json
import pprint

with open('./static/geojson/countries.geojson') as f:
	data = json.load(f)

pprint.pprint(data)

