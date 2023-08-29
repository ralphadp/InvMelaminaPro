var express = require('express');
var router = express.Router();

router.post('/reporte_pedidos_cliente_interno_mes', function(req, res) {
    var DB = req.app.settings.DB;

    var SelectedMonth = '/' + req.body.mes + '/2023';
    console.log("mes: ", SelectedMonth);
    DB.collection("collectionCliente").find({
        "tipo": "interno"
      }).toArray().then(resultCliente => {
            DB.collection("historial").find({
                "fecha": { $regex: SelectedMonth },
                "tipo_entrada": "pedido"
            }).toArray().then(resultHistorial => {
                let reporte = [];
                let index = 0;

                resultCliente.forEach((row) => {
                    let DATA = {cliente:"", Volume:0};
                    DATA.cliente = row.nombre;
                    resultHistorial.forEach((historia) => {
                        if (historia.cliente == row.nombre) {
                            DATA.Volume++;
                        }
                    });
                    reporte[index++] = DATA;
                });
                console.log(reporte);
                res.status(200).json({ok: true, message: "Encontrados", chartData: reporte, action: "none"});
                res.end();
            })
            .catch(error => console.error(error))
    })
    .catch(error => console.error(error))               
});

router.post('/reporte_producto_pedido_mes', function(req, res) {
    var DB = req.app.settings.DB;

    var SelectedMonth = '/' + req.body.mes + '/2023';
    console.log("mes: ", SelectedMonth);

    DB.collection("item").find().toArray().then(resultItem => {
            DB.collection("historial").find({
                "fecha": { $regex: SelectedMonth },
                "tipo_entrada": "pedido"
            }).toArray().then(resultHistorial => {
                let reporte = [];
                let index = 0;

                resultItem.forEach((row) => {
                    let DATA = {cliente:"", Volume:0};
                    DATA.cliente = row.nombre;
                    resultHistorial.forEach((historia) => {
                        if (historia.item == row.nombre) {
                            DATA.Volume++;
                        }
                    });
                    reporte[index++] = DATA;
                });
                console.log(reporte);
                res.status(200).json({ok: true, message: "Encontrados", chartData: reporte, action: "none"});
                res.end();
            })
            .catch(error => console.error(error))
    })
    .catch(error => console.error(error))               
});

