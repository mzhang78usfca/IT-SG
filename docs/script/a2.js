//Apply margin to svg
//Studied from Bhumika Srinivas' Starbucks Website example.
const margin = {l: 80, r:50, t:30, b:30}
const overall_width = 800
const overall_height = 500
const svg_name = "#a2"
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


    //Variables, minus margin to prevent out of bound bars
    //studied from: https://github.com/markumreed/data_science_for_everyone/blob/main/d3_project/bar_chart_csv/example.js
    const width = overall_width;
    const height = overall_height;
    const legendLocation = [width - 130, 50];

    //Config
    const url = "covid1.csv"
    const timeFormat = d3.utcFormat("%Y/%m/%d")

    //Const start-end date
    const startDate = "2022/1/1";
    const endDate = "2022/11/1";
    const dataKeyWord = "avg_cases_per_mili";

    //const country/region info
    const names = ["Australia", "Europe", "Singapore", "United States"];
    const colors = [
        "rgb(0,132,61)",
        "rgb(255,204,0)",
        "rgb(189,32,43)",
        "rgb(10,49,97)",
    ];

    //Map id
    const ids = [];
    for(let i = 0; i < names.length; i++){
        ids.push("i"+i.toString());
    }
    let scaleId = d3.scaleOrdinal().domain(names).range(ids);




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
            d["date"] = parse(d["date"]);
        })


        //Map domain
        //X
        let minX = parse(startDate);
        let maxX = parse(endDate);
        scaleX.domain([minX, maxX]).nice();
        axisX.ticks(d3.timeMonth.every(1));

        //Y
        let minY = d3.min(
            data.filter(function(d) {
                return (d.date >= minX);
            }),
            function(d) {return parseFloat(d[dataKeyWord])});
        let maxY = d3.max(
            data.filter(function(d) {
                return (d.date >= minX);
            }),
            function(d) {return parseFloat(d[dataKeyWord])});
        scaleY.domain([minY, maxY]).nice();

        //color
        let legend = d3.legendColor()
            .shape("path", d3.symbol().type(d3.symbolsStroke).size(150))
            .shapePadding(10)
            .scale(scaleColor)
            .on('cellclick', function (d){
                clickCell(d, d3.select(this), graph, scaleId);
            });


//title
        graph.append("text")
            .attr("x", width / 2)
            .attr("y", 10)
            .attr('text-anchor', 'middle')
            .attr('stroke', 'black')
            .attr('font-weight', 600)
            .text("Confirmed Covid-19 Confirmed cases (7-days rolling average) in different countries");
        graph.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(axisX)
            .append("text")
            .attr("x", width/2)
            .attr("y", 40)
            .attr('stroke', 'black')
            .attr('text-anchor', 'middle')
            .text("Time");
        graph.append("g")
            .attr("transform", `translate(${scaleX(minX)},0)`)
            .call(axisY)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -50-scaleX(minX))
            .attr("x", -height/2)
            .attr('text-anchor', 'middle')
            .attr('stroke', 'black')
            .text('Confirmed cases per million population');

        //legend
        let legendGraph = graph.append("g")
            .attr("transform", `translate(${legendLocation[0]}, ${legendLocation[1]})`)
            .call(legend);

        for(let i = 0; i < names.length; i++){
            let name = names[i];
            let color = colors[i];
            graph.append("path")
                .datum(
                    data.filter(function(d) {
                        return (d.location === name && d.date >= minX);
                    })
                )
                .attr("class", scaleId(name))
                .attr("fill", "none")
                .attr("stroke-width", 2)
                .attr("stroke", color)
                .attr("d", d3.line()
                    .x(function(d) {
                        return scaleX(d['date'])})
                    .y(function(d) {return scaleY(parseFloat(d[dataKeyWord]))}));
        }







    })
}

function clickCell(elem, cell, graph, scaleId) {
    let text = elem.target.textContent;
    let id = scaleId(text);
    let hidden;


    if(cell.attr("clicked") === "false"){
        cell.attr("clicked", "true")
        cell.attr("text-decoration", "line-through");
        hidden = true;
    }
    else{
        cell.attr("clicked", "false")
        cell.attr("text-decoration", "");
        hidden = false;
    }

    graph.selectAll(`.${id}`)
        .each(function() {
            if(hidden){
                this.setAttribute('visibility', "hidden");
            }
            else{
                this.setAttribute('visibility', "visible");
            }

        })
}

main(svg);
