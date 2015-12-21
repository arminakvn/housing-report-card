(function() {

var url_map2 = d3.map();
var layout_map2 = d3.map();
var draw_measure_map2 = d3.map();
    var data_map2 = d3.map();
var chart2;
var base_url2= "https://arminavn.cartodb.com/api/v2/sql?q=SELECT * FROM housing_report_cards_data " 
var where_clause2 = " WHERE usegrp IN ('1FA') " + "AND town ILIKE('Cambridge')" + "AND level ILIKE('Town')"
var order_clause2 = " ORDER BY town ASC, year ASC "
var limit_clause2 = ""
var api_key = " &api_key=9150413ca8fb81229459d0a5c2947620e42d0940"

url_map2.set('where_clause', where_clause2);
url_map2.set('order_clause', order_clause2);
url_map2.set('limit_clause', limit_clause2);


draw_measure_map2.set('current_measure', 'change_in_median_home_value_from_previous_year')
draw_measure_map2.set('current_cities', 'Boston')

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

console.log(metadata_map2)

makeLegendCities2();
makeAjaxCall2(url_map2);


$('#compare_options').dropdown(
      {
          onChange: function (value, id) {
            
            chart2.unload(draw_measure_map2.get('current_cities'));
            

            layout_map2.set('table-name', value)
            console.log('val',value, 'id', id)
            draw_measure_map2.set('current_measure', metalabel_map2.get(id))
            // chart.hide(draw_measure_map.get('current_cities'));
            // chart.show(draw_measure_map.get('current_cities'));
            chart2.flow({
              columns: data_map2.get(metadata_map2.get(metalabel_map2.get(id))),
                duration: 10,
                length: 0,
                done: function () {
                  chart2.hide(draw_measure_map2.get('current_cities'));

                  chart2.flush();
                  chart2.show(draw_measure_map2.get('current_cities'));
                  draw2();
                  
                  // chart.unload()
                }
              })

            // chart.load(data_map.get(metadata_map.get(draw_measure_map.get('current_measure'))))

            console.log(data_map2.get(metadata_map.2get(draw_measure_map2.get('current_measure'))))
            
            }
            

          });
    
    

function makeLegendCities2() {
  $('#compare_options').dropdown({
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
  var legend_cities_data = [];
  var legend_cities = []
  var url = "https://arminavn.cartodb.com/api/v2/sql?q=SELECT * FROM housing_report_cards_data WHERE usegrp IN ('1FA') ORDER BY town ASC, year ASC &api_key=9150413ca8fb81229459d0a5c2947620e42d0940";
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
          d3.select('#legend_compares_add').attr('class', 'legend').selectAll('option')
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






function makeAjaxCall2(urlMap2) {
  var url = base_url2 + urlMap2.get('where_clause') + urlMap2.get('order_clause') + urlMap2.get('limit_clause') + api_key
  console.log(urlMap2)
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
    
    
   var allDataList = [];
   var allDataKeysList = [
        'change_in_median_home_value_from_previous_year',
        'change_in_number_of_sales_from_previous_year',
        'change_in_permits_from_previous_year'
    ]
   var counterID = 1;
   allDataKeysList.forEach(function(eachKey){       
       _allData = [];
       var _key = eachKey;
        nestedData.forEach(function(each) {
            _data =   each.values.map(function(d) {
                _val = d[_key];
                return _val;
            });
            _data.unshift(each.city)
            _allData.push(_data);
        })
        _allData.unshift(['year', new Date(2000, 01,01),new Date(2001, 01,01),new Date(2002, 01,01),new Date(2003, 01,01),
            new Date(2004, 01,01), new Date(2005, 01,01),new Date(2006, 01,01),new Date(2007, 01,01),new Date(2008, 01,01),
            new Date(2009, 01,01), new Date(2010, 01,01),new Date(2011, 01,01),new Date(2012, 01,01),new Date(2013, 01,01),new Date(2014, 01,01),new Date(2015, 01,01)]);
        allDataList.push(_allData);
       data_map2.set('allData'+counterID, _allData);
       counterID = counterID + 1;
        
   })
 
//  nestedData.forEach(function(each) {
//      data = each.values.map(function(d) {return d.medsale;})
//      data2 = each.values.map(function(d) {return d.numsale;})    
//      data3 = each.values.map(function(d) {return d.forecolsure_petitions;})    
//      data4 = each.values.map(function(d) {return d.single_family_units_permitted_imputation_2015_numbers_are_es;})    
//      data5 = each.values.map(function(d) {return d.foreclosure_deeds;})    
//      data6 = each.values.map(function(d) {return d.ytdfsnum;})    
//      data.unshift(each.city)
//      data2.unshift(each.city)
//      data3.unshift(each.city)
//      data4.unshift(each.city)
//      data5.unshift(each.city)
//      data6.unshift(each.city)
//      allData.push(data);
//      allData2.push(data2);
//      allData3.push(data3);
//      allData4.push(data4);
//      allData5.push(data5);
//      allData6.push(data6);
//    
//  })
//  allData.unshift(['year', new Date(2000, 01,01),new Date(2001, 01,01),new Date(2002, 01,01),new Date(2003, 01,01),
//    new Date(2004, 01,01), new Date(2005, 01,01),new Date(2006, 01,01),new Date(2007, 01,01),new Date(2008, 01,01),
//    new Date(2009, 01,01), new Date(2010, 01,01),new Date(2011, 01,01),new Date(2012, 01,01),new Date(2013, 01,01),new Date(2014, 01,01),new Date(2015, 01,01)]);
//  allData2.unshift(['year', new Date(2000, 01,01),new Date(2001, 01,01),new Date(2002, 01,01),new Date(2003, 01,01),
//    new Date(2004, 01,01), new Date(2005, 01,01),new Date(2006, 01,01),new Date(2007, 01,01),new Date(2008, 01,01),
//    new Date(2009, 01,01), new Date(2010, 01,01),new Date(2011, 01,01),new Date(2012, 01,01),new Date(2013, 01,01),new Date(2014, 01,01),new Date(2015, 01,01)]);
//  allData3.unshift(['year', new Date(2000, 01,01),new Date(2001, 01,01),new Date(2002, 01,01),new Date(2003, 01,01),
//    new Date(2004, 01,01), new Date(2005, 01,01),new Date(2006, 01,01),new Date(2007, 01,01),new Date(2008, 01,01),
//    new Date(2009, 01,01), new Date(2010, 01,01),new Date(2011, 01,01),new Date(2012, 01,01),new Date(2013, 01,01),new Date(2014, 01,01),new Date(2015, 01,01)]);
//
//
//    
//  data_map.set('allData', allData);
//  data_map.set('allData2', allData2);
//  data_map.set('allData3', allData3);
//    
//    console.log("data_map",data_map, data_map2);
  // data is : data_map.get(metadata_map.get(draw_measure_map.get('current_measure')));
  return 
}





function draw2(){
  var tableName = d3.select('#table-name');
  var source = d3.select('#source').select('span')
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
          type: 'bar',
          pattern: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'],
          onclick: function (d, element) { 

            console.log("click", d, element);
            // chart.focus(d.id);
          }
          // labels: {
          //   format: function (v, id, i, j) { return id }
          // }
        },
        axis: {2
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
      tableName.html(layout_map.get('table-name'));
      source.transition().style('opacity',1);
      source.html(sources_map2.get(draw_measure_map2.get('current_measure')));



}
  // var explainable = window.explainable;
    
})();