(function() {
var url = "https://arminavn.cartodb.com/api/v2/sql?q=SELECT * FROM warren_yr_town WHERE usegrp IN ('1FA') ORDER BY town ASC, year ASC LIMIT 1000&api_key=9150413ca8fb81229459d0a5c2947620e42d0940";
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
  console.log("rows",rows);
// $.when(rows).done((function(_this) {
  // return function(rows) {
  scity = city.split(",");
      console.log("rows",rows);
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

    base_color = d3.rgb(49, 130, 189);
      console.log("rows",rows);
      allData = []
      legend_cities = []
      nestedData.forEach(function(each) {
        // data = []
        // data.push(each.city)

        data = each.values.map(function(d) {return d.medsale;})        
        data.unshift(each.city)
        legend_cities.push(each.city)
        allData.push(data);
        
      })
      allData.unshift(['year', new Date(2000, 01,01),new Date(2001, 01,01),new Date(2002, 01,01),new Date(2003, 01,01),
        new Date(2004, 01,01), new Date(2005, 01,01),new Date(2006, 01,01),new Date(2007, 01,01),new Date(2008, 01,01),
        new Date(2009, 01,01), new Date(2010, 01,01),new Date(2011, 01,01),new Date(2012, 01,01),new Date(2013, 01,01)]);
      console.log("allData", allData)
      var chart = c3.generate({
        size: {
          width: 1100,
          height: 550
        },
        bindto: "#plot",
        data: {
          x: 'year',
          columns: allData,
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%Y'
                }
            },
            y: {
              label: {
                      text: 'median sale price - single family'
                    }
            }
              
        },
        legend: {
              show: false,
              position: 'bottom'
          }
});
      function toggle(id) {
          chart.toggle(id);
      }
      $('select.dropdown').dropdown({
          allowAdditions: true,
          onChange: function (val) {
            console.log(this);  
            chart.hide(legend_cities);
                      // console.log(val);
                      chart.show(val);
                      // chart.focus(val);
                      // val.forEach(function(id){
                      //   chart.toggle(id);
                      // }
                      //   )
                      // draw(val);
                  }

          });

      chart.hide(legend_cities);
      d3.select('select').attr('class', 'legend').selectAll('option')
          .data(legend_cities)
        .enter().append('option')
          .attr('data-id', function (id) { return id; })
          .attr('value', function(id) {return id;})
          .html(function (id) { return id; })
          .each(function (id) {
              d3.select(this).style('background-color', chart.color(id));
          })
          .on('mouseover', function (id) {
              // chart.focus(id);
          })
          .on('mouseout', function (id) {
              // chart.revert();
          })
          .on('click', function (id) {
              // chart.toggle(id);
              // $('select.dropdown')
                // .dropdown('set selected', id)
              // ;
          });

            // json: data,
            // keys: {
            //     value: ['ytdmedsale']
            // },
            // groups: [['city']],
            // colors: {
            // '_0_to_29_minutes': base_color,
            // '_30_59_minutes': base_color.darker(1),
            // '_60_plus_minutes':base_color.darker(2)
            // },
            // type: 'line'
          // },
          // axis: {
              // x: {
                  // type: 'category',
                  // categories: data.map(function(d) { return d.year; }),
                  // tick: {
                  //     rotate: 75,
                  //     multiline: true
                  // },
                  // height: 100
              // },
              // y: {
                  // label: {
                  //   text: 'median sale',
                  //   position: 'outer-middle'
                  // }
                  // // max: 1

          //     },
          // },
          // subchart: {
          //       show: false
          //   },
          // regions: [
          //   {axis: 'x', start: -0.5, end:2.5 , class: 'region-1-3'},
          //   {axis: 'x', start: 2.5, end:5.5 , class: 'region-3-5'}
          // ],
          // legend: {
          //     show: true
          // }
      // })
      console.log(chart.data.colors());




  // }
// }
//   )
// )


}
  // var explainable = window.explainable;
    
})();