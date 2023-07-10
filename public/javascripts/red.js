// The every data variable. for both Clientes charts
var chartData = [
    {cliente:"Hector",   Volume: 29},
    {cliente:"Jose",     Volume: 20},
    {cliente:"Maria",    Volume: 15},
    {cliente:"Moises",   Volume: 7},
    {cliente:"(Externo)",Volume: 35},
];

function getPedidosMes(mesElegido) {
    let data = {
        mes: Number(mesElegido)
    };
    fetch('/reporte_pedidos_cliente_interno_mes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => {
        if (response.ok) {
            console.log(response.message);
            document.getElementById("message").style.background = "#a4f1a4";
            document.getElementById("message").innerHTML = response.message + "<br>";
        } else {
            console.log(response.status, response.statusText);
            document.getElementById("message").style.background = "red";
            document.getElementById("message").innerHTML = response.message + "<br>";
        }
    })
    .catch(error => {
        document.getElementById("message").style.background = "red";
        document.getElementById("message").innerHTML = "Error: " + error.message + "<br>";
        console.log(error.message);
    });
}


function BarsData() {
    var margin = {top: 40, right: 20, bottom: 30, left: 60};
    var width = 750 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    var formatPercent = d3.format(".0%");
    var color = d3.scale.category20();

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
        //.tickFormat(formatPercent);

    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "<strong style='color:red'>Volumen:</strong> <span style='color:red'>" + d.Volume + "</span>";
    })

    var svg = d3
        .select("#cliente_bars")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    // The following code was contained in the callback function.
    x.domain(chartData.map(function(d) { return d.cliente; }));
    y.domain([0, d3.max(chartData, function(d) { return d.Volume; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(-6," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
    .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".41em")
        .style("text-anchor", "end")
        .text("Volumen")
        .style("font-size", "12px");

    svg.selectAll(".bar")
        .data(chartData)
    .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.cliente); })
        .attr("width", x.rangeBand()-40)
        .attr("y", function(d) { return y(d.Volume); })
        .attr("height", function(d) { return height - y(d.Volume); })
        .style("fill", function(d) {
            return color(d.Volume); 
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)

    function type(d) {
        d.Volume = +d.Volume;
        return d;
    }
}

function PieLegend() {
    var width = 650;
    var height = 400;
    
    var animationDuration = 2500; 

    var radius = Math.min(width, height) / 2.3;
    var legendRectSize = 12;
    var legendSpacing = 4;
    var sum = d3.sum(chartData, function (d) { return d.Volume });
    var labelRadius = radius + 13;
    

    var color = d3.scale.category20();

    var chart = d3.select("#cliente_pie")
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + (width / 2) + 
        ',' + (height / 2) + ')');

    var arc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(radius);

    var pie = d3.layout.pie()
        .value(function(d) { return d.Volume; })
        .sort(null);

            
    chartData.forEach(function(d) {
        d.Volume = +d.Volume;
        d.enabled = true;                                         
    });

    var path = chart.selectAll('path')
        .data(pie(chartData))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr("class", "arc")
        .attr('fill', function(d, i) { 
            return color(d.data.cliente); 
        })                                                       
        .each(function(d) { this._current = d; });                

            
    var legend = chart.selectAll("#pie-chart")
        .data(color.domain())
        .enter()
        .append('g')
        .attr("position", "absolute")
            .attr('class', 'pieLegend')
        .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset = height * color.domain().length / 2;
            var horz = -19 * legendRectSize;
            var vert = i * height - (offset)*3;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)                                   
        .style('fill', color)
        .style('stroke', color)                                  
        .on('click.removeSlice', function(Task) {                            
            var rect = d3.select(this);                             
            var enabled = true;                                     
            var totalEnabled = d3.sum(chartData.map(function(d) {     
                return (d.enabled) ? 1 : 0;                           
            }));                                                    
                
            if (rect.attr('class') === 'disabled') {                
                rect.attr('class', '');                               
            } else {                                                
                if (totalEnabled < 2) return;                         
                rect.attr('class', 'disabled');                       
                enabled = false;                                      
            }                                                       

            pie.value(function(d) {                                 
                if (d.cliente === Task) d.enabled = enabled;           
                return (d.enabled) ? d.Volume : 0;                     
            });                                                     

            path = path.data(pie(chartData));

            path.transition()                                       
            .duration(750)                                        
            .attrTween('d', function(d) {                         
                var interpolate = d3.interpolate(this._current, d); 
                this._current = interpolate(0);                     
                return function(t) {                                
                    return arc(interpolate(t));                       
                };                                                  
            });                                                   
        });                                                       
            
    legend.append('text')
        .attr('x', legendRectSize + legendSpacing - 100) // legend(x,y)
        .attr('y', legendRectSize - legendSpacing + 2)// legend(x,y)
        .style("font-size", "14px")
        .text(function(d) { return d; });

        path.transition()
        .ease("sin")
        .duration(animationDuration)
        .attrTween("d", tweenPie);
    
    function tweenPie(b) {
        var i = d3.interpolate({ startAngle: 0, endAngle: 0 }, b);
        return function (t) { return arc(i(t)); };
    };

    // Create Arcs for labels

    var layoutLabels = d3.layout.pie()
            .sort(null)
            .value(function (d) { return d.disabled ? 0 : d.Volume });

    var pieLabels = chart.selectAll(".pieLabel")
        .data(layoutLabels(chartData))
        .enter()
        .append('g')
        .attr('class', 'pieLabel')


    var labelsArc = d3.svg.arc().outerRadius(radius);

    pieLabels.append("g").classed("pieLabel",true).each(function(d,i) {
        var group = d3.select(this);

        group.attr('transform', function (d) {
            
                d.outerRadius = radius + 10; 
                d.innerRadius = radius + 15; 
                var rotateAngle = (d.startAngle + d.endAngle) / 2 * (180 / Math.PI);
                if ((d.startAngle + d.endAngle) / 2 < Math.PI) {
                    rotateAngle -= 90;
                } else {
                    rotateAngle += 90;
                }
                return 'translate(' + labelsArc.centroid(d) + ') rotate(' + rotateAngle + ')';
                    });

    });

    var slices = pieLabels.append("text")
        .attr("transform", function (d) {
            var c = arc.centroid(d),
                x = c[0],
                y = c[1],
                // pythagorean theorem for hypotenuse
                h = Math.sqrt(x * x + y * y);
            return "translate(" + (x+1 / h * labelRadius) + ',' +
                (y-1 / h * labelRadius) + ")";
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function (d, i) { return ((d.data.Volume / sum) * 100).toFixed(0) + "%"; });


    legend.on('click.updatelabels', function(Task) {                            
        var rect = d3.select(this);                             
        var enabled = true;                                     
        var totalEnabled = d3.sum(chartData.map(function(d) {     
            return (d.enabled) ? 1 : 0;                           
        }));                                                    
                
        if (rect.attr('class') === 'disabled') {                
            rect.attr('class', '');                               
        } else {                                                
            if (totalEnabled < 2) return;                         
            rect.attr('class', 'disabled');                       
            enabled = false;                                      
        }                                                       

        layoutLabels.value(function (d) { return (d.enabled) ? 1 : 0;  });

        d3.select('Text').selectAll("pieLegend").remove()

        pieLabels.select("text")   
            .attr("transform", function (d) {
                var c = arc.centroid(d),
                    x = c[0],
                    y = c[1],
                    // pythagorean theorem for hypotenuse
                    h = Math.sqrt(x * x + y * y);
                return "translate(" + (x / h * labelRadius) + ',' +
                    (y / h * labelRadius) + ")";
            })
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(function (d, i) { return ((d.Volume / sum) * 100).toFixed(0) + "%"; });
    });
}

$(function(){
    $("#form-total").steps({
        headerTag: "h2",
        bodyTag: "section",
        transitionEffect: "fade",
        enableAllSteps: true,
        autoFocus: true,
        transitionEffectSpeed: 500,
        titleTemplate : '<div class="title">#title#</div>',
        labels: {
            previous : 'Anterior',
            next : 'Proximo',
            finish : 'Salir',
            current : ''
        },
        onStepChanging: function (event, currentIndex, newIndex) { 
      
            return true;
        }
    });

    BarsData();

    PieLegend();
});
