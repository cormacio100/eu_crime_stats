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
var yearPieChart = dc.pieChart('#chart-ring-year');
var crimeLineChart = dc.lineChart('#chart-line-annual-crimes');
var dataTable = dc.dataTable('#dc-data-table');

var data = [
    {year:2008,eu_member_state:'Ireland',assault:16186,burglary:24682,drug_offences:5311,intentional_homicide:89,kidnapping:77,rape:348,robbery:2299,sexual_assault:903,sexual_violence:1251,theft:32554,police_officers:14411,male_police_officers:10233,female_police_officers:3229,prison_personell:3281,male_prison_personell:2702,female_prison_personell:579,total_prison_population:3484,adult_male_prisoners:2613,adult_female_prisoners:825,juvenile_prison_population:46,native_prisoners:3027,foreign_prisoners:457},
    {year:2009,eu_member_state:'Ireland',assault:15580,burglary:26910,drug_offences:5165,intentional_homicide:88,kidnapping:146,rape:329,robbery:2491,sexual_assault:1014,sexual_violence:1343,theft:33902,police_officers:14547,male_police_officers:10231,female_police_officers:3273,prison_personell:3225,male_prison_personell:2649,female_prison_personell:576,total_prison_population:3868,adult_male_prisoners:2790,adult_female_prisoners:1023,juvenile_prison_population:55,native_prisoners:3368,foreign_prisoners:500},
    {year:2010,eu_member_state:'Ireland',assault:15038,burglary:25420,drug_offences:5482,intentional_homicide:89,kidnapping:134,rape:442,robbery:3196,sexual_assault:1711,sexual_violence:2153,theft:35415,police_officers:14377,male_police_officers:10099,female_police_officers:3280,prison_personell:3105,male_prison_personell:2693,female_prison_personell:412,total_prison_population:4318,adult_male_prisoners:3122,adult_female_prisoners:1147,juvenile_prison_population:49,native_prisoners:3728,foreign_prisoners:590},
    {year:2011,eu_member_state:'Ireland',assault:14709,burglary:27695,drug_offences:5021,intentional_homicide:66,kidnapping:109,rape:451,robbery:2931,sexual_assault:1376,sexual_violence:1827,theft:36581,police_officers:13894,male_police_officers:10110,female_police_officers:3342,prison_personell:3310,male_prison_personell:2812,female_prison_personell:498,total_prison_population:4216,adult_male_prisoners:3054,adult_female_prisoners:1108,juvenile_prison_population:54,native_prisoners:3704,foreign_prisoners:512},
    {year:2012,eu_member_state:'Ireland',assault:13566,burglary:28133,drug_offences:4629,intentional_homicide:79,kidnapping:101,rape:517,robbery:2817,sexual_assault:1459,sexual_violence:1976,theft:37954,police_officers:13424,male_police_officers:10060,female_police_officers:3363,prison_personell:3433,male_prison_personell:2943,female_prison_personell:490,total_prison_population:4287,adult_male_prisoners:3118,adult_female_prisoners:1126,juvenile_prison_population:43,native_prisoners:3739,foreign_prisoners:548},
    {year:2013,eu_member_state:'Ireland',assault:12644,burglary:26218,drug_offences:4191,intentional_homicide:83,kidnapping:124,rape:453,robbery:2806,sexual_assault:1433,sexual_violence:1886,theft:31369,police_officers:13093,male_police_officers:10305,female_police_officers:3456,prison_personell:3432,male_prison_personell:2912,female_prison_personell:520,total_prison_population:4088,adult_male_prisoners:3188,adult_female_prisoners:832,juvenile_prison_population:68,native_prisoners:3654,foreign_prisoners:434},
    {year:2014,eu_member_state:'Ireland',assault:13206,burglary:27575,drug_offences:4958,intentional_homicide:80,kidnapping:125,rape:477,robbery:2648,sexual_assault:1436,sexual_violence:1913,theft:39970,police_officers:12799,male_police_officers:10423,female_police_officers:3421,prison_personell:3380,male_prison_personell:2909,female_prison_personell:471,total_prison_population:4218,adult_male_prisoners:3084,adult_female_prisoners:1062,juvenile_prison_population:72,native_prisoners:3833,foreign_prisoners:385}
];

var indexedData = crossfilter(data);

//  Loop Through the data
data.forEach(function(d){
    d.totalCrimes = d.assault+d.burglary+d.drug_offences+d.intentional_homicide+d.kidnapping+d.rape+d.robbery+d.sexual_assault+d.sexual_violence+d.theft;
})
print_filter('data');

//  Create DIMENSION
var yearDim = indexedData.dimension(function(d){return +d.year;});

//////////////////////////////////////////////////////////////
//  DATA FOR YEAR PIE CHART
//////////////////////////////////////////////////////////////
var yearly_total = yearDim.group().reduceSum(function(d){return d.totalCrimes;});

yearPieChart
    .width(300)
    .height(300)
    .slicesCap(10)
    .innerRadius(50)
    .dimension(yearDim)
    .group(yearly_total);
    //.colors(['#9AB240','#9EC6FF','#E1FF74','#CC5749','#B21400']);


//////////////////////////////////////////////////////////////
//  DATA FOR CRIME LINE CHART
//////////////////////////////////////////////////////////////
//  Create GROUPINGS
var assault = yearDim.group().reduceSum(function(d){
   return d.assault;
});
var burglary = yearDim.group().reduceSum(function(d){
   return d.burglary;
});
var drug_offences = yearDim.group().reduceSum(function(d){
   return d.drug_offences;
});
var intentional_homicide = yearDim.group().reduceSum(function(d){
   return d.intentional_homicide;
});
/*kidnapping
rape
robbery
sexual_assault
sexual_violence
theft*/
//  Define the RANGE of the X-AXIS of Years
var minYear = yearDim.bottom(1)[0].year;
var maxYear = yearDim.top(1)[0].year;

crimeLineChart
    .width(900)
    .height(300)
    .dimension(yearDim)
    .group(assault,"assault")
    .stack(burglary,"burglary")
    .stack(drug_offences,"drug_offences")
    .stack(intentional_homicide,"intentional_homicide")
    .renderArea(true)
    .brushOn(false)
    .x(d3.scale.linear().domain([minYear,maxYear]))
    .legend(dc.legend()
                .x(750)
                .y(10)
                .itemHeight(13)
        .gap(5))
    .yAxisLabel('Amount')
    .xAxisLabel('Years');

//////////////////////////////////////////////////////////////
//  DISPLAY ALL CHARTS
//////////////////////////////////////////////////////////////



dc.renderAll();