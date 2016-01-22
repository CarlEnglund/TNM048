function sp(){

    var self = this; // for internal d3 functions

    var spDiv = $("#sp");

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom;

    //initialize color scale
    //...
    var colorscale = d3.scale.category20();    
    //initialize tooltip
    //...

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#sp").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Load data
    d3.csv("data/OECD-better-life-index-hi.csv", function(error, data) {
        self.data = data;
        
        //define the domain of the scatter plot axes
        //...
        //In the x domain, select between 0 and max of data/Life Satisfaction
        x.domain([0, d3.max(data, function(d) { return d["Employment rate"]; })]);
        //In the x domain, select between 0 and max of data/Househould income
        y.domain([0, d3.max(data, function(d) { return d["Household income"]; })]);
        
        draw();

    });

    function draw()
    {
        
        // Add x axis and title.
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", 100)
            .attr("y", -6)
            .text("Employment rate");
    

        // Add y axis and title.
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 8)
            .attr("x", -100)
            .attr("dy", ".71em")
            .text("Household income")

         
            
        // Add the scatter dots.
        svg.selectAll(".dot")
            .data(self.data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", function(d) {
                return x(d["Employment rate"]); //Load data
            })
            .attr("cy", function(d) {
                return y(d["Household income"]); //Load data
            })
            .attr("r", 10)
            .style("fill", function(d){return colorscale(d["Country"]);})

            //tooltip
            .on("mousemove", function(d) {
                //...    
            })
            .on("mouseout", function(d) {
                //...   
            })
            .on("click",  function(d) {
                //sp1 is created in main.js
                sp1.selectDot(d["Country"]); 
                selFeature(d["Country"]);
            });
    }

    //method for selecting the dot from other components
    this.selectDot = function(value){
        console.log(value);
        d3.select("#sp")
        .selectAll(".dot")
        .data(self.data)
        .attr("opacity", 0.2)
        .style("stroke", "none")
        .filter(function(d) {return value.indexOf(d["Country"]) != -1})
        .attr("opacity", 1.0)
        .style("stroke", "red");
        
    };
    
    //method for selecting features of other components
    function selFeature(value){
        pc1.selectLine(value);
    }

}




