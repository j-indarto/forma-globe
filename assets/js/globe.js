var width = 610,
    height = 610;

var m0 = null, o0;
var velocity = .01, then = Date.now();  

var circle = d3.geo.circle();

var projection = d3.geo.orthographic()
  .center([0, 0])
  .scale(300)
  .clipAngle(90)
  .rotate([0, 0])
  .translate([305, 305]);

var svg = d3.select("#globe")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .on("click", stopAnimation)
  .on("mouseup", mouseup)
  .on("mousedown", mousedown)
  .on("mousemove", mousemove);

d3.select(window)
    .on("mousemove", mousemove)
    .on("mouseup", mouseup);

var path = d3.geo.path()
  .projection(projection);

var world = svg.append("svg:g");

svg.append("circle")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", 299);

var title = d3.select("#namer");

// load and display the world
d3.json("/assets/data/world_forma.json", function(error, topology) {
  var countries = topojson.feature(topology, topology.objects.ne_110m_admin_0_countries_forma)
  world.selectAll("path")
    .data(countries.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", function(d) { if (d.properties.forma == 1) 
                                    {return "forma"} })
    .on("click", mouseOver)
    .on("mouseout", mouseOut)
});
  
function mousedown() {  // remember where the mouse was pressed, in canvas coords
  m0 = [d3.event.pageX, d3.event.pageY];
  o0 = projection.rotate();
  d3.event.preventDefault();
}

function mousemove() {
  if (m0) {  // if mousedown
    var m1 = [d3.event.pageX, d3.event.pageY],   
    o1 = [o0[0] - (m0[0] - m1[0]) / 8, o0[1] - (m1[1] - m0[1]) / 8];
    projection.rotate(o1);
    svg.selectAll("path").attr("d", path); 
  }
}

function mouseup() {
  if (m0) {
    mousemove();
    m0 = null;
  }
}

function mouseOver (d) {
  var isForma = d.properties.forma
  if (isForma == 1) {
    displayData(d.properties.iso);
    title.text(d.properties.admin);      
    d3.selectAll("#" + GRAPH_SVG)
          .transition(100)

    data = filterData(d.properties.iso);
    updateGraph(data);
    graph.attr("opacity", 1);
  }

  else {
    title.text("Humid Tropics");
    data = filterData("IDN");
    updateGraph(data);
    graph.attr("opacity", 1);
  }
};

function mouseOut (d){
      graph.attr("opacity", 1)

}

function startAnimation() {
  d3.timer(function() {  
    var angle = velocity * (Date.now() - then);  
    projection.rotate([angle, 0, 0]);  
    svg.selectAll("path")  
      .attr("d", path)}
)};

startAnimation();

function stopAnimation() {
  d3.timer();
};
