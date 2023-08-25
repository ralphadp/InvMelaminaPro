
class SessionUsers {
    USUARIOS = {};

    isRegistered(req) {
        if (req.app.settings.USUARIOS[req.session.user_id]) {
            return true;
        }
        return false;
    }

    isAuthorized(req) {
        var usuario = req.app.settings.USUARIOS[req.session.user_id];

        if (req.url == '/preferencias') {
            return usuario.administrador;
        } else if (req.url == '/pedidos') {
            return usuario.ventas;
        } else if (req.url == '/ingresos') {
            return usuario.compras;
        }

        return true;
    }

    verifyAuthentication(req, res, next) {
        console.log("SESSION: ", req.session);
        console.log("Usuarios: ", this.USUARIOS);

        if (!req.session.user_id) {
            process.env.last_url = req.url;
            console.log('You are not authorized to view this page');
            res.redirect('/login');
        } else {
            console.log('logged');
            if (!this.isRegistered(req)) {
                res.redirect('/login');
            } else {
                if (this.isAuthorized(req)) {
                    process.env.last_url = req.url;
                    next();
                } else {
                    console.log('User: [' + req.session.user_id + '] not authorized to view this page');
                    console.log('Back to ' + process.env.last_url);
                    process.env.message = "No esta autorizado para acceder a la pagina '" + req.url + "'";

                    req.url = process.env.last_url;
                    if (!this.isAuthorized(req)) {
                        res.redirect("/inventario");
                    } else {
                        res.redirect(process.env.last_url);
                    }
                }
            }
        }
    }

    getCurrentUsername(req) {
        if (req.session.user_id && this.userExists(req.session.user_id)) {
            return this.USUARIOS[req.session.user_id];
        }
    
        return {name:"Desconocido",completo:"Desconocido"};
    }

    setUser(ID, user) {
        this.USUARIOS[ID] = user;
    }

    userExists(ID) {
        return this.USUARIOS && this.USUARIOS[ID];
    }

    removeUser(req) {
        delete this.USUARIOS[req.session.user_id];
    }
}

module.exports = new SessionUsers;