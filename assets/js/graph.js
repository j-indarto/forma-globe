GRAPH_DIV = "graph";
GRAPH_SVG = "graph_svg";

var m = [40, 55, 40, 40],
    w = 550 - m[1] - m[3],
    h = 240 - m[0] - m[2],
    parse = d3.time.format("%Y-%m-%d").parse;

var min_date = "2007-01-01";
var countries, forma_data, agg_data;

var aggForma = function(data) {
  var result = {}, res = [];
 
  for(var i=0; i<data.length; i++)  {
    if(data[i].date in result)
    {  
      result[data[i].date] += data[i].count;
    }
    else { 
      result[data[i].date] = data[i].count;
    }
  }

  return result

}




var loadForma = function() {

  d3.csv("/assets/data/counts.csv", function(values) {

    forma_data = values.filter(function(d) { 
      return parse(d.date) > parse(min_date) 
    });

   countries = d3.set(forma_data.map(function(d) { return d.iso })).values();

    // Parse dates and numbers. We assume values are sorted by date.
    forma_data.forEach(function(d) {
      d.date = parse(d.date);
      d.count = +d.count;
    });


  })
};



// show iso and first date on page
var displayData = function(iso) {
  // filter out data not for iso
  country_vals = forma_data.filter(function(d) {
    return d.iso == iso
  })

};

// set up axes
var x = d3.time.scale().range([0, w]),
    y = d3.scale.linear().range([h, 0]),
    xAxis = d3.svg.axis().scale(x),
    // change orientation to move labels to opposite side of axis line
    yAxis = d3.svg.axis().scale(y).orient("right");

// A line generator, for the dark stroke.
var line = d3.svg.line()
    .interpolate("monotone")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.count); });

var createChartElements = function() {

  group.append("svg:g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + h + ")");

  group.append("svg:g")
      .attr("class", "y axis")
      // move y-axis to right side
      .attr("transform", "translate(" + w + ",0)");

  group.append("svg:path")
       .attr("class", "graph-line")
       .attr("clip-path", "url(#clip)");

}

var filterData = function(iso) {
 data = forma_data.filter(function(d) {
   return d.iso == iso;
 });

 return data
}

var updateGraph = function (data) {

  // Compute the minimum and maximum date, and the maximum price.
  x.domain([parse(min_date), data[data.length - 1].date]);
  y.domain([0, d3.max(data, function(d) { return d.count; })]).nice();

   // Add graph line
  group.selectAll(".graph-line")
       .attr("d", line(data));

  // add x-axis
  group.select(".x.axis")
      .call(xAxis);

  // add y-axis
  group.select(".y.axis")
       .call(yAxis);

       // turn on animations

       var t = group.transition().duration(9000);
       t.select(".y.axis").call(yAxis);
       t.select(".x.axis").call(xAxis);
       t.select(".graph-line").attr("d", line(data));
}

// load FORMA data
forma_data = loadForma();

// add graph svg element
graph = d3.selectAll("#" + GRAPH_DIV)
  .append("svg")
  .attr("id", GRAPH_SVG)
  .attr("float", "left")
  .attr("width", w + m[1] + m[3])
  .attr("height", h + m[0] + m[2]);

// add SVG group for graph
group = graph.append("svg:g")
             .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

createChartElements();
