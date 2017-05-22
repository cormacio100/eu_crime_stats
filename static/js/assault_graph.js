/**
 * Created by Cormac Liston on 12/05/2017.
 *
 * GRAPHS are assigned GLOBALLY to DOM objects in graph.js
 *
 */

//  RETRIEVE DATA FROM API
queue()
    .defer(d3.json,'/charts/data')
    .await(buildGraphs);

function buildGraphs(error,jsonData){

    var euCrimeStats = jsonData;

    //  FORMATS for NUMBERS and DATES
    var parseDate = d3.time.format('%d/%m/%Y').parse;
    var numberFormat = d3.format('.0f');

    // loop through the data
    euCrimeStats.forEach(function(d){
        d.date = parseDate('01/01/'+d.year);
        d.totalCrimes = d.assault+d.burglary+d.drugs+d.intentional_homicide+d.kidnapping+d.rape+d.robbery+d.sexual_assault+d.sexual_violence+d.theft;
    });

    //  CROSSFILTER the data
    var indexedData = crossfilter(euCrimeStats);

    /////////////////////////////////////////////////////////
    //  PIE CHART
    /////////////////////////////////////////////////////////
    var yearDim = indexedData.dimension(function(d){
       return +d.year;
    });
    var yearlyTotal = yearDim.group().reduceSum(function(d){
       return d.totalCrimes;
    });
    yearPieChart
        .width(250)
        .height(250)
        .slicesCap(10)
        .innerRadius(20)
        .dimension(yearDim)
        .group(yearlyTotal);
    yearPieChart2
        .width(250)
        .height(250)
        .slicesCap(10)
        .innerRadius(20)
        .dimension(yearDim)
        .group(yearlyTotal);
        //.colors(["#a60000","#ff0000", "#ff4040","#ff7373","#67e667","#39e639","#00cc00"]);

    /////////////////////////////////////////////////////////
    //  LINE CHART
    // X - AXIS is date
    // Y - AXIS is number of Assaults for the country
    /////////////////////////////////////////////////////////
    var dateDim = indexedData.dimension(function(d){return d.date});
    var minDate = dateDim.bottom(1)[0].date;
    var maxDate = dateDim.top(1)[0].date;

    var irelandAssaultGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Ireland'){
            return d.assault;
        }else{
            return 0;
        }
    });
    var englandAssaultGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='England'){
            console.log(d);
            return d.assault;
        }else{
            return 0;
        }
    });
    var scotlandAssaultGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Scotland'){
            return d.assault;
        }else{
            return 0;
        }
    });
    var walesAssaultGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Wales'){
            return d.assault;
        }else{
            return 0;
        }
    });
    var northernIrelandAssaultGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Northern Ireland'){
            return d.assault;
        }else{
            return 0;
        }
    });
    var restOfUKAssaultGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Northern Ireland' || d.eu_member_state=='Wales' || d.eu_member_state=='Scotland' ){
            return d.assault;
        }else{
            return 0;
        }
    });

    crimeLineChartIreland
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(irelandAssaultGrp,"Ireland")
        //.dashStyle([1,1])
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('Assaults')
        .xAxisLabel('Year')
        .colors(irelandColor);

    crimeLineChartEngland
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(englandAssaultGrp,"England")
        .margins({top: 10, right: 50, bottom: 30, left: 40})
        //.dashStyle([2,2])
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('Assaults')
        .xAxisLabel('Year')
        .colors(englandColor);

    crimeLineChartScotland
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(scotlandAssaultGrp,"Scotland")
        //.dashStyle([3,3])
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('Assaults')
        .xAxisLabel('Year')
        .colors(scotlandColor);

    crimeLineChartWales
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(walesAssaultGrp,"Wales")
        //.dashStyle([4,4])
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('Assaults')
        .xAxisLabel('Year')
        .colors(walesColor);

    crimeLineChartNorthernIreland
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(northernIrelandAssaultGrp,"Northern Ireland")
        //.dashStyle([5,5])
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('Assaults')
        .xAxisLabel('Year')
        .colors(northernIrelandColor);

    crimeLineChartRestOfUk
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(restOfUKAssaultGrp,"Scotland,Wales,N.I.")
        //.dashStyle([5,5])
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('Assaults')
        .xAxisLabel('Year')
        .colors(restOfUkColor);

    countriesLineChart
        .width(svgWidth)
        .height(svgHeight)
        .x(d3.time.scale().domain([minDate,maxDate]))
        //.yAxisLabel(dc.legend().x(400).y(120).itemHeight(13).gap(5))
        .yAxisLabel('Assaults')
        .xAxisLabel('Year')
        .legend(dc.legend().x(650).y(120).itemHeight(13).gap(5))
        .renderHorizontalGridLines(true)
        .compose([
            dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                //.renderArea(true)
                .colors(irelandColor)
                .group(irelandAssaultGrp,"Ireland"),
                //.dashStyle([1,1]),
            /*dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                //.renderArea(true)
                .colors('#E1FF74')
                .group(englandAssaultGrp,"England"),
                //.dashStyle([2,2]),*/
            dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                //.renderArea(true)
                .colors(scotlandColor)
                .group(scotlandAssaultGrp,"Scotland"),
                //.dashStyle([3,3]),
            dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                //.renderArea(true)
                .colors(walesColor)
                .group(walesAssaultGrp,"Wales"),
                //.dashStyle([4,4]),
            dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                //.renderArea(true)
                .colors(northernIrelandColor)
                .group(northernIrelandAssaultGrp,"Northern Ireland")
                //.dashStyle([5,5]),
            /*dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                //.renderArea(true)
                .colors(restOfUkColor)
                .group(restOfUKAssaultGrp,"Scotland,Wales,N.I.")
                //.dashStyle([5,5]),*/
        ])
        .brushOn(false);
    dc.renderAll();
}


