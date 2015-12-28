(function() {

var url_map = d3.map();
var layout_map = d3.map();
var draw_measure_map = d3.map();
var data_map = d3.map();
    var data_map2 = d3.map();
    
var chart;
var base_url = "SELECT * FROM {table} " 
var where_clause = " WHERE usegrp IN ('1FA') " + "AND town ILIKE('Cambridge')" + "AND level ILIKE('Town')"
var order_clause = " ORDER BY town ASC, year ASC "
var limit_clause = ""

url_map.set('where_clause', where_clause);
url_map.set('order_clause', order_clause);
url_map.set('limit_clause', limit_clause);


draw_measure_map.set('current_measure', 'medsale')
draw_measure_map.set('current_cities', 'Cambridge')

var metadata_map = d3.map({
  'medsale': 'allData1',
  'numsale': 'allData2',
  'forecolsure_petitions':'allData3',
  'single_family_units_permitted_imputation_2015_numbers_are_es':'allData4',
  'foreclosure_deeds':'allData5',
  'ytdfsnum':'allData6'
})

var metalabel_map = d3.map({
  'Single Family Home Sales': 'numsale',
  'Median Single Family Home Sale Prices': 'medsale',
  'Forecolsure Petitions': 'forecolsure_petitions',
  'Housing Permits':'single_family_units_permitted_imputation_2015_numbers_are_es',
  'Foreclosure Deeds':'foreclosure_deeds',
  'Foreclosure Sales':'ytdfsnum'
})

var format_axis_map = d3.map({
  'medsale': d3.format("$,"),
  'numsale': d3.format(","),
  'forecolsure_petitions': d3.format(","),
  'single_family_units_permitted_imputation_2015_numbers_are_es': d3.format(","),
  'foreclosure_deeds': d3.format(","),
  'ytdfsnum': d3.format(",")
})

var sources_map = d3.map({
  'medsale': 'The Warren Group',
  'numsale': 'The Warren Group',
  'forecolsure_petitions': 'The Warren Group',
  'single_family_units_permitted_imputation_2015_numbers_are_es': 'U.S. Census',
  'foreclosure_deeds': 'The Warren Group',
  'ytdfsnum': 'The Warren Group',
})



makeLegendCities();
makeAjaxCall(url_map);


$('#measure_options').dropdown(
      {
          onChange: function (value, id) {
            
            chart.unload(draw_measure_map.get('current_cities'));
            

            layout_map.set('table-name', value)
            draw_measure_map.set('current_measure', metalabel_map.get(id))
            chart.flow({
              columns: data_map.get(metadata_map.get(metalabel_map.get(id))),
                duration: 10,
                length: 0,
                done: function () {
                  chart.hide(draw_measure_map.get('current_cities'));

                  chart.flush();
                  chart.show(draw_measure_map.get('current_cities'));
                  draw();
                  
                }
              })
            
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
//          d3.select('#legend_options_add').attr('class', 'legend').selectAll('option')
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






function makeAjaxCall(urlMap) {
  
  if (urlMap.get('where_clause') == " WHERE usegrp IN ('1FA') AND (  )") {
    urlMap.set('where_clause', "Cambridge")
  }else{
    
  
  var url = '/queryData/' +base_url + urlMap.get('where_clause') + urlMap.get('order_clause') + urlMap.get('limit_clause')
  }
  var updateCollection;
  updateCollection = $.ajax(url, {
    type: 'GET',
    dataType: 'json',
    error: function(jqXHR, textStatus, errorThrown) {},
    success: (function(_this) {
      return function(data, textStatus, jqXHR) {
        
        // AllData = data;
        makeData(data.results)
        draw();
        return;
      };
    })(this)
  });

}





function makeData(rows) {
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

      city: each.town
    }
    )

  })


  var nestedData = d3.nest()
    .key(function(d){return d.city})
    .entries(data);
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
   var allDataList = [];
   var allDataKeysList = [
        'medsale',
        'numsale',
        'forecolsure_petitions',
        'single_family_units_permitted_imputation_2015_numbers_are_es',
        'foreclosure_deeds',
        'ytdfsnum'
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
       data_map.set('allData'+counterID, _allData);
       counterID = counterID + 1;
        
   })
 


  return 
}





function draw(){
  var tableName = d3.select('#table-name');
  var source = d3.select('#source').select('span')
  tableName.transition().style('opacity',0);
      

      chart = c3.generate({
        size: {
          // width: 750,
          height: 350
        },
        bindto: "#plot",
        data: {
          x: 'year',
          columns: data_map.get(metadata_map.get(draw_measure_map.get('current_measure'))),
          type: 'bar',
          pattern: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'],
          onclick: function (d, element) { 
          }
        },
          grid: {
            x: {
                show: true
            },
            y: {
                lines: [
                    {value: 0, text: ''}
                ]
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
                  
                  format: format_axis_map.get(draw_measure_map.get('current_measure')) 

              },
              label: {
                      show: false,
                      text: '',
                      position: 'outer-middle'
                    }

            }
              
        },
        legend: {
              show: true,
              position: 'bottom'
          }
});
      function toggle(id) {
          chart.toggle(id);
      }
      tableName.transition().style('opacity',1);
      tableName.html(layout_map.get('table-name'));
      source.transition().style('opacity',1);
      source.html(sources_map.get(draw_measure_map.get('current_measure')));
    
    chart1Colors = chart.data.colors();
    color_map_d = d3.map(chart1Colors, function(j){
      return j;
    })  
    color_map.set(chart1Colors, function(d) {return d;  });
}
})();