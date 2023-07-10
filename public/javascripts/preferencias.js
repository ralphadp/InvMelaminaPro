Object.defineProperty(String.prototype, 'capitalizeFirst', {
	value: function() {
	  return this.charAt(0).toUpperCase() + this.slice(1);
	},
	enumerable: false
});

function Color() {
	this.att = {
	    nombre: "",
	    codigo: "",
	    melamina: false,
	    tapacantos: false,
	    fondo: false
	};

	this.getRowBuild = function(next_index) {
		return `<tr id='row_${next_index}'>
					<td id='c_nombre_${next_index}' contenteditable='true'></td>
					<td id='c_codigo_${next_index}' contenteditable='true'></td>
					<td><input id='c_melamina_${next_index}' type='checkbox'/></td>
					<td><input id='c_tapacantos_${next_index}' type='checkbox'/></td>
					<td><input id='c_fondo_${next_index}' type='checkbox'/></td>
					<td><button type='button' title='Guardar' id='gc_${next_index}' onclick='guardarNuevo(this.id)'>o</button>
						<button type='button' title='Borrar' id='bc_${next_index}' onclick='borrarNuevo(this.id)'>X</button>
					</td>
				</tr>`;
	}

	this.assignar = function(row_id) {
		this.att.nombre =     document.getElementById("c_nombre_" + row_id).innerText;
		this.att.codigo =     document.getElementById("c_codigo_" + row_id).innerText;
		this.att.melamina =   $("#c_melamina_" + row_id).is(":checked");
		this.att.tapacantos = $("#c_tapacantos_" + row_id).is(":checked");
		this.att.fondo =      $("#c_fondo_" + row_id).is(":checked");
	}

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
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML  = response.message + ". Color guardado!<br>";
	        } else {
	            console.log(response.status, response.statusText);
				document.getElementById("message").style.background = "red";
	            document.getElementById("message").innerHTML  = response.message + "<br>";
	        }
	    })
	    .catch(error => {
			document.getElementById("message").style.background = "red";
	        document.getElementById("message").innerHTML  = "Error: " + error.message+ "<br>";
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
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Color guardado! <br>";
	            if (response.action == "reload") {
	            	 window.location.reload();
	            }
	        } else {
	            console.log(response.status, response.statusText);
				document.getElementById("message").style.background = "red";
	            document.getElementById("message").innerHTML = response.message + "<br>";
	        }
	    })
	    .catch(error => {
			document.getElementById("message").style.background = "red";
	        document.getElementById("message").innerHTML = error.message + "<br>";
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
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML  = response.message + ". Color eliminado! <br>";
	            document.getElementById("row_" + id).outerHTML = ""; ///need to move this code
	        } else {
	            console.log(response.status, response.statusText);
				document.getElementById("message").style.background = "red";
	            document.getElementById("message").innerHTML = response.message + "<br>";
	        }
	    })
	    .catch(error => {
			document.getElementById("message").style.background = "red";
	        document.getElementById("message").innerHTML = "Error: " + error.message + "<br>";
	        alert(error.message);
	    });
	};
};


function Marca() {
	this.att = {
	    nombre: "",
	    melamina: false,
	    tapacantos: false,
		pegamento: false,
	    fondo: false
	};

	this.getRowBuild = function(next_index) {
		return `<tr id='row_${next_index}'>
					<td id='m_nombre_${next_index}' contenteditable='true'></td>
					<td><input id='m_melamina_${next_index}' type='checkbox'/></td>
					<td><input id='m_tapacantos_${next_index}' type='checkbox'/></td>
					<td><input id='m_pegamento_${next_index}' type='checkbox'/></td>
					<td><input id='m_fondo_${next_index}' type='checkbox'/></td>
					<td><button type='button' title='Guardar' id='gm_${next_index}' onclick='guardarNuevo(this.id)'>o</button>
						<button type='button' title='Borrar' id='bc_${next_index}' onclick='borrarNuevo(this.id)'>X</button>
					</td>
				</tr>`;
	}

	this.assignar = function(row_id) {
		this.att.nombre =     document.getElementById("m_nombre_" + row_id).innerText;
		this.att.melamina =   $("#m_melamina_" + row_id).is(":checked");
		this.att.tapacantos = $("#m_tapacantos_" + row_id).is(":checked");
		this.att.pegamento =  $("#m_pegamento_" + row_id).is(":checked");
		this.att.fondo =      $("#m_fondo_" + row_id).is(":checked");
	}

/*UPDATE*/
	this.guardarEditado = function(id) {
		fetch('/actualizar_marca/' + id + '/', {
	        method: 'PUT',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.att)
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Marca guardada! <br>";
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

/*ADD*/
	this.guardarNuevo = function() {
		fetch('/nueva_marca/', {
	        method: 'POST',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.att)
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Marca guardada!<br>";
	            if (response.action == "reload") {
	            	 window.location.reload();
	            }
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

/*DELETE*/
	this.borrar = function(id) {
	    fetch('/delete_marca/' + id + '/', {
	        method: 'DELETE',
	        headers: { 'Content-Type': 'application/json' },
	    })
		.then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Marca eliminada! <br>";
	            document.getElementById("row_" + id).outerHTML = ""; ///need to move this code
	        } else {
	            console.log(response.status, response.statusText);
				document.getElementById("message").style.background = "red";
	            document.getElementById("message").innerHTML = response.message + "<br>";
	        }
	    })
	    .catch(error => {
			document.getElementById("message").style.background = "red";
	        document.getElementById("message").innerHTML = "Error: " + error.message + "<br>";
	        alert(error.message);
	    });
	};
};

var ColorObj = new Color();
var MarcaObj = new Marca();
