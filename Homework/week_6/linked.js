// Daan Molleman
// 11275820
// Linked baseball View

// world series history stats
wsh = "data1.json"
// last season team stats
laststats = "data2.json"

// define width and height
var w = 1000
var h = 450
var margins = {left:40, right:20, upper:20, lower:20, bars:4}

// create variable for quick tooltip access
var myTool = d3.select("body")
               .append("div")
               .attr("class", "mytooltip")
               .style("opacity", "0")
               .style("display", "none");

// create variable for quick svg acces
var svg = d3.selectAll("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h)

// var requests = [d3.json(wsh), d3.json(laststats)];

window.onload = function() {

  // request api
  d3.json(wsh).then(function(data) {
      window.majorleague = data
      createScales(majorleague)
      drawScales()
      drawRect(majorleague)
  })
}

function createScales(set1) {
  window.xScale = d3.scaleLinear()
                    .domain([0, Object.values(set1).length])
                    .range([margins.left, w - margins.right]);
  window.yScale = d3.scaleLinear()
                    .domain([0, 40])
                    .range([h-margins.lower, margins.upper]);
}

function calc(set, stat) {
    /* calculate a min or max from an array of objects */
    stats = [];
    for (i in set) {
      stats.push(set[i][Object.keys(set[i])])
    }
    if(stat === "max") {
        return Math.max.apply(null, stats)
    } else {
        return Math.min.apply(null, stats)
    }
}

function drawRect(teams) {

  var rects = svg.selectAll("rect")
                 .data(teams)
                 .enter()
                 .append("rect");

  // draw the bars
  rects.data(teams)
       .attr("x", function(d, i) {
          return xScale(i);
       })
       .attr("y", function(d) {
          return yScale(d['wins'])
       })
       .attr("width", w / teams.length - margins.bars)
       .attr("height", function(d) {
          return h - yScale(d["wins"]) - margins.upper
       })
       .attr("class", "bar")

       /* show tooltip and change colour when mouse is on bar
       the following code comes from the source named atop the doc */
       .on("mouseover", function(d) {
          d3.select(this)
               .style("cursor", "pointer")
               .attr("class", "sel")
               myTool
                 .transition()
                 .duration(300)
                 .style("opacity", "1")
                 .style("display", "block")
       })

       // keep the tooltip above the mouse when mouse is on bar
       .on("mousemove", function(d) {
          d3.select(this)
          myTool
            .html("<div id='thumbnail'><span>" + d["team"] + "\n" + d["wins"] + "</div>")
            .style("left", (d3.event.pageX - 60) + "px")
            .style("top", (d3.event.pageY - 60) + "px")
       })

       // remove tooltip and restore colour
       .on("mouseout", function(d, i) {
          d3.select(this)
            .style("cursor", "normal")
            .attr("class", "bar")
            myTool
              .transition()
              .duration(300)
              .style("opacity", "0")
              .style("display", "none")
       })

   var lose = svg.selectAll(".loss")
                  .data(teams)
                  .enter()
                  .append("rect");

    // draw losses
    lose.data(teams)
         .attr("x", function(d, i) {
            return xScale(i);
         })
         .attr("y", function(d, i) {
            return yScale(d['losses']) - (h - yScale(d["wins"]) - margins.lower);
         })
         .attr("width", w / teams.length - margins.bars)
         .attr("height", function(d) {
            return h - yScale(d["losses"]) - margins.upper
         })
         .attr("class", "loss")

         /* show tooltip and change colour when mouse is on bar
         the following code comes from the source named atop the doc */
         .on("mouseover", function(d) {
            d3.select(this)
                 .style("cursor", "pointer")
                 .attr("class", "losssel")
                 myTool
                   .transition()
                   .duration(300)
                   .style("opacity", "1")
                   .style("display", "block")
         })

         // keep the tooltip above the mouse when mouse is on bar
         .on("mousemove", function(d) {
            d3.select(this)
            myTool
              .html("<div id='thumbnail'><span>" + d["team"] + "\n" + d["losses"] + "</div>")
              .style("left", (d3.event.pageX - 60) + "px")
              .style("top", (d3.event.pageY - 60) + "px")
         })

         // remove tooltip and restore colour
         .on("mouseout", function(d, i) {
            d3.select(this)
              .style("cursor", "normal")
              .attr("class", "loss")
              myTool
                .transition()
                .duration(300)
                .style("opacity", "0")
                .style("display", "none")
         })
}

function drawScales() {
    /* draw the x and y scale */

     svg.selectAll("label")
        .data(majorleague)
        .enter()
        .append("text")
        .text(function(d) {
          return d["team"].substring(0,3);
        })
        .attr("x", function(d, i) {
          return xScale(i);
        })
        .attr("y", h)
        .attr("class", "label");

    // call y-axis ticks
    svg.append("g")
       .attr("class", "yaxis")
       .attr("transform", "translate(" + margins.left + ",0)")
       .call(d3.axisLeft(yScale));

    // create y axis label
    svg.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0)
       .attr("x",0 - (h / 2))
       .attr("dy", "1em")
       .style("text-anchor", "middle")
       .style("font-family", "Monospace")
       .text("Number of wins and losses");

    // svg.selectAll(".label")
    //    // .attr("y", 0)
    //    //  .attr("x", 9)
    //    //  .attr("dy", ".35em")
    //     .attr("transform", "rotate(90)")
    //     // .style("text-anchor", "start");
}
