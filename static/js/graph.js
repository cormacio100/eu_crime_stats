/**
 * Created by Cormac Liston on 11/04/2017.
 */



function print_filter(filter) {
    var f=eval(filter);
    if (typeof(f.length) != "undefined") {}else{}
    if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
    if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
    console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
}

//  RETRIEVE DATA FROM API
queue()
    .defer(d3.json,'/charts/data')
    .await(buildGraphs);

function buildGraphs(error,jsonData){
    var euCrimeStats = jsonData
    var irishCrimeStats = [];
    euCrimeStats.forEach(function(d){
        if(d.eu_member_state == "Ireland"){
           // console.log('FROM IRELAND');
            //console.log(d);
            irishCrimeStats.push(d);
        }
    });

    /*
    *   Use CROSSFILTER.js to create a CROSSFILTER instance from the DATA
    *   This will INDEX the data so that it can be FILTERED
    *   -   Crossfilters 2 way binding pipeline allows:
    *       -   DATA selections on each chart to be auto applied to other charts
    *       -   Drill down functionality is enabled
    * */
    ////////////////////////////////////////////////////////
    //  CROSSFILTER.JS SECTION
    //  DATA IS INDEXED/GROUPED

    //#######################################################
    //  1 - index the data
    //var indexedData = crossfilter(jsonData);
    var indexedData = crossfilter(irishCrimeStats);

    //#######################################################
    //  2 - CREATE DIMENSIONS FOR FILTERING THE DATA
    //  the X-AXIS
    var crimeTypesDim = indexedData.dimension(function(d){
        if(d.year=="2014"){
            if(d.category=="crime") {
                return d.type;
            }
        }
    });
    //console.log('crimeTypesDim:');
    //print_filter(crimeTypesDim);

    var justiceSystemTypesDim = indexedData.dimension(function(d){
        if(d.year=="2014"){
            if(d.category=="justice_system") {
                return d.type;
            }
        }
    });

    /*var eu_member_state_dim = indexedData.dimension(function(d){
        return d.eu_member_state;
    });

    var year_dim = indexedData.dimension(function(d){
       return d.year;
    });

    var amount_dim = indexedData.dimension(function(d){
       return d.amount;
    });*/

    //#######################################################
    //  3 - Group the DATA depending on the DIMENSION
    //      -   Calculates the METRICS
    //  The Y-AXIS

    console.log('groupAll()');
    //console.log(crimeTypesDim.groupAll().reduceSum(function(d){return d.amount;}).value());
    //console.log(indexedData.groupAll().reduceSum(function(d){return d.amount;}).value());

    //  FOR PIE CHART - BY CATEGORY
console.log(' print filter for crimeTypesDim: ');
   // print_filter(crimeTypesDim);

    var crimeTypesGroup = crimeTypesDim.group();
    console.log('crimeTypesGroup: ');
    print_filter(crimeTypesGroup.reduceSum(function(d){
        if(d.category=="crime"){
            console.log(d);
        }

        if(d.year=="2014"){
            return d.amount;
        }
    }));

    //  FOR TABLE AND LINE CHART
    var justiceSysTypesGroup = justiceSystemTypesDim.group();
    console.log('justiceSysTypesGroup GROUP: ');
    print_filter(justiceSysTypesGroup);
    /*
    var totCrimeByCountry = eu_member_state_dim.group().reduceSum(function(d){
       return d.amount;
    });
    var numCrimeByYear = eu_member_state_dim.group().reduceSum(function(d){
       return d.year;
    // });*/
    //console.log('number of categories:'+numCategories.size());

    //  #######################################################
    //  DEFINE CHART TYPES AND BIND THEM TO DIVS IN INDEX.HTML
    //  #######################################################
    var crimeTypesPieChart = dc.pieChart('#crime_types');
    var justiceSystemTypesPieChart = dc.pieChart('#justice_system_types');

    //  #######################################################
    //  BUILD THE CHARTS BY ASSIGNING PROPERTIES AND VALUES
    //  #######################################################
    crimeTypesPieChart
        .width(300)
        .radius(90)
        .innerRadius(40)
        .transitionDuration(1500)
        .dimension(crimeTypesDim)
        .group(crimeTypesGroup);

    justiceSystemTypesPieChart
        .width(300)
        .radius(90)
        .innerRadius(40)
        .transitionDuration(1500)
        .dimension(justiceSystemTypesDim)
        .group(justiceSysTypesGroup);

      var total_crimes_europe = indexedData.groupAll().reduceSum(function(d){return d.amount;}).value();
    console.log('the total amount of crimes for europe - data groupAll reduceSum() value() is '+total_crimes_europe);


    //  #######################################################
    //  RENDER THE CHARTS
    //  #######################################################
    dc.renderAll();
}