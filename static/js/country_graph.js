/**
 * Created by Owner on 18/05/2017.
 */
// HELPER FUNCTION to to see if filters are working correctly
function print_filter(filter){
    //	first check that the filter if of valid type
    var f=eval(filter);
    if (typeof(f.length) != "undefined") {}else{}
    if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
    if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
    console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
}
/**
 * Function to add commas to a number
 * @param x
 * @returns {string}
 */
function addCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
//  WHAT HAPPENS WHEN A SELECTION IS MADE AFTER A BROWSER RESIZE
function selectMenuChange(countryPopObj){
    $('select.dc-select-menu').on('change',function(){
        if($('select.dc-select-menu').val()==''){
            $('.init-hide').fadeOut('slow');
        }else{
            //  RETRIEVE THE COUNTRY SELECTION AND FIND THE CORRESPONDNG POPULATION TO DISPLAY
            var country = $('select.dc-select-menu').val();
            var pop=countryPopObj[country];
            $('#population').text(addCommas(pop));
            $('.init-hide').fadeIn('slow');
        }
    });
}
//  SET HOW THE SELECT MENU AFFECTS THE REST OF THE PAGE
function selectMenu(countryPopObj,selection){
    if('none'==selection){
        //  DEFAULT SELECTION ON LOAD
        $('select.dc-select-menu option:first').text('-- COUNTRY --');
        $('#hidden').remove();
        $('.init-hide').hide();
        //  HANDLE CHANGES IN SELECTION
        selectMenuChange(countryPopObj);
    }else{
        // display the correct country
        $('select.dc-select-menu').val(selection);
        $('select.dc-select-menu option:first').text('-- COUNTRY --');
        //  HANDLE CHANGES IN SELECTION
        selectMenuChange(countryPopObj);
    }
}
//  SET THE WIDTH OF ALL OF THE CRIME CHARTS
function setCrimeChartWidth(width){
    /**
     * IF BROWSER IS INITIALLY SMALL AND EXPANDED BEFORE A COUNTRY SELECTION IS MADE
     * THEN THE WIDTH NEEDS TO BE TAKEN FROM THE GLOBAL VAR.
     * OTHERWISE AN ERROR IS THROWN AS THE WIDTH EQUALS 0
     */
    if(0==width){
        width=globalCrimeChartWidth-20;
    }else{
        //  MAKE THE CHART SLIGHTLY SMALLER THAN IT'S CONTAINER
        width=width-20;
    }
    assaultLineChart.width(width);
    burglaryLineChart.width(width);
    drugsLineChart.width(width);
    murderLineChart.width(width);
    kidnappingLineChart.width(width);
    rapeLineChart.width(width);
    robberyLineChart.width(width);
    saLineChart.width(width);
    svLineChart.width(width);
    theftLineChart.width(width);
    crimeCompositeChart.width(width);
    crimeCompositeChart.legend(dc.legend().x(width-150).y(10).itemHeight(13).gap(10))
}
//  SET THE WIDTH OF ALL OF THE POLICE CHART
function setPoliceChartWidth(width){
    if(0==width){
        width=globalPoliceChartWidth-20;
    }else{
        //  MAKE THE CHART SLIGHTLY SMALLER THAN IT'S CONTAINER
        width=width-20;
    }
    malePoliceLineChart.width(width);
    femalePoliceLineChart.width(width);
    policeCompositeChart.width(width);
    policeCompositeChart.legend(dc.legend().x(width-100).y(10).itemHeight(13).gap(10));
}
//  SET THE WIDTH OF ALL OF THE PRISON PERSONNEL CHART
function setPrisonPersChartWidth(width){
    if(0==width){
        width=globalPoliceChartWidth-20;
    }else{
        //  MAKE THE CHART SLIGHTLY SMALLER THAN IT'S CONTAINER
        width=width-20;
    }
    malePrisonPersLineChart.width(width);
    femalePrisonPersLineChart.width(width);
    prisonPersCompositeChart.width(width);
    prisonPersCompositeChart.legend(dc.legend().x(width-100).y(10).itemHeight(13).gap(10));
}
function buildGraphs(euCrimeStats){
    var smallCountryStats = [];
    euCrimeStats.forEach(function(d){

        if('England'!==d.eu_member_state){
            smallCountryStats.push(d);
        }
    });
    var indexedData = crossfilter(smallCountryStats);
    var countryPopObj = {};
    var countryPopulationDim = indexedData.dimension(function(d){
        countryPopObj[d.eu_member_state]=d.population;
    });

    /////////////////////////////////////////////////
    //  SELECT MENU
    /////////////////////////////////////////////////
    var countryDim = indexedData.dimension(function(d){
       return d.eu_member_state;
    });
    var countryGroup = countryDim.group();
    var selectCountry = dc.selectMenu('#select-country')
                            .dimension(countryDim)
                            .group(countryGroup)
                            .title(function(d){
                                return d.key;
                            });
    /////////////////////////////////////////////////
    //  POPULATION DISPLAY
    /////////////////////////////////////////////////
    var populationDim = indexedData.dimension(function(d){
        return d.population;
    });
    /////////////////////////////////////////////////
    //  LINE CHART
    /////////////////////////////////////////////////
    var dateDim = indexedData.dimension(function(d){
        return d.date;
    });
    //  CRIME GROUPS
    var totalCrimesGroup = dateDim.group().reduceSum(function(d){return d.totalCrimes;});
    var assaultGroup = dateDim.group().reduceSum(function(d){return d.assault;});
    var burglaryGroup = dateDim.group().reduceSum(function(d){return d.burglary;});
    var drugsGroup = dateDim.group().reduceSum(function(d){return d.drugs;});
    var murderGroup = dateDim.group().reduceSum(function(d){return d.murder;});
    var kidnappingGroup = dateDim.group().reduceSum(function(d){return d.kidnapping;});
    var rapeGroup = dateDim.group().reduceSum(function(d){return d.rape;});
    var robberyGroup = dateDim.group().reduceSum(function(d){return d.robbery;});
    var saGroup = dateDim.group().reduceSum(function(d){return d.sexual_assault;});
    var svGroup = dateDim.group().reduceSum(function(d){return d.sexual_violence;});
    var theftGroup = dateDim.group().reduceSum(function(d){return d.theft;});

    //  JUSTICE SYSTEM GROUPS
    var malePoliceGrp = dateDim.group().reduceSum(function(d){return d.male_police_officers;});
    var femalePoliceGrp = dateDim.group().reduceSum(function(d){return d.female_police_officers;});
    var malePrisonPersGrp = dateDim.group().reduceSum(function(d){return d.male_prison_personell;});
    var femalePrisonPersGrp = dateDim.group().reduceSum(function(d){return d.female_prison_personell; });
    var adultMalePrisonerGrp = dateDim.group().reduceSum(function(d){return d.adult_male_prisoners;});
    var adultFemalePrisonerGrp = dateDim.group().reduceSum(function(d){return d.adult_female_prisoners; });
    var juvenilePrisonerGrp = dateDim.group().reduceSum(function(d){return d.juvenile_prison_population; });

    var minDate = dateDim.bottom(1)[0].date;
    var maxDate = dateDim.top(1)[0].date;
    ////////////////////////////////////////////////////////////
    //  CRIME LINE CHARTS
    ////////////////////////////////////////////////////////////
    assaultLineChart
        .height(svgHeight)
        .dimension(dateDim)
        .group(assaultGroup,"Assault")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('Assault')
        .xAxisLabel('Year');
    burglaryLineChart
        .height(svgHeight)
        .dimension(dateDim)
        .group(burglaryGroup,"Burglary")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    drugsLineChart
        .height(svgHeight)
        .dimension(dateDim)
        .group(drugsGroup,"Drugs")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    murderLineChart
        .height(svgHeight)
        .dimension(dateDim)
        .group(murderGroup,"Murder")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    kidnappingLineChart
        .height(svgHeight)
        .dimension(dateDim)
        .group(kidnappingGroup,"Kidnapping")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    rapeLineChart
        .height(svgHeight)
        .dimension(dateDim)
        .group(rapeGroup,"Rape")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    robberyLineChart
        .height(svgHeight)
        .dimension(dateDim)
        .group(robberyGroup,"Robbery")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    saLineChart
        .height(svgHeight)
        .dimension(dateDim)
        .group(saGroup,"Sexual Assault")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    svLineChart
        .height(svgHeight)
        .dimension(dateDim)
        .group(svGroup,"Sexual Violence")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    theftLineChart
        .height(svgHeight)
        .dimension(dateDim)
        .group(theftGroup,"Theft")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    crimeCompositeChart
        .height(svgHeight)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel(dc.legend().x(220).y(120).itemHeight(13).gap(10))
        .yAxisLabel('')
        .renderHorizontalGridLines(true)
        .compose([
            dc.lineChart(assaultLineChart)
                .dimension(dateDim)
                .colors(palette.yellow)
                .group(assaultGroup,"Assault"),
            dc.lineChart(burglaryLineChart)
                .dimension(dateDim)
                .colors(palette.gray)
                .group(burglaryGroup,"Burglary"),
            dc.lineChart(drugsLineChart)
                .dimension(dateDim)
                .colors(palette.orange)
                .group(drugsGroup,"Drugs"),
            dc.lineChart(murderLineChart)
                .dimension(dateDim)
                .colors(palette.red)
                .group(murderGroup,"Murder"),
            dc.lineChart(kidnappingLineChart)
                .dimension(dateDim)
                .colors(palette.pink)
                .group(kidnappingGroup,"Kidnapping"),
            dc.lineChart(rapeLineChart)
                .dimension(dateDim)
                .colors(palette.purple)
                .group(rapeGroup,"Rape"),
            dc.lineChart(robberyLineChart)
                .dimension(dateDim)
                .colors(palette.green)
                .group(robberyGroup,"Robbery"),
            dc.lineChart(saLineChart)
                .dimension(dateDim)
                .colors(palette.blue)
                .group(saGroup,"Sexual Assault"),
            dc.lineChart(svLineChart)
                .dimension(dateDim)
                .colors(palette.yellowgreen)
                .group(svGroup,"Sexual Violence"),
            dc.lineChart(theftLineChart)
                .dimension(dateDim)
                .colors(palette.darkgray)
                .group(theftGroup,"Theft")
        ])
        .brushOn(false)
        .elasticY(true)
        .renderHorizontalGridLines(true);

    /////////////////////////////////////////////////
    //  JUSTICE SYSTEM CHARTS
    /////////////////////////////////////////////////
    //  POLICE OFFICERS
    malePoliceLineChart
        .height(svgHeight)
        .dimension(dateDim)
        .group(malePoliceGrp,"Male Officers")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    femalePoliceLineChart
        .height(svgHeight)
        .dimension(dateDim)
        .group(femalePoliceGrp,"Female Officers")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    policeCompositeChart
        .height(svgHeight-150)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel(dc.legend().x(220).y(120).itemHeight(13).gap(10))
        .yAxisLabel('')
        .renderHorizontalGridLines(true)
        .compose([
            dc.lineChart(malePoliceLineChart)
                .dimension(dateDim)
                .colors(palette.blue)
                .group(malePoliceGrp,"Male"),
            dc.lineChart(femalePoliceLineChart)
                .dimension(dateDim)
                .colors(palette.pink)
                .group(femalePoliceGrp,"Female"),
        ])
        .brushOn(false)
        .elasticY(true)
        .renderHorizontalGridLines(true);

    //  PRISON PERSONNEL
    malePrisonPersLineChart
        .height(svgHeight)
        .dimension(dateDim)
        .group(malePrisonPersGrp,"Male")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    femalePrisonPersLineChart
        .height(svgHeight)
        .dimension(dateDim)
        .group(femalePrisonPersGrp,"Female")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    prisonPersCompositeChart
        .height(svgHeight-150)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel(dc.legend().x(220).y(120).itemHeight(13).gap(10))
        .yAxisLabel('')
        .renderHorizontalGridLines(true)
        .compose([
            dc.lineChart(malePrisonPersLineChart)
                .dimension(dateDim)
                .colors(palette.blue)
                .group(malePrisonPersGrp,"Male"),
            dc.lineChart(femalePrisonPersLineChart)
                .dimension(dateDim)
                .colors(palette.pink)
                .group(femalePrisonPersGrp,"Female"),
        ])
        .brushOn(false)
        .elasticY(true)
        .renderHorizontalGridLines(true);

    /////////////////////////////////////////////////
    //  JUDICIAL SYSTEM STATS TABLE
    /////////////////////////////////////////////////
    var prisonPopulationTable = dc.dataTable('#prison-population-table');
    prisonPopulationTable
        .dimension(dateDim)
        .group(function(d){
            return d.eu_member_state;
        })
        .columns([
            function(d){
                return d.year;
            },
            function(d){
                return d.total_prison_population;
            },
            function(d){
                return d.adult_male_prisoners;
            },
            function(d){
                return d.adult_female_prisoners;
            },
            function(d){
                return d.juvenile_prison_population;
            },
            function(d){
                return d.native_prisoners;
            },
            function(d){
                return d.foreign_prisoners;
            }
        ]);

    ////////////////////////////////////////////////////////////////////
    //  SET THE WIDTH OF THE CHARTS
    ////////////////////////////////////////////////////////////////////
    //  retrieve initial width of the container for the CRIME charts
    var crimeTypeWidth = $('#crime-type-stage').outerWidth( true );
    if(0<crimeTypeWidth) {
        globalCrimeChartWidth = crimeTypeWidth;
        setCrimeChartWidth(crimeTypeWidth);
    }
    //  retrieve initial width of the container for the POLICE OFFICER chart
    var policeTypeWidth = $('#police-comparison-stage').outerWidth( true );
    if(0<policeTypeWidth) {
        globalPoliceChartWidth = policeTypeWidth;
        setPoliceChartWidth(policeTypeWidth);
    }
    //  retrieve initial width of the container for the PRISON PERSONNEL chart
    var prisonPersTypeWidth = $('#prison-pers-comparison-stage').outerWidth( true );
    if(0<prisonPersTypeWidth) {
        globalPrisonPersChartWidth = prisonPersTypeWidth;
        setPrisonPersChartWidth(prisonPersTypeWidth);
    }
    dc.renderAll();

    $(document).ready(function () {
        //  DEFINE HOW PAGE REACTS TO THE SELECT MENU
        //  THE SELECTION WILL DEFAULT TO -- COUNTRY --
        selectMenu(countryPopObj,'none');
        //  WHAT HAPPENS WHEN THE PAGE RESIZES
        $(window).on('resize', function(){
            //  RETAIN THE COUNTRY SELECTION
            var country = $('select.dc-select-menu').val();
            width = $(this).width();
            var selectContainer=$('#select-country').parent().outerWidth(true);
            var selectDivWidth = $('#select-country').outerWidth(true);
            if(selectDivWidth>selectContainer){
                $('#select-country select').addClass('smallSelect');
            }else{
                $('#select-country select').removeClass('smallSelect');
            }
            if(width >= 992 ) {
                //  detect the size of teh chart containers and resize the charts
                crimeTypeWidth = $('#crime-type-stage').outerWidth( true );
                setCrimeChartWidth(crimeTypeWidth);
                policeTypeWidth = $('#police-comparison-stage').outerWidth( true );
                setPoliceChartWidth(policeTypeWidth);
                prisonPersTypeWidth = $('#prison-pers-comparison-stage').outerWidth( true );
                setPrisonPersChartWidth(prisonPersTypeWidth);
                dc.renderAll();
            }else if(width >= 768) {
                crimeTypeWidth = $('#crime-type-stage').outerWidth( true );
                setCrimeChartWidth(crimeTypeWidth);
                policeTypeWidth = $('#police-comparison-stage').outerWidth( true );
                setPoliceChartWidth(policeTypeWidth);
                prisonPersTypeWidth = $('#prison-pers-comparison-stage').outerWidth( true );
                setPrisonPersChartWidth(prisonPersTypeWidth);
                dc.renderAll();
            }else if(width <768){
                crimeTypeWidth = $('#crime-type-stage').outerWidth( true );
                setCrimeChartWidth(crimeTypeWidth);
                policeTypeWidth = $('#police-comparison-stage').outerWidth( true );
                setPoliceChartWidth(policeTypeWidth);
                prisonPersTypeWidth = $('#prison-pers-comparison-stage').outerWidth( true );
                setPrisonPersChartWidth(prisonPersTypeWidth);
                dc.renderAll();
            }
            selectMenu(countryPopObj,country);
        });
    });
}