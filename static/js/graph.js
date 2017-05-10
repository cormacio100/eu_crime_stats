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
//##################################################
//  RETRIEVE DATA FROM API
//##################################################
queue()
    .defer(d3.json,'/charts/data')
    .await(buildGraphs);

function buildGraphs(error,jsonData){
    var euCrimeStats = jsonData
    var irishCrimeStats = [];
    euCrimeStats.forEach(function(d){
        if(d.eu_member_state == "Ireland") {
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
    //  1 - INDEX THE DATA
    //#######################################################
    var indexedData = crossfilter(irishCrimeStats);
    var indexedEuroData = crossfilter(euCrimeStats);
    //#######################################################
    //  2 - CREATE DIMENSIONS FOR ACCESSING THE DATA
    //#######################################################
    // DIMENSION ON YEAR
    var yearDim = indexedData.dimension(function(d){
       return d.year;
    });
    //  DIMENSION ON TYPE FOR CRIME ONLY
    var crimeCatDim = indexedData.dimension(function(d){
        if(d.category=='crime') {
            return d.type;
        }
    });
    //  DIMENSION ON TYPE FOR JUSTICE_SYSTEM ONLY
    var justiceCatDim = indexedData.dimension(function(d){
        if(d.category=='justice_system') {
            return d.type;
        }
    });
    var typeDim = indexedData.dimension(function(d){
        return d.type;
    });

    //#######################################################
    //  3 - Group the DATA depending on the DIMENSION
    //      -   Calculates the METRICS
    //  The Y-AXIS
    //  GROUP
    //#######################################################
    var yearGroup = yearDim.group();
    var typeOfCrimesGroup = crimeCatDim.group().reduceSum(function(d){
        return d.amount;    //  return the amount value for each type of crime
    });

    console.log('typeOfCrimesGroup'+typeOfCrimesGroup.size());
    print_filter(typeOfCrimesGroup);
    var gardaNumbersGroup = justiceCatDim.group().reduceSum(function(d) {
            return d.amount;
            // NEED TO FILTER ON THE DIAGRAM
        });

    console.log('gardaNumbersGroup'+gardaNumbersGroup.size());
    print_filter(gardaNumbersGroup);

    //console.log('male_police_officers');
   // print_filter(justiceCatDim.filterExact('male_police_officers'));


    //  #######################################################
    //  CALCULATE TOTALS
    //  #######################################################
    var totalCrimes = indexedData.groupAll().reduceSum(function(d){return d.amount;}).value();
    console.log('the total amount of crimes for europe - data groupAll reduceSum() value() is '+totalCrimes);


    //  #######################################################
    //  DEFINE CHART TYPES AND BIND THEM TO DIVS IN INDEX.HTML
    //  #######################################################
    var selectField = dc.selectMenu('#menu-select');
    var typeOfCrimeRowChart = dc.rowChart('#crime-type-row-chart');
        // DEFINE VALUES TO BE USED IN SCALING THE DATA
       // var minCrimeAmt = amountOfCrimesDim.bottom(1)(0)['amount'];
      //  var maxCrimeAmt = amountOfCrimesDim.top(1)(0)['amount'];
    var gardaNumbersPieChart = dc.pieChart('#garda_numbers');
    //var totalCrimesND = dc.numberDisplay('#total-crimes-nd');
    var crimeTypesPieChart = dc.pieChart('#crime_types');
    //var justiceSystemTypesPieChart = dc.rowChart('#justice_system_types');

console.log('filter');
//print_filter(typeDim.filterExact('male_police_officers'));

    //  #######################################################
    //  BUILD THE CHARTS BY ASSIGNING PROPERTIES AND VALUES
    //  #######################################################
    //  CREATE A FILTER BASED ON THE SELECTION
    selectField.dimension(yearDim)
                .group(yearGroup)
                .title(function(d){
                    return d.key;
                })
                .filter(function(d){
                    var value = $(this).find(':selected').val();
                    return value;
                });


    //  ROW CHART
    typeOfCrimeRowChart
        .width(800)
        .height(200)
        .x(d3.scale.linear().domain([0,50]))
        .elasticX(true)
        .dimension(crimeCatDim)
        .group(typeOfCrimesGroup)
        .xAxis().ticks(10);

    //  FORMAT Numbers to be displayed in numberDisplay
    /*totalCrimesND
        .formatNumber(d3.format("d"))
        .valueAccessor(function(d){
            return d;
        })
        .group(totalCrimes)
        .formatNumber(d3.format(".3s"));*/

    crimeTypesPieChart
        .width(400)
        .height(400)
        .radius(130)
        .innerRadius(40)
        .externalLabels(30)
        .transitionDuration(1500)
        .dimension(crimeCatDim)
        .group(typeOfCrimesGroup)
        .legend();

    gardaNumbersPieChart
        .width(400)
        .height(400)
        .radius(130)
        .innerRadius(40)
        .externalLabels(30)
        .transitionDuration(1500)
        .dimension(typeDim)/*.filterFunction(function(d){
            if(d.indexOf('male_police_officers')!=-1 ){
                return d;
            }
            if(d.indexOf('female_police_officers')!=-1 ){
                return d;
            }
        }))*/
        .group(gardaNumbersGroup)
        .legend();

    /*justiceSystemTypesPieChart
        .width(300)
        .radius(90)
        .innerRadius(40)
        .transitionDuration(1500)
        .dimension(justiceSystemTypesDim)
        .group(justiceSysTypesGroup);

    justiceSystemTypesPieChart
        .width(400)
        .height(400)
        .x(d3.scale.linear().domain([0,50]))
        .elasticX(true)
        .dimension(justiceSystemTypesDim)
        .group(justiceSysTypesGroup.reduceSum(function(d){
            return d.amount;    //  return the amount value for each type of crime
        }))
        .xAxis().ticks(10);*/



    //  #######################################################
    //  RENDER THE CHARTS
    //  #######################################################
    dc.renderAll();
}