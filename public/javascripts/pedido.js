let NotaVenta = function() {
    var NumeroPedido;
    var NombreCliente;
    var Item;
    var Medida;
    var Marca;
    var Color;
    var Cantidad;
    var Precio;
    var Unidad;
    var Fecha;
};

let historialUnit = {
    cliente        : "",
    numIngreso     : "",
    fecha          : "",
    item           : "",
    color          : "",
    medida         : "",
    marca          : "",
    nombreDeUnidad : "",
    cantidad       : "",
    precio         : "",
    embalaje       : "",
    precioCompra   : "",
    precioVenta    : "",
    metrosXRollo   : "",
    precioVentaMts : "",
    codigo         : "",
    tipo_entrada   : "pedido",
};

let responseAlertCounter = 0;
let MAX_REQUESTS;

let DATA_INDEX_NAME = ["fecha","item","color","medida","marca","nombreDeUnidad","cantidad","precioVenta"];

function addCarrito() {
    let ids = new getIDS();
    let tipo_cliente = ids.verify();

    var tbodyRef = document.getElementById(ids.CARRITO).getElementsByTagName('tbody')[0];

    // Insert a row at the end of table
    var newRow = tbodyRef.insertRow();
    var newCell;

    for (let index=0; index < DATA_INDEX_NAME.length; index++) {
        newCell = newRow.insertCell();
        newCell.style.color = "white";
        newCell.style.borderBottom = "1px solid"
        newCell.style.borderColor = "rgba(255,255,255,0.3)";
        newCell.style.fontSize ="14px";
        newCell.appendChild(document.createTextNode(historialUnit[DATA_INDEX_NAME[index]]));
    }
    //save object by clonning
    newRow.pedido = JSON.parse(JSON.stringify(historialUnit));

    newCell = newRow.insertCell();
    let button = document.createElement("button");
    button.appendChild(document.createTextNode("x"));
    button.onclick = function() {
        var table = document.getElementById(ids.CARRITO);
        //accessing td > tr > rowindex
        table.deleteRow(this.parentElement.parentElement.rowIndex);
    };
    newCell.appendChild(button);
}

/*function getCarritos() {
    let ids = new getIDS();
    let tipo_cliente = ids.verify();

    var Pedidos = [];
    var table_carrito = document.getElementById(ids.CARRITO).getElementsByTagName('tbody')[0];

    for (let index = 0; index < table_carrito.children.length; index++) {
        Pedidos[index] = table_carrito.children[index].pedido;
    }

    return Pedidos;
}*/

function verifyResponsesDone() {
    if (++responseAlertCounter >= MAX_REQUESTS) {
        window.location.reload();
        responseAlertCounter = 0;
    }
}

function salvarPedidos(Pedido) {
    fetch('/addicionar_pedido/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Pedido)
    })
    .then(response => response.json())
    .then(response => {
        if (response.ok) {
            console.log(response.message);
            document.getElementById("message").innerHTML  += response.message + ". Item guardado! <br>";
            verifyResponsesDone();
        } else {
            console.log(response.status, response.statusText);
            document.getElementById("message").innerHTML  += "<p style='color:red;'>" + response.message + "</p>";
            verifyResponsesDone();
        }
    })
    .catch(error => {
        document.getElementById("message").innerHTML  += "<p style='background:red;'>Error: " + error.message + "</p>";
        console.log(error.message);
        verifyResponsesDone();
    });
};

function salvarPedido() {
    fetch('/addicionar_pedido/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(historialUnit)
    })
    .then(response => response.json())
    .then(response => {
        if (response.ok) {
            console.log(response.message);
            alert(response.message + ". Item guardado!");
            window.location.reload();
        } else {
            console.log(response.status, response.statusText);
            alert(response.message);
        }
    })
    .catch(error => {
        alert("Error: " + error.message);
        console.log(error.message);
    });
};

