function Color() {
	this.att = {
	    nombre: "",
	    codigo: "",
	    melamina: false,
	    tapacantos: false,
	    fondo: false
	};

/*UPDATE*/
	this.guardarEditado = function(id) {
		fetch('/actualizar_color/' + id + '/', {
	        method: 'PUT',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.att)
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
	            document.getElementById("message").innerHTML  += response.message + ". Color guardado! <br>";
	        } else {
	            console.log(response.status, response.statusText);
	            document.getElementById("message").innerHTML  += "<p style='color:red;'>" + response.message + "</p>";
	        }
	    })
	    .catch(error => {
	        document.getElementById("message").innerHTML  += "<p style='background:red;'>Error: " + error.message + "</p>";
	        console.log(error.message);
	    });
	};

/*ADD*/
	this.guardarNuevo = function() {
		fetch('/nuevo_color/', {
	        method: 'POST',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.att)
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
	            document.getElementById("message").innerHTML  += response.message + ". Color guardado! <br>";
	            if (response.action == "reload") {
	            	 window.location.reload();
	            }
	        } else {
	            console.log(response.status, response.statusText);
	            document.getElementById("message").innerHTML  += "<p style='color:red;'>" + response.message + "</p>";
	        }
	    })
	    .catch(error => {
	        document.getElementById("message").innerHTML  += "<p style='background:red;'>Error: " + error.message + "</p>";
	        console.log(error.message);
	    });
	};

/*DELETE*/
	this.borrar = function(id) {
	    fetch('/delete_color/' + id + '/', {
	        method: 'DELETE',
	        headers: { 'Content-Type': 'application/json' },
	    })
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
	            document.getElementById("message").innerHTML  += response.message + ". Color guardado! <br>";
	            document.getElementById("row_" + id).outerHTML = ""; ///need to move this code
	        } else {
	            console.log(response.status, response.statusText);
	            document.getElementById("message").innerHTML  += "<p style='color:red;'>" + response.message + "</p>";
	        }
	    })
	    .catch(error => {
	        alert(error.message);
	    });
	};
};

var colorObj = new Color();
