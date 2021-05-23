function showTooltip(d) {

    tooltip.selectAll("span").remove()

    tooltip.style("left", "-4000px")
        .style("opacity", 0)

    d3.event.preventDefault();
    let pos = [d3.event.pageX, d3.event.pageY - 80];

    if (d) {
        /*let ttb = tooltip.append("button")
            .classed("close", true)
            .attr("aria-label", "Close")
            .append("span")
            .attr("aria-hidden", true).html("&times;")

        ttb.on("click", function () {
            showTooltip()
        })
*/
        tooltip.append("span")
            .classed(".tool-content", true)
            .html(d)

        tooltip.style("top", pos[1]  + 10 + "px")
            .style("left", pos[0] + 15 + "px")

        tooltip.transition()
            .duration(4)
            .style("opacity", 1)

    } else {
        return
    }

}