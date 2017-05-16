/**
 * Created by Cormac Liston on 12/05/2017.
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


//  RETRIEVE DATA FROM API
queue()
    .defer(d3.json,'/charts/data')
    .await(buildGraphs);

function buildGraphs(error,jsonData){

    var euCrimeStats = jsonData;

    var yearPieChart = dc.pieChart('#chart-ring-year');
    var crimeLineChartIreland = dc.lineChart('#chart-line-assault-ireland');
    var crimeLineChartEngland = dc.lineChart('#chart-line-assault-england');
    var crimeLineChartScotland = dc.lineChart('#chart-line-assault-scotland');
    var crimeLineChartWales = dc.lineChart('#chart-line-assault-wales');
    var crimeLineChartNorthernIreland = dc.lineChart('#chart-line-assault-northern-ireland');
    var crimeLineChartRestOfUk = dc.lineChart('#chart-line-assault-rest-of-uk');
    var countriesLineChart = dc.compositeChart('#chart-line-assault-compare-countries');

    var irelandColor = '#93B240';
    var englandColor = '#E1DDAA';
    var scotlandColor = '#9EC6FF';
    var walesColor = '#CC7789';
    var northernIrelandColor = '#B41414';
    var restOfUkColor = '#AA4088';

    //(["#a60000","#ff0000", "#ff4040","#ff7373","#67e667","#39e639","#00cc00"]);
    /*var data = [
        {year:2008,eu_member_state:'Ireland',assault:16186,burglary:24682,drug_offences:5311,intentional_homicide:89,kidnapping:77,rape:348,robbery:2299,sexual_assault:903,sexual_violence:1251,theft:32554,police_officers:14411,male_police_officers:10233,female_police_officers:3229,prison_personell:3281,male_prison_personell:2702,female_prison_personell:579,total_prison_population:3484,adult_male_prisoners:2613,adult_female_prisoners:825,juvenile_prison_population:46,native_prisoners:3027,foreign_prisoners:457},
        {year:2009,eu_member_state:'Ireland',assault:15580,burglary:26910,drug_offences:5165,intentional_homicide:88,kidnapping:146,rape:329,robbery:2491,sexual_assault:1014,sexual_violence:1343,theft:33902,police_officers:14547,male_police_officers:10231,female_police_officers:3273,prison_personell:3225,male_prison_personell:2649,female_prison_personell:576,total_prison_population:3868,adult_male_prisoners:2790,adult_female_prisoners:1023,juvenile_prison_population:55,native_prisoners:3368,foreign_prisoners:500},
        {year:2010,eu_member_state:'Ireland',assault:15038,burglary:25420,drug_offences:5482,intentional_homicide:89,kidnapping:134,rape:442,robbery:3196,sexual_assault:1711,sexual_violence:2153,theft:35415,police_officers:14377,male_police_officers:10099,female_police_officers:3280,prison_personell:3105,male_prison_personell:2693,female_prison_personell:412,total_prison_population:4318,adult_male_prisoners:3122,adult_female_prisoners:1147,juvenile_prison_population:49,native_prisoners:3728,foreign_prisoners:590},
        {year:2011,eu_member_state:'Ireland',assault:14709,burglary:27695,drug_offences:5021,intentional_homicide:66,kidnapping:109,rape:451,robbery:2931,sexual_assault:1376,sexual_violence:1827,theft:36581,police_officers:13894,male_police_officers:10110,female_police_officers:3342,prison_personell:3310,male_prison_personell:2812,female_prison_personell:498,total_prison_population:4216,adult_male_prisoners:3054,adult_female_prisoners:1108,juvenile_prison_population:54,native_prisoners:3704,foreign_prisoners:512},
        {year:2012,eu_member_state:'Ireland',assault:13566,burglary:28133,drug_offences:4629,intentional_homicide:79,kidnapping:101,rape:517,robbery:2817,sexual_assault:1459,sexual_violence:1976,theft:37954,police_officers:13424,male_police_officers:10060,female_police_officers:3363,prison_personell:3433,male_prison_personell:2943,female_prison_personell:490,total_prison_population:4287,adult_male_prisoners:3118,adult_female_prisoners:1126,juvenile_prison_population:43,native_prisoners:3739,foreign_prisoners:548},
        {year:2013,eu_member_state:'Ireland',assault:12644,burglary:26218,drug_offences:4191,intentional_homicide:83,kidnapping:124,rape:453,robbery:2806,sexual_assault:1433,sexual_violence:1886,theft:31369,police_officers:13093,male_police_officers:10305,female_police_officers:3456,prison_personell:3432,male_prison_personell:2912,female_prison_personell:520,total_prison_population:4088,adult_male_prisoners:3188,adult_female_prisoners:832,juvenile_prison_population:68,native_prisoners:3654,foreign_prisoners:434},
        {year:2014,eu_member_state:'Ireland',assault:13206,burglary:27575,drug_offences:4958,intentional_homicide:80,kidnapping:125,rape:477,robbery:2648,sexual_assault:1436,sexual_violence:1913,theft:39970,police_officers:12799,male_police_officers:10423,female_police_officers:3421,prison_personell:3380,male_prison_personell:2909,female_prison_personell:471,total_prison_population:4218,adult_male_prisoners:3084,adult_female_prisoners:1062,juvenile_prison_population:72,native_prisoners:3833,foreign_prisoners:385},
        {year:2008,eu_member_state:'Scotland',assault:7892,burglary:25496,drug_offences:10315,intentional_homicide:95,kidnapping:319,rape:821,robbery:2963,sexual_assault:3297,sexual_violence:4118,theft:117033,police_officers:16675,male_police_officers:12711,female_police_officers:3964,prison_personell:3321,male_prison_personell:2531,female_prison_personell:790,total_prison_population:7827,adult_male_prisoners:6438,adult_female_prisoners:367,juvenile_prison_population:1021,native_prisoners:7559,foreign_prisoners:268},
        {year:2009,eu_member_state:'Scotland',assault:5621,burglary:23774,drug_offences:9901,intentional_homicide:84,kidnapping:269,rape:884,robbery:2496,sexual_assault:3412,sexual_violence:4296,theft:106587,police_officers:17273,male_police_officers:12924,female_police_officers:4349,prison_personell:3694,male_prison_personell:2809,female_prison_personell:885,total_prison_population:7964,adult_male_prisoners:6561,adult_female_prisoners:380,juvenile_prison_population:1023,native_prisoners:7654,foreign_prisoners:310},
        {year:2010,eu_member_state:'Scotland',assault:5493,burglary:25017,drug_offences:7138,intentional_homicide:95,kidnapping:260,rape:997,robbery:2557,sexual_assault:3220,sexual_violence:4217,theft:107894,police_officers:17217,male_police_officers:12758,female_police_officers:4459,prison_personell:3708,male_prison_personell:2782,female_prison_personell:926,total_prison_population:7853,adult_male_prisoners:6602,adult_female_prisoners:385,juvenile_prison_population:866,native_prisoners:7581,foreign_prisoners:272},
        {year:2011,eu_member_state:'Scotland',assault:4693,burglary:24222,drug_offences:6684,intentional_homicide:91,kidnapping:219,rape:1183,robbery:2244,sexual_assault:2908,sexual_violence:4091,theft:108956,police_officers:17343,male_police_officers:12707,female_police_officers:4636,prison_personell:3549,male_prison_personell:2736,female_prison_personell:813,total_prison_population:8178,adult_male_prisoners:6974,adult_female_prisoners:424,juvenile_prison_population:780,native_prisoners:7905,foreign_prisoners:273},
        {year:2012,eu_member_state:'Scotland',assault:3643,burglary:21515,drug_offences:5136,intentional_homicide:73,kidnapping:227,rape:1372,robbery:1832,sexual_assault:3008,sexual_violence:4380,theft:94551,police_officers:17436,male_police_officers:12676,female_police_officers:4760,prison_personell:4350,male_prison_personell:3256,female_prison_personell:1094,total_prison_population:8057,adult_male_prisoners:6941,adult_female_prisoners:425,juvenile_prison_population:690,native_prisoners:7769,foreign_prisoners:288},
        {year:2013,eu_member_state:'Scotland',assault:3268,burglary:22272,drug_offences:4806,intentional_homicide:63,kidnapping:254,rape:1690,robbery:1499,sexual_assault:3405,sexual_violence:5095,theft:95894,police_officers:17258,male_police_officers:12465,female_police_officers:4793,prison_personell:4510,male_prison_personell:3319,female_prison_personell:1191,total_prison_population:7894,adult_male_prisoners:6921,adult_female_prisoners:406,juvenile_prison_population:566,native_prisoners:7626,foreign_prisoners:268},
        {year:2014,eu_member_state:'Scotland',assault:3166,burglary:20607,drug_offences:4787,intentional_homicide:60,kidnapping:234,rape:1797,robbery:1497,sexual_assault:3727,sexual_violence:5524,theft:89598,police_officers:17254,male_police_officers:12377,female_police_officers:4877,prison_personell:4628,male_prison_personell:3357,female_prison_personell:1271,total_prison_population:7731,adult_male_prisoners:6800,adult_female_prisoners:399,juvenile_prison_population:532,native_prisoners:7591,foreign_prisoners:288}
    ];*/

    //  FORMATS for NUMBERS and DATES
    var parseDate = d3.time.format('%d/%m/%Y').parse;
    var numberFormat = d3.format('.0f');

    // loop through the data
    euCrimeStats.forEach(function(d){
        d.date = parseDate('01/01/'+d.year);
        d.totalCrimes = d.assault+d.burglary+d.drug_offences+d.intentional_homicide+d.kidnapping+d.rape+d.robbery+d.sexual_assault+d.sexual_violence+d.theft;
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
        //.colors(["#a60000","#ff0000", "#ff4040","#ff7373","#67e667","#39e639","#00cc00"]);

    /////////////////////////////////////////////////////////
    //  LINE CHART
    // X - AXIS is date
    // Y - AXIS is number of Assaults for the country
    /////////////////////////////////////////////////////////
    var dateDim = indexedData.dimension(function(d){return d.date});
    var minDate = dateDim.bottom(1)[0].date;
    var maxDate = dateDim.top(1)[0].date;

   // print_filter(dateDim);
    console.log('minDate'+minDate);
    console.log('maxDate'+maxDate);

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
        .width(400)
        .height(400)
        .dimension(dateDim)
        .group(irelandAssaultGrp,"Ireland")
        //.dashStyle([1,1])
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('Assaults')
        .xAxisLabel('Year')
        .colors(irelandColor);

    crimeLineChartEngland
        .width(400)
        .height(400)
        .dimension(dateDim)
        .group(englandAssaultGrp,"England")
        //.dashStyle([2,2])
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('Assaults')
        .xAxisLabel('Year')
        .colors(englandColor);

    crimeLineChartScotland
        .width(400)
        .height(400)
        .dimension(dateDim)
        .group(scotlandAssaultGrp,"Scotland")
        //.dashStyle([3,3])
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('Assaults')
        .xAxisLabel('Year')
        .colors(scotlandColor);

    crimeLineChartWales
        .width(400)
        .height(400)
        .dimension(dateDim)
        .group(scotlandAssaultGrp,"Wales")
        //.dashStyle([4,4])
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('Assaults')
        .xAxisLabel('Year')
        .colors(walesColor);

    crimeLineChartNorthernIreland
        .width(400)
        .height(400)
        .dimension(dateDim)
        .group(scotlandAssaultGrp,"Northern Ireland")
        //.dashStyle([5,5])
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('Assaults')
        .xAxisLabel('Year')
        .colors(northernIrelandColor);

    crimeLineChartRestOfUk
        .width(400)
        .height(400)
        .dimension(dateDim)
        .group(restOfUKAssaultGrp,"Scotland,Wales,N.I.")
        //.dashStyle([5,5])
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('Assaults')
        .xAxisLabel('Year')
        .colors(restOfUkColor);

    countriesLineChart
        .width(800)
        .height(400)
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


