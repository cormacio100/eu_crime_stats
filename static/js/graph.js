/**
 * Created by Cormac Liston on 11/04/2017.
 */

//  RETRIEVE DATA FROM API
queue()
    .defer(d3.json,'/charts/data')
    .await(buildGraphs);

function buildGraphs(error,jsonData){
    var eu_crime_stats = jsonData

    eu_crime_stats.forEach(function(d){
       console.log(d);
    });
}