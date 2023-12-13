var express = require('express');
var router = express.Router();

/******************************** COLOR ******************************************************/

router.post('/nuevo_color',(req, res) => {
    var DB = req.app.settings.DB;
    var _map = req.app.settings.MAP;

    console.log("color: ",req.body);

    let CollectionColor = DB.collection("color");

    CollectionColor.insertOne(req.body).then(results => {
        var messageText =  "No se pudo addicionar el color al catalogo....";
        var state = false;
        var reaction = "none";

        if (results.insertedId) {
            _map.color.add(req.body);
            messageText = `Un color nuevo fue addicionado al catalogo...`;
            state = true;
            reaction = "reload"
        }

        console.log(messageText);
        res.status(200).json({ok: state, message: messageText, action: reaction});
        res.end();
    })
    .catch(error => console.error(error))
})

router.put('/actualizar_color/:id',(req, res) => {
    try {
        var DB = req.app.settings.DB;
        var _map = req.app.settings.MAP;

        console.log("color: ", req.body);
        let idc = DB.getObjectID(req.params.id);
        console.log(req.params.id, idc);

        let CollectionColor = DB.collection("color");

        CollectionColor.updateOne({"_id": idc}, {$set: req.body}).then(results => {
            var messageText = `Color ${req.body.nombre} no pudo ser actualizado...`;
            var state = false;
            var reaction = "none";

            if (results.modifiedCount) {
                _map.color.update(idc, req.body);
                _map.color.reload();
                messageText = `Color ${req.body.nombre} actualizado...`;
                state = true;
            }

            console.log(messageText);
            res.status(200).json({ok: state, message: messageText, action: reaction});
            res.end();
        })
        .catch(error => console.error(error))
    } catch(error) {
        console.log(error);
        res.status(200).json({ok: false, message: error, action: "none"});
        res.end();
    }
})

router.delete('/delete_color/:id', (req, res) => {
    try {
        var DB = req.app.settings.DB;
        var _map = req.app.settings.MAP;

        var CollectionColor = DB.collection("color");
        let cid = DB.getObjectID(req.params.id);

        CollectionColor.deleteOne({"_id": cid }).then(result => {
            var messageText = `Color ${req.params.id} no pudo ser borrado...`;
            var state = false;
            var reaction = "none";

            if (result.deletedCount) {
                _map.color.delete(cid);
                _map.color.reload();
                messageText = `Color ${req.params.id} borrado...`;
                state = true;
            }

            console.log(messageText);
            res.status(200).json({ok: state, message: messageText, action: reaction});
            res.end();
        })
        .catch(error => console.error(error))
    } catch(error) {
        console.log(error);
        res.status(200).json({ok: false, message: error, action: "none"});
        res.end();
    }
})

/******************************** MARCA ******************************************************/

router.post('/nueva_marca',(req, res) => {
    var DB = req.app.settings.DB;
    var _map = req.app.settings.MAP;
    console.log("marca", req.body);

    let CollectionMarca = DB.collection("marcas");

    CollectionMarca.insertOne(req.body).then(results => {
        var messageText =  "No se pudo adicionar la marca al catalogo....";
        var state = false;
        var reaction = "none";

        if (results.insertedId) {
            _map.marcas.add(req.body);
            messageText = `Una marca nueva fue addicionado al catalogo...`;
            state = true;
            reaction = "reload"
        }

        console.log(messageText);
        res.status(200).json({ok: state, message: messageText, action: reaction});
        res.end();
    })
    .catch(error => console.error(error))
})

router.put('/actualizar_marca/:id',(req, res) => {
    try {
        var DB = req.app.settings.DB;
        var _map = req.app.settings.MAP;

        console.log("marca: ", req.body);
        let idc = DB.getObjectID(req.params.id);
        console.log(req.params.id, idc);

        let CollectionMarca = DB.collection("marcas");

        CollectionMarca.updateOne({"_id": idc}, {$set: req.body}).then(results => {
            var messageText = `Marca ${req.body.nombre} no pudo ser actualizada...`;
            var state = false;
            var reaction = "none";

            if (results.modifiedCount) {
                _map.marcas.update(idc, req.body);
                _map.marcas.reload();
                messageText = `Marca ${req.body.nombre} actualizada...`;
                state = true;
            }

            console.log(messageText);
            res.status(200).json({ok: state, message: messageText, action: reaction});
            res.end();
        })
        .catch(error => console.error(error))
    } catch(error) {
        console.log(error);
        res.status(200).json({ok: false, message: error, action: "none"});
        res.end();
    }
})

