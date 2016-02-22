function map(data) {
    var gData = [];
    var startTime;
    var endTime;
    var time = 0;
    var zoom = d3.behavior.zoom()
            .scaleExtent([0.5, 8])
            .on("zoom", move);
    var mapDiv = $("#map");
    var clustered = false;


    var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = mapDiv.width() - margin.right - margin.left,
            height = mapDiv.height() - margin.top - margin.bottom;

    var curr_mag = 4;

    var format = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");

    var timeExt = d3.extent(data.map(function (d) {
        return format.parse(d.time);
    }));

    

    //Sets the colormap
    var colors = colorbrewer.Set3[10];

    //Assings the svg canvas to the map div
    var svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(zoom);

    var g = svg.append("g");

    //Sets the map projection
    var projection = d3.geo.mercator()
            .center([8.25, 56.8])
            .scale(700);

    //Creates a new geographic path generator and assing the projection        
    var path = d3.geo.path().projection(projection);

    //Formats the data in a feature collection trougth geoFormat()
    var geoData = {type: "FeatureCollection", features: geoFormat(data)};
    
    var filteredData = geoData.features;
    //Loads geo data
    d3.json("data/world-topo.json", function (error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;
        draw(countries);
    });

    //Calls the filtering function 
    d3.select("#slider").on("input", function () {
        filterMag(this.value, data);
    });

    //Formats the data in a feature collection
    function geoFormat(array) {
        var data = [];
        array.map(function (d, i) {
           var feature = {
            "type" : "Feature",
            "geometry" : {
                "type" : "Point", 
                "coordinates": [d.lon, d.lat]
            },
            "properties" : {
                "id" : d.id,
                "time" : d.time,
                "depth" : d.depth,
                "mag" : d.mag,
                "place" : d.place
            }
           }    
           data.push(feature);
        });
        return data;
    }

    //Draws the map and the points
    function draw(countries)
    {
        //draw map
        var country = g.selectAll(".country").data(countries);
        country.enter().insert("path")
                .attr("class", "country")
                .attr("d", path)
                .style('stroke-width', 1)
                .style("fill", "lightgray")
                .style("stroke", "white");

        //draw point        
        var point = g.selectAll("circle")
                    .data(geoData.features)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("cx", function(d) {
                        return projection(d.geometry.coordinates)[0];
                    })
                    .attr("cy", function(d) {
                        return projection(d.geometry.coordinates)[1];
                    })
                    .attr("r", 3)
                    .style("fill", "orange")
                    
                    
    };

    //Filters data points according to the specified magnitude
    function filterMag(value) {
        document.getElementById("slider-value").innerHTML = value;
        svg.selectAll("circle").style("opacity", function(d) {
            return (value < d.properties.mag) ? 1 : 0;
        });
    }
    
    //Filters data points according to the specified time window
    this.filterTime = function (value) {
        startTime = value[0].getTime();
        endTime = value[1].getTime();
        if(startTime == endTime)
            return;
        svg.selectAll("circle").style("opacity", function(d) {
            if (clustered)
            {
                time = new Date(d.time);
            }
            else
            {
                time = new Date(d.properties.time);
                //console.log(d.properties.time);
            }
           // var time = new Date(d.time);
         //var time = new Date(d.properties.time);
         return (startTime <= time.getTime() && time.getTime() <= endTime) ? 1 : 0;
        });
    };

    //Calls k-means function and changes the color of the points  
    this.cluster = function () {
        
        gData = [];
        var filtDataIndex =  [];
        //add all data to the global data array which is not filtered out 
        for (j=0; j < data.length; j++) {
            var dTime = new Date(data[j].time);
            var dMag = data[j].mag;
            //make data array with selected values
            if ((startTime == 0 || dTime.getTime() >= startTime) && 
                    (endTime == 0 || dTime.getTime() <= endTime)) {
                filtDataIndex.push(j);
                gData.push(data[j]);
            }
        }


        var kmeansRes = [];
        kmeansRes = kmeans(gData, Number(k.value));
        self.color = d3.scale.category20()
                     .domain(0,Number(k.value));
        var cenIndex = kmeansRes[0].length - 1;
        for (var i = 0; i < gData.length; i++)
        {
            gData[i].centroidIndex = kmeansRes[i][cenIndex]; // centroid index
        }
        for (var i = 0; i < gData.length; i++)
        {
            data[filtDataIndex[i]].centroidIndex = gData[i].centroidIndex;
        }


        console.log(gData.length);
        svg.selectAll("circle")
        .data(data)
        .style("fill", function(d) {  return self.color(d.centroidIndex); });
        for (var i = 0; i < data.length; i++)
        {
            delete data[i].centroidIndex;
        }
       // console.log(data[0]);
        clustered = true;

    };

    //Zoom and panning method
    function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
    }

    //Prints features attributes
    function printInfo(value) {
        var elem = document.getElementById('info');
        elem.innerHTML = "Place: " + value["place"] + " / Depth: " + value["depth"] + " / Magnitude: " + value["mag"] + "&nbsp;";
    }

}
