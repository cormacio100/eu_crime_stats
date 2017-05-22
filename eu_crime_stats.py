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
MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'projectModule2'
COLLECTION_NAME = 'eu_crime_stats'
#COLLECTION_NAME = 'eu_crime_stats'
#COLLECTION_NAME = 'irish_crime_stats'


@app.route('/')
def home():
    heading = {}
    script = Markup('<script src="static/js/country_graph.js"></script>')
    return render_template('index.html',heading=heading,script=script)

@app.route('/assault')
def assault():
    heading = {'byCountry':'Number of Assaults By Country',
               'combo':'Comparison Between Countries for Number of Assaults'}
    script = Markup('<script src="static/js/assault_graph.js"></script>')
    return render_template('charts.html',heading=heading,script=script)


@app.route('/burglary')
def burglary():
    heading = {'byCountry':'Number of Burglaries By Country',
               'combo':'Comparison Between Countries for Number of Burglaries'}
    script = Markup('<script src="static/js/burglary_graph.js"></script>')
    return render_template('charts.html',heading=heading,script=script)


@app.route('/drug_offences')
def drug_offences():
    heading = {'byCountry':'Number of Drug Offences By Country',
               'combo':'Comparison Between Countries for Number of Drug Offences'}
    script = Markup('<script src="static/js/drug_offences_graph.js"></script>')
    return render_template('charts.html',heading=heading,script=script)


@app.route('/intentional_homicide')
def intentional_homicide():
    heading = {'byCountry': 'Number of Intentional Homicides By Country',
               'combo': 'Comparison Between Countries for Number of Intentional Homicide'}
    script = Markup('<script src="static/js/intentional_homicide_graph.js"></script>')
    return render_template('charts.html', heading=heading, script=script)


@app.route('/kidnapping')
def kidnapping():
    heading = {'byCountry': 'Number of Kidnappings By Country',
               'combo': 'Comparison Between Countries for Number of Kidnappings'}
    script = Markup('<script src="static/js/kidnapping_graph.js"></script>')
    return render_template('charts.html', heading=heading, script=script)


@app.route('/rape')
def rape():
    heading = {'byCountry': 'Number of Rapes By Country',
               'combo': 'Comparison Between Countries for Number of Rapes'}
    script = Markup('<script src="static/js/rape_graph.js"></script>')
    return render_template('charts.html', heading=heading, script=script)


@app.route('/robbery')
def robbery():
    heading = {'byCountry': 'Number of Robberies By Country',
               'combo': 'Comparison Between Countries for Number of Robberies'}
    script = Markup('<script src="static/js/robbery_graph.js"></script>')
    return render_template('charts.html', heading=heading, script=script)


@app.route('/sexual_assault')
def sexual_assault():
    heading = {'byCountry': 'Number of Sexual Assaults By Country',
               'combo': 'Comparison Between Countries for Number of Sexual Assaults'}
    script = Markup('<script src="static/js/sexual_assault_graph.js"></script>')
    return render_template('charts.html', heading=heading, script=script)


@app.route('/sexual_violence')
def sexual_violence():
    heading = {'byCountry': 'Amount of Sexual Violence By Country',
               'combo': 'Comparison Between Countries for Amount of Sexual Violence'}
    script = Markup('<script src="static/js/sexual_violence_graph.js"></script>')
    return render_template('charts.html', heading=heading, script=script)


@app.route('/theft')
def theft():
    heading = {'byCountry': 'Amount of Theft By Country',
               'combo': 'Comparison Between Countries for Amount of Theft'}
    script = Markup('<script src="static/js/theft_graph.js"></script>')
    return render_template('charts.html', heading=heading, script=script)

'''
@app.route('/country')
def ireland():
    heading = {}
    script = Markup('<script src="static/js/country_graph.js"></script>')
    return render_template('country.html',heading=heading,script=script)
'''
'''
@app.route('/charts')
def charts():
    return render_template('charts_old2.html')
'''

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
        'foreign_prisoners':True
    };

    #   Open a connection to MongoDB
    #   the "with" statement auto-closes the connection when done
    with MongoClient(MONGODB_HOST,MONGODB_PORT) as conn:
        #   Define the collection to access
        collection = conn[DBS_NAME][COLLECTION_NAME]
        #   Retrieve a result set that includes the properties
        #   defined in FIELDS
        eu_crime_stats = collection.find(projection=FIELDS,limit=50000)
        #   convert the data to a list in a JSON object
        #   and RETURN the JSONS
        return json.dumps(list(eu_crime_stats))

if __name__ == '__main__':
    app.run(debug=True)
