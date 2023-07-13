const nombreMes = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

//--------------REQUESTS---------------------------
function getReportesPedidosClienteMes(mesElegido) {
    let data = {
        mes: mesElegido
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
            clearSVG()
            BarsData(response.chartData,"cliente_bars");
            PieLegend(response.chartData,"cliente_pie");
        } else {
            console.log(response.status, response.statusText);
        }
    })
    .catch(error => {
        console.log(error.message);
    });
}

function getReportesPedidosMes(mesElegido) {
    let data = {
        mes: mesElegido
    };
    fetch('/reporte_producto_pedido_mes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => {
        if (response.ok) {
            console.log(response.message);
            clearSVG()
            BarsData(response.chartData, "producto_bars");
            PieLegend(response.chartData, "producto_pie");
        } else {
            console.log(response.status, response.statusText);
        }
    })
    .catch(error => {
        console.log(error.message);
    });
}

function getConsumoCliente() {
    fetch('/reporte_consumo_cliente/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(response => {
        if (response.ok) {
            console.log(response.message);
            clearSVG()
            BarsData(response.chartData, "precio_cliente_bars");
            PieLegend(response.chartData, "precio_cliente_pie");
        } else {
            console.log(response.status, response.statusText);
        }
    })
    .catch(error => {
        console.log(error.message);
    });
}

function getProductoXProvedor() {
    fetch('/reporte_provedor_producto/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(response => {
        if (response.ok) {
            console.log(response.message);
            clearSVG()
            BarsData(response.chartData, "provedor_bars");
            PieLegend(response.chartData, "provedor_pie");
        } else {
            console.log(response.status, response.statusText);
        }
    })
    .catch(error => {
        console.log(error.message);
    });
}

function getProductoXDia(dia) {
    let data = {
        day: dia
    };
    fetch('/reporte_venta_producto_dia/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => {
        if (response.ok) {
            console.log(response.message);
            clearSVG()
            BarsData(response.chartData, "venta_dia_bars");
            PieLegend(response.chartData, "venta_dia_pie");
        } else {
            console.log(response.status, response.statusText);
        }
    })
    .catch(error => {
        console.log(error.message);
    });
}

function lightSelectedMenu(index, mes) {
    //clean
    nombreMes.forEach((mesName)=> {
        document.getElementById("b"+index+"_click" + mesName).style.background = "white";
        document.getElementById("p"+index+"_click" + mesName).style.background = "white";
    });
    //set the right
    document.getElementById("b"+index+"_click" + nombreMes[mes]).style.background = "bisque";
    document.getElementById("p"+index+"_click" + nombreMes[mes]).style.background = "bisque";
}

function lightLeftMenu(index, title) {
    var frameNames = ["frame-pedidos-cliente","frame-pedidos","frame-precios-cliente","frame-provedor","frame-cantidad-venta-dia"];
    document.getElementById("frame-title").innerHTML = title;
    frameNames.forEach((nameID)=> {
        document.getElementById(nameID).style.display = "none";
        document.getElementById(nameID+"-b").style.background = "white";
    });
    document.getElementById(frameNames[index]).style.display = "block";
    document.getElementById(frameNames[index]+"-b").style.background = "bisque";
}

//--------------PRE REQUESTS CONFIG ---------------------------
function getPedidosClienteDelMes(mes) {
    lightSelectedMenu(0, mes);
    mes++;
    mes = (mes < 10) ? ('0' + mes) : mes;

    getReportesPedidosClienteMes(mes);
}

function getPedidosMes(mes) {
    lightSelectedMenu(1, mes);
    mes++;
    mes = (mes < 10) ? ('0' + mes) : mes;

    getReportesPedidosMes(mes);
}

function getPrecioCliente() {
    getConsumoCliente();
}

function getProvedorProducto() {
    getProductoXProvedor();
}

function getProductoDia(dia) {
    getProductoXDia(dia);
}

/////////////////// D3  functions ///////////////////

function clearSVG() {
    d3.selectAll("svg").remove();
}

