var MD5 = require("crypto-js/md5");

class Util {

    constructor() {
        this.fecha = new Date();
    }

    getFecha() {
        let hoyDia = this.fecha.getDate();
        let esteMes = this.fecha.getMonth() + 1;
        let esteAnio = this.fecha.getFullYear();

        hoyDia = (hoyDia <= 9) ? ('0' + hoyDia) : hoyDia;
        esteMes = (esteMes <= 9) ? ('0' + esteMes) : esteMes;

        return hoyDia + "/" + esteMes + "/" + esteAnio;
    }

    formatColorMedida(producto) {
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

    getInventarioMD5(producto) {
        let [color, medida] = this.formatColorMedida(producto);

        console.log(producto.item, color, medida, producto.marca);

        return MD5(producto.item + color + medida + producto.marca).toString();
    }
}

module.exports = new Util;