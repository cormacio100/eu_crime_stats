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
var crimeLineChartAustria = dc.lineChart('#chart-line-austria');
var crimeLineChartDenmark = dc.lineChart('#chart-line-denmark');
var crimeLineChartFinland = dc.lineChart('#chart-line-finland');
var crimeLineChartIreland = dc.lineChart('#chart-line-ireland');
var crimeLineChartNorthernIreland = dc.lineChart('#chart-line-northern-ireland');
var crimeLineChartNorway = dc.lineChart('#chart-line-norway');
var crimeLineChartScotland = dc.lineChart('#chart-line-scotland');
var crimeLineChartSlovakia = dc.lineChart('#chart-line-slovakia');
var crimeLineChartSweden = dc.lineChart('#chart-line-sweden');
var crimeLineChartWales = dc.lineChart('#chart-line-wales');
var crimeLineChartRestOfUk = dc.lineChart('#chart-line-rest-of-uk');
var countriesLineChart = dc.compositeChart('#chart-line-compare-countries');

var austriaColor = '#B41414';
var denmarkColor = '#f9e909';
var finlandColor = '#c4a509';
var irelandColor = '#93B240';
var norwayColor = '#E1DDAA';
var scotlandColor = '#80afa6';
var slovakiaColor = '#3a4f4b';
var swedenColor = '#36ed25';
var irelandColor = '#a01e61';
var walesColor = '#CC7711';
var northernIrelandColor = '#24beed';
var restOfUkColor = '#1199aa';

var svgWidth = 850;
var svgHeight = 200;

//  RETRIEVE DATA FROM API
queue()
    .defer(d3.json,'/charts/data')
    .await(parseData);

function parseData(error,jsonData) {
    var euCrimeStats = jsonData;
    //  FORMATS for NUMBERS and DATES
    var parseDate = d3.time.format('%d/%m/%Y').parse;
    var numberFormat = d3.format('.0f');
    // loop through the data
    euCrimeStats.forEach(function (d) {
        d.date = parseDate('01/01/' + d.year);
        var total = d.assault + d.burglary + d.drugs + d.intentional_homicide + d.kidnapping + d.rape + d.robbery + d.sexual_assault + d.sexual_violence + d.theft;
        if(isNaN(total)){
            d.totalCrimes = 0;
        }else{
            d.totalCrimes = total;
        }
    });
    buildGraphs(euCrimeStats);
}