function BarsData(chartData, canvas_id) {
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
        .select("#"+canvas_id)
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
        .style("font-size", "10px");

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

function PieLegend(chartData, canvas_id) {
    var width = 650;
    var height = 400;
    
    var animationDuration = 2500; 

    var radius = Math.min(width, height) / 2.3;
    var legendRectSize = 12;
    var legendSpacing = 4;
    var sum = d3.sum(chartData, function (d) { return d.Volume });
    var labelRadius = radius + 13;
    

    var color = d3.scale.category20();

    var chart = d3.select("#"+canvas_id)
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
        .style("font-size", "12px")
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
///*************** INTERFACE BUTTONS *** */


function generarPedidosCliente() {
    lightLeftMenu(0, "Reporte: Volumen de Pedidos por Cliente (mes)");
    
    let mes = (new Date()).getMonth();
    getPedidosClienteDelMes(mes);
}

function generarProductos() {
    lightLeftMenu(1, "Reporte: Volumen de Pedidos por mes");

    let mes = (new Date()).getMonth();
    getPedidosMes(mes);
}

function generarPreciosCliente() {
    lightLeftMenu(2, "Reporte: Volumen de ventas hechas a Clientes en Bs");

    getPrecioCliente();
}

function generarProvedorProductos() {
    lightLeftMenu(3, "Reporte: Volumen de compras a Provedores en Bs.");

    getProvedorProducto();
}

function generarProoductoDia() {
    lightLeftMenu(4, "Reporte: Volumen de Ventas por dia");

    getProductoDia(getFromPicker());
}

function getFromPicker() {
    var date = new Date();
    var t=$.datepicker.formatDate("dd/mm/yy", date);
    
    return t;
}

$(function() {
    $("#form-total-0").steps({
        headerTag: "h2",
        bodyTag: "section",
        transitionEffect: "fade",
        enableAllSteps: true,
        autoFocus: true,
        transitionEffectSpeed: 500,
        titleTemplate : '<div class="title">#title#</div>',
        labels: { previous : 'Anterior', next : 'Proximo', finish : 'Salir', current : '' },
        onStepChanging: function (event, currentIndex, newIndex) { 
            return true;
        }
    });
    $("#form-total-1").steps({
        headerTag: "h2",
        bodyTag: "section",
        transitionEffect: "fade",
        enableAllSteps: true,
        autoFocus: true,
        transitionEffectSpeed: 500,
        titleTemplate : '<div class="title">#title#</div>',
        labels: { previous : 'Anterior', next : 'Proximo', finish : 'Salir', current : '' },
        onStepChanging: function (event, currentIndex, newIndex) { 
            return true;
        }
    });
    $("#form-total-2").steps({
        headerTag: "h2",
        bodyTag: "section",
        transitionEffect: "fade",
        enableAllSteps: true,
        autoFocus: true,
        transitionEffectSpeed: 500,
        titleTemplate : '<div class="title">#title#</div>',
        labels: { previous : 'Anterior', next : 'Proximo', finish : 'Salir', current : '' },
        onStepChanging: function (event, currentIndex, newIndex) { 
            return true;
        }
    });
    $("#form-total-3").steps({
        headerTag: "h2",
        bodyTag: "section",
        transitionEffect: "fade",
        enableAllSteps: true,
        autoFocus: true,
        transitionEffectSpeed: 500,
        titleTemplate : '<div class="title">#title#</div>',
        labels: { previous : 'Anterior', next : 'Proximo', finish : 'Salir', current : '' },
        onStepChanging: function (event, currentIndex, newIndex) { 
            return true;
        }
    });
    $("#form-total-4").steps({
        headerTag: "h2",
        bodyTag: "section",
        transitionEffect: "fade",
        enableAllSteps: true,
        autoFocus: true,
        transitionEffectSpeed: 500,
        titleTemplate : '<div class="title">#title#</div>',
        labels: { previous : 'Anterior', next : 'Proximo', finish : 'Salir', current : '' },
        onStepChanging: function (event, currentIndex, newIndex) { 
            return true;
        }
    });

    lightLeftMenu(0, "Reporte: Volumen de Pedidos por Cliente (mes)");
    let mes = (new Date()).getMonth();
    getPedidosClienteDelMes(mes);

    $.datepicker.setDefaults($.datepicker.regional["es"]);
    $("#datepicker_bar").datepicker({
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        onSelect: function (dateText, inst) {
            var date = $(this).val();
            getProductoDia(date);
            //alert(date);
        }
    }).datepicker("setDate", new Date());
    $("#datepicker_pie").datepicker({
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        onSelect: function (dateText, inst) {
            var date = $(this).val();
            getProductoDia(date);
            alert(date);
        }
    }).datepicker("setDate", new Date());
});
