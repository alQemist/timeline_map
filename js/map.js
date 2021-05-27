const colors = ["rgb(71,73,220)", "rgb(197,8,158)", "rgb(66,127,144)", "rgb(58,66,125)", "rgb(179,86,145)", "rgb(97,8,232)", "rgb(22,137,74)", "rgb(111,125,67)", "rgb(104,61,13)", "rgb(231,37,37)"]

const setColor = function (i) {
    c = i > colors.length - 1 ? i % (colors.length - 1) : i;
    return colors[c]
}

var is_playing = 0
var dates_list = {}
var vb_dim = [600, 300]
var aspect_ratio = vb_dim[1] / vb_dim[0]
var dates
var intv = 0
var ticker_count
var legend_text
var max_count = 0
var coloring;
var scale = .30
var svg_scale = (window.innerWidth - 350) / vb_dim[0]
var svg_width = window.innerWidth / svg_scale
var svg_height = svg_width * aspect_ratio
const duration = 2000

var svg = d3.selectAll(".map_svg")
    .attr("viewBox", function (d) {
        let vb = "0 0 " + (svg_width) + " " + (svg_height)
        return vb
    })

var tooltip = d3.select(".tooltip")

tooltip.on("mouseleave", function () {
    showTooltip()
})

var togglePlayer = function(){

    is_playing = !is_playing

    if(is_playing){
        clearInterval(coloring)
    }else{
        if(intv >= dates_list.length){
            intv = 0
        }
        coloring = setInterval(colorize, duration)
    }

    d3.selectAll(".play")
        .html(function () {
            let tx = is_playing ? "▶" : "❚❚"
            return tx;
        })
}

var load = function (data) {

    dates = Object.keys(data['datum'])

    max_count = data['max_counts']

    dates_list = data['datum'];

    d3.select(".ticker").html(dates[0])

    var ticker_g = svg.append("g")
    var ticker_date = ticker_g.append("text")
        .classed("ticker-date", true)
        .text(dates[0])
        .attr("x", (svg_width * .84) + "px")
        .attr("y", 18 + "px")

    var tickerBB = ticker_date.node().getBBox()

    var lx = svg_width * .90
    var legend_scale = 120
    var ticker_width = tickerBB.width
    var ticker_height = tickerBB.height

    const legend = svg
        .append("g")
        .classed("legend", true)

    let bristle_x = svg_width * .84
    let bristle_y = tickerBB.y * scale
    let bristle_w = ticker_width / dates.length
    let bristle_h = ticker_height
    let ticker_count_y = bristle_y + bristle_h + 6

    var rowspacing = ((svg_height * .9) - ticker_count_y) / dates.length

    var player = svg.append("g")

    player.append("rect")
        .classed("player", true)
        .attr("width", ticker_height+4)
        .attr("height", ticker_height)
        .attr("x", 0)
        .attr("y", 0)
        .attr("transform", "translate(" + (svg_width * .805) + "," + (bristle_y) + ")")


    player.append("rect")
        .classed("player", true)
        .attr("width", ticker_height)
        .attr("height", ticker_height)
        .attr("x", 0)
        .attr("y", 0)
        .attr("rx", 1)
        .attr("transform", "translate(" + (svg_width * .805) + "," + (bristle_y) + ")")
        .on("click", function () {
            togglePlayer()
        })


    player.append("text")
        .text("❚❚")
        .classed("play", true)
        .attr("x", svg_width * .815 + "px")
        .attr("y", ticker_count_y - 12.5 + "px")


    player.on("click", function () {
        togglePlayer()
    })
    player.on("mouseenter",function(){
        showTooltip("start / stop animation")
    })
    player.on("mouseleave",function(){
        showTooltip()
    })


    ticker_count = ticker_g.append("text")
        .text("Weekly New Cases: 0")
        .classed("ticker-count", true)
        .attr("x", lx + "px")
        .attr("y", ticker_count_y + "px")

    legend_text = svg.append("text")
        .text("Map shading is based on relative counts for the week, darker shade = higher count")
        .classed("legend-text", true)
        .attr("x","40px")
        .attr("y","17px")
        .style("text-anchor","start")

    title_text = svg.append("text")
        .text("Czech Republic COVID-19 Cases Weekly Timeline")
        .classed("title-text", true)
        .attr("x","40px")
        .attr("y","10px")
        .style("text-anchor","start")

    svg.append("text")
        .text("Inspired by map and data at https://onemocneni-aktualne.mzcr.cz/covid-19")
        .classed("legend-text", true)
        .attr("x", svg_width + "px")
        .attr("y", svg_height*.95+"px")
        .style("text-anchor","end")

    var flag = svg.append("rect")
        .attr("x", "10px")
        .attr("y", "0px")
        .attr("width","25px")
        .attr("height","18px")
        .style("fill", 'url(#czech_flag)')

    flag.style("stroke","gray")

    dates.forEach(function (d, i) {

        let y = (rowspacing * i) + ticker_count_y + 2
        let w = Math.max.apply(Math, [legend_scale * (dates_list[d]['counts'] / max_count), 5]) * .8
        w = legend_scale * (dates_list[d]['counts'] / max_count)*.8
        let rextx = lx - w * .5

        ticker_g.append("rect")
            .style("width", function () {
                return bristle_w + "px"
            })
            .style("height", function () {
                let h = bristle_h
                return h + "px"
            })
            .classed("ticker-bristle", true)
            .attr("x", bristle_x + bristle_w * i + "px")
            .attr("y", bristle_y + "px")
            .attr("data-index", i)
            .on("mouseenter", function () {
                showTicker(i)
            })

        legend.append("rect")
            .style("width", function () {
                return w ? w : 0 + "px"
            })
            .style("height", function () {
                let h = rowspacing * .5
                return h + "px"
            })
            .classed("ticker-rect", true)
            .attr("x", rextx + "px")
            .attr("y", y + "px")
            .attr("ry", 0)
            .attr("data-ticker", i)
            .style("opacity", 1)
            //.style("fill", 'url(#vline)')
            .on("mouseenter", function () {
                showTicker(i)
            })

    })

    let obj = d3.select(".map_svg")
    let g = obj.append("g")
        .classed("map-points",true)

    let paths = obj.selectAll("path")
        .each(function (d, i) {
            let obj = d3.select(this)
            let txt = obj.attr("data-name")

            obj.style("fill", function () {
                const c = setColor(0)
                return c
            })
                .style("opacity", .1)

            let bb = obj.node().getBBox()
            let tx = bb.x + bb.width * .48
            let ty = bb.y + bb.height / 2

            let rx = (bb.x + bb.width * .55) + (txt.length * 1.3)
            let ry = (bb.y + bb.height / 2) - 1.5
            let vy = ry + 1
            let kod = obj.attr("class")
            let kod_id = kod.split("okres_segment code_")[1]

            g.append("text")
                .text(txt)
                .classed("okres_label ol_" + kod_id, true)
                .style("text-anchor", "middle")
                .attr("transform", "translate (" + tx + "," + ty + ")")
                .style("opacity", 0)

            g.append("circle")
                .attr("r", 3)
                .classed("badge b_" + kod_id, true)
                .attr("transform", "translate (" + rx + "," + ry + ")")
                .style("opacity", 0)

            g.append("text")
                .text(0)
                .attr("class", "badge-count bc_" + kod_id, true)
                .style("text-anchor", "middle")
                .attr("transform", "translate (" + rx + "," + vy + ")")
                .style("opacity", 0)
        })

    d3.select(".map_svg")
        .transition()
        .delay(100)
        .duration(2000)
        .style("opacity", 1)

    coloring = setInterval(colorize, duration);

}

