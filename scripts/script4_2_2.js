(function() {

var url_map2 = d3.map();
var layout_map2 = d3.map();
var draw_measure_map2 = d3.map();
    var data_map2 = d3.map();
var chart2;
var base_url2= "https://arminavn.cartodb.com/api/v2/sql?q=SELECT * FROM housing_report_cards_data " 
var where_clause2 = " WHERE usegrp IN ('1FA') " + "AND level ILIKE('Town')"
var where_clause_towns2 = "AND town ILIKE('Cambridge') " 
var where_clause_years2 = " AND year >= 2001 "
var order_clause2 = " ORDER BY town ASC, year ASC "
var limit_clause2 = ""
var api_key = " &api_key=9150413ca8fb81229459d0a5c2947620e42d0940"


url_map2.set('where_clause', where_clause2);
url_map2.set('where_clause_towns', where_clause_towns2);
url_map2.set('where_clause_years', where_clause_years2);
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
  'medsale': 'allData1',
  'numsale': 'allData2',
//  'forecolsure_petitions':'allData3',
  'single_family_units_permitted_imputation_2015_numbers_are_es':'allData4',
  'foreclosure_deeds':'allData5',
  'ytdfsnum':'allData6'
})


var allDataKeysList2 = [
       'medsale',
        'numsale',
        'forecolsure_petitions',
        'single_family_units_permitted_imputation_2015_numbers_are_es',
        'foreclosure_deeds',
        'ytdfsnum'
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
            url_map2.set('where_clause_towns', " AND ( "+orStrings+" )")
            makeAjaxCall2(url_map2)
          }
  });
    
 $('#compare_year_from').dropdown({
          allowAdditions: false,
          onChange: function (val) {
            draw_measure_map2.set('current_compare_from', val)
            compare_range = d3.range(val, 2016, 1);
              andStrings = 'year >=' + val + ' AND year <' + draw_measure_map2.get('current_compare_to') + ' ';
              url_map2.set('where_clause_years', " AND "+andStrings)
            console.log('url_map2',url_map2)
            
//            url_map2.set('where_clause', " WHERE usegrp IN ('1FA') AND ( "+orStrings+" )")
            var compare_to = d3.select('#compare_year_to')
                            .attr('class', 'legend')
                .selectAll('option')
            .data([], function(d){return d;}).exit().remove();
            //populate the options for the _to drop downbased on this!
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
              // chart.focus(id);
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
            andStrings = 'year >=' + draw_measure_map2.get('current_compare_from') + ' AND year <' + val + ' ';
              url_map2.set('where_clause_years', " AND "+andStrings)
            console.log('url_map2',url_map2)
            makeAjaxCall2(url_map2)
          }
  });
    
    
    
  var legend_cities_data = [];
  var legend_cities = []
  var url = "https://arminavn.cartodb.com/api/v2/sql?q=SELECT * FROM housing_report_cards_data WHERE usegrp IN ('1FA') AND year >= 2001 ORDER BY town ASC, year ASC &api_key=9150413ca8fb81229459d0a5c2947620e42d0940";
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
              // chart.focus(id);
          })
          .on('mouseout', function (id) {
          })
          .on('click', function (id) {
          });
          
          
//          d3.select('#legend_compares_add').attr('class', 'legend').selectAll('option')
//          .data(legend_cities)
//          .enter().append('option')
//            .attr('data-id', function (id) { return id; })
//            .attr('value', function(id) {return value;})
//            .html(function (id) { return id; })
        return;
      };
    })(this)
  });
}






function makeAjaxCall2(urlMap2) {
  var url = base_url2 + urlMap2.get('where_clause') + urlMap2.get('where_clause_towns') + urlMap2.get('where_clause_years') + urlMap2.get('order_clause') + urlMap2.get('limit_clause') + api_key
  console.log(url)
  // var url = "https://arminavn.cartodb.com/api/v2/sql?q=SELECT * FROM warren_yr_town WHERE usegrp IN ('1FA') ORDER BY town ASC, year ASC LIMIT 1000&api_key=9150413ca8fb81229459d0a5c2947620e42d0940";
  var updateCollection;
  updateCollection = $.ajax(url, {
    type: 'GET',
    dataType: 'json',
    error: function(jqXHR, textStatus, errorThrown) {},
    success: (function(_this) {
      return function(data, textStatus, jqXHR) {
        
        // AllData = data;
        makeData2(data.rows)
        draw2();
        return;
      };
    })(this)
  });

}





