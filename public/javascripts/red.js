const nombreMes = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
let COMPRA_VENTA_MES;
let COMPRA_VENTA_CLIENTE;

//--------------REQUESTS---------------------------
function getReportesPedidosClienteMes(mesElegido) {
    let data = {
        mes: mesElegido
    };
    fetch('/reports/reporte_pedidos_cliente_interno_mes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => {
        if (response.ok) {
            console.log(response.message);
            getGraph('bar', response.chartData, "cliente_bars");
            getGraph('pie', response.chartData, "cliente_pie");
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
    fetch('/reports/reporte_producto_pedido_mes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => {
        if (response.ok) {
            console.log(response.message);
            getGraph('bar', response.chartData, "producto_bars");
            getGraph('pie', response.chartData, "producto_pie");
        } else {
            console.log(response.status, response.statusText);
        }
    })
    .catch(error => {
        console.log(error.message);
    });
}

function getConsumoCliente() {
    fetch('/reports/reporte_consumo_cliente/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(response => {
        if (response.ok) {
            console.log(response.message);
            getGraph('bar', response.chartData, "precio_cliente_bars");
            getGraph('pie', response.chartData, "precio_cliente_pie");
        } else {
            console.log(response.status, response.statusText);
        }
    })
    .catch(error => {
        console.log(error.message);
    });
}

function getProductoXProvedor() {
    fetch('/reports/reporte_provedor_producto/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(response => {
        if (response.ok) {
            console.log(response.message);
            getGraph('bar', response.chartData, "provedor_bars");
            getGraph('pie', response.chartData, "provedor_pie");
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
    fetch('/reports/reporte_venta_producto_dia/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => {
        if (response.ok) {
            console.log(response.message);
            getGraph('horizontalBar', response.chartData, "venta_dia_bars");
            getGraph('pie', response.chartData, "venta_dia_pie");
        } else {
            console.log(response.status, response.statusText);
        }
    })
    .catch(error => {
        console.log(error.message);
    });
}

function getVentaCompraHoy(dia) {
    document.getElementById("hoylabel").innerText = dia;
    let data = {
        day: dia
    };
    fetch('/reports/reporte_venta_compra_dia/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => {
        if (response.ok) {
            console.log(response.message);
            BuildTableDia(response.chartData);
        } else {
            console.log(response.status, response.statusText);
        }
    })
    .catch(error => {
        console.log(error.message);
    });
}

/*function getVentaCompraColoresMes(mesElegido) {
    let data = {
        mes: mesElegido
    };
    fetch('/reports/reporte_compra_venta_colores_mes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => {
        if (response.ok) {
            console.log(response.message);
            BuildTableMes(response.chartData);
        } else {
            console.log(response.status, response.statusText);
        }
    })
    .catch(error => {
        console.log(error.message);
    });
}*/

