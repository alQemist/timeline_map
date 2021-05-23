!(function(){

    var icondefs = d3.select("body")
        .append("svg")
        .classed("iconbox", true)
        .append("defs")
        .style("width","100px")
        .style("height","100px")
        .style("postion","absolute")
        .style("left","-120px")


    icondefs.append('pattern')
        .attr("patternUnits", "userSpaceOnUse")
        .attr('id', function(){
            return "czech_flag" ;
        })
        .attr('height',34)
        .attr('width',45)
        .attr('x',0)
        .attr('y',-7)
        .append('image')
        .attr('xlink:href',function(){
            return "images/czech_flag.svg";
        })

        .attr('height',34)
        .attr('width',45)
        .attr('x',0)
        .attr('y',0);

    icondefs.append('pattern')
        .attr("patternUnits", "userSpaceOnUse")
        .attr('id', function(){
            return "vline" ;
        })
        .attr('height',1)
        .attr('width',1)
        .attr('x',0)
        .attr('y',0)
        .append('image')
        .attr('xlink:href',function(){
            return "images/vertical_line.svg";
        })

        .attr('height',1)
        .attr('width',1)
        .attr('x',0)
        .attr('y',0);

})()