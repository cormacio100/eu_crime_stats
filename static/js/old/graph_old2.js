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

//#######################################################
//  1 - CROSSFILTER (INDEX) THE DATA
//#######################################################
function buildGraphs(error,jsonData) {
    console.log('crossFilterData');
    var euCrimeStats = jsonData
    var irishCrimeStats = [];
    euCrimeStats.forEach(function (d) {
        if (d.eu_member_state == "Ireland") {
            irishCrimeStats.push(d);
        }
    });
    var indexedData = crossfilter(irishCrimeStats);


//#######################################################
//  2 - CREATE DIMENSIONS FOR ACCESSING THE DATA
//#######################################################
    console.log('dimensionData');
    var yearDim = indexedData.dimension(function(d){return d.year;});                                   //  DIMENSION ON YEAR
    var typeDim = indexedData.dimension(function(d){return d.type;});                                   //  DIMENSION ON TYPE
    var crimeCatDim = indexedData.dimension(function(d){if(d.category=='crime'){return d.type;}});    //  DIMENSION ON TYPE FOR CRIME ONLY
    var justiceCatDim = indexedData.dimension(function(d){if(d.category=='justice_system'){return d.type;}});    //  DIMENSION ON TYPE FOR JUSTICE_SYSTEM ONLY
    var amountCrimeDim = indexedData.dimension(function(d){if(d.category=='crime'){return d.amount}});

    var minCrime = amountCrimeDim.bottom(1)[0].amount;
    var maxCrime = amountCrimeDim.top(1)[0].amount;

    console.log('minCrime: '+minCrime);
    console.log('maxCrime: '+maxCrime);

    //#######################################################
//  3 - GROUP THE DATA - AND CALCULATE TOTALS
//#######################################################
    console.log('groupData2');
    var yearGroup = yearDim.group();
    var typeOfCrimesGroup = crimeCatDim.group().reduceSum(function(d){return d.amount;});   //  return the amount value for each type of crime
    var justiceGroup = justiceCatDim.group().reduceSum(function(d){return d.amount;});// NEED TO FILTER ON THE DIAGRAM
    var amountGroup = amountCrimeDim.group()
    function only_male_female_police_officers(justiceGroup) {
        return {
            all:function () {
                return justiceGroup.all().filter(function(d) {
                    return d.key == 'male_police_officers' || d.key == 'female_police_officers';
                });
            }
        };
    }
    var filteredGardaNumbersGroup = only_male_female_police_officers(justiceGroup);

    //  #######################################################
    //  CALCULATE TOTALS
    //  #######################################################

    var all = indexedData.groupAll();
    var totalCrimes = all.reduceSum(function(d){
       //return d["total_donations"];
       // console.log('total_donations');
       // console.log(d.total_donations);
        if(d.category=='crime'){
            if (d.amount == null){
                return d.amount;
            }
            return d.amount;
        } else {
            return 0;
        }
        //return d.amount;
    });
    console.log('totalNumPolice');
    var totalNumPolice = all.reduceSum(function(d){
        if(d.category=='justice_system'){
            if (d.amount == null){
                return d.amount;
            }
            return d.amount;
        } else {
            return 0;
        }
    });


    console.log('totalCrimes');
    /*var totalCrimes = yearDim.groupAll().reduceSum(function(d){
        //console.log(d);
        if(d.category=='crime'){
            if (d.amount == null){
                return d.amount;
            }
            return d.amount;
        } else {
            return 0;
        }
    });*/
    console.log(totalCrimes.value());

    //console.log('totalCrimes');
    /*var totalCrimes2 = indexedData.groupAll().reduceSum(function(d){
        if (d.category == 'crime'){
            if (d.amount == null){
                console.log(d);
            }
            return d.amount;
        } else {
            return 0;
        }
    });*/
    //console.log('the total amount of crimes for europe - data groupAll reduceSum() value() is '+totalCrimes);
    //print_filter(totalCrimes);
    //console.log(totalCrimes2.value());

//  ###################################################################
//  4 - DEFINE CHART TYPES AND BIND THEM TO DOM OBJECTS IN INDEX.HTML
//  ###################################################################
    console.log('assignGraphs');
    var selectField = dc.selectMenu('#menu-select');
    var typeOfCrimeRowChart = dc.rowChart('#crime-type-row-chart');
    var gardaNumbersPieChart = dc.pieChart('#garda_numbers');
            // DEFINE VALUES TO BE USED IN SCALING THE DATA
       // var minCrimeAmt = amountOfCrimesDim.bottom(1)(0)['amount'];
      //  var maxCrimeAmt = amountOfCrimesDim.top(1)(0)['amount'];

    var totalCrimesND = dc.numberDisplay('#total-crimes-nd');     //  TOTAL NUMBER OF DONATIONS
    var totalNumPoliceND = dc.numberDisplay('#total-num-police-nd');     //  TOTAL DONATIONS IN USD

//  ###################################################################
//  5 - BUILD THE GRAPHS BY ASSIGNING PROPERTIES AND VALUES
//  ###################################################################
    console.log('buildGraphs');
    //  YEAR SELECTION
    selectField.dimension(yearDim)
                .group(yearGroup)
                .title(function(d){
                    return d.key;
                })
                .filter(function(d){
                    //  CREATE A FILTER BASED ON THE SELECTION
                    var value = $(this).find(':selected').val();
                    return value;
                });

    console.log('typeOfCrimesGroup.size():'+typeOfCrimesGroup.size());



    //  CRIME TYPE ROW CHART
    typeOfCrimeRowChart
        .width(800)
        .height(400)
        .x(d3.scale.linear().domain(d3.range(minCrime,maxCrime)))
           // .domain(d3.range(0,typeOfCrimesGroup.size())))
        .elasticX(true)
        .dimension(crimeCatDim)
        .group(typeOfCrimesGroup)
        .xAxis().ticks(10);

    //  GARDA MALE TO FEMALE RATIO PIE CHART
    gardaNumbersPieChart
        .width(400)
        .height(400)
        .radius(130)
        .innerRadius(40)
        .externalLabels(30)
        .transitionDuration(1500)
        .dimension(justiceCatDim)
        .group(filteredGardaNumbersGroup)
        .legend();

    //  DISPLAY TOTAL NUMBER OF CRIMES
    totalCrimesND
        .formatNumber(d3.format("d"))
        .valueAccessor(function(d){
            return d;
        })
        .group(totalCrimes);

    totalNumPoliceND
        .formatNumber(d3.format("d"))
        .valueAccessor(function(d){
            return d;
        })
        .group(totalNumPolice);

    //  #######################################################
    //  RENDER THE CHARTS
    //  #######################################################
    dc.renderAll();
}


