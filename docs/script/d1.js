function d1() {
    //Apply margin to svg
//Studied from Bhumika Srinivas' Starbucks Website example.
    const margin = {l: 120, r:100, t:150, b:80}
    const overall_width = 660
    const overall_height = 500
    const svg_name = "#d1"
    let outerSvg = d3.select(svg_name)
        .append("svg")
        .attr("width", overall_width + margin.l + margin.r)
        .attr("height", overall_height + margin.t + margin.b);
//Background
    outerSvg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "#E6E6FA");
    let svg = outerSvg.append("g")
        .attr("transform", `translate(${margin.l}, ${margin.t})`);

    function main(svg) {

        let graph = svg.append("g").attr('class', 'graph');


        //Config
        const url = "revenue.csv"
        const timeFormat = d3.utcFormat("%Y")

        //const country/region info
        const names = ["GDP", "Info Comm Industry Revenue"];
        const keys = ["gdp", "revenue"]
        const colors = [
            "rgb(32,124,72)",
            "rgb(30,142,168)",
        ];

        //Variables, minus margin to prevent out of bound bars
        //studied from: https://github.com/markumreed/data_science_for_everyone/blob/main/d3_project/bar_chart_csv/example.js
        const width = overall_width;
        const height = overall_height;
        const legendLocation = [width/2-100, -80];

        //Scale building/mapping and axis drawing studied from: https://github.com/markumreed/data_science_for_everyone/blob/main/d3_project/bar_chart_csv/example.js
        let scaleX = d3.scaleTime().range([0, width]);
        let scaleY = d3.scaleLinear().range([height, 0]);
        let axisX = d3.axisBottom(scaleX);
        let axisY = d3.axisLeft(scaleY);
        let scaleColor = d3.scaleOrdinal().domain(names).range(colors);



        d3.csv(url).then( function(data) {

            //parse date
            let parse = d3.timeParse(timeFormat);
            data.forEach(function(d) {
                d["date"] = parse(d["year"]);
            })


            //Map domain
            //X
            let minX = d3.min(data, function(d) {return d["date"]});
            let maxX = d3.max(data, function(d) {return d["date"]});
            scaleX.domain([minX, maxX]).nice();
            axisX.ticks(d3.timeYear.every(1));

            //Y
            let minY = d3.min((data), function(d) {return Math.min(
                parseFloat(d[keys[0]]),
                parseFloat(d[keys[1]]),
            )});
            let maxY = d3.max((data), function(d) {return Math.max(
                parseFloat(d[keys[0]]),
                parseFloat(d[keys[1]]),
            )});
            scaleY.domain([minY, maxY]).nice();

            //color
            let legend = d3.legendColor()
                .orient("horizontal")
                .shape("path", d3.symbol().type(d3.symbolsStroke).size(150))
                .shapePadding(200)
                .scale(scaleColor)


            //title
            graph.append("text")
                .attr("x", width / 2)
                .attr("y", -110)
                .attr('text-anchor', 'middle')
                .attr('stroke', 'black')
                .attr('font-weight', 600)
                .text("Singapore GDP and IT revenue changes during COVID pandemic");
            graph.append("g")
                .attr("transform", `translate(0,${height})`)
                .attr('class', 'axis')
                .call(axisX)
                .attr('stroke', 'black')
                .append("text")
                .attr("x", width/2)
                .attr("y", 60)
                .attr('stroke', 'none')
                .attr('fill', 'black')
                .attr('text-anchor', 'middle')
                .text("Time");
            graph.append("g")
                .attr("transform", `translate(${scaleX(minX)},0)`)
                .attr('class', 'axis')
                .call(axisY)
                .attr('stroke', 'black')
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -70-scaleX(minX))
                .attr("x", -height/2)
                .attr('text-anchor', 'middle')
                .attr('stroke', 'none')
                .attr('fill', 'black')
                .text('Income / $ Billion');

            //legend
            graph.append("g")
                .attr("transform", `translate(${legendLocation[0]}, ${legendLocation[1]})`)
                .call(legend);

            for(let i = 0; i < names.length; i++){
                let key = keys[i];
                let color = colors[i];
                graph.append("path")
                    .datum(data)
                    .attr("fill", "none")
                    .attr("stroke-width", 2)
                    .attr("stroke", color)
                    .attr("d", d3.line()
                        .x(function(d) {
                            return scaleX(d['date'])})
                        .y(function(d) {return scaleY(parseFloat(d[key]))}));
            }

            const tooltipConfig = {
                width: 120,
                height: 50,
                x: 10,
                y: -22
            }
            const formatX = d3.timeFormat("%Y")
            const formatY = d3.format("s")
            //Build tooltip
            //v3: https://bl.ocks.org/Qizly/8f6ba236b79d9bb03a80
            //v7: https://bl.ocks.org/d3noob/755172c605313b94e5c72bc66066a87e
            let focus = graph.append("g")
                .attr("class", "focus")
                .style("display", "none");

            focus.append("circle")
                .attr("r", 5)
                .attr("stroke", "black")
                .attr("fill", scaleColor(names[0]));

            focus.append("rect")
                .attr("class", "tooltip")
                .attr("stroke", "black")
                .attr("fill", "white")

                .attr("width", tooltipConfig.width)
                .attr("height", tooltipConfig.height)
                .attr("x", tooltipConfig.x)
                .attr("y", tooltipConfig.y)
                .attr("rx", 4)
                .attr("ry", 4);
            focus.append("text")
                .attr("class", "tooltip-x")
                .attr("x", 18)
                .attr("y", -2);
            focus.append("text")
                .attr("x", 18)
                .attr("y", 18)
                .text(names[0]+":");
            focus.append("text")
                .attr("class", "tooltip-y")
                .attr("x", 60)
                .attr("y", 18)

            let focus2 = graph.append("g")
                .attr("class", "focus2")
                .style("display", "none");

            focus2.append("circle")
                .attr("r", 5)
                .attr("stroke", "black")
                .attr("fill", scaleColor(names[1]));
            focus2.append("rect")
                .attr("class", "tooltip")
                .attr("stroke", "black")
                .attr("fill", "white")

                .attr("width", tooltipConfig.width)
                .attr("height", tooltipConfig.height)
                .attr("x", tooltipConfig.x)
                .attr("y", tooltipConfig.y)
                .attr("rx", 4)
                .attr("ry", 4);
            focus2.append("text")
                .attr("class", "tooltip-x")
                .attr("x", 18)
                .attr("y", -2);
            focus2.append("text")
                .attr("x", 18)
                .attr("y", 18)
                .text(names[1]+":");
            focus2.append("text")
                .attr("class", "tooltip-y")
                .attr("x", 60)
                .attr("y", 18)

            graph.append("rect")
                .attr("class", "overlay")
                .attr("width", width)
                .attr("height", height)
                .on("mouseover", function() {
                    focus.style("display", null);
                    focus2.style("display", null);
                })
                .on("mouseout", function() {
                    focus.style("display", "none");
                    focus2.style("display", "none");
                })
                .on("mousemove", mousemove);

            let bisectDate = d3.bisector(function(d) {return d['date']}).left;

            function mousemove() {
                console.log(d3.pointer(event, this)[0])
                let x0 = scaleX.invert(d3.pointer(event, this)[0]),
                    i = bisectDate(data, x0, 1),
                    d0 = data[i - 1],
                    d1 = data[i],
                    d = x0 - d0['date']> d1['date'] - x0 ? d1 : d0;
                focus.attr("transform", "translate(" + scaleX(d['date']) + "," + scaleY(d[keys[0]]) + ")");
                focus.select(".tooltip-x").text(formatX(d['date']));
                focus.select(".tooltip-y").text(formatY(d[keys[0]]));

                focus2.attr("transform", "translate(" + scaleX(d['date']) + "," + scaleY(d[keys[1]]) + ")");
                focus2.select(".tooltip-x").text(formatX(d['date']));
                focus2.select(".tooltip-y").text(formatY(d[keys[1]]));
            }



        })
    }

    main(svg);

}
d1();
