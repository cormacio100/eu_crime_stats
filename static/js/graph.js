/**
 * Created by Cormac Liston on 11/04/2017.
 */

function print_filter(filter) {
    var f=eval(filter);
    console.log(JSON.stringify(f));
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

    var yearDim = indexedData.dimension(function(d){
       return d.year;
    });



    var crimeTypesDim = indexedData.dimension(function(d){
        if(d.category=="crime") {
            return d.type;
        }
    });

    var justiceSystemTypesDim = indexedData.dimension(function(d){
        if(d.category=="justice_system") {
            return d.type;
        }
    });

    //#######################################################
    //  3 - Group the DATA depending on the DIMENSION
    //      -   Calculates the METRICS
    //  The Y-AXIS
    var yearGroup = yearDim.group();

    console.log('Year Group');


    //  FOR PIE CHART - BY CATEGORY
    var crimeTypesGroup = crimeTypesDim.group().reduceSum(function(d){
       if(d.category=="crime"){
       //    if(d.year="2014"){
               console.log(d);
               return d.amount;
         //  }
       }
    });
    console.log(' print filter for crimeTypesDim: ');
    print_filter(crimeTypesGroup);

    //  FOR TABLE AND LINE CHART
    var justiceSysTypesGroup = justiceSystemTypesDim.group();
    console.log('justiceSysTypesGroup GROUP: ');
    print_filter(justiceSysTypesGroup);

    //  #######################################################
    //  CALCULATE TOTALS
    //  #######################################################
    var totalCrimes = indexedData.groupAll().reduceSum(function(d){return d.amount;}).value();
    console.log('the total amount of crimes for europe - data groupAll reduceSum() value() is '+totalCrimes);

    //  #######################################################
    //  DEFINE CHART TYPES AND BIND THEM TO DIVS IN INDEX.HTML
    //  #######################################################
    var crimeTypesPieChart = dc.pieChart('#crime_types');
    var justiceSystemTypesPieChart = dc.pieChart('#justice_system_types');
    //var totalCrimesND = dc.numberDisplay('#total-crimes-nd');     //  TOTAL NUMBER OF CRIMES

    //  #######################################################
    //  BUILD THE CHARTS BY ASSIGNING PROPERTIES AND VALUES
    //  #######################################################
    //  build the SELECT MENU
    selectField = dc.selectMenu('#menu-select')
                    .dimension(yearDim)
                    .group(yearGroup);

    //  FORMAT Numbers to be displayed in numberDisplay
    /*totalCrimesND
        .formatNumber(d3.format("d"))
        .valueAccessor(function(d){
            return d;
        })
        .group(totalCrimes)
        .formatNumber(d3.format(".3s"));*/

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

    //  #######################################################
    //  RENDER THE CHARTS
    //  #######################################################
    dc.renderAll();
}