function b1() {
    //Apply margin to svg
//Studied from Bhumika Srinivas' Starbucks Website example.
    const margin = {l: 80, r:50, t:80, b:65}
    const overall_width = 750
    const overall_height = 500
    const svg_name = "#b1"
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
        //Variables, minus margin to prevent out of bound bars
        //studied from: https://github.com/markumreed/data_science_for_everyone/blob/main/d3_project/bar_chart_csv/example.js
        const width = overall_width;
        const height = overall_height;
        const legendLocation = [width - 130, 0];
        const legend2Location = [width - 130, 160];

        //Config
        const url = "covid2.csv"
        //const timeFormat = d3.utcFormat("%Y/%m/%d")


        //const country/region info
        const continents = ["Asia", "Europe", "North America"];
        const colors = [
            "rgb(189,32,43)",
            "rgb(255,204,0)",
            "rgb(10,49,97)"
        ];
        const classKeys = [];
        for(let i = 0; i < continents.length; i++){
            classKeys.push("c"+i.toString());
        }
        let continent2Class = d3.scaleOrdinal().domain(continents).range(classKeys);

        //Const Data Key info
        const keys = ["Cases per Million","Deaths per Million","People Vaccined per Hundred","People Fully Vaccined per Hundred"]


        //Build scale for continents
        let scaleContinentColor = d3.scaleOrdinal().domain(continents).range(colors);
        //Scale building/mapping and axis drawing studied from: https://github.com/markumreed/data_science_for_everyone/blob/main/d3_project/bar_chart_csv/example.js
        let scaleX = d3.scaleBand().range([0, width]).padding(0.5);
        scaleX.domain(keys);

        let scaleYs = {}
        let axisYs = {}
        for(let i = 0; i < keys.length; i++){
            scaleYs[i] = d3.scaleLinear().range([height, 0]);
            axisYs[i] = d3.axisLeft(scaleYs[i]);
        }




        d3.csv(url).then( function(data) {

            for(let i = 0; i < keys.length; i++){
                let key = keys[i];
                let minY = 0;

                let maxY = d3.max(
                    data, function(d) {return parseFloat(d[key])}
                );
                scaleYs[i].domain([minY, maxY]).nice();
            }



            //title
            graph.append("text")
                .attr("x", width / 2)
                .attr("y", -40)
                .attr('text-anchor', 'middle')
                .attr('stroke', 'none')
                .attr('fill', 'black')
                .attr('font-weight', 600)
                .text("Covid Data in Different Countries @ 09-01-2022");

            let yAxis = graph.append("g")

            for(let i = 0; i < keys.length; i++){
                yAxis.append("g")
                    .attr("transform", `translate(${scaleX(keys[i])},0)`)
                    .attr('class', 'axis')
                    .call(axisYs[i])
                    .attr('stroke', 'black')
                    .append("text")
                    .attr("y", height+25)
                    .attr("x", 0)
                    .attr("dy", () => {
                        if(i%2===0){
                            return "0em"
                        }
                        else{
                            return "1.5em"
                        }
                    })
                    .attr('text-anchor', 'middle')
                    .attr('stroke', 'none')
                    .attr('fill', 'black')
                    .text(keys[i]);
            }


            let countries = [];
            let countryColors = [];
            let countryIds = [];
            let count = 0;

            data.forEach(function(d) {
                let country = d["Country"];
                let continent = d["Continent"];

                let color = scaleContinentColor(d["Continent"]);
                if(country === "Singapore"){
                    color = "rgb(0,132,61)"
                }

                countries.push(country);
                countryColors.push(color);
                let path = d3.path();
                for(let i = 0; i < keys.length; i++){
                    let x = scaleX(keys[i]);
                    let y = scaleYs[i](d[keys[i]]);
                    if(i===0){
                        path.moveTo(x, y);
                    } else {
                        path.lineTo(x, y);
                    }
                }
                graph.append("path")
                    .attr("d", path)
                    .attr("id", function (){
                        let id = "i"+count.toString();
                        countryIds.push(id);
                        count++;
                        return id;
                    })
                    .attr("class", continent2Class(continent))
                    .attr("classHidden", false)
                    .attr("idHidden", false)
                    .attr("stroke", color)
                    .attr("stroke-width", 3)
                    .style("opacity", 0.5)
                    .attr("fill", "none");
            })

            //Build id scale
            let country2id = d3.scaleOrdinal().domain(countries).range(countryIds);

            //Build legend
            let scaleCountryColor = d3.scaleOrdinal().domain(countries).range(countryColors);
            //color
            let legend1 = d3.legendColor()
                .title("Continent")
                .shape("path", d3.symbol().type(d3.symbolsStroke).size(150))
                .shapePadding(10)
                .scale(scaleContinentColor)
                .on('cellclick', function (d){
                    clickClassCell(d, d3.select(this), graph, continent2Class);
                });

            let legend2 = d3.legendColor()
                .title("Country")
                .shape("path", d3.symbol().type(d3.symbolsStroke).size(150))
                .shapePadding(10)
                .scale(scaleCountryColor)
                .on('cellclick', function (d){
                    clickIdCell(d, d3.select(this), graph, country2id);
                });

            graph.append("g")
                .attr("transform", `translate(${legendLocation[0]}, ${legendLocation[1]})`)
                .call(legend1);
            graph.append("g")
                .attr("transform", `translate(${legend2Location[0]}, ${legend2Location[1]})`)
                .call(legend2);
        })
    }

    function hideById(e){
        e.setAttribute('idHidden', true);
        e.setAttribute('visibility', "hidden");
    }

    function hideByClass(e){
        e.setAttribute('classHidden', true);
        e.setAttribute('visibility', "hidden");
    }

    function showById(e){
        e.setAttribute('idHidden', false);
        if(e.getAttribute('classHidden')==="false"){
            e.setAttribute('visibility', "visible");
        }
    }

    function showByClass(e){
        e.setAttribute('classHidden', false);
        if(e.getAttribute('idHidden')==="false"){
            e.setAttribute('visibility', "visible");
        }
    }

    function clickIdCell(elem, cell, graph, scaleId){
        let text = elem.target.textContent;
        let id = scaleId(text);
        let hidden;


        if(cell.attr("clicked") === "true"){
            cell.attr("clicked", "false")
            cell.attr("text-decoration", "");
            hidden = false;
        }
        else{
            cell.attr("clicked", "true")
            cell.attr("text-decoration", "line-through");
            hidden = true;
        }

        graph.selectAll(`#${id}`)
            .each(function() {
                if(hidden){
                    hideById(this);
                }
                else{
                    showById(this);
                }

            })
    }

    function clickClassCell(elem, cell, graph, scaleClass){
        let text = elem.target.textContent;
        let className = scaleClass(text);
        let hidden;


        if(cell.attr("clicked") === "true"){
            cell.attr("clicked", "false")
            cell.attr("text-decoration", "");
            hidden = false;
        }
        else{
            cell.attr("clicked", "true")
            cell.attr("text-decoration", "line-through");
            hidden = true;
        }

        graph.selectAll(`.${className}`)
            .each(function() {
                if(hidden){
                    hideByClass(this);
                }
                else{
                    showByClass(this);
                }

            })
    }


    main(svg);

}
b1();
