(function() {

var url_map2 = d3.map();
var layout_map2 = d3.map();
var draw_measure_map2 = d3.map();
    var data_map2 = d3.map();
var chart2;
var base_url2= "SELECT * FROM {table} " 
var where_clause2 = " WHERE usegrp IN ('1FA') " + "AND town ILIKE('Cambridge')" + "AND level ILIKE('Town')" + "AND year >= 2001 "
var order_clause2 = " ORDER BY town ASC, year ASC "
var limit_clause2 = ""

url_map2.set('where_clause', where_clause2);
url_map2.set('order_clause', order_clause2);
url_map2.set('limit_clause', limit_clause2);


draw_measure_map2.set('current_measure', 'change_in_median_home_value_from_previous_year')
draw_measure_map2.set('current_cities', 'Boston')
draw_measure_map2.set('current_compare_from', '2005')
draw_measure_map2.set('current_compare_to', '2015')


var metadata_map2 = d3.map({
  'change_in_median_home_value_from_previous_year': 'allData1',
  'change_in_number_of_sales_from_previous_year': 'allData2',
  'change_in_permits_from_previous_year':'allData3'
})


var metalabel_map2 = d3.map({
  'Change in Median Home Value from Previous Year': 'change_in_median_home_value_from_previous_year',
  'Change in Number of Sales from Previous Year': 'change_in_number_of_sales_from_previous_year',
  'Change in Permits from Previous Year': 'change_in_permits_from_previous_year',
})


var allDataKeysList2 = [
        'change_in_median_home_value_from_previous_year',
        'change_in_number_of_sales_from_previous_year',
        'change_in_permits_from_previous_year'
    ]
var format_axis_map2 = d3.map({
  'change_in_median_home_value_from_previous_year': d3.format("%,"),
  'change_in_number_of_sales_from_previous_year': d3.format("%,"),
  'change_in_permits_from_previous_year': d3.format("%,")
})

var sources_map2 = d3.map({
  'change_in_median_home_value_from_previous_year': 'The Warren Group',
  'change_in_number_of_sales_from_previous_year': 'The Warren Group',
  'change_in_permits_from_previous_year': 'U.S. Census'
})


makeLegendCities2();
makeAjaxCall2(url_map2);


$('#compare_options').dropdown(
      {
          onChange: function (value, id) {
            chart2.unload(draw_measure_map2.get('current_cities'));
            layout_map2.set('table-name', value)
            draw_measure_map2.set('current_measure', metalabel_map2.get(id))
            chart2.flow({
              columns: data_map2.get(metadata_map2.get(metalabel_map2.get(id))),
                duration: 10,
                length: 0,
                done: function () {
                  chart2.hide(draw_measure_map2.get('current_cities'));

                  chart2.flush();
                  chart2.show(draw_measure_map2.get('current_cities'));
                  draw2();
                }
              })


            
            }
            

          });
    
    

function makeLegendCities2() {
  $('#legend_compare').dropdown({
          allowAdditions: true,
          onChange: function (val) {
            draw_measure_map2.set('current_cities', val)
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
            url_map2.set('where_clause', " WHERE usegrp IN ('1FA') AND ( "+orStrings+" )")
            makeAjaxCall2(url_map2)
          }
  });
    
 $('#compare_year_from').dropdown({
          allowAdditions: false,
          onChange: function (val) {
            draw_measure_map2.set('current_compare_to', val)
            compare_range = d3.range(val, 2016, 1);
            
            
            var compare_to = d3.select('#compare_year_to')
                            .attr('class', 'legend')
                .selectAll('option')
            .data([], function(d){return d;}).exit().remove();
            var compare_to = d3.select('#compare_year_to')
                            .attr('class', 'legend')
                .selectAll('option')
            .data(compare_range, function(d){return d;})
            
            var compare_to_enter = compare_to.enter().append('option');
              
              compare_to.exit().remove();
            compare_to.attr('data-id', function (id) { return id; })
            .attr('value', function(id) {return id;})
            .html(function (id) { return id; })
            .on('mouseover', function (id) {
            })
            .on('mouseout', function (id) {
            })
            .on('click', function (id) {
            });
            
            makeAjaxCall2(url_map2)
          }
  });
    
    
$('#compare_year_to').dropdown({
          allowAdditions: false,
          onChange: function (val) {
            draw_measure_map2.set('current_compare_to', val)
            makeAjaxCall2(url_map2)
          }
  });
    
    
    
  var legend_cities_data = [];
  var legend_cities = []
  var url = "/queryData/" + "SELECT * FROM {table} WHERE usegrp IN ('1FA') AND year >= 2001 ORDER BY town ASC, year ASC";
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
        d3.select('#legend_compare').attr('class', 'legend').selectAll('option')
          .data(legend_cities)
        .enter().append('option')
          .attr('data-id', function (id) { return id; })
          .attr('value', function(id) {return id;})
          .html(function (id) { return id; })
          .on('mouseover', function (id) {
          })
          .on('mouseout', function (id) {
          })
          .on('click', function (id) {
          });
          
          

        return;
      };
    })(this)
  });
}






