from flask import Flask
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


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/charts')
def charts():
    return render_template('charts.html')


@app.route('/charts/data')
def charts_data():
    """
        :return: data from the database
    """
    #   CONSTANT that defines the record fields that we wish to retrieve
    FIELDS = {
        '_id': False,
        'category':True,
        'eu_member_state': True,
        'year': True,
        'amount': True
    }

    #   Open a connection to MongoDB
    #   the "with" statement auto-closes the connection when done
    with MongoClient(MONGODB_HOST,MONGODB_PORT) as conn:
        #   Define the collection to access
        collection = conn[DBS_NAME][COLLECTION_NAME]
        #   Retrieve a result set that includes the properties
        #   defined in FIELDS
        eu_crime_stats = collection.find(projection=FIELDS,limit=1000)
        #   convert the data to a list in a JSON object
        #   and RETURN the JSONS
        return json.dumps(list(eu_crime_stats))

if __name__ == '__main__':
    app.run(debug=True)