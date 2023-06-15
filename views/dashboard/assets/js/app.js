$(document).ready(function () {
    var headers = new Headers()
    headers.append("Content-Type", "application/json")

    var getUrl = window.location
    var base = getUrl.protocol + "//" + getUrl.host

    ////////// Definition of Functions for Drawing Charts /////////
    function createBubbleChart(data, new_data) {
        data = data;
        new_data = new_data;
        if (new_data) {
            var svg = d3.select("#bubbleChart");
            svg.selectAll('*').remove();
            data = new_data;

        }
        //new_data = new_data;

        // set the dimensions and margins of the graph
        var margin = { top: 10, right: 30, bottom: 30, left: 60 },
            width = 900 - margin.left - margin.right,
            height = 450 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#bubbleChart")
            .append("svg")
            .data([data])
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");



        // Defining graph title and axis labels
        const xAxisLabel = "Total Alkalinity (mg/L)";
        const yAxisLabel = "Sulphate (mg/L)";
        const title = `Bubble Chart of Total Hardness (mg/L) vs ${yAxisLabel}, ${xAxisLabel} and Source of Water`;

        //Create Title 
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 0)
            .style("text-anchor", "middle")
            .text(title);

        //Create X axis label   
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom)
            .style("text-anchor", "middle")
            .text(xAxisLabel);

        //Create Y axis label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(yAxisLabel);

        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, 500])
            .range([0, width]);
        var xAxis = svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 50])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add a clipPath: everything out of this area won't be drawn.
        var clip = svg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", width)
            .attr("height", height)
            .attr("x", 0)
            .attr("y", 0)
            .attr("z", 0);

        // Add a scale for bubble size
        var z = d3.scaleLinear()
            .domain([0, 70])
            .range([0, 10]);


        
        // list of keys
        var keys = []
        var allGroup = d3.map(data, function (d) { if(d.SourceName != 'SourceName'){keys.push(d.SourceName)} }).keys()


        // Add a scale for bubble color
        var color = d3.scaleOrdinal()
            .domain(keys)
            .range(d3.schemeSet1);


        // Add one dot in the legend for each name.
        var size = 10
        svg.selectAll("mydots")
            .data(keys)
            .enter()
            .append("rect")
            .attr("x", 630)
            .attr("y", function (d, i) { return 20 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("width", size)
            .attr("height", size)
            .style("fill", function (d) { return color(d) })


        //Add one dot in the legend for each name.
        svg.selectAll("mylabels")
            .data(keys)
            .enter()
            .append("text")
            .attr("x", 650 + size * 1.2)
            .attr("y", function (d, i) { return 20 + i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function (d) { return color(d) })
            .text(function (d) { return d })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")


        // Add brushing
        var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
            .extent([[0, 0], [width, height]]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function

        // Create the scatter variable: where both the circles and the brush take place
        var scatter = svg.append('g')
            .attr("clip-path", "url(#clip)")

        // Add circles
        scatter
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.TotalAlkalinity); })
            .attr("cy", function (d) { return y(d.Sulphate); })
            .attr("r", function (d) { return z(d.Totalhardness); })
            .style("fill", function (d) { return color(d.SourceName) })
            .style("opacity", 0.5)


        // Add the brushing
        scatter
            .append("g")
            .attr("class", "brush")
            .call(brush);

        // A function that set idleTimeOut to null
        var idleTimeout
        function idled() { idleTimeout = null; }


        // A function that update the chart for given boundaries
        function updateChart() {

            extent = d3.event.selection

            // If no selection, back to initial coordinate. Otherwise, update X axis domain
            if (!extent) {
                if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
                x.domain([30, 300])
            } else {
                x.domain([x.invert(extent[0]), x.invert(extent[1])])
                scatter.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
            }

            // Update axis and circle position
            xAxis.transition().duration(1000).call(d3.axisBottom(x))
            scatter
                .selectAll("circle")
                .transition().duration(1000)
                .attr("cx", function (d) { return x(d.TotalAlkalinity); })
                .attr("cy", function (d) { return y(d.Sulphate); })
                .attr("r", function (d) { return z(d.Totalhardness); })
            


        }





    }



    function createHistogram(data, new_data) {

        data = data;
        new_data = new_data;
        if (new_data) {
            var svg = d3.select("#histogram");
            svg.selectAll('*').remove();
            data = new_data;

        }

        // set the dimensions and margins of the graph
        var margin = { top: 10, right: 30, bottom: 30, left: 40 },
            width = 480 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#histogram")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");




        // Defining graph title and axis labels
        const xAxisLabel = "Turbidity";
        const yAxisLabel = "Range";
        const title = `Histogram showing ${yAxisLabel} of ${xAxisLabel} of Water`;

        //Create Title 
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 0)
            .style("text-anchor", "middle")
            .text(title);

        //Create X axis label   
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom)
            .style("text-anchor", "middle")
            .text(xAxisLabel);

        //Create Y axis label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(yAxisLabel);

        // X axis: scale and draw:
        var x = d3.scaleLinear()
            .domain([0, 10])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Y axis: initialization
        var y = d3.scaleLinear()
            .range([height, 0]);
        var yAxis = svg.append("g")

        // A function that builds the graph for a specific value of bin
        function update(nBin) {

            // set the parameters for the histogram
            var histogram = d3.histogram()
                .value(function (d) { return d.Turbidity; })   // I need to give the vector of value
                .domain(x.domain())  // then the domain of the graphic
                .thresholds(x.ticks(nBin)); // then the numbers of bins

            // And apply this function to data to get the bins
            var bins = histogram(data);

            // Y axis: update now that we know the domain
            y.domain([0, d3.max(bins, function (d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
            yAxis
                .transition()
                .duration(1000)
                .call(d3.axisLeft(y));

            // Join the rect with the bins data
            var u = svg.selectAll("rect")
                .data(bins)

            // Manage the existing bars and eventually the new ones:
            u
                .enter()
                .append("rect") // Add a new rect for each new elements
                .merge(u) // get the already existing elements as well
                .transition() // and apply changes to all of them
                .duration(1000)
                .attr("x", 1)
                .attr("transform", function (d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
                .attr("width", function (d) { return x(d.x1) - x(d.x0) - 1; })
                .attr("height", function (d) { return height - y(d.length); })
                .style("fill", "#69b3a2")


            // If less bar in the new histogram, I delete the ones not in use anymore
            u
                .exit()
                .remove()

        }


        // Initialize with 20 bins
        update(10)


        // Listen to the button -> update if user change it
        d3.select("#nBin").on("input", function () {
            update(+this.value);
        });

        //});
    }



    function createConnectedScatter(data, new_data) {

        data = data;
        new_data = new_data;
        if (new_data) {
            var svg = d3.select("#connectedScatter");
            svg.selectAll('*').remove();
            data = new_data;

        }

        // set the dimensions and margins of the graph
        var margin = { top: 10, right: 100, bottom: 30, left: 30 },
            width = 1000 - margin.left - margin.right,
            height = 480 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#connectedScatter")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Defining graph title and axis labels
        const xAxisLabel = "Total Hardness";
        const yAxisLabel = "Sulphate/Calcium Hardness/Magnessium Hardness/TotalAlkalinity/Bicarbonates";
        const title = `Connected Scatter Plot of ${xAxisLabel} versus ${yAxisLabel} of Water Quality`;

        //Create Title 
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 0)
            .style("text-anchor", "middle")
            .text(title);

        //Create X axis label   
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom)
            .style("text-anchor", "middle")
            .text(xAxisLabel);

        //Create Y axis label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(yAxisLabel);


        // List of groups (here I have one group per column)
        var allGroup = ["Sulphate", "Calciumhardness", "Magnessiumhardness", "TotalAlkalinity", "Bicarbonates"]

        // Reformat the data: we need an array of arrays of {x, y} tuples
        var dataReady = allGroup.map(function (grpName) { // .map allows to do something for each element of the list
            return {
                name: grpName,
                values: data.map(function (d) {
                    return { Totalhardness: d.Totalhardness, value: +d[grpName] };
                })
            };
        });


        // A color scale: one color for each group
        var myColor = d3.scaleOrdinal()
            .domain(allGroup)
            .range(d3.schemeSet2);

        // Add X axis --> it is a date format
        var x = d3.scaleLinear()
            .domain([30, 200])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 400])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add the lines
        var line = d3.line()
            .x(function (d) { return x(+d.Totalhardness) })
            .y(function (d) { return y(+d.value) })
        svg.selectAll("myLines")
            .data(dataReady)
            .enter()
            .append("path")
            .attr("class", function (d) { return d.name })
            .attr("d", function (d) { return line(d.values) })
            .attr("stroke", function (d) { return myColor(d.name) })
            .style("stroke-width", 4)
            .style("fill", "none")

        // Add the points
        svg
            // First we need to enter in a group
            .selectAll("myDots")
            .data(dataReady)
            .enter()
            .append('g')
            .style("fill", function (d) { return myColor(d.name) })
            .attr("class", function (d) { return d.name })
            // Second we need to enter in the 'values' part of this group
            .selectAll("myPoints")
            .data(function (d) { return d.values })
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.Totalhardness) })
            .attr("cy", function (d) { return y(d.value) })
            .attr("r", 5)
            .attr("stroke", "white")

        // Add a label at the end of each line
        svg
            .selectAll("myLabels")
            .data(dataReady)
            .enter()
            .append('g')
            .append("text")
            .attr("class", function (d) { return d.name })
            .datum(function (d) { return { name: d.name, value: d.values[d.values.length - 1] }; }) // keep only the last value of each time series
            .attr("transform", function (d) { return "translate(" + x(d.value.Totalhardness) + "," + y(d.value.value) + ")"; }) // Put the text at the position of the last point
            .attr("x", 12) // shift the text a bit more right
            .text(function (d) { return d.name; })
            .style("fill", function (d) { return myColor(d.name) })
            .style("font-size", 15)

        // Add a legend (interactive)
        svg
            .selectAll("myLegend")
            .data(dataReady)
            .enter()
            .append('g')
            .append("text")
            .attr('x', function (d, i) { return 30 + i * 60 })
            .attr('y', 30)
            .text(function (d) { return d.name; })
            .style("fill", function (d) { return myColor(d.name) })
            .style("font-size", 15)
            .on("click", function (d) {
                // is the element currently visible ?
                currentOpacity = d3.selectAll("." + d.name).style("opacity")
                // Change the opacity: from 0 to 1 or from 1 to 0
                d3.selectAll("." + d.name).transition().style("opacity", currentOpacity == 1 ? 0 : 1)

            })
        //})
    }



    function createHeatmap(data, new_data) {

        data = data;
        new_data = new_data;
        if (new_data) {
            var svg = d3.select("#heatmap");
            svg.selectAll('*').remove();
            data = new_data;

        }

        // set the dimensions and margins of the graph
        var margin = { top: 80, right: 25, bottom: 30, left: 40 },
            width = 600 - margin.left - margin.right,
            height = 420 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#heatmap")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");



        // Labels of row and columns -- Origin and Model_Year
        var myOrigin = d3.map(data, function (d) { return d.SourceName; }).keys()
        var ElectricalConductivity = d3.map(data, function (d) { return d.ElectricalConductivity; }).keys()

        // Build X scales and axis:
        var x = d3.scaleBand()
            .range([0, width])
            .domain(myOrigin)
            .padding(0.05);
        svg.append("g")
            .style("font-size", 15)
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(0))
            .select(".domain").remove()

        // Build Y scales and axis:
        var y = d3.scaleBand()
            .range([height, 0])
            .domain(ElectricalConductivity)
            .padding(0.05);
        svg.append("g")
            .style("font-size", 15)
            .call(d3.axisLeft(y).tickSize(0))
            .select(".domain").remove()

        // Build color scale
        var myColor = d3.scaleSequential()
            .interpolator(d3.interpolateInferno)
            .domain([1, 70])

        // create a tooltip
        var tooltip = d3.select("#heatmap")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function (d) {
            tooltip
                .style("opacity", 1)
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)
        }
        var mousemove = function (d) {
            if(d.SourceName != 'SourceName'){
                var sourcename = d.SourceName;
            }
            tooltip
                .html("Water Source: " + sourcename + "<br>GPS: " + d.GPS + "<br> (FieldTemp oC): " + d.FieldTempeature)
                .style("left", (d3.mouse(this)[0] + 70) + "px")
                .style("top", (d3.mouse(this)[1]) + "px")
        }
        var mouseleave = function (d) {
            tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 0.8)
        }

        // add the squares
        svg.selectAll()
            .data(data, function (d) { 
                if(d.SourceName != 'SourceName'){
                    var sname =  d.SourceName;
                    if(sname.length > 3) sname = sname.substring(0,3);
                    return sname + ':' + d.ElectricalConductivity; 
                }
            })
            .enter()
            .append("rect")
            .attr("x", function (d) { 
                if(d.SourceName != 'SourceName'){
                    return x(d.SourceName); 
                }                 
            })
            .attr("y", function (d) { return y(d.ElectricalConductivity) })
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", function (d) { return myColor(d.FieldTempeature) })
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
        //})

        // Add title to graph
        svg.append("text")
            .attr("x", 0)
            .attr("y", -50)
            .attr("text-anchor", "left")
            .style("font-size", "15px")
            .text("Heatmap of Water by Electrical Conductivity (µS/cm), Source and Field Tempeature (oC)");



        // Defining the graph's axis labels
        const xAxisLabel = "Source of Water";
        const yAxisLabel = "Electrical Conductivity (µS/cm)";

        //Create X axis label   
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom)
            .style("text-anchor", "middle")
            .text(xAxisLabel);

        //Create Y axis label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(yAxisLabel);
    }


    var datasource = $("#district").val();
    // https://raw.githubusercontent.com/karthikkakarla9/dataViz/main/a1-cars-1.csv
    //reading data: a1-cars dataset
    d3.csv(base + '/views/dashboard/data/' + datasource + '.csv', function (data) {

        // List of groups
        var allGroup = d3.map(data, function (d) { return (d.SourceName) }).keys()
        // add the options to the button
        d3.select("#selectOrigin")
            .selectAll('myOptions')
            .data(allGroup)
            .enter()
            .append('option')
            .text(function (d) { return d + " District Water Quality Data"; }) // text showed in the menu
            .attr("value", function (d) { return d; }) // corresponding value 
            .attr("id", function (d) { return d; });  

        $("#SourceName").css({"display":"None"});
        // data = data.filter(function (d) { return d.GPS == "E582815"; })

        // Calling functions to draw charts
        createBubbleChart(data);
        createHistogram(data);
        createConnectedScatter(data);
        createHeatmap(data);



        // Listen to the slider
        d3.select("#selectOrigin").on("change", function (d) {
            selectedOrigin = this.value;

            filter(selectedOrigin);
        });

        function filter(selectedOrigin) {
            //data = data;
            if (selectedOrigin == "allOrigin") {
                new_data = data;
            }
            else new_data = data.filter(function (d) { return d.SourceName == selectedOrigin; })


            //console.log(data);
            //console.log(new_data);

            // Calling functions to draw charts
            createBubbleChart(data, new_data);
            createHistogram(data, new_data);
            createConnectedScatter(data, new_data);
            createHeatmap(data, new_data);


        }





    });

  

})