function makeAjaxCall2(urlMap2) {
  var url = "/queryData/" + base_url2 + urlMap2.get('where_clause') + urlMap2.get('order_clause') + urlMap2.get('limit_clause')
  var updateCollection;
  updateCollection = $.ajax(url, {
    type: 'GET',
    dataType: 'json',
    error: function(jqXHR, textStatus, errorThrown) {},
    success: (function(_this) {
      return function(data, textStatus, jqXHR) {
        makeData2(data.results.rows)
        draw2();
        return;
      };
    })(this)
  });

}





function makeData2(rows) {
  data = [];
  rows.forEach(function(each) {
    data.push(
    {
      year: new Date(each.year, 01,01),
      change_in_median_home_value_from_previous_year: +each.change_in_median_home_value_from_previous_year,
      change_in_number_of_sales_from_previous_year: +each.change_in_number_of_sales_from_previous_year,
      change_in_permits_from_previous_year: +each.change_in_number_of_sales_from_previous_year,

      city: each.town
    }
    )

  })


  var nestedData = d3.nest()
    .key(function(d){return d.city})
    .entries(data);
    nestedData.forEach(function(t){
        t.city = t.key;
        t.max = d3.max(t.values, function(quarter){return quarter.change_in_median_home_value_from_previous_year});

    });




  medsaleMin = d3.min(nestedData, function(d) {

    return d.max;
  });

  medsaleMax = d3.max(nestedData, function(d) {
    return d.max ;
  });

base_color = d3.rgb(49, 130, 189);
    
    
   var allDataList2 = [];
   var allDataKeysList2 = [
        'change_in_median_home_value_from_previous_year',
        'change_in_number_of_sales_from_previous_year',
        'change_in_permits_from_previous_year'
    ]
   var counterID = 1;
   allDataKeysList2.forEach(function(eachKey){       
       _allData2 = [];
       var _key = eachKey;
        nestedData.forEach(function(each) {
            _data =   each.values.map(function(d) {
                _val = d[_key];
                return _val;
            });
            _data.unshift(each.city)
            _allData2.push(_data);
        })
        _allData2.unshift(['year', new Date(2001, 01,01),new Date(2002, 01,01),new Date(2003, 01,01),
            new Date(2004, 01,01), new Date(2005, 01,01),new Date(2006, 01,01),new Date(2007, 01,01),new Date(2008, 01,01),
            new Date(2009, 01,01), new Date(2010, 01,01),new Date(2011, 01,01),new Date(2012, 01,01),new Date(2013, 01,01),new Date(2014, 01,01),new Date(2015, 01,01)]);
        allDataList2.push(_allData2);
       data_map2.set('allData'+counterID, _allData2);
       counterID = counterID + 1;
        
   })
  return 
}





function draw2(){
  var tableName = d3.select('#table-name2');
  var source = d3.select('#source2').select('span')
  tableName.transition().style('opacity',0);
      

      chart2 = c3.generate({
        size: {
          width: 1000,
          height: 550
        },
        bindto: "#plot2",
        data: {
          x: 'year',
          columns: data_map2.get(metadata_map2.get(draw_measure_map2.get('current_measure'))),
          type: 'step',
          pattern: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'],
          onclick: function (d, element) { 
          }
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%Y',
                    culling: false
                }
            },
            y: {
              tick: {
                  
                  format: format_axis_map2.get(draw_measure_map2.get('current_measure')) 

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
          chart2.toggle(id);
      }
      tableName.transition().style('opacity',1);
      tableName.html(layout_map2.get('table-name'));
      source.transition().style('opacity',1);
      source.html(sources_map2.get(draw_measure_map2.get('current_measure')));



}
    
})();