router.delete('/delete_marca/:id', (req, res) => {
    try {
        var DB = req.app.settings.DB;
        var _map = req.app.settings.MAP;
        
        var CollectionMarca = DB.collection("marcas");
        let cid = DB.getObjectID(req.params.id);

        CollectionMarca.deleteOne({"_id": cid }).then(result => {
            var messageText = `Marca ${req.params.id} no pudo ser borrada...`;
            var state = false;
            var reaction = "none";

            if (result.deletedCount) {
                _map.marcas.delete(cid);
                _map.marcas.reload();
                messageText = `Marca ${req.params.id} borrada...`;
                state = true;
            }

            console.log(messageText);
            res.status(200).json({ok: state, message: messageText, action: reaction});
            res.end();
        })
        .catch(error => console.error(error))
    } catch(error) {
        console.log(error);
        res.status(200).json({ok: false, message: error, action: "none"});
        res.end();
    }
})

/******************************** MEDIDA ****************************************************/

router.post('/nueva_medida',(req, res) => {
    var DB = req.app.settings.DB;
    var _map = req.app.settings.MAP;
    console.log("medida", req.body);

    let CollectionMedida = DB.collection("medidas");

    CollectionMedida.insertOne(req.body).then(results => {
        var messageText =  "No se pudo addicionar la medida al catalogo....";
        var state = false;
        var reaction = "none";

        if (results.insertedId) {
            _map.medidas.add(req.body);
            messageText = `Una medida nueva fue addicionada al catalogo...`;
            state = true;
            reaction = "reload"
        }

        console.log(messageText);
        res.status(200).json({ok: state, message: messageText, action: reaction});
        res.end();
    })
    .catch(error => console.error(error))
})

router.put('/actualizar_medida/:id',(req, res) => {
    try {
        var DB = req.app.settings.DB;
        var _map = req.app.settings.MAP;

        console.log("medida: ", req.body);
        let idc = DB.getObjectID(req.params.id);
        console.log(req.params.id, idc);

        let CollectionMedida = DB.collection("medidas");

        CollectionMedida.updateOne({"_id": idc}, {$set: req.body}).then(results => {
            var messageText = `Medida ${req.body.nombre} no pudo ser actualizada...`;
            var state = false;
            var reaction = "none";

            if (results.modifiedCount) {
                _map.medidas.update(idc, req.body);
                _map.medidas.reload();
                messageText = `Medida ${req.body.nombre} actualizada...`;
                state = true;
            }

            console.log(messageText);
            res.status(200).json({ok: state, message: messageText, action: reaction});
            res.end();

            console.log(results);
            console.log(`Medida ${req.body.nombre} actualizado...`);
            res.status(200).json({ok: true, message: "Medida (" + req.body.nombre + ") actualizado.", action: "none"});
            res.end();
        })
        .catch(error => console.error(error))
    } catch(error) {
        console.log(error);
        res.status(200).json({ok: false, message: error, action: "none"});
        res.end();
    }
})

router.delete('/delete_medida/:id', (req, res) => {
    try {
        var DB = req.app.settings.DB;
        var _map = req.app.settings.MAP;
        
        var CollectionMedida = DB.collection("medidas");
        let cid = DB.getObjectID(req.params.id);

        CollectionMedida.deleteOne({"_id": cid }).then(result => {
            var messageText = `Medida ${req.params.id} no pudo ser borrada...`;
            var state = false;
            var reaction = "none";

            if (result.deletedCount) {
                _map.medidas.delete(cid);
                _map.medidas.reload();
                messageText = `Medida ${req.params.id} borrada...`;
                state = true;
            }

            console.log(messageText);
            res.status(200).json({ok: state, message: messageText, action: reaction});
            res.end();
        })
        .catch(error => console.error(error))
    } catch(error) {
        console.log(error);
        res.status(200).json({ok: false, message: error, action: "none"});
        res.end();
    }
})

/******************************** Provedor ****************************************************/

router.post('/nuevo_provedor',(req, res) => {
    var DB = req.app.settings.DB;
    var _map = req.app.settings.MAP;
    console.log("provedor", req.body);

    let CollectionProvedor = DB.collection("collectionprovedor");

    CollectionProvedor.insertOne(req.body).then(results => {
        var messageText =  "No se pudo addicionar el provedor al catalogo....";
        var state = false;
        var reaction = "none";

        if (results.insertedId) {
            _map.collectionprovedor.add(req.body);
            messageText = `El provedor nuevo fue addicionada al catalogo...`;
            state = true;
            reaction = "reload"
        }

        console.log(messageText);
        res.status(200).json({ok: state, message: messageText, action: reaction});
        res.end();
    })
    .catch(error => console.error(error))
})

