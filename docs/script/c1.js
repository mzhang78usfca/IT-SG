function c1() {
    //Apply margin to svg
//Studied from Bhumika Srinivas' Starbucks Website example.
    const margin = {l: 120, r:120, t:80, b:80}
    const overall_width = 640
    const overall_height = 500
    const numberFormat = ".4s"
    const numberFormatFunc = d3.format(numberFormat)
    const svg_name = "#c1"
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


        //background
        let graph = svg.append("g").attr('class', 'graph');


        //Config
        const url = "labor.csv";

        //Variables, minus margin to prevent out of bound bars
        //studied from: https://github.com/markumreed/data_science_for_everyone/blob/main/d3_project/bar_chart_csv/example.js
        const width = overall_width;
        const height = overall_height;
        const legendLocation = [width - 20, 230];

        const keys = ["S Pass","Work Permit"];
        const colors = [
            "rgb(88,151,210)",
            "rgb(210,183,52)"
        ];
        let colorScale = d3.scaleOrdinal().domain(keys).range(colors);

        let scaleX = d3.scaleBand().range([0, width]).padding(0.25);
        let scaleY = d3.scaleLinear().range([0, height]);
        let realScaleY = d3.scaleLinear().range([height, 0]);
        let axisX = d3.axisBottom(scaleX);
        let axisY = d3.axisLeft(realScaleY).tickFormat(d3.format(numberFormat));

        d3.csv(url).then( function(data) {

            //Map domain
            scaleX.domain(data.map(function(d) {return d['Year']}));
            let max = d3.max(data, function(d) {
                let sum = 0;
                for(let i = 0; i < keys.length; i++){
                    sum += parseInt(d[keys[i]]);
                }
                return sum;
            }) + 100000;
            scaleY.domain([0, max]).nice();
            realScaleY.domain([0, max]).nice();

            graph.append("text")
                .attr("x", width / 2)
                .attr("y", -50)
                .attr('text-anchor', 'middle')
                .attr('font-weight', 600)
                .attr('stroke', 'none')
                .attr('fill', 'black')
                .text("Work Permit and Special Work Pass (IT related)");

            graph.append("text")
                .attr("x", width / 2)
                .attr("y", -50)
                .attr("dy", "1.5em")
                .attr('text-anchor', 'middle')
                .attr('font-weight', 600)
                .attr('stroke', 'none')
                .attr('fill', 'black')
                .text("issued by Singapore");


            graph.append("g")
                .attr("transform", `translate(0,${height})`)
                .attr('class', 'axis')
                .call(axisX)
                .attr('stroke', 'black')
                .append("text")
                .attr("x", width/2)
                .attr("y", 50)
                .attr('stroke', 'none')
                .attr('fill', 'black')
                .attr('text-anchor', 'middle')
                .text("Fiscal Year");

            graph.append("g")
                .attr('class', 'axis')
                .call(axisY)
                .attr('stroke', 'black')
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -90)
                .attr("x", -height/2)
                .attr('text-anchor', 'middle')
                .attr('stroke', 'none')
                .attr('fill', 'black')
                .text('Work Visa granted');


            //Legend format copied from
            //https://d3-legend.susielu.com/
            let legendFunc = d3.legendColor()
                .shape("circle")
                .shapePadding(10)
                .title("Visa Type")
                .scale(colorScale);
            svg.append("g")
                .attr("transform", `translate(${legendLocation[0]}, ${legendLocation[1]})`)
                .attr("class", "legend")
                .attr('stroke', 'none')
                .call(legendFunc);

            //Bar drawing studied from: https://learning.oreilly.com/library/view/interactive-data-visualization/9781491921296/ch06.html#idm140093202999712
            let bars1 = graph.selectAll("rect2")
                .data(data)
                .enter();

            bars1.append("rect")
                .attr("class", "bar")
                .attr("x", function(d) {return scaleX(d['Year'])})
                .attr("y", function(d) {
                    let v = parseInt(d[keys[0]]);
                    return height - scaleY(v)
                })
                .attr("width", scaleX.bandwidth() / 2)
                .attr("height", function(d) {
                    let v = parseInt(d[keys[0]]);
                    return scaleY(v);
                })
                .attr('fill', function() {
                    //calculate color using sequential hue in d3
                    return colorScale(colorScale(keys[0]));
                })
                .attr("stroke", "black");
            bars1.append("text")
                .attr("class", "bar-label")
                .attr("x", function(d) {return scaleX(d['Year']) + scaleX.bandwidth() / 4})
                .attr("y", function(d) {
                    let v = parseInt(d[keys[0]]);
                    return height - scaleY(v) - 15
                })
                .attr('text-anchor', 'middle')
                .style("font-size", "12px")
                .text(function(d) {
                    let num = d[keys[0]];
                    return numberFormatFunc(num)
                })

            let bars2 = graph.selectAll("rect2")
                .data(data)
                .enter();
            bars2.append("rect")
                .attr("class", "bar")
                .attr("x", function(d) {return scaleX(d['Year']) + scaleX.bandwidth() / 2})
                .attr("y", function(d) {
                    let v = parseInt(d[keys[1]]);
                    return height - scaleY(v)
                })
                .attr("width", scaleX.bandwidth() / 2)
                .attr("height", function(d) {
                    let v = parseInt(d[keys[1]]);
                    return scaleY(v);
                })
                .attr('fill', function() {
                    //calculate color using sequential hue in d3
                    return colorScale(colorScale(keys[1]));
                })
                .attr("stroke", "black");
            bars2.append("text")
                .attr("class", "bar-label")
                .attr("x", function(d) {return scaleX(d['Year']) + scaleX.bandwidth() / 4 * 3})
                .attr("y", function(d) {
                    let v = parseInt(d[keys[1]]);
                    return height - scaleY(v) - 15
                })
                .attr('text-anchor', 'middle')
                .style("font-size", "12px")
                .text(function(d) {
                    let num = d[keys[1]];
                    return numberFormatFunc(num);
                })


        })
    }

    main(svg);

}

c1();
