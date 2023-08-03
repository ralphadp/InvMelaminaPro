Object.defineProperty(String.prototype, 'capitalizeFirst', {
	value: function() {
	  return this.charAt(0).toUpperCase() + this.slice(1);
	},
	enumerable: false
});

function getSelectedOption(elementId) {
	var element = document.getElementById(elementId);
	return element.options[element.selectedIndex].value;
}

function getInput(elementId) {
	var element = document.getElementById(elementId);
	return element.value;
}

function Color() {
	this.att = {
	    nombre: "",
	    codigo: "",
	    melamina: false,
	    tapacantos: false,
	    fondo: false,
		tapatornillos: false
	};

	this.getRowBuild = function(next_index) {
		return `<tr style='background-color:#94c6e7' id='row_${next_index}'>
					<td contenteditable='true' class='stopSpaces' id='c_nombre_${next_index}' ></td>
					<td><input type="color" id="c_codigo_${next_index}" value="#ffffff" /></td>
					<td><input id='c_melamina_${next_index}' type='checkbox'/></td>
					<td><input id='c_tapacantos_${next_index}' type='checkbox'/></td>
					<td><input id='c_fondo_${next_index}' type='checkbox'/></td>
					<td><input id='c_tapatornillos_${next_index}' type='checkbox'/></td>
					<td><button class='pref' type='button' title='Guardar' id='gc_${next_index}' onclick='guardarNuevo(this.id,"colores_add")'><i class="fa fa-save"></i></button>
						<button class='pref' type='button' title='Borrar' id='bc_${next_index}' onclick='borrarNuevo(this.id,"colores_add")'><i class="fa fa-trash"></i></button>
					</td>
				</tr>`;
	}

	this.assignar = function(row_id) {
		this.att.nombre =     document.getElementById("c_nombre_" + row_id).innerText.trim();
		this.att.codigo =     document.getElementById("c_codigo_" + row_id).value;
		this.att.melamina =   $("#c_melamina_" + row_id).is(":checked");
		this.att.tapacantos = $("#c_tapacantos_" + row_id).is(":checked");
		this.att.fondo =      $("#c_fondo_" + row_id).is(":checked");
		this.att.tapatornillos = $("#c_tapatornillos_" + row_id).is(":checked");
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
	            document.getElementById("message").innerHTML = response.message + ". Color Nuevo guardado! <br>";
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
		if (!confirm("Realmente desea borrar el color!\n Presione Ok para Borrar o de lo contrario presione Cancel.")) {
			return;
		}
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
	    fondo: false,
		tapatornillos: false,
	};

	this.getRowBuild = function(next_index) {
		return `<tr style='background-color:#94c6e7' id='row_${next_index}'>
					<td class='stopSpaces' id='m_nombre_${next_index}' contenteditable='true'></td>
					<td><input id='m_melamina_${next_index}' type='checkbox'/></td>
					<td><input id='m_tapacantos_${next_index}' type='checkbox'/></td>
					<td><input id='m_pegamento_${next_index}' type='checkbox'/></td>
					<td><input id='m_fondo_${next_index}' type='checkbox'/></td>
					<td><input id='m_tapatornillos_${next_index}' type='checkbox'/></td>
					<td><button class='pref' type='button' title='Guardar' id='gm_${next_index}' onclick='guardarNuevo(this.id,"marcas_add")'><i class="fa fa-save"></i></button>
						<button class='pref' type='button' title='Borrar' id='bm_${next_index}' onclick='borrarNuevo(this.id,"marcas_add")'><i class="fa fa-trash"></i></button>
					</td>
				</tr>`;
	}

	this.assignar = function(row_id) {
		this.att.nombre =     document.getElementById("m_nombre_" + row_id).innerText.trim();
		this.att.melamina =   $("#m_melamina_" + row_id).is(":checked");
		this.att.tapacantos = $("#m_tapacantos_" + row_id).is(":checked");
		this.att.pegamento =  $("#m_pegamento_" + row_id).is(":checked");
		this.att.fondo =      $("#m_fondo_" + row_id).is(":checked");
		this.att.tapatornillos = $("#m_tapatornillos_" + row_id).is(":checked");
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
		if (!confirm("Realmente desea borrar la marca!\n Presione Ok para Borrar o de lo contrario presione Cancel.")) {
			return;
		}
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
	    fondo: false,
		tapatornillos: false
	};

	this.getRowBuild = function(next_index) {
		return `<tr style='background-color:#94c6e7' id='row_${next_index}'>
					<td class='stopSpaces' id='e_nombre_${next_index}' contenteditable='true'></td>
					<td><input id='e_melamina_${next_index}' type='checkbox'/></td>
					<td><input id='e_tapacantos_${next_index}' type='checkbox'/></td>
					<td><input id='e_fondo_${next_index}' type='checkbox'/></td>
					<td><input id='e_tapatornillos_${next_index}' type='checkbox'/></td>
					<td><button class='pref' type='button' title='Guardar' id='ge_${next_index}' onclick='guardarNuevo(this.id,"medidas_add")'><i class="fa fa-save"></i></button>
						<button class='pref' type='button' title='Borrar' id='be_${next_index}' onclick='borrarNuevo(this.id,"medidas_add")'><i class="fa fa-trash"></i></button>
					</td>
				</tr>`;
	}

	this.assignar = function(row_id) {
		this.att.nombre =     document.getElementById("e_nombre_" + row_id).innerText.trim();
		this.att.melamina =   $("#e_melamina_" + row_id).is(":checked");
		this.att.tapacantos = $("#e_tapacantos_" + row_id).is(":checked");
		this.att.fondo =      $("#e_fondo_" + row_id).is(":checked");
		this.att.tapatornillos = $("#e_tapatornillos_" + row_id).is(":checked");
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
		if (!confirm("Realmente desea borrar la medida!\n Presione Ok para Borrar o de lo contrario presione Cancel.")) {
			return;
		}
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
		items: [],
	};

	this.getRowBuild = function(next_index) {
		return `<tr style='background-color:#94c6e7' id='row_${next_index}'>
					<td class="item_td stopSpaces" id='p_nombre_${next_index}' contenteditable='true'></td>
					<td class="item_td" id='p_direccion_${next_index}' contenteditable='true'></td>
					<td class="item_td" id='p_celular_${next_index}' contenteditable='true'></td>
					<td class="item_td" id='p_email_${next_index}' contenteditable='true'></td>
					<td class="itemtd" id='p_items_${next_index}'>
						<table>
							<tr>
								<td class="itemtd">Melamina</td>
								<td class="itemtd">Tapacantos</td>
								<td class="itemtd">Pegamento</td>
								<td class="itemtd">Fondo</td>
								<td class="itemtd">Tapatornillo</td>
							</tr>
							<tr>
								<td class="itemtd"><input id="p_items_${next_index}_Melamina" type="checkbox"/></td>
								<td class="itemtd"><input id="p_items_${next_index}_Tapacantos" type="checkbox"/></td>
								<td class="itemtd"><input id="p_items_${next_index}_Pegamento" type="checkbox"/></td>
								<td class="itemtd"><input id="p_items_${next_index}_Fondo" type="checkbox"/></td>
								<td class="itemtd"><input id="p_items_${next_index}_Tapatornillos" type="checkbox"/></td>
							</tr>
						</table>
					</td>
					<td><button class='pref' type='button' title='Guardar' id='gp_${next_index}' onclick='guardarNuevo(this.id,"provedor_add")'><i class="fa fa-save"></i></button>
						<button class='pref' type='button' title='Borrar' id='bp_${next_index}' onclick='borrarNuevo(this.id,"provedor_add")'><i class="fa fa-trash"></i></button>
					</td>
				</tr>`;
	}

	this.assignar = function(row_id) {
		this.att.nombre    = document.getElementById("p_nombre_" + row_id).innerText.trim();
		this.att.direccion = document.getElementById("p_direccion_" + row_id).innerText.trim();
		this.att.celular   = document.getElementById("p_celular_" + row_id).innerText.trim();
		this.att.email     = document.getElementById("p_email_" + row_id).innerText.trim();

		let index = 0;
		this.att.items.length = 0;
		["Melamina","Tapacantos","Pegamento","Fondo","Tapatornillos"].forEach((producto) => {
			if (document.getElementById("p_items_" + row_id + "_" + producto).checked) {
				this.att.items[index++] = producto;
			}
		});
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
		if (!confirm("Realmente desea borrar al provedor!\n Presione Ok para Borrar o de lo contrario presione Cancel.")) {
			return;
		}
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
		return `<tr style='background-color:#94c6e7' id='row_${next_index}'>
					<td class='stopSpaces' id='i_nombre_${next_index}' contenteditable='true'></td>
					<td class='stopSpaces' id='i_unidad_${next_index}' contenteditable='true'></td>
					<td class='stopSpaces' id='i_embalaje_${next_index}' contenteditable='true'></td>
					<td><button class='pref' type='button' title='Guardar' id='gi_${next_index}' onclick='guardarNuevo(this.id,"producto_add")'><i class="fa fa-save"></i></button>
						<button class='pref' type='button' title='Borrar' id='bi_${next_index}' onclick='borrarNuevo(this.id,"producto_add")'><i class="fa fa-trash"></i></button>
					</td>
				</tr>`;
	}

	this.assignar = function(row_id) {
		this.att.nombre = document.getElementById("i_nombre_" + row_id).innerText.trim();
		this.att.unidad = document.getElementById("i_unidad_" + row_id).innerText.trim();
		this.att.embalaje = document.getElementById("i_embalaje_" + row_id).innerText.trim();
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
		if (!confirm("Realmente desea borrar el producto!\n Presione Ok para Borrar o de lo contrario presione Cancel.")) {
			return;
		}
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
		return `<tr style='background-color:#94c6e7' id='row_${next_index}'>
					<td id='l_nombre_${next_index}' contenteditable='true'></td>
					<td id='l_ci_${next_index}' contenteditable='true'></td>
					<td id='l_nit_${next_index}' contenteditable='true'></td>
					<td id='l_direccion_${next_index}' contenteditable='true'></td>
					<td id='l_celular_${next_index}' contenteditable='true'></td>
					<td id='l_email_${next_index}' contenteditable='true'></td>
					<td id='l_empresa_${next_index}' contenteditable='true'></td>
					<td id='l_tipo_${next_index}' contenteditable='true'></td>
					<td><button class='pref' type='button' title='Guardar' id='gl_${next_index}' onclick='guardarNuevo(this.id,"cliente_add")'><i class="fa fa-save"></i></button>
						<button class='pref' type='button' title='Borrar' id='bl_${next_index}' onclick='borrarNuevo(this.id,"cliente_add")'><i class="fa fa-trash"></i></button>
					</td>
				</tr>`;
	}

	this.assignar = function(row_id) {
		this.att.nombre = document.getElementById("l_nombre_" + row_id).innerText.trim();
		this.att.ci = document.getElementById("l_ci_" + row_id).innerText.trim();
		this.att.nit = document.getElementById("l_nit_" + row_id).innerText.trim();
		this.att.direccion = document.getElementById("l_direccion_" + row_id).innerText.trim();
		this.att.celular = document.getElementById("l_celular_" + row_id).innerText.trim();
		this.att.email = document.getElementById("l_email_" + row_id).innerText.trim();
		this.att.empresa = document.getElementById("l_empresa_" + row_id).innerText.trim();
		this.att.tipo = document.getElementById("l_tipo_" + row_id).innerText.trim();
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
		if (!confirm("Realmente desea borrar al cliente!\n Presione Ok para Borrar o de lo contrario presione Cancel.")) {
			return;
		}
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
		precio_venta_interno:0,
		laminaxpaquete:0,
		apedido:false,
		link_photo:"",
	};

	this.getRowBuild = function(next_index, listas) {
		var colorOptions;
		for (var i=0; i < listas.color.length; i++) {
			if (listas.color[i].melamina)  {
				colorOptions += `<option value="${listas.color[i]._id.toString()}">${listas.color[i].nombre}</option>`;
			}
		}
		var medidasOptions;
		for (var i=0; i < listas.medidas.length; i++) {
			if (listas.medidas[i].melamina)  {
				medidasOptions += `<option value="${listas.medidas[i]._id.toString()}">${listas.medidas[i].nombre}</option>`;
			}
		}
		var provedorOptions;
		for (var i=0; i < listas.provedor.length; i++) {
			if (listas.provedor[i].items.includes("Melamina"))  {
				provedorOptions += `<option value="${listas.provedor[i]._id.toString()}">${listas.provedor[i].nombre}</option>`;
			}
		}
		var marcaOptions;
		for (var i=0; i < listas.marca.length; i++) {
			if (listas.marca[i].melamina)  {
				marcaOptions += `<option value="${listas.marca[i]._id.toString()}">${listas.marca[i].nombre}</option>`;
			}
		}

		return `<tr style='background-color:#94c6e7' id='row_${next_index}'>
					<td class='item_td' id='a_color_${next_index}'>
						<select id="color_melamina_${next_index}" >
							<option value="" style="background:yellow" selected>(Seleccione un color)</option>
							${colorOptions}
						</select>
					</td>
					<td class='item_td' id='a_provedor_${next_index}'>
					    <select id="provedor_melamina_${next_index}">
							<option value="" style="background:yellow" selected>(Seleccione un provedor)</option>
							${provedorOptions}
						</select>
					</td>
					<td class='item_td' id='a_medidas_${next_index}'>
					    <select id="medidas_melamina_${next_index}">
						<option value="" style="background:yellow" selected>(Seleccione una medida)</option>
							${medidasOptions}
						</select>
					</td>
					<td class='item_td' id='a_marca_${next_index}'>
					    <select id="marca_melamina_${next_index}">
							<option value="" style="background:yellow" selected>(Seleccione un marca)</option>
							${marcaOptions}
						</select>
					</td>
					<td class='item_td numericAllow' id='a_precio_compra_${next_index}' contenteditable='true'></td>
					<td class='item_td numericAllow' id='a_precio_venta_${next_index}' contenteditable='true'></td>
					<td class='item_td numericAllow' id='a_precio_venta_interno_${next_index}' contenteditable='true'></td>
					<td class='item_td numericAllow' id='a_laminaxpaquete_${next_index}' contenteditable='true'></td>
					<td><input type="checkbox" id="a_apedido_${next_index}" /></td>
					<td contenteditable='true' class='stopSpaces' id='a_photo_${next_index}'></td>
					<td style="display:none" id="a_hash_${next_index}"></td>
					<td><button class='pref' type='button' title='Guardar' id='ga_${next_index}' onclick='guardarNuevo(this.id,"melamina_add")'><i class="fa fa-save"></i></button>
						<button class='pref' type='button' title='Borrar' id='ba_${next_index}' onclick='borrarNuevo(this.id,"melamina_add")'><i class="fa fa-trash"></i></button>
					</td>
				</tr>`;
	}

	this.assignar = function(row_id) {
		this.att.color = getSelectedOption("color_melamina_" + row_id);
		this.att.provedor = getSelectedOption("provedor_melamina_" + row_id);
		this.att.medidas = getSelectedOption("medidas_melamina_" + row_id);
		this.att.marca = getSelectedOption("marca_melamina_" + row_id);
		this.att.precio_compra = document.getElementById("a_precio_compra_" + row_id).innerText;
		this.att.precio_venta = document.getElementById("a_precio_venta_" + row_id).innerText;
		this.att.precio_venta_interno = document.getElementById("a_precio_venta_interno_" + row_id).innerText;
		this.att.laminaxpaquete = document.getElementById("a_laminaxpaquete_" + row_id).innerText;
		this.att.hash_inventario = document.getElementById("a_hash_" + row_id).innerText;
		this.att.apedido = $("#a_apedido_" + row_id).is(":checked");
		this.att.link_photo = document.getElementById("a_photo_" + row_id).innerText.trim();
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
	            document.getElementById("message").innerHTML = response.message + " en BD! <br>";
				document.getElementById("a_hash_" + id).innerText = response.new_hash;
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
	            document.getElementById("message").innerHTML = response.message + ". Melamina guardada!<br>";
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
		if (!confirm("Realmente desea borrar la melamina!\n Presione Ok para Borrar o de lo contrario presione Cancel.")) {
			return;
		}
	    fetch('/delete_melamina/' + id + '/', {
	        method: 'DELETE',
	        headers: { 'Content-Type': 'application/json' },
	    })
		.then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Melamina eliminada! <br>";
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
		precio_compra_caja:0,
		precio_venta_caja:0,
		precio_venta_metros:0,
		precio_venta_metros_canteo:0,
		apedido:false,
		link_photo:"",
	};

	this.getRowBuild = function(next_index, listas) {
		var colorOptions;
		for (var i=0; i < listas.color.length; i++) {
			if (listas.color[i].tapacantos)  {
				colorOptions += `<option value="${listas.color[i]._id.toString()}">${listas.color[i].nombre}</option>`;
			}
		}
		var medidasOptions;
		for (var i=0; i < listas.medidas.length; i++) {
			if (listas.medidas[i].tapacantos)  {
				medidasOptions += `<option value="${listas.medidas[i]._id.toString()}">${listas.medidas[i].nombre}</option>`;
			}
		}
		var provedorOptions;
		for (var i=0; i < listas.provedor.length; i++) {
			if (listas.provedor[i].items.includes("Tapacantos"))  {
				provedorOptions += `<option value="${listas.provedor[i]._id.toString()}">${listas.provedor[i].nombre}</option>`;
			}
		}
		var marcaOptions;
		for (var i=0; i < listas.marca.length; i++) {
			if (listas.marca[i].tapacantos)  {
				marcaOptions += `<option value="${listas.marca[i]._id.toString()}">${listas.marca[i].nombre}</option>`;
			}
		}

		return `<tr style='background-color:#94c6e7' id='row_${next_index}'>
					<td class='item_td' id='t_color_${next_index}'>
						<select id="color_tapacantos_${next_index}">
							<option value="" style="background:yellow" selected>(seleccione un color)</option>
							${colorOptions}
						</select>
					</td>
					<td class='item_td' id='t_provedor_${next_index}'>
					    <select id="provedor_tapacantos_${next_index}">
							<option value="" style="background:yellow" selected>(seleccione un provedor)</option>
							${provedorOptions}
						</select>
					</td>
					<td class='item_td' id='t_medidas_${next_index}'>
					    <select id="medidas_tapacantos_${next_index}">
							<option value="" style="background:yellow" selected>(seleccione una medida)</option>
							${medidasOptions}
						</select>
					</td>
					<td class='item_td' id='t_marca_${next_index}'>
					    <select id="marca_tapacantos_${next_index}">
							<option value="" style="background:yellow" selected>(seleccione una marca)</option>
							${marcaOptions}
						</select>
					</td>
					<td class='item_td numericAllow' id='t_precio_compra_${next_index}' contenteditable='true'></td>
					<td class='item_td numericAllow' id='t_precio_venta_${next_index}' contenteditable='true'></td>
					<td class='item_td numericAllow' id='t_metrosxrollo_${next_index}' contenteditable='true'></td>
					<td class='item_td numericAllow' id='t_rollosxcaja_${next_index}' contenteditable='true'></td>
					<td class='item_td numericAllow' id='t_precio_compra_caja_${next_index}' contenteditable='true'></td>
					<td class='item_td numericAllow' id='t_precio_venta_caja_${next_index}' contenteditable='true'></td>
					<td class='item_td numericAllow' id='t_precio_venta_metros_${next_index}' contenteditable='true'></td>
					<td class='item_td numericAllow' id='t_precio_venta_metros_canteo_${next_index}' contenteditable='true'></td>
					<td><input type="checkbox" id="t_apedido_${next_index}" /></td>
					<td contenteditable='true' class='stopSpaces' id='t_photo_${next_index}'></td>
					<td style="display:none" id="t_hash_${next_index}"></td>
					<td><button class='pref' type='button' title='Guardar' id='gt_${next_index}' onclick='guardarNuevo(this.id,"tapacantos_add")'><i class="fa fa-save"></i></button>
						<button class='pref' type='button' title='Borrar' id='bt_${next_index}' onclick='borrarNuevo(this.id,"tapacantos_add")'><i class="fa fa-trash"></i></button>
					</td>
				</tr>`;
	}

	this.assignar = function(row_id) {
		this.att.color = getSelectedOption("color_tapacantos_" + row_id);
		this.att.provedor = getSelectedOption("provedor_tapacantos_" + row_id);
		this.att.medidas = getSelectedOption("medidas_tapacantos_" + row_id);
		this.att.marca = getSelectedOption("marca_tapacantos_" + row_id);
		this.att.precio_compra = document.getElementById("t_precio_compra_" + row_id).innerText;
		this.att.precio_venta = document.getElementById("t_precio_venta_" + row_id).innerText;
		this.att.metrosxrollo = document.getElementById("t_metrosxrollo_" + row_id).innerText;
		this.att.rollosxcaja = document.getElementById("t_rollosxcaja_" + row_id).innerText;
		this.att.precio_compra_caja = document.getElementById("t_precio_compra_caja_" + row_id).innerText;
		this.att.precio_venta_caja = document.getElementById("t_precio_venta_caja_" + row_id).innerText;
		this.att.precio_venta_metros = document.getElementById("t_precio_venta_metros_" + row_id).innerText;
		this.att.precio_venta_metros_canteo = document.getElementById("t_precio_venta_metros_canteo_" + row_id).innerText;
		this.att.hash_inventario = document.getElementById("t_hash_" + row_id).innerText;
		this.att.apedido = $("#t_apedido_" + row_id).is(":checked");
		this.att.link_photo = document.getElementById("t_photo_" + row_id).innerText.trim();
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
	            document.getElementById("message").innerHTML = response.message + ". en BD! <br>";
				document.getElementById("t_hash_" + id).innerText = response.new_hash;
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
		if (!confirm("Realmente desea borrar el tapacantos!\n Presione Ok para Borrar o de lo contrario presione Cancel.")) {
			return;
		}
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
		link_photo:"",
	};

	this.getRowBuild = function(next_index, listas) {
		var provedorOptions;
		for (var i=0; i < listas.provedor.length; i++) {
			if (listas.provedor[i].items.includes("Pegamento")) {
				provedorOptions += `<option value="${listas.provedor[i]._id.toString()}">${listas.provedor[i].nombre}</option>`;
			}
		}
		var marcaOptions;
		for (var i=0; i < listas.marca.length; i++) {
			if (listas.marca[i].pegamento) {
				marcaOptions += `<option value="${listas.marca[i]._id.toString()}">${listas.marca[i].nombre}</option>`;
			}
		}

		return `<tr style='background-color:#94c6e7' id='row_${next_index}'>
					<td id='p_provedor_${next_index}'>
					    <select id="provedor_pegamento_${next_index}">
							<option value="" style="background:yellow" selected>(seleccione un provedor)</option>
							${provedorOptions}
						</select>
					</td>
					<td id='p_marca_${next_index}'>
					    <select id="marca_pegamento_${next_index}">
							<option value="" style="background:yellow" selected>(seleccione una marca)</option>
							${marcaOptions}
						</select>
					</td>
					<td class='numericAllow' id='p_precio_compra_${next_index}' contenteditable='true'></td>
					<td class='numericAllow' id='p_precio_venta_${next_index}' contenteditable='true'></td>
					<td contenteditable='true' class='stopSpaces' id='p_photo_${next_index}'></td>
					<td style="display:none" id="p_hash_${next_index}"></td>
					<td><button class='pref' type='button' title='Guardar' id='gp_${next_index}' onclick='guardarNuevo(this.id,"pegamento_add")'><i class="fa fa-save"></i></button>
						<button class='pref' type='button' title='Borrar' id='bp_${next_index}' onclick='borrarNuevo(this.id,"pegamento_add")'><i class="fa fa-trash"></i></button>
					</td>
				</tr>`;
	}

	this.assignar = function(row_id) {
		this.att.provedor = getSelectedOption("provedor_pegamento_" + row_id);
		this.att.marca = getSelectedOption("marca_pegamento_" + row_id);
		this.att.precio_compra = document.getElementById("p_precio_compra_" + row_id).innerText;
		this.att.precio_venta = document.getElementById("p_precio_venta_" + row_id).innerText;
		this.att.hash_inventario = document.getElementById("p_hash_" + row_id).innerText;
		this.att.link_photo = document.getElementById("p_photo_" + row_id).innerText.trim();
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
	            document.getElementById("message").innerHTML = response.message + ". en BD! <br>";
				document.getElementById("p_hash_" + id).innerText = response.new_hash;
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
		if (!confirm("Realmente desea borrar el pegamento!\n Presione Ok para Borrar o de lo contrario presione Cancel.")) {
			return;
		}
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
		apedido:false,
		link_photo:"",
	};

	this.getRowBuild = function(next_index, listas) {
		var colorOptions;
		for (var i=0; i < listas.color.length; i++) {
			if (listas.color[i].fondo) {
				colorOptions += `<option value="${listas.color[i]._id.toString()}">${listas.color[i].nombre}</option>`;
			}
		}
		var medidasOptions;
		for (var i=0; i < listas.medidas.length; i++) {
			if (listas.medidas[i].fondo) {
				medidasOptions += `<option value="${listas.medidas[i]._id.toString()}">${listas.medidas[i].nombre}</option>`;
			}
		}
		var provedorOptions;
		for (var i=0; i < listas.provedor.length; i++) {
			if (listas.provedor[i].items.includes("Fondo")) {
				provedorOptions += `<option value="${listas.provedor[i]._id.toString()}">${listas.provedor[i].nombre}</option>`;
			}
		}
		var marcaOptions;
		for (var i=0; i < listas.marca.length; i++) {
			if (listas.marca[i].fondo) {
				marcaOptions += `<option value="${listas.marca[i]._id.toString()}">${listas.marca[i].nombre}</option>`;
			}
		}

		return `<tr style='background-color:#94c6e7' id='row_${next_index}'>
					<td class='item_td' id='f_color_${next_index}'>
						<select id="color_fondo_${next_index}">
							<option value="" style="background:yellow" selected>(seleccione un color)</option>
							${colorOptions}
						</select>
					</td>
					<td class='item_td' id='f_provedor_${next_index}'>
					    <select id="provedor_fondo_${next_index}">
							<option value="" style="background:yellow" selected>(seleccione un provedor)</option>
							${provedorOptions}
						</select>
					</td>
					<td class='item_td' id='f_medidas_${next_index}'>
					    <select id="medidas_fondo_${next_index}">
							<option value="" style="background:yellow" selected>(seleccione una medida)</option>
							${medidasOptions}
						</select>
					</td>
					<td class='item_td' id='f_marca_${next_index}'>
					    <select id="marca_fondo_${next_index}">
							<option value="" style="background:yellow" selected>(seleccione una marca)</option>
							${marcaOptions}
						</select>
					</td>
					<td class='item_td numericAllow' id='f_precio_compra_${next_index}' contenteditable='true'></td>
					<td class='item_td numericAllow' id='f_precio_venta_${next_index}' contenteditable='true'></td>
					<td class='item_td numericAllow' id='f_laminaxpaquete_${next_index}' contenteditable='true'></td>
					<td><input type="checkbox" id="f_apedido_${next_index}" /></td>
					<td contenteditable='true' class='stopSpaces' id='f_photo_${next_index}'></td>
					<td style="display:none" id="f_hash_${next_index}"></td>
					<td><button class='pref' type='button' title='Guardar' id='gf_${next_index}' onclick='guardarNuevo(this.id,"fondo_add")'><i class="fa fa-save"></i></button>
						<button class='pref' type='button' title='Borrar' id='bf_${next_index}' onclick='borrarNuevo(this.id,"fondo_add")'><i class="fa fa-trash"></i></button>
					</td>
				</tr>`;
	}

	this.assignar = function(row_id) {
		this.att.color = getSelectedOption("color_fondo_" + row_id);
		this.att.provedor = getSelectedOption("provedor_fondo_" + row_id);
		this.att.medidas = getSelectedOption("medidas_fondo_" + row_id);
		this.att.marca = getSelectedOption("marca_fondo_" + row_id);
		this.att.precio_compra = document.getElementById("f_precio_compra_" + row_id).innerText;
		this.att.precio_venta = document.getElementById("f_precio_venta_" + row_id).innerText;
		this.att.laminaxpaquete = document.getElementById("f_laminaxpaquete_" + row_id).innerText;
		this.att.hash_inventario = document.getElementById("f_hash_" + row_id).innerText;
		this.att.apedido = $("#f_apedido_" + row_id).is(":checked");
		this.att.link_photo = document.getElementById("f_photo_" + row_id).innerText.trim();
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
	            document.getElementById("message").innerHTML = response.message + ". en BD! <br>";
				document.getElementById("f_hash_" + id).innerText = response.new_hash;
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
		if (!confirm("Realmente desea borrar el Fondo!\n Presione Ok para Borrar o de lo contrario presione Cancel.")) {
			return;
		}
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

function Tapatornillos() {
	this.att = {
	    color:"",
		provedor:"",
		marca:"",
		precio_compra:0,
		precio_venta:0,
		precio_compra_caja:0,
		precio_venta_caja:0,
		hojaxcaja:0,
		apedido:false,
		link_photo:"",
	};

	this.getRowBuild = function(next_index, listas) {
		var colorOptions;
		for (var i=0; i < listas.color.length; i++) {
			if (listas.color[i].tapatornillos) {
				colorOptions += `<option value="${listas.color[i]._id.toString()}">${listas.color[i].nombre}</option>`;
			}
		}
		var provedorOptions;
		for (var i=0; i < listas.provedor.length; i++) {
			if (listas.provedor[i].items.includes("Tapatornillos")) {
				provedorOptions += `<option value="${listas.provedor[i]._id.toString()}">${listas.provedor[i].nombre}</option>`;
			}
		}
		var marcaOptions;
		for (var i=0; i < listas.marca.length; i++) {
			if (listas.marca[i].tapatornillos) {
				marcaOptions += `<option value="${listas.marca[i]._id.toString()}">${listas.marca[i].nombre}</option>`;
			}
		}

		return `<tr style='background-color:#94c6e7' id='row_${next_index}'>
					<td class='item_td' id='t_tapatornillos_${next_index}'>
						<select id="color_tapatornillos_${next_index}">
							<option value="" style="background:yellow" selected>(seleccione un color)</option>
							${colorOptions}
						</select>
					</td>
					<td class='item_td' id='t_provedor_${next_index}'>
					    <select id="provedor_tapatornillos_${next_index}">
							<option value="" style="background:yellow" selected>(seleccione un provedor)</option>
							${provedorOptions}
						</select>
					</td>
					<td class='item_td' id='t_marca_${next_index}'>
					    <select id="marca_tapatornillos_${next_index}">
							<option value="" style="background:yellow" selected>(seleccione una marca)</option>
							${marcaOptions}
						</select>
					</td>
					<td class='item_td numericAllow' id='t_precio_compra_${next_index}' contenteditable='true'></td>
					<td class='item_td numericAllow' id='t_precio_venta_${next_index}' contenteditable='true'></td>
					<td class='item_td numericAllow' id='t_precio_compra_caja_${next_index}' contenteditable='true'></td>
					<td class='item_td numericAllow' id='t_precio_venta_caja_${next_index}' contenteditable='true'></td>
					<td class='item_td numericAllow' id='t_hojaxcaja_${next_index}' contenteditable='true'></td>
					<td><input type="checkbox" id="t_apedido_${next_index}" /></td>
					<td contenteditable='true' class='stopSpaces' id='t_photo_${next_index}'></td>
					<td style="display:none" id="t_hash_${next_index}"></td>
					<td><button class='pref' type='button' title='Guardar' id='gf_${next_index}' onclick='guardarNuevo(this.id,"tapatornillos_add")'><i class="fa fa-save"></i></button>
						<button class='pref' type='button' title='Borrar' id='bf_${next_index}' onclick='borrarNuevo(this.id,"tapatornillos_add")'><i class="fa fa-trash"></i></button>
					</td>
				</tr>`;
	}

	this.assignar = function(row_id) {
		this.att.color = getSelectedOption("color_tapatornillos_" + row_id);
		this.att.provedor = getSelectedOption("provedor_tapatornillos_" + row_id);
		this.att.marca = getSelectedOption("marca_tapatornillos_" + row_id);
		this.att.precio_compra = document.getElementById("t_precio_compra_" + row_id).innerText;
		this.att.precio_venta = document.getElementById("t_precio_venta_" + row_id).innerText;
		this.att.precio_compra_caja = document.getElementById("t_precio_compra_caja_" + row_id).innerText;
		this.att.precio_venta_caja = document.getElementById("t_precio_venta_caja_" + row_id).innerText;
		this.att.hojaxcaja = document.getElementById("t_hojaxcaja_" + row_id).innerText;
		this.att.hash_inventario = document.getElementById("t_hash_" + row_id).innerText;
		this.att.apedido = $("#t_apedido_" + row_id).is(":checked");
		this.att.link_photo = document.getElementById("t_photo_" + row_id).innerText.trim();
	}

/*UPDATE*/
	this.guardarEditado = function(id) {
		fetch('/actualizar_tapatornillos/' + id + '/', {
	        method: 'PUT',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.att)
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". en BD! <br>";
				document.getElementById("t_hash_" + id).innerText = response.new_hash;
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
		fetch('/nuevo_tapatornillos/', {
	        method: 'POST',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.att)
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Tapatornillos guardado!<br>";
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
		if (!confirm("Realmente desea borrar el tapatornillos!\n Presione Ok para Borrar o de lo contrario presione Cancel.")) {
			return;
		}
	    fetch('/delete_tapatornillos/' + id + '/', {
	        method: 'DELETE',
	        headers: { 'Content-Type': 'application/json' },
	    })
		.then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Tapatornillos eliminado! <br>";
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

function ControlProducto() {
	this.att = {
	    melamina:      null,
		tapacantos:    null,
		pegamento:     null,
		fondo:         null,
		tapatornillos: null
	};

	this.asignar = function() {
		this.att.melamina      = getSelectedOption("melamina_min");
		this.att.tapacantos    = getSelectedOption("tapacantos_min");
		this.att.pegamento     = getSelectedOption("pegamento_min");
		this.att.fondo         = getSelectedOption("fondo_min");
		this.att.tapatornillos = getSelectedOption("tapatornillos_min");
	}

/*UPDATE*/
	this.actualizar = function() {
		fetch('/actualizar_control_producto/', {
	        method: 'PUT',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.att)
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". Min para Producto guardado! <br>";
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

function Preferencias() {
	this.att = {
	    telefono: 0,
	};

	this.asignar = function() {
		this.att.telefono = getInput("telefono");
	}

/*UPDATE*/
	this.actualizar = function() {
		fetch('/actualizar_preferencias/', {
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

function Usuario() {
	this.att = {
	    name:"",
		password:"",
		completo:"",
		compras:false,
		ventas:false,
		administrador:false,
	};

	this.getRowBuild = function(next_index, listas) {
		return `<tr style='background-color:#94c6e7' id='row_${next_index}'>
					<td class='item_td stopSpaces' id='u_nombre_${next_index}' contenteditable='true'></td>
					<td class='item_td stopSpaces' id='u_password_${next_index}' contenteditable='true'></td>
					<td class='item_td stopSpaces' id='u_completo_${next_index}' contenteditable='true'></td>
					<td><input type="checkbox" id="u_compras_${next_index}" /></td>
					<td><input type="checkbox" id="u_ventas_${next_index}" /></td>
					<td><input type="checkbox" id="u_administrador_${next_index}" /></td>
					<td><button class='pref' type='button' title='Guardar' id='gu_${next_index}' onclick='guardarNuevo(this.id,"usuario_add")'><i class="fa fa-save"></i></button>
						<button class='pref' type='button' title='Borrar' id='bu_${next_index}' onclick='borrarNuevo(this.id,"usuario_add")'><i class="fa fa-trash"></i></button>
					</td>
				</tr>`;
	}

	this.assignar = function(row_id) {
		this.att.name = document.getElementById("u_nombre_" + row_id).innerText.trim();
		this.att.password = document.getElementById("u_password_" + row_id).innerText.trim();
		this.att.completo = document.getElementById("u_completo_" + row_id).innerText.trim();
		this.att.compras = $("#u_compras_" + row_id).is(":checked");
		this.att.ventas = $("#u_ventas_" + row_id).is(":checked");
		this.att.administrador = $("#u_administrador_" + row_id).is(":checked");
	}

/*UPDATE*/
	this.guardarEditado = function(id) {
		fetch('/actualizar_usuario/' + id + '/', {
	        method: 'PUT',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.att)
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". en BD! <br>";
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
		fetch('/nuevo_usuario/', {
	        method: 'POST',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.att)
	    })
	    .then(response => response.json())
	    .then(response => {
	        if (response.ok) {
	            console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
	            document.getElementById("message").innerHTML = response.message + ". usuario guardado!<br>";
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
		if (!confirm("Realmente desea borrar al usuario!\n Presione Ok para Borrar o de lo contrario presione Cancel.")) {
			return;
		}
		fetch('/delete_usuario/' + id + '/', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
		})
		.then(response => response.json())
		.then(response => {
			if (response.ok) {
				console.log(response.message);
				document.getElementById("message").style.background = "#a4f1a4";
				document.getElementById("message").innerHTML = response.message + ". usuario eliminado! <br>";
				document.getElementById("row_" + id).outerHTML = "";
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