router.put('/actualizar_provedor/:id',(req, res) => {
    try {
        var DB = req.app.settings.DB;
        var _map = req.app.settings.MAP;

        console.log("provedor: ", req.body);
        let idc = DB.getObjectID(req.params.id);
        console.log(req.params.id, idc);

        let CollectionProvedor = DB.collection("collectionprovedor");

        CollectionProvedor.updateOne({"_id": idc}, {$set: req.body}).then(results => {
            var messageText = `El provedor ${req.body.nombre} no pudo ser actualizado...`;
            var state = false;
            var reaction = "none";

            if (results.modifiedCount) {
                _map.collectionprovedor.update(idc, req.body);
                _map.collectionprovedor.reload();
                messageText = `Provedor ${req.body.nombre} actualizado...`;
                state = true;
            }

            console.log(messageText);
            res.status(200).json({ok: state, message: messageText, action: reaction});
            res.end();
        })
        .catch(error => console.error(error))
    } catch(error) {
        console.log(error);
        res.status(200).json({ok: false, message: error, action: "none"});
        res.end();
    }
})

router.delete('/delete_provedor/:id', (req, res) => {
    try {
        var DB = req.app.settings.DB;
        var _map = req.app.settings.MAP;
        
        var CollectionProvedor = DB.collection("collectionprovedor");
        let cid = DB.getObjectID(req.params.id);

        CollectionProvedor.deleteOne({"_id": cid }).then(result => {
            var messageText = `El provedor ${req.params.id} no pudo ser borrado...`;
            var state = false;
            var reaction = "none";

            if (result.deletedCount) {
                _map.collectionprovedor.delete(cid);
                _map.collectionprovedor.reload();
                messageText = `Provedor ${req.params.id} borrado...`;
                state = true;
            }

            console.log(messageText);
            res.status(200).json({ok: state, message: messageText, action: reaction});
            res.end();
        })
        .catch(error => console.error(error))
    } catch(error) {
        console.log(error);
        res.status(200).json({ok: false, message: error, action: "none"});
        res.end();
    }
})

/******************************** Item ****************************************************/

router.post('/nuevo_item',(req, res) => {
    var DB = req.app.settings.DB;
    var _map = req.app.settings.MAP;
    console.log("item",req.body);

    let CollectionItem = DB.collection("item");

    CollectionItem.insertOne(req.body).then(results => {
        var messageText =  "No se pudo addicionar el item al catalogo....";
        var state = false;
        var reaction = "none";

        if (results.insertedId) {
            _map.item.add(req.body);
            messageText = `El item nuevo fue addicionado al catalogo...`;
            state = true;
            reaction = "reload"
        }

        console.log(messageText);
        res.status(200).json({ok: state, message: messageText, action: reaction});
        res.end();
    })
    .catch(error => console.error(error))
})

router.put('/actualizar_item/:id',(req, res) => {
    try {
        var DB = req.app.settings.DB;
        var _map = req.app.settings.MAP;

        console.log("item: ", req.body);
        let idc = DB.getObjectID(req.params.id);
        console.log(req.params.id, idc);

        let CollectionItem = DB.collection("item");

        CollectionItem.updateOne({"_id": idc}, {$set: req.body}).then(results => {
            var messageText = `El Item ${req.body.nombre} no pudo ser actualizado...`;
            var state = false;
            var reaction = "none";

            if (results.modifiedCount) {
                _map.item.update(idc, req.body);
                _map.item.reload();
                messageText = `Item ${req.body.nombre} actualizado...`;
                state = true;
            }

            console.log(messageText);
            res.status(200).json({ok: state, message: messageText, action: reaction});
            res.end();
        })
        .catch(error => console.error(error))
    } catch(error) {
        console.log(error);
        res.status(200).json({ok: false, message: error, action: "none"});
        res.end();
    }
})

router.delete('/delete_item/:id', (req, res) => {
    try {
        var DB = req.app.settings.DB;
        var _map = req.app.settings.MAP;
        
        var CollectionItem = DB.collection("item");
        let cid = DB.getObjectID(req.params.id);

        CollectionItem.deleteOne({"_id": cid }).then(result => {
            var messageText = `El item ${req.params.id} no pudo ser borrado...`;
            var state = false;
            var reaction = "none";

            if (result.deletedCount) {
                _map.item.delete(cid);
                _map.item.reload();
                messageText = `Item ${req.params.id} borrado...`;
                state = true;
            }

            console.log(messageText);
            res.status(200).json({ok: state, message: messageText, action: reaction});
            res.end();
        })
        .catch(error => console.error(error))
    } catch(error) {
        console.log(error);
        res.status(200).json({ok: false, message: error, action: "none"});
        res.end();
    }
})

