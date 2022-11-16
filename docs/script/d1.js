function d1() {
    //Apply margin to svg
//Studied from Bhumika Srinivas' Starbucks Website example.
    const margin = {l: 80, r:50, t:80, b:30}
    const overall_width = 800
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
        const legendLocation = [width - 200, 230];

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
                .shape("path", d3.symbol().type(d3.symbolsStroke).size(150))
                .shapePadding(10)
                .scale(scaleColor)


            //title
            graph.append("text")
                .attr("x", width / 2)
                .attr("y", -10)
                .attr('text-anchor', 'middle')
                .attr('stroke', 'black')
                .attr('font-weight', 600)
                .text("Singapore GDP and IT revenue changes during COVID pandemic");
            graph.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(axisX)
                .attr('stroke', 'black')
                .append("text")
                .attr("x", width/2)
                .attr("y", 40)
                .attr('stroke', 'black')
                .attr('text-anchor', 'middle')
                .text("Time");
            graph.append("g")
                .attr("transform", `translate(${scaleX(minX)},0)`)
                .call(axisY)
                .attr('stroke', 'black')
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -50-scaleX(minX))
                .attr("x", -height/2)
                .attr('text-anchor', 'middle')
                .attr('stroke', 'black')
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



        })
    }

    main(svg);

}
d1();
