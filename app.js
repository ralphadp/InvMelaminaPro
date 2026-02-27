var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var MD5 = require("crypto-js/md5");
var session = require('express-session');
var util = require('./Util');
var SU = require('./SessionUsers');

var indexRouter = require('./routes/index');
var reportesRouter = require('./routes/reportes');
var preferenciasRouter = require('./routes/preferencias');

var app = express();
const dotenv = require('dotenv');
dotenv.config();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('USUARIOS', SU.USUARIOS);

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({ resave: true, secret: '123456', /*cookie: { maxAge: oneDay },*/ saveUninitialized: true}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/reports', reportesRouter);
app.use('/preferences', preferenciasRouter);

//verify the user auth 
function checkAuth(req, res, next) {
    SU.verifyAuthentication(req, res, next);
}

// pedidos page
app.get('/pedidos', checkAuth, function(req, res) {
    var DB = req.app.settings.DB;
    var _map = req.app.settings.MAP;
    var resultsControl = _map.control_producto.list;
    var persona = _map.collectionCliente.list;
    var items = Object.assign(
        _map.item.list, 
        _map.color.list, 
        _map.medidas.list, 
        _map.marcas.list
    );

    DB.collection("inventario").find().toArray().then(resultsInventario => {
        var rInventario = {};
        resultsInventario.forEach((value) => {
            rInventario[value.codigo] = value;
        });
        ///use redis to speed and save internally       
        DB.collection("collectionmelamina").find().toArray().then(resultMelamina => {
            resultMelamina.forEach((melamina) => {
                let hash = MD5(items["Melamina"]._id.toString() + melamina.color + melamina.medidas + melamina.marca).toString();
                if (rInventario[hash]) {
                    rInventario[hash].contenido = melamina;
                }
            })
            DB.collection("collectiontapacantos").find().toArray().then(resultsTapacantos => {
                resultsTapacantos.forEach((tapacantos) => {
                    let hash = MD5(items["Tapacantos"]._id.toString() + tapacantos.color + tapacantos.medidas + tapacantos.marca).toString();
                    if (rInventario[hash]) {
                        rInventario[hash].contenido = tapacantos;
                    }
                })
            DB.collection("collectionpegamento").find().toArray().then(resultsPegamento => {
                resultsPegamento.forEach((pegamento) => {
                    let hash = MD5(items["Pegamento"]._id.toString() + pegamento.marca).toString();
                    if (rInventario[hash]) {
                        rInventario[hash].contenido = pegamento;
                    }
                })
            DB.collection("collectionfondo").find().toArray().then(resultsFondo => {
                resultsFondo.forEach((fondo) => {
                    let hash = MD5(items["Fondo"]._id.toString() + fondo.color + fondo.medidas + fondo.marca).toString();
                    console.log(hash);
                    if (rInventario[hash]) {
                        rInventario[hash].contenido = fondo;
                    }
                })
                DB.collection("collectiontapatornillos").find().toArray().then(resultsTapatornillos => {
                    resultsTapatornillos.forEach((tapatornillos) => {
                        let hash = MD5(items["Tapatornillos"]._id.toString() + tapatornillos.color + tapatornillos.marca).toString();
                        console.log(hash);
                        if (rInventario[hash]) {
                            rInventario[hash].contenido = tapatornillos;
                        }
                    })
                    DB.collection("collectioncanteo").find().toArray().then(resultsCanteo => {
                        resultsCanteo.forEach((canteo) => {
                            let hash = MD5(items["Canteo"]._id.toString()).toString();
                            rInventario[hash] = {existencia : "(1 Servicio)"};
                            rInventario[hash].contenido = canteo;
                        })
                        DB.collection("unidad").find().toArray().then(resultUnidad => {
                            let fecha = util.getFecha();
                            console.log(fecha);
                            DB.collection("historial").find({
                                "fecha": {$regex : fecha},
                                "tipo_entrada": "pedido"
                            }).toArray().then(resultHistorial => {
                                res.render('pages/pedidos', {
                                    cliente: _map.collectionCliente.array,
                                    persona: persona,
                                    item: _map.item.array,
                                    items: items,
                                    color: _map.color.array, 
                                    medida: _map.medidas.array,
                                    marca: _map.marcas.array,
                                    unidad: resultUnidad,
                                    historial: resultHistorial,
                                    inventario: rInventario,
                                    _inventario: resultsInventario,
                                    _control: resultsControl,
                                    username: SU.getCurrentUsername(req),
                                    config: req.app.settings.MAP.configuracion
                                });
                            })
                            .catch(error => console.error(error))
                        })
                        .catch(error => console.error(error))
                    })
                    .catch(error => console.error(error))
                })
                .catch(error => console.error(error))
            })
            .catch(error => console.error(error))
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
});

// ingresos page
app.get('/ingresos', checkAuth, function(req, res) {
    var DB = req.app.settings.DB;
    var _map = req.app.settings.MAP;
    var resultsControl = _map.control_producto.list;
    var resultsProvedor = _map.collectionprovedor.array;
    var items = Object.assign(
        _map.item.list, 
        _map.color.list, 
        _map.medidas.list, 
        _map.marcas.list
    );

    DB.collection("inventario").find().toArray().then(resultsInventario => {
        var rInventario = {};
    DB.collection("collectionmelamina").find().toArray().then(resultMelamina => {
        resultMelamina.forEach((melamina) => {
            let hash = MD5(items["Melamina"]._id.toString() + melamina.provedor + melamina.color + melamina.medidas + melamina.marca).toString();
            rInventario[hash] = melamina;
        })
        DB.collection("collectiontapacantos").find().toArray().then(resultsTapacantos => {
            resultsTapacantos.forEach((tapacantos) => {
                let hash = MD5(items["Tapacantos"]._id.toString() + tapacantos.provedor + tapacantos.color + tapacantos.medidas + tapacantos.marca).toString();
                rInventario[hash] = tapacantos;
            })
            DB.collection("collectionpegamento").find().toArray().then(resultsPegamento => {
                resultsPegamento.forEach((pegamento) => {
                    let hash = MD5(items["Pegamento"]._id.toString() + pegamento.provedor + pegamento.marca).toString();
                    rInventario[hash] = pegamento;
                })
                DB.collection("collectionfondo").find().toArray().then(resultsFondo => {
                    resultsFondo.forEach((fondo) => {
                        let hash = MD5(items["Fondo"]._id.toString() + fondo.provedor + fondo.color + fondo.medidas + fondo.marca).toString();
                        rInventario[hash] = fondo;
                    })
                    DB.collection("collectiontapatornillos").find().toArray().then(resultsTapatornillos => {
                        resultsTapatornillos.forEach((tapatornillos) => {
                            let hash = MD5(items["Tapatornillos"]._id.toString() + tapatornillos.provedor + tapatornillos.color + tapatornillos.marca).toString();
                            rInventario[hash] = tapatornillos;
                        })
                        DB.collection("unidad").find().toArray().then(resultUnidad => {
                            let fecha = util.getFecha();
                            console.log(fecha);
                            DB.collection("historial").find({
                                "fecha": {$regex : fecha},
                                "tipo_entrada": "ingreso"
                            }).toArray().then(resultHistorial => {
                                res.render('pages/ingreso', {
                                    provedor: resultsProvedor,
                                    item: _map.item.array,
                                    items: items,
                                    color: _map.color.array,
                                    medida: _map.medidas.array,
                                    marca: _map.marcas.array,
                                    unidad: resultUnidad,
                                    historial: resultHistorial,
                                    inventario: rInventario,
                                    _inventario: resultsInventario,
                                    _control: resultsControl,
                                    username: SU.getCurrentUsername(req),
                                    config: req.app.settings.MAP.configuracion
                                });
                            })
                            .catch(error => console.error(error))
                        })
                        .catch(error => console.error(error))
                    })
                    .catch(error => console.error(error))
                })
                .catch(error => console.error(error))
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
});

app.post('/addicionar_ingreso', (req, res) => {
    var DB = req.app.settings.DB;

    console.log("body:",req.body);
    let tipoItem = req.body.text.item.toLowerCase();
    let tipoUnidad = req.body.nombreDeUnidad.toLowerCase();
    let [color, medida] = util.formatColorMedida(req.body);

    let CollectionItem = DB.collection("collection" + tipoItem);
    var CollectionInventario = DB.collection("inventario");

    let filtro = null;
    if (tipoItem == "pegamento") {
        filtro = {
            "provedor": req.body.cliente,
            "marca":    req.body.marca
        };
    } else if (tipoItem == "tapatornillos") {
        filtro = {
            "provedor": req.body.cliente,
            "color":    color,
            "marca":    req.body.marca
        };
    } else {
        filtro = {
            "provedor": req.body.cliente,
            "color":    color,
            "medidas":  medida,
            "marca":    req.body.marca
        };
    }
    console.log(filtro);

    let hash = util.getInventarioMD5(req.body);
    console.log(hash);
    CollectionInventario.findOne({"codigo":hash}).then(INVENTARIO => {
        console.log(INVENTARIO);
        CollectionItem.find(filtro).toArray().then(item => {
            console.log(item);
            if (item.length == 0) {
                res.status(404).json({ok: false, message: "No existe el producto de esas caracteristicas en el catalogo collection" + tipoItem});
                res.end();
                throw "Error: No hubo match del objeto con collection" + tipoItem;
            }
            var codigo = item[0]._id;
            let resultTotal = {existencia: 0};
            let cantidad = 0;
            let cantidadExistente = Number(INVENTARIO.existencia);

            //Calcular entrada en base a unidad
            if (tipoUnidad == "laminas" || tipoUnidad == "rollos" || tipoUnidad == "bolsas" || tipoUnidad == "hojas") {
                cantidad = Number(req.body.cantidad);
            } else if (tipoUnidad == "paquetes") {
                var NUM_LAMINAS = Number(item[0].laminaxpaquete);
                cantidad = (Number(req.body.cantidad) * NUM_LAMINAS);
                req.body.laminaxpaquete = NUM_LAMINAS;    
            } else if (tipoUnidad == "cajas") {
                if (tipoItem == "tapatornillos") {
                    var NUM_HOJAS = Number(item[0].hojaxcaja);
                    cantidad = (Number(req.body.cantidad) * NUM_HOJAS);
                    req.body.hojasxcaja = NUM_HOJAS;
                } else {
                    var NUM_ROLLOS = Number(item[0].rollosxcaja);
                    cantidad = (Number(req.body.cantidad) * NUM_ROLLOS);
                    req.body.rollosxcaja = NUM_ROLLOS;
                }
            } else if (tipoUnidad == "metros") {
                let metros = INVENTARIO.metraje;
                let metrosExistentes = metros;
                var MTS_ROLLO = item[0].metrosxrollo;
                req.body.metrosxrollo = MTS_ROLLO;
                //metros
                metros = Number(req.body.cantidad) % MTS_ROLLO;
                metros = metrosExistentes + metros;//incrementa
                result.metraje = metros;
                //rollos
                cantidad = Math.trunc(Number(req.body.cantidad) / MTS_ROLLO);

                console.log("Incrementado Metros> ", metros);
            } else {
                res.status(500).json({ok: false, message:"Error: Unidad desconocida {"+tipoUnidad+"}" });
                res.end();
                throw "Error: Wrong Unit ["+tipoUnidad+"]";
            }
            resultTotal.existencia = cantidadExistente + cantidad;//incrementa
            console.log("Incrementado cantidad: ",cantidad);

            CollectionInventario.updateOne({"codigo": hash}, {$set: resultTotal}).then(item => {
                console.log(item);
                var Collection = DB.collection("historial");
                req.body.inventario_id = codigo.toString();
                req.body.item = req.body.text.item;
                req.body.cliente = req.body.text.cliente;
                req.body.marca = req.body.text.marca;
                req.body.medida = req.body.text.medida;
                req.body.color = req.body.text.color;
                delete req.body.text;
                Collection.insertOne(req.body).then(results => {
                    console.log(`Una compra addicionada al historial...`);
                    res.status(200).json({ok: true, message: "Historial e Inventario actualizados."});
                    res.end();
                })
                .catch(error => console.error(error))
            }).catch(error => console.error(error))
        }).catch(error => console.error(error));
    }).catch(error => console.error(error));
})

app.post('/addicionar_pedido',(req, res) => {
    var DB = req.app.settings.DB;

    console.log("body: ",req.body);
    let tipoItem = req.body.text.item.toLowerCase();
    let tipoUnidad = req.body.nombreDeUnidad.toLowerCase();
    let [color, medida] = util.formatColorMedida(req.body);

    let CollectionItem = DB.collection("collection" + tipoItem);
    var CollectionInventario = DB.collection("inventario");

    var filter = null;
    if (tipoItem === "canteo") {
        filter = {
        }
    } else if (tipoItem == "pegamento") {
        filter = {
            "marca":    req.body.marca
        };
    } else if (tipoItem == "tapatornillos") {
        filter = {
            "color":    color,
            "marca":    req.body.marca
        };
    } else {
        filter = {
            "color":    color,
            "medidas":  medida,
            "marca":    req.body.marca
        };
    }
    console.log("Query:", filter);

    let hash = util.getInventarioMD5(req.body);
    console.log(hash);
    CollectionInventario.findOne({"codigo":hash}).then(INVENTARIO => {
        console.log("Inventario:", INVENTARIO);
        CollectionItem.find(filter).toArray().then(item => {
            console.log("Catalogo:", item);
            if (item.length == 0) {
                res.status(200).json({ok: false, numPedido: Number(req.body.numIngreso), message: `No se encontro el item en collection${tipoItem}`});
                res.end();
                throw `Query on collection${tipoItem} didn't find a match.`;
            }

            var ID = item[0]._id;
            ///Check on SERVICES
            if (tipoItem == "canteo") {
                var CollectionHistorial = DB.collection("historial");
                  req.body.inventario_id = ID.toString();
                  req.body.item = req.body.text.item;
                  req.body.cliente = req.body.text.cliente;
                  req.body.marca = req.body.text.marca;
                  req.body.medida = req.body.text.medida;
                  req.body.color = req.body.text.color;
                  delete req.body.text;

                  if (req.body.canteo) {
                    req.body.servicio = "Canteo";
                  }

                CollectionHistorial.insertOne(req.body).then(results => {
                    console.log(`Un Servicio addicionado al historial...`);
                    res.status(200).json({ok: true, numPedido: Number(req.body.numIngreso), message: "Historial actualizado."});
                    res.end();
                    //Salvar cliente nuevo
                    if (typeof(req.body.ci) != "undefined") {
                        cliente_nuevo = {
                            ci: req.body.ci,
                            celular: req.body.celular,
                            email: req.body.email,
                            nombre: req.body.cliente,
                            direccion: req.body.direccion,
                            nit: req.body.nit,
                            empresa: req.body.empresa,
                            tipo: "externo"
                        };
                        DB.collection("collectionCliente").findOne(cliente_nuevo).then(results => {
                            console.log("CLIENTE -> ",results);
                            if (results == null) {
                                DB.collection("collectionCliente").insertOne(cliente_nuevo)
                                .then(results => {
                                    console.log(results, `cliente guardado...`);
                                })
                                .catch(error => console.error(error))
                            }
                        })
                        .catch(error => console.error(error))
                    }
              })
              .catch(error => console.error(error))
              return;
            }

            let cantidad = 0;
            let cantidadExistente = INVENTARIO.existencia;
            let total = {existencia:0};

            //Calcular entrada en base a unidad
            if (tipoUnidad == "laminas" || tipoUnidad == "rollos" || tipoUnidad == "bolsas" || tipoUnidad == "hojas") {
                cantidad = Number(req.body.cantidad);
            } else if (tipoUnidad == "paquetes") {
                var NUM_LAMINAS = Number(item[0].laminaxpaquete);
                cantidad = (Number(req.body.cantidad) * NUM_LAMINAS);
                req.body.laminaxpaquete = NUM_LAMINAS;
            } else if (tipoUnidad == "cajas") {
                if (tipoItem == "tapatornillos") {
                    var NUM_HOJAS = Number(item[0].hojaxcaja);
                    cantidad = (Number(req.body.cantidad) * NUM_HOJAS);
                    req.body.hojasxcaja = NUM_HOJAS;
                } else {
                    var NUM_ROLLOS = Number(item[0].rollosxcaja);
                    cantidad = (Number(req.body.cantidad) * NUM_ROLLOS);
                    req.body.rollosxcaja = NUM_ROLLOS;
                }
            } else if (tipoUnidad == "metros") {
                let metros = INVENTARIO.metraje;
                let metrosExistentes = metros;
                var MTS_ROLLO = item[0].metrosxrollo;
                req.body.metrosxrollo = MTS_ROLLO;
                //calcular metros restantes
                metros = Number(req.body.cantidad) % MTS_ROLLO;
                //Verifica cantidad de metros a decrementar si aun quedan...
                if (metrosExistentes < metros) {
                    //decrementa de los metros existentes y calcula cuantos metros quedara de un rollo
                    metros = metros - metrosExistentes;
                    metros = MTS_ROLLO - metros;
                    //rollos
                    cantidad = 1;
                } else {
                    //decrementa existentes
                    metros = metrosExistentes - metros;
                    //rollos
                    cantidad = Math.trunc(Number(req.body.cantidad) / MTS_ROLLO);
                }
                total.metraje = metros;
                console.log("Decrementado metros: ", metros);
            } else {
                res.status(500).json({ok: false, message:"Error: Unidad desconocida {"+tipoUnidad+"}" });
                res.end();
                throw "Error: Wrong Unit ["+tipoUnidad+"]";
            }
            cantidad = cantidadExistente - cantidad;//decrementa
            total.existencia = cantidad;

            if (cantidad < 0) {
                console.log(`La cantidad en Pedido es mayor a lo contenido en inventario...`);
                res.status(500).json({ok: false, message: "La cantidad de " + tipoUnidad + " [" + req.body.cantidad + "] el Pedido es mayor a lo contenido en inventario [" + cantidadExistente + "]."});
                res.end();
                throw "Error: Cantidad excedente a lo existente ["+req.body.cantidad+"]";
            }
            console.log("Decrementado cantidad: ",cantidad);

            CollectionInventario.updateOne({"codigo": hash}, {$set: total}).then(item => {
                  var CollectionHistorial = DB.collection("historial");
                  req.body.inventario_id = ID.toString();
                  req.body.item = req.body.text.item;
                  req.body.cliente = req.body.text.cliente;
                  req.body.marca = req.body.text.marca;
                  req.body.medida = req.body.text.medida;
                  req.body.color = req.body.text.color;
                  delete req.body.text;

                  if (req.body.canteo) {
                    req.body.servicio = "Canteo";
                  }

                  CollectionHistorial.insertOne(req.body).then(results => {
                        let AVISO = "";
                        if (cantidad == 0) {
                            AVISO = "<p>SE ACABA DE AGOTAR "+tipoUnidad+" PARA ["+req.body.marca+"]</p>";
                        }
                        console.log(`Un Pedido addicionado al historial...`);
                        res.status(200).json({ok: true, numPedido: Number(req.body.numIngreso), message: "Historial e Inventario actualizados." + AVISO});
                        res.end();
                        //Salvar cliente nuevo
                        if (typeof(req.body.ci) != "undefined") {
                            cliente_nuevo = {
                                ci: req.body.ci,
                                celular: req.body.celular,
                                email: req.body.email,
                                nombre: req.body.cliente,
                                direccion: req.body.direccion,
                                nit: req.body.nit,
                                empresa: req.body.empresa,
                                tipo: "externo"
                            };
                            DB.collection("collectionCliente").findOne(cliente_nuevo).then(results => {
                                console.log("CLIENTE -> ",results);
                                if (results == null) {
                                    DB.collection("collectionCliente").insertOne(cliente_nuevo)
                                    .then(results => {
                                        console.log(results, `cliente guardado...`);
                                    })
                                    .catch(error => console.error(error))
                                }
                            })
                            .catch(error => console.error(error))
                        }
                  })
                  .catch(error => console.error(error))
            }).catch(error => console.error(error))
        }).catch(error => console.error(error))
    }).catch(error => console.error(error))
})

app.post('/obtener_precio', (req, res) => {
    var DB = req.app.settings.DB;

    let tipoItem = req.body.item.toLowerCase();
    var CollectionItem = DB.collection("collection" + tipoItem);
    var CollectionProvedor = DB.collection("collectionprovedor");
    var jsonQuery;

    console.log(req.body);
    console.log('Provedor de compra:',req.body.provedor);

    if (typeof(req.body.provedor) == "undefined") {
        if (tipoItem === "canteo") {
            jsonQuery = {
            }
        } else if (tipoItem === "pegamento") {
            jsonQuery = {
                "marca": req.body.marca
            }
        } else if (tipoItem === "tapatornillos") {
            jsonQuery = {
                "color": req.body.color,
                "marca": req.body.marca
            }
        } else {
            jsonQuery = {
                "color": req.body.color,
                "medidas": req.body.medida,
                "marca": req.body.marca
            }
        }
    } else {
        if (tipoItem === "Pegamento") {
            jsonQuery = {
                "provedor": req.body.provedor,
                "marca": req.body.marca
            }
        } else if (tipoItem === "tapatornillos") {
            jsonQuery = {
                "provedor": req.body.provedor,
                "color": req.body.color,
                "marca": req.body.marca
            }
        } else {
            jsonQuery = {
                "provedor": req.body.provedor,
                "color": req.body.color,
                "medidas": req.body.medida,
                "marca": req.body.marca
            }
        }
    }
    console.log("Parametros de consulta:", jsonQuery);

    CollectionProvedor.find().toArray().then((provedor) => {
        var provedorMap = {};
        provedor.forEach(item => {
            provedorMap[item._id.toString()] = item.nombre;
        });
        console.log("provedores:", provedorMap);
    CollectionItem.find(jsonQuery).toArray().then((resultItem) => {

        if (resultItem.length === 0) {
            res.status(404).json({ok: false, precio: 0.0, message: "Este producto no esta en catalogo"});
            res.end();
            throw "Error: El producto no se encuentra en catalogos";
        }

        console.log('Producto encontrado:', resultItem);

        var precios = [];
        var e_message;
        var flag = true;

        resultItem.forEach((result, index) => {

            let precio = .0;
            let precio_metros = .0;
            let precio_caja = 0;
            let EXPLICACION = "";
            var producto;
            let rebaja = 0;

            try {

                if (req.body.tipo_entrada == "ingreso") {
                    precio = result.precio_compra;
                    precio_metros = result.precio_compra_metros;
                    precio_caja = result.precio_compra_caja?result.precio_compra_caja:0;
                } else if (req.body.tipo_entrada == "pedido") {
                    precio = result.precio_venta;
                    if (req.body.tipo_cliente == 'interno' && tipoItem == "melamina") {
                        precio = result.precio_venta_interno;
                    }
                    precio_metros = result.precio_venta_metros;
                    if (req.body.canteo && result.hasOwnProperty('precio_venta_metros_canteo')) {
                        precio_metros = Number(result.precio_venta_metros_canteo);
                        console.log("canteo mt al canteo:", precio_metros);
                    }
                    precio_caja = result.precio_venta_caja?result.precio_venta_caja:0;
                }

                if (tipoItem == "tapacantos") {
                    producto = {rollos:0, cajas:0, metros:0};
                    if (req.body.unidad == "metros") {
                        producto.rollos = Math.trunc(req.body.cantidad / result.metrosxrollo);

                        producto.cajas = Math.trunc(producto.rollos / result.rollosxcaja);

                        EXPLICACION = `${req.body.cantidad} x ${precio_metros}(pm) Bs`;

                        precio = req.body.cantidad * precio_metros;
                        if (req.body.tipo_cliente == 'interno' || req.body.canteo) {
                            rebaja = 1;
                            EXPLICACION = `${req.body.cantidad} x (${precio_metros}(pm) Bs - ${rebaja} Bs)`;
                            precio = req.body.cantidad * (precio_metros - rebaja);
                        }

                    } else if (req.body.unidad == "rollos") {
                        producto.cajas = Math.trunc(req.body.cantidad / result.rollosxcaja);

                        producto.rollos = req.body.cantidad - result.rollosxcaja;
                        while (producto.rollos > result.rollosxcaja) {
                            producto.rollos = producto.rollos - result.rollosxcaja;
                        }

                        producto.metros =  0;

                        EXPLICACION = `${req.body.cantidad} x ${precio} Bs`;
                        precio = req.body.cantidad * precio;
                    } else if (req.body.unidad == "cajas") {
                        producto.cajas = req.body.cantidad;
                        producto.rollos = 0;
                        producto.metros =  0;
                        if (precio_caja) {
                            EXPLICACION = `${req.body.cantidad} x ${precio_caja} Bs`;
                            precio = req.body.cantidad * precio_caja;
                        } else {
                            EXPLICACION = `${req.body.cantidad} x ${result.rollosxcaja}(rxc) x ${precio} Bs`;
                            precio = (req.body.cantidad * result.rollosxcaja) * precio;
                        }
                    } else {
                        if (req.body.unidad.length <= 0) {
                            e_message = "No se envio la Unidad del pedido.";
                        } else {
                            e_message = "Unidad desconocida [" + req.body.unidad + "]";
                        }
                    }
                } else if (tipoItem == "melamina" || tipoItem == "fondo") {
                    producto = {paquetes:0, laminas:0};
                    if (req.body.unidad == "laminas") {
                        producto.paquetes = Math.trunc(req.body.cantidad / result.laminaxpaquete);

                        producto.laminas = req.body.cantidad - result.laminaxpaquete;
                        while (producto.laminas > result.laminaxpaquete) {
                            producto.laminas = producto.laminas - result.laminaxpaquete;
                        }

                        EXPLICACION = `${req.body.cantidad} x ${precio} Bs`;
                        precio = req.body.cantidad * precio;
                    } else if (req.body.unidad == "paquetes") {
                        producto.laminas = 0;
                        producto.paquetes = req.body.cantidad;

                        EXPLICACION = `${req.body.cantidad} x ${result.laminaxpaquete}(lxp) x ${precio} Bs`;
                        precio = (req.body.cantidad * result.laminaxpaquete) * precio;
                    } else {
                        if (req.body.unidad.length <= 0) {
                            e_message = "No se envio la Unidad del pedido.";
                        } else {
                            e_message = "Unidad desconocida [" + req.body.unidad + "]";
                        }
                    }
                } else if (tipoItem == "tapatornillos") {
                    producto = {hojas:0, cajas:0};
                    if (req.body.unidad == "hojas") {
                        producto.cajas = Math.trunc(req.body.cantidad / result.hojaxcaja);
                        producto.hojas = req.body.cantidad;

                        EXPLICACION = `${req.body.cantidad} x ${precio} Bs`;
                        precio = req.body.cantidad * precio;
                    } else if (req.body.unidad == "cajas") {
                        producto.hojas = req.body.cantidad * result.hojaxcaja;
                        producto.cajas = req.body.cantidad;

                        EXPLICACION = `${req.body.cantidad} x ${result.hojaxcaja}(hxc) x ${precio} Bs`;
                        precio = (req.body.cantidad * result.hojaxcaja) * precio;
                    } else {
                        if (req.body.unidad.length <= 0) {
                            e_message = "No se envio la Unidad del pedido.";
                        } else {
                            e_message = "Unidad desconocida [" + req.body.unidad + "]";
                        }
                    }
                } else if (tipoItem == "pegamento") {

                    if (req.body.unidad.length <= 0) {
                        e_message = "No se envio la Unidad del pedido.";
                    } else if (req.body.unidad !== "bolsas") {
                        e_message = "Unidad desconocida [" + req.body.unidad + "]";
                    }

                    producto = {bolsa:0};
                    producto.bolsa = req.body.cantidad;

                    EXPLICACION = `${req.body.cantidad} x ${precio} Bs`;
                    precio = req.body.cantidad * precio;

                } else if (tipoItem == "canteo") {

                    if (req.body.unidad.length <= 0) {
                        e_message = "No se envio la Unidad del pedido.";
                    } else if (req.body.unidad !== "metros") {
                        e_message = "Unidad desconocida [" + req.body.unidad + "]";
                    }

                    producto = {metros:0};
                    producto.metros = req.body.cantidad;

                    EXPLICACION = `${req.body.cantidad} x ${precio} Bs`;
                    precio = req.body.cantidad * precio;
                } else {
                    e_message = "[" + tipoItem + "] es un producto (o servicio) no conocido.";
                }

                precios[index] = {
                    provedor: provedorMap[result.provedor],
                    precio: precio,
                    detalles: producto,
                    explicacion: EXPLICACION,
                    rebaja: rebaja,
                    error: e_message
                };
                console.log(index + ") price : ",precios[index]);
            } catch(error) {
                if (!(error instanceof Error)) {
                    error = new Error(error);
                }
                e_message = error.message;
                flag = false;
            }
        })

        res.status(200).json({ok: flag, precio: precios, message: e_message});
        res.end();
    })
    .catch(error => console.error(error))
    })
    .catch(error => console.error(error));
});

// reporte page
app.get('/reporte', checkAuth, function(req, res) {
    var DB = req.app.settings.DB;
    var _map = req.app.settings.MAP;
    var resultsControl = _map.control_producto.list;
    var resultCliente = _map.collectionCliente.array;

    DB.collection("inventario").find().toArray().then(resultsInventario => {
        res.render('pages/reporte01', {
            _inventario: resultsInventario,
            _control: resultsControl,
            cliente: resultCliente,
            username: SU.getCurrentUsername(req),
            config: req.app.settings.MAP.configuracion
        });
    })
    .catch(error => console.error(error))
});

// tapacantos_standar page
app.get('/catalogos', checkAuth, function(req, res) {
    var DB = req.app.settings.DB;
    var _map = req.app.settings.MAP;
    var resultsControl = _map.control_producto.list;

    let colores = {};
    let medidas = {};
    let provedores = {};
    let marcas = {};

    DB.collection("inventario").find().toArray().then(resultsInventario => {
   
    DB.collection("color").find().toArray().then(color_results => {
        color_results.forEach((color)=>{
            colores[color._id.toString()] = color;
        });
    DB.collection("medidas").find().toArray().then(medidas_results => {
        medidas_results.forEach((medida)=>{
            medidas[medida._id.toString()] = medida;
        });
    DB.collection("collectionprovedor").find().toArray().then(provedor_results => {
        provedor_results.forEach((provedor)=>{
            provedores[provedor._id.toString()] = provedor;
        });
    DB.collection("marcas").find().toArray().then(marca_results => {
        marca_results.forEach((marca)=>{
            marcas[marca._id.toString()] = marca;
        });
    DB.collection("collectiontapacantos").find().toArray().then(tapacantos_results => {
        tapacantos_results.forEach((tapacantos) => {
            tapacantos.color_id = tapacantos.color;
            tapacantos.color = (colores[tapacantos.color])?colores[tapacantos.color].nombre:'';
            tapacantos.medidas_id = tapacantos.medidas;
            tapacantos.medidas = (medidas[tapacantos.medidas])?medidas[tapacantos.medidas].nombre:'';
            tapacantos.provedor_id = tapacantos.provedor;
            tapacantos.provedor = (provedores[tapacantos.provedor])?provedores[tapacantos.provedor].nombre:'';
            tapacantos.marca_id = tapacantos.marca;
            tapacantos.marca = (marcas[tapacantos.marca])?marcas[tapacantos.marca].nombre:'';
        });
        DB.collection("collectionmelamina").find().toArray().then(melamina_results => {
            melamina_results.forEach((melamina) => {
                melamina.color_id = melamina.color;
                melamina.color = (colores[melamina.color])?colores[melamina.color].nombre:'';
                melamina.medidas_id = melamina.medidas;
                melamina.medidas = (medidas[melamina.medidas])?medidas[melamina.medidas].nombre:'';
                melamina.provedor_id = melamina.provedor;
                melamina.provedor = (provedores[melamina.provedor])?provedores[melamina.provedor].nombre:'';
                melamina.marca_id = melamina.marca;
                melamina.marca = (marcas[melamina.marca])?marcas[melamina.marca].nombre:'';
            });
            DB.collection("collectionpegamento").find().toArray().then(pegamento_results => {
                pegamento_results.forEach((pegamento) => {
                    pegamento.provedor_id = pegamento.provedor;
                    pegamento.provedor = (provedores[pegamento.provedor])?provedores[pegamento.provedor].nombre:'';
                    pegamento.marca_id = pegamento.marca;
                    pegamento.marca = (marcas[pegamento.marca])?marcas[pegamento.marca].nombre:'';
                });
                DB.collection("collectionfondo").find().toArray().then(fondo_results => {
                    fondo_results.forEach((fondo) => {
                        fondo.color_id = fondo.color;
                        fondo.color = (colores[fondo.color])?colores[fondo.color].nombre:'';
                        fondo.medidas_id = fondo.medidas;
                        fondo.medidas = (medidas[fondo.medidas])?medidas[fondo.medidas].nombre:'';
                        fondo.provedor_id = fondo.provedor;
                        fondo.provedor = (provedores[fondo.provedor])?provedores[fondo.provedor].nombre:'';
                        fondo.marca_id = fondo.marca;
                        fondo.marca = (marcas[fondo.marca])?marcas[fondo.marca].nombre:'';
                    });
                    DB.collection("collectiontapatornillos").find().toArray().then(tapatornillos_results => {
                        tapatornillos_results.forEach((tapatornillo) => {
                            tapatornillo.color_id = tapatornillo.color;
                            tapatornillo.color = (colores[tapatornillo.color])?colores[tapatornillo.color].nombre:'';
                            tapatornillo.medidas_id = tapatornillo.medidas;
                            tapatornillo.medidas = (medidas[tapatornillo.medidas])?medidas[tapatornillo.medidas].nombre:'';
                            tapatornillo.provedor_id = tapatornillo.provedor;
                            tapatornillo.provedor = (provedores[tapatornillo.provedor])?provedores[tapatornillo.provedor].nombre:'';
                            tapatornillo.marca_id = tapatornillo.marca;
                            tapatornillo.marca = (marcas[tapatornillo.marca])?marcas[tapatornillo.marca].nombre:'';
                        });
                        DB.collection("collectionCliente").find().toArray().then(cliente_results => {
                            res.render('pages/contenidos', {
                                tapacantos: tapacantos_results,
                                melamina:   melamina_results,
                                pegamento:  pegamento_results,
                                fondo:      fondo_results,
                                tapatornillos:tapatornillos_results,
                                cliente:    cliente_results,
                                _inventario: resultsInventario,
                                _control: resultsControl,
                                username: SU.getCurrentUsername(req),
                                config: req.app.settings.MAP.configuracion
                            });
                        })
                        .catch(error => console.error(error))
                    })
                    .catch(error => console.error(error))
                })
                .catch(error => console.error(error))
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
});

// historia page
app.get('/historial', checkAuth, function(req, res) {
    var DB = req.app.settings.DB;
    var _map = req.app.settings.MAP;
    var resultsControl = _map.control_producto.list;

    DB.collection("inventario").find().toArray().then(resultsInventario => {
        DB.collection("historial").find().toArray().then(results => {
            res.render('pages/historial', {
                historial: results,
                _inventario: resultsInventario,
                _control: resultsControl,
                username: SU.getCurrentUsername(req),
                config: req.app.settings.MAP.configuracion
            });
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
});


// historia page
app.get('/editar_catalogo', checkAuth, function(req, res) {
    var DB = req.app.settings.DB;
    var _map = req.app.settings.MAP;
    var resultsControl = _map.control_producto.list;

  
    var items = {};
    DB.collection("color").find().toArray().then(resultsColor => {
        resultsColor.forEach((color) => {
            items[color._id.toString()] = color.nombre;
        });
        DB.collection("medidas").find().toArray().then(resultMedida => {
            resultMedida.forEach((medida) => {
                items[medida._id.toString()] = medida.nombre;
            });
            DB.collection("marcas").find().toArray().then(resultMarcas => {
                resultMarcas.forEach((marca) => {
                    items[marca._id.toString()] = marca.nombre;
                });
                DB.collection("collectionprovedor").find().toArray().then(resultProvedor => {
                    resultProvedor.forEach((provedor) => {
                    items[provedor._id.toString()] = provedor.nombre;
                });
                DB.collection("collectionmelamina").find().toArray().then(resultsMelamina => {
                    DB.collection("collectiontapacantos").find().toArray().then(resultsTapacantos => {
                        DB.collection("collectionfondo").find().toArray().then(resultsFondos => {
                            DB.collection("collectiontapatornillos").find().toArray().then(resultsTapatornillos => {
                                DB.collection("collectionpegamento").find().toArray().then(resultsPegamento => {
                                    DB.collection("inventario").find().toArray().then(resultInventario => {
                                        var inventario = {};
                                        resultInventario.forEach(element => {
                                            inventario[element.codigo] = element;
                                        });
          -                             res.render('pages/edit-catalago', {
                                            items: items,
                                            _color:resultsColor,
                                            _medida:resultMedida,
                                            _marca:resultMarcas,
                                            _provedor:resultProvedor,
                                            melamina: resultsMelamina,
                                            tapacantos: resultsTapacantos,
                                            fondos: resultsFondos,
                                            tapatornillos: resultsTapatornillos,
                                            pegamento: resultsPegamento,
                                            inventario: inventario,
                                            _inventario: resultInventario,
                                            _control: resultsControl,
                                            username: SU.getCurrentUsername(req),
                                            config: req.app.settings.MAP.configuracion
                                        });
                                    })
                                    .catch(error => console.error(error))
                                })
                                .catch(error => console.error(error))
                            })
                            .catch(error => console.error(error))
                        })
                        .catch(error => console.error(error))
                    })
                    .catch(error => console.error(error))
                })
                .catch(error => console.error(error))
                })
                .catch(error => console.error(error))
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
});

app.get('/productos', function(req, res) {
    var DB = req.app.settings.DB;
  
    var items = {};
    DB.collection("preferencias").findOne().then(resultsPreferencias => {
    DB.collection("color").find().toArray().then(resultsColor => {
        resultsColor.forEach((color) => {
            items[color._id.toString()] = color.nombre;
        });
        DB.collection("medidas").find().toArray().then(resultMedida => {
            resultMedida.forEach((medida) => {
                items[medida._id.toString()] = medida.nombre;
            });
            DB.collection("marcas").find().toArray().then(resultMarcas => {
                resultMarcas.forEach((marca) => {
                    items[marca._id.toString()] = marca.nombre;
                });
                DB.collection("collectionmelamina").find().toArray().then(resultsMelamina => {
                    DB.collection("collectiontapacantos").find().toArray().then(resultsTapacantos => {
                        DB.collection("collectionfondo").find().toArray().then(resultsFondos => {
                            DB.collection("collectiontapatornillos").find().toArray().then(resultsTapatornillos => {
                                DB.collection("collectionpegamento").find().toArray().then(resultsPegamento => {
                                    DB.collection("inventario").find().toArray().then(resultInventario => {
                                        var inventario = {};
                                        resultInventario.forEach(element => {
                                            inventario[element.codigo] = element;
                                        });
                                        res.render('pages/views', {
                                            items: items,
                                            melamina: resultsMelamina,
                                            tapacantos: resultsTapacantos,
                                            fondos: resultsFondos,
                                            tapatornillos: resultsTapatornillos,
                                            pegamento: resultsPegamento,
                                            inventario: inventario,
                                            preferencias: resultsPreferencias,
                                            config: req.app.settings.MAP.configuracion
                                        });
                                    })
                                    .catch(error => console.error(error))
                                })
                                .catch(error => console.error(error))
                            })
                            .catch(error => console.error(error))
                        })
                        .catch(error => console.error(error))
                    })
                    .catch(error => console.error(error))
                })
                .catch(error => console.error(error))
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
});

// historia page
app.get('/inventario', checkAuth, function(req, res) {
    var DB = req.app.settings.DB;
    var _map = req.app.settings.MAP;
    var resultsControl = _map.control_producto.list;

    let producto_item ={};
    let colores = {};
    let medidas = {};
    let marcas = {};

    DB.collection("item").find().toArray().then(resultsItem => {
        resultsItem.forEach((item)=>{
            producto_item[item.nombre] = item;
        });
    DB.collection("color").find().toArray().then(resultsColor => {
        resultsColor.forEach((color)=>{
            colores[color._id.toString()] = color;
        });
    DB.collection("medidas").find().toArray().then(resultsMedidas => {
        resultsMedidas.forEach((medida)=>{
            medidas[medida._id.toString()] = medida;
        });
    DB.collection("marcas").find().toArray().then(resultsMarca => {
        resultsMarca.forEach((marca)=>{
            marcas[marca._id.toString()] = marca;
        });
    DB.collection("inventario").find().toArray().then(resultsInventario => {
        var rInventario = {fetchInventarioValues: function(nombre, producto) {
                let item = producto_item[nombre];
                let indexHash = MD5(item._id.toString() + producto.color + producto.medidas + producto.marca).toString();
                if (nombre == "Pegamento") {
                    indexHash = MD5(item._id.toString() + producto.marca).toString();
                } else if (nombre == "Tapatornillos") {
                    indexHash = MD5(item._id.toString() + producto.color + producto.marca).toString();
                }

                if (producto.apedido) {
                    this[indexHash].apedido = true;
                    return;
                }

                if (!this[indexHash]) {
                    console.log("["+indexHash+"] NO existe... ", nombre, item._id.toString(), producto.color , producto.medidas , producto.marca);
                } else {
                    console.log(nombre);
                    console.log(indexHash, item._id.toString(), producto.color, producto.medidas, producto.marca);
                    this[indexHash].nombre = nombre;
                    this[indexHash].unidad = item.unidad;
                    this[indexHash].item = producto;
                }
            }
        };
        resultsInventario.forEach((value) => {
            rInventario[value.codigo] = value;
        });
        DB.collection("collectionmelamina").find().toArray().then(resultsMelamina => {
            resultsMelamina.forEach((Melamina) => {
                rInventario.fetchInventarioValues("Melamina", Melamina);
            });
            DB.collection("collectiontapacantos").find().toArray().then(resultsTapacantos => {
                resultsTapacantos.forEach((Tapacantos) => {
                    rInventario.fetchInventarioValues("Tapacantos", Tapacantos);
                });
                DB.collection("collectionpegamento").find().toArray().then(resultPegamento => {
                    resultPegamento.forEach((Pegamento )=> {
                        rInventario.fetchInventarioValues("Pegamento", Pegamento);
                    });
                    DB.collection("collectionfondo").find().toArray().then(resultFondo => {
                        resultFondo.forEach((Fondo) => {
                            rInventario.fetchInventarioValues("Fondo", Fondo);
                        });
                        DB.collection("collectiontapatornillos").find().toArray().then(resultTapatornillos => {
                            resultTapatornillos.forEach((tapatornillos) => {
                                rInventario.fetchInventarioValues("Tapatornillos", tapatornillos);
                            });
                                res.render('pages/inventario', {
                                    colores: colores,
                                    medidas: medidas,
                                    marcas: marcas,
                                    inventario: rInventario,
                                    control: resultsControl,
                                    size: (Object.keys(rInventario).length - 1),  //less 1 function
                                    _inventario: resultsInventario,
                                    _control: resultsControl,
                                    username: SU.getCurrentUsername(req),
                                    config: req.app.settings.MAP.configuracion
                                });
                            })
                            .catch(error => console.error(error))
                        })
                        .catch(error => console.error(error))
                    })
                    .catch(error => console.error(error))
                })
                .catch(error => console.error(error))
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
});

// preferencias page
app.get('/preferencias', checkAuth, function(req, res) {
    var DB = req.app.settings.DB;
    var _map = req.app.settings.MAP;
    var resultsControl = _map.control_producto.list;
    
    var CollectionInventario = DB.collection("inventario");
    var CollectionPreferencias = DB.collection("preferencias");
    var CollectionUsuario = DB.collection("user");
    var CollectionColor = DB.collection("color");
    var CollectionMarcas = DB.collection("marcas");
    var CollectionMedidas = DB.collection("medidas");
    var CollectionProvedor = DB.collection("collectionprovedor");
    var CollectionItem = DB.collection("item");
    var CollectionCliente = DB.collection("collectionCliente");
    var CollectionMelamina = DB.collection("collectionmelamina");
    var CollectionTapacantos = DB.collection("collectiontapacantos");
    var CollectionPegamento = DB.collection("collectionpegamento");
    var CollectionFondo = DB.collection("collectionfondo");
    var CollectionTapatornillos = DB.collection("collectiontapatornillos");

    CollectionInventario.find().toArray().then(resultsInventario => {
    CollectionPreferencias.findOne().then(resultsPreferencias => {
    CollectionUsuario.find().toArray().then(resultsUsuario => {
    CollectionColor.find().toArray().then(resultsColor => {
        CollectionMarcas.find().toArray().then(resultsMarcas => {
            CollectionMedidas.find().toArray().then(resultsMedidas => {
                CollectionProvedor.find().toArray().then(resultsProvedor => {
                    CollectionItem.find().toArray().then(resultsItem => {
                        CollectionCliente.find().toArray().then(resultsCliente => {
                            CollectionMelamina.find().toArray().then(resultsMelamina => {
                                CollectionTapacantos.find().toArray().then(resultsTapacantos => {
                                    CollectionPegamento.find().toArray().then(resultsPegamento => {
                                        CollectionFondo.find().toArray().then(resultsFondo => {
                                            CollectionTapatornillos.find().toArray().then(resultsTapatornillos => {
                                                res.render('pages/preferencias/index', {
                                                    control: resultsControl,
                                                    color: resultsColor,
                                                    marcas: resultsMarcas,
                                                    medidas: resultsMedidas,
                                                    provedor: resultsProvedor,
                                                    item: resultsItem,
                                                    cliente: resultsCliente,
                                                    melamina: resultsMelamina,
                                                    tapacantos: resultsTapacantos,
                                                    pegamento: resultsPegamento,
                                                    fondo: resultsFondo,
                                                    tapatornillos: resultsTapatornillos,
                                                    preferencias: resultsPreferencias,
                                                    usuario: resultsUsuario,
                                                    _inventario: resultsInventario,
                                                    _control: resultsControl,
                                                    username: SU.getCurrentUsername(req),
                                                    registeredUsers: SU.USUARIOS,
                                                    config: req.app.settings.MAP.configuracion
                                                });
                                            })
                                            .catch(error => console.error(error))
                                        })
                                        .catch(error => console.error(error))
                                    })
                                    .catch(error => console.error(error))
                                })
                                .catch(error => console.error(error))
                            })
                            .catch(error => console.error(error))
                        })
                        .catch(error => console.error(error))
                    })
                    .catch(error => console.error(error))
                })
                .catch(error => console.error(error))
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
});

app.get('/configuracion',(req, res) => {
    var DB = req.app.settings.DB;
    var _map = req.app.settings.MAP;

    console.log("Configuracion request: ", req.body);

    let CollectionConfig = DB.collection("configuracion");
    CollectionConfig.find().toArray().then((data) => {

        data.forEach((configitem) => {
            console.log("configuracion: ",configitem);
            res.status(200).json({config: configitem, ok: true, message:"Configuracion encontrada.", token: process.env.IMAGE_KEY});
            res.end();
        });
    })
    .catch(error => {
        console.error(error);
            configitem.nombre_app = "unavailable";
            configitem.celular_1 = 0;
            configitem.celular_2 = 0;
            configitem.tiktok_site = "unavailable";
            configitem.direccion = "unavailable";
            configitem.foto = "public/images/logo.jpg";
            configitem.icon = "public/images/icon.gif";
        res.status(405).json({config: configitem, ok: false, message: error});
        res.end();
    })
 })

app.put('/configuracion/actualizar/:id',(req, res) => {
    var DB = req.app.settings.DB;

    console.log("Guardando config: ", req.body);
    let idc = DB.getObjectID(req.params.id);
    console.log(req.params.id, idc);

    let CollectionConfig = DB.collection("configuracion");

    CollectionConfig.updateOne({"_id": idc}, {$set: req.body}).then(results => {
        var messageText =  "No se pudo actualizar la configuracion....";
        var state = false;

        if (results.modifiedCount) {
            messageText = "La Configuracion se actualizo...";
            req.app.settings.MAP.configuracion = req.body; //update map
            state = true;
        }

        console.log(messageText);
        res.status(200).json({ok: state, message: messageText});
        res.end();
    })
    .catch(error => console.error(error))
})

app.get('/login', function (req, res) {
    var Messages = {
        'f3g33vb5v443' : "Usuario o contraseña incorrectos.",
        '545egetgedd0' : "La session ya fue inicializada",
        'df34ef34erfg' : "No esta autorizado para ver esta pagina"
    };

    var message = "";
    if (req.query.response && Messages[req.query.response]) {
        message = Messages[req.query.response];
    }

    res.render('pages/login', {
        client_message: message,
        code: req.query.response,
        config: req.app.settings.MAP.configuracion
    });
});

app.post('/continue', function (req, res) {
    if (process.env.last_url && process.env.last_url.length > 1) {
        res.redirect(process.env.last_url);
    } else {
        res.redirect('/inventario');
    }
});

app.post('/login', function (req, res) {
    var DB = req.app.settings.DB;
    var post = req.body;
    var found = false;

    DB.collection("user").find().toArray().then((users) => {
        users.forEach((user) => {
            if (post.user === user.name && post.password === user.password) {
                var ID = user._id.toString();
                found = true;

                if (SU.userExists(ID)) {
                    if (user.administrador) {
                        req.session.user_id = ID;
                        SU.setUser(ID, user);
                    }
                    res.redirect('/login?response=545egetgedd0');
                } else {
                    req.session.user_id = ID;
                    SU.setUser(ID, user);
                    SU.printSessionData(req);
                    if (process.env.last_url && process.env.last_url.length > 1) {
                        res.redirect(process.env.last_url);
                    } else {
                        res.redirect('/inventario');
                    }
                }
            }
        });

        if (!found) {
            SU.printSessionData(req);
            console.log("Wrong password or username");
            //var string = encodeURIComponent("Usuario o contraseña incorrecta");
            res.redirect('/login?response=f3g33vb5v443');
        }
    })
    .catch(error => console.error(error))
});

app.get('/logout', function (req, res) {
    if (req.session && req.session.user_id) {
        SU.removeUser(req);
        delete req.session.user_id;
    }
    res.redirect('/login');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
