
/* Melamina class*/
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

	this.setAtttribute = function(
		color,
		provedor,
		medidas,
		marca,
		precio_compra,
		precio_venta,
		precio_venta_interno,
		laminaxpaquete,
		apedido,
		link_photo) {
		this.att.color = color;
		this.att.provedor = provedor;
		this.att.medidas = medidas;
		this.att.marca = marca;
		this.att.precio_compra = precio_compra;
		this.att.precio_venta = precio_venta;
		this.att.precio_venta_interno = precio_venta_interno;
		this.att.laminaxpaquete = laminaxpaquete;
		this.att.apedido = apedido;
		this.att.link_photo = link_photo;
	}

/*UPDATE*/
	this.guardarEditado = function(id) {
		return fetch('/preferences/actualizar_melamina/' + id + '/', {
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
		return fetch('/preferences/nueva_melamina/', {
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
	    fetch('/preferences/delete_melamina/' + id + '/', {
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
