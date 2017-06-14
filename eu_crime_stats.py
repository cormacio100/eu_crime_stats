from flask import Flask
from flask import Markup
from flask import render_template
from pymongo import MongoClient
import json
import os

app = Flask(__name__)

'''
LOCAL DB SETTINGS
'''
'''
MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'projectModule2'
COLLECTION_NAME = 'eu_crime_stats'
'''

'''
HEROKU DB SETTINGS
'''
MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://heroku_0h4msgdv:9eud76jj8vm9eatsd0btcrnl2i@ds123752.mlab.com:23752/heroku_0h4msgdv')
DBS_NAME = os.getenv('MONGO_DB_NAME', 'heroku_0h4msgdv')


@app.route('/')
def home():
    heading = {}
    script = Markup('')
    return render_template('index.html',heading=heading,script=script)


@app.route('/country')
def country():
    heading = {}
    script = Markup('<script src="static/js/country_graph.js"></script>')
    return render_template('country.html',heading=heading,script=script)


@app.route('/assault')
def assault():
    heading = {'byCountry':Markup('<strong>Assaults</strong> by Country'),
               'combo':Markup('Country Comparison of <strong>Assaults</strong>'),
               'hidden':'assault'}
    script = Markup('<script src="static/js/crime_graph.js"></script>')
    return render_template('crime.html', heading=heading, script=script)


@app.route('/burglary')
def burglary():
    heading = {'byCountry':Markup('<strong>Burglaries</strong> by Country'),
               'combo':Markup('Country Comparison of <strong>Burglaries</strong>'),
               'hidden':'burglary'}
    script = Markup('<script src="static/js/crime_graph.js"></script>')
    return render_template('crime.html', heading=heading, script=script)


@app.route('/drug_offences')
def drug_offences():
    heading = {'byCountry':Markup('<strong>Drug Offences</strong> by Country'),
               'combo':Markup('Country Comparison of <strong>Drug Offences</strong>'),
               'hidden':'drugs'}
    script = Markup('<script src="static/js/crime_graph.js"></script>')
    return render_template('crime.html', heading=heading, script=script)


@app.route('/intentional_homicide')
def intentional_homicide():
    heading = {'byCountry': Markup('<strong>Intentional Homicides</strong> by Country'),
               'combo': Markup('Country Comparison of <strong>Intentional Homicide</strong>'),
               'hidden': 'intentional_homicide'}
    script = Markup('<script src="static/js/crime_graph.js"></script>')
    return render_template('crime.html', heading=heading, script=script)


@app.route('/kidnapping')
def kidnapping():
    heading = {'byCountry': Markup('<strong>Kidnappings</strong> by Country'),
               'combo': Markup('Country Comparison of <strong>Kidnappings</strong>'),
               'hidden': 'kidnapping'}
    script = Markup('<script src="static/js/crime_graph.js"></script>')
    return render_template('crime.html', heading=heading, script=script)


@app.route('/rape')
def rape():
    heading = {'byCountry': Markup('<strong>Rapes</strong> by Country'),
               'combo': Markup('Country Comparison of <strong>Rapes</strong>'),
               'hidden': 'rape'}
    script = Markup('<script src="static/js/crime_graph.js"></script>')
    return render_template('crime.html', heading=heading, script=script)


@app.route('/robbery')
def robbery():
    heading = {'byCountry': Markup('<strong>Robberies</strong> by Country'),
               'combo': Markup('Country Comparison of <strong>Robberies</strong>'),
               'hidden': 'robbery'}
    script = Markup('<script src="static/js/crime_graph.js"></script>')
    return render_template('crime.html', heading=heading, script=script)


@app.route('/sexual_assault')
def sexual_assault():
    heading = {'byCountry': Markup('<strong>Sexual Assaults</strong> by Country'),
               'combo': Markup('Country Comparison of <strong>Sexual Assaults</strong>'),
               'hidden': 'sexual_assault'}
    script = Markup('<script src="static/js/crime_graph.js"></script>')
    return render_template('crime.html', heading=heading, script=script)


@app.route('/sexual_violence')
def sexual_violence():
    heading = {'byCountry': Markup('<strong>Sexual Violence</strong> by Country'),
               'combo': Markup('Country Comparison of <strong>Sexual Violence</strong>'),
               'hidden':'sexual_violence'}
    script = Markup('<script src="static/js/crime_graph.js"></script>')
    return render_template('crime.html', heading=heading, script=script)


@app.route('/theft')
def theft():
    heading = {'byCountry': Markup('<strong>Theft</strong> by Country'),
               'combo': Markup('Country Comparison of <strong>Theft</strong>'),
               'hidden':'theft'}
    script = Markup('<script src="static/js/crime_graph.js"></script>')
    return render_template('crime.html', heading=heading, script=script)


@app.route('/charts/data')
def charts_data():
    """
        :return: data from the database
    """
    #   CONSTANT that defines the record fields that we wish to retrieve
    FIELDS = {
        '_id': False,
        'year': True,
        'eu_member_state': True,
        'assault': True,
        'burglary': True,
        'drugs': True,
        'intentional_homicide': True,
        'kidnapping': True,
        'rape': True,
        'robbery': True,
        'sexual_assault': True,
        'sexual_violence': True,
        'theft': True,
        'police_officers':True,
        'male_police_officers':True,
        'female_police_officers':True,
        'prison_personell':True,
        'male_prison_personell':True,
        'female_prison_personell':True,
        'total_prison_population':True,
        'adult_male_prisoners':True,
        'adult_female_prisoners':True,
        'juvenile_prison_population':True,
        'native_prisoners':True,
        'foreign_prisoners':True,
        'population':True
    };

    #   Open a connection to MongoDB
    #   the "with" statement auto-closes the connection when done
    with MongoClient(MONGO_URI) as conn:
        #   Define the collection to access
        collection = conn[DBS_NAME][COLLECTION_NAME]
        #   Retrieve a result set that includes the properties
        #   defined in FIELDS
        eu_crime_stats = collection.find(projection=FIELDS,limit=20000)
        #   convert the data to a list in a JSON object
        #   and RETURN the JSONS
        return json.dumps(list(eu_crime_stats))

if __name__ == '__main__':
    app.run(debug=True)