let setHistorial = function() {
    let ids = new getIDS();
    let tipo_cliente = ids.verify();

    let NONE = "(ninguno)";
    historialUnit.fecha          = document.getElementById(ids.TIME_ID).value;
    historialUnit.numIngreso     = $('#'+ids.INGRESO_ID).val();
    historialUnit.item           = $('#'+ids.ITEM_ID).find(":selected").text();

    let item = historialUnit.item;
    historialUnit.cliente        = (tipo_cliente==1||tipo_cliente==3)?$('#'+ids.CLIENTE_ID).find(":selected").text():document.getElementById("complete_name").value;
    if (tipo_cliente == 2) {
        historialUnit.celular   = document.getElementById("phone").value;
        historialUnit.email     = document.getElementById("email").value;
        historialUnit.ci        = document.getElementById("carnet").value;
        historialUnit.direccion = document.getElementById("direccion").value;
        historialUnit.nit       = document.getElementById("nit").value;
        historialUnit.empresa   = document.getElementById("empresa").value;
    }
    historialUnit.nombreDeUnidad = $('#'+ids.UNIDAD_ID).find(":selected").text();
    historialUnit.embalaje       = (item == "Pegamento") ? "Bolsa" : ((item == "Tapacanto" ? "Caja" : ((item == "Melamina" ? "Paquete" : "Paquete"))));;
    historialUnit.precioCompra   = "";
    historialUnit.precioVenta    = $('#'+ids.PRECIO_ID).val();
    historialUnit.cantidad       = $('#'+ids.CANTIDAD_ID).val();
    historialUnit.marca          = $('#'+ids.MARCA_ID).find(":selected").text();

    if (item != "Pegamento") {
        historialUnit.color    = $('#'+ids.COLOR_ID).find(":selected").val();
        historialUnit.medida   = $('#'+ids.MEDIDA_ID).find(":selected").val();
        if (item == "Tapacanto") {
            historialUnit.metrosXRollo   = NONE;
            historialUnit.precioVentaMts = NONE;
        }
    } else {
        historialUnit.color    = NONE;
        historialUnit.medida   = NONE;
        historialUnit.metrosXRollo   = NONE;
        historialUnit.precioVentaMts = NONE;
    }
}

let GuardarPedido = function() {
    setHistorial();
    salvarPedido();
}

let GuardarPedidos = function() {
    let ids = new getIDS();
    let tipo_cliente = ids.verify();

    var table_carrito = document.getElementById(ids.CARRITO).getElementsByTagName('tbody')[0];
    MAX_REQUESTS = table_carrito.children.length;

    for (let index = 0; index < MAX_REQUESTS; index++) {
        var Pedido = table_carrito.children[index].pedido;
        salvarPedidos(Pedido);
    }
}

let addicionarPedidoAlCarrito = function() {
    setHistorial();
    addCarrito();
}

let removerUltimoPedidoDelCarrito = function() {
    let ids = new getIDS();
    let tipo_cliente = ids.verify();

    var table = document.getElementById(ids.CARRITO);
    var rowCount = table.rows.length;
    if (rowCount == 1) {
        return;
    }
    table.deleteRow(rowCount-1);
}

function DatosCliente(select) {
    let selectedValue = Number(select.value);
    NotaVenta.direccion = pedido_cliente[selectedValue].direccion;
    NotaVenta.celular   = pedido_cliente[selectedValue].celular;
    NotaVenta.email     = pedido_cliente[selectedValue].email;
    NotaVenta.empresa   = pedido_cliente[selectedValue].empresa;
    NotaVenta.ci        = pedido_cliente[selectedValue].ci;
    NotaVenta.nit       = pedido_cliente[selectedValue].nit;
}

function PrePrint() {
    let ids = new getIDS();
    let tipo_cliente = ids.verify();

    NotaVenta.NumeroPedido  = $('#pedido').text();
    if ((tipo_cliente==1 || tipo_cliente==3)) {
        NotaVenta.NombreCliente = $('#'+ids.CLIENTE_ID).find(":selected").text();
        DatosCliente(document.getElementById(ids.CLIENTE_ID));
    } else {
        NotaVenta.NombreCliente = document.getElementById("complete_name").value;
        NotaVenta.direccion     = document.getElementById("direccion").value;
        NotaVenta.celular       = document.getElementById("phone").value; 
        NotaVenta.email         = document.getElementById("email").value;
        NotaVenta.ci            = document.getElementById("carnet").value;
        NotaVenta.nit           = document.getElementById("nit").value;
        NotaVenta.empresa       = document.getElementById("empresa").value;
    }
    
    NotaVenta.Item          = $('#'+ids.ITEM_ID).find(":selected").text();
    NotaVenta.Medida        = $('#'+ids.MEDIDA_ID).find(":selected").val();
    NotaVenta.Marca         = $('#'+ids.MARCA_ID).find(":selected").val();
    NotaVenta.Color         = $('#'+ids.COLOR_ID).find(":selected").val();
    NotaVenta.Fecha         = $('#'+ids.TIME_ID).val();
    NotaVenta.Unidad        = $('#'+ids.UNIDAD_ID).val();
    NotaVenta.Cantidad      = $('#'+ids.CANTIDAD_ID).val();
    NotaVenta.Precio        = $('#'+ids.PRECIO_ID).val();

    $('#numero-print').text(NotaVenta.NumeroPedido);
    $('#cliente-print').text(NotaVenta.NombreCliente);
    $('#direccion-print').text(NotaVenta.direccion);
    $('#celular-print').text(NotaVenta.celular);
    $('#email-print').text(NotaVenta.email);
    $('#ci-print').text(NotaVenta.ci);
   
    $('#item-print').text(NotaVenta.Item);
    $('#medida-print').text(NotaVenta.Medida);
    $('#marca-print').text(NotaVenta.Marca);
    $('#unidad-print').text(NotaVenta.Unidad);
    $('#color-print').text(NotaVenta.Color);
    $('#cantidad-print').text(NotaVenta.Cantidad);
    $('#precio-print').text(NotaVenta.Precio);
    $('#timestamp-print').text(NotaVenta.Fecha);
}

