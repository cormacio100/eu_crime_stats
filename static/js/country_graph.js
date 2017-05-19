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

    /////////////////////////////////////////////////
    //  LINE CHART
    /////////////////////////////////////////////////
    //var crimeLineChart = dc.lineChart('#crime-line-chart');
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

    /*crimeLineChart
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
        .colors(['#9AB240','#9EC6FF','#E1FF74','#CC5749','#B21400']);*/
    /////////////////////////////////////////////////
    //  COMPARISON CHART
    /////////////////////////////////////////////////

/*
    var assaultGrp = dateDim.group().reduceSum(function(d){
        if(d.assault){
            return d.assault;
        }else{
            return 0;
        }
    });
    var burglaryGrp = dateDim.group().reduceSum(function(d){
        if(d.assault){
            return d.burglary;
        }else{
            return 0;
        }
    });
    var drugsGrp = dateDim.group().reduceSum(function(d){
        if(d.assault){
            return d.drugs;
        }else{
            return 0;
        }
    });*/

    assaultLineChart
        .width(800)
        .height(400)
        .dimension(dateDim)
        .group(assaultGroup,"Assault")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('Assault')
        .xAxisLabel('Year')
        //.colors(irelandColor);
    burglaryLineChart
        .width(800)
        .height(400)
        .dimension(dateDim)
        .group(burglaryGroup,"Burglary")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        //.yAxisLabel('Burglary')
        //.xAxisLabel('Year')
        //.colors(irelandColor);
    drugsLineChart
        .width(800)
        .height(400)
        .dimension(dateDim)
        .group(drugsGroup,"Drugs")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        //.colors(irelandColor);
    ihLineChart
        .width(800)
        .height(400)
        .dimension(dateDim)
        .group(ihGroup,"Intentional Homicide")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        //.colors(irelandColor);
    kidnappingLineChart
        .width(800)
        .height(400)
        .dimension(dateDim)
        .group(kidnappingGroup,"Kidnapping")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        //.colors(irelandColor);
    rapeLineChart
        .width(800)
        .height(400)
        .dimension(dateDim)
        .group(rapeGroup,"Rape")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        //.colors(irelandColor);
    robberyLineChart
        .width(800)
        .height(400)
        .dimension(dateDim)
        .group(robberyGroup,"Robbery")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        //.colors(irelandColor);
    saLineChart
        .width(800)
        .height(400)
        .dimension(dateDim)
        .group(saGroup,"Sexual Assault")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        //.colors(irelandColor);
    svLineChart
        .width(800)
        .height(400)
        .dimension(dateDim)
        .group(svGroup,"Sexual Violence")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        //.colors(irelandColor);
    theftLineChart
        .width(800)
        .height(400)
        .dimension(dateDim)
        .group(theftGroup,"Theft")
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        //.colors(irelandColor);

    crimeCompositeChart
        .width(800)
        .height(400)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel(dc.legend().x(400).y(120).itemHeight(13).gap(5))
        .yAxisLabel('Amount')
        .xAxisLabel('Year')
        .legend(dc.legend().x(650).y(120).itemHeight(13).gap(5))
        .renderHorizontalGridLines(true)
        .compose([
            dc.lineChart(assaultLineChart)
                .dimension(dateDim)
                //.renderArea(true)
                .colors(palette.yellow)
                .group(assaultGroup,"Assault"),
            dc.lineChart(burglaryLineChart)
                .dimension(dateDim)
                //.renderArea(true)
                .colors(palette.gray)
                .group(burglaryGroup,"Burglary"),
                //.dashStyle([3,3]),
            dc.lineChart(drugsLineChart)
                .dimension(dateDim)
                //.renderArea(true)
                .colors(palette.orange)
                .group(drugsGroup,"Drugs"),
            dc.lineChart(ihLineChart)
                .dimension(dateDim)
                //.renderArea(true)
                .colors(palette.red)
                .group(ihGroup,"Intentional Homicide"),
            dc.lineChart(kidnappingLineChart)
                .dimension(dateDim)
                //.renderArea(true)
                .colors(palette.pink)
                .group(kidnappingGroup,"Kidnapping"),
            dc.lineChart(rapeLineChart)
                .dimension(dateDim)
                //.renderArea(true)
                .colors(palette.purple)
                .group(rapeGroup,"Rape Group"),
            dc.lineChart(robberyLineChart)
                .dimension(dateDim)
                //.renderArea(true)
                .colors(palette.green)
                .group(robberyGroup,"Robbery"),
            dc.lineChart(saLineChart)
                .dimension(dateDim)
                //.renderArea(true)
                .colors(palette.blue)
                .group(saGroup,"Sexual Assault"),
            dc.lineChart(svLineChart)
                .dimension(dateDim)
                //.renderArea(true)
                .colors(palette.yellowgreen)
                .group(svGroup,"Sexual Violence"),
            dc.lineChart(theftLineChart)
                .dimension(dateDim)
                //.renderArea(true)
                .colors(palette.darkgray)
                .group(theftGroup,"Theft")
        ])
        .brushOn(false);
    /////////////////////////////////////////////////
    //  TABLES
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


    /////////////////////////////////////////////////
    //  JUDICIAL SYSTEM STATS TABLE
    /////////////////////////////////////////////////
    var policeOfficersTable = dc.dataTable('#police-officers-table');

    policeOfficersTable
        .dimension(dateDim)
        .group(function(d){
            return d.year;
        })
        .columns([
            function(d){
                return d.police_officers;
            },
            function(d){
                return d.male_police_officers;
            },
            function(d){
                return d.female_police_officers;
            }
        ]);

    var prisonPersonellTable = dc.dataTable('#prison-personell-table');

    prisonPersonellTable
        .dimension(dateDim)
        .group(function(d){
            return d.year;
        })
        .columns([
            function(d){
                return d.prison_personell;
            },
            function(d){
                return d.male_prison_personell;
            },
            function(d){
                return d.female_prison_personell;
            }
        ]);

    var prisonPopulationTable = dc.dataTable('#prison-population-table');

    prisonPopulationTable
        .dimension(dateDim)
        .group(function(d){
            return d.year;
        })
        .columns([
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
            }
        ]);

    var prisonerNationalityTable = dc.dataTable('#prisoner-nationality-table');

    prisonerNationalityTable
        .dimension(dateDim)
        .group(function(d){
            return d.year;
        })
        .columns([
            function(d){
                return d.native_prisoners;
            },
            function(d){
                return d.foreign_prisoners;
            }
        ]);


    dc.renderAll();
}