function makeData2(rows) {
  data = [];

  rows.forEach(function(each) {
    // if ((indexOf.call(scity, each.town) >= 0)) {
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

//calculate average fare for each travel date
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
    
    
   
   var allDataKeysList2 = [draw_measure_map2.get('current_measure')]
//       [
//        'change_in_median_home_value_from_previous_year',
//        'change_in_number_of_sales_from_previous_year',
//        'change_in_permits_from_previous_year'
//    ]
   
   var yearFormat = d3.time.format("%Y");
   function calcChangeInCompare(vals, yrs) {
       
//       console.log("vals",vals)
       _value_from = vals[0];
       _year_from = yrs[0];
       _year_to = yrs[yrs.length-1]; 
       _value_to = vals[vals.length-1]
       _value_compare = (_value_to - _value_from)/_value_from
       if (_value_compare != undefined) {
       _years = yearFormat(new Date(_year_from)) + ' to ' + yearFormat(new Date(_year_to));
       _years_values_compare = d3.entries({years: _years, value_compare: _value_compare});
//       console.log('_value_compare',_years_values_compare)
       return _years_values_compare;
           }
           else {
               return _years_values_compare = d3.entries({years: _years, value_compare: 0});
           }
   }
   
   
   
   var counterID = 1;
    allDataList2 = [];
   allDataKeysList2.forEach(function(eachKey){       
       
       _allData2 = [];
       _allYears2 = [];
       
       _compare_years2 = [];
       _key = eachKey;
       
        nestedData.forEach(function(each) {
            _compare_data2 = [];
            _data =   each.values.map(function(d) {
                _val = d[_key];
//                console.log("val", _val);
                return _val;
            });
            _years =   each.values.map(function(d) {
                _yr = d['year'];
//                console.log("_yr", _yr);
                return _yr;
            });
            _years_values_compare = calcChangeInCompare(_data, _years);
            _data.unshift(each.city)
            _allData2.push(_data);
            _allYears2.push(_years)
            console.log('_years_values_compare[1]',_years_values_compare[1].value)
            _compare_data2.push(_years_values_compare[1].value)
            _compare_years2.push(_years_values_compare[0].value)
            _compare_data2.unshift(each.city)
            allDataList2.push(_compare_data2);
//            _compare_date2.
        })
        console.log('_compare_data2',_compare_data2)
        
       allDataList2.unshift(['years', _compare_years2[0]]);
       console.log('allDataList2',allDataList2)
       data_map2.set('allData'+counterID, allDataList2);
       counterID = counterID + 1;
        
   })
 

  // data is : data_map.get(metadata_map.get(draw_measure_map.get('current_measure')));
  return 
}





function draw2(){
  var tableName = d3.select('#table-name2');
  var source = d3.select('#source2').select('span')
  tableName.transition().style('opacity',0);
      

      chart2 = c3.generate({
        size: {
          width: 700,
          height: 350
        },
        bindto: "#plot2",
        data: {
          x: 'years',
          columns: data_map2.get(metadata_map2.get(draw_measure_map2.get('current_measure'))),
          type: 'bar', //'area-step',
          pattern: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'],
          onclick: function (d, element) { 

//            console.log("click", d, element);
            // chart.focus(d.id);
          }
          // labels: {
          //   format: function (v, id, i, j) { return id }
          // }
        },
        grid: {
            x: {
                show: false
            },
            y: {
                lines: [
                    {value: 0, text: '0% - No change'}
                ]
            }
        },
        axis: {
            x: {
                type: 'categories',
                tick: {
//                    format: '%Y',
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
                    },
              lines: [{value: 0}]

            }
              
        },
        legend: {
              show: false,
              position: 'bottom'
          }
});
    
    // updating the color schem based on the other chart, making sure same municipalities are in same colors
    chart2.data.colors(chart1Colors)
      function toggle(id) {
          chart2.toggle(id);
      }
    chart2Colors = chart2.data.colors();
      tableName.transition().style('opacity',1);
      tableName.html(layout_map2.get('table-name'));
      source.transition().style('opacity',1);
      source.html(sources_map2.get(draw_measure_map2.get('current_measure')));



}
  // var explainable = window.explainable;
    
})();