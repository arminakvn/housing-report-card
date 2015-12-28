(function() {

var url_map2 = d3.map();
var layout_map2 = d3.map();
var draw_measure_map2 = d3.map();
    var data_map2 = d3.map();
var chart2;
var base_url2=  "SELECT * FROM {table} " 
var where_clause2 = " WHERE usegrp IN ('1FA') " + "AND level ILIKE('Town')"
var where_clause_towns2 = "AND town ILIKE('Cambridge') OR town ILIKE('Boston') OR town ILIKE('Cohasset')" 
var where_clause_years2 = " AND year >= 2006 "
var order_clause2 = " ORDER BY town ASC, year ASC "
var limit_clause2 = ""


url_map2.set('where_clause', where_clause2);
url_map2.set('where_clause_towns', where_clause_towns2);
url_map2.set('where_clause_years', where_clause_years2);
url_map2.set('order_clause', order_clause2);
url_map2.set('limit_clause', limit_clause2);


draw_measure_map2.set('current_measure', 'medsale')
draw_measure_map2.set('current_cities', 'Boston')
draw_measure_map2.set('current_compare_from', '2005')
draw_measure_map2.set('current_compare_to', '2015')



var metadata_map2 = d3.map({
  'medsale': 'allData1',
  'numsale': 'allData2',
  'forecolsure_petitions':'allData3',
  'single_family_units_permitted_imputation_2015_numbers_are_es':'allData4',
  'foreclosure_deeds':'allData5',
  'ytdfsnum':'allData6'
})

var metalabel_map2 = d3.map({
  'Single Family Home Sales': 'numsale',
  'Median Single Family Home Sale Prices': 'medsale',
  'Forecolsure Petitions': 'forecolsure_petitions',
  'Housing Permits':'single_family_units_permitted_imputation_2015_numbers_are_es',
  'Foreclosure Deeds':'foreclosure_deeds',
  'Foreclosure Sales':'ytdfsnum'
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
   'medsale': d3.format("$,"),
  'numsale': d3.format(","),
  'forecolsure_petitions': d3.format(","),
  'single_family_units_permitted_imputation_2015_numbers_are_es': d3.format(","),
  'foreclosure_deeds': d3.format(","),
  'ytdfsnum': d3.format(",")
})
var sources_map2 = d3.map({
    'medsale': 'The Warren Group',
    'numsale': 'The Warren Group',
    'forecolsure_petitions': 'The Warren Group',
    'single_family_units_permitted_imputation_2015_numbers_are_es': 'U.S. Census',
    'foreclosure_deeds': 'The Warren Group',
    'ytdfsnum': 'The Warren Group',
})


makeLegendCities2();
makeAjaxCall2(url_map2);


$('#compare_options').dropdown(
      {
          onChange: function (value, id) {
            chart2.unload(draw_measure_map2.get('current_cities'));
            layout_map2.set('table-name', value)
            draw_measure_map2.set('current_measure', metalabel_map2.get(id))
            makeAjaxCall2(url_map2)


            
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
              year_fix = Number(val) + 1;
            draw_measure_map2.set('current_compare_to', year_fix)
            andStrings = 'year >=' + draw_measure_map2.get('current_compare_from') + ' AND year <' + year_fix + ' ';
              url_map2.set('where_clause_years', " AND "+andStrings)
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
        data.results.forEach(function(each){
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
          
          
        return;
      };
    })(this)
  });
}






function makeAjaxCall2(urlMap2) {


  
  if (urlMap2.get('where_clause_towns') == " AND (  )") {
    urlMap2.set('where_clause_towns', "AND town ILIKE('Cambridge')")
  }
  var url = '/queryData/' +base_url2 + urlMap2.get('where_clause') + urlMap2.get('where_clause_towns') + urlMap2.get('where_clause_years') + urlMap2.get('order_clause') + urlMap2.get('limit_clause')
  var updateCollection;
  updateCollection = $.ajax(url, {
    type: 'GET',
    dataType: 'json',
    error: function(jqXHR, textStatus, errorThrown) {},
    success: (function(_this) {
      return function(data, textStatus, jqXHR) {
        
        makeData2(data.results)
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
      medsale: +each.median_sale_rpice.toFixed(0),
      numsale: +each.number_of_sales,
      forecolsure_petitions: +each.forecolsure_petitions,
      single_family_units_permitted_imputation_2015_numbers_are_es: +each.single_family_units_permitted_imputation_2015_numbers_are_es,
      foreclosure_deeds: +each.foreclosure_deeds,
      ytdfsnum: +each.ytdfsnum,
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
    
    
   

   var yearFormat = d3.time.format("%Y");
   function calcChangeInCompare(vals, yrs) {
       
       _value_from = vals[0];
       _year_from = yrs[0];
       _year_to = yrs[yrs.length-1]; 
       _value_to = vals[vals.length-1];
       _value_compare = (_value_to - _value_from)/_value_from
       if (_value_compare != undefined && _value_compare != Infinity) {
       _years = yearFormat(new Date(_year_from)) + ' to ' + yearFormat(new Date(_year_to));
       _years_values_compare = d3.entries({years: _years, value_compare: _value_compare});
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
       _key = draw_measure_map2.get('current_measure');
       
        nestedData.forEach(function(each) {
            _compare_data2 = [];
            _data =   each.values.map(function(d) {
                _val = d[_key];
                return _val;
            });
            _years =   each.values.map(function(d) {
                _yr = d['year'];
                return _yr;
            });
            _years_values_compare = calcChangeInCompare(_data, _years);
            _data.unshift(each.city)
            _allData2.push(_data);
            _allYears2.push(_years)
            _compare_data2.push(_years_values_compare[1].value)
            _compare_years2.push(_years_values_compare[0].value)
            _compare_data2.unshift(each.city)
            allDataList2.push(_compare_data2);
        })
        
       allDataList2.unshift(['years', _compare_years2[0]]);
       data_map2.set('allData'+counterID, allDataList2);
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
          // width: 700,
          height: 350
        },
        bindto: "#plot2",
        data: {
          x: 'years',
          columns: data_map2.get(metadata_map2.get(draw_measure_map2.get('current_measure'))),
          type: 'bar', //'area-step',
          pattern: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'],
          onclick: function (d, element) { 


          },
          labels: {
          format: function (v, id, i, j) {return id; }
        }

        },
        bar: {
          width: {
            ratio: 0.4
          }
        },
        grid: {
            x: {
                show: false
            },
            y: {
                lines: [
                    {value: 0, text: '0%'}
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
                  
                  format:d3.format('%,')

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
              show: true,
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
      chart2Colors = chart2.data.colors();
    color_map_d = d3.map(chart2Colors, function(j){
      return j;
    })  

} 
})();