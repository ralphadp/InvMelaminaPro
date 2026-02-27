Object.defineProperty(String.prototype, 'capitalizeFirst', {
	value: function() {
	  return this.charAt(0).toUpperCase() + this.slice(1);
	},
	enumerable: false
});

function getInput(elementId) {
	var element = document.getElementById(elementId);
	return element.value;
}

function setInput(elementId, value) {
	var element = document.getElementById(elementId);
	element.value = value;
}

function configuracion() {
	this.att = {
        nombre_app: '',
        celular_1: 0,
        celular_2: 0,
        email:'',
        tiktok_site:'',
        direccion: '',
        foto: '',
        icono: '',
	};

	this.asignar = function() {
		this.att.nombre_app = getInput("nombre_app");
        this.att.celular_1 = getInput("celular_1");
        this.att.celular_2 = getInput("celular_2");
        this.att.email = getInput("email");
        this.att.tiktok_site = getInput("tiktok_site");
        this.att.direccion = getInput("direccion");
        this.att.foto = getInput("foto");
        this.att.icono = getInput("icono");
	}

    /*UPDATE*/
	this.obtener = function() {
		fetch('/configuracion/', {
	        method: 'GET',
	        headers: { 'Content-Type': 'application/json' },
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response);
                this.att = response.nombre_app;
                setInput('nombre_app',response.nombre_app);
                setInput('celular_1',response.celular_1);
                setInput('celular_2',response.celular_2);
                setInput('email',response.email);
                setInput('tiktok_site',response.tiktok_site);
                setInput('direccion',response.direccion);
                setInput('foto',response.foto);
                setInput('icono',response.icono);
	        } else {
	            console.log(response.status, response.statusText);
				document.getElementById("message").style.background = "red";
	            document.getElementById("message").innerHTML = response.message + "<br>";
	        }
	    })
	    .catch(error => {
			document.getElementById("message").style.background = "red";
	        document.getElementById("message").innerHTML = "Error: " + error.message + "<br>";
	        console.log(error.message);
	    });
	};

/*UPDATE*/
	this.actualizar = function() {
		fetch('/configuracion/actualizar/:id', {
	        method: 'PUT',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.att)
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". preferencias guardadas! <br>";
	        } else {
	            console.log(response.status, response.statusText);
				document.getElementById("message").style.background = "red";
	            document.getElementById("message").innerHTML = response.message + "<br>";
	        }
	    })
	    .catch(error => {
			document.getElementById("message").style.background = "red";
	        document.getElementById("message").innerHTML = "Error: " + error.message + "<br>";
	        console.log(error.message);
	    });
	};
}