function PrePrintCarrito() {
    let ids = new getIDS();
    let tipo_cliente = ids.verify();

    NotaVenta.NumeroPedido  = $('#pedido').text();
    if ((tipo_cliente==1 || tipo_cliente==3)) {
        NotaVenta.NombreCliente = $('#'+ids.CLIENTE_ID).find(":selected").text();
        DatosCliente(document.getElementById(ids.CLIENTE_ID));
    } else {
        NotaVenta.NombreCliente = document.getElementById("complete_name").value;
        NotaVenta.direccion     = document.getElementById("direccion").value;
        NotaVenta.celular       = document.getElementById("phone").value; 
        NotaVenta.email         = document.getElementById("email").value;
        NotaVenta.ci            = document.getElementById("carnet").value;
        NotaVenta.nit           = document.getElementById("nit").value;
        NotaVenta.empresa       = document.getElementById("empresa").value;
    }
    $('#timestamp-print').text($('#'+ids.TIME_ID).val());
    $('#cliente-print').text(NotaVenta.NombreCliente);
    $('#direccion-print').text(NotaVenta.direccion);
    $('#celular-print').text(NotaVenta.celular);
    $('#email-print').text(NotaVenta.email);
    $('#ci-print').text(NotaVenta.ci);

    var TotalPrecio = 0;
    var pedidoNum = 1;
    var pedido_nota = document.getElementById('pedido-body').getElementsByTagName('tbody')[0];
    var table_carrito = document.getElementById(ids.CARRITO).getElementsByTagName('tbody')[0];

    for (let i = 0; i < table_carrito.children.length; i++) {
        carrito = table_carrito.children[i].pedido;
        var newRow = pedido_nota.insertRow();

        var newCell = newRow.insertCell();
        newCell.style.width = "30px";
        newCell.appendChild(document.createTextNode(pedidoNum++));
        newCell = newRow.insertCell();
        newCell.style.width = "100px";
        newCell.appendChild(document.createTextNode(carrito.item));
        newCell = newRow.insertCell();
        newCell.style.width = "100px";
        newCell.appendChild(document.createTextNode(carrito.medida));
        newCell = newRow.insertCell();
        newCell.style.width = "100px";
        newCell.appendChild(document.createTextNode(carrito.color));
        newCell = newRow.insertCell();
        newCell.style.width = "100px";
        newCell.appendChild(document.createTextNode(carrito.marca));
        newCell = newRow.insertCell();
        newCell.style.width = "100px";
        newCell.appendChild(document.createTextNode(carrito.nombreDeUnidad));
        newCell = newRow.insertCell();
        newCell.style.width = "100px";
        newCell.appendChild(document.createTextNode(carrito.cantidad));
        newCell = newRow.insertCell();
        newCell.style.width = "100px";
        newCell.appendChild(document.createTextNode(carrito.precioVenta + " Bs"));
        TotalPrecio = TotalPrecio + Number(carrito.precioVenta);
    }
    var newRow = pedido_nota.insertRow();
    var newCell = newRow.insertCell();
    newCell.style.width = "30px";
    newCell = newRow.insertCell();
    newCell.style.width = "100px";
    newCell = newRow.insertCell();
    newCell.style.width = "100px";
    newCell = newRow.insertCell();
    newCell.style.width = "100px";
    newCell = newRow.insertCell();
    newCell.style.width = "100px";
    newCell = newRow.insertCell();
    newCell.style.width = "100px";
    newCell = newRow.insertCell();
    newCell.style.width = "100px";
    newCell = newRow.insertCell();
    newCell.style.width = "100px";
    newCell.appendChild(document.createTextNode(TotalPrecio + " Bs"));
}

function cleanNotaTable() {
    let table = document.getElementById('pedido-body');
    for (let index = table.rows.length-1; index > 0; index--) {
        table.deleteRow(index);    
    }
}

