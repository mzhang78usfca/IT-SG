function e1() {
    //Apply margin to svg
//Studied from Bhumika Srinivas' Starbucks Website example.
    const margin = {l: 80, r:100, t:80, b:30}
    const overall_width = 750
    const overall_height = 500
    const svg_name = "#e1"
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
        const url = "company.csv"
        const timeFormat = d3.utcFormat("%Y/%m/%d")
        const bubbleMax = 40;

        //Variables, minus margin to prevent out of bound bars
        //studied from: https://github.com/markumreed/data_science_for_everyone/blob/main/d3_project/bar_chart_csv/example.js
        const width = overall_width;
        const height = overall_height;
        const legendLoc = [width - 130, -50];



        //Scale building/mapping and axis drawing studied from: https://github.com/markumreed/data_science_for_everyone/blob/main/d3_project/bar_chart_csv/example.js
        let scaleX = d3.scaleTime().range([0, width]);
        let scaleY = d3.scaleLinear().range([height, 0]);
        let scaleV = d3.scaleLinear().range([0, bubbleMax]);
        let axisX = d3.axisBottom(scaleX);
        let axisY = d3.axisLeft(scaleY);


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
                .title("Company Size / Employee");

            let lg = svg.append('g')
                .attr("transform", `translate(${legendLoc[0]},${legendLoc[1]})`)
                .call(legend)
                .attr("fill", "darkgreen");





            //paint title
            graph.append("text")
                .attr("x", width / 2)
                .attr("y", -50)
                .attr('text-anchor', 'middle')
                .attr('stroke', 'black')
                .attr('font-weight', 600)
                .text("IT Companies Moved to Singapore");


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
                .text('Company Revenue in 2020');


            let bubbles = graph.selectAll("circle")
                .data(data)
                .enter();

            bubbles.append("circle")
                .attr("class", "bubble")
                .attr("cx", function(d) {return scaleX(d['Date'])})
                .attr("cy", function(d) {return scaleY(d['Revenue'])})
                .attr("r", function(d) {return scaleV(parseFloat(d['Size']))})
                .attr('stroke', 'black')
                .attr("fill", "steelblue");


            bubbles.append("text")
                .attr("x", function(d) {return scaleX(d['Date'])})
                .attr("y", function(d) {
                    return (scaleY(d['Revenue']) - scaleV(parseFloat(d['Size']) + 100))
                })
                .attr('text-anchor', 'middle')
                .text(function(d) {return d['Company']})


        })
    }

    main(svg);

}

e1();
