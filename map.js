class Collection {
    list = {};
    array = [];

    constructor(name) {
        this.name = name;
    }

    get(nombreOrID) {
        if (this.list && this.list[nombreOrID]) {
            return this.list[nombreOrID];
        }

        return "desconocido";
    }

    add(valueJson) {
        this.array.push(valueJson);
        if (valueJson.nombre) {
            if (this.list[valueJson.nombre]) {
                console.log("Collection: "+valueJson.nombre + " cannot be added , already exists");
            } else {
                this.list[valueJson.nombre] = valueJson;
                this.list[valueJson._id.toString()] = valueJson;
            }
        } else if (valueJson.item) {
            if (this.list[valueJson.item]) {
                console.log("Collection: "+valueJson.item + " cannot be added , already exists");
            } else {
                this.list[valueJson.item] = valueJson;
            }
        } else {
            console.log("Collection: Cannot add to collection: json value does not have name or item field.")
        }
    }

    // update by coded ID
    update(id, valueJson) {
        if (this.list && this.list[id]) {
            let target =  this.list[id];
            if (this.list[target.nombre]) {
                delete this.list[target.nombre];
            }
            if (this.list[target.item]) {
                delete this.list[target.item];
            }

            this.list[id] = valueJson;
            if (valueJson.nombre) {
                this.list[valueJson.nombre] = valueJson;
            } else if (valueJson.item) {
                this.list[valueJson.item] = valueJson;
            } else {
                console.log("Collection: Cannot update collection by item or nombre: does not have name or item field.")
            }
        } else {
            console.log("Collection: List is empty.");
        }
    }

    // delete by coded ID
    delete(Id) {
        if (Id && this.list[Id]) {
            let target = this.list[Id];
            if (target.nombre && this.list[target.nombre]) {
                delete this.list[target.nombre];
            } else if (target.item && this.list[target.item]) {
                delete this.list[target.item];
            }
            delete this.list[Id];
        } else {
            console.log("Collection: Cannot delete collection: json value does not have name or item field.")
        }
    }

    use(db) {
        if (!db) {
            console.log("Collection: Cannot use DB for " + this.name);
            return false;
        }
        this.DB = db;
        return true;
    }

    async reload() {
        if (!this.DB) {
            console.log("Collection: Cannot reload, cause DB is not set for " + this.name);
            return false;
        }
        try {
            let resultsItem = await this.DB.collection(this.name).find().toArray();
            if (!resultsItem) {
                console.log("Collection: cannot reload " + this.name);
            } else {
                this.array = resultsItem;
                console.log("Collection: collection ["+this.name + "] reloaded!");
            }
        } catch (error) {
            console.log("Collection: reload " + this.name + " error: ", error);
            return false;
        }

        return true;
    }
}

class Map {

    constructor() {    
        this.collections = [
            new Collection("item"),
            new Collection("color"),
            new Collection("medidas"),
            new Collection("marcas"),
            new Collection("collectionprovedor"),
            new Collection("collectionCliente"),
            new Collection("control_producto"),
        ];
    }

    setDB(db) {
        if (db) {
           
            this.DB = db;
            for (var i = 0; i < this.collections.length; i++) {
               this.collections[i].use(db);
            }
        } else {
            console.log("Map: Db is not instanced");
        }
    }

    getFieldNameToMap(item) {
        return item.nombre ? item.nombre : item.item;
    }

    async populate() {
        try {
            for (var i = 0; i < this.collections.length; i++) {
                let collection = this.collections[i];
                this[collection.name] = collection; // Creating attribute in order to access to the object reference easly
                let resultsItem = await this.DB.collection(collection.name).find().toArray();
                collection.array = resultsItem;
                resultsItem.forEach((item) => {
                    collection.list[this.getFieldNameToMap(item)] = item; // Mapping by attribute
                    collection.list[item._id.toString()] = item; // Mapping by ID
                });
                //console.log(collection.list);
            }

            this.preferencias = await this.DB.collection("preferencias").findOne();
            this.configuracion = await this.DB.collection("configuracion").findOne();

        } catch (error) {
            console.log("Map: Populate error: ", error);
            return false;
        }

        return true;
    }
}

module.exports = new Map;