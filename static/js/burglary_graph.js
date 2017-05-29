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

    var austriaBurglaryGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Austria'){
            return d.burglary;
        }else{
            return 0;
        }
    });
    var denmarkBurglaryGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Denmark'){
            return d.burglary;
        }else{
            return 0;
        }
    });
    var finlandBurglaryGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Finland'){
            return d.burglary;
        }else{
            return 0;
        }
    });
    var irelandBurglaryGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Ireland'){
            return d.burglary;
        }else{
            return 0;
        }
    });
    var northernIrelandBurglaryGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Northern Ireland'){
            return d.burglary;
        }else{
            return 0;
        }
    });
    var norwayBurglaryGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Norway'){
            return d.burglary;
        }else{
            return 0;
        }
    });
    var scotlandBurglaryGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Scotland'){
            return d.burglary;
        }else{
            return 0;
        }
    });
    var slovakiaBurglaryGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Slovakia'){
            return d.burglary;
        }else{
            return 0;
        }
    });
    var swedenBurglaryGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Sweden'){
            return d.burglary;
        }else{
            return 0;
        }
    });
    var walesBurglaryGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Wales'){
            return d.burglary;
        }else{
            return 0;
        }
    });

    var restOfUKBurglaryGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Northern Ireland' || d.eu_member_state=='Wales' || d.eu_member_state=='Scotland' ){
            return d.burglary;
        }else{
            return 0;
        }
    });

    crimeLineChartAustria
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(austriaBurglaryGrp,"Austria")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('...')
        .colors(austriaColor);
    crimeLineChartDenmark
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(denmarkBurglaryGrp,"Denmark")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('...')
        .colors(denmarkColor);
    crimeLineChartFinland
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(finlandBurglaryGrp,"Finland")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('...')
        .colors(finlandColor);
    crimeLineChartIreland
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(irelandBurglaryGrp,"Ireland")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('...')
        .colors(irelandColor);
    crimeLineChartNorthernIreland
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(northernIrelandBurglaryGrp,"Northern Ireland")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('...')
        .colors(northernIrelandColor);
    crimeLineChartNorway
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(norwayBurglaryGrp,"Norway")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('...')
        .colors(norwayColor);
    crimeLineChartScotland
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(scotlandBurglaryGrp,"Scotland")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('...')
        .colors(scotlandColor);
    crimeLineChartSlovakia
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(slovakiaBurglaryGrp,"Slovakia")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('...')
        .colors(slovakiaColor);
    crimeLineChartSweden
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(swedenBurglaryGrp,"Sweden")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('...')
        .colors(swedenColor);
    crimeLineChartWales
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(walesBurglaryGrp,"Wales")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('...')
        .colors(walesColor);
    crimeLineChartRestOfUk
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(restOfUKBurglaryGrp,"Scotland,Wales,N.I.")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('...')
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
                .group(austriaBurglaryGrp,"Austria"),
            dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                .colors(denmarkColor)
                .group(denmarkBurglaryGrp,"Denmark"),
            dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                .colors(finlandColor)
                .group(finlandBurglaryGrp,"Finland"),
            dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                .colors(irelandColor)
                .group(irelandBurglaryGrp,"Ireland"),
            dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                //.renderArea(true)
                .colors(northernIrelandColor)
                .group(northernIrelandBurglaryGrp,"Northern Ireland"),
            dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                .colors(norwayColor)
                .group(norwayBurglaryGrp,"Norway"),
            dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                .colors(scotlandColor)
                .group(scotlandBurglaryGrp,"Scotland"),
            dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                .colors(slovakiaColor)
                .group(slovakiaBurglaryGrp,"Slovakia"),
            dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                .colors(swedenColor)
                .group(swedenBurglaryGrp,"Sweden"),
            dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                .colors(walesColor)
                .group(walesBurglaryGrp,"Wales"),
        ])
        .brushOn(false);
    dc.renderAll();
}