/******************************** Cliente ****************************************************/

router.post('/nuevo_cliente',(req, res) => {
    try {
        var DB = req.app.settings.DB;
        var _map = req.app.settings.MAP;
        console.log("cliente", req.body);

        let CollectionCliente = DB.collection("collectionCliente");

        CollectionCliente.insertOne(req.body).then(results => {
            var messageText =  "No se pudo addicionar el Cliente al catalogo....";
            var state = false;
            var reaction = "none";

            if (results.insertedId) {
                _map.collectionCliente.add(req.body);
                messageText = `El Cliente nuevo fue addicionado al catalogo...`;
                state = true;
                reaction = "reload"
            }

            console.log(messageText);
            res.status(200).json({ok: state, message: messageText, action: reaction});
            res.end();
        })
        .catch(error => console.error(error))
    } catch(error) {
        console.log(error);
        res.status(200).json({ok: false, message: error, action: "none"});
        res.end();
    }
})

router.put('/actualizar_cliente/:id',(req, res) => {
    try {
        var DB = req.app.settings.DB;
        var _map = req.app.settings.MAP;

        console.log("cliente: ", req.body);
        let idc = DB.getObjectID(req.params.id);
        console.log(req.params.id, idc);

        let CollectionCliente = DB.collection("collectionCliente");

        CollectionCliente.updateOne({"_id": idc}, {$set: req.body}).then(results => {
            var messageText = `El Cliente ${req.body.nombre} no pudo ser actualizado...`;
            var state = false;
            var reaction = "none";

            if (results.modifiedCount) {
                _map.collectionCliente.update(idc, req.body);
                _map.collectionCliente.reload();
                messageText = `Cliente ${req.body.nombre} actualizado...`;
                state = true;
            }

            console.log(messageText);
            res.status(200).json({ok: state, message: messageText, action: reaction});
            res.end();
        })
        .catch(error => console.error(error))
    } catch(error) {
        console.log(error);
        res.status(200).json({ok: false, message: error, action: "none"});
        res.end();
    }
})

router.delete('/delete_cliente/:id', (req, res) => {
    try {
        var DB = req.app.settings.DB;
        var _map = req.app.settings.MAP;
        
        var CollectionCliente = DB.collection("collectionCliente");
        let cid = DB.getObjectID(req.params.id);

        CollectionCliente.deleteOne({"_id": cid }).then(result => {
            var messageText = `El Cliente ${req.params.id} no pudo ser borrado...`;
            var state = false;
            var reaction = "none";

            if (result.deletedCount) {
                _map.collectionClientecollectionCliente.delete(cid);
                _map.collectionCliente.reload();
                messageText = `Cliente ${req.params.id} borrado...`;
                state = true;
            }

            console.log(messageText);
            res.status(200).json({ok: state, message: messageText, action: reaction});
            res.end();
        })
        .catch(error => console.error(error))
    } catch(error) {
        console.log(error);
        res.status(200).json({ok: false, message: error, action: "none"});
        res.end();
    }
})

/******************************** Producto Melamina ****************************************************/

