(function() {

var url_map = d3.map();
var layout_map = d3.map();
var draw_measure_map = d3.map();
var data_map = d3.map();
var chart;
var base_url = "https://arminavn.cartodb.com/api/v2/sql?q=SELECT * FROM warren_yr_town " 
var where_clause = " WHERE usegrp IN ('1FA') " + "AND town ILIKE('Cambridge')"
var order_clause = " ORDER BY town ASC, year ASC "
var limit_clause = ""
var api_key = " &api_key=9150413ca8fb81229459d0a5c2947620e42d0940"

url_map.set('where_clause', where_clause);
url_map.set('order_clause', order_clause);
url_map.set('limit_clause', limit_clause);



draw_measure_map.set('current_measure', 'medsale')
draw_measure_map.set('current_cities', 'Cambridge')

var metadata_map = d3.map({
  'medsale': 'allData',
  'numsale': 'allData2'
})

var metalabel_map = d3.map({
  'Single Family Home Sales': 'numsale',
  'Median Single Family Home Sale Prices': 'medsale'
})

var format_axis_map = d3.map({
  'medsale': d3.format("$,"),
  'numsale': d3.format(",")
})

console.log(metadata_map)

makeLegendCities()



$('#measure_options').dropdown(
      {
          onChange: function (value, id) {
            
            chart.unload(draw_measure_map.get('current_cities'));
            

            layout_map.set('table-name', value)
            console.log('val',value, 'id', id)
            draw_measure_map.set('current_measure', metalabel_map.get(id))
            // chart.hide(draw_measure_map.get('current_cities'));
            // chart.show(draw_measure_map.get('current_cities'));
            chart.flow({
              columns: data_map.get(metadata_map.get(metalabel_map.get(id))),
                duration: 10,
                length: 0,
                done: function () {
                  chart.hide(draw_measure_map.get('current_cities'));

                  chart.flush();
                  chart.show(draw_measure_map.get('current_cities'));
                  draw();
                  
                  // chart.unload()
                }
              })

            // chart.load(data_map.get(metadata_map.get(draw_measure_map.get('current_measure'))))

            console.log(data_map.get(metadata_map.get(draw_measure_map.get('current_measure'))))
            
            }
            

          });

function makeLegendCities() {
  $('#legend_options').dropdown({
          allowAdditions: true,
          onChange: function (val) {
            draw_measure_map.set('current_cities', val)
            var OrStates =[];
            val.forEach(function(townName){
              startStr =  "town ILIKE('" + townName + "') OR";
              OrStates.push(startStr);
            })
            orStrings = "";
            OrStates.forEach(function(ors){
              orStrings = orStrings + " " +  ors;
            })
            orStrings = orStrings.slice(0, -2)
            url_map.set('where_clause', " WHERE usegrp IN ('1FA') AND ( "+orStrings+" )")
            makeAjaxCall(url_map)
          }
  });
  
  var legend_cities_data = [];
  var legend_cities = []
  var url = "https://arminavn.cartodb.com/api/v2/sql?q=SELECT * FROM warren_yr_town WHERE usegrp IN ('1FA') ORDER BY town ASC, year ASC &api_key=9150413ca8fb81229459d0a5c2947620e42d0940";
  var updateCollection;
  updateCollection = $.ajax(url, {
    type: 'GET',
    dataType: 'json',
    error: function(jqXHR, textStatus, errorThrown) {},
    success: (function(_this) {
      return function(data, textStatus, jqXHR) {
        data.rows.forEach(function(each){
          legend_cities_data.push({
            city: each.town
          })
        })
        legend_cities_nest= d3.nest()
        .key(function(d){return d.city})
        .entries(legend_cities_data);

        legend_cities_nest.forEach(function(each) {
          legend_cities.push(each.key)
        }
          )
        d3.select('#legend_options').attr('class', 'legend').selectAll('option')
          .data(legend_cities)
        .enter().append('option')
          .attr('data-id', function (id) { return id; })
          .attr('value', function(id) {return id;})
          .html(function (id) { return id; })
          .on('mouseover', function (id) {
              // chart.focus(id);
          })
          .on('mouseout', function (id) {
          })
          .on('click', function (id) {
          });
          d3.select('#legend_options_add').attr('class', 'legend').selectAll('option')
          .data(legend_cities)
          .enter().append('option')
            .attr('data-id', function (id) { return id; })
            .attr('value', function(id) {return value;})
            .html(function (id) { return id; })
        return;
      };
    })(this)
  });
}






function makeAjaxCall(urlMap) {
  var url = base_url + urlMap.get('where_clause') + urlMap.get('order_clause') + urlMap.get('limit_clause') + api_key
  console.log(urlMap)
  // var url = "https://arminavn.cartodb.com/api/v2/sql?q=SELECT * FROM warren_yr_town WHERE usegrp IN ('1FA') ORDER BY town ASC, year ASC LIMIT 1000&api_key=9150413ca8fb81229459d0a5c2947620e42d0940";
  var updateCollection;
  updateCollection = $.ajax(url, {
    type: 'GET',
    dataType: 'json',
    error: function(jqXHR, textStatus, errorThrown) {},
    success: (function(_this) {
      return function(data, textStatus, jqXHR) {
        
        // AllData = data;
        makeData(data.rows)
        draw();
        return;
      };
    })(this)
  });

}





function makeData(rows) {
  data = [];

  rows.forEach(function(each) {
    // if ((indexOf.call(scity, each.town) >= 0)) {
    data.push(
    {
      year: new Date(each.year, 01,01),
      medsale: +each.ytdmedsale,
      numsale: +each.ytdnumsale,
      city: each.town
    }
    )

  })


  var nestedData = d3.nest()
    .key(function(d){return d.city})
    .entries(data);

//calculate average fare for each travel date
    nestedData.forEach(function(t){
        t.city = t.key;
        t.max = d3.max(t.values, function(quarter){return quarter.medsale});

    });




  medsaleMin = d3.min(nestedData, function(d) {

    return d.max;
  });

  medsaleMax = d3.max(nestedData, function(d) {
    return d.max ;
  });

base_color = d3.rgb(49, 130, 189);
  allData = []
  allData2= []
 
  nestedData.forEach(function(each) {
    data = each.values.map(function(d) {return d.medsale;})
    data2 = each.values.map(function(d) {return d.numsale;})        
    data.unshift(each.city)
    data2.unshift(each.city)
    allData.push(data);
    allData2.push(data2);
    
  })
  allData.unshift(['year', new Date(2000, 01,01),new Date(2001, 01,01),new Date(2002, 01,01),new Date(2003, 01,01),
    new Date(2004, 01,01), new Date(2005, 01,01),new Date(2006, 01,01),new Date(2007, 01,01),new Date(2008, 01,01),
    new Date(2009, 01,01), new Date(2010, 01,01),new Date(2011, 01,01),new Date(2012, 01,01),new Date(2013, 01,01)]);
  allData2.unshift(['year', new Date(2000, 01,01),new Date(2001, 01,01),new Date(2002, 01,01),new Date(2003, 01,01),
    new Date(2004, 01,01), new Date(2005, 01,01),new Date(2006, 01,01),new Date(2007, 01,01),new Date(2008, 01,01),
    new Date(2009, 01,01), new Date(2010, 01,01),new Date(2011, 01,01),new Date(2012, 01,01),new Date(2013, 01,01)]);



  data_map.set('allData', allData);
  data_map.set('allData2', allData2);
  // data is : data_map.get(metadata_map.get(draw_measure_map.get('current_measure')));
  return 
}





function draw(){
  var tableName = d3.select('#table-name')
  tableName.transition().style('opacity',0);
   

      chart = c3.generate({
        size: {
          width: 1000,
          height: 550
        },
        bindto: "#plot",
        data: {
          x: 'year',
          columns: data_map.get(metadata_map.get(draw_measure_map.get('current_measure'))),
          type: 'bar',
          pattern: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'],
          // labels: {
          //   format: function (v, id, i, j) { return id }
          // }
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%Y'
                }
            },
            y: {
              tick: {
                  
                  format: d3.format("$,")

              },
              label: {
                      show: false,
                      text: '',
                      position: 'outer-middle'
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
      tableName.transition().style('opacity',1);
      tableName.html(layout_map.get('table-name'));
// $('#legend_options_add').dropdown({
//           allowAdditions: true,
//           onChange: function (val) {
//             // url_map.set('where_clause', " WHERE usegrp IN ('1FA') AND town ILIKE " +  "('" + val + "')")
//             // makeAjaxCall(url_map)
            
//             chart.hide(legend_cities);
//                       chart.show(val);
//                   }

//           });
    //    first initiating the selections




      
      

      //      populating the selection and form elements with d3!



      // chart.hide(legend_cities);
      

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




  // }
// }
//   )
// )


}
  // var explainable = window.explainable;
    
})();