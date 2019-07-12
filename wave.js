import { select, mouse, event } from "d3-selection";
import { line, curveBasis } from "d3-shape";
import { timer } from "d3-timer";
const d3 = Object.assign(
  {},
  {
    select,
    mouse,
    event,
    line,
    curveBasis,
    timer
  }
);

const vis = d3
    .select("#vis")
    .append("svg")
    .attr("pointer-events", "all"),
  points = 10;

const wave = vis.append("path").attr("fill", "#4b6584");
const shape = d3.line().curve(d3.curveBasis);

let w,
  h,
  path,
  mousePosition = [0, 0],
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
    path.push([-100, h]);
    for (var i = 0; i < points; i++) path.push([(w / points) * i, h / 4]);
    path.push([w + 100, h]);
    pathHeight = h / 2;
  } else {
    for (var i = 1; i < points + 1; i++) {
      path[i][0] = (w / points) * i;
      path[i][1] = (path[i][1] / oldh) * h;
    }
    pathHeight = (pathHeight / oldh) * h;
  }
}

window.addEventListener("mousemove", function(e) {
  mousePosition = [Math.min(e.clientX, 600), e.clientY];
});

d3.select(window).on("resize", init);

function step(elapsed) {
  pathHeight +=
    (h / 2 - (mousePosition[1] / 2 + mousePosition[0] / 2) - pathHeight) / 10;

  for (var i = 1; i < points + 1; i++) {
    const sinSeed = elapsed / 10 + (i + (i % 10)) * 100;
    path[i][1] =
      Math.sin(sinSeed / 100) * Math.sin(sinSeed / 200) * pathHeight + h / 1.1;
  }

  wave.attr("d", shape(path));
}

init();
d3.timer(step);
