// genealogy.js -- pedigree and family plots in JS
// license: GPL2

"use strict";

var MAXGEN = 5;

function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}

function log2(x) {
  return getBaseLog(x, 2);
}

function segmentsTree(config) {
  var maxanc = config.nancestors(config.maxgen);
  var width = 760, // default 960
      height = 260,  // default 360
      bottom = 40,  // bottom margin
      //chrom_width = 90,
      chrom_x_space = width/100,
      chrom_width = width/(maxanc + 1), // you may need to tweak 2
      chrom_height = chrom_width*0.08,
      pair_space = 0.7, // faction of chrom_height
      ind_height = 1.1*(chrom_height*2 + pair_space),
      chrom_y_space = height/(config.maxgen+1);  // also a multiplier
  var delay = 1500, seg_delay = 1500;

  function newSVG(element) {
    return d3.select(element).append("svg")
             .attr("width", width)
             .attr("height", height)
             .append("g")
             .attr("transform", "translate(" + width/2 + "," + height + ")");
  }

  function chromYPosition(d) {
    return -bottom + -chrom_y_space*d.gen;
  }

  // X position depends on type of genealogy: if X number of ancestors are
  // fibonacci, otherwise 2^k. This comes from config.
  function chromXPosition(d) {
    if (d == undefined) return null;
    var num = config.nancestors(d.gen),
        offset = (d.gid) - (num/2),
        total_width = (num*chrom_width + (num-1)*chrom_x_space),
        space = total_width/num,
        buffer = 1;
    if (!config.tight) {
      // this still has some issues
      // tweak multiplier (which should be one if chromosomes are drawn)
      // if just using tree plots (or ind plots)
      var mult = 1;
      buffer = mult*config.nancestors(config.maxgen)/num;
    }
    return buffer*(space*(offset) + chrom_width/2);
    };

  function segmentXPosition(d) {
    return chromXPosition(d.ind) - chrom_width/2 + 
           (d.start/config.genlen)*chrom_width;
  };

  function Tree(selection, sims, inds) {
    var tree = selection.selectAll("path")
             .data(sims)
             .enter()
             .append("line")
             .filter(function(d) { return d.gen > 0 && d.gen <= 4; })
             .attr({
                 x1: chromXPosition,
                 y1: chromYPosition,
                 x2: function(d) { return chromXPosition(inds[d.child]); },
                 y2: function(d) { return chromYPosition(inds[d.child]); },
                 stroke: '#aaa'
               })
              .attr("stroke-width", 1.5)
              // .style("opacity", config.animate ? 0 : 1);
    if (config.animate) {
      tree.transition()
          .delay(function(d) {
            return d.gen/config.maxgen * delay;
          })
          .style("opacity", 1)
    }
    this.svg = selection;
    this.sims = sims;
    this.chroms = null;
  }

  Tree.prototype.addIndividuals = function() {
    var svg = this.svg;
    var sims = this.sims;
    svg.selectAll("circle")
       .data(sims)
       .enter()
       .append("circle")
       .attr("r", 10)
       .attr("cx", chromXposition)
       .attr("cy", chromYposition)
       .attr("class", function(d) { return ["ind-female", "ind-male"][d.sex]; });
  }

  Tree.prototype.addChromosomes = function() {
    var svg = this.svg;
    var sims = this.sims;
    // returns chromsomes blocks so segments can be attached (bound to sim data)
    var chroms = svg.selectAll("rect")
                    .data(sims);

    var gs = chroms.enter()
                     .append("g")
                     .selectAll("g")
   
    // this is for background to block out tree between chrom segs
    // something's not working so it's not centered.
    chroms.append("rect")
          .attr("x", function(d) { return chromXPosition(d) - chrom_width/2; })
          .attr("y", function(d) {
            return chromYPosition(d) - ind_height/2;
          })
          .attr("width", chrom_width)
          .attr("height", ind_height)
          .attr("class", "chrom-bg")

    // for each chromosome pair 
    var pairs = gs.data(function(d, i) {
        return [{'i': -1, 'd': d},
                {'i': 1, 'd': d}]
      })
      .enter()
      .append("rect")
      .attr("x", function(d) { return chromXPosition(d.d) - chrom_width/2; })
      .attr("y", function(d) {
        return chromYPosition(d.d) - pair_space*chrom_height*(1/2 + d.i);
      })
      .attr("width", chrom_width)
      .attr("height", chrom_height)
      .attr("class", function(d) {
        return d.d.sex ? "chrom chrom-male" : "chrom chrom-female";
      })
      .attr("id", function(d) { return "ind-" + d.d.id; })
      .style("opacity", config.animate ? 0 : 1);

    if (config.animate) {
      pairs.transition()
          .delay(function(d) {
            return d.d.gen/config.maxgen * delay;
          })
          .style("opacity", 1)
    }
 
    this.chroms = chroms;
    return this;
  }

  Tree.prototype.addSegments = function() {
    var segs = this.chroms.selectAll("g").data(function(d) { 
      var segs = [];
      for (var i = 0; i < d.segments.dad.length; i++) {
        var dseg = d.segments.dad[i];
        dseg['ind'] = d;
        dseg['hap'] = 'dad';
        segs.push(dseg);
      }
      for (var i = 0; i < d.segments.mum.length; i++) {
        var mseg = d.segments.mum[i];
        mseg['ind'] = d;
        mseg['hap'] = 'mum';
        segs.push(mseg);
      }
      return segs;
     })
     .enter()
     .append("rect")
//     .style("fill", "#222")
//     .transition()
//     .duration(3000)
//     .style("fill", "#de2d26")
     .attr("x", segmentXPosition)
     .attr("y", function(d) { 
       var mult = d.hap == 'mum' ? 1 : -1
       return chromYPosition(d.ind) - pair_space*chrom_height*(1/2 + mult);
     })
     .attr("width", function(d) {
       return (d.end - d.start)/config.genlen*chrom_width;
     })
     .attr("height", chrom_height)
     .attr("class", function(d) {
       if (d.ind.gen == 0) return d.hap + "-segment";
       return d.ind.lineage ? "dad-segment" : "mum-segment";
     })
     .attr("id", function(d) { return d.ind.id; })
     .style("opacity", config.animate ? 0 : 1);

    if (config.animate) {
      segs.transition()
          .delay(function(d) {
            return seg_delay + d.ind.gen/config.maxgen * delay;
          })
          .style("opacity", 1)
    }
 
  }

  function createLookup(data) {
    // build a lookup for nodes, hashed by ID
    var inds = {};
    for (var i = 0; i < Object.keys(data).length; i++) {
      inds[data[i].id] = data[i];
    }
    return inds; 
  }

  return function chart(selection) {
    selection.each(function(sims, i) {
      // with each(), support for rendering in multiple elements
      var svg = newSVG(this);
      // svg.append("circle") // displays center dot (for debugging)
      //    .attr('cy', -10)
      //    .attr('cx', 0)
      //    .attr('r', 3)
      //    .style('fill', '#333')
      // // create a lookup (by individual ID) for faster lookups
      var inds = createLookup(sims);
      var tree = new Tree(svg, sims, inds);
      tree.addChromosomes(svg, sims)
         .addSegments()
    });
  }
}
