let NotaVenta = function() {
    var NumeroPedido;
    var NombreCliente;
    var Item;
    var Medida;
    var Grosor;
    var Color;
    var Cantidad;
    var Fecha;
}

function PrePrint() {
    NotaVenta.NumeroPedido=$('#pedido').text();
    NotaVenta.NombreCliente=$('[name="operario"]').find(":selected").text();
    NotaVenta.Item=$('[name="item"]').find(":selected").text();
    NotaVenta.Medida=$('[name="medida"]').find(":selected").text();
    NotaVenta.Grosor=$('[name="grosor"]').find(":selected").text();
    NotaVenta.Color=$('[name="color"]').find(":selected").text();
    NotaVenta.Fecha=$('#timestamp1').val();

    $('#name-print').text(NotaVenta.NombreCliente);
    $('#pedido-print').text($('#pedido-print').text() + NotaVenta.NumeroPedido);
    $('#item-print').text(NotaVenta.Item);
    $('#medida-print').text(NotaVenta.Medida);
    $('#grosor-print').text(NotaVenta.Grosor);
    $('#color-print').text(NotaVenta.Color);
    $('#timestamp-print').text(NotaVenta.Fecha);
}

function Print(formTarget) {
    PrePrint();

    var printData = document.getElementById(formTarget);
    newWindow = window.open("");
    newWindow.document.write(printData.outerHTML);
    newWindow.print();
    newWindow.close();
}

function toprint() {
    var response = confirm("Desea Imprimir?");

    if (response) {
        Print("InternoForm");
    }

    return false;
}

$(function() {
    $("#form-total").steps({
        headerTag: "h2",
        bodyTag: "section",
        transitionEffect: "fade",
        enableAllSteps: true,
        autoFocus: true,
        transitionEffectSpeed: 500,
        titleTemplate : '<div class="title">#title#</div>',
        labels: {
            previous : 'Confirm',
            next : 'Confirm',
            finish : 'Confirm',
            current : 'Print'
        },
        onStepChanging: function (event, currentIndex, newIndex) { 

            return true;
        }
    });

    var inputTimestamp1 = document.getElementById('timestamp1');
    var inputTimestamp2 = document.getElementById('timestamp2');
    var inputTimestamp3 = document.getElementById('timestamp3');

    function time() {
        var d = new Date();
        var s = d.getSeconds();
        var m = d.getMinutes();
        var h = d.getHours();
        var today = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();

        inputTimestamp1.value = today + " " + ("0" + h).substr(-2) + ":" + ("0" + m).substr(-2) + ":" + ("0" + s).substr(-2);
        inputTimestamp2.value = inputTimestamp1.value;
        inputTimestamp3.value = inputTimestamp1.value;
    }

    setInterval(time, 1000);

});
