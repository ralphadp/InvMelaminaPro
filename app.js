var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const ObjectID = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
var MD5 = require("crypto-js/md5");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const dotenv = require('dotenv');
dotenv.config();
const uri = `mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_PASS}@${process.env.ATLAS_HOST}/${process.env.ATLAS_DB}?retryWrites=true&w=majority`;
console.log("Connected to " + uri );


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


let getFecha = function() {
    let fecha = new Date();
    let hoyDia = fecha.getDate();
    let esteMes = fecha.getMonth() + 1;
    let esteAnio = fecha.getFullYear();
    hoyDia = (hoyDia<=9) ? ('0'+hoyDia) : hoyDia;
    esteMes = (esteMes<=9) ? ('0'+esteMes) : esteMes;
    return hoyDia + "/" + esteMes + "/" + esteAnio;
}

function formatColorMedida(producto) {
    let color = "";
    let medida = "";
    if (producto.color != "(ninguno)") {
        color = producto.color;
    }
    if (producto.medida != "(ninguno)") {
        medida = producto.medida;
    }

    return [color, medida];
}

function getInventarioMD5(producto) {
    let [color, medida] = formatColorMedida(producto);
    console.log(producto.item, color, medida, producto.marca);
    return MD5(producto.item + color + medida + producto.marca).toString();
}

