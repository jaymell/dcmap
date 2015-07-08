from flask import Flask
from flask import render_template
from pymongo import MongoClient
from bson import json_util
from bson.json_util import dumps
import json
import pycountry 

app = Flask(__name__)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DB_NAME = 'top_sites'
COLLECTION_NAME = 'sites'
connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
collection = connection[DB_NAME][COLLECTION_NAME]

@app.route("/")
def index():
	return render_template("index.html")

@app.route("/json")
def get_json():
	sites = [ i for i in collection.find({}, {'_id': False}) ]
	sites = json.dumps(sites, default=json_util.default)
	return sites
	
def _print_address():
        sites = [ i for i in collection.find({}, {'_id': False}) ]
        codes = []
        for site_dict in sites:
                #print('site_dict: ', site_dict)
                for site, data in site_dict.items():
                        #print('site: ',site,'data: ',data)
                        for ip, ip_data in data.items():
                                #print('ip: ',ip, 'ip_data: ',ip_data)
                                try:
                                        # make uppercase:
                                        print(ip_data['address'])
                                except Exception as e:
					pass
                                       #print('THREE LETTER! %s' % three_letter)

def _get_country():
	""" run as needed to get whois addies converted to 3-letter countries """	

        new_collection = connection[DB_NAME]['sites_country']

	sites = [ i for i in collection.find({}, {'_id': False}) ]
	codes = []
	for site_dict in sites:
		print('site_dict: ', site_dict)
		for site, data in site_dict.items():
			print('site: ',site,'data: ',data)
			for ip, ip_data in data.items():
				print('ip: ',ip, 'ip_data: ',ip_data)
				try:
					# make uppercase:
					two_letter = ip_data['address'].split()[-1].upper()
				except Exception as e:
					print('FAILED: ',e,ip_data['address'])
				else:
					country = pycountry.countries.get(alpha2=two_letter)
					three_letter = country.alpha3
					site_dict[site][ip]['country'] =  three_letter
					#print('THREE LETTER! %s' % three_letter)
		new_collection.insert_one(site_dict)
		
@app.route("/json/country")
def get_json_country():
	""" convert json from coords to country name """

	collection = connection[DB_NAME]['sites_country']
	sites = [ i for i in collection.find({}, {'_id': False}) ]
	sites = json.dumps(sites, default=json_util.default)
	return sites

@app.route("/test")
def test():
        return render_template("test.html")

if __name__ == "__main__":
	app.run(host='0.0.0.0',port=5000,debug=True)


""" get raw address data from sites json:
from app import *
import json
a = json.loads(get_json())
for site_dict in a:
        for site, data in site_dict.items():
                for ip, ip_data in data.items():
                        try:
                                print ip_data['address'].split()[-1]
                        except:
                                pass

"""
