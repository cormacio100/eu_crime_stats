// HELPER FUNCTION to to see if filters are working correctly
function print_filter(filter){
    //	first check that the filter if of valid type
    var f=eval(filter);
    if (typeof(f.length) != "undefined") {}else{}
    if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
    if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
    console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
}

var irelandColor = '#93B240';
var englandColor = '#E1DDAA';
var scotlandColor = '#9EC6FF';
var walesColor = '#CC7789';
var northernIrelandColor = '#B41414';
var restOfUkColor = '#AA4088';

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
        d.totalCrimes = d.assault + d.burglary + d.drugs + d.intentional_homicide + d.kidnapping + d.rape + d.robbery + d.sexual_assault + d.sexual_violence + d.theft;
    });

    buildGraphs(euCrimeStats);
}