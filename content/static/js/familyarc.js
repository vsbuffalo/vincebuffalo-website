var width = 760,
    height = 400;
var arcwidth = 30;
var π = Math.PI,
    φ = (1 + Math.sqrt(5))/2,
    ψ = (1 - Math.sqrt(5))/2;

var numXAncestors = function(gen) {
    return (Math.pow(φ, gen+2) - Math.pow(ψ, gen+2))/Math.sqrt(5);
};

var plural = function(str, n) {
  return n > 1 ? str + "s" : str;
}


var genArc = function(k) {
  var arcs = [], id = 0;
  for (var i = 1; i <= k; i++) {
    var nancestors = Math.pow(2, i);
    var ind_angle  = π/nancestors;
    var last_angle = -π/2;
    for (var j = 0; j < nancestors; j++ ) {
      var tmp = last_angle + ind_angle;
      var arc = d3.svg.arc()
                .innerRadius(i*arcwidth + arcwidth)
                .outerRadius(i*arcwidth + 2*arcwidth)
                .startAngle(last_angle)
                .endAngle(ind_angle + last_angle);
      last_angle += ind_angle;
      var sex = ["male", "female"][j % 2];
      var relat = ["father", "mother"][j % 2];
      arcs.push({"arc":arc, "sex":sex, "id": id, "gen": i, "relation":relat});
      id++;
    }
  }
  return {"arcs":arcs};
};


var genAutoArcWithData = function(data, blockfun) {
  var k = data.ngens;
  var arcs = [], id = 0;
  for (var i = 1; i <= k; i++) {
    var nancestors = Math.pow(2, i);
    var ind_angle  = π/nancestors;
    var last_angle = -π/2;
    for (var j = 0; j < nancestors; j++) {
      var tmp = last_angle + ind_angle;
      var arc = d3.svg.arc()
                .innerRadius(i*arcwidth + arcwidth)
                .outerRadius(i*arcwidth + 2*arcwidth)
                .startAngle(last_angle)
                .endAngle(ind_angle + last_angle);
      last_angle += ind_angle;
      var blocks = null, sex=null;
      if (data.inds[i][j] !== undefined) {
        // lookup blocks in kid
        blocks = blockfun(data.inds[i][j]);
        sex = ["female", "male"][data.inds[i][j].sex];
        relat = ["mother", "father"][data.inds[i][j].sex];
      };
      arcs.push({"arc":arc, "sex":sex, "id": id,
                "blocks": blocks,
                "gen": i, "relation": relat}); 
      id++;
    }
  }
  return {"arcs":arcs};
};

var createLookup = function(data) {
  // build a lookup for nodes, hashed by ID
  var inds = {};
  for (var i = 0; i < Object.keys(data).length; i++) {
    inds[data[i].id] = data[i];
  }
  return inds; 
};


var genXArcWithData = function(data, blockfun) {
  var k = data.ngens;
  var child_angles = {};
  var arcs = [], id = 0;
  var bg_arc = d3.svg.arc()
              .innerRadius(2*arcwidth)
              .outerRadius((k)*arcwidth + 2*arcwidth)
              .startAngle(-π/2)
              .endAngle(π/2);

  for (var i = 1; i <= k; i++) {
    var nancestors = Math.pow(2, i);
    var nXancestors = numXAncestors(i);
    var ind_angle  = π/nancestors;
    var last_angle =  -π/2;
    for (var j = 0; j < nXancestors; j++) {
      if (i > 1) {
        last_angle = child_angles[data.inds[i][j].child] + 
                      data.inds[i][j].sex*ind_angle;
      }
      var arc = d3.svg.arc()
                .innerRadius(i*arcwidth + arcwidth)
                .outerRadius(i*arcwidth + 2*arcwidth)
                .startAngle(last_angle)
                .endAngle(ind_angle + last_angle)

      child_angles[data.inds[i][j].id] = last_angle;
      if (i == 1) {
        // since female is focal individual, both her parents 
        // need to be shown.
        last_angle += ind_angle;
      }
      var blocks = null, sex=null;
      if (data.inds[i][j] !== undefined) {
        blocks = blockfun(data.inds[i][j]);
        data.inds[i][j].angle = last_angle;
        sex = ["female", "male"][data.inds[i][j].sex];
        relat = ["mother", "father"][data.inds[i][j].sex];
      };
      if (i == 0) last_angle += ind_angle;
      arcs.push({"arc":arc, "sex":sex, "id": id,
                "blocks": blocks,
                "gen": i, "relation": relat}); 
      id++;
    }
  }
  return {"bg":bg_arc, "arcs":arcs};
};


