#   Project Name:

Crime and Justice Statistics for the EU

#   The Purpose of the Project:

I have obtained a dataset from the Central Statistics Office of Ireland ( http://www.cso.ie ) which describes the levels of crime by type
for each country within the EU.
For the purpose of this project I have focused on the smaller countries with populations of less than 10 million people.
The reason for this is that it would not make sense to compare the crime statistics of the smaller countries against the bigger countries.
E.G. Northern Ireland Vs Germany

The dataset also contains details on the criminal justice system for each country such as Policing and Prison Population etc

The data range is between the years 2008 and 2014

#   Technologies Used:

Python (Flask),
MongoDB,
D3.js,
DC.js,
Crossfilter.js,
JQuery,
BootStrap,
CSS3,
HTML5

#   Installation

1.   Clone the REPO to local `git clone https://github.com/cormacio100/eu_crime_stats.git`
2.   Import the eu_crime_stats.json file from the db folder into a MongoDB collection based on the below settings

        MONGODB_HOST = 'localhost'
        MONGODB_PORT = 27017
        DBS_NAME = 'projectModule2'
        COLLECTION_NAME = 'eu_crime_stats'

3.   Run the project through program Pycharm and then access the site through a browser at address http://127.0.0.1:5000/

#   Code Testing and Validation

HTML    -   https://validator.w3.org/
CSS     -   https://jigsaw.w3.org/css-validator/

#   Credits

Central Statistics Office of Ireland

#   TO DO

Statistics for countries with population of greater than 10 Million people
