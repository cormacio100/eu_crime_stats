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
        .width(200)
        .height(200)
        .slicesCap(10)
        .innerRadius(15)
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

    var austriaAssaultGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Austria'){
            return d.assault;
        }else{
            return 0;
        }
    });
    var denmarkAssaultGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Denmark'){
            return d.assault;
        }else{
            return 0;
        }
    });
    var finlandAssaultGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Finland'){
            return d.assault;
        }else{
            return 0;
        }
    });
    var irelandAssaultGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Ireland'){
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
    var norwayAssaultGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Norway'){
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
    var slovakiaAssaultGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Slovakia'){
            return d.assault;
        }else{
            return 0;
        }
    });
    var swedenAssaultGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Sweden'){
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

    var restOfUKAssaultGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Northern Ireland' || d.eu_member_state=='Wales' || d.eu_member_state=='Scotland' ){
            return d.assault;
        }else{
            return 0;
        }
    });

    crimeLineChartAustria
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(austriaAssaultGrp,"Austria")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        //.yAxisLabel('Assaults')
        //.xAxisLabel('Year')
        .colors(austriaColor);
    crimeLineChartDenmark
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(denmarkAssaultGrp,"Denmark")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        //.yAxisLabel('Assaults')
        //.xAxisLabel('Year')
        .colors(denmarkColor);
    crimeLineChartFinland
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(finlandAssaultGrp,"Finland")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        //.yAxisLabel('Assaults')
        //.xAxisLabel('Year')
        .colors(finlandColor);
    crimeLineChartIreland
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(irelandAssaultGrp,"Ireland")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        //.yAxisLabel('Assaults')
        //.xAxisLabel('Year')
        .colors(irelandColor);
    crimeLineChartNorthernIreland
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(northernIrelandAssaultGrp,"Northern Ireland")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        //.yAxisLabel('Assaults')
        //.xAxisLabel('Year')
        .colors(northernIrelandColor);
    crimeLineChartNorway
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(norwayAssaultGrp,"Norway")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        //.yAxisLabel('Assaults')
        //.xAxisLabel('Year')
        .colors(norwayColor);
    crimeLineChartScotland
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(scotlandAssaultGrp,"Scotland")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        //.yAxisLabel('Assaults')
        //.xAxisLabel('Year')
        .colors(scotlandColor);
    crimeLineChartSlovakia
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(slovakiaAssaultGrp,"Slovakia")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        //.yAxisLabel('Assaults')
        //.xAxisLabel('Year')
        .colors(slovakiaColor);
    crimeLineChartSweden
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(swedenAssaultGrp,"Sweden")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        //.yAxisLabel('Assaults')
        //.xAxisLabel('Year')
        .colors(swedenColor);
    crimeLineChartWales
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(walesAssaultGrp,"Wales")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        //.yAxisLabel('Assaults')
        //.xAxisLabel('Year')
        .colors(walesColor);
    crimeLineChartRestOfUk
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(restOfUKAssaultGrp,"Scotland,Wales,N.I.")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        //.yAxisLabel('Assaults')
        //.xAxisLabel('Year')
        .colors(restOfUkColor);

    countriesLineChart
        .width(svgWidth)
        .height(svgHeight+100)
        .x(d3.time.scale().domain([minDate,maxDate]))
        //.yAxisLabel(dc.legend().x(400).y(120).itemHeight(13).gap(5))
        .yAxisLabel('Assaults')
        .xAxisLabel('Year')
        .legend(dc.legend().x(700).y(20).itemHeight(13).gap(5))
        .renderHorizontalGridLines(true)
        .compose([
            dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                .colors(austriaColor)
                .group(austriaAssaultGrp,"Austria"),
            dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                .colors(denmarkColor)
                .group(denmarkAssaultGrp,"Denmark"),
            dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                .colors(finlandColor)
                .group(finlandAssaultGrp,"Finland"),
            dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                .colors(irelandColor)
                .group(irelandAssaultGrp,"Ireland"),
            dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                //.renderArea(true)
                .colors(northernIrelandColor)
                .group(northernIrelandAssaultGrp,"Northern Ireland"),
            dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                .colors(norwayColor)
                .group(norwayAssaultGrp,"Norway"),
            dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                .colors(scotlandColor)
                .group(scotlandAssaultGrp,"Scotland"),
            dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                .colors(slovakiaColor)
                .group(slovakiaAssaultGrp,"Slovakia"),
            dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                .colors(swedenColor)
                .group(slovakiaAssaultGrp,"Sweden"),
            dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                .colors(walesColor)
                .group(walesAssaultGrp,"Wales"),
                //.dashStyle([4,4]),

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


