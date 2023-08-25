const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectId;

class DB {
    uri = `mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_PASS}@${process.env.ATLAS_HOST}/${process.env.ATLAS_DB}?retryWrites=true&w=majority`;
    clientDB = {};

    constructor() {
        this.client = new MongoClient(this.uri);
        let result = this.client.connect();
        if (result) {
            console.log("DB: Connected to " + this.uri );
        } else {
            console.log("DB: CANNOT CONNECT TO " + this.uri + " !!!");
        }
        this.clientDB = this.client.db();
    }

    collection(collectionName) {
        if (!collectionName.length) {
            console.log("DB: Collection need to have a name.");
            return null;
        }

        if (!this.clientDB) {
            console.log("DB: interface dont have cient DB.");
            return null;
        }

        if (this.clientDB.collection(collectionName)) {
            return this.clientDB.collection(collectionName);
        }

        console.log(`DB: Collection ${collectionName} does not exists.`);
        return null;
    }

    getObjectID(id) {
        return new ObjectID(id);
    }

    ends() {
        this.client.close();
    }

}

module.exports = new DB;