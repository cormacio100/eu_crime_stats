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
    return render_template('index.html')


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
    heading = {'byCountry':'Number of Dug Offences By Country',
               'combo':'Comparison Between Countries for Number of Drug Offences'}
    script = Markup('<script src="static/js/drug_offences_graph.js"></script>')
    return render_template('charts.html',heading=heading,script=script)


@app.route('/intentional_homicide')
def intentional_homicide():
    return render_template('intentional_homicide.html')


@app.route('/kidnapping')
def kidnapping():
    return render_template('kidnapping.html')


@app.route('/rape')
def rape():
    return render_template('rape.html')


@app.route('/robbery')
def robbery():
    return render_template('robbery.html')


@app.route('/sexual_assault')
def sexual_assault():
    return render_template('sexual_assault.html')


@app.route('/sexual_violence')
def sexual_violence():
    return render_template('sexual_violence.html')


@app.route('/theft')
def theft():
    return render_template('theft.html')


@app.route('/charts')
def charts():
    return render_template('charts_old2.html')


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