var processSims = function(data) {
  // take a set of simulation data and restructure it so lookups
  // by generation and generation id are easy.
  var lookup = {}, max_gen = 0;
  for (var i = 0; i < data.length; i++) {
    var el = data[i];
    lookup[el.gen] = lookup[el.gen] || {};
    lookup[el.gen][el.gid] = el;
    max_gen = el.gen > max_gen ? el.gen : max_gen;
  }
  return {'inds':lookup, 'ngens':max_gen,
          'lookup':createLookup(data)}; // a diff lookup (TODO rename)
};

var blocklen = function(segs) {
  //var m = d3.sum(segs.mum.map(function(x) { return x.end - x.start; }))
  //    d = d3.sum(segs.dad.map(function(x) { return x.end - x.start; }));
  //return m + d;
  return d3.sum(segs.map(function(x) { return x.end - x.start; }));
}

var segmentOpacityFactory = function(genlen) {
  return function(blocks) {
    var level = Math.pow(blocklen(blocks)/genlen, 0.5);
    return Math.min(1, level+0.01);
  };
}


var getParentBlocksFactory = function(lookup) {
  return function(ind) {
    var child = lookup[ind.child];
    var blocks = ind.sex ? child.segments.dad : child.segments.mum;
    return blocks;
  };
}

var plotFamilyArc = function(data, genlen, type, width, height, svg_element, desc_element) {
  var arcs = data.arcs;
  var svg = d3.select(svg_element).append("svg")
      .attr("id", "mainsvg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width/2 + "," + height + ")");

  var opacity = segmentOpacityFactory(genlen);

  if (type == 'x') { 
    // plot a gray background so we can see lack of ancestry
    svg.selectAll("path#bg-arc")
       .data([data.bg])
       .enter()
       .append("path")
       .attr("d", function(d) { return d(); })
       .style("fill", "rgb(240, 240, 240)");
    // these are white background arcs for individuals
    // note that the sims data.json file garuantees that these will
    // contian all individuals in the X
    svg.selectAll("#inds-bg")
       .data(arcs)
       .enter()
       .append("path")
       .style("fill", "#fff")
       .attr("id", function(d) { return d.id; })
       .attr("d", function(d) { return d.arc(); });
  }
   
  svg.selectAll("path.inds")
     .data(arcs)
     .enter()
     .append("path")
     .attr("class", function(d) { return "arc-"+d.sex; })
     .classed("inds", true)
     .style("opacity", function(d) {
        return opacity(d.blocks);
    })
     .attr("id", function(d) { return d.id; })
     .attr("d", function(d) { return d.arc(); });

  var text = d3.select(desc_element)

  svg.selectAll("path.inds")
   .on('mouseover', function(d) {
     var node = d3.select(this);
     node.classed("highlighted", true);
     node.style("opacity", "1")
     var ind = arcs[parseInt(node.attr('id'))];
     var relat = ind.relation, blocks;
     if (ind.gen > 1) {
       relat = "great-".repeat(ind.gen-2) + "grand" + relat
     }
     var nblocks = ind.blocks.length;
     var blocks = "shares " + nblocks + plural(" autosomal block", nblocks) +
                   ", " + Math.round(blocklen(ind.blocks)*1000)/1000  + " cM";
     text.text(relat);
     text.append("p").text(blocks)
   })
   .on('mouseleave', function(d) {
     var node = d3.select(this);
     node.style("opacity", function(d) { return opacity(d.blocks); })
     node.classed("highlighted", false);
     text.text("");
   })
};

d3.json("/static/js/x.json", function(error, data) {
   if (error) throw error;
   var dt = processSims(data.sims[0]);
   var arc_fun = {"x": genXArcWithData,
                  "single": genAutoArcWithData,
                  "auto": genAutoArcWithData}[data.type];
   blockfun = getParentBlocksFactory(dt.lookup);
   var arcs = arc_fun(dt, blockfun);
   console.log("total genetic length: ", data.genlen);
   plotFamilyArc(arcs, data.genlen, data.type, width, height, "#x-family-arc", "#x-desc");
   d3.select("#x-help").html("")
})

d3.json("/static/js/auto.json", function(error, data) {
   if (error) throw error;
   var dt = processSims(data.sims[0]);
   var arc_fun = {"x": genXArcWithData,
                  "single": genAutoArcWithData,
                  "auto": genAutoArcWithData}[data.type];
   blockfun = getParentBlocksFactory(dt.lookup);
   var arcs = arc_fun(dt, blockfun);
   console.log("total genetic length: ", data.genlen);
   plotFamilyArc(arcs, data.genlen, data.type, width, height, "#auto-family-arc", "#auto-desc");
   d3.select("#auto-help").html("")
})


