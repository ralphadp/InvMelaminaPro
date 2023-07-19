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

let GuardarIngreso = function() {

    let NONE = "(ninguno)";
    historialUnit.fecha          = document.getElementById('timestamp1').value;
    historialUnit.numIngreso     = $('#ingreso').val();
    historialUnit.item           = $('[name="item"]').find(":selected").text();

    let item = historialUnit.item;
    historialUnit.cliente        = $('[name="provedor"]').find(":selected").text();
    historialUnit.nombreDeUnidad = $('#unidad').find(":selected").text();
    historialUnit.embalaje       = (item == "Pegamento") ? "Bolsa" : ((item == "Tapacanto" ? "Caja" : ((item == "Melamina" ? "Paquete" : "Paquete"))));;
    historialUnit.precioCompra   = $('#precio').val();
    historialUnit.precioVenta    = "";
    historialUnit.cantidad       = $('#cantidad').val();
    historialUnit.marca          = $('#marca').find(":selected").text();

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

function obtenerPrecioStandard() {
    let queryPrecio = {
        provedor: $('[name="provedor"]').find(":selected").text(),
        item:     $('[name="item"]').find(":selected").text(),
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
        if (response.ok) {
            document.getElementById('precio').value = response.precio;
            document.getElementById("precio-mensaje").textContent = response.message;
        } else {
            document.getElementById("precio-mensaje").textContent = response.message;
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
        if (optionName=="metros") {
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
            addOption(selected, propiedad.nombre, propiedad.nombre, propiedad["codigo"] ? propiedad["codigo"] : false);
        }
    }
}

let selectProvedor = function() {
    let selectedItem = document.getElementById("provedor").value;
    for (var i=0; i<provedor_items.length; i++) {
        var provedor = provedor_items[i];
        if (provedor.nombre == selectedItem) {
            let selected = cleanOptionsFrom("item");
            addOption(selected, "", "(Elija el item)");
            for (var j=0; j<provedor.items.length; j++) {
                var item_name = provedor.items[j]
                addOption(selected, item_name, item_name);
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

let selectItem = function() {

    let selectedItem = document.getElementById("item").value.toLowerCase();

    if (selectedItem == "pegamento") {
        cleanColor();
        cleanMedida();
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
            console.log(response.status, response.statusText);
            alert(response.message);
        }
    })
    .catch(error => {
        alert("Error: " + error.message);
        console.log(error.message);
    });
};

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
