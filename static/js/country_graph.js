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

function buildGraphs(euCrimeStats){

    var smallCountryStats = [];
    euCrimeStats.forEach(function(d){
        if('England'!==d.eu_member_state){
            smallCountryStats.push(d);
        }
    });

    var indexedData = crossfilter(smallCountryStats);
    print_filter(indexedData);

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



    /*.title(function(d){
 +                    return d.key;
 +                })
 +                .filter(function(d){
 +                    var value = $(this).find(':selected').val();
 +                    return value;
 +                });*/
    /////////////////////////////////////////////////
    //  LINE CHART
    /////////////////////////////////////////////////
    var crimeLineChart = dc.lineChart('#crime-line-chart');
    var dateDim = indexedData.dimension(function(d){
        return d.date;
    });
    var assaultGroup = dateDim.group().reduceSum(function(d){return d.assault;});
    var burglaryGroup = dateDim.group().reduceSum(function(d){return d.burglary;});
    var drugsGroup = dateDim.group().reduceSum(function(d){return d.drugs;});
    var ihGroup = dateDim.group().reduceSum(function(d){return d.intentional_homicide;});
    var kidnappingGroup = dateDim.group().reduceSum(function(d){return d.kidnapping;});
    var rapeGroup = dateDim.group().reduceSum(function(d){return d.rape;});
    var robberyGroup = dateDim.group().reduceSum(function(d){return d.robbery;});
    var saGroup = dateDim.group().reduceSum(function(d){return d.sexual_assault;});
    var svGroup = dateDim.group().reduceSum(function(d){return d.sexual_violence;});
    var theftGroup = dateDim.group().reduceSum(function(d){return d.theft;});

    var minDate = dateDim.bottom(1)[0].date;
    var maxDate = dateDim.top(1)[0].date;

    console.log('assaultGroup size:'+assaultGroup.size());
    print_filter(assaultGroup);
    console.log('minYear:'+minDate+' maxYear:'+maxDate);

    crimeLineChart
        .width(800)
        .height(300)
        .dimension(dateDim)
        .group(assaultGroup,'Assault')
        .stack(burglaryGroup,'Burglary')
        .stack(drugsGroup,'Drugs')
        .renderArea(true)
        .brushOn(false)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .legend(dc.legend().x(750).y(10).itemHeight(13).gap(5))
        .yAxisLabel('Crime Level')
        .xAxisLabel('Year')
        .colors(['#9AB240','#9EC6FF','#E1FF74','#CC5749','#B21400']);

    /////////////////////////////////////////////////
    //  STATS TABLE
    /////////////////////////////////////////////////
    var crimeStatsTable = dc.dataTable('#crime-stats-table');

    crimeStatsTable
        .dimension(dateDim)
        .group(function(d){
            return d.year;
        })
        .columns([
            function(d){
                return d.assault;
            },
            function(d){
                return d.burglary;
            },
            function(d){
                return d.drugs;
            },
            function(d){
                return d.intentional_homicide;
            },
            function(d){
                return d.kidnapping;
            },
            function(d){
                return d.rape;
            },
            function(d){
                return d.robbery;
            },
            function(d){
                return d.sexual_assault;
            },
            function(d){
                return d.sexual_violence;
            },
            function(d){
                return d.theft;
            }
        ]);


    dc.renderAll();
}