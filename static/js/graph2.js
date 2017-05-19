// HELPER FUNCTION to to see if filters are working correctly
function print_filter(filter){
    //	first check that the filter if of valid type
    var f=eval(filter);
    if (typeof(f.length) != "undefined") {}else{}
    if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
    if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
    console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
}

var assaultLineChart = dc.lineChart('#assault-line-chart');
var burglaryLineChart = dc.lineChart('#burglary-line-chart');
var drugsLineChart = dc.lineChart('#drugs-line-chart');
var ihLineChart = dc.lineChart('#ih-line-chart');
var kidnappingLineChart = dc.lineChart('#kidnapping-line-chart');
var rapeLineChart = dc.lineChart('#rape-line-chart');
var robberyLineChart = dc.lineChart('#robbery-line-chart');
var saLineChart = dc.lineChart('#sa-line-chart');
var svLineChart = dc.lineChart('#sv-line-chart');
var theftLineChart = dc.lineChart('#theft-line-chart');
var crimeCompositeChart = dc.compositeChart('#crime-comparison-chart');

 var palette = {
        "lightgray": "#819090",
        "gray": "#708284",
        "mediumgray": "#536870",
        "darkgray": "#475B62",
        "darkblue": "#0A2933",
        "darkerblue": "#042029",
        "paleryellow": "#FCF4DC",
        "paleyellow": "#EAE3CB",
        "yellow": "#A57706",
        "orange": "#BD3613",
        "red": "#D11C24",
        "pink": "#C61C6F",
        "purple": "#595AB7",
        "blue": "#2176C7",
        "green": "#259286",
        "yellowgreen": "#738A05"
      };

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