function showTicker(i) {
    clearInterval(coloring)
    colorize(i)
    intv = i
    is_playing = 0
    togglePlayer()

}

function colorize(t) {

    let child = t ? t : intv;
    let ticker_date = d3.select(".ticker-date")
        .text(dates[child])

    d3.selectAll(".ticker-bristle")
        .style("fill", function (d, i) {
            c = (i == child) ? "RGBa(250,50,50,1)" : "RGBa(50,50,50,.1)"
            return c
        })
    d3.selectAll(".ticker-rect")
        .style("fill", function (d, i) {
            c = (i == child) ? "RGBa(250,50,50,1)": "RGBa(50,50,50,.5)"
            return c
        })
        .style("stroke", function (d, i) {
            c = (i == child) ? "RGBa(250,50,50,1)": "RGBa(50,50,50,.5)"
            return c
        })
        .transition()
        .duration(1000)
        .style("stroke-width",function(d,i){
            w = (i == child) ? "3": ".2"
            return w
        })

    const key = Object.keys(dates_list)[child]
    const item = dates_list[key]

    let obj = d3.select(".map_svg")

    obj.selectAll("path")
        .each(function (d, i) {
            let obj = d3.select(this)
            let txt = obj.attr("class")
            let id = txt.split("okres_segment code_")[1]
            //let o = obj.style("opacity")
            obj.transition()
                .duration(duration * .5)
                .style("opacity", .1)
            obj.transition()
                .duration(duration * .5)
                .style("opacity", function () {
                    const v = item['data'][id] - 0
                    const c = v / item['max']
                    return v ? .1 + c : .1
                })
            let s = ".b_" + id

            let b = d3.select(s)
                .transition()
                .duration(duration * .5)
                .style("opacity", function () {
                    const v = item['data'][id] - 0
                    return v ? 1 : 0
                })

            let ol = d3.select(".ol_" + id)
                .transition()
                .duration(duration * .5)
                .style("opacity", function () {
                    const v = item['data'][id] - 0
                    return v ? 1 : 0
                })


            let bc = d3.select(".bc_" + id)
                .transition()
                .duration(duration * .5)
                .style("opacity", function () {
                    const v = item['data'][id] - 0
                    return v ? 1 : 0
                })
                .text(function () {
                    let c = item['data'][id]
                    return c
                })
            ticker_count.text("Weekly New Cases: " + new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(item['counts']))
        })

    intv++
    if (intv > Object.keys(dates_list).length-1 || t) {
        clearInterval(coloring)
    }

}


getJsonData()