async function Print(formTarget) {
    //PrePrint();
    PrePrintCarrito();

    var printData = document.getElementById(formTarget);
    newWindow = window.open("PEDIDO");
    newWindow.document.write(printData.outerHTML);
    
    await new Promise(r => setTimeout(r, 1500));

    newWindow.print();
    newWindow.close();

    cleanNotaTable();
}

function toprint() {
    var response = confirm("Desea Imprimir?");

    if (response) {
        Print("InternoForm");
    }

    return false;
}

function obtenerPrecioStandard() {
    let ids = new getIDS();
    ids.verify();

    let queryPrecio = {
        item:     $('#' + ids.ITEM_ID).find(":selected").text(),
        color:    $('#' + ids.COLOR_ID).find(":selected").val(),
        medida:   $('#' + ids.MEDIDA_ID).find(":selected").val(),
        marca:    $('#' + ids.MARCA_ID).find(":selected").val(),
        cantidad: $('#' + ids.CANTIDAD_ID).val(),
        unidad:   $('#' + ids.UNIDAD_ID).find(":selected").val(),
        tipo_entrada: "pedido"
    };

    fetch('/obtener_precio', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(queryPrecio)
    })
    .then(response => response.json())
    .then(response => {
        if (response.ok) {
            document.getElementById(ids.PRECIO_ID).value = response.precio;
            document.getElementById(this.PRECIO_MENSAJE).textContent = "";
        } else {
            document.getElementById(this.PRECIO_MENSAJE).textContent = response.message;
        }
    })
    .catch(error => {
        alert("Error:" + error.message);
        console.log(error.message);
    });

    return false;
}

function deleteHistorial(id) {
    fetch('/delete_historial_ventas/' + id + '/', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => {
        if (response.ok) {
            alert(response.statusText);
            window.location.reload();//update page
        }
    })
    .catch(error => {
        alert(error.message);
    });
};

let addOption = function(select, val, text, backcolor) {
    var opt = document.createElement('option');
    opt.value = val;
    opt.innerHTML = text;
    if (backcolor) {
        opt.style = "background: " + backcolor + ";";
    }
    select.appendChild(opt);
}

let cleanOptionsFrom = function(selectID) {
    let col = document.getElementById(selectID);
    col.options.length = 0;
    return col;
} 

let fillUnidad = function(id_unidad, selecteditem) {
    let tipoUnidad = cleanOptionsFrom(id_unidad);
    addOption(tipoUnidad, "", "(Elija Unidad)");
    var item_unidades = item_unidad[0][selecteditem];
    for (var i=0; i<item_unidades.length; i++) {
        var optionName = item_unidades[i];
        addOption(tipoUnidad, optionName, optionName);    
    }
}

let cleanMedida = function(ids) {
    document.getElementById(ids.DIVMEDIDA).style.display = "none";
    document.getElementById(ids.MEDIDA_ID).value = "";
}

let cleanColor = function(ids) {
    document.getElementById(ids.DIVCOLOR).style.display = "none";
    document.getElementById(ids.COLOR_ID).value = "";
}

let fillPropiedad = function(selectedItem, nombrePropiedad, item_propiedad) {
    selected = cleanOptionsFrom(nombrePropiedad);
    addOption(selected, "", "(Elija " + nombrePropiedad + ")");
    for (var i = 0; i < item_propiedad.length; i++) {
        var propiedad = item_propiedad[i];
        if (propiedad[selectedItem] == true) {
            addOption(selected, propiedad.nombre, propiedad.nombre, propiedad["codigo"] ? propiedad["codigo"] : false);
        }
    }
}