function selectVentaCompraColoresMes(nombreCliente, mesElegido) {
    let clienteInfo = {
        cliente: nombreCliente,
        mes: mesElegido
    };

    fetch('/reports/reporte_compra_venta_mes_por_cliente/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clienteInfo)
    })
    .then(response => response.json())
    .then(response => {
        if (response.ok) {
            console.log(response.message);
            BuildTableMes(response.chartData);
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

function lightSelectedMenuTable(index, mes) {
    //clean
    nombreMes.forEach((mesName)=> {
        document.getElementById("c"+index+"_click" + mesName).style.background = "white";
    });
    //set the right
    document.getElementById("c"+index+"_click" + nombreMes[mes]).style.background = "bisque";
}

function lightLeftMenu(index, title) {
    var frameNames = ["frame-pedidos-cliente","frame-pedidos","frame-precios-cliente","frame-provedor","frame-cantidad-venta-dia","frame-venta-compra-dia","frame-venta-compra-mes"];
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

function getVentaCompraDia(dia) {
    getVentaCompraHoy(dia);
}

function getVentaCompraMes(mes) {
    lightSelectedMenuTable(2, mes);
    mes++;
    mes = (mes < 10) ? ('0' + mes) : mes;
    COMPRA_VENTA_MES = mes;

    selectVentaCompraColoresMes(COMPRA_VENTA_CLIENTE, COMPRA_VENTA_MES);
}

function getClienteVentaCompraMes(selected) {
    COMPRA_VENTA_CLIENTE = selected.value;

    selectVentaCompraColoresMes(COMPRA_VENTA_CLIENTE, COMPRA_VENTA_MES);
}

/////////////////// D3  functions ///////////////////

function getGraph(graphType, chartData, canvas_id) {

    var label = [];
    var volume = [];
    chartData.forEach((item, index)=> {
        label[index] = item.cliente;
        volume[index] = item.Volume; 
    });

    var ctx = document.getElementById(canvas_id).getContext('2d');
    var myChart = new Chart(ctx, {
        type: graphType, // 'bar', line pie horizontalBar
        data: {
        labels: label,
        datasets: [{
            label: '# of transactions',
            data: volume,
            backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 206, 86)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)',
            'rgb(55, 159, 64)',
            'rgb(255, 59, 164)',
            'rgb(55, 109, 164)',
            ],
            borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1,
        }]
        },
        options: {
        scales: {
            yAxes: [{
            ticks: {
                beginAtZero: true
            }
            }]
        }
        }
    });
}

function BuildTableDia(chartData) {
    var TotalVenta = 0;
    var TotalCompra = 0;

    document.getElementById("table-dia-body").innerHTML = "";;
    var table = document.getElementById('table-dia').getElementsByTagName('tbody')[0];

    chartData.forEach((row) => {

        var newRow = table.insertRow();

        var newCell = newRow.insertCell();
        newCell.outerHTML = "<th scope='row'>"+row.item+"</th>";

        newCell = newRow.insertCell();
        newCell.setAttribute("data-title", "Worldwide Gross");
        newCell.setAttribute("data-type", "currency");
        newCell.appendChild(document.createTextNode(row.venta));

        newCell = newRow.insertCell();
        newCell.setAttribute("data-title", "Domestic Gross");
        newCell.setAttribute("data-type", "currency");
        newCell.appendChild(document.createTextNode(row.compra));

        TotalVenta = TotalVenta + Number(row.venta);
        TotalCompra = TotalCompra + Number(row.compra);
    });
    var newRow = table.insertRow();
    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Domestic Gross");
    newCell.setAttribute("data-type", "currency");
    newCell.appendChild(document.createTextNode("Totales: "));
    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Domestic Gross");
    newCell.setAttribute("data-type", "currency");
    newCell.appendChild(document.createTextNode(TotalVenta));
    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Domestic Gross");
    newCell.setAttribute("data-type", "currency");
    newCell.appendChild(document.createTextNode(TotalCompra));
}

function BuildTableMes(chartData) {
    var TotalVenta1 = 0;
    var TotalCompra1 = 0;
    var TotalVenta2 = 0;
    var TotalCompra2 = 0;
    var pegamento = {
        cantidad: 0,
        venta: 0,
        compra: 0
    };

    document.getElementById("table-mes-body").innerHTML = "";
    var table = document.getElementById('table-mes').getElementsByTagName('tbody')[0];

    chartData.forEach((row) => {

        if (row.producto == "Pegamento") {
            pegamento.cantidadVenta = row.colores.cantidadItemsVenta;
            pegamento.cantidadCompra = row.colores.cantidadItemsCompra;
            pegamento.venta = row.colores.venta;
            pegamento.compra = row.colores.compra;
        
        } else {

            var newRow = table.insertRow();

            var newCell = newRow.insertCell();
            newCell.outerHTML = "<th scope='row'>"+row.producto+"</th>";

            newCell = newRow.insertCell();
            newCell.setAttribute("data-title", "Worldwide Gross");
            newCell.setAttribute("data-type", "currency");
            newCell.appendChild(document.createTextNode("Blanco"));

            newCell = newRow.insertCell();
            newCell.setAttribute("data-title", "Domestic Gross");
            newCell.setAttribute("data-type", "currency");
            newCell.appendChild(document.createTextNode(row.blanco.tipo));

            newCell = newRow.insertCell();
            newCell.setAttribute("data-title", "Domestic Gross");
            newCell.setAttribute("data-type", "currency");
            newCell.appendChild(document.createTextNode(row.blanco.cantidadItemsVenta));

            newCell = newRow.insertCell();
            newCell.setAttribute("data-title", "Domestic Gross");
            newCell.setAttribute("data-type", "currency");
            newCell.appendChild(document.createTextNode(row.blanco.venta));

            newCell = newRow.insertCell();
            newCell.setAttribute("data-title", "Domestic Gross");
            newCell.setAttribute("data-type", "currency");
            newCell.appendChild(document.createTextNode(row.blanco.cantidadItemsCompra));

            newCell = newRow.insertCell();
            newCell.setAttribute("data-title", "Domestic Gross");
            newCell.setAttribute("data-type", "currency");
            newCell.appendChild(document.createTextNode(row.blanco.compra));

            newCell = newRow.insertCell();
            newCell.setAttribute("data-title", "Worldwide Gross");
            newCell.setAttribute("data-type", "currency");
            newCell.appendChild(document.createTextNode("Maderado"));

            newCell = newRow.insertCell();
            newCell.setAttribute("data-title", "Domestic Gross");
            newCell.setAttribute("data-type", "currency");
            newCell.appendChild(document.createTextNode(row.colores.tipo));

            newCell = newRow.insertCell();
            newCell.setAttribute("data-title", "Domestic Gross");
            newCell.setAttribute("data-type", "currency");
            newCell.appendChild(document.createTextNode(row.colores.cantidadItemsVenta));

            newCell = newRow.insertCell();
            newCell.setAttribute("data-title", "Domestic Gross");
            newCell.setAttribute("data-type", "currency");
            newCell.appendChild(document.createTextNode(row.colores.venta));

            newCell = newRow.insertCell();
            newCell.setAttribute("data-title", "Domestic Gross");
            newCell.setAttribute("data-type", "currency");
            newCell.appendChild(document.createTextNode(row.colores.cantidadItemsCompra));

            newCell = newRow.insertCell();
            newCell.setAttribute("data-title", "Domestic Gross");
            newCell.setAttribute("data-type", "currency");
            newCell.appendChild(document.createTextNode(row.colores.compra));

            TotalVenta1 = TotalVenta1 + Number(row.blanco.venta);
            TotalCompra1 = TotalCompra1 + Number(row.blanco.compra);
            TotalVenta2 = TotalVenta2 + Number(row.colores.venta);
            TotalCompra2 = TotalCompra2 + Number(row.colores.compra);
        }
    });
    var newRow = table.insertRow();
    newRow.style.background = "#FBD7C2";
    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Domestic Gross");
    newCell.setAttribute("data-type", "currency");
    newCell.appendChild(document.createTextNode("Totales: "));

    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Domestic Gross");
    newCell.setAttribute("data-type", "currency");
    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Domestic Gross");
    newCell.setAttribute("data-type", "currency");
    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Domestic Gross");
    newCell.setAttribute("data-type", "currency");
    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Domestic Gross");
    newCell.setAttribute("data-type", "currency");
    newCell.appendChild(document.createTextNode(TotalVenta1));
    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Domestic Gross");
    newCell.setAttribute("data-type", "currency");
    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Domestic Gross");
    newCell.setAttribute("data-type", "currency");
    newCell.appendChild(document.createTextNode(TotalCompra1));
    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Domestic Gross");
    newCell.setAttribute("data-type", "currency");
    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Domestic Gross");
    newCell.setAttribute("data-type", "currency");
    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Domestic Gross");
    newCell.setAttribute("data-type", "currency");
    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Domestic Gross");
    newCell.setAttribute("data-type", "currency");
    newCell.appendChild(document.createTextNode(TotalVenta2));
    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Domestic Gross");
    newCell.setAttribute("data-type", "currency");
    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Domestic Gross");
    newCell.setAttribute("data-type", "currency");
    newCell.appendChild(document.createTextNode(TotalCompra2));

//Totales table

    document.getElementById("table-totales-mes-body").innerHTML = "";
    table = document.getElementById('table-totales-mes').getElementsByTagName('tbody')[0];

    var newRow = table.insertRow();
    
    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Worldwide Gross");
    newCell.setAttribute("data-type", "currency");
    newCell.appendChild(document.createTextNode("Pegamento"));

    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Domestic Gross");
    newCell.setAttribute("data-type", "currency");
    newCell.appendChild(document.createTextNode(pegamento.cantidadVenta));

    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Domestic Gross");
    newCell.setAttribute("data-type", "currency");
    newCell.appendChild(document.createTextNode(pegamento.cantidadCompra));

    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Domestic Gross");
    newCell.setAttribute("data-type", "currency");
    newCell.appendChild(document.createTextNode(pegamento.venta));

    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Domestic Gross");
    newCell.setAttribute("data-type", "currency");
    newCell.appendChild(document.createTextNode(pegamento.compra));

    var newRow = table.insertRow();

    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Worldwide Gross");
    newCell.setAttribute("data-type", "currency");
    newCell.appendChild(document.createTextNode("Productos arriba"));

    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Domestic Gross");
    newCell.setAttribute("data-type", "currency");

    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Domestic Gross");
    newCell.setAttribute("data-type", "currency");

    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Domestic Gross");
    newCell.setAttribute("data-type", "currency");
    newCell.appendChild(document.createTextNode(TotalVenta1 + TotalVenta2));

    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Domestic Gross");
    newCell.setAttribute("data-type", "currency");
    newCell.appendChild(document.createTextNode(TotalVenta1 + TotalVenta2));

    var newRow = table.insertRow();
    newRow.style.background = "#FBD7C2";
    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Worldwide Gross");
    newCell.setAttribute("data-type", "currency");
    newCell.appendChild(document.createTextNode("TOTAL:"));

    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Domestic Gross");
    newCell.setAttribute("data-type", "currency");

    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Domestic Gross");
    newCell.setAttribute("data-type", "currency");

    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Domestic Gross");
    newCell.setAttribute("data-type", "currency");
    newCell.appendChild(document.createTextNode(pegamento.venta + TotalVenta1 + TotalVenta2));

    newCell = newRow.insertCell();
    newCell.setAttribute("data-title", "Domestic Gross");
    newCell.setAttribute("data-type", "currency");
    newCell.appendChild(document.createTextNode(pegamento.venta + TotalVenta1 + TotalVenta2));
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

function generarVentaCompraDia() {
    lightLeftMenu(5, "Reporte: Volumen de Ventas y compras de hoy");

    getVentaCompraDia(getFromPicker());
}

function generarVentaCompraMes() {
    lightLeftMenu(6, "Reporte: Volumen de Ventas y compras por mes y color");

    COMPRA_VENTA_CLIENTE = "All";
    let mes = (new Date()).getMonth();
    getVentaCompraMes(mes);
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