router.post('/reporte_consumo_cliente', function(req, res) {
    var DB = req.app.settings.DB;

    DB.collection("collectionCliente").find({tipo:"interno"}).toArray().then(resultCliente => {
        var filtro = [];
        resultCliente.forEach((cliente, index)=> {
            filtro[index] = { "cliente" : cliente.nombre };
        });
        var clientesInternos = { "$or": filtro };
        DB.collection("historial").find(clientesInternos).toArray().then(resultHistorial => {
            let reporte = [];

            resultCliente.forEach((row, index) => {
                let DATA = {cliente:"", Volume:0};
                DATA.cliente = row.nombre;
                resultHistorial.forEach((historia) => {
                    if (historia.cliente == row.nombre) {
                        DATA.Volume = DATA.Volume + Number(historia.precioVenta);
                    }
                });
                reporte[index] = DATA;
            });
            console.log(reporte);
            res.status(200).json({ok: true, message: "Encontrados", chartData: reporte, action: "none"});
            res.end();
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
});

router.post('/reporte_provedor_producto', function(req, res) {
    var DB = req.app.settings.DB;


    DB.collection("collectionprovedor").find().toArray().then(resultProvedor => {
        var filtro = [];
        resultProvedor.forEach((provedor, index)=> {
            filtro[index] = { "cliente" : provedor.nombre };
        });
        var todosLosProvedores = { "$or": filtro };
        DB.collection("historial").find(todosLosProvedores).toArray().then(resultHistorial => {
            let reporte = [];

            resultProvedor.forEach((provedor, index) => {
                let DATA = {cliente:"", Volume:0};
                DATA.cliente = provedor.nombre;
                resultHistorial.forEach((historia) => {
                    if (historia.cliente == provedor.nombre) {
                        DATA.Volume = DATA.Volume + Number(historia.precioCompra);
                    }
                });
                reporte[index] = DATA;
            });
            console.log(reporte);
            res.status(200).json({ok: true, message: "Encontrados", chartData: reporte, action: "none"});
            res.end();
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
});

router.post('/reporte_venta_producto_dia', function(req, res) {
    var DB = req.app.settings.DB;

    console.log("Getting from "+req.body.day);
    DB.collection("item").find().toArray().then(resultItem => {
        var productos = [
            "Melamina_laminas",
            "Melamina_paquetes",
            "Tapacantos_rollos",
            "Tapacantos_cajas",
            "Tapacantos_metros",
            "Pegamento_bolsas",
            "Fondo_laminas",
            "Fondo_paquetes",
        ];

        DB.collection("historial").find({
            "fecha": {$regex : req.body.day},
            "tipo_entrada": "pedido"
        }).toArray().then(resultHistorial => {
            let reporte = [];

            productos.forEach((producto, index) => {
                let DATA = {cliente:"", Volume:0};
                DATA.cliente = producto;
                resultHistorial.forEach((historia) => {
                    let [ITEM, UNIDAD] = producto.split("_");
                    console.log(ITEM, UNIDAD);
                    console.log(historia.item,historia.nombreDeUnidad, historia.cantidad);
                    if (historia.item == ITEM && historia.nombreDeUnidad == UNIDAD) {
                        DATA.Volume = DATA.Volume + Number(historia.cantidad);
                    }
                });
                reporte[index] = DATA;
            });
            console.log(reporte);
            res.status(200).json({ok: true, message: "Encontrados", chartData: reporte, action: "none"});
            res.end();
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
});

router.post('/reporte_venta_compra_dia', function(req, res) {
    var DB = req.app.settings.DB;

    console.log("Getting from " + req.body.day);
    DB.collection("item").find().toArray().then(resultItem => {
        var productos = [];
        resultItem.forEach((item, index)=> {
            productos[index] = item.nombre;
        });

        DB.collection("historial").find({
            "fecha": {$regex : req.body.day}
        }).toArray().then(resultHistorial => {
            let reporte = [];

            productos.forEach((producto, index) => {
                let DATA = {item:"", venta:0, compra:0};
                DATA.item = producto;
                resultHistorial.forEach((historia) => {
                    if (historia.item == producto) {
                        if (historia.tipo_entrada == "pedido") {
                            DATA.venta = DATA.venta + Number(historia.precioVenta);
                        } else if (historia.tipo_entrada == "ingreso") {
                            DATA.compra = DATA.compra + Number(historia.precioCompra);
                        } else {
                            console.log("Tipo de entrada desconocida: '" + historia.tipo_entrada +"'");
                        }
                    }
                });
                reporte[index] = DATA;
            });
            console.log(reporte);
            res.status(200).json({ok: true, message: "Encontrados", chartData: reporte, action: "none"});
            res.end();
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
});

/*router.post('/reporte_compra_venta_colores_mes', function(req, res) {
    var DB = req.app.settings.DB;

    var SelectedMonth = '/' + req.body.mes + '/' + (new Date()).getFullYear();
    console.log("selected mes: ", SelectedMonth);

    let productos = {
        "Melamina":["laminas","paquetes"],
        "Tapacantos":["rollos","cajas","metros"],
        "Fondo":["laminas","paquetes"],
        "Pegamento":["bolsas"],
        "Tapatornillos":["hojas","cajas"]
    };

    DB.collection("historial").find({
        "fecha": { $regex: SelectedMonth }
    }).toArray().then(resultHistorial => {
        let reporte = [];
        let index = 0;

        Object.keys(productos).forEach(product => {

            productos[product].forEach((tipoProducto) => {
                let DATA = {
                    producto: product,
                    blanco: {tipo:tipoProducto, cantidadItemsVenta:0, cantidadItemsCompra:0, venta:0, compra:0}, 
                    colores: {tipo:tipoProducto, cantidadItemsVenta:0, cantidadItemsCompra:0, venta:0, compra:0}
                };
                //DATA.producto = product;
                resultHistorial.forEach((historia) => {

                    if (historia.item == product && historia.nombreDeUnidad == tipoProducto) {
                        console.log(historia.item, historia.nombreDeUnidad, historia.color);
                        if (historia.color == "Blanco") {
                            DATA.blanco.tipo = historia.nombreDeUnidad;
                            if (historia.tipo_entrada == "pedido") {
                                DATA.blanco.cantidadItemsVenta += Number(historia.cantidad);
                                DATA.blanco.venta += Number(historia.precioVenta);
                            } else if (historia.tipo_entrada == "ingreso") {
                                DATA.blanco.cantidadItemsCompra += Number(historia.cantidad);
                                DATA.blanco.compra += Number(historia.precioCompra);
                            } else {
                                console.log("Tipo de entrada desconocida: '" + historia.tipo_entrada +"'");
                            }
                        } else {
                            DATA.colores.tipo = historia.nombreDeUnidad;
                            if (historia.tipo_entrada == "pedido") { 
                                DATA.colores.cantidadItemsVenta += Number(historia.cantidad);
                                DATA.colores.venta += Number(historia.precioVenta);
                            } else if (historia.tipo_entrada == "ingreso") {
                                DATA.colores.cantidadItemsCompra += Number(historia.cantidad);
                                DATA.colores.compra += Number(historia.precioCompra);
                            } else {
                                console.log("Tipo de entrada desconocida: '" + historia.tipo_entrada +"'");
                            }
                        }
                    }
                });
                console.log(index, reporte[index]);
                reporte[index++] = DATA;
            });
        });
        console.log(reporte);
        res.status(200).json({ok: true, message: "Encontrados", chartData: reporte, action: "none"});
        res.end();
    })
    .catch(error => console.error(error))
});*/

router.post('/reporte_compra_venta_mes_por_cliente', function(req, res) {
    var DB = req.app.settings.DB;
    var filter;

    var SelectedCliente = req.body.cliente;
    var SelectedMonth = '/' + req.body.mes + '/' + (new Date()).getFullYear();
    console.log("selected: mes: ", SelectedMonth, " cliente:", SelectedCliente);

    let productos = {
        "Melamina":["laminas","paquetes"],
        "Tapacantos":["rollos","cajas","metros"],
        "Fondo":["laminas","paquetes"],
        "Pegamento":["bolsas"],
        "Tapatornillos":["hojas","cajas"]
    };

    if (SelectedCliente == "All") {
        filter = {
            "fecha": { $regex: SelectedMonth }
        }
    } else {
        filter = {
            "fecha": { $regex: SelectedMonth },
            "cliente": SelectedCliente
        }
    }

    DB.collection("historial").find(filter).toArray().then(resultHistorial => {
        let reporte = [];
        let index = 0;

        Object.keys(productos).forEach(product => {

            productos[product].forEach((tipoProducto) => {
                let DATA = {
                    producto: product,
                    blanco: {tipo:tipoProducto, cantidadItemsVenta:0, cantidadItemsCompra:0, venta:0, compra:0}, 
                    colores: {tipo:tipoProducto, cantidadItemsVenta:0, cantidadItemsCompra:0, venta:0, compra:0}
                };
                //DATA.producto = product;
                resultHistorial.forEach((historia) => {

                    if (historia.item == product && historia.nombreDeUnidad == tipoProducto) {
                        console.log(historia.item, historia.nombreDeUnidad, historia.color);
                        if (historia.color == "Blanco") {
                            DATA.blanco.tipo = historia.nombreDeUnidad;
                            if (historia.tipo_entrada == "pedido") {
                                DATA.blanco.cantidadItemsVenta += Number(historia.cantidad);
                                DATA.blanco.venta += Number(historia.precioVenta);
                            } else if (historia.tipo_entrada == "ingreso") {
                                DATA.blanco.cantidadItemsCompra += Number(historia.cantidad);
                                DATA.blanco.compra += Number(historia.precioCompra);
                            } else {
                                console.log("Tipo de entrada desconocida: '" + historia.tipo_entrada +"'");
                            }
                        } else {
                            DATA.colores.tipo = historia.nombreDeUnidad;
                            if (historia.tipo_entrada == "pedido") { 
                                DATA.colores.cantidadItemsVenta += Number(historia.cantidad);
                                DATA.colores.venta += Number(historia.precioVenta);
                            } else if (historia.tipo_entrada == "ingreso") {
                                DATA.colores.cantidadItemsCompra += Number(historia.cantidad);
                                DATA.colores.compra += Number(historia.precioCompra);
                            } else {
                                console.log("Tipo de entrada desconocida: '" + historia.tipo_entrada +"'");
                            }
                        }
                    }
                });
                console.log(index, reporte[index]);
                reporte[index++] = DATA;
            });
        });
        console.log(reporte);
        res.status(200).json({ok: true, message: "Encontrados", chartData: reporte, action: "none"});
        res.end();
    })
    .catch(error => console.error(error))
});


module.exports = router;
