/*
 * Daan Molleman
 * 11275820
 * Javascript line graph
*/

// define graph boundaries
var GRAPH_TOP = 25;
var GRAPH_BOTTOM = 325;
var GRAPH_LEFT = 25;
var GRAPH_LEFT_NEW = 775;
var GRAPH_RIGHT = 625;
var GRAPH_RIGHT_NEW = 1400;

var GRAPH_HEIGHT = 300;
var GRAPH_WIDTH = 600;

function createTransform(domain, range){

  var domain_min = domain[0]
  var domain_max = domain[1]
  var range_min = range[0]
  var range_max = range[1]

  // formulas to calculate the alpha and the beta
  var alpha = (range_max - range_min) / (domain_max - domain_min)
  var beta = range_max - alpha * domain_max

  // returns the function for the linear transformation (y= a * x + b)
  return function(x){
    return alpha * x + beta;
    }
}

function getPixels(domain, range, values, axis) {
    creation = createTransform(domain, range)
    console.log(axis, values.length)
    list = []
    if(axis === "x") {
      for(var i = 2; i < values.length; ++i) {
        list.push(creation(i))
      }
    }
    else if(axis === "y") {
      for(var i = 2; i < values.length; ++i) {
        list.push(creation(values[i]))
      }
    }
    else if(axis === "ytag") {
      for (var i = 0; i < values.length; ++i) {
        list.push(creation(values[i]))
      }
    }

    return list
}

function drawGraph(ctx) {

  // draw graph boundaries
  ctx.moveTo( GRAPH_LEFT, GRAPH_BOTTOM );
  ctx.lineTo( GRAPH_RIGHT, GRAPH_BOTTOM );
  ctx.lineTo( (GRAPH_RIGHT - 5), ( GRAPH_BOTTOM - 5))
  ctx.lineTo( (GRAPH_RIGHT + 5), ( GRAPH_BOTTOM - 10))
  ctx.lineTo( GRAPH_RIGHT, ( GRAPH_BOTTOM - 15));
  ctx.lineTo( GRAPH_RIGHT, GRAPH_TOP );

  // second graph boundaries
  ctx.moveTo( GRAPH_LEFT_NEW, GRAPH_TOP );
  ctx.lineTo( GRAPH_LEFT_NEW, GRAPH_BOTTOM );
  ctx.lineTo( GRAPH_RIGHT_NEW, GRAPH_BOTTOM);
  ctx.stroke()
}

function drawData(ctx, xPixels, yPixels) {
  ctx.beginPath();
  ctx.lineJoin = "round";
  ctx.strokeStyle = "black";
  ctx.moveTo(xPixels[0], yPixels[0]);

  // draw the line
  for(var i = 1; i < yPixels.length; ++i) {
    ctx.lineTo(xPixels[i], yPixels[i]);
  }
  ctx.stroke()
}

function drawTags(ctx, xPixels, yPixels, size) {

  // draw labels and title
  ctx.fillText( "Quarter", GRAPH_RIGHT / 3, GRAPH_BOTTOM + 50);
  ctx.fillText( "Quarter", GRAPH_RIGHT / 3 + GRAPH_RIGHT, GRAPH_BOTTOM + 50);
  ctx.fillText( "Employment rate", GRAPH_RIGHT + 30, GRAPH_HEIGHT / 2);
  ctx.fillText( "Employment rate in England", GRAPH_RIGHT / 3, GRAPH_TOP - 10)

  year = 2013
  quarter = 4
  halfDist = 0.5 * (xPixels[1] - xPixels[0])

  // draw segments with quarter and year
  ctx.moveTo(xPixels[0], GRAPH_BOTTOM);

  for(var i = 0; i < xPixels.length; ++i) {
    ctx.lineTo(xPixels[i], GRAPH_BOTTOM + 5);
    ctx.fillText(quarter, (xPixels[i] + halfDist), (GRAPH_BOTTOM + 10))
    ctx.moveTo(xPixels[i + 1], GRAPH_BOTTOM);
    quarter %= 4;
    quarter += 1;
    if (quarter === 1) {
      year += 1;
      ctx.fillText(year, (xPixels[i + 1] + 14), (GRAPH_BOTTOM + 20));
    }
  }

  if(size === "s") {
    // create array for y axis tags in the graph
    yTags = [71, 72, 73, 74];
    yTagPix = getPixels([71, 75], [300, 0], yTags, "ytag")

    // draw the y axis tags
    for(var i = 0; i < yTags.length; ++i) {
      ctx.moveTo(GRAPH_RIGHT, yTagPix[i]);
      ctx.lineTo(GRAPH_RIGHT + 5, yTagPix[i]);
      ctx.fillText(yTags[i], (GRAPH_RIGHT + 10), (yTagPix[i]));
      ctx.moveTo(GRAPH_RIGHT, yTagPix[i + 1])
    }
  }
  else if(size === "l") {
    yTags = [0, 25, 50, 75];
    yTagPix = getPixels([0, 100], [300, 0], yTags, "ytag")

    // draw second y axis
    for(var i = 0; i < yTags.length; ++i) {
      ctx.moveTo(GRAPH_LEFT_NEW, yTagPix[i]);
      ctx.lineTo(GRAPH_LEFT_NEW - 5, yTagPix[i]);
      ctx.fillText(yTags[i], (GRAPH_LEFT_NEW - 20), (yTagPix[i]));
      ctx.moveTo(GRAPH_LEFT_NEW, yTagPix[i + 1]);
    }
  }

  ctx.stroke()

  // draw reference lines
  ctx.beginPath();
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#BBB"
  for(var i = 0; i < yTags.length; ++i) {
    ctx.moveTo(GRAPH_RIGHT, yTagPix[i]);
    ctx.lineTo(GRAPH_LEFT, yTagPix[i]);
  }
  for(var i = 0; i < yTags.length; ++i) {
    ctx.moveTo(GRAPH_LEFT_NEW, yTagPix[i]);
    ctx.lineTo(GRAPH_RIGHT_NEW, yTagPix[i])
  }
  ctx.stroke()
}


var fileName = "data.json";
var txtFile = new XMLHttpRequest();
txtFile.onreadystatechange = function() {
    if (txtFile.readyState === 4 && txtFile.status == 200) {
        stats = JSON.parse(txtFile.responseText);

        list = Object.keys(stats["England"])
        values = []
        list.forEach(function(element) {
            values.push(stats['England'][element]);
        });

        xPixels = getPixels([1, 14], [0, 600], list, "x")
        yPixels = getPixels([71, 75], [300, 0], values, "y")
        xPixels2 = getPixels([1, 14], [750, 1350], values, "x")
        yPixels2 = getPixels([0, 100], [300, 0], values, "y")

        var canvas = document.getElementById('myCanvas');
        var ctx = canvas.getContext('2d');

        drawGraph(ctx);
        drawTags(ctx, xPixels, yPixels, "s");
        drawTags(ctx, xPixels2, yPixels2, "l")
        drawData(ctx, xPixels, yPixels);
        drawData(ctx, xPixels2, yPixels2)
    }
}
txtFile.open("GET", fileName);
txtFile.send();