let getIDS = function() {
    this.INGRESO_ID  = "ingreso";
    this.CLIENTE_ID  = "cliente";
    this.ITEM_ID     = "item";
    this.COLOR_ID    = "color";
    this.MEDIDA_ID   = "medida";
    this.MARCA_ID    = "marca";
    this.CANTIDAD_ID = "cantidad";
    this.UNIDAD_ID   = "unidad";
    this.PRECIO_ID   = "precio";
    this.TIME_ID     = "timestamp1";
    this.DIVMEDIDA   = "divmedida";
    this.DIVCOLOR    = "divcolor";
    this.CARRITO     = "carrito_interno";
    this.PRECIO_MENSAJE = "precio-mensaje";

    this.verify = function() {
        if (document.getElementById("form-total-p-1").style.display === "block") {
            this.INGRESO_ID  = "ingreso_ex";
            this.CLIENTE_ID  = "cliente_ex"
            this.ITEM_ID = "item_ex";
            this.COLOR_ID = "color_ex";
            this.MEDIDA_ID = "medida_ex";
            this.MARCA_ID = "marca_ex";
            this.CANTIDAD_ID  = "cantidad_ex";
            this.UNIDAD_ID   = "unidad_ex";
            this.PRECIO_ID   = "precio_ex";
            this.TIME_ID        = "timestamp2";
            this.DIVMEDIDA = "divmedida_ex";
            this.DIVCOLOR = "divcolor_ex";
            this.CARRITO  = "carrito_externo";
            this.PRECIO_MENSAJE = "precio-mensaje_ex";
            return 2;
        } else if (document.getElementById("form-total-p-2").style.display === "block") {
            this.INGRESO_ID  = "ingreso_re";
            this.CLIENTE_ID  = "cliente_re";
            this.ITEM_ID = "item_re";
            this.COLOR_ID = "color_re";
            this.MEDIDA_ID = "medida_re";
            this.MARCA_ID = "marca_re";
            this.CANTIDAD_ID  = "cantidad_re";
            this.UNIDAD_ID   = "unidad_re";
            this.PRECIO_ID   = "precio_re";
            this.TIME_ID     = "timestamp3";
            this.DIVMEDIDA = "divmedida_re";
            this.DIVCOLOR = "divcolor_re";
            this.CARRITO  = "carrito_regular";
            this.PRECIO_MENSAJE = "precio-mensaje_re";
            return 3;
        }
        return 1;
    }
}

let selectItem = function() {
    let ids = new getIDS();
    ids.verify();

    let selectedItem = document.getElementById(ids.ITEM_ID).value.toLowerCase();

    if (selectedItem == "pegamento") {
        cleanColor(ids);
        cleanMedida(ids);
        fillPropiedad(selectedItem, ids.MARCA_ID, item_marca);
    } else {
        document.getElementById(ids.DIVMEDIDA).style.display = "block";
        document.getElementById(ids.DIVCOLOR).style.display = "block";

        fillPropiedad(selectedItem, ids.COLOR_ID, item_color);
        fillPropiedad(selectedItem, ids.MEDIDA_ID, item_medida);
        fillPropiedad(selectedItem, ids.MARCA_ID, item_marca);
    }
    fillUnidad(ids.UNIDAD_ID, selectedItem); 
 
}

// Set client type
function go0() {
    document.getElementById("form-total-p-1").style.display = "none";
    document.getElementById("form-total-p-2").style.display = "none";
    document.getElementById("form-total-p-0").style.display = "block";
    document.getElementById("option_1").style.background = "beige";
    document.getElementById("option_2").style.background = "white";
    document.getElementById("option_3").style.background = "white";
}

function go1() {
    document.getElementById("form-total-p-0").style.display = "none";
    document.getElementById("form-total-p-2").style.display = "none";
    document.getElementById("form-total-p-1").style.display = "block";
    document.getElementById("option_2").style.background = "beige";
    document.getElementById("option_1").style.background = "white";
    document.getElementById("option_3").style.background = "white";
}

function go2() {
    document.getElementById("form-total-p-0").style.display = "none";
    document.getElementById("form-total-p-1").style.display = "none";
    document.getElementById("form-total-p-2").style.display = "block";
    document.getElementById("option_3").style.background = "beige";
    document.getElementById("option_1").style.background = "white";
    document.getElementById("option_2").style.background = "white";
}


document.getElementById("form-total-t-0").addEventListener("click", go0);
document.getElementById("form-total-t-1").addEventListener("click", go1);
document.getElementById("form-total-t-2").addEventListener("click", go2);

$(function() {
    var inputTimestamp1 = document.getElementById('timestamp1');
    var inputTimestamp2 = document.getElementById('timestamp2');
    var inputTimestamp3 = document.getElementById('timestamp3');

    function getTimestamp() {
        var d = new Date();
        var s = d.getSeconds();
        var m = d.getMinutes();
        var h = d.getHours();
        var today = ("0" + (d.getDate())).substr(-2) + "/" +  ("0" + (d.getMonth() + 1)).substr(-2) + "/" + d.getFullYear();
        var currentTime = ("0" + h).substr(-2) + ":" + ("0" + m).substr(-2) + ":" + ("0" + s).substr(-2);

        inputTimestamp1.value = today + " " + currentTime;
        inputTimestamp2.value = inputTimestamp1.value;
        inputTimestamp3.value = inputTimestamp1.value;
    }

    getTimestamp();

    function time() {
        getTimestamp();
    }

    setInterval(time, 1000);

});