// pedidos page
app.get('/pedidos', function(req, res) {
    const client = new MongoClient(uri);
    client.connect();
    var DB = client.db();
    var items = {};
    var persona = {};
    
    DB.collection("inventario").find().toArray().then(resultsInventario => {
        var rInventario = {};
        resultsInventario.forEach((value) => {
            rInventario[value.codigo] = value;
        });
    DB.collection("control_producto").find().toArray().then(resultsControl => {
    ///use redis to speed and save internally       
    DB.collection("collectionCliente").find().toArray().then(resultsCliente => {
        resultsCliente.forEach((cliente) => {
            persona[cliente._id.toString()] = cliente;
        });
        DB.collection("item").find().toArray().then(resultsItem => {
            resultsItem.forEach((item) => {
                items[item.nombre] = item;
            });
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
                        console.log(rInventario[hash]);
                        rInventario[hash].contenido = fondo;
                    }
                })
            DB.collection("collectiontapatornillos").find().toArray().then(resultsTapatornillos => {
                resultsTapatornillos.forEach((tapatornillos) => {
                    let hash = MD5(items["Tapatornillos"]._id.toString() + tapatornillos.color + tapatornillos.medidas + tapatornillos.marca).toString();
                    if (rInventario[hash]) {
                        rInventario[hash].contenido = tapatornillos;
                    }
                })
            DB.collection("color").find().toArray().then(resultsColor => {
                resultsColor.forEach((color) => {
                    items[color.nombre] = color;
                });
                DB.collection("medidas").find().toArray().then(resultMedida => {
                    resultMedida.forEach((medida) => {
                        items[medida.nombre] = medida;
                    });
                    DB.collection("marcas").find().toArray().then(resultMarcas => {
                        resultMarcas.forEach((marca) => {
                            items[marca.nombre] = marca;
                        });
                        DB.collection("unidad").find().toArray().then(resultUnidad => {
                            let fecha = getFecha();
                            console.log(fecha);
                            DB.collection("historial").find({
                                "fecha": {$regex : fecha},
                                "tipo_entrada": "pedido"
                            }).toArray().then(resultHistorial => {
                                res.render('pages/pedidos', {
                                    cliente: resultsCliente,
                                    persona: persona,
                                    item: resultsItem,
                                    items: items,
                                    color: resultsColor, 
                                    medida: resultMedida,
                                    marca: resultMarcas,
                                    unidad: resultUnidad,
                                    historial: resultHistorial,
                                    inventario: rInventario,
                                    _inventario: resultsInventario,
                                    _control: resultsControl
                                });
                            })
                            .catch(error => console.error(error))
                            .finally(data => client.close())
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

// ingresos page
app.get('/ingresos', function(req, res) {
    const client = new MongoClient(uri);
    client.connect();
    var DB = client.db();
    var items = {};

    DB.collection("inventario").find().toArray().then(resultsInventario => {
        var rInventario = {};
        resultsInventario.forEach((value) => {
            rInventario[value.codigo] = value;
        });
    DB.collection("control_producto").find().toArray().then(resultsControl => {
    DB.collection("item").find().toArray().then(resultsItem => {
        var items = {};
        resultsItem.forEach((item) => {
            items[item.nombre] = item;
        });
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
                console.log(rInventario[hash]);
                rInventario[hash].contenido = fondo;
            }
        })
    DB.collection("collectiontapatornillos").find().toArray().then(resultsTapatornillos => {
        resultsTapatornillos.forEach((tapatornillos) => {
            let hash = MD5(items["Tapatornillos"]._id.toString() + tapatornillos.color + tapatornillos.medidas + tapatornillos.marca).toString();
            if (rInventario[hash]) {
                rInventario[hash].contenido = tapatornillos;
            }
        })
    DB.collection("collectionprovedor").find().toArray().then(resultsProvedor => {
        DB.collection("item").find().toArray().then(resultsItem => {
            resultsItem.forEach((item)=>{
                items[item.nombre] = item;
            });
            DB.collection("color").find().toArray().then(resultsColor => {
                resultsColor.forEach((color)=>{
                    items[color.nombre] = color;
                });
                DB.collection("medidas").find().toArray().then(resultMedida => {
                    resultMedida.forEach((medida)=>{
                        items[medida.nombre] = medida;
                    });
                    DB.collection("marcas").find().toArray().then(resultMarcas => {
                        resultMarcas.forEach((marca)=>{
                            items[marca.nombre] = marca;
                        });
                        DB.collection("unidad").find().toArray().then(resultUnidad => {
                            let fecha = getFecha();
                            console.log(fecha);
                            DB.collection("historial").find({
                                "fecha": {$regex : fecha},
                                "tipo_entrada": "ingreso"
                            }).toArray().then(resultHistorial => {
                                res.render('pages/ingreso', {
                                    provedor: resultsProvedor, 
                                    item: resultsItem,
                                    items: items,
                                    color: resultsColor, 
                                    medida: resultMedida,
                                    marca: resultMarcas,
                                    unidad: resultUnidad,
                                    historial: resultHistorial,
                                    inventario: rInventario,
                                    _inventario: resultsInventario,
                                    _control: resultsControl
                                });
                            })
                            .catch(error => console.error(error))
                            .finally(data => client.close())
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

app.post('/addicionar_ingreso', (req, res) => {
    const client = new MongoClient(uri);
    client.connect();

    console.log("body:",req.body);
    let tipoItem = req.body.text.item.toLowerCase();
    let tipoUnidad = req.body.nombreDeUnidad.toLowerCase();
    let [color, medida] = formatColorMedida(req.body);

    let CollectionItem = client.db().collection("collection" + tipoItem);
    var CollectionInventario = client.db().collection("inventario");

    let filtro = {
        "provedor": req.body.cliente,
        "color":    color,
        "medidas":  medida,
        "marca":    req.body.marca
    };
    console.log(filtro);

    let hash = getInventarioMD5(req.body);
    console.log(hash);
    CollectionInventario.findOne({"codigo":hash}).then(INVENTARIO => {
        console.log(INVENTARIO);
        CollectionItem.find(filtro).toArray().then(item => {
            console.log(item);
            if (item.length == 0) {
                res.status(404).json({ok: false, message: "No existe el producto de esas caracteristicas en el catalogo." });
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
                var Collection = client.db().collection("historial");
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
                .finally(data => client.close());
            }).catch(error => console.error(error))
        }).catch(error => console.error(error));
    }).catch(error => console.error(error));
})

app.post('/addicionar_pedido',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();

    console.log("body: ",req.body);
    let tipoItem = req.body.text.item.toLowerCase();
    let tipoUnidad = req.body.nombreDeUnidad.toLowerCase();
    let [color, medida] = formatColorMedida(req.body);

    let CollectionItem = client.db().collection("collection" + tipoItem);
    var CollectionInventario = client.db().collection("inventario");

    var filter = {
        "color":    color,
        "medidas":  medida,
        "marca":    req.body.marca
    }
    console.log(filter);

    let hash = getInventarioMD5(req.body);
    console.log(hash);
    CollectionInventario.findOne({"codigo":hash}).then(INVENTARIO => {
        console.log("Inventario:", INVENTARIO);
        CollectionItem.find(filter).toArray().then(item => {
            console.log(item);
            var ID = item[0]._id;

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
                } else{
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
                  var CollectionHistorial = client.db().collection("historial");
                  req.body.inventario_id = ID.toString();
                  req.body.item = req.body.text.item;
                  req.body.cliente = req.body.text.cliente;
                  req.body.marca = req.body.text.marca;
                  req.body.medida = req.body.text.medida;
                  req.body.color = req.body.text.color;
                  delete req.body.text;

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
                            const clientDB = new MongoClient(uri);
                            clientDB.connect();
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
                            clientDB.db().collection("collectionCliente").findOne(cliente_nuevo).then(results => {
                                console.log("CLIENTE -> ",results);
                                if (results == null) {
                                    clientDB.db().collection("collectionCliente").insertOne(cliente_nuevo)
                                    .then(results => {
                                        console.log(results, `cliente guardado...`);
                                    })
                                    .catch(error => console.error(error))
                                    .finally(data => clientDB.close());
                                }
                            })
                            .catch(error => console.error(error))
                        }
                  })
                  .catch(error => console.error(error))
                  .finally(data => client.close());
            }).catch(error => console.error(error))
        }).catch(error => console.error(error))
    }).catch(error => console.error(error))
})

app.post('/obtener_precio', (req, res) => {
    const client = new MongoClient(uri);
    client.connect();

    let tipoItem = req.body.item.toLowerCase();
    var Collection = client.db().collection("collection" + tipoItem);
    var jsonQuery;

    console.log(req.body);
    console.log('provedor de compra:',req.body.provedor);
    if (typeof(req.body.provedor) == "undefined") {
        jsonQuery = {
            "color": req.body.color,
            "medidas": req.body.medida,
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
    console.log("parametros de consulta:", jsonQuery);

    Collection.findOne(jsonQuery).then((result) => {
        let precio = .0;
        let precio_metros = .0;
        let precio_caja = 0;

        console.log('producto encontrado:', result);
        if (typeof result == 'undefined' || result == null) {
            res.status(404).json({ok: false, precio: 0.0, message: "Este producto no esta en catalogo"});
            res.end();
            throw "Error: No se encontro precio para este producto";
        }
        if (req.body.tipo_entrada == "ingreso") {
            precio = result.precio_compra;
            precio_metros = result.precio_compra_metros;
            precio_caja = result.precio_compra_caja?result.precio_compra_caja:0;
        } else if (req.body.tipo_entrada == "pedido") {
            precio = result.precio_venta;
            precio_metros = result.precio_venta_metros;
            precio_caja = result.precio_venta_caja?result.precio_venta_caja:0;
        }

        let EXPLICACION = "";
        var producto;
        if (tipoItem == "tapacantos") {
            producto = {rollos:0, cajas:0, metros:0};
            if (req.body.unidad == "metros") {
                producto.rollos = Math.trunc(req.body.cantidad / result.metrosxrollo);

                producto.cajas = Math.trunc(producto.rollos / result.rollosxcaja);

                EXPLICACION = `${req.body.cantidad} x ${precio_metros}(pm) Bs`;
                precio = req.body.cantidad * precio_metros;
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
                let e_message;
                if (req.body.unidad.length <= 0) {
                    e_message = "No se envio la Unidad del pedido.";
                } else {
                    e_message = "Unidad desconocida [" + req.body.unidad + "]";
                }
                res.status(404).json({ok: true, precio: precio, message: e_message});
                res.end();
                throw e_message;
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
                let e_message;
                if (req.body.unidad.length <= 0) {
                    e_message = "No se envio la Unidad del pedido.";
                } else {
                    e_message = "Unidad desconocida [" + req.body.unidad + "]";
                }
                res.status(404).json({ok: true, precio: precio, message: e_message});
                res.end();
                throw e_message;
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
                let e_message;
                if (req.body.unidad.length <= 0) {
                    e_message = "No se envio la Unidad del pedido.";
                } else {
                    e_message = "Unidad desconocida [" + req.body.unidad + "]";
                }
                res.status(404).json({ok: true, precio: precio, message: e_message});
                res.end();
                throw e_message;
            }
        }
        else if (tipoItem == "pegamento") {

            let e_message;
            if (req.body.unidad.length <= 0) {
                e_message = "No se envio la Unidad del pedido.";
                res.status(404).json({ok: true, precio: precio, message: e_message});
                res.end();
                throw e_message;
            }

            producto = {bolsa:0};
            producto.bolsa = req.body.cantidad;

            EXPLICACION = `${req.body.cantidad} x ${precio} Bs`;
            precio = req.body.cantidad * precio;
        } else {
            res.status(200).json({ok: true, precio: precio, message: "["+tipoItem + "] es un producto no conocido."});
            res.end();
            throw tipoItem + " es un producto desconocido";
        }

        res.status(200).json({ok: true, precio: precio, detalle: producto, message: EXPLICACION});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close());
});

// reporte page
app.get('/reporte', function(req, res) {
    const client = new MongoClient(uri);
    client.connect();
    let DB = client.db();

    DB.collection("inventario").find().toArray().then(resultsInventario => {
        DB.collection("control_producto").find().toArray().then(resultsControl => {
            res.render('pages/reporte01', { 
                _inventario: resultsInventario,
                _control: resultsControl
             });
        })
        .catch(error => console.error(error))
        .finally(data => client.close())
    })
    .catch(error => console.error(error))
});

// tapacantos_standar page
app.get('/contenidos', function(req, res) {
    const client = new MongoClient(uri);
    client.connect();
    var DB = client.db();
    let colores = {};
    let medidas = {};
    let provedores = {};
    let marcas = {};

    DB.collection("inventario").find().toArray().then(resultsInventario => {
    DB.collection("control_producto").find().toArray().then(resultsControl => {
   
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
                                _control: resultsControl
                            });
                        })
                        .catch(error => console.error(error))
                        .finally(data => client.close())
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
app.get('/historial', function(req, res) {
    const client = new MongoClient(uri);
    client.connect();
    var DB = client.db();
  
    DB.collection("inventario").find().toArray().then(resultsInventario => {
    DB.collection("control_producto").find().toArray().then(resultsControl => {

        DB.collection("historial").find().toArray().then(results => {
            res.render('pages/historial', { 
                historial: results,
                _inventario: resultsInventario,
                _control: resultsControl
            });
        })
        .catch(error => console.error(error))
        .finally(data => client.close())
    })
    .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
});

// historia page
app.get('/inventario', function(req, res) {
    const client = new MongoClient(uri);
    client.connect();
    var DB = client.db();

    let producto_item ={};
    let colores = {};
    let medidas = {};
    let marcas = {};
    var control = [];
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
                // orfan 68f75d027e9060139a86229de5cb98e7
                let item = producto_item[nombre];
                let indexHash = MD5(item._id.toString() + producto.color + producto.medidas + producto.marca).toString();
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
                            DB.collection("control_producto").find().toArray().then(resultControl => {
                                resultControl.forEach(element => {
                                    control[element.item] = element;
                                });
                                res.render('pages/inventario', {
                                    colores: colores,
                                    medidas: medidas,
                                    marcas: marcas,
                                    inventario: rInventario,
                                    control: control,
                                    size: (Object.keys(rInventario).length - 1),  //less 1 function
                                    _inventario: resultsInventario,
                                    _control: resultControl
                                });
                            })
                            .catch(error => console.error(error))
                            .finally(data => client.close())
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
app.get('/preferencias', function(req, res) {
    const client = new MongoClient(uri);
    client.connect();
    
    var CollectionInventario = client.db().collection("inventario");
    var CollectionControlProducto = client.db().collection("control_producto");
    var CollectionColor = client.db().collection("color");
    var CollectionMarcas = client.db().collection("marcas");
    var CollectionMedidas = client.db().collection("medidas");
    var CollectionProvedor = client.db().collection("collectionprovedor");
    var CollectionItem = client.db().collection("item");
    var CollectionCliente = client.db().collection("collectionCliente");
    var CollectionMelamina = client.db().collection("collectionmelamina");
    var CollectionTapacantos = client.db().collection("collectiontapacantos");
    var CollectionPegamento = client.db().collection("collectionpegamento");
    var CollectionFondo = client.db().collection("collectionfondo");
    var CollectionTapatornillos = client.db().collection("collectiontapatornillos");

    CollectionInventario.find().toArray().then(resultsInventario => {
    CollectionControlProducto.find().toArray().then(resultsControl => {
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
                                                    _inventario: resultsInventario,
                                                    _control: resultsControl
                                                });
                                            })
                                            .catch(error => console.error(error))
                                            .finally(data => client.close())
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

app.post('/nuevo_color',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();
    console.log("color",req.body);

    let CollectionColor = client.db().collection("color");

    CollectionColor.insertOne(req.body).then(results => {

        console.log(results);
        console.log(`Un color nuevo addicionado a catalogo...`);

        res.status(200).json({ok: true, message: "Un color nuevo addicionado a catalogo....", action: "reload"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close());
})

app.put('/actualizar_color/:id',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();   

    console.log("color: ", req.body);
    let idc = new ObjectID(req.params.id);
    console.log(req.params.id, idc);

    let CollectionColor = client.db().collection("color");

    CollectionColor.updateOne({"_id": idc}, {$set: req.body}).then(results => {
        console.log(results);
        console.log(`Color ${req.body.nombre} actualizado...`);
        res.status(200).json({ok: true, message: "Color (" + req.body.nombre + ") actualizado.", action: "none"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close());
})

app.delete('/delete_color/:id', (req, res) => {
    const client = new MongoClient(uri);
    client.connect();
    
    var CollectionColor = client.db().collection("color");
    let cid = new ObjectID(req.params.id);

    CollectionColor.deleteOne({"_id": cid }).then(result => {
        console.log(result);
        console.log(`Color ${req.params.id} borrado...`);
        res.status(200).json({ok: true, message: "Color (" + req.params.id + ") borrado.", action: "none"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close())
})

app.post('/nueva_marca',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();
    console.log("marca",req.body);

    let CollectionMarca = client.db().collection("marcas");

    CollectionMarca.insertOne(req.body).then(results => {

        console.log(results);
        console.log(`Uns marca nuevo addicionado a catalogo...`);

        res.status(200).json({ok: true, message: "Una marca nuevo addicionado a catalogo....", action: "reload"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close());
})

app.put('/actualizar_marca/:id',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();   

    console.log("marca: ", req.body);
    let idc = new ObjectID(req.params.id);
    console.log(req.params.id, idc);

    let CollectionMarca = client.db().collection("marcas");

    CollectionMarca.updateOne({"_id": idc}, {$set: req.body}).then(results => {
        console.log(results);
        console.log(`Marca ${req.body.nombre} actualizado...`);
        res.status(200).json({ok: true, message: "Marca (" + req.body.nombre + ") actualizado.", action: "none"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close());
})

app.delete('/delete_marca/:id', (req, res) => {
    const client = new MongoClient(uri);
    client.connect();
    
    var CollectionMarca = client.db().collection("marcas");
    let cid = new ObjectID(req.params.id);

    CollectionMarca.deleteOne({"_id": cid }).then(result => {
        console.log(result);
        console.log(`Marca ${req.params.id} borrado...`);
        res.status(200).json({ok: true, message: "Marca (" + req.params.id + ") borrado.", action: "none"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close())
})

app.post('/nueva_medida',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();
    console.log("medida",req.body);

    let CollectionMedida = client.db().collection("medidas");

    CollectionMedida.insertOne(req.body).then(results => {

        console.log(results);
        console.log(`Una medida nueva fue addicionada al catalogo...`);

        res.status(200).json({ok: true, message: "Una medida nueva addicionada al catalogo....", action: "reload"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close());
})

app.put('/actualizar_medida/:id',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();   

    console.log("medida: ", req.body);
    let idc = new ObjectID(req.params.id);
    console.log(req.params.id, idc);

    let CollectionMedida = client.db().collection("medidas");

    CollectionMedida.updateOne({"_id": idc}, {$set: req.body}).then(results => {
        console.log(results);
        console.log(`Medida ${req.body.nombre} actualizado...`);
        res.status(200).json({ok: true, message: "Medida (" + req.body.nombre + ") actualizado.", action: "none"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close());
})

app.delete('/delete_medida/:id', (req, res) => {
    const client = new MongoClient(uri);
    client.connect();
    
    var CollectionMedida = client.db().collection("medidas");
    let cid = new ObjectID(req.params.id);

    CollectionMedida.deleteOne({"_id": cid }).then(result => {
        console.log(result);
        console.log(`Medida ${req.params.id} borrado...`);
        res.status(200).json({ok: true, message: "Medida (" + req.params.id + ") borrado.", action: "none"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close())
})

app.post('/nuevo_provedor',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();
    console.log("provedor",req.body);

    let CollectionProvedor = client.db().collection("collectionprovedor");

    CollectionProvedor.insertOne(req.body).then(results => {

        console.log(results);
        console.log(`Un provedor nuevo fue addicionado al catalogo...`);

        res.status(200).json({ok: true, message: "Un provedor nuevo fue addicionado al catalogo....", action: "reload"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close());
})

app.put('/actualizar_provedor/:id',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();   

    console.log("provedor: ", req.body);
    let idc = new ObjectID(req.params.id);
    console.log(req.params.id, idc);

    let CollectionProvedor = client.db().collection("collectionprovedor");

    CollectionProvedor.updateOne({"_id": idc}, {$set: req.body}).then(results => {
        console.log(results);
        console.log(`Provedor ${req.body.nombre} actualizado...`);
        res.status(200).json({ok: true, message: "Provedor (" + req.body.nombre + ") actualizado.", action: "none"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close());
})

app.delete('/delete_provedor/:id', (req, res) => {
    const client = new MongoClient(uri);
    client.connect();
    
    var CollectionProvedor = client.db().collection("collectionprovedor");
    let cid = new ObjectID(req.params.id);

    CollectionProvedor.deleteOne({"_id": cid }).then(result => {
        console.log(result);
        console.log(`Provedor ${req.params.id} borrado...`);
        res.status(200).json({ok: true, message: "Provedor (" + req.params.id + ") borrado.", action: "none"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close())
})

app.post('/nuevo_item',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();
    console.log("item",req.body);

    let CollectionItem = client.db().collection("item");

    CollectionItem.insertOne(req.body).then(results => {

        console.log(results);
        console.log(`Un item nuevo fue addicionado al catalogo...`);

        res.status(200).json({ok: true, message: "Un item nuevo fue addicionado al catalogo....", action: "reload"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close());
})

app.put('/actualizar_item/:id',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();   

    console.log("item: ", req.body);
    let idc = new ObjectID(req.params.id);
    console.log(req.params.id, idc);

    let CollectionItem = client.db().collection("item");

    CollectionItem.updateOne({"_id": idc}, {$set: req.body}).then(results => {
        console.log(results);
        console.log(`Item ${req.body.nombre} actualizado...`);
        res.status(200).json({ok: true, message: "Item (" + req.body.nombre + ") actualizado.", action: "none"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close());
})

app.delete('/delete_item/:id', (req, res) => {
    const client = new MongoClient(uri);
    client.connect();
    
    var CollectionItem = client.db().collection("item");
    let cid = new ObjectID(req.params.id);

    CollectionItem.deleteOne({"_id": cid }).then(result => {
        console.log(result);
        console.log(`Item ${req.params.id} borrado...`);
        res.status(200).json({ok: true, message: "Item (" + req.params.id + ") borrado.", action: "none"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close())
})

app.post('/nuevo_cliente',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();
    console.log("cliente",req.body);

    let CollectionCliente = client.db().collection("collectionCliente");

    CollectionCliente.insertOne(req.body).then(results => {

        console.log(results);
        console.log(`Un Cliente nuevo fue addicionado al catalogo...`);

        res.status(200).json({ok: true, message: "Un Cliente nuevo fue addicionado al catalogo....", action: "reload"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close());
})

app.put('/actualizar_cliente/:id',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();   

    console.log("cliente: ", req.body);
    let idc = new ObjectID(req.params.id);
    console.log(req.params.id, idc);

    let CollectionCliente = client.db().collection("collectionCliente");

    CollectionCliente.updateOne({"_id": idc}, {$set: req.body}).then(results => {
        console.log(results);
        console.log(`Cliente ${req.body.nombre} actualizado...`);
        res.status(200).json({ok: true, message: "Cliente (" + req.body.nombre + ") actualizado.", action: "none"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close());
})

app.delete('/delete_cliente/:id', (req, res) => {
    const client = new MongoClient(uri);
    client.connect();
    
    var CollectionCliente = client.db().collection("collectionCliente");
    let cid = new ObjectID(req.params.id);

    CollectionCliente.deleteOne({"_id": cid }).then(result => {
        console.log(result);
        console.log(`Cliente ${req.params.id} borrado...`);
        res.status(200).json({ok: true, message: "Cliente (" + req.params.id + ") borrado.", action: "none"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close())
})

app.post('/nueva_melamina',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();
    console.log("nueva melamina",req.body);

    let CollectionItem = client.db().collection("item");
    CollectionItem.findOne({nombre:"Melamina"}).then(producto => {
        console.log(producto);

        let CollectionMelamina = client.db().collection("collectionmelamina");
        let hash = MD5(producto._id.toString() + req.body.color + req.body.medidas + req.body.marca).toString();

        req.body.hash_inventario = hash;
        CollectionMelamina.insertOne(req.body).then(results => {

            console.log(results);

            let CollectionInventario = client.db().collection("inventario");
            console.log(producto._id.toString(), req.body.color, req.body.medidas, req.body.marca);

            CollectionInventario.findOne({codigo: hash}).then(results => {

                console.log("Existe inventario? ",results);

                if (!results) {
                    console.log("Nuevo md5", hash);
                    let inv = {
                        codigo: hash,
                        existencia: 0,
                        metraje:-1
                    };

                    CollectionInventario.insertOne(inv).then(results => {
                        console.log(results);
                        console.log(`Una melamina nueva fue adicionada al catalogo e inventario...`);

                        res.status(200).json({ok: true, message: "Una melamina nueva fue adicionada al catalogo e inventario....", action: "reload"});
                        res.end();

                    })
                    .catch(error => console.error(error))
                    .finally(data => client.close());
                } else {
                    console.log(`Una melamina nueva fue adicionada al catalogo...`);

                    res.status(200).json({ok: true, message: "Una melamina nueva fue adicionada al catalogo....", action: "reload"});
                    res.end();
                    client.close();
                }
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

app.put('/actualizar_melamina/:id',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();

    let CollectionItem = client.db().collection("item");
    let CollectionInventario = client.db().collection("inventario");

    CollectionItem.findOne({nombre:"Melamina"}).then(producto => {

        console.log("Melamina: ", req.body);
        let idc = new ObjectID(req.params.id);
        console.log("param: "+req.params.id);

        let hashOld = req.body.hash_inventario;
        let hashNew = MD5(producto._id.toString() + req.body.color + req.body.medidas + req.body.marca).toString();
        req.body.hash_inventario = hashNew;

        let CollectionProducto = client.db().collection("collectionmelamina");

        CollectionProducto.updateOne({"_id": idc}, {$set: req.body}).then(results => {
            console.log(results);
            console.log("hash Nuevo:", hashNew, "hash viejo:", hashOld);
            if (hashNew != hashOld) {
                CollectionInventario.find({codigo: hashNew}).toArray().then(inventario => {
                    console.log(inventario);
                    if (!inventario.length) { //no existe inventario
                        CollectionProducto.find({hash_inventario: hashOld}).toArray().then(productos => {
                            console.log(productos);
                            if (productos && productos.length <= 0) {//no existe producto ENLAZADO al antiguo HASH
                                //actualiza el inventario existente
                                CollectionInventario.updateOne({codigo: hashOld}, {$set:{codigo: hashNew}}).then(results => {
                                    console.log(results);
                                    console.log(`Fue actualizado en catalogo e inventario...`);

                                    res.status(200).json({ok: true, message: "(" + req.body.color + ") Fue actualizado en catalogo e inventario....", new_hash: hashNew, action: "reload"});
                                    res.end();
                                })
                                .catch(error => console.error(error))
                                .finally(data => client.close());
                            } else {
                                let inv = {
                                    codigo: hashNew,
                                    existencia: 0,
                                    metraje: -3
                                };

                                CollectionInventario.insertOne(inv).then(results => {
                                    console.log(results);
                                    console.log(`El Melamina se actualizo y se creo un nuevo inventario ${hashNew}...`);

                                    res.status(200).json({ok: true, message: `El Melamina se actualizo y se creo un nuevo inventario ${hashNew}...`, new_hash: hashNew, action: "reload"});
                                    res.end();
                                })
                                .catch(error => console.error(error))
                                .finally(data => client.close());
                            }
                        })
                        .catch(error => console.error(error))
                    } else {  //existe inventario
                        CollectionProducto.find({hash_inventario: hashOld}).toArray().then(productos => {
                            console.log(productos);
                            if (productos && productos.length <= 0) {//no existe producto ENLAZADO al antiguo HASH

                                //Se suma existencia al nuevo inventario enlazado???
                                CollectionInventario.deleteOne({codigo: hashOld}).then(results => {
                                    console.log(results);
                                    console.log(`Se borro inventario viejo y se actualizo Melamina con enlaze a otro inventario...`);

                                    res.status(200).json({ok: true, message: "(" + req.body.color + ") Se borro inventario viejo y se actualizo Melamina con enlaze a otro inventario...", new_hash: hashNew, action: "reload"});
                                    res.end();
                                })
                                .catch(error => console.error(error))
                                .finally(data => client.close());
                            } else {
                                console.log(`Se actualizo Melamina y se cambio el enlaze a otro inventario...`);

                                res.status(200).json({ok: true, message: "(" + req.body.color + ") Se actualizo Melamina y se cambio el enlaze a otro inventario......", new_hash: hashNew, action: "reload"});
                                res.end();
                                client.close();
                            }
                        })
                        .catch(error => console.error(error))
                    }
                })
                .catch(error => console.error(error))
            } else {
                //no se envio datos actualizado, o no se actualizo en el UI
                console.log(results);
                console.log(`Melamina  ${idc} conserva los datos...`);
                res.status(200).json({ok: true, message: "Melamina (" + idc + ") conserva los datos.", new_hash: hashNew, action: "none"});
                res.end();
                client.close();
            }
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

app.delete('/delete_melamina/:id', (req, res) => {
    const client = new MongoClient(uri);
    client.connect();

    let CollectionItem = client.db().collection("item");
    var CollectionProducto = client.db().collection("collectionmelamina");
    var CollectionInventario = client.db().collection("inventario");
    let cid = new ObjectID(req.params.id);
    console.log("ID: ",req.params.id);

    CollectionItem.findOne({nombre:"Melamina"}).then(producto => {

        CollectionProducto.findOne({"_id": cid }).then(melamina => {

            let hash = MD5(producto._id.toString() + melamina.color + melamina.medidas + melamina.marca).toString();

            if (melamina.hash_inventario != hash) {
                console.log("Discrepancias en hash, inventarioID: ",melamina.hash_inventario, " hash generado:" ,hash);

                res.status(500).json({ok: true, message: "No se pudo borrar Melamina (" + req.params.id + ") revise el codigo de inventario.", action: "none"});
                res.end();
                throw "Revise el hash de inventario vs producto...";
            }

            CollectionProducto.find({"hash_inventario": hash }).toArray().then(result => {
                let productosDeInventario = result.length;
                console.log(result);

                CollectionProducto.deleteOne({"_id": cid }).then(result => {
                    console.log(result);

                    if (productosDeInventario > 1) {
                        console.log("Invantario [codigo: "+hash+"] se conserva, existe para otros productos.");
                        console.log(`Melamina ${req.params.id} fue borrado...`);

                        res.status(200).json({ok: true, message: "Melamina (" + req.params.id + ") e inventario ("+hash+") fueron borrados.", action: "none"});
                        res.end();
                        client.close();
                    } else {
                        CollectionInventario.deleteOne({"codigo": hash }).then(result => {
                            console.log(result);
                            console.log(`Melamina y su inventario ${req.params.id} fueron borrados...`);

                            res.status(200).json({ok: true, message: "Melamina (" + req.params.id + ") e inventario ("+hash+") fueron borrados.", action: "none"});
                            res.end();
                        })
                        .catch(error => console.error(error))
                        .finally(data => client.close())
                    }
                })
                .catch(error => console.error(error))
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

app.post('/nuevo_tapacantos',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();
    console.log("tapacantos",req.body);

    let CollectionItem = client.db().collection("item");
    CollectionItem.findOne({nombre:"Tapacantos"}).then(producto => {
        console.log(producto);
    
        let CollectionTapacantos = client.db().collection("collectiontapacantos");
        let hash = MD5(producto._id.toString() + req.body.color + req.body.medidas + req.body.marca).toString();

        req.body.hash_inventario = hash;
        CollectionTapacantos.insertOne(req.body).then(results => {

            console.log(results);

            let CollectionInventario = client.db().collection("inventario");
            console.log(producto._id.toString(), req.body.color, req.body.medidas, req.body.marca);
            let hash = MD5(producto._id.toString() + req.body.color + req.body.medidas + req.body.marca).toString();

            CollectionInventario.findOne({codigo: hash}).then(results => {

                console.log("Existe inventario? ",results);

                if (!results) {
                    console.log("Nuevo md5", hash);
                    let inv = {
                        codigo: hash,
                        existencia: 0,
                        metraje:0
                    };

                    CollectionInventario.insertOne(inv).then(results => {
                        console.log(results);
                        console.log(`Un tapacantos nuevo fue adicionado al catalogo e inventario...`);

                        res.status(200).json({ok: true, message: "Un tapacantos nuevo fue adicionado al catalogo e inventario....", action: "reload"});
                        res.end();

                    })
                    .catch(error => console.error(error))
                    .finally(data => client.close());
                } else {
                    console.log(`Un tapacantos nuevo fue adicionado al catalogo...`);

                    res.status(200).json({ok: true, message: "Un tapacantos nuevo fue adicionado al catalogo....", action: "reload"});
                    res.end();
                    client.close();
                }
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

app.put('/actualizar_tapacantos/:id',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();

    let CollectionItem = client.db().collection("item");
    let CollectionInventario = client.db().collection("inventario");

    CollectionItem.findOne({nombre:"Tapacantos"}).then(producto => {

        console.log("tapacantos: ", req.body);
        let idc = new ObjectID(req.params.id);
        console.log("param: "+req.params.id);

        let hashOld = req.body.hash_inventario;
        let hashNew = MD5(producto._id.toString() + req.body.color + req.body.medidas + req.body.marca).toString();
        req.body.hash_inventario = hashNew;

        let CollectionProducto = client.db().collection("collectiontapacantos");

        CollectionProducto.updateOne({"_id": idc}, {$set: req.body}).then(results => {
            console.log(results);
            console.log("hash Nuevo:", hashNew, "hash viejo:", hashOld);
            if (hashNew != hashOld) {
                CollectionInventario.find({codigo: hashNew}).toArray().then(inventario => {
                    console.log(inventario);
                    if (!inventario.length) { //no existe inventario
                        CollectionProducto.find({hash_inventario: hashOld}).toArray().then(productos => {
                            console.log(productos);
                            if (productos && productos.length <= 0) {//no existe producto ENLAZADO al antiguo HASH
                                //actualiza el inventario existente
                                CollectionInventario.updateOne({codigo: hashOld}, {$set:{codigo: hashNew}}).then(results => {
                                    console.log(results);
                                    console.log(`Fue actualizado en catalogo e inventario...`);

                                    res.status(200).json({ok: true, message: "(" + req.body.color + ") Fue actualizado en catalogo e inventario....", new_hash: hashNew, action: "reload"});
                                    res.end();
                                })
                                .catch(error => console.error(error))
                                .finally(data => client.close());
                            } else {
                                let inv = {
                                    codigo: hashNew,
                                    existencia: 0,
                                    metraje: -3
                                };

                                CollectionInventario.insertOne(inv).then(results => {
                                    console.log(results);
                                    console.log(`El Tapacantos se actualizo y se creo un nuevo inventario ${hashNew}...`);

                                    res.status(200).json({ok: true, message: `El Tapacantos se actualizo y se creo un nuevo inventario ${hashNew}...`, new_hash: hashNew, action: "reload"});
                                    res.end();
                                })
                                .catch(error => console.error(error))
                                .finally(data => client.close());
                            }
                        })
                        .catch(error => console.error(error))
                    } else {  //existe inventario
                        CollectionProducto.find({hash_inventario: hashOld}).toArray().then(productos => {
                            console.log(productos);
                            if (productos && productos.length <= 0) {//no existe producto ENLAZADO al antiguo HASH

                                //Se suma existencia al nuevo inventario enlazado???
                                CollectionInventario.deleteOne({codigo: hashOld}).then(results => {
                                    console.log(results);
                                    console.log(`Se borro inventario viejo y se actualizo Tapacantos con enlaze a otro inventario...`);

                                    res.status(200).json({ok: true, message: "(" + req.body.color + ") Se borro inventario viejo y se actualizo Tapacantos con enlaze a otro inventario...", new_hash: hashNew, action: "reload"});
                                    res.end();
                                })
                                .catch(error => console.error(error))
                                .finally(data => client.close());
                            } else {
                                console.log(`Se actualizo Tapacantos y se cambio el enlaze a otro inventario...`);

                                res.status(200).json({ok: true, message: "(" + req.body.color + ") Se actualizo Tapacantos y se cambio el enlaze a otro inventario......", new_hash: hashNew, action: "reload"});
                                res.end();
                                client.close();
                            }
                        })
                        .catch(error => console.error(error))
                    }
                })
                .catch(error => console.error(error))
            } else {
                //no se envio datos actualizado, o no se actualizo en el UI
                console.log(results);
                console.log(`Tapacantos  ${idc} conserva los datos...`);
                res.status(200).json({ok: true, message: "Tapacantos (" + idc + ") conserva los datos.", new_hash: hashNew, action: "none"});
                res.end();
                client.close();
            }
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

app.delete('/delete_tapacantos/:id', (req, res) => {
    const client = new MongoClient(uri);
    client.connect();

    let CollectionItem = client.db().collection("item");
    var CollectionProducto = client.db().collection("collectiontapacantos");
    var CollectionInventario = client.db().collection("inventario");
    let cid = new ObjectID(req.params.id);
    console.log("ID: ",req.params.id);

    CollectionItem.findOne({nombre:"Tapacantos"}).then(producto => {

        CollectionProducto.findOne({"_id": cid }).then(tapacantos => {

            let hash = MD5(producto._id.toString() + tapacantos.color + tapacantos.medidas + tapacantos.marca).toString();

            if (tapacantos.hash_inventario != hash) {
                console.log("Discrepancias en hash, inventarioID: ",tapacantos.hash_inventario, " hash generado:" ,hash);

                res.status(500).json({ok: true, message: "No se pudo borrar Tapacantos (" + req.params.id + ") revise el codigo de inventario.", action: "none"});
                res.end();
                throw "Revise el hash de inventario vs producto...";
            }

            CollectionProducto.find({"hash_inventario": hash }).toArray().then(result => {
                let productosDeInventario = result.length;
                console.log(result);

                CollectionProducto.deleteOne({"_id": cid }).then(result => {
                    console.log(result);

                    if (productosDeInventario > 1) {
                        console.log("Invantario [codigo: "+hash+"] se conserva, existe para otros productos.");
                        console.log(`Tapacantos ${req.params.id} fue borrado...`);

                        res.status(200).json({ok: true, message: "Tapacantos (" + req.params.id + ") e inventario ("+hash+") fueron borrados.", action: "none"});
                        res.end();
                        client.close();
                    } else {
                        CollectionInventario.deleteOne({"codigo": hash }).then(result => {
                            console.log(result);
                            console.log(`Tapacantos y su inventario ${req.params.id} fueron borrados...`);

                            res.status(200).json({ok: true, message: "Tapacantos (" + req.params.id + ") e inventario ("+hash+") fueron borrados.", action: "none"});
                            res.end();
                        })
                        .catch(error => console.error(error))
                        .finally(data => client.close())
                    }
                })
                .catch(error => console.error(error))
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

app.post('/nuevo_pegamento',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();
    console.log("nuevo pegamento",req.body);

    let CollectionItem = client.db().collection("item");
    CollectionItem.findOne({nombre:"Pegamento"}).then(producto => {
        console.log("item:",producto);

        let CollectionPegamento = client.db().collection("collectionpegamento");
        let hash = MD5(producto._id.toString() + req.body.marca).toString();

        req.body.hash_inventario = hash;
        CollectionPegamento.insertOne(req.body).then(results => {

            console.log(results);

            let CollectionInventario = client.db().collection("inventario");
            console.log(producto._id.toString(),  req.body.marca);

            CollectionInventario.findOne({codigo: hash}).then(results => {

                console.log("Existe inventario? ",results);

                if (!results) {
                    console.log("Nuevo md5", hash);
                    let inv = {
                        codigo: hash,
                        existencia: 0,
                        metraje:-2
                    };

                    CollectionInventario.insertOne(inv).then(results => {
                        console.log(results);
                        console.log(`Un pegamento nuevo fue adicionado al catalogo e inventario...`);

                        res.status(200).json({ok: true, message: "Un pegamento nuevo fue adicionado al catalogo e inventario....", action: "reload"});
                        res.end();

                    })
                    .catch(error => console.error(error))
                    .finally(data => client.close());
                } else {
                    console.log(`Un pegamento nuevo fue adicionado al catalogo...`);

                    res.status(200).json({ok: true, message: "Un pegamento nuevo fue adicionado al catalogo....", action: "reload"});
                    res.end();
                    client.close();
                }
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

app.put('/actualizar_pegamento/:id',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();

    let CollectionItem = client.db().collection("item");
    let CollectionInventario = client.db().collection("inventario");

    CollectionItem.findOne({nombre:"Pegamento"}).then(producto => {

        console.log("pegamento: ", req.body);
        let idc = new ObjectID(req.params.id);
        console.log("param: "+req.params.id);

        let hashOld = req.body.hash_inventario;
        let hashNew = MD5(producto._id.toString() + req.body.color + req.body.medidas + req.body.marca).toString();
        req.body.hash_inventario = hashNew;

        let CollectionProducto = client.db().collection("collectionpegamento");

        CollectionProducto.updateOne({"_id": idc}, {$set: req.body}).then(results => {
            console.log(results);
            console.log("hash Nuevo:", hashNew, "hash viejo:", hashOld);
            if (hashNew != hashOld) {
                CollectionInventario.find({codigo: hashNew}).toArray().then(inventario => {
                    console.log(inventario);
                    if (!inventario.length) { //no existe inventario
                        CollectionProducto.find({hash_inventario: hashOld}).toArray().then(productos => {
                            console.log(productos);
                            if (productos && productos.length <= 0) {//no existe producto ENLAZADO al antiguo HASH
                                //actualiza el inventario existente
                                CollectionInventario.updateOne({codigo: hashOld}, {$set:{codigo: hashNew}}).then(results => {
                                    console.log(results);
                                    console.log(`Fue actualizado en catalogo e inventario...`);

                                    res.status(200).json({ok: true, message: "(" + req.body.color + ") Fue actualizado en catalogo e inventario....", new_hash: hashNew, action: "reload"});
                                    res.end();
                                })
                                .catch(error => console.error(error))
                                .finally(data => client.close());
                            } else {
                                let inv = {
                                    codigo: hashNew,
                                    existencia: 0,
                                    metraje: -3
                                };

                                CollectionInventario.insertOne(inv).then(results => {
                                    console.log(results);
                                    console.log(`El pegamento se actualizo y se creo un nuevo inventario ${hashNew}...`);

                                    res.status(200).json({ok: true, message: `El pegamento se actualizo y se creo un nuevo inventario ${hashNew}...`, new_hash: hashNew, action: "reload"});
                                    res.end();
                                })
                                .catch(error => console.error(error))
                                .finally(data => client.close());
                            }
                        })
                        .catch(error => console.error(error))
                    } else {  //existe inventario
                        CollectionProducto.find({hash_inventario: hashOld}).toArray().then(productos => {
                            console.log(productos);
                            if (productos && productos.length <= 0) {//no existe producto ENLAZADO al antiguo HASH

                                //Se suma existencia al nuevo inventario enlazado???
                                CollectionInventario.deleteOne({codigo: hashOld}).then(results => {
                                    console.log(results);
                                    console.log(`Se borro inventario viejo y se actualizo pegamento con enlaze a otro inventario...`);

                                    res.status(200).json({ok: true, message: "(" + req.body.color + ") Se borro inventario viejo y se actualizo pegamento con enlaze a otro inventario...", new_hash: hashNew, action: "reload"});
                                    res.end();
                                })
                                .catch(error => console.error(error))
                                .finally(data => client.close());
                            } else {
                                console.log(`Se actualizo pegamento y se cambio el enlaze a otro inventario...`);

                                res.status(200).json({ok: true, message: "(" + req.body.color + ") Se actualizo pegamento y se cambio el enlaze a otro inventario......", new_hash: hashNew, action: "reload"});
                                res.end();
                                client.close();
                            }
                        })
                        .catch(error => console.error(error))
                    }
                })
                .catch(error => console.error(error))
            } else {
                //no se envio datos actualizado, o no se actualizo en el UI
                console.log(results);
                console.log(`pegamento  ${idc} conserva los datos...`);
                res.status(200).json({ok: true, message: "pegamento (" + idc + ") conserva los datos.", new_hash: hashNew, action: "none"});
                res.end();
                client.close();
            }
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

app.delete('/delete_pegamento/:id', (req, res) => {
    const client = new MongoClient(uri);
    client.connect();

    let CollectionItem = client.db().collection("item");
    var CollectionProducto = client.db().collection("collectionpegamento");
    var CollectionInventario = client.db().collection("inventario");
    let cid = new ObjectID(req.params.id);
    console.log("Id: ",req.params.id);

    CollectionItem.findOne({nombre:"Pegamento"}).then(producto => {

        CollectionProducto.findOne({"_id": cid }).then(pegamento => {

            let hash = MD5(producto._id.toString() + pegamento.marca).toString();

            if (pegamento.hash_inventario != hash) {
                console.log("Discrepancias en hash, inventarioID: ",pegamento.hash_inventario, " hash generado:" ,hash);

                res.status(500).json({ok: true, message: "No se pudo borrar Fondo (" + req.params.id + ") revise  el codigo de inventario.", action: "none"});
                res.end();
                throw "Revise el hash de inventario vs producto...";
            }

            CollectionProducto.find({"hash_inventario": hash }).toArray().then(result => {
                let productosDeInventario = result.length;
                console.log(result);

                CollectionProducto.deleteOne({"_id": cid }).then(result => {
                    console.log(result);

                    if (productosDeInventario > 1) {
                        console.log("Invantario [codigo: "+hash+"] se conserva, existe para otros productos.");
                        console.log(`Pegamento ${req.params.id} fue borrado...`);

                        res.status(200).json({ok: true, message: "Pegamento (" + req.params.id + ") e inventario ("+hash+") fueron borrados.", action: "none"});
                        res.end();
                        client.close();
                    } else {
                        CollectionInventario.deleteOne({"codigo": hash }).then(result => {
                            console.log(result);
                            console.log(`Pegamento y su inventario ${req.params.id} fueron borrados...`);

                            res.status(200).json({ok: true, message: "Pegamento (" + req.params.id + ") e inventario ("+hash+") fueron borrados.", action: "none"});
                            res.end();
                        })
                        .catch(error => console.error(error))
                        .finally(data => client.close())
                    }
                })
                .catch(error => console.error(error))
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

app.post('/nuevo_fondo',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();
    console.log("fondo",req.body);

    let CollectionItem = client.db().collection("item");
    CollectionItem.findOne({nombre:"Fondo"}).then(producto => {
        console.log(producto);
        let CollectionPegamento = client.db().collection("collectionfondo");
        let hash = MD5(producto._id.toString() + req.body.color + req.body.medidas + req.body.marca).toString();

        req.body.hash_inventario = hash;
        CollectionPegamento.insertOne(req.body).then(results => {

            console.log(results);

            let CollectionInventario = client.db().collection("inventario");
            console.log(producto._id.toString(), req.body.color, req.body.medidas, req.body.marca);

            CollectionInventario.findOne({codigo: hash}).then(results => {

                console.log("Existe inventario? ", results);

                if (!results) {
                    console.log("Nuevo md5", hash);
                    let inv = {
                        codigo: hash,
                        existencia: 0,
                        metraje:-3
                    };

                    CollectionInventario.insertOne(inv).then(results => {
                        console.log(results);
                        console.log(`Un fondo nuevo fue adicionado al catalogo e inventario...`);

                        res.status(200).json({ok: true, message: "Un fondo nuevo fue adicionado al catalogo e inventario....", action: "reload"});
                        res.end();

                    })
                    .catch(error => console.error(error))
                    .finally(data => client.close());
                } else {
                    console.log(`Un fondo nuevo fue adicionado al catalogo...`);

                    res.status(200).json({ok: true, message: "Un fondo nuevo fue adicionado al catalogo....", action: "reload"});
                    res.end();
                    client.close();
                }
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

app.put('/actualizar_fondo/:id',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();

    let CollectionItem = client.db().collection("item");
    let CollectionInventario = client.db().collection("inventario");

    CollectionItem.findOne({nombre:"Fondo"}).then(producto => {

        console.log("fondo: ", req.body);
        let idc = new ObjectID(req.params.id);
        console.log("param: "+req.params.id);

        let hashOld = req.body.hash_inventario;
        let hashNew = MD5(producto._id.toString() + req.body.color + req.body.medidas + req.body.marca).toString();
        req.body.hash_inventario = hashNew;

        let CollectionProducto = client.db().collection("collectionfondo");

        CollectionProducto.updateOne({"_id": idc}, {$set: req.body}).then(results => {
            console.log(results);
            console.log("hash Nuevo:", hashNew, "hash viejo:", hashOld);
            if (hashNew != hashOld) {
                CollectionInventario.find({codigo: hashNew}).toArray().then(inventario => {
                    console.log(inventario);
                    if (!inventario.length) { //no existe inventario
                        CollectionProducto.find({hash_inventario: hashOld}).toArray().then(productos => {
                            console.log(productos);
                            if (productos && productos.length <= 0) {//no existe producto ENLAZADO al antiguo HASH
                                //actualiza el inventario existente
                                CollectionInventario.updateOne({codigo: hashOld}, {$set:{codigo: hashNew}}).then(results => {
                                    console.log(results);
                                    console.log(`Fue actualizado en catalogo e inventario...`);

                                    res.status(200).json({ok: true, message: "(" + req.body.color + ") Fue actualizado en catalogo e inventario....", new_hash: hashNew, action: "reload"});
                                    res.end();
                                })
                                .catch(error => console.error(error))
                                .finally(data => client.close());
                            } else {
                                let inv = {
                                    codigo: hashNew,
                                    existencia: 0,
                                    metraje: -3
                                };

                                CollectionInventario.insertOne(inv).then(results => {
                                    console.log(results);
                                    console.log(`El fondo se actualizo y se creo un nuevo inventario ${hashNew}...`);

                                    res.status(200).json({ok: true, message: `El fondo se actualizo y se creo un nuevo inventario ${hashNew}...`, new_hash: hashNew, action: "reload"});
                                    res.end();
                                })
                                .catch(error => console.error(error))
                                .finally(data => client.close());
                            }
                        })
                        .catch(error => console.error(error))
                    } else {  //existe inventario
                        CollectionProducto.find({hash_inventario: hashOld}).toArray().then(productos => {
                            console.log(productos);
                            if (productos && productos.length <= 0) {//no existe producto ENLAZADO al antiguo HASH

                                //Se suma existencia al nuevo inventario enlazado???
                                CollectionInventario.deleteOne({codigo: hashOld}).then(results => {
                                    console.log(results);
                                    console.log(`Se borro inventario viejo y se actualizo Fondo con enlaze a otro inventario...`);

                                    res.status(200).json({ok: true, message: "(" + req.body.color + ") Se borro inventario viejo y se actualizo Fondo con enlaze a otro inventario...", new_hash: hashNew, action: "reload"});
                                    res.end();
                                })
                                .catch(error => console.error(error))
                                .finally(data => client.close());
                            } else {
                                console.log(`Se actualizo Fondo y se cambio el enlaze a otro inventario...`);

                                res.status(200).json({ok: true, message: "(" + req.body.color + ") Se actualizo Fondo y se cambio el enlaze a otro inventario......", new_hash: hashNew, action: "reload"});
                                res.end();
                                client.close();
                            }
                        })
                        .catch(error => console.error(error))
                    }
                })
                .catch(error => console.error(error))
            } else {
                //no se envio datos actualizado, o no se actualizo en el UI
                console.log(results);
                console.log(`Fondo  ${idc} conserva los datos...`);
                res.status(200).json({ok: true, message: "Fondo (" + idc + ") conserva los datos.", new_hash: hashNew, action: "none"});
                res.end();
                client.close();
            }
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

app.delete('/delete_fondo/:id', (req, res) => {
    const client = new MongoClient(uri);
    client.connect();

    let CollectionItem = client.db().collection("item");
    var CollectionProducto = client.db().collection("collectionfondo");
    var CollectionInventario = client.db().collection("inventario");
    let cid = new ObjectID(req.params.id);
    console.log("Id: ",req.params.id);

    CollectionItem.findOne({nombre:"Fondo"}).then(producto => {

        CollectionProducto.findOne({"_id": cid }).then(fondo => {

            let hash = MD5(producto._id.toString() + fondo.color + fondo.medidas + fondo.marca).toString();

            if (fondo.hash_inventario != hash) {
                console.log("Discrepancias en hash, inventarioID: ",fondo.hash_inventario, " hash generado:" ,hash);

                res.status(500).json({ok: true, message: "No se pudo borrar Fondo (" + req.params.id + ") revise  el codigo de inventario.", action: "none"});
                res.end();
                throw "Revise el hash de inventario vs producto...";
            }

            CollectionProducto.find({"hash_inventario": hash }).toArray().then(result => {
                let productosDeInventario = result.length;
                console.log(result);

                CollectionProducto.deleteOne({"_id": cid }).then(result => {
                    console.log(result);

                    if (productosDeInventario > 1) {
                        console.log("Invantario [codigo: "+hash+"] se conserva, existe para otros productos.");
                        console.log(`Fondo ${req.params.id} fue borrado...`);

                        res.status(200).json({ok: true, message: "Fondo (" + req.params.id + ") e inventario ("+hash+") fueron borrados.", action: "none"});
                        res.end();
                        client.close();
                    } else {
                        CollectionInventario.deleteOne({"codigo": hash }).then(result => {
                            console.log(result);
                            console.log(`Fondo y su inventario ${req.params.id} fueron borrados...`);

                            res.status(200).json({ok: true, message: "Fondo (" + req.params.id + ") e inventario ("+hash+") fueron borrados.", action: "none"});
                            res.end();
                        })
                        .catch(error => console.error(error))
                        .finally(data => client.close())
                    }
                })
                .catch(error => console.error(error))
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

app.post('/nuevo_tapatornillos',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();
    console.log("Tapatornillos",req.body);

    let CollectionItem = client.db().collection("item");
    CollectionItem.findOne({nombre:"Tapatornillos"}).then(producto => {
        console.log(producto);
        let CollectionTapatornillos = client.db().collection("collectiontapatornillos");
        let hash = MD5(producto._id.toString() + req.body.color + req.body.medidas + req.body.marca).toString();

        req.body.hash_inventario = hash;
        CollectionTapatornillos.insertOne(req.body).then(results => {

            console.log(results);

            let CollectionInventario = client.db().collection("inventario");
            console.log(producto._id.toString(), req.body.color, req.body.medidas, req.body.marca);

            CollectionInventario.findOne({codigo: hash}).then(results => {

                console.log("Existe inventario? ", results);

                if (!results) {
                    console.log("Nuevo md5", hash);
                    let inv = {
                        codigo: hash,
                        existencia: 0,
                        metraje:-4
                    };

                    CollectionInventario.insertOne(inv).then(results => {
                        console.log(results);
                        console.log(`Un Tapatornillos nuevo fue adicionado al catalogo e inventario...`);

                        res.status(200).json({ok: true, message: "Un Tapatornillos nuevo fue adicionado al catalogo e inventario....", action: "reload"});
                        res.end();

                    })
                    .catch(error => console.error(error))
                    .finally(data => client.close());
                } else {
                    console.log(`Un Tapatornillos nuevo fue adicionado al catalogo...`);

                    res.status(200).json({ok: true, message: "Un Tapatornillos nuevo fue adicionado al catalogo....", action: "reload"});
                    res.end();
                    client.close();
                }
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

app.put('/actualizar_tapatornillos/:id',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();

    let CollectionItem = client.db().collection("item");
    let CollectionInventario = client.db().collection("inventario");

    CollectionItem.findOne({nombre:"Tapatornillos"}).then(producto => {

        console.log("tapatornillos: ", req.body);
        let idc = new ObjectID(req.params.id);
        console.log("param: "+req.params.id);

        let hashOld = req.body.hash_inventario;
        let hashNew = MD5(producto._id.toString() + req.body.color + req.body.medidas + req.body.marca).toString();
        req.body.hash_inventario = hashNew;

        let CollectionProducto = client.db().collection("collectiontapatornillos");

        CollectionProducto.updateOne({"_id": idc}, {$set: req.body}).then(results => {
            console.log(results);
            console.log("hash Nuevo:", hashNew, "hash viejo:", hashOld);
            if (hashNew != hashOld) {
                CollectionInventario.find({codigo: hashNew}).toArray().then(inventario => {
                    console.log(inventario);
                    if (!inventario.length) { //no existe inventario
                        CollectionProducto.find({hash_inventario: hashOld}).toArray().then(productos => {
                            console.log(productos);
                            if (productos && productos.length <= 0) {//no existe producto ENLAZADO al antiguo HASH
                                //actualiza el inventario existente
                                CollectionInventario.updateOne({codigo: hashOld}, {$set:{codigo: hashNew}}).then(results => {
                                    console.log(results);
                                    console.log(`Fue actualizado en catalogo e inventario...`);

                                    res.status(200).json({ok: true, message: "(" + req.body.color + ") Fue actualizado en catalogo e inventario....", new_hash: hashNew, action: "reload"});
                                    res.end();
                                })
                                .catch(error => console.error(error))
                                .finally(data => client.close());
                            } else {
                                let inv = {
                                    codigo: hashNew,
                                    existencia: 0,
                                    metraje: -3
                                };

                                CollectionInventario.insertOne(inv).then(results => {
                                    console.log(results);
                                    console.log(`El tapatornillos se actualizo y se creo un nuevo inventario ${hashNew}...`);

                                    res.status(200).json({ok: true, message: `El tapatornillos se actualizo y se creo un nuevo inventario ${hashNew}...`, new_hash: hashNew, action: "reload"});
                                    res.end();
                                })
                                .catch(error => console.error(error))
                                .finally(data => client.close());
                            }
                        })
                        .catch(error => console.error(error))
                    } else {  //existe inventario
                        CollectionProducto.find({hash_inventario: hashOld}).toArray().then(productos => {
                            console.log(productos);
                            if (productos && productos.length <= 0) {//no existe producto ENLAZADO al antiguo HASH

                                //Se suma existencia al nuevo inventario enlazado???
                                CollectionInventario.deleteOne({codigo: hashOld}).then(results => {
                                    console.log(results);
                                    console.log(`Se borro inventario viejo y se actualizo tapatornillos con enlaze a otro inventario...`);

                                    res.status(200).json({ok: true, message: "(" + req.body.color + ") Se borro inventario viejo y se actualizo tapatornillos con enlaze a otro inventario...", new_hash: hashNew, action: "reload"});
                                    res.end();
                                })
                                .catch(error => console.error(error))
                                .finally(data => client.close());
                            } else {
                                console.log(`Se actualizo tapatornillos y se cambio el enlaze a otro inventario...`);

                                res.status(200).json({ok: true, message: "(" + req.body.color + ") Se actualizo tapatornillos y se cambio el enlaze a otro inventario......", new_hash: hashNew, action: "reload"});
                                res.end();
                                client.close();
                            }
                        })
                        .catch(error => console.error(error))
                    }
                })
                .catch(error => console.error(error))
            } else {
                //no se envio datos actualizado, o no se actualizo en el UI
                console.log(results);
                console.log(`tapatornillos  ${idc} conserva los datos...`);
                res.status(200).json({ok: true, message: "tapatornillos (" + idc + ") conserva los datos.", new_hash: hashNew, action: "none"});
                res.end();
                client.close();
            }
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

app.delete('/delete_tapatornillos/:id', (req, res) => {
    const client = new MongoClient(uri);
    client.connect();

    let CollectionItem = client.db().collection("item");
    var CollectionProducto = client.db().collection("collectiontapatornillos");
    var CollectionInventario = client.db().collection("inventario");
    let cid = new ObjectID(req.params.id);
    console.log("ID: ",req.params.id);

    CollectionItem.findOne({nombre:"Tapatornillos"}).then(producto => {

        CollectionProducto.findOne({"_id": cid }).then(tapatornillos => {

            let hash = MD5(producto._id.toString() + tapatornillos.color + tapatornillos.medidas + tapatornillos.marca).toString();

            if (tapatornillos.hash_inventario != hash) {
                console.log("Discrepancias en hash, inventarioID: ",tapatornillos.hash_inventario, " hash generado:" ,hash);

                res.status(500).json({ok: true, message: "No se pudo borrar Tapatornillos (" + req.params.id + ") revise  el codigo de inventario.", action: "none"});
                res.end();
                throw "Revise el hash de inventario vs producto...";
            }

            CollectionProducto.find({"hash_inventario": hash }).toArray().then(result => {
                let productosDeInventario = result.length;
                console.log(result);

                CollectionProducto.deleteOne({"_id": cid }).then(result => {
                    console.log(result);

                    if (productosDeInventario > 1) {
                        console.log("Invantario [codigo: "+hash+"] se conserva, existe para otros productos.");
                        console.log(`Tapatornillos ${req.params.id} fue borrado...`);

                        res.status(200).json({ok: true, message: "Tapatornillos (" + req.params.id + ") e inventario ("+hash+") fueron borrados.", action: "none"});
                        res.end();
                        client.close();
                    } else {
                        CollectionInventario.deleteOne({"codigo": hash }).then(result => {
                            console.log(result);
                            console.log(`Tapatornillos y su inventario ${req.params.id} fueron borrados...`);

                            res.status(200).json({ok: true, message: "Tapatornillos (" + req.params.id + ") e inventario ("+hash+") fueron borrados.", action: "none"});
                            res.end();
                        })
                        .catch(error => console.error(error))
                        .finally(data => client.close())
                    }
                })
                .catch(error => console.error(error))
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

app.put('/actualizar_control_producto/',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();

    console.log("control: ", req.body);

    let CollectionControl = client.db().collection("control_producto");

    CollectionControl.findOneAndUpdate({item: "Melamina"}, {$set: {minimo: Number(req.body.melamina)}}).then(results => {
        console.log(results);
        CollectionControl.findOneAndUpdate({item: "Tapacantos"}, {$set: {minimo: Number(req.body.tapacantos)}}).then(results => {
            console.log(results);
            CollectionControl.findOneAndUpdate({item: "Pegamento"}, {$set: {minimo: Number(req.body.pegamento)}}).then(results => {
                console.log(results);
                CollectionControl.findOneAndUpdate({item: "Fondo"}, {$set: {minimo: Number(req.body.fondo)}}).then(results => {
                    console.log(results);
                    CollectionControl.findOneAndUpdate({item: "Tapatornillos"}, {$set: {minimo: Number(req.body.tapatornillos)}}).then(results => {
                        console.log(results);
                        console.log("Control producto ",req.body," actualizado...");
                        res.status(200).json({ok: true, message: "Control Producto actualizado.", action: "none"});
                        res.end();
                    })
                    .catch(error => console.error(error))
                    .finally(data => client.close())
                })
                .catch(error => console.error(error))
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error));
})

app.post('/reporte_pedidos_cliente_interno_mes', function(req, res) {
    const client = new MongoClient(uri);
    client.connect();
    var DB = client.db();
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
            .finally(data => client.close())
    })
    .catch(error => console.error(error))               
});

app.post('/reporte_producto_pedido_mes', function(req, res) {
    const client = new MongoClient(uri);
    client.connect();
    var DB = client.db();
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
            .finally(data => client.close())
    })
    .catch(error => console.error(error))               
});

app.post('/reporte_consumo_cliente', function(req, res) {
    const client = new MongoClient(uri);
    client.connect();
    var DB = client.db();

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
        .finally(data => client.close())
    })
    .catch(error => console.error(error))
});

app.post('/reporte_provedor_producto', function(req, res) {
    const client = new MongoClient(uri);
    client.connect();
    var DB = client.db();

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
        .finally(data => client.close())
    })
    .catch(error => console.error(error))
});

app.post('/reporte_venta_producto_dia', function(req, res) {
    const client = new MongoClient(uri);
    client.connect();
    var DB = client.db();
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
        .finally(data => client.close())
    })
    .catch(error => console.error(error))
});

app.post('/reporte_venta_compra_dia', function(req, res) {
    const client = new MongoClient(uri);
    client.connect();
    var DB = client.db();
    console.log("Getting from "+req.body.day);
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
        .finally(data => client.close())
    })
    .catch(error => console.error(error))
});

app.post('/reporte_compra_venta_colores_mes', function(req, res) {
    const client = new MongoClient(uri);
    client.connect();
    var DB = client.db();
    var SelectedMonth = '/' + req.body.mes + '/2023';
    console.log("selected mes: ", SelectedMonth);

    let productos = {
        "Melamina":["laminas","paquete"],
        "Tapacanto":["rollos","cajas","metros"],
        "Fondo":["laminas","paquete"],
        "Pegamento":["bolsas"],
        "Tapatornillo":["laminas"]
    };

    DB.collection("historial").find({
        "fecha": { $regex: SelectedMonth }
    }).toArray().then(resultHistorial => {
        let reporte = [];
        let index = 0;
        
        Object.keys(productos).forEach(product => {

            productos[product].forEach((tipoProducto) => {
                let DATA = {producto:"",blanco:{tipo:"",cantidad:0, venta:0, compra:0}, colores:{tipo:"",cantidad:0, venta:0, compra:0}};
                DATA.producto = product;
                resultHistorial.forEach((historia) => {
                    
                    if (historia.item == product && historia.nombreDeUnidad == tipoProducto) {
                        console.log(historia.item, historia.nombreDeUnidad,historia.color);
                        if (historia.color == "Blanco") {
                            console.log(historia.tipo_entrada, historia.cantidad);
                            DATA.blanco.tipo = historia.nombreDeUnidad;
                            DATA.blanco.cantidad += Number(historia.cantidad);
                            if (historia.tipo_entrada == "pedido") {
                                DATA.blanco.venta += Number(historia.precioVenta);
                            } else if (historia.tipo_entrada == "ingreso") {
                                DATA.blanco.compra += Number(historia.precioCompra);
                            } else {
                                console.log("Tipo de entrada desconocida: '" + historia.tipo_entrada +"'");
                            }
                        } else {
                            console.log(historia.tipo_entrada, historia.cantidad);
                            DATA.colores.tipo = historia.nombreDeUnidad;
                            DATA.colores.cantidad += Number(historia.cantidad);
                            if (historia.tipo_entrada == "pedido") {
                                DATA.colores.venta += Number(historia.precioVenta);
                            } else if (historia.tipo_entrada == "ingreso") {
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
    .finally(data => client.close())
                   
});


// index page
app.get('/inventario', function(req, res) {
  res.render('pages/inventario');
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
