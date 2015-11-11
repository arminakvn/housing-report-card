(function() {
  // var axisX, axisY, gdpPerCapMax, gdpPerCapMin, height, margin, plot, scaleX, scaleY, width;
  var AllData;
  // ui script
  var url = "/distinctCity";
$.api.settings.api = {
  queryTags: '/distinctCity'
};
$('.ui.dropdown')
        .dropdown({
          allowAdditions: true,
          apiSettings: {
            action: 'queryTags'
          },
           onChange: function (val) {
              console.log(val);
              // draw(val);
          }
        })
      ;

      // visualization sctipt


  var scity,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
  margin = {
    t: 20,
    r: 20,
    b: 50,
    l: 50
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

//axis generator
var axisX = d3.svg.axis()
    .orient('bottom')
    .tickSize(10)
    .ticks(d3.time.year)
    .tickFormat(d3.time.format('%Y'));
var axisY = d3.svg.axis()
    .orient('left');
    // .tickSize(-width);
    // .ticks(10);

   //line generator
    var line = d3.svg.line()
        .x(function(d){return scaleX(new Date(d.year))})
        .y(function(d){return scaleY(d.medsale)})
        // .interpolate('basis')
    // var area = d3.svg.area()
    //     .x(function(d){return scaleX(d.key)})
    //     .y0(function(d){return scaleY(d.minFare)})
    //     .y1(function(d){return scaleY(dsa.maxFare)})
    //     .interpolate('basis');


var url = "https://arminavn.cartodb.com/api/v2/sql?q=SELECT * FROM warren_yr_town WHERE usegrp IN ('1FA') ORDER BY town ASC, year ASC LIMIT 400 &api_key=9150413ca8fb81229459d0a5c2947620e42d0940";
var updateCollection;

updateCollection = $.ajax(url, {
  type: 'GET',
  dataType: 'json',
  error: function(jqXHR, textStatus, errorThrown) {},
  success: (function(_this) {
    return function(data, textStatus, jqXHR) {
      console.log(data);
      scity = "Hudson"
      // AllData = data;
      draw(data.rows, scity);
      return;
    };
  })(this)
});


function draw(rows, city){
  // rows = AllData.rows;
  // console.log("draw data",rows);
$.when(rows).done((function(_this) {
  return function(rows) {
      scity = city.split(",");
      console.log(rows);
      // console.log(scity.split(","));
      data = [];

      // parse
      rows.forEach(function(each) {
        // if ((indexOf.call(scity, each.town) >= 0)) {
        data.push(
        {
          year: new Date(each.year, 01,01),
          medsale: +each.ytdmedsale,
          city: each.town
        }
        )
        // }
      })
      console.log("data",data);

      // data.sort(function(a,b){
      //       return b.year - a.year;
      //   })
      var nestedData = d3.nest()
        .key(function(d){return d.city})
        .entries(data);

    //calculate average fare for each travel date
        nestedData.forEach(function(t){
            console.log("jey",t.key);

            t.city = t.key;
            t.max = d3.max(t.values, function(quarter){return quarter.medsale});

            // console.log("average fare for " + t.key + 'is '+ t.max);

        });

        // nestedData.sort(function(a,b){
        //     return b.date - a.date;
        // })
    console.log("nestedData", nestedData);




      medsaleMin = d3.min(nestedData, function(d) {
        // console.log("d.medsale",d.medsale)
        return d.max;
      });

      medsaleMax = d3.max(nestedData, function(d) {
        return d.max ;
      });

      // dateMin = d3.min(nestedData, function(d) {
      //   // console.log("d.medsale",d.medsale)
      //   return d.date;
      // });

      // dateMax = d3.max(nestedData, function(d) {
      //   return d.date ;
      // });


      scaleX = d3.time.scale().domain([new Date(1999, 12, 28), new Date(2013, 12, 28)]).range([0, width]);
      console.log(new Date(2015, 12, 29));
      scaleY = d3.scale.linear().domain([0, medsaleMax]).range([height, 0]);
   

      axisX.scale(scaleX);
      axisY.scale(scaleY);


      plot.append('g')
        .attr('class','axis axis-x')
        .attr('transform','translate(0,'+height+')')
        .call(axisX);
      plot.append('g')
          .attr('class','axis axis-y')
          .call(axisY);
      plot.select('.axis-x')
          .selectAll('text')
          .attr('transform','rotate(90)translate(40,0)')



     /* nodes = plot
        .selectAll('.nodes numberofsales')
        .data(nestedData)
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
        console.log("d, i", d, i);
        // console.log(scaleY(d.medsale))
            return 'translate(' + scaleX(new Date(d.values.year)) + ',' + scaleY(d.values.medsale) + ')';
        })

      nodes.exit().remove();
      

      var nodeTransition = nodes.transition().duration(500);
      nodeTransition
        .select('circle')
        .attr(
          'transform',function(d,i){
            console.log(scaleX(d.date));
            return 'translate(' + scaleX(new Date(d.date)) + ',' + 0 + ')';
        }
          )*/


      nestedData.forEach(function(each) {
        console.log("each", each);
        plot.append('path').attr('class','data-line')
        .datum(each.values)
        .attr('d',line);
      })

      plot.append('path').attr('class','data-line')
        .datum(nestedData)
        .attr('d',function(d){
          console.log("line d", d)
          return line(d)
        });
      plot.append("text")
        .attr("transform", "translate(" + (width+3) + "," + scaleY(each.values.ytdmedsale) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "red")
        .text(function(d){
          return d.city;
        });

return;
  };
})(this));
}
}).call(this);
