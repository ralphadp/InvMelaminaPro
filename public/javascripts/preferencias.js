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
						<button type='button' title='Borrar' id='bm_${next_index}' onclick='borrarNuevo(this.id)'>X</button>
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

function Medidas() {
	this.att = {
	    nombre: "",
	    melamina: false,
	    tapacantos: false,
	    fondo: false
	};

	this.getRowBuild = function(next_index) {
		return `<tr id='row_${next_index}'>
					<td id='e_nombre_${next_index}' contenteditable='true'></td>
					<td><input id='e_melamina_${next_index}' type='checkbox'/></td>
					<td><input id='e_tapacantos_${next_index}' type='checkbox'/></td>
					<td><input id='e_fondo_${next_index}' type='checkbox'/></td>
					<td><button type='button' title='Guardar' id='ge_${next_index}' onclick='guardarNuevo(this.id)'>o</button>
						<button type='button' title='Borrar' id='be_${next_index}' onclick='borrarNuevo(this.id)'>X</button>
					</td>
				</tr>`;
	}

	this.assignar = function(row_id) {
		this.att.nombre =     document.getElementById("e_nombre_" + row_id).innerText;
		this.att.melamina =   $("#e_melamina_" + row_id).is(":checked");
		this.att.tapacantos = $("#e_tapacantos_" + row_id).is(":checked");
		this.att.fondo =      $("#e_fondo_" + row_id).is(":checked");
	}

/*UPDATE*/
	this.guardarEditado = function(id) {
		fetch('/actualizar_medida/' + id + '/', {
	        method: 'PUT',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.att)
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Medida guardada! <br>";
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
		fetch('/nueva_medida/', {
	        method: 'POST',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.att)
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Medida guardada!<br>";
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
	    fetch('/delete_medida/' + id + '/', {
	        method: 'DELETE',
	        headers: { 'Content-Type': 'application/json' },
	    })
		.then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Medida eliminada! <br>";
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

function Provedor() {
	this.att = {
	    nombre: "",
	    direccion: "",
	    celular: "",
	    email: "",
		items: "",
	};

	this.getRowBuild = function(next_index) {
		return `<tr id='row_${next_index}'>
					<td id='p_nombre_${next_index}' contenteditable='true'></td>
					<td id='p_direccion_${next_index}' contenteditable='true'></td>
					<td id='p_celular_${next_index}' contenteditable='true'></td>
					<td id='p_email_${next_index}' contenteditable='true'></td>
					<td id='p_items_${next_index}' contenteditable='true'></td>
					<td><button type='button' title='Guardar' id='gp_${next_index}' onclick='guardarNuevo(this.id)'>o</button>
						<button type='button' title='Borrar' id='bp_${next_index}' onclick='borrarNuevo(this.id)'>X</button>
					</td>
				</tr>`;
	}

	this.assignar = function(row_id) {
		this.att.nombre = document.getElementById("p_nombre_" + row_id).innerText;
		this.att.direccion = document.getElementById("p_direccion_" + row_id).innerText;
		this.att.celular = document.getElementById("p_celular_" + row_id).innerText;
		this.att.email = document.getElementById("p_email_" + row_id).innerText;
		this.att.items = document.getElementById("p_items_" + row_id).innerText;
	}

/*UPDATE*/
	this.guardarEditado = function(id) {
		fetch('/actualizar_provedor/' + id + '/', {
	        method: 'PUT',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.att)
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Provedor addicionado! <br>";
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
		fetch('/nuevo_provedor/', {
	        method: 'POST',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.att)
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Provedor guardado!<br>";
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
	    fetch('/delete_provedor/' + id + '/', {
	        method: 'DELETE',
	        headers: { 'Content-Type': 'application/json' },
	    })
		.then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Provedor eliminado! <br>";
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

function Item() {
	this.att = {
	    nombre: "",
	    unidad: "",
	    embalaje: "",
	};

	this.getRowBuild = function(next_index) {
		return `<tr id='row_${next_index}'>
					<td id='i_nombre_${next_index}' contenteditable='true'></td>
					<td id='i_unidad_${next_index}' contenteditable='true'></td>
					<td id='i_embalaje_${next_index}' contenteditable='true'></td>
					<td><button type='button' title='Guardar' id='gi_${next_index}' onclick='guardarNuevo(this.id)'>o</button>
						<button type='button' title='Borrar' id='bi_${next_index}' onclick='borrarNuevo(this.id)'>X</button>
					</td>
				</tr>`;
	}

	this.assignar = function(row_id) {
		this.att.nombre = document.getElementById("i_nombre_" + row_id).innerText;
		this.att.unidad = document.getElementById("i_unidad_" + row_id).innerText;
		this.att.embalaje = document.getElementById("i_embalaje_" + row_id).innerText;
	}

/*UPDATE*/
	this.guardarEditado = function(id) {
		fetch('/actualizar_item/' + id + '/', {
	        method: 'PUT',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.att)
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Producto addicionado! <br>";
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
		fetch('/nuevo_item/', {
	        method: 'POST',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.att)
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Producto guardado!<br>";
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
	    fetch('/delete_item/' + id + '/', {
	        method: 'DELETE',
	        headers: { 'Content-Type': 'application/json' },
	    })
		.then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Producto eliminado! <br>";
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

function Cliente() {
	this.att = {
	    nombre: "",
	    ci: "",
	    nit: "",
		direccion: "",
		celular: "",
		email: "",
		empresa: "",
		tipo: "",
	};

	this.getRowBuild = function(next_index) {
		return `<tr id='row_${next_index}'>
					<td id='l_nombre_${next_index}' contenteditable='true'></td>
					<td id='l_ci_${next_index}' contenteditable='true'></td>
					<td id='l_nit_${next_index}' contenteditable='true'></td>
					<td id='l_direccion_${next_index}' contenteditable='true'></td>
					<td id='l_celular_${next_index}' contenteditable='true'></td>
					<td id='l_email_${next_index}' contenteditable='true'></td>
					<td id='l_empresa_${next_index}' contenteditable='true'></td>
					<td id='l_tipo_${next_index}' contenteditable='true'></td>
					<td><button type='button' title='Guardar' id='gl_${next_index}' onclick='guardarNuevo(this.id)'>o</button>
						<button type='button' title='Borrar' id='bl_${next_index}' onclick='borrarNuevo(this.id)'>X</button>
					</td>
				</tr>`;
	}

	this.assignar = function(row_id) {
		this.att.nombre = document.getElementById("l_nombre_" + row_id).innerText;
		this.att.ci = document.getElementById("l_ci_" + row_id).innerText;
		this.att.nit = document.getElementById("l_nit_" + row_id).innerText;
		this.att.direccion = document.getElementById("l_direccion_" + row_id).innerText;
		this.att.celular = document.getElementById("l_celular_" + row_id).innerText;
		this.att.email = document.getElementById("l_email_" + row_id).innerText;
		this.att.empresa = document.getElementById("l_empresa_" + row_id).innerText;
		this.att.tipo = document.getElementById("l_tipo_" + row_id).innerText;
	}

/*UPDATE*/
	this.guardarEditado = function(id) {
		fetch('/actualizar_cliente/' + id + '/', {
	        method: 'PUT',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.att)
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Cliente addicionado! <br>";
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
		fetch('/nuevo_cliente/', {
	        method: 'POST',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.att)
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Cliente guardado!<br>";
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
	    fetch('/delete_cliente/' + id + '/', {
	        method: 'DELETE',
	        headers: { 'Content-Type': 'application/json' },
	    })
		.then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Cliente eliminado! <br>";
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

function Melamina() {
	this.att = {
	    color:"",
		provedor:"",
		medidas:"",
		marca:"",
		precio_compra:0,
		precio_venta:0,
		laminaxpaquete:0,

	};

	this.getRowBuild = function(next_index) {
		return `<tr id='row_${next_index}'>
					<td id='a_color_${next_index}' contenteditable='true'></td>
					<td id='a_provedor_${next_index}' contenteditable='true'></td>
					<td id='a_medidas_${next_index}' contenteditable='true'></td>
					<td id='a_marca_${next_index}' contenteditable='true'></td>
					<td id='a_precio_compra_${next_index}' contenteditable='true'></td>
					<td id='a_precio_venta_${next_index}' contenteditable='true'></td>
					<td id='a_laminaxpaquete_${next_index}' contenteditable='true'></td>
					<td><button type='button' title='Guardar' id='ga_${next_index}' onclick='guardarNuevo(this.id)'>o</button>
						<button type='button' title='Borrar' id='ba_${next_index}' onclick='borrarNuevo(this.id)'>X</button>
					</td>
				</tr>`;
	}

	this.assignar = function(row_id) {
		this.att.color = document.getElementById("a_color_" + row_id).innerText;
		this.att.provedor = document.getElementById("a_provedor_" + row_id).innerText;
		this.att.medidas = document.getElementById("a_medidas_" + row_id).innerText;
		this.att.marca = document.getElementById("a_marca_" + row_id).innerText;
		this.att.precio_compra = document.getElementById("a_precio_compra_" + row_id).innerText;
		this.att.precio_venta = document.getElementById("a_precio_venta_" + row_id).innerText;
		this.att.laminaxpaquete = document.getElementById("a_laminaxpaquete_" + row_id).innerText;
	}

/*UPDATE*/
	this.guardarEditado = function(id) {
		fetch('/actualizar_melamina/' + id + '/', {
	        method: 'PUT',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.att)
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Melamina addicionado! <br>";
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
		fetch('/nueva_melamina/', {
	        method: 'POST',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.att)
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Melamina guardado!<br>";
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
	    fetch('/delete_melamina/' + id + '/', {
	        method: 'DELETE',
	        headers: { 'Content-Type': 'application/json' },
	    })
		.then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Melamina eliminado! <br>";
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

function Tapacantos() {
	this.att = {
	    color:"",
		provedor:"",
		medidas:"",
		marca:"",
		precio_compra:0,
		precio_venta:0,
		metrosxrollo:0,
		rollosxcaja:0,
		precio_venta_metros:0,
		precio_compra_metros:0,

	};

	this.getRowBuild = function(next_index) {
		return `<tr id='row_${next_index}'>
					<td id='t_color_${next_index}' contenteditable='true'></td>
					<td id='t_provedor_${next_index}' contenteditable='true'></td>
					<td id='t_medidas_${next_index}' contenteditable='true'></td>
					<td id='t_marca_${next_index}' contenteditable='true'></td>
					<td id='t_precio_compra_${next_index}' contenteditable='true'></td>
					<td id='t_precio_venta_${next_index}' contenteditable='true'></td>
					<td id='t_metrosxrollo_${next_index}' contenteditable='true'></td>
					<td id='t_rollosxcaja_${next_index}' contenteditable='true'></td>
					<td id='t_precio_venta_metros_${next_index}' contenteditable='true'></td>
					<td id='t_precio_compra_metros_${next_index}' contenteditable='true'></td>
					<td><button type='button' title='Guardar' id='gt_${next_index}' onclick='guardarNuevo(this.id)'>o</button>
						<button type='button' title='Borrar' id='bt_${next_index}' onclick='borrarNuevo(this.id)'>X</button>
					</td>
				</tr>`;
	}

	this.assignar = function(row_id) {
		this.att.color = document.getElementById("t_color_" + row_id).innerText;
		this.att.provedor = document.getElementById("t_provedor_" + row_id).innerText;
		this.att.medidas = document.getElementById("t_medidas_" + row_id).innerText;
		this.att.marca = document.getElementById("t_marca_" + row_id).innerText;
		this.att.precio_compra = document.getElementById("t_precio_compra_" + row_id).innerText;
		this.att.precio_venta = document.getElementById("t_precio_venta_" + row_id).innerText;
		this.att.metrosxrollo = document.getElementById("t_metrosxrollo_" + row_id).innerText;
		this.att.rollosxcaja = document.getElementById("t_rollosxcaja_" + row_id).innerText;
		this.att.precio_venta_metros = document.getElementById("t_precio_venta_metros_" + row_id).innerText;
		this.att.precio_compra_metros = document.getElementById("t_precio_compra_metros_" + row_id).innerText;
	}

/*UPDATE*/
	this.guardarEditado = function(id) {
		fetch('/actualizar_tapacantos/' + id + '/', {
	        method: 'PUT',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.att)
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Tapacantos addicionado! <br>";
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
		fetch('/nuevo_tapacantos/', {
	        method: 'POST',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.att)
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Tapacantos guardado!<br>";
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
	    fetch('/delete_tapacantos/' + id + '/', {
	        method: 'DELETE',
	        headers: { 'Content-Type': 'application/json' },
	    })
		.then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Tapacantos eliminado! <br>";
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

function Pegamento() {
	this.att = {
		provedor:"",
		marca:"",
		precio_compra:0,
		precio_venta:0,
	};

	this.getRowBuild = function(next_index) {
		return `<tr id='row_${next_index}'>
					<td id='p_provedor_${next_index}' contenteditable='true'></td>
					<td id='p_marca_${next_index}' contenteditable='true'></td>
					<td id='p_precio_compra_${next_index}' contenteditable='true'></td>
					<td id='p_precio_venta_${next_index}' contenteditable='true'></td>
					<td><button type='button' title='Guardar' id='gp_${next_index}' onclick='guardarNuevo(this.id)'>o</button>
						<button type='button' title='Borrar' id='bp_${next_index}' onclick='borrarNuevo(this.id)'>X</button>
					</td>
				</tr>`;
	}

	this.assignar = function(row_id) {
		this.att.provedor = document.getElementById("p_provedor_" + row_id).innerText;
		this.att.marca = document.getElementById("p_marca_" + row_id).innerText;
		this.att.precio_compra = document.getElementById("p_precio_compra_" + row_id).innerText;
		this.att.precio_venta = document.getElementById("p_precio_venta_" + row_id).innerText;
	}

/*UPDATE*/
	this.guardarEditado = function(id) {
		fetch('/actualizar_pegamento/' + id + '/', {
	        method: 'PUT',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.att)
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Pegamento addicionado! <br>";
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
		fetch('/nuevo_pegamento/', {
	        method: 'POST',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.att)
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Pegamento guardado!<br>";
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
	    fetch('/delete_pegamento/' + id + '/', {
	        method: 'DELETE',
	        headers: { 'Content-Type': 'application/json' },
	    })
		.then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Pegamento eliminado! <br>";
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

function Fondo() {
	this.att = {
	    color:"",
		provedor:"",
		medidas:"",
		marca:"",
		precio_compra:0,
		precio_venta:0,
		laminaxpaquete:0,
	};

	this.getRowBuild = function(next_index) {
		return `<tr id='row_${next_index}'>
					<td id='f_color_${next_index}' contenteditable='true'></td>
					<td id='f_provedor_${next_index}' contenteditable='true'></td>
					<td id='f_medidas_${next_index}' contenteditable='true'></td>
					<td id='f_marca_${next_index}' contenteditable='true'></td>
					<td id='f_precio_compra_${next_index}' contenteditable='true'></td>
					<td id='f_precio_venta_${next_index}' contenteditable='true'></td>
					<td id='f_laminaxpaquete_${next_index}' contenteditable='true'></td>
					<td><button type='button' title='Guardar' id='gf_${next_index}' onclick='guardarNuevo(this.id)'>o</button>
						<button type='button' title='Borrar' id='bf_${next_index}' onclick='borrarNuevo(this.id)'>X</button>
					</td>
				</tr>`;
	}

	this.assignar = function(row_id) {
		this.att.color = document.getElementById("f_color_" + row_id).innerText;
		this.att.provedor = document.getElementById("f_provedor_" + row_id).innerText;
		this.att.medidas = document.getElementById("f_medidas_" + row_id).innerText;
		this.att.marca = document.getElementById("f_marca_" + row_id).innerText;
		this.att.precio_compra = document.getElementById("f_precio_compra_" + row_id).innerText;
		this.att.precio_venta = document.getElementById("f_precio_venta_" + row_id).innerText;
		this.att.laminaxpaquete = document.getElementById("f_laminaxpaquete_" + row_id).innerText;
	}

/*UPDATE*/
	this.guardarEditado = function(id) {
		fetch('/actualizar_fondo/' + id + '/', {
	        method: 'PUT',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.att)
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Fondo addicionado! <br>";
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
		fetch('/nuevo_fondo/', {
	        method: 'POST',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.att)
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Fondo guardado!<br>";
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
	    fetch('/delete_fondo/' + id + '/', {
	        method: 'DELETE',
	        headers: { 'Content-Type': 'application/json' },
	    })
		.then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Fondo eliminado! <br>";
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