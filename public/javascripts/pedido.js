let carritoReg = 1;
let ENVIANDO = false;
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

let DATA_INDEX_NAME = ["fecha","item","color","medida","marca","nombreDeUnidad","canteo","cantidad","precioVenta"];

function convertHexToString(input) {

    // decode it using this trick
    output = decodeURIComponent(input);

    return output;
}

function fechaLiteral() {
    var meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    var date = new Date();
    var dia = date.getDate();

    if (dia < 10) {
        dia = '0' + dia.toString();
    }

    return `Cochabamba, ${dia} de ${meses[date.getMonth()]} del ${date.getFullYear()}`; 
}

function addCarrito() {
    let ids = new getIDS();

    var tbodyRef = document.getElementById(ids.CARRITO).getElementsByTagName('tbody')[0];

    // Insert a row at the end of table
    var newRow = tbodyRef.insertRow();
    var newCell;

    newCell = newRow.insertCell();
    newCell.style.color = "white";
    newCell.style.borderBottom = "1px solid"
    newCell.style.borderColor = "rgba(255,255,255,0.3)";
    newCell.style.fontSize ="12px";
    newCell.style.padding = "1px!important";
    newCell.appendChild(document.createTextNode(carritoReg++));
    for (let index=0; index < DATA_INDEX_NAME.length; index++) {
        newCell = newRow.insertCell();
        newCell.style.color = "white";
        newCell.style.borderBottom = "1px solid"
        newCell.style.borderColor = "rgba(255,255,255,0.3)";
        newCell.style.fontSize ="12px";
        newCell.style.padding = "1px!important";
        if (DATA_INDEX_NAME[index] == "color" || DATA_INDEX_NAME[index] == "medida" || DATA_INDEX_NAME[index] == "marca" || DATA_INDEX_NAME[index] == "item") {
            newCell.appendChild(document.createTextNode(historialUnit.text[DATA_INDEX_NAME[index]]));
        } else if (DATA_INDEX_NAME[index] == "canteo") {
            newCell.appendChild(document.createTextNode(historialUnit[DATA_INDEX_NAME[index]]?"\u2713":""));
        } else{
            newCell.appendChild(document.createTextNode(historialUnit[DATA_INDEX_NAME[index]]));
        }
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

function verifyResponsesDone() {
    if (++responseAlertCounter >= MAX_REQUESTS) {
        window.location.reload();
        responseAlertCounter = 0;
        carritoReg = 1;
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
            localStorage.setItem("NUM_PEDIDO", Number(response.numPedido) + 1);
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

let cleanHistorial = function() {
    for (var key in historialUnit) {
        if (historialUnit.hasOwnProperty(key)) {
            delete historialUnit[key];
        }
    }

    historialUnit = {
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
}

let isMetrosAlCanteo = (valor) => {
    return (valor == "metros al canteo");
}

let isMetros = (valor) => {
    return (valor == "metros");
}

let isUnidadMetros = () => {
    let ids = new getIDS();
    let unidad = $('#' + ids.UNIDAD_ID).find(":selected").text();
    return isMetrosAlCanteo(unidad) || isMetros(unidad);
}

let getCurrentProduct = () => {
    let ids = new getIDS();
    return $('#'+ids.ITEM_ID).find(":selected").text();
}

let setHistorial = function() {
    let ids = new getIDS();

    let NONE = "(ninguno)";
    historialUnit.fecha          = document.getElementById(ids.TIME_ID).value;
    historialUnit.numIngreso     = Number(document.getElementById(ids.INGRESO_ID).innerText);
    historialUnit.item           = $('#'+ids.ITEM_ID).find(":selected").val();
    historialUnit.itemName       = $('#'+ids.ITEM_ID).find(":selected").text();
    localStorage.setItem("NUM_PEDIDO", historialUnit.numIngreso);

    historialUnit.canteo   = false;
    let item = historialUnit.itemName;
    historialUnit.cliente        = (ids.esInterno()||ids.esRegular())?$('#'+ids.CLIENTE_ID).find(":selected").val():document.getElementById("complete_name").value;
    if (ids.esExterno()) {
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
    historialUnit.marca          = $('#'+ids.MARCA_ID).find(":selected").val();
    if (historialUnit.nombreDeUnidad == "metros") {
        historialUnit.pu       = PRODUCTO.contenido.precio_venta_metros;
    } else if (isMetrosAlCanteo(historialUnit.nombreDeUnidad)) {
        if (ids.esInterno()) {
            historialUnit.rebaja_canteo = 1;
            historialUnit.pu   = PRODUCTO.contenido.precio_venta_metros_canteo?(PRODUCTO.contenido.precio_venta_metros_canteo-historialUnit.rebaja_canteo):'ne';
        } else {
            historialUnit.pu   = PRODUCTO.contenido.precio_venta_metros_canteo?PRODUCTO.contenido.precio_venta_metros_canteo:'ne';
        }
        historialUnit.canteo   = true;
        historialUnit.nombreDeUnidad = "metros";
    } else if (historialUnit.nombreDeUnidad == "caja") {
        if (item == "tapatornillos") {
            historialUnit.pu   = PRODUCTO.contenido.precio_venta * PRODUCTO.contenido.hojaxcaja;
        } else {
            historialUnit.pu   = PRODUCTO.contenido.precio_venta_caja;
        }
    } else {
        if (ids.esInterno()) {
            historialUnit.pu   = PRODUCTO.contenido.precio_venta_interno;
        } else {
            historialUnit.pu   = PRODUCTO.contenido.precio_venta;
        }
    }

    var _producto = getCurrentProduct();
    if (_producto == "Canteo") {
        //SERVICE canteo
        historialUnit.canteo   = true;
        historialUnit.nombreDeUnidad = "metros";
    }
    historialUnit.text = {
        item: _producto,
        cliente: (ids.esInterno()||ids.esRegular())?$('#'+ids.CLIENTE_ID).find(":selected").text():document.getElementById("complete_name").value,
        marca:   (_producto=="Canteo")?'(ninguno)':$('#'+ids.MARCA_ID).find(":selected").text(),
        color:   (_producto=="Pegamento"||_producto=="Canteo")?'(ninguno)':$('#'+ids.COLOR_ID).find(":selected").text(),
        medida:  (_producto=="Pegamento"||_producto=="Tapatornillos"||_producto=="Canteo")?'(ninguno)':$('#'+ids.MEDIDA_ID).find(":selected").text()
    };
        

    if (["Tapacantos","Melamina","Fondo","Tapatornillos"].includes(item)) {
        historialUnit.color    = $('#'+ids.COLOR_ID).find(":selected").val();
        historialUnit.medida   = $('#'+ids.MEDIDA_ID).find(":selected").val();
        
        if (item == "Tapacantos") {
            historialUnit.metrosXRollo   = PRODUCTO.contenido.metrosxrollo;
            historialUnit.precioVentaMts = isMetrosAlCanteo(historialUnit.nombreDeUnidad)?PRODUCTO.contenido.precio_venta_metros_canteo:PRODUCTO.contenido.precio_venta_metros;
        }
    } else {
        historialUnit.color    = NONE;
        historialUnit.medida   = NONE;
        historialUnit.metrosXRollo   = NONE;
        historialUnit.precioVentaMts = NONE;
    }
}

let disableGuardarButton = function() {
    ENVIANDO = true;
    document.getElementById("anchorGuardar").innerHTML = "Enviando";
    document.getElementById("waiticon").style.display = "block";
}

let enableGuardarButton = function() {    
    ENVIANDO = false;
    document.getElementById("anchorGuardar").innerHTML = "Guardar";
    document.getElementById("waiticon").style.display = "none";
}

let GuardarPedidos = function() {
    let ids = new getIDS();

    if (ENVIANDO) {
        console.log("Enviando carrito de pedidos a DB");
        return false;
    }

    var table_carrito = document.getElementById(ids.CARRITO).getElementsByTagName('tbody')[0];
    MAX_REQUESTS = table_carrito.children.length;

    if (MAX_REQUESTS <= 0) {
        alert("Aun no tiene productos en el carrito, addicione por lo menos uno.");
        return false;
    }

    disableGuardarButton();
   
    for (let index = 0; index < MAX_REQUESTS; index++) {
        var Pedido = table_carrito.children[index].pedido;
        salvarPedidos(Pedido);
        //table_carrito.removeChild(index);
    }
}

let addicionarPedidoAlCarrito = function() {
    try {
        if (PRODUCTO && isUnidadMetros() &&  PRODUCTO.existencia <= 0 && PRODUCTO.metraje <= 0) {
            return;
        } else if (PRODUCTO && !isUnidadMetros() && PRODUCTO.existencia <= 0) {
            return;
        }

        cleanHistorial();
        setHistorial();
        addCarrito();
    } catch (error) {
        alert(error);
    }
}

let removerUltimoPedidoDelCarrito = function() {
    let ids = new getIDS();

    carritoReg--;

    var table = document.getElementById(ids.CARRITO);
    var rowCount = table.rows.length;
    if (rowCount == 1) {
        return;
    }
    table.deleteRow(rowCount - 1);
}

function DatosCliente(select) {
    let selectedValue = select.value;

    if (selectedValue.length == 0) {
        NotaVenta.direccion = "";
        NotaVenta.celular   = "";
        NotaVenta.email     = "";
        NotaVenta.empresa   = "";
        NotaVenta.ci        = "";
        NotaVenta.nit       = "";
    } else {
        NotaVenta.direccion = cliente[selectedValue].direccion;
        NotaVenta.celular   = cliente[selectedValue].celular;
        NotaVenta.email     = cliente[selectedValue].email;
        NotaVenta.empresa   = cliente[selectedValue].empresa;
        NotaVenta.ci        = cliente[selectedValue].ci;
        NotaVenta.nit       = cliente[selectedValue].nit;
    }
}

function updateNumToLiteral(numString) {
    var bigNumArry = new Array('', ' Mil', ' Millon', ' Billon', ' Trillon', ' Cuatrillon', ' Quintillon');
    var output = '';
    var finlOutPut = new Array();

    var numString = Number(numString).toString();

    if (numString == '0') {
        return 'Cero';
    }

    var i = numString.length;
    i = i - 1;

    //cut the number to grups of three digits and add them to the Arry
    while (numString.length > 3) {
        var triDig = new Array(3);
        triDig[2] = numString.charAt(numString.length - 1);
        triDig[1] = numString.charAt(numString.length - 2);
        triDig[0] = numString.charAt(numString.length - 3);

        var varToAdd = triDig[0] + triDig[1] + triDig[2];
        finlOutPut.push(varToAdd);
        i--;
        numString = numString.substring(0, numString.length - 3);
    }
    finlOutPut.push(numString);
    finlOutPut.reverse();

    //conver each grup of three digits to english word
    //if all digits are zero the triConvert
    //function return the string "dontAddBigSufix"
    for (j = 0; j < finlOutPut.length; j++) {
        finlOutPut[j] = centenalConvert(parseInt(finlOutPut[j]));
    }

    var bigScalCntr = 0; //this int mark the million billion trillion... Arry

    for (b = finlOutPut.length - 1; b >= 0; b--) {
        if (finlOutPut[b] != "dontAddBigSufix") {
            if (finlOutPut[b].trim() == 'Uno') {
                finlOutPut[b] = bigNumArry[bigScalCntr] + ' ';
            } else {
                finlOutPut[b] = finlOutPut[b] + bigNumArry[bigScalCntr] + ' ';
            }
            bigScalCntr++;
        }
        else {
            //replace the string at finlOP[b] from "dontAddBigSufix" to empty String.
            finlOutPut[b] = ' ';
            bigScalCntr++; //advance the counter  
        }
    }

        //convert The output Arry to , more printable string 
        for(n = 0; n<finlOutPut.length; n++){
            output +=finlOutPut[n];
        }

    return output;
}

function centenalConvert(num) {
    var ones = new Array('', ' Uno', ' Dos', ' Tres', ' Cuatro', ' Cinco', ' Seis', ' Siete', ' Ocho', ' Nueve', ' Diez', ' Once', ' Doce', ' Trece', ' Catorce', ' Quince', ' Diesiseis', ' Diesisiete', ' Diesiocho', ' Diesinueve');
    var tens = new Array('', '', ' Veinte', ' Treinta', ' Cuarenta', ' Cincuenta', ' Sesenta', ' Setenta', ' Ochenta', ' Noventa');

    var hundred = ' cientos';
    var output = '';
    var numString = num.toString();

    if (num == 0) {
        return 'dontAddBigSufix';
    }

    //1 to 19
    if (num < 20) {
        output = ones[num];
        return output;
    }

    //100 and more
    if (numString.length == 3) {
        if (numString.charAt(0) == '1') {
            if (Number(numString) == 100) {
                output = ' Cien';    
            } else {
                output = ' Ciento';
            }
        } else {
            output = ones[parseInt(numString.charAt(0))] + hundred;
        }
        var checkdecimal = parseInt(numString.charAt(1) + numString.charAt(2));
        if (checkdecimal >= 10 && checkdecimal < 20) {
            output += ones[checkdecimal];
        } else {
            output += tens[parseInt(numString.charAt(1))];
            if (parseInt(numString.charAt(2)) > 0) {
                output += ' y ';
                output += ones[parseInt(numString.charAt(2))];
            }
        }

        return output;
    }

    //20 to 99
    output += tens[parseInt(numString.charAt(0))];
    if (parseInt(numString.charAt(2)) > 0) {
        output += ' y ';
        output += ones[parseInt(numString.charAt(1))];
    }

    return output;
}

function PrePrint() {
    let ids = new getIDS();

    NotaVenta.NumeroPedido  = $('#pedido').text();
    if (ids.esInterno() || ids.esRegular()) {
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
    NotaVenta.Medida        = $('#'+ids.MEDIDA_ID).find(":selected").text();
    NotaVenta.Marca         = $('#'+ids.MARCA_ID).find(":selected").text();
    NotaVenta.Color         = $('#'+ids.COLOR_ID).find(":selected").text();
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

function getAllItemsToString(list) {
    var cadena = "";
    var length = Object.keys(list).length;

    Object.keys(list).forEach((item, index)=> {
        if (index + 2 == length) {
            cadena += item + ' y ';
        } else if (index + 1 == length) {
            cadena += item;
        } else {
            cadena += item + ', ';
        }
    });

    return cadena;
}

function PrePrintCarrito() {
    let ids = new getIDS();

    NotaVenta.NumeroPedido  = $('#pedido').text();
    if (ids.esInterno() || ids.esRegular()) {
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
    var datenow=$('#'+ids.TIME_ID).val();
    var [fecha,hora] = datenow.split(" ");
    $('#timestamp-print').text(fecha);
    $('#timestamp-print-2').text(hora);
    $('#cliente-print').text(NotaVenta.NombreCliente);
    $('#direccion-print').text(NotaVenta.direccion);
    $('#celular-print').text(NotaVenta.celular);
    $('#email-print').text(NotaVenta.email);
    $('#ci-print').text(NotaVenta.ci);
    $('#numero-venta').text("Nº 0000" + $('#pedido').text());
    $('#recibo-numero-venta').text("Nº 0000" + $('#pedido').text());

    var TotalPrecio = 0;
    var pedidoNum = 1;
    var list_items = [];
    //get table from NOTE invoice
    var pedido_nota = document.getElementById('pedido-body').getElementsByTagName('tbody')[0];
    //get table from Carito
    var table_carrito = document.getElementById(ids.CARRITO).getElementsByTagName('tbody')[0];

    for (let i = 0; i < table_carrito.children.length; i++) {
        carrito = table_carrito.children[i].pedido;
        var newRow = pedido_nota.insertRow();

        var newCell = newRow.insertCell();
        newCell.style.width = "30px";
        newCell.style.borderLeft ="1px solid";
        newCell.style.borderRight ="1px solid";
        newCell.appendChild(document.createTextNode(pedidoNum++));
        newCell = newRow.insertCell();
        newCell.style.width = "100px";
        newCell.appendChild(document.createTextNode(carrito.text.item));
        list_items[carrito.text.item]++;
        newCell = newRow.insertCell();
        newCell.style.width = "100px";
        newCell.appendChild(document.createTextNode(carrito.text.medida));
        newCell = newRow.insertCell();
        newCell.style.width = "100px";
        newCell.appendChild(document.createTextNode(carrito.text.color));
        newCell = newRow.insertCell();
        newCell.style.width = "100px";
        newCell.appendChild(document.createTextNode(carrito.text.marca));
        newCell = newRow.insertCell();
        newCell.style.width = "70px";
        newCell.style.borderLeft ="1px solid";
        newCell.appendChild(document.createTextNode(carrito.nombreDeUnidad));
        newCell = newRow.insertCell();
        newCell.style.width = "70px";
        newCell.className = "num";
        newCell.style.borderLeft ="1px solid";
        newCell.appendChild(document.createTextNode(carrito.cantidad));
        newCell = newRow.insertCell();
        newCell.style.width = "70px";
        newCell.className = "num";
        newCell.style.borderLeft ="1px solid";
        newCell.appendChild(document.createTextNode(carrito.pu));
        newCell = newRow.insertCell();
        newCell.style.width = "100px";
        newCell.className = "num";
        newCell.style.borderLeft ="1px solid";
        newCell.style.borderRight ="1px solid";
        newCell.appendChild(document.createTextNode(carrito.precioVenta));
        TotalPrecio = TotalPrecio + Number(carrito.precioVenta);
    }
    var newRow = pedido_nota.insertRow();
    var newCell = newRow.insertCell();
    newCell.style.width = "30px";
    newCell.style.borderTop ="1px solid";
    newCell = newRow.insertCell();
    newCell.style.width = "100px";
    newCell.style.borderTop ="1px solid";
    newCell = newRow.insertCell();
    newCell.style.width = "100px";
    newCell.style.borderTop ="1px solid";
    newCell = newRow.insertCell();
    newCell.style.width = "100px";
    newCell.style.borderTop ="1px solid";
    newCell = newRow.insertCell();
    newCell.style.width = "100px";
    newCell.style.borderTop ="1px solid";
    newCell = newRow.insertCell();
    newCell.style.width = "70px";
    newCell.style.borderTop ="1px solid";
    newCell = newRow.insertCell();
    newCell.style.width = "70px";
    newCell.style.borderTop ="1px solid";
    newCell = newRow.insertCell();
    newCell.style.width = "70px";
    newCell.style.borderTop ="1px solid";
    newCell.style.fontWeight = "Bold";
    newCell.className = "num";
    newCell.appendChild(document.createTextNode("TOTAL Bs: "));
    newCell = newRow.insertCell();
    newCell.style.width = "100px";
    newCell.style.fontWeight = "Bold";
    newCell.className = "num";
    newCell.style.border ="1px solid";
    newCell.appendChild(document.createTextNode(TotalPrecio));

    $('#recibo-total').text(TotalPrecio);
    $('#recibo-cliente').text(NotaVenta.NombreCliente);
    $('#recibo-monto').text(updateNumToLiteral(TotalPrecio));
    $('#recibo-detalle').text(getAllItemsToString(list_items));
    $('#recibo-fecha').text(fechaLiteral());
    $('#recibo-cliente-firma').text(NotaVenta.NombreCliente);
}

function cleanNotaTable() {
    let table = document.getElementById('pedido-body');
    for (let index = table.rows.length-1; index > 0; index--) {
        table.deleteRow(index);    
    }
}

async function Print(formTarget) {
    var printData = document.getElementById(formTarget);

    newWindow = window.open("PEDIDO", "melaminapro", "melamina");
    newWindow.document.write(printData.outerHTML);

    await new Promise(r => setTimeout(r, 1500));

    newWindow.print();
    newWindow.close();
}

function toprint() {
    var response = confirm("Desea Imprimir?");

    if (response) {
        cleanNotaTable();
        PrePrintCarrito();
        Print("InternoForm");
    }

    return false;
}

function toPrintHistory() {
    var response = confirm("Desea Imprimir Historial?");

    if (response) {
        document.getElementById("history-head").style.color = "black";
        document.getElementById("history-head").style.backgroundColor = "white";
        document.getElementById("history-body").style.color = "black";
        Print("historial_pedidos");
        document.getElementById("history-head").style.color = "white";
        document.getElementById("history-head").style.backgroundColor = "#32998b";
        document.getElementById("history-body").style.color = "white";
    }

    return false;
}


function setPrice(monto) {
    let ids = new getIDS();
    document.getElementById(ids.PRECIO_ID).value = monto;
    this.event.stopPropagation();
}

function cerrarGloboMensaje() {
    let ids = new getIDS();
    document.getElementById(ids.PRECIO_MENSAJE).style.position = "fixed";
    document.getElementById(ids.PRECIO_MENSAJE).innerHTML = "";
}

function obtenerPrecioStandard() {
    let ids = new getIDS();

    let claanUnidad = $('#' + ids.UNIDAD_ID).find(":selected").val();

    let queryPrecio = {
        item:     $('#' + ids.ITEM_ID).find(":selected").text(),//to look at collection 
        color:    $('#' + ids.COLOR_ID).find(":selected").val(),
        medida:   $('#' + ids.MEDIDA_ID).find(":selected").val(),
        marca:    $('#' + ids.MARCA_ID).find(":selected").val(),
        cantidad: $('#' + ids.CANTIDAD_ID).val(),
        unidad:   isMetrosAlCanteo(claanUnidad)?'metros':claanUnidad,
        canteo:   isMetrosAlCanteo(claanUnidad)?true:false,
        tipo_cliente: (ids.esInterno())?'interno':'externo',
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
            document.getElementById(ids.PRECIO_MENSAJE).textContent = "";
            response.precio.forEach((price) => {
                if (price.error) {
                    mensaje = "<p style='color:red;'>" + price.error + "</p>";
                } else {
                    mensaje = "<button type='button' class='button-globo' onclick='setPrice(" + price.precio + ")'>"
                        + "<strong>Provedor: </strong>" + price.provedor + '\n' 
                        + "<strong>Calculo: </strong>" + price.explicacion + '\n'
                        + "<strong>Precio: " + price.precio + ' Bs</strong>\n'
                        + "<strong>rebaja unitaria: </strong>" + price.rebaja + ' Bs\n'
                        + "</button>";
                }
                document.getElementById(ids.PRECIO_MENSAJE).style.position = "absolute";
                document.getElementById(ids.PRECIO_MENSAJE).innerHTML += mensaje;
                document.getElementById(ids.PRECIO_ID).value = price.precio;
            });
        } else {
            document.getElementById(ids.PRECIO_MENSAJE).style.position = "absolute";
            document.getElementById(ids.PRECIO_MENSAJE).style.color = "red";
            document.getElementById(ids.PRECIO_MENSAJE).textContent = response.message;
        }
    })
    .catch(error => {
        alert("Error:" + error.message);
        console.log(error.message);
    });

    return false;
}

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

let cleanMarca = function(ids) {
    document.getElementById(ids.DIVMARCA).style.display = "none";
    document.getElementById(ids.MARCA_ID).value = "";
}

let fillPropiedad = function(selectedItem, nombrePropiedad, item_propiedad) {
    selected = cleanOptionsFrom(nombrePropiedad);
    addOption(selected, "", "(Elija " + nombrePropiedad + ")");
    for (var i = 0; i < item_propiedad.length; i++) {
        var propiedad = item_propiedad[i];
        if (propiedad[selectedItem] == true) {
            addOption(selected, items[propiedad.nombre]._id.toString(), propiedad.nombre, propiedad["codigo"] ? propiedad["codigo"] : false);
        }
    }
}

let getIDS = function() {
    this.INGRESO_ID  = "pedido";
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
    this.DIVMARCA    = "divmarca";
    this.CARRITO     = "carrito_interno";
    this.PRECIO_MENSAJE  = "precio-globo-mensajes";
    this.PRODUCT_MENSAJE = "product_message";
    this.CLIENTE_TIPO    = "interno";
    this.tipo_cliente    = 0;

    if (document.getElementById("form-total-p-1").style.display === "block") {
        this.INGRESO_ID  = "pedido";
        this.CLIENTE_ID  = "cliente_ex"
        this.ITEM_ID     = "item_ex";
        this.COLOR_ID    = "color_ex";
        this.MEDIDA_ID   = "medida_ex";
        this.MARCA_ID    = "marca_ex";
        this.CANTIDAD_ID = "cantidad_ex";
        this.UNIDAD_ID   = "unidad_ex";
        this.PRECIO_ID   = "precio_ex";
        this.TIME_ID     = "timestamp2";
        this.DIVMEDIDA   = "divmedida_ex";
        this.DIVCOLOR    = "divcolor_ex";
        this.DIVMARCA    = "divmarca_ex";
        this.CARRITO     = "carrito_externo";
        this.PRECIO_MENSAJE  = "precio-globo-mensajes_ex";
        this.PRODUCT_MENSAJE = "product_message_ex";
        this.CLIENTE_TIPO    = "externo";
        this.tipo_cliente    = 1;
    } else if (document.getElementById("form-total-p-2").style.display === "block") {
        this.INGRESO_ID = "pedido";
        this.CLIENTE_ID = "cliente_re";
        this.ITEM_ID    = "item_re";
        this.COLOR_ID   = "color_re";
        this.MEDIDA_ID  = "medida_re";
        this.MARCA_ID   = "marca_re";
        this.CANTIDAD_ID = "cantidad_re";
        this.UNIDAD_ID   = "unidad_re";
        this.PRECIO_ID   = "precio_re";
        this.TIME_ID     = "timestamp3";
        this.DIVMEDIDA   = "divmedida_re";
        this.DIVCOLOR    = "divcolor_re";
        this.DIVMARCA    = "divmarca_re";
        this.CARRITO     = "carrito_regular";
        this.PRECIO_MENSAJE  = "precio-globo-mensajes_re";
        this.PRODUCT_MENSAJE = "product_message_re";
        this.CLIENTE_TIPO    = "regular";
        this.tipo_cliente    = 2;
    }

    this.esInterno = function() {
        return this.tipo_cliente === 0;
    }

    this.esExterno = function() {
        return this.tipo_cliente === 1;
    }

    this.esRegular = function() {
        return this.tipo_cliente === 2;
    }
}

let selectItem = function(selected) {
    let ids = new getIDS();

    _CLIENTE[ids.CLIENTE_TIPO].clean();
    let selectedItem = selected.options[selected.selectedIndex].text.toLowerCase();
    _CLIENTE[ids.CLIENTE_TIPO].setTipo(selectedItem);

    PRODUCTO = fetchProducto(_CLIENTE[ids.CLIENTE_TIPO]);
    document.getElementById(ids.PRODUCT_MENSAJE).innerHTML = "__________________________________________";

    if (selectedItem == "pegamento") {
        cleanColor(ids);
        cleanMedida(ids);
        fillPropiedad(selectedItem, ids.MARCA_ID, item_marca);
    } else if (selectedItem == "tapatornillos") {
        cleanMedida(ids);
        fillPropiedad(selectedItem, ids.COLOR_ID, item_color);
        fillPropiedad(selectedItem, ids.MARCA_ID, item_marca);
    } else if (selectedItem == "canteo") {
        cleanColor(ids);
        cleanMedida(ids);
        cleanMarca(ids);
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

function _KEY() {
    this.tipo_producto = '';
    this.item   = '';
    this.color  = '';
    this.medida = '';
    this.marca  = '';

    this.AllFilled = () => {
        if (this.tipo_producto === "pegamento") {
            return this.item.length > 0
            && this.marca.length > 0;
        } else if (this.tipo_producto === "tapatornillos") {
            return this.item.length > 0
            && this.color.length > 0
            && this.marca.length > 0;
        }
        return this.item.length > 0 
        && this.color.length > 0 
        && this.medida.length > 0 
        && this.marca.length > 0;
    };
    this.clean = () => {
        this.item   = '';
        this.color  = '';
        this.medida = '';
        this.marca  = '';
    };
    this.setTipo = (tipo) => {
        this.tipo_producto = tipo;
    }
    this.getUnidad = () => {
        if (this.item && items[this.item]) {
            return items[this.item].unidad;
        }

        return "items";
    };
};
var _CLIENTE = {
    interno: new _KEY(),
    externo: new _KEY(),
    regular: new _KEY(),
};
var PRODUCTO;

$(".verify").on("change", function() {
    let ids = new getIDS();

    var propiedad = $("option:selected", this).prevObject[0].name;
    _CLIENTE[ids.CLIENTE_TIPO][propiedad] = this.value;
    PRODUCTO = fetchProducto(_CLIENTE[ids.CLIENTE_TIPO]);

    if (PRODUCTO) {
        let Metraje = '.';
        if (PRODUCTO.metraje >= -1) {
            Metraje = " y " + PRODUCTO.metraje + " Mt.";
        }
        if (PRODUCTO.existencia == 0) {
            document.getElementById(ids.PRODUCT_MENSAJE).style.background = "red";
            document.getElementById(ids.PRODUCT_MENSAJE).style.color = "#55e8d5";
            if (PRODUCTO.contenido.apedido) {
                document.getElementById(ids.PRODUCT_MENSAJE).innerHTML = "El producto es a PEDIDO. Total actual es de " + PRODUCTO.existencia + " " + _CLIENTE[ids.CLIENTE_TIPO].getUnidad() + Metraje;
            } else {
                document.getElementById(ids.PRODUCT_MENSAJE).innerHTML = "El producto esta agotado, " + PRODUCTO.existencia + " " + _CLIENTE[ids.CLIENTE_TIPO].getUnidad() + Metraje;
            }
        } else {
            document.getElementById(ids.PRODUCT_MENSAJE).style.background = "transparent";
            document.getElementById(ids.PRODUCT_MENSAJE).style.color = "#55e8d5";
            document.getElementById(ids.PRODUCT_MENSAJE).innerHTML = "Este producto tiene " + PRODUCTO.existencia + " " + _CLIENTE[ids.CLIENTE_TIPO].getUnidad() + Metraje + " aun.";
        }
    } else {
        if (_CLIENTE[ids.CLIENTE_TIPO].AllFilled()) {
            document.getElementById(ids.PRODUCT_MENSAJE).style.background = "transparent";
            document.getElementById(ids.PRODUCT_MENSAJE).style.color = "red";
            document.getElementById(ids.PRODUCT_MENSAJE).innerHTML = "El presente producto no existe en el catalogo";
        }
    }
});

function setNumPedido() {
    let pedido;
    if (histo && histo.length > 0) {
        pedido = Number(histo[histo.length-1].numIngreso) + 1;
    } else {
        pedido = localStorage.getItem('NUM_PEDIDO');
        if (!pedido) {
            pedido = 1;
        }
    }
    document.getElementById('pedido').innerText = pedido;
}

$(function() {
    setNumPedido();

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
