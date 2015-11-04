(function() {
  // var axisX, axisY, gdpPerCapMax, gdpPerCapMin, height, margin, plot, scaleX, scaleY, width;


  margin = {
    t: 10,
    r: 10,
    b: 20,
    l: 20
  };

  width = document.getElementById('plot').clientWidth - margin.l - margin.r;

  height = document.getElementById('plot').clientHeight - margin.t - margin.b;
// console.log("margin.l",margin.t)
console.log("height", height)
  plot = d3.select('#plot')
    .append('svg')
    .attr('width', width + margin.l + margin.r)
    .attr('height', height + margin.t + margin.b)
    .append('g')
    .attr('class', 'plot-area')
    .attr('transform', 'translate(' + margin.l + ',' + margin.t + ')');


  axisX = d3.svg.axis()
    .orient('bottom')
    .tickSize(-height)
    .tickValues([10000, 50000, 100000]);

  axisY = d3.svg.axis()
    .orient('left')
    .tickSize(-width)
    .tickValues([0, 25, 50, 75, 100]);

var url = "https://arminavn.cartodb.com/api/v2/sql?q=SELECT * FROM warrendata WHERE cyear = 2015 AND medsale > 0 &api_key=9150413ca8fb81229459d0a5c2947620e42d0940";
var updateCollection;

updateCollection = $.ajax(url, {
  type: 'GET',
  dataType: 'json',
  error: function(jqXHR, textStatus, errorThrown) {},
  success: (function(_this) {
    return function(data, textStatus, jqXHR) {
      draw(data.rows);
      return;
    };
  })(this)
});


function draw(rows){
  console.log("draw data",rows);
$.when(rows).done((function(_this) {
  return function(rows) {
    



      medsaleMin = d3.min(rows, function(d) {
        console.log("d.medsale",d.medsale)
        return d.medsale;
      });

      medsaleMax = d3.max(rows, function(d) {
        return d.medsale ;
      });

      scaleX = d3.scale.log().domain([medsaleMin, medsaleMax]).range([0, width]);
      console.log(medsaleMin);
      scaleY = d3.scale.linear().domain([0, 100]).range([height, 0]);

      axisX.scale(scaleX);

      axisY.scale(scaleY);

      plot
        .append('g')
        .attr('class', 'axis axis-x')
        .attr('transform', 'translate(0,' + height + ')')
        .call(axisX);

      plot
        .append('g')
        .attr('class', 'axis axis-y')
        .call(axisY);

      nodes = plot
        .selectAll('.nodes numberofsales')
        .data(rows)
      nodesEnter = nodes
        .enter()

      nodesEnter
      .append('g') 
      .attr('class', 'nodes numberofsales')
      
      nodesEnter
        .append('circle')
        
        .attr('r',3)
        .style('fill-opacity',.02)
        .style('stroke','rgb(100,100,100)')
        .style('stroke-width','1px')
        .attr('transform',function(d,i){
        // console.log("d, i", d, i);
            return 'translate(' + i*(1000/4) + ',' + 0 + ')';
        })

      nodes.exit().remove();
      

      var nodeTransition = nodes.transition().duration(500);
      nodeTransition
        .select('circle')
        .attr(
          'transform',function(d,i){
            return 'translate(' + i*(1000/4) + ',' + 0 + ')';
        }
          )


return;
  };
})(this));
}
}).call(this);
