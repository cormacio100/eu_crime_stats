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
        if(d.eu_member_state == "Ireland") {
            //if (d.type !== "theft") {
                //if (d.type !== "sexual_violence") {
                    irishCrimeStats.push(d);
                //}
            //}
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
    //  2 - CREATE DIMENSIONS FOR ACCESSING THE DATA
    //  SELECT MENU
    var yearDim = indexedData.dimension(function(d){
       return d.year;
    });
    //  HORIZONTAL BAR CHART
    var amountOfCrimesDim = indexedData.dimension(function(d){
        if(d.category=="crime") {
            return d.type;
        }
    });
    //  PIE CHART
    var crimeTypesDim = indexedData.dimension(function(d){
        if(d.category=="crime") {
            return d.type;
        }
    });
    //  PIE CHART
    var justiceSystemTypesDim = indexedData.dimension(function(d){
        if(d.category=="justice_system") {
            return d.type;
        }
    });


    //#######################################################
    //  BAR CHART
    //#######################################################




    //#######################################################
    //  3 - Group the DATA depending on the DIMENSION
    //      -   Calculates the METRICS
    //  The Y-AXIS
    //  GROUP
    var yearGroup = yearDim.group();

    var amountOfCrimesGroup = amountOfCrimesDim.group().reduceSum(function(d){
        return d.amount;
    });

    //  FOR PIE CHART - BY CATEGORY
    var crimeTypesGroup = crimeTypesDim.group().reduceSum(function(d){
       if(d.category=="crime"){

               return d.amount;
       }
    });

    //  FOR TABLE AND LINE CHART
    var justiceSysTypesGroup = justiceSystemTypesDim.group();

    //  #######################################################
    //  CALCULATE TOTALS
    //  #######################################################
    var totalCrimes = indexedData.groupAll().reduceSum(function(d){return d.amount;}).value();
    console.log('the total amount of crimes for europe - data groupAll reduceSum() value() is '+totalCrimes);

    //  #######################################################
    //  DEFINE CHART TYPES AND BIND THEM TO DIVS IN INDEX.HTML
    //  #######################################################
    var selectField = dc.selectMenu('#menu-select');
   //     console.log('amountOfCrimesGroup:');
    //print_filter(amountOfCrimesGroup);

    var amountOfCrimeRowChart = dc.rowChart('#crime-level-row-chart');
        // DEFINE VALUES TO BE USED IN SCALING THE DATA
       // var minCrimeAmt = amountOfCrimesDim.bottom(1)(0)['amount'];
      //  var maxCrimeAmt = amountOfCrimesDim.top(1)(0)['amount'];

    console.log('amountOfCrimesGroup');
    print_filter(amountOfCrimesGroup);




    //var totalCrimesND = dc.numberDisplay('#total-crimes-nd');
    var crimeTypesPieChart = dc.pieChart('#crime_types');
    var justiceSystemTypesPieChart = dc.pieChart('#justice_system_types');



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
    amountOfCrimeRowChart
        .width(600)
        .height(400)
        .x(d3.scale.linear().domain([0,50]))
        .elasticX(true)
        .dimension(amountOfCrimesDim)
        .group(amountOfCrimesGroup)
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
        .dimension(crimeTypesDim)
        .group(crimeTypesGroup)
        .legend();



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