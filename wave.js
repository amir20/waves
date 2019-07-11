import * as d3 from "d3";

const vis = d3
    .select("#vis")
    .append("svg")
    .attr("pointer-events", "all"),
  points = 10;

const wave = vis.append("path").attr("fill", "lightblue");
const line = d3.line().curve(d3.curveBasis);

let w,
  h,
  path,
  mouse = [0, 0],
  pathHeight;

function init() {
  var oldh = h;
  w = window.innerWidth;
  h = window.innerHeight;
  vis
    .attr("width", w)
    .attr("height", h)
    .select("rect")
    .attr("width", w)
    .attr("height", h);
  if (!oldh) {
    path = [];
    path.push([0, h]);
    for (var i = 1; i < points; i++) path.push([(w / points) * i, h / 4]);
    path.push([w, h]);
    pathHeight = h / 2;
  } else {
    for (var i = 0; i <= points; i++) {
      path[i][0] = (w / points) * i;
      path[i][1] = (path[i][1] / oldh) * h;
    }
    pathHeight = (pathHeight / oldh) * h;
  }
}

vis.on("mousemove", function() {
  mouse = d3.mouse(this);
  d3.event.preventDefault();
});

d3.select(window).on("resize", init);

init();

d3.timer(step);

function step(elapsed) {
  pathHeight += (h / 2 - (mouse[1] / 2 + mouse[0] / 2) - pathHeight) / 10;

  for (var i = 1; i < points; i++) {
    const sinSeed = elapsed / 10 + (i + (i % 10)) * 100;
    path[i][1] =
      Math.sin(sinSeed / 100) * Math.sin(sinSeed / 200) * pathHeight + h / 1.1;
  }
  wave.attr("d", line(path));
}
