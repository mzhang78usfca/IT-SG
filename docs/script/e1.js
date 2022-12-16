function e1(){

    //Apply margin to svg
    //Studied from Bhumika Srinivas' Starbucks Website example.
    const svg_name = "#e1"
    const outerHeight = 700;
    let svg = d3.select(svg_name)
        .append("svg")
        .attr("width", "100%")
        .attr("height", outerHeight);
    let outerWidth = parseInt(svg.style("width"), 10);
    const margin = {l: 150, r:150, t:120, b:80}
    const innerWidth = outerWidth - margin.l - margin.r;
    const innerHeight = outerHeight - margin.t - margin.b;
    //Background
    svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "#E6E6FA");
    //title
    svg.append("text")
        .attr("x", outerWidth / 2)
        .attr("y", 50)
        .attr('text-anchor', 'middle')
        .attr('font-size', "25px")
        .attr('font-weight', 600)
        .text("IT Companies Moved to Singapore");
    svg.append("text")
        .attr("x", outerWidth / 2)
        .attr("y", 50)
        .attr("dy", "1em")
        .attr('text-anchor', 'middle')
        .attr('font-size', "25px")
        .text("(Click to navigate to related news)");




    function main(svg) {

        let graph = svg.append("g")
            .attr('class', 'graph')
            .attr("transform", `translate(${margin.l}, ${margin.t})`);

        //Variables, minus margin to prevent out of bound bars
        //studied from: https://github.com/markumreed/data_science_for_everyone/blob/main/d3_project/bar_chart_csv/example.js
        const width = innerWidth;
        const height = innerHeight;


        //Config
        //const margin = {l: 120, r:300, t:80, b:80}
        const url = "file/company.csv"
        const numberFormat = ","
        let numberFormatFunc = d3.format(numberFormat)
        const timeFormat = d3.utcFormat("%Y/%m/%d")
        const displayTimeFormat = d3.utcFormat("%b %d, %Y")
        const bubbleMax = 40;
        const legendLoc = [width+60, 150];



        //Scale building/mapping and axis drawing studied from: https://github.com/markumreed/data_science_for_everyone/blob/main/d3_project/bar_chart_csv/example.js
        let scaleX = d3.scaleTime().range([0, width]);
        let scaleY = d3.scaleLinear().range([height, 0]);
        let scaleV = d3.scaleLinear().range([0, bubbleMax]);
        let axisX = d3.axisBottom(scaleX);
        let axisY = d3.axisLeft(scaleY).tickFormat(numberFormatFunc);


        d3.csv(url).then( function(data) {

            //parse date
            let parse = d3.timeParse(timeFormat);
            data.forEach(function(d) {
                d["Date"] = parse(d["Move in Date"]);
                d["Revenue"] = parseFloat(d["2020 Revenue / Million"]);
            })

            //Map domain
            //X
            let minX = d3.min(data, function(d) {return d["Date"]});
            let maxX = d3.max(data, function(d) {return d["Date"]});
            scaleX.domain([minX, maxX]).nice();

            //Y
            let minY = d3.min(data, function(d) {return d['Revenue']});
            let maxY = d3.max(data, function(d) {return d['Revenue']});
            scaleY.domain([minY, maxY]).nice();

            //V
            let minV = 0;
            let maxV = d3.max(data, function(d) {return parseFloat(d['Size'])});
            scaleV.domain([minV, maxV]).nice();

            //Legend
            let legend = d3.legendSize()
                .scale(scaleV)
                .shape('circle')
                .shapePadding(15)
                .labelOffset(20)
                .orient('vertical')
                .cellFilter(function(d){ return d.label !== '0.0'})
                .title("Company Size / Employee")
                .titleWidth(200);

            let lg = svg.append('g')
                .attr("class", "bubbleLegend")
                .attr("transform", `translate(${legendLoc[0]},${legendLoc[1]})`)
                .call(legend);

            graph.append("g")
                .attr("transform", `translate(0,${height})`)
                .attr('class', 'axis')
                .call(axisX)
                .append("text")
                .attr("x", width/2)
                .attr("y", 60)
                .attr('stroke', 'none')
                .attr('fill', 'black')
                .attr('text-anchor', 'middle')
                .text("Time");

            graph.append("g")
                .attr('class', 'axis')
                .call(axisY)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -25-scaleX(minX))
                .attr("x", -height/2)
                .attr('text-anchor', 'middle')
                .attr('stroke', 'none')
                .attr('fill', 'black')
                .text('Company Revenue in 2020 / Million USD');


            let bubbles = graph.selectAll("circle")
                .data(data)
                .enter();

            bubbles.append("circle")
                .attr("class", "bubble")
                .attr("cx", function(d) {return scaleX(d['Date'])})
                .attr("cy", function(d) {return scaleY(d['Revenue'])})
                .attr("r", function(d) {return scaleV(parseFloat(d['Size']))})
                .attr("date", function(d) {return displayTimeFormat(d['Date'])})
                .attr("size", function(d) {return parseFloat(d['Size'])})
                .attr("revenue", function(d) {return numberFormatFunc(d['Revenue'])})
                .attr("company", function(d) {return d['Company']})
                .attr("url", function(d) {return d['Link']})
                .attr("opacity", "0.5")
                .attr('stroke-width', 1)
                .attr('stroke', 'black')
                .attr("fill", "steelblue")
                .on("click", click)
                .on("mouseover", mouseOver)
                .on("mouseout", mouseOut);


            bubbles.append("text")
                .attr("x", function(d) {return scaleX(d['Date'])})
                .attr("y", function(d) {
                    return (scaleY(d['Revenue']) - scaleV(parseFloat(d['Size']) + 100))
                })
                .attr('text-anchor', 'middle')
                .text(function(d) {return d['Company']})



            //Generate info box
            const tooltipConfig = {
                x: width * 0.1,
                y: height * 0.2,
                width: 240,
                height: 120,
                textOffset: [15, 25]
            }

            let focus = graph.append("g")
                .attr("class", "focus")
                .attr("transform", `translate(${tooltipConfig.x}, ${tooltipConfig.y})`)
                .style("display", "none");
            focus.append("rect")
                .attr("class", "tooltip")
                .attr("stroke", "black")
                .attr("fill", "white")
                .attr("width", tooltipConfig.width)
                .attr("height", tooltipConfig.height)
                .attr("rx", 4)
                .attr("ry", 4);
            let textArea = focus.append("g")
                .attr("transform", `translate(${tooltipConfig.textOffset[0]}, ${tooltipConfig.textOffset[1]})`);
            textArea.append("text")
                .attr("class", "tooltip-1")
                .attr('font-weight', 600)
                .attr("dy", "0em")
                .text("");
            textArea.append("text")
                .attr("class", "tooltip-2")
                .attr("dy", "1.5em")
                .text("");
            textArea.append("text")
                .attr("class", "tooltip-3")
                .attr("dy", "3em")
                .text("");
            textArea.append("text")
                .attr("class", "tooltip-4")
                .attr("dy", "4.5em")
                .text("");


            function click() {
                let target = d3.select(this);
                let url = target.attr("url");
                //Open new window:
                //https://stackoverflow.com/questions/37722130/d3-js-opening-a-new-tab-by-dbclick-event
                window.open(
                    url,
                    '_blank'
                );
            }

            function mouseOver(){
                let target = d3.select(this);
                //Change cursor:
                //https://stackoverflow.com/questions/36326683/d3-js-how-can-i-set-the-cursor-to-hand-when-mouseover-these-elements-on-svg-co
                target.attr('stroke-width', 2.5)
                    .style("cursor", "pointer");
                focus.select(".tooltip-1")
                    .text(target.attr("company"));
                focus.select(".tooltip-2")
                    .text("Time: " + target.attr("date"));
                focus.select(".tooltip-3")
                    .text("Revenue: "+ target.attr("revenue") +" Million USD");
                focus.select(".tooltip-4")
                    .text("Office Size: " + target.attr("size") + " people");
                focus.style("display", null)
            }

            function mouseOut() {
                let target = d3.select(this);
                target.attr('stroke-width', 1)
                    .style("cursor", "default");
                focus.style("display", "none")
            }


        })
    }



    main(svg);

}

e1();
