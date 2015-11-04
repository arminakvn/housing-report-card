# margin = 
#   t: 50
#   r: 50
#   b: 100
#   l: 50

# width = document.getElementById('plot').clientWidth - (margin.r) - (margin.l)
# height = document.getElementById('plot').clientHeight - (margin.t) - (margin.b)

# canvas = d3.select('.canvas')

# plot = canvas.append('svg')
# .attr('width', width + margin.r + margin.l)
# .attr('height', height + margin.t + margin.b)
# .append('g').attr('class', 'canvas')
#   .attr(
#     'transform', 
#     'translate(' + margin.l + ',' + margin.t + ')'
#   )

# startDate = new Date(2015, 10, 1)
# endDate = new Date(2016, 2, 10)

# scaleX = d3.time.scale().domain([
#   startDate
#   endDate
# ]).range([
#   0
#   width
# ])

# scaleY = d3.scale.linear().domain([
#   0
#   800
# ]).range([
#   height
#   0
# ])


# #line generator
# line = d3.svg.line().x((d) ->
#   scaleX d.date
# ).y((d) ->
#   scaleY d.avgFare
# ).interpolate('basis')


# area = d3.svg.area().x((d) ->
#   scaleX d.key
# ).y0((d) ->
#   scaleY d.minFare
# ).y1((d) ->
#   scaleY d.maxFare
# ).interpolate('basis')


# #axis generator
# axisX = d3.svg.axis()
# .orient('bottom')
# .tickSize(5)
# .ticks(d3.time.week)
# .tickFormat(d3.time.format('%Y-%m-%d'))


# axisY = d3
# .svg
# .axis()
# .orient('left')
# .tickSize(-width)
# .ticks(10)
# #Draw axes
# axisX.scale scaleX
# axisY.scale scaleY


# plot
# .append('g')
# .attr('class', 'axis axis-x')
# .attr(
#   'transform', 'translate(0,' + height + ')'
# ).call axisX


# plot.append('g')
# .attr(
#   'class', 'axis axis-y'
# ).call axisY


# plot
# .select('.axis-x')
# .selectAll('text')
# .attr 'transform', 
#   'rotate(90)translate(40,0)'

url = "https://arminavn.cartodb.com/api/v2/sql?q=SELECT * FROM warrendata&api_key=9150413ca8fb81229459d0a5c2947620e42d0940"
updateCollection = $.ajax url,
              type: 'GET'
              dataType: 'json'
              error: (jqXHR, textStatus, errorThrown) ->
                # $('body').append "AJAX Error: #{textStatus}"
              success: (data, textStatus, jqXHR) =>
                console.log "data", data




console.log 'Exercise 6-2'
#Set up drawing environment with margin conventions
margin = 
  t: 20
  r: 20
  b: 50
  l: 50
width = document.getElementById('plot').clientWidth - (margin.l) - (margin.r)
height = document.getElementById('plot').clientHeight - (margin.t) - (margin.b)
plot = d3.select('#plot').append('svg').attr('width', width + margin.l + margin.r).attr('height', height + margin.t + margin.b).append('g').attr('class', 'plot-area').attr('transform', 'translate(' + margin.l + ',' + margin.t + ')')
#Initialize axes
#Consult documentation here https://github.com/mbostock/d3/wiki/SVG-Axes
scaleX = undefined
scaleY = undefined
axisX = d3.svg.axis().orient('bottom').tickSize(-height).tickValues([
  10000
  50000
  100000
])
axisY = d3.svg.axis().orient('left').tickSize(-width).tickValues([
  0
  25
  50
  75
  100
])

gdpPerCapMin = d3.min(rows, (d) ->
  d.gdpPerCap
)
gdpPerCapMax = d3.max(rows, (d) ->
  d.gdpPerCap
)
#with mined information, we can now set up the scales
scaleX = d3.scale.log().domain([
  gdpPerCapMin
  gdpPerCapMax
]).range([
  0
  width
])
scaleY = d3.scale.linear().domain([
  0
  100
]).range([
  height
  0
])
#Once we know the scales, we can represent the scales with axes
axisX.scale scaleX
axisY.scale scaleY
plot.append('g').attr('class', 'axis axis-x').attr('transform', 'translate(0,' + height + ')').call axisX
plot.append('g').attr('class', 'axis axis-y').call axisY