// Based on http://paperjs.org/examples/smoothing/
var w,
  h,
  vis = d3
    .select("#vis")
    .append("svg")
    .attr("pointer-events", "all"),
  points = 10,
  path,
  mouse = [0, 0],
  pathHeight;

vis.append("rect").attr("fill", "white");
const wave = vis.append("path").attr("fill", "red");

var line = d3.line().curve(d3.curveBasis);

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

// vis
//     .on("mousemove", function() {
//       mouse = d3.mouse(this);
//       vis.select("path").attr("fill", fill(mouse[1]));
//       d3.event.preventDefault();
//     })
//     .on("touchmove", function() {
//       var touches = d3.touches(this);
//       if (touches.length === 0) return;
//       mouse = touches[0];
//       vis.select("path").attr("fill", fill(mouse[1]));
//       d3.event.preventDefault();
//     })
//     .on("mousedown", function() {
//       line.interpolate(interpolators[interpolator = (interpolator + 1) % interpolators.length]);
//     })

d3.select(window).on("resize", init);

init();

d3.timer(step);

function step(elapsed) {
  pathHeight += (h / 2 - mouse[1] - pathHeight) / 10;

  for (var i = 1; i < points; i++) {
    const sinSeed = elapsed / 10 + (i + (i % 10)) * 100;
    const sinHeight = Math.sin(sinSeed / 200) * pathHeight;
    path[i][1] = Math.sin(sinSeed / 1000) * sinHeight + h / 2;
  }
  wave.attr("d", line(path));
}
