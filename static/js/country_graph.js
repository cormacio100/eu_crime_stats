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
   // console.log(countryPopObj);
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
    //  CRIME CHARTS
    ////////////////////////////////////////////////////////////
    assaultLineChart
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(assaultGroup,"Assault")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('Assault')
        .xAxisLabel('Year');
    burglaryLineChart
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(burglaryGroup,"Burglary")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    drugsLineChart
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(drugsGroup,"Drugs")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    murderLineChart
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(murderGroup,"Murder")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    kidnappingLineChart
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(kidnappingGroup,"Kidnapping")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    rapeLineChart
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(rapeGroup,"Rape")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    robberyLineChart
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(robberyGroup,"Robbery")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    saLineChart
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(saGroup,"Sexual Assault")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    svLineChart
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(svGroup,"Sexual Violence")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    theftLineChart
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(theftGroup,"Theft")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    crimeCompositeChart
        .width(svgWidth)
        .height(svgHeight)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel(dc.legend().x(220).y(120).itemHeight(13).gap(10))
        .yAxisLabel('')
        .legend(dc.legend().x(700).y(10).itemHeight(13).gap(10))
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
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(malePoliceGrp,"Male Officers")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    femalePoliceLineChart
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(femalePoliceGrp,"Female Officers")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    policeCompositeChart
        .width(svgWidth-400)
        .height(svgHeight-150)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel(dc.legend().x(220).y(120).itemHeight(13).gap(10))
        .yAxisLabel('')
        .legend(dc.legend().x(400).y(10).itemHeight(13).gap(10))
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
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(malePrisonPersGrp,"Male")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    femalePrisonPersLineChart
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(femalePrisonPersGrp,"Female")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    prisonPersCompositeChart
        .width(svgWidth-400)
        .height(svgHeight-150)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel(dc.legend().x(220).y(120).itemHeight(13).gap(10))
        .yAxisLabel('')
        .legend(dc.legend().x(400).y(10).itemHeight(13).gap(10))
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

    //  PRISON POPULATION
    adultMalePrisonerLineChart
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(adultMalePrisonerGrp,"Male")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    adultFemalePrisonerLineChart
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(adultFemalePrisonerGrp,"Female")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    juvenilePrisonerLineChart
        .width(svgWidth)
        .height(svgHeight)
        .dimension(dateDim)
        .group(juvenilePrisonerGrp,"Juvenile")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]));
    prisonerCompositeChart
        .width(svgWidth-400)
        .height(svgHeight-150)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel(dc.legend().x(220).y(120).itemHeight(13).gap(10))
        .yAxisLabel('')
        .legend(dc.legend().x(400).y(10).itemHeight(13).gap(10))
        .renderHorizontalGridLines(true)
        .compose([
            dc.lineChart(adultMalePrisonerLineChart)
                .dimension(dateDim)
                .colors(palette.blue)
                .group(adultMalePrisonerGrp,"Male"),
            dc.lineChart(adultFemalePrisonerLineChart)
                .dimension(dateDim)
                .colors(palette.pink)
                .group(adultFemalePrisonerGrp,"Female"),
            dc.lineChart(juvenilePrisonerLineChart)
                .dimension(dateDim)
                .colors(palette.green)
                .group(juvenilePrisonerGrp,"Juvenile"),
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

    dc.renderAll();
    $('select.dc-select-menu option:first').text('-- COUNTRY --');
    $('#hidden').remove();
    $('.init-hide').hide();
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