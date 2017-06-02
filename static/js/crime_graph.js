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

//  SET THE WIDTH OF ALL OF THE CRIME CHARTS
function setCountryCrimeChartWidth(width){
    /**
     * IF BROWSER IS INITIALLY SMALL AND EXPANDED BEFORE A COUNTRY SELECTION IS MADE
     * THEN THE WIDTH NEEDS TO BE TAKEN FROM THE GLOBAL VAR.
     * OTHERWISE AN ERROR IS THROWN AS THE WIDTH EQUALS 0
     */
    if(0==width){
        width=globalCountryCrimeChartWidth-50;
    }else{
        //  MAKE THE CHART SLIGHTLY SMALLER THAN IT'S CONTAINER
        width=width-50;
    }
    countriesCompChart.width(width);
    countriesCompChart.legend(dc.legend().x(width-150).y(10).itemHeight(13).gap(10))
}

function setCrimeChartWidth(width){
    if(0==width){
        width=globalCrimeChartWidth-50;
    }else{
        //  MAKE THE CHART SLIGHTLY SMALLER THAN IT'S CONTAINER
        width=width-50;
    }
    crimeLineChartAustria.width(width);
    crimeLineChartDenmark.width(width);
    crimeLineChartFinland.width(width);
    crimeLineChartIreland.width(width);
    crimeLineChartNorthernIreland.width(width);
    crimeLineChartNorway.width(width);
    crimeLineChartScotland.width(width);
    crimeLineChartSlovakia.width(width);
    crimeLineChartSweden.width(width);
    crimeLineChartWales.width(width);
    crimeLineChartRestOfUk.width(width);
}
function setYearRingWidth(width){
    if(0==width){
        width=globalYearRingWidth-50;
    }else{
        //  MAKE THE CHART SLIGHTLY SMALLER THAN IT'S CONTAINER
        width=width-50;
    }
    yearPieChart.width(width);
    yearPieChart.height(width);
}

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
        //.width(200)
        //.height(200)
        .slicesCap(10)
        .innerRadius(15)
        .dimension(yearDim)
        .group(yearlyTotal);

    /////////////////////////////////////////////////////////
    //  LINE CHART
    // X - AXIS is date
    // Y - AXIS is number of Assaults for the country
    /////////////////////////////////////////////////////////
    var dateDim = indexedData.dimension(function(d){return d.date});
    var minDate = dateDim.bottom(1)[0].date;
    var maxDate = dateDim.top(1)[0].date;

    //  RETRIEVE CRIME TYPE FROM HIDDEN FIELD
    var crime_type = $('#hidden_crime_type').text();
    console.log('crime type '+crime_type);

    var austriaCrimeGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Austria'){
            //return d.burglary;
            return d[crime_type];
        }else{
            return 0;
        }
    });
    var denmarkCrimeGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Denmark'){
            return d[crime_type];
        }else{
            return 0;
        }
    });
    var finlandCrimeGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Finland'){
            return d[crime_type];
        }else{
            return 0;
        }
    });
    var irelandCrimeGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Ireland'){
            return d[crime_type];
        }else{
            return 0;
        }
    });
    var northernIrelandCrimeGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Northern Ireland'){
            return d[crime_type];
        }else{
            return 0;
        }
    });
    var norwayCrimeGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Norway'){
            return d[crime_type];
        }else{
            return 0;
        }
    });
    var scotlandCrimeGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Scotland'){
            return d[crime_type];
        }else{
            return 0;
        }
    });
    var slovakiaCrimeGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Slovakia'){
            return d[crime_type];
        }else{
            return 0;
        }
    });
    var swedenCrimeGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Sweden'){
            return d[crime_type];
        }else{
            return 0;
        }
    });
    var walesCrimeyGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Wales'){
            return d[crime_type];
        }else{
            return 0;
        }
    });
    var restOfUKCrimeGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Northern Ireland' || d.eu_member_state=='Wales' || d.eu_member_state=='Scotland' ){
            return d[crime_type];
        }else{
            return 0;
        }
    });

    crimeLineChartAustria
        //.width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(austriaCrimeGrp,"Austria")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('...')
        .colors(austriaColor);
    crimeLineChartDenmark
        //.width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(denmarkCrimeGrp,"Denmark")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('...')
        .colors(denmarkColor);
    crimeLineChartFinland
        //.width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(finlandCrimeGrp,"Finland")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('...')
        .colors(finlandColor);
    crimeLineChartIreland
        //.width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(irelandCrimeGrp,"Ireland")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('...')
        .colors(irelandColor);
    crimeLineChartNorthernIreland
        //.width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(northernIrelandCrimeGrp,"Northern Ireland")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('...')
        .colors(northernIrelandColor);
    crimeLineChartNorway
        //.width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(norwayCrimeGrp,"Norway")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('...')
        .colors(norwayColor);
    crimeLineChartScotland
        //.width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(scotlandCrimeGrp,"Scotland")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('...')
        .colors(scotlandColor);
    crimeLineChartSlovakia
        //.width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(slovakiaCrimeGrp,"Slovakia")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('...')
        .colors(slovakiaColor);
    crimeLineChartSweden
        //.width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(swedenCrimeGrp,"Sweden")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('...')
        .colors(swedenColor);
    crimeLineChartWales
        //.width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(walesCrimeyGrp,"Wales")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('...')
        .colors(walesColor);
    crimeLineChartRestOfUk
        //.width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(restOfUKCrimeGrp,"Scotland,Wales,N.I.")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('...')
        .colors(restOfUkColor);
    countriesCompChart
        //.width(svgWidth)
        .height(svgHeight+100)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('...')
        //.legend(dc.legend().x(700).y(20).itemHeight(13).gap(5))
        .renderHorizontalGridLines(true)
        .compose([
            dc.lineChart(countriesCompChart)
                .dimension(dateDim)
                .colors(austriaColor)
                .group(austriaCrimeGrp,"Austria"),
            dc.lineChart(countriesCompChart)
                .dimension(dateDim)
                .colors(denmarkColor)
                .group(denmarkCrimeGrp,"Denmark"),
            dc.lineChart(countriesCompChart)
                .dimension(dateDim)
                .colors(finlandColor)
                .group(finlandCrimeGrp,"Finland"),
            dc.lineChart(countriesCompChart)
                .dimension(dateDim)
                .colors(irelandColor)
                .group(irelandCrimeGrp,"Ireland"),
            dc.lineChart(countriesCompChart)
                .dimension(dateDim)
                //.renderArea(true)
                .colors(northernIrelandColor)
                .group(northernIrelandCrimeGrp,"Northern Ireland"),
            dc.lineChart(countriesCompChart)
                .dimension(dateDim)
                .colors(norwayColor)
                .group(norwayCrimeGrp,"Norway"),
            dc.lineChart(countriesCompChart)
                .dimension(dateDim)
                .colors(scotlandColor)
                .group(scotlandCrimeGrp,"Scotland"),
            dc.lineChart(countriesCompChart)
                .dimension(dateDim)
                .colors(slovakiaColor)
                .group(slovakiaCrimeGrp,"Slovakia"),
            dc.lineChart(countriesCompChart)
                .dimension(dateDim)
                .colors(swedenColor)
                .group(swedenCrimeGrp,"Sweden"),
            dc.lineChart(countriesCompChart)
                .dimension(dateDim)
                .colors(walesColor)
                .group(walesCrimeyGrp,"Wales"),
        ])
        .brushOn(false);
    ////////////////////////////////////////////////////////////////////
    //  SET THE INITIAL WIDTH OF THE CHARTS
    ////////////////////////////////////////////////////////////////////
    //  retrieve initial width of the containers for the CRIME charts
    var countryCrimeChartWidth = $('#country-crime-compare-stage').outerWidth( true );
    if(0<countryCrimeChartWidth) {
        globalCountryCrimeCompWidth = countryCrimeChartWidth;
        setCountryCrimeChartWidth(countryCrimeChartWidth);
    }
    var crimeLineWidth = $('#crime-line-stage').outerWidth( true );
    if(0<crimeLineWidth) {
        globalCrimeCompWidth = crimeLineWidth;
        setCrimeChartWidth(crimeLineWidth);
    }
    var yearRingWidth = $('#year-ring-stage').outerWidth( true );
    if(0<yearRingWidth) {
        globalYearRingWidth = yearRingWidth;
        if($(window).width()>768){
            globalInitYearRingWidth = yearRingWidth;
            console.log('globalInitYearRingWidth:'+globalInitYearRingWidth);
        }else{
            //  set a limit on the size of the year Ring. Otherwise when the screen is at it's smallest the year ring is at it's largest
            globalInitYearRingWidth = 200;
        }
        setYearRingWidth(globalInitYearRingWidth);
    }


    dc.renderAll();
    $(document).ready(function () {
        //$('.carousel-control').hide();
        $('#hidden').hide();
        /**
     *  -   retrieve width of the window
     *  -   retrieve initial width of the container
     *  -   set the chart width to container width - 20px
     *  -   dc.renderall
     *  -   when the window resizes
     *      -   in stages
     *          -   retrieve the width of the container again
     *          -   set the chart width to the new container width - 20px
     *          -   dc.renderAll
     * @type {*}
     */
        $(window).on('resize', function(){
            console.log('window resized');
            width = $(this).width();
            // countryCompareContainer = $('#country-crime-compare-stage').outerWidth(true);
            if(width >= 992 ) {
                //  detect the size of teh chart containers and resize the charts
                countryCrimeChartWidth = $('#country-crime-compare-stage').outerWidth( true );
                setCountryCrimeChartWidth(countryCrimeChartWidth);
                crimeLineWidth = $('#crime-line-stage').outerWidth( true );
                setCrimeChartWidth(crimeLineWidth);
                yearRingWidth = $('#year-ring-stage').outerWidth( true );
                setYearRingWidth(yearRingWidth);
                dc.renderAll();
            }else if(width >= 768) {
                countryCrimeChartWidth = $('#country-crime-compare-stage').outerWidth( true );
                setCountryCrimeChartWidth(countryCrimeChartWidth);
                crimeLineWidth = $('#crime-line-stage').outerWidth( true );
                setCrimeChartWidth(crimeLineWidth);
                yearRingWidth = $('#year-ring-stage').outerWidth( true );
                setYearRingWidth(yearRingWidth);
                dc.renderAll();
            }else if(width <768){
                countryCrimeChartWidth = $('#country-crime-compare-stage').outerWidth( true );
                setCountryCrimeChartWidth(countryCrimeChartWidth);
                crimeLineWidth = $('#crime-line-stage').outerWidth( true );
                setCrimeChartWidth(crimeLineWidth);
                setYearRingWidth(globalInitYearRingWidth);
                dc.renderAll();
            }
        });

    });
}


