function Color() {
	this.att = {
		nombre: "",
	    codigo: "",
	    melamina: false,
	    tapacantos: false,
	    fondo: false
	};

/*UPDATE*/
	let guardarEditado = function(id) {
		fetch('/actualizar_color/' + id + '/', {
	        method: 'POST',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.att)
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
	            document.getElementById("message").innerHTML  += response.message + ". color guardado! <br>";
	            verifyResponsesDone();
	        } else {
	            console.log(response.status, response.statusText);
	            document.getElementById("message").innerHTML  += "<p style='color:red;'>" + response.message + "</p>";
	            verifyResponsesDone();
	        }
	    })
	    .catch(error => {
	        document.getElementById("message").innerHTML  += "<p style='background:red;'>Error: " + error.message + "</p>";
	        console.log(error.message);
	        verifyResponsesDone();
	    });
	};

/*ADD*/
	let guardarNuevo = function() {
		fetch('/nuevo_color/', {
	        method: 'POST',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.att)
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
	            document.getElementById("message").innerHTML  += response.message + ". color guardado! <br>";
	            verifyResponsesDone();
	        } else {
	            console.log(response.status, response.statusText);
	            document.getElementById("message").innerHTML  += "<p style='color:red;'>" + response.message + "</p>";
	            verifyResponsesDone();
	        }
	    })
	    .catch(error => {
	        document.getElementById("message").innerHTML  += "<p style='background:red;'>Error: " + error.message + "</p>";
	        console.log(error.message);
	        verifyResponsesDone();
	    });
	};

/*DELETE*/
	let borrar = function(id) {
	    fetch('/delete_color/' + id + '/', {
	        method: 'DELETE',
	        headers: { 'Content-Type': 'application/json' },
	    })
	    .then(response => {
	        if (response.ok) {
	            alert(response.statusText);
	        }
	    })
	    .catch(error => {
	        alert(error.message);
	    });
	};
};

var colorObj = new Color();