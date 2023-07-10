var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const ObjectID = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;

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

// pedidos page
app.get('/pedidos', function(req, res) {
    const client = new MongoClient(uri);
    client.connect();
    var DB = client.db();

    DB.collection("collectionCliente").find().toArray().then(resultsCliente => {
        DB.collection("item").find().toArray().then(resultsItem => {
            DB.collection("color").find().toArray().then(resultsColor => {
                DB.collection("medidas").find().toArray().then(resultMedida => {
                    DB.collection("marcas").find().toArray().then(resultMarcas => {
                        DB.collection("unidad").find().toArray().then(resultUnidad => {
                            let fecha = getFecha();
                            console.log(fecha);
                            DB.collection("historial").find({
                                "fecha": {$regex : fecha},
                                "tipo_entrada": "pedido"
                            }).toArray().then(resultHistorial => {
                                res.render('pages/pedidos', {
                                    cliente: resultsCliente,
                                    item: resultsItem, 
                                    color: resultsColor, 
                                    medida: resultMedida,
                                    marca: resultMarcas,
                                    unidad: resultUnidad,
                                    historial: resultHistorial
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
});

// ingresos page
app.get('/ingresos', function(req, res) {
    const client = new MongoClient(uri);
    client.connect();
    var DB = client.db();

    DB.collection("collectionprovedor").find().toArray().then(resultsProvedor => {
        DB.collection("item").find().toArray().then(resultsItem => {
            DB.collection("color").find().toArray().then(resultsColor => {
                DB.collection("medidas").find().toArray().then(resultMedida => {
                    DB.collection("marcas").find().toArray().then(resultMarcas => {
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
                                    color: resultsColor, 
                                    medida: resultMedida,
                                    marca: resultMarcas,
                                    unidad: resultUnidad,
                                    historial: resultHistorial
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
});

app.post('/addicionar_ingreso', (req, res) => {
    const client = new MongoClient(uri);
    client.connect();
console.log(req.body);
    let tipoItem = req.body.item.toLowerCase();
    let tipoUnidad = req.body.nombreDeUnidad.toLowerCase();
    let color = "";
    let medida = "";
    let CollectionItem = client.db().collection("collection" + tipoItem);

    if (req.body.color != "(ninguno)") {
        color = req.body.color;
    }
    if (req.body.medida != "(ninguno)") {
        medida = req.body.medida;
    }

    let filtro = {
        "provedor": req.body.cliente,
        "color":    color,
        "medidas":  medida,
        "marca":    req.body.marca
    };
console.log(filtro);
    CollectionItem.find(filtro).toArray().then(item => {
console.log(item);
        if (item.length == 0) {
            res.status(404).json({ok: false, message: "No existe el producto de esas caracteristicas en el catalogo." });
            res.end();
            throw "Error: No hubo match del objeto con collection" + tipoItem;
        }
        var codigo = item[0]._id.toString();
        let CollectionInventario = client.db().collection("inventario");
        CollectionInventario.find({"codigo": codigo}).toArray().then(result => {
console.log(result);
            let cantidad = 0;
            let metros = result[0].metraje;
            let cantidadExistente = result[0].existencia;
            //Calcular entrada en base a unidad
            if (tipoUnidad == "laminas" || tipoUnidad == "rollos" || tipoUnidad == "bolsas") {
                cantidad = Number(req.body.cantidad);
            } else if (tipoUnidad == "paquetes") {
                var NUM_LAMINAS = item[0].laminaxpaquete;
                cantidad = (Number(req.body.cantidad) * NUM_LAMINAS);
                req.body.laminaxpaquete = NUM_LAMINAS;    
            } else if (tipoUnidad == "cajas") {
                var NUM_ROLLOS = item[0].rollosxcaja;
                cantidad = (Number(req.body.cantidad) * NUM_ROLLOS);
                req.body.rollosxcaja = NUM_ROLLOS;
            } else if (tipoUnidad == "metros") {
                let metrosExistentes = metros;
                var MTS_ROLLO = item[0].metrosxrollo;
                req.body.metrosxrollo = MTS_ROLLO;
                //metros
                metros = Number(req.body.cantidad) % MTS_ROLLO;
                metros = metrosExistentes + metros;//incrementa
                //rollos
                cantidad = Math.trunc(Number(req.body.cantidad) / MTS_ROLLO);
            } else {
                res.status(500).json({ok: false, message:"Error: Unidad desconocida {"+tipoUnidad+"}" });
                res.end();
                throw "Error: Wrong Unit ["+tipoUnidad+"]";
            }
            cantidad = cantidadExistente + cantidad;//incrementa
console.log("incrementado cantidad: ",cantidad, " metros> ", metros);
            CollectionInventario.updateOne({"codigo": codigo}, {$set: {"existencia": cantidad, "metraje": metros}}).then(item => {
                var Collection = client.db().collection("historial");
                req.body.inventario_id = codigo;
                Collection.insertOne(req.body)
                .then(results => {
                    console.log(`Una compra addicionada al historial...`);
                    res.status(200).json({ok: true, message: "Historial e Inventario actualizados."});
                    res.end();
                })
                .catch(error => console.error(error))
                .finally(data => client.close());
            }).catch(error => console.error(error))
        }).catch(error => console.error(error))
    }).catch(error => console.error(error));
})

app.delete('/delete_historial_compras/:id', (req, res) => {
    const client = new MongoClient(uri);
    client.connect();
    
    var CollectionHistorial = client.db().collection("historial");
    var CollectionInventario = client.db().collection("inventario");
    let o_id = new ObjectID(req.params.id);
    CollectionHistorial.find({ _id: o_id }).toArray().then(rowHistorial => {
        if (rowHistorial.length == 0 ) {
            res.statusMessage = "No se puede encontrar Historial [" + o_id + "]!!";
            res.send();
            throw "No se puede encontrar historial = " + o_id;
        }

        let inventarioID = rowHistorial[0].inventario_id;
        CollectionInventario.find({"codigo": inventarioID }).toArray().then(rowInventario => {
            if (rowInventario.length == 0 ) {
                res.statusMessage = "No se puede encontrar inventario [" + inventarioID + "]!!";
                res.send();
                throw "No se puede encontrar inventario = " + inventarioID;
            }

            let CantidadActualizada = 0;
            let unidad = rowHistorial[0].nombreDeUnidad;
            let cantidad = rowHistorial[0].cantidad;
            let ID = rowHistorial[0].inventario_id;

            let existencia = rowInventario[0].existencia;
            let MetrosActualizados = rowInventario[0].metraje;
console.log("metr:",MetrosActualizados);
            if (unidad == "laminas" || unidad == "rollos" || unidad == "bolsas") {
                CantidadActualizada = Number(existencia) - cantidad;
            } else if (unidad == "paquetes") {
                CantidadActualizada = Number(existencia) - (Number(cantidad) * rowHistorial[0].laminaxpaquete);
            } else if (unidad == "cajas") {
                CantidadActualizada = Number(existencia) - (Number(cantidad) * rowHistorial[0].rollosxcaja);
            } else if (unidad == "metros") {
                MetrosActualizados = Number(MetrosActualizados) - (Number(cantidad) % rowHistorial[0].metrosxrollo);
                CantidadActualizada =  Number(existencia) - (Math.trunc(Number(cantidad) / rowHistorial[0].metrosxrollo));
            } else {
                res.statusMessage = "Unidad en historia desconocida  [" + unidad + "]!!";
                res.send();
                throw "Unidad desconocida " + unidad;
            }

            CollectionInventario.updateOne({"codigo": ID}, {$set: {"existencia": CantidadActualizada, "metraje": MetrosActualizados}}).then(result => {
                console.log("Inventario actualizado...");
                CollectionHistorial.findOneAndDelete({ _id: o_id }).then(result => {
                    //DELETE FROM inventario
                    console.log("Historial borrado...");
                    res.statusMessage ='Inventario actualizado '+ID+' e Historial ' + o_id + ' Borrado';
                    res.send();
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

app.delete('/delete_historial_ventas/:id', (req, res) => {
    const client = new MongoClient(uri);
    client.connect();
    
    var CollectionHistorial = client.db().collection("historial");
    var CollectionInventario = client.db().collection("inventario");
    let o_id = new ObjectID(req.params.id);
    CollectionHistorial.find({ _id: o_id }).toArray().then(rowHistorial => {
        if (rowHistorial.length == 0 ) {
            res.statusMessage = "No se puede encontrar Historial [" + o_id + "]!!";
            res.send();
            throw "No se puede encontrar historial = " + o_id;
        }

        let inventarioID = rowHistorial[0].inventario_id;
        CollectionInventario.find({"codigo": inventarioID }).toArray().then(rowInventario => {
            if (rowInventario.length == 0 ) {
                res.statusMessage = "No se puede encontrar inventario [" + inventarioID + "]!!";
                res.send();
                throw "No se puede encontrar inventario = " + inventarioID;
            }

            let CantidadActualizada = 0;
            let unidad = rowHistorial[0].nombreDeUnidad;
            let cantidad = rowHistorial[0].cantidad;
            let ID = rowHistorial[0].inventario_id;

            let existencia = rowInventario[0].existencia;
            let MetrosActualizados = rowInventario[0].metraje;
    console.log("v metr:",MetrosActualizados);
            if (unidad == "laminas" || unidad == "rollos" || unidad == "bolsas") {
                CantidadActualizada = Number(existencia) + cantidad;
            } else if (unidad == "paquetes") {
                CantidadActualizada = Number(existencia) + (Number(cantidad) * rowHistorial[0].laminaxpaquete);
            } else if (unidad == "cajas") {
                CantidadActualizada = Number(existencia) + (Number(cantidad) * rowHistorial[0].rollosxcaja);
            } else if (unidad == "metros") {
                MetrosActualizados = Number(metraje) + (Number(cantidad) % rowHistorial[0].metrosxrollo);
                CantidadActualizada =  Number(existencia) + (Math.trunc(Number(cantidad) / rowHistorial[0].metrosxrollo));
            } else {
                res.statusMessage = "Unidad en historia desconocida  [" + unidad + "]!!";
                res.send();
                throw "Unidad desconocida " + unidad;
            }

            CollectionInventario.updateOne({"codigo": ID}, {$set: {"existencia": CantidadActualizada, "metraje": MetrosActualizados}}).then(result => {
                console.log("Inventario actualizado...");
                CollectionHistorial.findOneAndDelete({ _id: o_id }).then(result => {
                    //DELETE FROM inventario
                    console.log("Historial deleted...");
                    res.statusMessage ='Inventario actualizado '+ID+' e Historial ' + o_id + ' Borrado';
                    res.send();
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

app.post('/addicionar_pedido',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();
console.log("1",req.body);
    let tipoItem = req.body.item.toLowerCase();
    let tipoUnidad = req.body.nombreDeUnidad.toLowerCase();
    let color = "";
    let medida = "";
    let CollectionItem = client.db().collection("collection" + tipoItem);

    if (req.body.color != "(ninguno)") {
      color = req.body.color;
    }
    if (req.body.medida != "(ninguno)") {
      medida = req.body.medida;
    }

    CollectionItem.find({
          "color":    color,
          "medidas":  medida,
          "marca":    req.body.marca
      }).toArray().then(item => {
  console.log("2",item);
          var codigo = item[0]._id.toString();
          let CollectionInventario = client.db().collection("inventario");
          CollectionInventario.find({"codigo": codigo}).toArray().then(result => {
  console.log("3",result);
            let cantidad = 0;
            let metros = result[0].metraje;
            let cantidadExistente = result[0].existencia;
            //Calcular entrada en base a unidad
            if (tipoUnidad == "laminas" || tipoUnidad == "rollos" || tipoUnidad == "bolsas") {
                cantidad = Number(req.body.cantidad);
            } else if (tipoUnidad == "paquetes") {
                var NUM_LAMINAS = item[0].laminaxpaquete;
                cantidad = (Number(req.body.cantidad) * NUM_LAMINAS);
                req.body.laminaxpaquete = NUM_LAMINAS;
            } else if (tipoUnidad == "cajas") {
                var NUM_ROLLOS = item[0].rollosxcaja;
                cantidad = (Number(req.body.cantidad) * NUM_ROLLOS);
                req.body.rollosxcaja = NUM_ROLLOS;
            } else if (tipoUnidad == "metros") {
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
            } else {
                res.status(500).json({ok: false, message:"Error: Unidad desconocida {"+tipoUnidad+"}" });
                res.end();
                throw "Error: Wrong Unit ["+tipoUnidad+"]";
            }
            cantidad = cantidadExistente - cantidad;//decrementa

            if (cantidad < 0) {
                console.log(`La cantidad en Pedido es mayor a lo contenido en inventario...`);
                res.status(500).json({ok: false, message: "La cantidad de " + tipoUnidad + " [" + req.body.cantidad + "] en Pedido es mayor a lo contenido en inventario [" + cantidadExistente + "]."});
                res.end();
                throw "Error: Cantidad excedente a lo existente ["+req.body.cantidad+"]";
            }

console.log("4","decrementado cantidad: ",cantidad, " metros: ", metros);
                CollectionInventario.updateOne({"codigo": codigo}, {$set: {"existencia": cantidad, "metraje": metros}}).then(item => {
                  var Collection = client.db().collection("historial");
                  req.body.inventario_id = codigo;
                  Collection.insertOne(req.body)
                  .then(results => {
                        let AVISO = "";
                        if (cantidad == 0) {
                            AVISO = "<p>SE ACABA DE AGOTAR "+tipoUnidad+" PARA ["+req.body.marca+"]</p>";
                        }
                        console.log(`Un Pedido addicionado al historial...`);
                        res.status(200).json({ok: true, message: "Historial e Inventario actualizados." + AVISO});
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
                                        console.log(`cliente guardado...`);
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
      }).catch(error => console.error(error));
})

app.post('/obtener_precio', (req, res) => {
    const client = new MongoClient(uri);
    client.connect();

    let tipoItem = req.body.item.toLowerCase();
    var Collection = client.db().collection("collection" + tipoItem);
    var jsonQuery;
console.log(req.body);
console.log('provedor:',req.body.provedor);
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
console.log(jsonQuery);

    Collection.findOne(jsonQuery).then((result) => {
        let precio = .0, precio_metros =.0;
console.log('result:', result);
        if (typeof result == 'undefined' || result == null) {
            res.status(404).json({ok: false, precio: 0.0, message: "Este producto no esta en catalogo"});
            res.end();
            throw "Error: No se encontro precio para este producto";
        }
        if (req.body.tipo_entrada == "ingreso") {
            precio = result.precio_compra;
            precio_metros = result.precio_compra_metros;
        } else if (req.body.tipo_entrada == "pedido") {
            precio = result.precio_venta;
            precio_metros = result.precio_venta_metros;
        }

        var producto;
        if (tipoItem == "tapacantos") {
            producto = {rollos:0, cajas:0, metros:0};
            if (req.body.unidad == "metros") {
                var rollos;
                producto.rollos = Math.trunc(req.body.cantidad / result.metrosxrollo);

                producto.cajas = Math.trunc(producto.rollos / result.rollosxcaja);

                precio = req.body.cantidad * precio_metros;
            } else if (req.body.unidad == "rollos") {
                producto.cajas = Math.trunc(req.body.cantidad / result.rollosxcaja);

                producto.rollos = req.body.cantidad - result.rollosxcaja;
                while (producto.rollos > result.rollosxcaja) {
                    producto.rollos = producto.rollos - result.rollosxcaja;
                }

                producto.metros =  0;

                precio = req.body.cantidad * precio;
            } else if (req.body.unidad == "cajas") {
                producto.cajas = req.body.cantidad;
                producto.rollos = 0;
                producto.metros =  0;
                precio = (req.body.cantidad * result.rollosxcaja) * precio;
            } else {
                res.status(404).json({ok: true, precio: precio, message: "Unidad desconocida [" + req.body.unidad + "]."});
                res.end();
                throw "("+req.body.unidad + ") es una unidad desconocida.";
            }
        } else if (tipoItem == "melamina" || tipoItem == "fondo") {
            producto = {paquetes:0, laminas:0};
            if (req.body.unidad == "laminas") {
                producto.paquetes = Math.trunc(req.body.cantidad / result.laminaxpaquete);

                producto.laminas = req.body.cantidad - result.laminaxpaquete;
                while (producto.laminas > result.laminaxpaquete) {
                    producto.laminas = producto.laminas - result.laminaxpaquete;
                }

                precio = req.body.cantidad * precio;
            } else if (req.body.unidad == "paquetes") {
                producto.laminas = 0;
                producto.paquetes = req.body.cantidad;
                precio = (req.body.cantidad * result.laminaxpaquete) * precio;
            } else {
                res.status(404).json({ok: true, precio: precio, message: "Unidad desconocida [" + req.body.unidad + "]"});
                res.end();
                throw "("+req.body.unidad + ") es una unidad desconocida";
            }
        } else {
            //pegamento
            producto = {bolsa:0};
            producto.bolsa = req.body.cantidad;
            precio = req.body.cantidad * precio;

            res.status(200).json({ok: true, precio: precio, message: "["+tipoItem + "] es un producto no conocido."});
            res.end();
            throw tipoItem + " no es un producto conocido";
        }

        res.status(200).json({ok: true, precio: precio, detalle: producto, message: ""});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close());
});

// reporte page
app.get('/reporte', function(req, res) {
  const client = new MongoClient(uri);
  client.connect();
  var Collection = client.db().collection("collectionmelamina");

  Collection.find().toArray()
      .then(results => {
          res.render('pages/reporte01', { melamina: results });
      })
      .catch(error => console.error(error))
      .finally(data => client.close())
});

// tapacantos_standar page
app.get('/contenidos', function(req, res) {
    const client = new MongoClient(uri);
    client.connect();
    var DB = client.db();
    
    DB.collection("collectiontapacantos").find().toArray().then(tapacantos_results => {
        DB.collection("collectionmelamina").find().toArray().then(melamina_results => {
            DB.collection("collectionpegamento").find().toArray().then(pegamento_results => {
                DB.collection("collectionfondo").find().toArray().then(fondo_results => {
                    DB.collection("collectionCliente").find().toArray().then(cliente_results => {
                        res.render('pages/contenidos', { 
                            tapacantos: tapacantos_results,
                            melamina:   melamina_results,
                            pegamento:  pegamento_results,
                            fondo:      fondo_results,
                            cliente:    cliente_results
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
    
  });

// historia page
app.get('/historial', function(req, res) {
    const client = new MongoClient(uri);
    client.connect();
    var Collection = client.db().collection("historial");
  
    Collection.find().toArray()
        .then(results => {
            res.render('pages/historial', { historial: results });
        })
        .catch(error => console.error(error))
        .finally(data => client.close())
  });

// historia page
app.get('/inventario', function(req, res) {
    const client = new MongoClient(uri);
    client.connect();
    var DB = client.db();
    var productos = [], control = [];

    DB.collection("inventario").find().toArray().then(resultsInventario => {
        DB.collection("collectionmelamina").find().toArray().then(resultsMelamina => {
            resultsMelamina.forEach(element => {
                productos[element._id.toString()] = element;
            });
            DB.collection("collectiontapacantos").find().toArray().then(resultsTapacantos => {
                resultsTapacantos.forEach(element => {
                    productos[element._id.toString()] = element;
                });
                DB.collection("collectionpegamento").find().toArray().then(resultPegamento => {
                    resultPegamento.forEach(element => {
                        productos[element._id.toString()] = element;
                    });
                    DB.collection("collectionfondo").find().toArray().then(resultFondo => {
                        resultFondo.forEach(element => {
                            productos[element._id.toString()] = element;
                        });
                        DB.collection("control_producto").find().toArray().then(resultControl => {
                            resultControl.forEach(element => {
                                control[element.item] = element;
                            });
                            res.render('pages/inventario', {
                                inventario: resultsInventario, 
                                producto: productos,
                                control: control
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
});

// preferencias page
app.get('/preferencias', function(req, res) {
    const client = new MongoClient(uri);
    client.connect();
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
                                            res.render('pages/preferencias/index', {
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
    
    var CollectionMarca = client.db().collection("marca");
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

    let CollectionCliente = client.db().collection("cliente");

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

    let CollectionCliente = client.db().collection("cliente");

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
    
    var CollectionCliente = client.db().collection("cliente");
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

app.post('/nuevo_melamina',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();
    console.log("melamina",req.body);

    let CollectionMelamina = client.db().collection("collectionmelamina");

    CollectionMelamina.insertOne(req.body).then(results => {

        console.log(results);
        console.log(`Una melamina nueva fue adicionada al catalogo...`);

        res.status(200).json({ok: true, message: "Una melamina nueva fue adicionada al catalogo....", action: "reload"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close());
})

app.put('/actualizar_melamina/:id',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();   

    console.log("melamina: ", req.body);
    let idc = new ObjectID(req.params.id);
    console.log(req.params.id, idc);

    let CollectionMelamina = client.db().collection("collectionmelamina");

    CollectionMelamina.updateOne({"_id": idc}, {$set: req.body}).then(results => {
        console.log(results);
        console.log(`Melamina ${req.body.nombre} actualizada...`);
        res.status(200).json({ok: true, message: "Melamina (" + req.body.nombre + ") actualizada.", action: "none"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close());
})

app.delete('/delete_melamina/:id', (req, res) => {
    const client = new MongoClient(uri);
    client.connect();

    var CollectionMelamina = client.db().collection("collectionmelamina");
    let cid = new ObjectID(req.params.id);

    CollectionMelamina.deleteOne({"_id": cid }).then(result => {
        console.log(result);
        console.log(`Melamina ${req.params.id} borrada...`);
        res.status(200).json({ok: true, message: "Melamina (" + req.params.id + ") borrada.", action: "none"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close())
})

app.post('/nuevo_tapacantos',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();
    console.log("tapacantos",req.body);

    let CollectionTapacantos = client.db().collection("collectiontapacantos");

    CollectionTapacantos.insertOne(req.body).then(results => {

        console.log(results);
        console.log(`Un tapacantos nuevo fue adicionado al catalogo...`);

        res.status(200).json({ok: true, message: "Un tapacantos nuevo fue adicionado al catalogo....", action: "reload"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close());
})

app.put('/actualizar_tapacantos/:id',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();   

    console.log("tapacantos: ", req.body);
    let idc = new ObjectID(req.params.id);
    console.log(req.params.id, idc);

    let CollectionTapacantos = client.db().collection("collectiontapacantos");

    CollectionTapacantos.updateOne({"_id": idc}, {$set: req.body}).then(results => {
        console.log(results);
        console.log(`Tapacantos ${req.body.nombre} actualizado...`);
        res.status(200).json({ok: true, message: "Tapacantos (" + req.body.nombre + ") actualizado.", action: "none"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close());
})

app.delete('/delete_tapacantos/:id', (req, res) => {
    const client = new MongoClient(uri);
    client.connect();

    var CollectionTapacantos = client.db().collection("collectiontapacantos");
    let cid = new ObjectID(req.params.id);

    CollectionTapacantos.deleteOne({"_id": cid }).then(result => {
        console.log(result);
        console.log(`Tapacantos ${req.params.id} borrado...`);
        res.status(200).json({ok: true, message: "Tapacantos (" + req.params.id + ") borrado.", action: "none"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close())
})

app.post('/nuevo_pegamento',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();
    console.log("pegamento",req.body);

    let CollectionPegamento = client.db().collection("collectionpegamento");

    CollectionPegamento.insertOne(req.body).then(results => {

        console.log(results);
        console.log(`Un pegamento nuevo fue adicionado al catalogo...`);

        res.status(200).json({ok: true, message: "Un pegamento nuevo fue adicionado al catalogo....", action: "reload"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close());
})

app.put('/actualizar_pegamento/:id',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();   

    console.log("pegamento: ", req.body);
    let idc = new ObjectID(req.params.id);
    console.log(req.params.id, idc);

    let CollectionPegamento = client.db().collection("collectionpegamento");

    CollectionPegamento.updateOne({"_id": idc}, {$set: req.body}).then(results => {
        console.log(results);
        console.log(`Pegamento ${req.body.nombre} actualizado...`);
        res.status(200).json({ok: true, message: "Pegamento (" + req.body.nombre + ") actualizado.", action: "none"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close());
})

app.delete('/delete_pegamento/:id', (req, res) => {
    const client = new MongoClient(uri);
    client.connect();

    var CollectionPegamento = client.db().collection("collectionpegamento");
    let cid = new ObjectID(req.params.id);

    CollectionPegamento.deleteOne({"_id": cid }).then(result => {
        console.log(result);
        console.log(`Pegamento ${req.params.id} borrado...`);
        res.status(200).json({ok: true, message: "Pegamento (" + req.params.id + ") borrado.", action: "none"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close())
})

app.post('/nuevo_pegamento',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();
    console.log("pegamento",req.body);

    let CollectionPegamento = client.db().collection("collectionpegamento");

    CollectionPegamento.insertOne(req.body).then(results => {

        console.log(results);
        console.log(`Un pegamento nuevo fue adicionado al catalogo...`);

        res.status(200).json({ok: true, message: "Un pegamento nuevo fue adicionado al catalogo....", action: "reload"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close());
})

app.put('/actualizar_pegamento/:id',(req, res) => {
    const client = new MongoClient(uri);
    client.connect();   

    console.log("pegamento: ", req.body);
    let idc = new ObjectID(req.params.id);
    console.log(req.params.id, idc);

    let CollectionPegamento = client.db().collection("collectionpegamento");

    CollectionPegamento.updateOne({"_id": idc}, {$set: req.body}).then(results => {
        console.log(results);
        console.log(`Pegamento ${req.body.nombre} actualizado...`);
        res.status(200).json({ok: true, message: "Pegamento (" + req.body.nombre + ") actualizado.", action: "none"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close());
})

app.delete('/delete_pegamento/:id', (req, res) => {
    const client = new MongoClient(uri);
    client.connect();

    var CollectionPegamento = client.db().collection("collectionpegamento");
    let cid = new ObjectID(req.params.id);

    CollectionPegamento.deleteOne({"_id": cid }).then(result => {
        console.log(result);
        console.log(`Pegamento ${req.params.id} borrado...`);
        res.status(200).json({ok: true, message: "Pegamento (" + req.params.id + ") borrado.", action: "none"});
        res.end();
    })
    .catch(error => console.error(error))
    .finally(data => client.close())
})

app.post('/reporte_pedidos_cliente_interno_mes', function(req, res) {
    const client = new MongoClient(uri);
    client.connect();
    var DB = client.db();
    var SelectedMonth = '/' + req.body.mes + '/2023';

    DB.collection("collectionCliente").find({
        "tipo": "interno"
      }).toArray().then(resultCliente => {
            console.log(resultCliente);
            DB.collection("historial").find({
                "fecha": { $regex: SelectedMonth },
                "tipo_entrada": "pedido"
            }).toArray().then(resultHistorial => {
                console.log(resultHistorial);
                res.status(200).json({ok: true, message: "Encontrados", action: "none"});
                res.end();
            })
            .catch(error => console.error(error))
            .finally(data => client.close())
    })
    .catch(error => console.error(error))               
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
