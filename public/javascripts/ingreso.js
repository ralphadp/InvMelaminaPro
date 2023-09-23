let ENVIANDO = false;
let historialUnit = {
    fecha          : "",
    numIngreso     : "",
    item           : "",
    cliente        : "",
    nombreDeUnidad : "",
    embalaje       : "",
    precioCompra   : "",
    precioVenta    : "",
    color          : "",
    medida         : "",
    cantidad       : "",
    metrosXRollo   : "",
    precioVentaMts : "",
    tipo_entrada   : "ingreso"
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

let GuardarIngreso = function() {

    if (ENVIANDO) {
        console.log("Enviando ingreso a DB");
        return false;
    }

    disableGuardarButton();

    let NONE = "(ninguno)";
    historialUnit.fecha          = document.getElementById('timestamp1').value;
    historialUnit.numIngreso     = $('#ingreso').val();
    historialUnit.item           = $('[name="item"]').find(":selected").val();
    historialUnit.itemName       = $('[name="item"]').find(":selected").text();

    let item = historialUnit.itemName;
    historialUnit.cliente        = $('[name="provedor"]').find(":selected").val();
    historialUnit.nombreDeUnidad = $('#unidad').find(":selected").text();
    historialUnit.embalaje       = (item == "Pegamento") ? "Bolsa" : ((item == "Tapacanto" ? "Caja" : ((item == "Melamina" ? "Paquete" : "Paquete"))));;
    historialUnit.precioCompra   = Number($('#precio').val());
    historialUnit.precioVenta    = "";
    historialUnit.cantidad       = Number($('#cantidad').val());
    historialUnit.marca          = $('#marca').find(":selected").val();

    historialUnit.text = {
        item: $('[name="item"]').find(":selected").text(),
        cliente: $('[name="provedor"]').find(":selected").text(),
        marca:  $('#marca').find(":selected").text(),
        color: ($('[name="item"]').find(":selected").text()=="Pegamento")?'(ninguno)':$('#color').find(":selected").text(),
        medida: ($('[name="item"]').find(":selected").text()=="Pegamento")?'(ninguno)':$('#medida').find(":selected").text()
    };

    if (item != "Pegamento") {
        historialUnit.color    = $('#color').find(":selected").val();
        historialUnit.medida   = $('#medida').find(":selected").val();
        if (item == "Tapacanto") {
            historialUnit.metrosXRollo   = NONE;
            historialUnit.precioVentaMts = NONE;
        }
    } else {
        historialUnit.color          = NONE;
        historialUnit.medida         = NONE;
        historialUnit.metrosXRollo   = NONE;
        historialUnit.precioVentaMts = NONE;
    }

    addIngreso();
}

function setPrice(monto) {
    document.getElementById("precio").value = monto;
    this.event.stopPropagation();
}

function cerrarGloboMensaje() {
    var PRECIO_MENSAJE = "precio-globo-mensajes";
    document.getElementById(PRECIO_MENSAJE).style.position = "fixed";
    document.getElementById(PRECIO_MENSAJE).innerHTML = "";
}

function obtenerPrecioStandard() {
    let queryPrecio = {
        provedor: $('[name="provedor"]').find(":selected").val(),
        item:     $('[name="item"]').find(":selected").text(), //to look at collection 
        color:    $('#color').find(":selected").val(),
        medida:   $('#medida').find(":selected").val(),
        marca:    $('#marca').find(":selected").val(),
        cantidad: $('#cantidad').val(),
        unidad:   $('#unidad').find(":selected").val(),
        tipo_entrada: "ingreso"
    };

    fetch('/obtener_precio/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(queryPrecio)
    })
    .then(response => response.json())
    .then(response => {
        var PRECIO_MENSAJE = "precio-globo-mensajes";
        if (response.ok) {
            document.getElementById(PRECIO_MENSAJE).textContent = "";
            response.precio.forEach((price) => {
                if (price.error) {
                    mensaje = "<p style='color:red;'>" + price.error + "</p>";
                } else {
                    mensaje = "<button type='button' class='button-globo' onclick='setPrice(" + price.precio + ")'>"
                        + "<strong>Provedor:</strong>" + price.provedor + '\n' 
                        + "<strong>Calculo:</strong>" + price.explicacion + '\n'
                        + "<strong>Precio:</strong>" + price.precio + '\n';
                        + "</button>";
                }
                document.getElementById(PRECIO_MENSAJE).style.position = "absolute";
                document.getElementById(PRECIO_MENSAJE).innerHTML += mensaje;
                document.getElementById("precio").value = price.precio;
            });
        } else {
            document.getElementById(PRECIO_MENSAJE).style.position = "absolute";
            document.getElementById(PRECIO_MENSAJE).style.color = "red";
            document.getElementById(PRECIO_MENSAJE).textContent = response.message;
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
    for (var i = 0; i < item_unidades.length; i++) {
        var optionName = item_unidades[i];
        if (optionName == "metros" || optionName == "metros al canteo") {
            continue;
        }
        addOption(tipoUnidad, optionName, optionName);    
    }
}

let cleanMedida = function() {
    document.getElementById("divmedida").style.display = "none";
    document.getElementById("medida").value = "";
}

let cleanColor = function() {
    document.getElementById("divcolor").style.display = "none";
    document.getElementById("color").value = "";
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

let cleanProductMessage = function () {
    let PRODUCT_MESSAGE = document.getElementById("product_message");
    PRODUCT_MESSAGE.style.background = "transparent";
    PRODUCT_MESSAGE.style.color = "#55e8d5";
    PRODUCT_MESSAGE.innerHTML = "_________________________________";
}

let selectProvedor = function() {
    cleanProductMessage();
    KEY.clean();

    let selectedItem = document.getElementById("provedor").value;
    for (var i=0; i<provedor_items.length; i++) {
        var provedor = provedor_items[i];
        if (provedor._id.toString() == selectedItem) {
            let selected = cleanOptionsFrom("item");
            addOption(selected, "", "(Elija el item)");
            for (var j=0; j<provedor.items.length; j++) {
                var item_name = provedor.items[j]
                addOption(selected, items[item_name]._id.toString(), item_name);
            }
        }
    }
    document.getElementById('divmedida').style.display = "block";
    document.getElementById('divcolor').style.display = "block";

    document.getElementById("medida").selectedIndex = 0;
    document.getElementById("color").selectedIndex = 0;
    document.getElementById("marca").selectedIndex = 0;
    document.getElementById("unidad").selectedIndex = 0;
}

let selectItem = function(selected) {
    cleanProductMessage();
    KEY.cleanFew();

    let selectedItem = selected.options[selected.selectedIndex].text.toLowerCase();
    KEY.setTipo(selectedItem);

    if (selectedItem == "pegamento") {
        cleanColor();
        cleanMedida();
        fillPropiedad(selectedItem, "marca", item_marca);
    } else if (selectedItem == "tapatornillos") {
        cleanMedida();
        fillPropiedad(selectedItem, "color", item_color);
        fillPropiedad(selectedItem, "marca", item_marca);
    } else {
        document.getElementById('divmedida').style.display = "block";
        document.getElementById('divcolor').style.display = "block";

        fillPropiedad(selectedItem, "color", item_color);
        fillPropiedad(selectedItem, "medida", item_medida);
        fillPropiedad(selectedItem, "marca", item_marca);
    }
    fillUnidad("unidad", selectedItem); 
}

function addIngreso() {
    fetch('/addicionar_ingreso/', {
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
            enableGuardarButton();
            console.log(response.status, response.statusText);
            alert(response.message);
        }
    })
    .catch(error => {
        enableGuardarButton();
        alert("Error: " + error.message);
        console.log(error.message);
    });
};

function _KEY() {
    this.tipo_producto = '';
    this.item   ='';
    this.provedor ='';
    this.color  ='';
    this.medida ='';
    this.marca  ='';
    this.AllFilled = () => {
        if (this.tipo_producto === "pegamento") {
            return this.item.length > 0
            && this.provedor.length > 0
            && this.marca.length > 0;
        }else if (this.tipo_producto === "tapatornillos") {
            return this.item.length > 0
            && this.color.length > 0
            && this.provedor.length > 0
            && this.marca.length > 0;
        }
        return this.item.length > 0 
        && this.provedor.length > 0 
        && this.color.length > 0 
        && this.medida.length > 0 
        && this.marca.length > 0;
    };
    this.clean = () => {
        this.item   ='';
        this.provedor ='';
        this.color  ='';
        this.medida ='';
        this.marca  ='';
    };
    this.cleanFew = () => {
        this.item   ='';
        this.color  ='';
        this.medida ='';
        this.marca  ='';
    };
    this.setTipo = (tipo) => {
        this.tipo_producto = tipo;
    }
};
var KEY = new _KEY();
var PRODUCTO;

$(".verify").on("change", function() {

    var propiedad = $("option:selected", this).prevObject[0].name;
    KEY[propiedad] = this.value;
    PRODUCTO = fetchProducto(KEY);
    let PRODUCT_MESSAGE = document.getElementById("product_message");

    if (PRODUCTO) {
        if (PRODUCTO.existencia == 0) {
            PRODUCT_MESSAGE.style.background = "red";
            PRODUCT_MESSAGE.style.color = "#55e8d5";
            PRODUCT_MESSAGE.innerHTML = "El Producto no tiene items, " + PRODUCTO.existencia+ " items.";
        } else {
            PRODUCT_MESSAGE.style.background = "transparent";
            PRODUCT_MESSAGE.style.color = "#55e8d5";
            PRODUCT_MESSAGE.innerHTML = "Este Producto existe en el Catalogo.";
        }
    } else {
        if (KEY.AllFilled()) {
            PRODUCT_MESSAGE.style.background = "transparent";
            PRODUCT_MESSAGE.style.color = "red";
            PRODUCT_MESSAGE.innerHTML = "El presente producto no existe en el Catalogo";
        }
    }
});

async function Print(formTarget) {
    var printData = document.getElementById(formTarget);

    newWindow = window.open("INGRESO", "melaminapro", "melamina");
    newWindow.document.write(printData.outerHTML);

    await new Promise(r => setTimeout(r, 1500));

    newWindow.print();
    newWindow.close();
}

function toPrintHistory() {
    var response = confirm("Desea Imprimir Historial?");

    if (response) {
        document.getElementById("history-head").style.color = "black";
        document.getElementById("history-head").style.backgroundColor = "white";
        document.getElementById("history-body").style.color = "black";
        Print("historial_ingresos");
        document.getElementById("history-head").style.color = "white";
        document.getElementById("history-head").style.backgroundColor = "#32998b";
        document.getElementById("history-body").style.color = "white";
    }

    return false;
}

$(function() {
    function getTimestamp() {
        var d = new Date();
        var s = d.getSeconds();
        var m = d.getMinutes();
        var h = d.getHours();
        var today = ("0" + (d.getDate())).substr(-2) + "/" +  ("0" + (d.getMonth() + 1)).substr(-2) + "/" + d.getFullYear();
        var currentTime = ("0" + h).substr(-2) + ":" + ("0" + m).substr(-2) + ":" + ("0" + s).substr(-2);

        inputTimestamp1.value = today + " " + currentTime;
    }

    var inputTimestamp1 = document.getElementById('timestamp1');
    getTimestamp();

    function time() {
        getTimestamp();
    }

    setInterval(time, 1000);

});
