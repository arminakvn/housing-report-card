(function() {

var url_map = d3.map();

var base_url = "https://arminavn.cartodb.com/api/v2/sql?q=SELECT * FROM warren_yr_town " 
var where_clause = " WHERE usegrp IN ('1FA') "
var order_clause = " ORDER BY town ASC, year ASC "
var limit_clause = ""
var api_key = " &api_key=9150413ca8fb81229459d0a5c2947620e42d0940"

url_map.set('where_clause', where_clause);
url_map.set('order_clause', order_clause);
url_map.set('limit_clause', limit_clause);
makeLegendCities()
$('#measure_options').dropdown(
      {
          // allowAdditions: false,
          onChange: function (val) {
            // console.log(chart.data())
            // chart.transform('bar', 'Acton')
            // url_map.set('where_clause', "AND town ILIKE" +  "'%" + val + "%'")
            makeAjaxCall(url_map)

            // chart.hide(legend_cities);
                      // console.log(val);
                      // chart.show(val);
                      // chart.focus(val);
                      // val.forEach(function(id){
                      //   chart.toggle(id);
                      // }
                      //   )
                      // draw(val);
                  }

          });

function makeLegendCities() {
  $('#legend_options').dropdown({
          allowAdditions: false,
          onChange: function (val) {
            url_map.set('where_clause', " WHERE usegrp IN ('1FA') AND town ILIKE " +  "('" + val + "')")
            makeAjaxCall(url_map)

            // chart.hide(legend_cities);
            //           chart.show(val);
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
        console.log("lege",legend_cities);
        d3.select('#legend_options').attr('class', 'legend').selectAll('option')
          .data(legend_cities)
        .enter().append('option')
          .attr('data-id', function (id) { return id; })
          .attr('value', function(id) {return id;})
          .html(function (id) { return id; })
          // .each(function (id) {
          //     d3.select(this).style('background-color', chart.color(id));
          // })
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
          d3.select('#legend_options_add').attr('class', 'legend').selectAll('option')
          .data(legend_cities)
          .enter().append('option')
            .attr('data-id', function (id) { return id; })
            .attr('value', function(id) {return id;})
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
        scity = "Hudson"
        // AllData = data;
        data = makeData(data.rows)
        draw(data, scity);
        return;
      };
    })(this)
  });

}





function makeData(rows) {
  data = [];
      // parse
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
    // }
  })

  // data.sort(function(a,b){
  //       return b.year - a.year;
  //   })
  var nestedData = d3.nest()
    .key(function(d){return d.city})
    .entries(data);

//calculate average fare for each travel date
    nestedData.forEach(function(t){
        t.city = t.key;
        t.max = d3.max(t.values, function(quarter){return quarter.medsale});

        // console.log("average fare for " + t.key + 'is '+ t.max);

    });

    // nestedData.sort(function(a,b){
    //     return b.date - a.date;
    // })



  medsaleMin = d3.min(nestedData, function(d) {
    // console.log("d.medsale",d.medsale)
    return d.max;
  });

  medsaleMax = d3.max(nestedData, function(d) {
    return d.max ;
  });

base_color = d3.rgb(49, 130, 189);
  allData = []
  allData2= []
 
  nestedData.forEach(function(each) {
    // data = []
    // data.push(each.city)

    data = each.values.map(function(d) {return d.medsale;})
    data2 = each.values.map(function(d) {return d.numale;})        
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

  return allData;
}


function draw(data, city){
// $.when(rows).done((function(_this) {
  // return function(rows) {
  scity = city.split(",");
      // console.log(scity.split(","));
      
      

      var chart = c3.generate({
        size: {
          width: 1100,
          height: 550
        },
        bindto: "#plot",
        data: {
          x: 'year',
          columns: data,
           type: 'bar'
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