router.post('/nueva_melamina',(req, res) => {
    var DB = req.app.settings.DB;
    console.log("nueva melamina",req.body);

    let CollectionItem = DB.collection("item");
    CollectionItem.findOne({nombre:"Melamina"}).then(producto => {
        console.log(producto);

        let CollectionMelamina = DB.collection("collectionmelamina");
        let hash = MD5(producto._id.toString() + req.body.color + req.body.medidas + req.body.marca).toString();

        req.body.hash_inventario = hash;
        CollectionMelamina.insertOne(req.body).then(results => {

            console.log(results);

            let CollectionInventario = DB.collection("inventario");
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
                } else {
                    console.log(`Una melamina nueva fue adicionada al catalogo...`);

                    res.status(200).json({ok: true, message: "Una melamina nueva fue adicionada al catalogo....", action: "reload"});
                    res.end();
                }
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

router.put('/actualizar_melamina/:id',(req, res) => {
    var DB = req.app.settings.DB;

    let CollectionItem = DB.collection("item");
    let CollectionInventario = DB.collection("inventario");

    CollectionItem.findOne({nombre:"Melamina"}).then(producto => {

        console.log("Melamina: ", req.body);
        let idc = DB.getObjectID(req.params.id);
        console.log("param: "+req.params.id);

        let hashOld = req.body.hash_inventario;
        let hashNew = MD5(producto._id.toString() + req.body.color + req.body.medidas + req.body.marca).toString();
        req.body.hash_inventario = hashNew;

        let CollectionProducto = DB.collection("collectionmelamina");

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
                            } else {
                                let inv = {
                                    codigo: hashNew,
                                    existencia: 0,
                                    metraje: -3
                                };

                                CollectionInventario.insertOne(inv).then(results => {
                                    console.log(results);
                                    console.log(`La Melamina se actualizo y se creo un nuevo inventario ${hashNew}...`);

                                    res.status(200).json({ok: true, message: `La Melamina se actualizo y se creo un nuevo inventario ${hashNew}...`, new_hash: hashNew, action: "reload"});
                                    res.end();
                                })
                                .catch(error => console.error(error))
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
                            } else {
                                console.log(`Se actualizo Melamina y se cambio el enlaze a otro inventario...`);

                                res.status(200).json({ok: true, message: "(" + req.body.color + ") Se actualizo Melamina y se cambio el enlaze a otro inventario......", new_hash: hashNew, action: "reload"});
                                res.end();
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
            }
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

router.delete('/delete_melamina/:id', (req, res) => {
    var DB = req.app.settings.DB;
    let CollectionItem = DB.collection("item");
    var CollectionProducto = DB.collection("collectionmelamina");
    var CollectionInventario = DB.collection("inventario");
    let cid = DB.getObjectID(req.params.id);
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
                    } else {
                        CollectionInventario.deleteOne({"codigo": hash }).then(result => {
                            console.log(result);
                            console.log(`Melamina y su inventario ${req.params.id} fueron borrados...`);

                            res.status(200).json({ok: true, message: "Melamina (" + req.params.id + ") e inventario ("+hash+") fueron borrados.", action: "none"});
                            res.end();
                        })
                        .catch(error => console.error(error))
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

router.post('/nuevo_tapacantos',(req, res) => {
    var DB = req.app.settings.DB;
    console.log("tapacantos",req.body);

    let CollectionItem = DB.collection("item");
    CollectionItem.findOne({nombre:"Tapacantos"}).then(producto => {
        console.log(producto);
    
        let CollectionTapacantos = DB.collection("collectiontapacantos");
        let hash = MD5(producto._id.toString() + req.body.color + req.body.medidas + req.body.marca).toString();

        req.body.hash_inventario = hash;
        CollectionTapacantos.insertOne(req.body).then(results => {

            console.log(results);

            let CollectionInventario = DB.collection("inventario");
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
                } else {
                    console.log(`Un tapacantos nuevo fue adicionado al catalogo...`);

                    res.status(200).json({ok: true, message: "Un tapacantos nuevo fue adicionado al catalogo....", action: "reload"});
                    res.end();
                }
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

router.put('/actualizar_tapacantos/:id',(req, res) => {
    var DB = req.app.settings.DB;

    let CollectionItem = DB.collection("item");
    let CollectionInventario = DB.collection("inventario");

    CollectionItem.findOne({nombre:"Tapacantos"}).then(producto => {

        console.log("tapacantos: ", req.body);
        let idc = DB.getObjectID(req.params.id);
        console.log("param: "+req.params.id);

        let hashOld = req.body.hash_inventario;
        let hashNew = MD5(producto._id.toString() + req.body.color + req.body.medidas + req.body.marca).toString();
        req.body.hash_inventario = hashNew;

        let CollectionProducto = DB.collection("collectiontapacantos");

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
                            } else {
                                console.log(`Se actualizo Tapacantos y se cambio el enlaze a otro inventario...`);

                                res.status(200).json({ok: true, message: "(" + req.body.color + ") Se actualizo Tapacantos y se cambio el enlaze a otro inventario......", new_hash: hashNew, action: "reload"});
                                res.end();
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
            }
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

router.delete('/delete_tapacantos/:id', (req, res) => {
    var DB = req.app.settings.DB;

    let CollectionItem = DB.collection("item");
    var CollectionProducto = DB.collection("collectiontapacantos");
    var CollectionInventario = DB.collection("inventario");
    let cid = DB.getObjectID(req.params.id);
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
                    } else {
                        CollectionInventario.deleteOne({"codigo": hash }).then(result => {
                            console.log(result);
                            console.log(`Tapacantos y su inventario ${req.params.id} fueron borrados...`);

                            res.status(200).json({ok: true, message: "Tapacantos (" + req.params.id + ") e inventario ("+hash+") fueron borrados.", action: "none"});
                            res.end();
                        })
                        .catch(error => console.error(error))
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

router.post('/nuevo_pegamento',(req, res) => {
    var DB = req.app.settings.DB;
    console.log("nuevo pegamento",req.body);

    let CollectionItem = DB.collection("item");
    CollectionItem.findOne({nombre:"Pegamento"}).then(producto => {
        console.log("item:",producto);

        let CollectionPegamento = DB.collection("collectionpegamento");
        let hash = MD5(producto._id.toString() + req.body.marca).toString();

        req.body.hash_inventario = hash;
        CollectionPegamento.insertOne(req.body).then(results => {

            console.log(results);

            let CollectionInventario = DB.collection("inventario");
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
                } else {
                    console.log(`Un pegamento nuevo fue adicionado al catalogo...`);

                    res.status(200).json({ok: true, message: "Un pegamento nuevo fue adicionado al catalogo....", action: "reload"});
                    res.end();
                }
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

router.put('/actualizar_pegamento/:id',(req, res) => {
    var DB = req.app.settings.DB;

    let CollectionItem = DB.collection("item");
    let CollectionInventario = DB.collection("inventario");

    CollectionItem.findOne({nombre:"Pegamento"}).then(producto => {

        console.log("pegamento: ", req.body);
        let idc = DB.getObjectID(req.params.id);
        console.log("param: "+req.params.id);

        let hashOld = req.body.hash_inventario;
        let hashNew = MD5(producto._id.toString() + req.body.marca).toString();
        req.body.hash_inventario = hashNew;

        let CollectionProducto = DB.collection("collectionpegamento");

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
                            } else {
                                console.log(`Se actualizo pegamento y se cambio el enlaze a otro inventario...`);

                                res.status(200).json({ok: true, message: "(" + req.body.color + ") Se actualizo pegamento y se cambio el enlaze a otro inventario......", new_hash: hashNew, action: "reload"});
                                res.end();
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
            }
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

router.delete('/delete_pegamento/:id', (req, res) => {
    var DB = req.app.settings.DB;

    let CollectionItem = DB.collection("item");
    var CollectionProducto = DB.collection("collectionpegamento");
    var CollectionInventario = DB.collection("inventario");
    let cid = DB.getObjectID(req.params.id);
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
                    } else {
                        CollectionInventario.deleteOne({"codigo": hash }).then(result => {
                            console.log(result);
                            console.log(`Pegamento y su inventario ${req.params.id} fueron borrados...`);

                            res.status(200).json({ok: true, message: "Pegamento (" + req.params.id + ") e inventario ("+hash+") fueron borrados.", action: "none"});
                            res.end();
                        })
                        .catch(error => console.error(error))
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

router.post('/nuevo_fondo',(req, res) => {
    var DB = req.app.settings.DB;
    console.log("fondo",req.body);

    let CollectionItem = DB.collection("item");
    CollectionItem.findOne({nombre:"Fondo"}).then(producto => {
        console.log(producto);
        let CollectionPegamento = DB.collection("collectionfondo");
        let hash = MD5(producto._id.toString() + req.body.color + req.body.medidas + req.body.marca).toString();

        req.body.hash_inventario = hash;
        CollectionPegamento.insertOne(req.body).then(results => {

            console.log(results);

            let CollectionInventario = DB.collection("inventario");
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
                } else {
                    console.log(`Un fondo nuevo fue adicionado al catalogo...`);

                    res.status(200).json({ok: true, message: "Un fondo nuevo fue adicionado al catalogo....", action: "reload"});
                    res.end();
                }
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

router.put('/actualizar_fondo/:id',(req, res) => {
    var DB = req.app.settings.DB;

    let CollectionItem = DB.collection("item");
    let CollectionInventario = DB.collection("inventario");

    CollectionItem.findOne({nombre:"Fondo"}).then(producto => {

        console.log("fondo: ", req.body);
        let idc = DB.getObjectID(req.params.id);
        console.log("param: "+req.params.id);

        let hashOld = req.body.hash_inventario;
        let hashNew = MD5(producto._id.toString() + req.body.color + req.body.medidas + req.body.marca).toString();
        req.body.hash_inventario = hashNew;

        let CollectionProducto = DB.collection("collectionfondo");

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
                            } else {
                                console.log(`Se actualizo Fondo y se cambio el enlaze a otro inventario...`);

                                res.status(200).json({ok: true, message: "(" + req.body.color + ") Se actualizo Fondo y se cambio el enlaze a otro inventario......", new_hash: hashNew, action: "reload"});
                                res.end();
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
            }
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

router.delete('/delete_fondo/:id', (req, res) => {
    var DB = req.app.settings.DB;

    let CollectionItem = DB.collection("item");
    var CollectionProducto = DB.collection("collectionfondo");
    var CollectionInventario = DB.collection("inventario");
    let cid = DB.getObjectID(req.params.id);
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
                    } else {
                        CollectionInventario.deleteOne({"codigo": hash }).then(result => {
                            console.log(result);
                            console.log(`Fondo y su inventario ${req.params.id} fueron borrados...`);

                            res.status(200).json({ok: true, message: "Fondo (" + req.params.id + ") e inventario ("+hash+") fueron borrados.", action: "none"});
                            res.end();
                        })
                        .catch(error => console.error(error))
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

router.post('/nuevo_tapatornillos',(req, res) => {
    var DB = req.app.settings.DB;
    console.log("Tapatornillos",req.body);

    let CollectionItem = DB.collection("item");
    CollectionItem.findOne({nombre:"Tapatornillos"}).then(producto => {
        console.log(producto);
        let CollectionTapatornillos = DB.collection("collectiontapatornillos");
        let hash = MD5(producto._id.toString() + req.body.color + req.body.marca).toString();

        req.body.hash_inventario = hash;
        CollectionTapatornillos.insertOne(req.body).then(results => {

            console.log(results);

            let CollectionInventario = DB.collection("inventario");
            console.log(producto._id.toString(), req.body.color, req.body.marca);

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
                } else {
                    console.log(`Un Tapatornillos nuevo fue adicionado al catalogo...`);

                    res.status(200).json({ok: true, message: "Un Tapatornillos nuevo fue adicionado al catalogo....", action: "reload"});
                    res.end();
                }
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

router.put('/actualizar_tapatornillos/:id',(req, res) => {
    var DB = req.app.settings.DB;

    let CollectionItem = DB.collection("item");
    let CollectionInventario = DB.collection("inventario");

    CollectionItem.findOne({nombre:"Tapatornillos"}).then(producto => {

        console.log("tapatornillos: ", req.body);
        let idc = DB.getObjectID(req.params.id);
        console.log("param: "+req.params.id);

        let hashOld = req.body.hash_inventario;
        let hashNew = MD5(producto._id.toString() + req.body.color + req.body.marca).toString();
        req.body.hash_inventario = hashNew;

        let CollectionProducto = DB.collection("collectiontapatornillos");

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
                            } else {
                                console.log(`Se actualizo tapatornillos y se cambio el enlaze a otro inventario...`);

                                res.status(200).json({ok: true, message: "(" + req.body.color + ") Se actualizo tapatornillos y se cambio el enlaze a otro inventario......", new_hash: hashNew, action: "reload"});
                                res.end();
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
            }
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

router.delete('/delete_tapatornillos/:id', (req, res) => {
    var DB = req.app.settings.DB;

    let CollectionItem = DB.collection("item");
    var CollectionProducto = DB.collection("collectiontapatornillos");
    var CollectionInventario = DB.collection("inventario");
    let cid = DB.getObjectID(req.params.id);
    console.log("ID: ",req.params.id);

    CollectionItem.findOne({nombre:"Tapatornillos"}).then(producto => {

        CollectionProducto.findOne({"_id": cid }).then(tapatornillos => {

            let hash = MD5(producto._id.toString() + tapatornillos.color + tapatornillos.marca).toString();

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
                    } else {
                        CollectionInventario.deleteOne({"codigo": hash }).then(result => {
                            console.log(result);
                            console.log(`Tapatornillos y su inventario ${req.params.id} fueron borrados...`);

                            res.status(200).json({ok: true, message: "Tapatornillos (" + req.params.id + ") e inventario ("+hash+") fueron borrados.", action: "none"});
                            res.end();
                        })
                        .catch(error => console.error(error))
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

/******************************** Control producto ******************************************************/

router.put('/actualizar_control_producto/',(req, res) => {
    try {
        var DB = req.app.settings.DB;
        var _map = req.app.settings.MAP;

        console.log("control: ", req.body);

        let CollectionControl = DB.collection("control_producto");

        CollectionControl.findOneAndUpdate({item: "Melamina"}, {$set: {minimo: Number(req.body.melamina)}}).then(results => {
            console.log(results);
            CollectionControl.findOneAndUpdate({item: "Tapacantos"}, {$set: {minimo: Number(req.body.tapacantos)}}).then(results => {
                console.log(results);
                CollectionControl.findOneAndUpdate({item: "Pegamento"}, {$set: {minimo: Number(req.body.pegamento)}}).then(results => {
                    console.log(results);
                    CollectionControl.findOneAndUpdate({item: "Fondo"}, {$set: {minimo: Number(req.body.fondo)}}).then(results => {
                        console.log(results);
                        CollectionControl.findOneAndUpdate({item: "Tapatornillos"}, {$set: {minimo: Number(req.body.tapatornillos)}}).then(results => {
                            var messageText = `Control producto, ${req.body.nombre} no pudo ser actualizado...`;
                            var state = false;
                            var reaction = "none";
                
                            if (results.modifiedCount) {
                                _map.control_producto.update(idc, req.body);
                                _map.control_producto.reload();
                                messageText = `Control producto, ${req.body.nombre} actualizado...`;
                                state = true;
                            }
                
                            console.log(messageText);
                            res.status(200).json({ok: state, message: messageText, action: reaction});
                            res.end();
                        })
                        .catch(error => console.error(error))
                    })
                    .catch(error => console.error(error))
                })
                .catch(error => console.error(error))
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error));
    } catch(error) {
        console.log(error);
        res.status(200).json({ok: false, message: error, action: "none"});
        res.end();
    }
});

/******************************** Preferencias ******************************************************/

router.put('/actualizar_preferencias/',(req, res) => {
    var DB = req.app.settings.DB;

    console.log("preferencias: ", req.body);

    let CollectionPreferencias = DB.collection("preferencias");
    let idc = DB.getObjectID("64c9bb9c353410982749f89e");

    CollectionPreferencias.findOneAndUpdate({_id: idc}, {$set: {telefono: Number(req.body.telefono)}}).then(results => {
        console.log(results);
        console.log("Preferencias ",req.body," actualizadas...");
        res.status(200).json({ok: true, message: "Preferencias actualizadas.", action: "none"});
        res.end();
    })
    .catch(error => console.error(error))
});

/******************************** Usuario ******************************************************/

router.post('/nuevo_usuario',(req, res) => {
    var DB = req.app.settings.DB;
    console.log("usuario",req.body);

    let CollectionUser = DB.collection("user");

    CollectionUser.insertOne(req.body).then(results => {

        console.log(results);
        console.log(`Un usuario nuevo fue addicionado...`);

        res.status(200).json({ok: true, message: "Un usuario nuevo fue addicionado ...", action: "reload"});
        res.end();
    })
    .catch(error => console.error(error))
})

router.put('/actualizar_usuario/:id',(req, res) => {
    var DB = req.app.settings.DB;

    console.log("user: ", req.body);
    let idc = DB.getObjectID(req.params.id);
    console.log(req.params.id, idc);

    let CollectionUser = DB.collection("user");

    CollectionUser.updateOne({"_id": idc}, {$set: req.body}).then(results => {
        console.log(results);
        if (results.modifiedCount) {
            if (USUARIOS && USUARIOS[req.params.id]) {
                delete USUARIOS[req.params.id];
            }
        }
        console.log(`Usuario ${req.body.nombre} actualizado...`);
        res.status(200).json({ok: true, message: "Usuario (" + req.body.name + ") actualizado.", action: "none"});
        res.end();
    })
    .catch(error => console.error(error))
})

router.delete('/delete_usuario/:id', (req, res) => {
    var DB = req.app.settings.DB;
    
    var CollectionUser = DB.collection("user");
    let cid = DB.getObjectID(req.params.id);

    CollectionUser.deleteOne({"_id": cid }).then(result => {
        console.log(result);
        if (result.deletedCount) {
            if (USUARIOS && USUARIOS[req.params.id]) {
                delete USUARIOS[req.params.id];
            }
        }
        console.log(`Usuario ${req.params.id} borrado...`);
        res.status(200).json({ok: true, message: "Usuario (" + req.params.id + ") borrado.", action: "none"});
        res.end();
    })
    .catch(error => console.error(error))
})

router.put('/reset_usuario/:id',(req, res) => {
    try {
        console.log("reset user: ", req.body);

        if (USUARIOS && USUARIOS[req.params.id]) {
            delete USUARIOS[req.params.id];

            console.log(`Usuario ${req.params.id} reseteado...`);
            res.status(200).json({ok: true, message: "Usuario (" + req.params.id + ") reseteado.", action: "none"});
            res.end();
        } else {
            console.log(`Usuario ${req.params.id} no puede ser reseteado...`);
            res.status(200).json({ok: false, message: "Usuario (" + req.params.id + ") no puede ser reseteado.", action: "reload"});
            res.end();
        }
    } catch(error) {
        console.log(error);
        res.status(200).json({ok: false, message: error, action: "none"});
        res.end();
    }
})


module.exports = router;
