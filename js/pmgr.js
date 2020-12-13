"use strict"

import * as Pmgr from './pmgrapi.js'
/**
 * Librería de cliente para interaccionar con el servidor de PrinterManager (prmgr).
 * Prácticas de IU 2020-21
 *
 * Para las prácticas de IU, pon aquí (o en otros js externos incluidos desde tus .htmls) el código
 * necesario para añadir comportamientos a tus páginas. Recomiendo separar el fichero en 2 partes:
 * - funciones que pueden generar cachos de contenido a partir del modelo, pero que no
 *   tienen referencias directas a la página
 * - un bloque rodeado de $(() => { y } donde está el código de pegamento que asocia comportamientos
 *   de la parte anterior con elementos de la página.
 *
 * Fuera de las prácticas, lee la licencia: dice lo que puedes hacer con él, que es esencialmente
 * lo que quieras siempre y cuando no digas que lo escribiste tú o me persigas por haberlo escrito mal.
 */

//
// PARTE 1:
// Código de comportamiento, que sólo se llama desde consola (para probarlo) o desde la parte 2,
// en respuesta a algún evento.
//

function createPrinterItem(printer) {
    const rid = 'x_' + Math.floor(Math.random() * 1000000);
    const hid = 'h_' + rid;
    const cid = 'c_' + rid;

    // usar [] en las claves las evalua (ver https://stackoverflow.com/a/19837961/15472)
    const PS = Pmgr.PrinterStates;
    let pillClass = {
        [PS.PAUSED]: "badge-secondary",
        [PS.PRINTING]: "badge-success",
        [PS.NO_INK]: "badge-danger",
        [PS.NO_PAPER]: "badge-danger"
    };

    let allJobs = printer.queue.map((id) =>
        `<span class="badge badge-secondary">${id}</span>`
    ).join(" ");

    return `
    <div class="card">
    <div class="card-header" id="${hid}">
        <h2 class="mb-0">
            <button class="btn btn-link" type="button"
                data-toggle="collapse" data-target="#${cid}",
                aria-expanded="false" aria-controls="#${rid}">
            <b class="pcard">${printer.alias}</b>
            <span class="badge badge-pill ${pillClass[printer.status]}">${printer.status}</span>
            <div class="small">
                ${printer.model} at ${printer.location}
            </div>
            </button>
        </h2>
    </div>

    <div id="${cid}" class="collapse hide" aria-labelledby="${hid}
        data-parent="#accordionExample">
        <div class="card-body pcard">
            ${allJobs}
    </div>
    </div>
    </div>
 `;
}

//AÑADIRIMPRESORA

function createImpresora(i) {

    var ok_icon = `<img class="check-icon" src="img/check-Symbol.png">`;
    var ko_icon = `<img class="check-icon" src="img/cross.png">`;

    var ink_status = ok_icon;
    var paper_status = ok_icon;

    if (i.status == 'no_ink') {
        ink_status = ko_icon;
    }

    if (i.status == 'no_paper') {
        paper_status = ko_icon;
    }


    return ` 

  <tr id="fila${i.id}">
  <th scope="row">${i.alias}</th>
  <td>${i.status}</td>
  <td>${i.model}</td>
  <td>${i.location}</td>
  <td>${i.ip}</td>
  <td>${paper_status}</td>
  <td>${ink_status}</td>
  <td><button type="button" data-toggle="modal" data-target="#verTrabajos${i.id}" class="botonVerTrabajos" id="trabajosImp${i.id}">
      <u>${i.queue.length}</u>
    </button></td>
  <td>

    <button data-toggle="modal" aria-controls="edit${i.id}" data-target="#edit${i.id}" class="btn btn-outline-primary editar" id="editButton${i.id}">
      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-brush-fill" fill="currentColor"
        xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd"
          d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.117 8.117 0 0 1-3.078.132 3.658 3.658 0 0 1-.563-.135 1.382 1.382 0 0 1-.465-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.393-.197.625-.453.867-.826.094-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.2-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.175-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04z">
        </path>
      </svg>
    </button>

    <button data-toggle="modal" data-target="#delete${i.id}" class="btn btn-danger borrarImp" id="deleteButton${i.id}">
      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x" fill="currentColor"
        xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd"
          d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z">
        </path>D
      </svg>
    </button>
  </td>
  </tr>

  `;
}
//editar impresora
function createDialogoVerImpresora(i) {
    return `<div class="modal fade modalEditar" id="edit${i.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="false">
<div class="modal-dialog modal-dialog-centered" role="document" id ="modalEditPrinter">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Editar impresora ${i.alias}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
  <span aria-hidden="true">&times;</span>
</button>
        </div>
        <div class="modal-body">

            <form>
            
        <div class="form-group">
                <div class="form-group">
                    <label for="changeModel">Modelo</label>
                    <input type="text" class="form-control" id="changeModel" value=${i.model}>
                </div>
                
                <div class="form-group">
                    <label for="changeLocation">Localización</label>
                    <input type="text" class="form-control" id="changeLocation" value=${i.location}>
                </div>
                
                <div class="form-group">
                    <label for="changeIp">IP</label>
                    <input type="text" class="form-control" id="changeIp" value=${i.ip}>
                </div>
                
                </div>
                <div class="form-check">
                <input class="form-check-input" type="radio" name="flexRadioDefault"
                    id="estadoCargado" checked>
                <label class="form-check-label" for="estadoCargado">
                    Impresora cargada
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="flexRadioDefault"
                    id="estadoSinPapel" >
                <label class="form-check-label" for="estadoSinPapel">
                    Impresora sin papel
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="flexRadioDefault"
                    id="estadoSinTinta">
                <label class="form-check-label" for="estadoSinTinta">
                    Impresora sin tinta
                </label>
            </div>
            </form>

        </div>
        <div class="modal-footer" id ="modalEditPrinter" >
            <button class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary confirmarEdicionImpresora"  data-dismiss="modal">Guardar</button>
        </div>
    </div>
</div>
</div>`;
}

function createDialogoBorrarImpresora(i) {
    return `<div class="modal fade" id="delete${i.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="false">
  <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Eliminar impresora ${i.alias}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
          </div>
          <div class="modal-body">
              <p>¿Está seguro de que desea eliminar la impresora ${i.alias}?<br> Los cambios serán permanentes</p>
          </div>
          <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-danger eliminar"  id="eliminar${i.id}" data-dismiss="modal">Aceptar</button>
          </div>
      </div>
  </div>
</div>`;
}

function createGrupo(i) {
    return `
    <tr id="filaG${i.id}">
        <td scope="row">${i.name}</td>
        <td>
            <button data-toggle="modal" data-target="#showPrinterGroup"
                class="btn btn-outline-primary mostrarG" id="mostrarGrupo${i.id}">

                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-eye" fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                        d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.134 13.134 0 0 0 1.66 2.043C4.12 11.332 5.88 12.5 8 12.5c2.12 0 3.879-1.168 5.168-2.457A13.134 13.134 0 0 0 14.828 8a13.133 13.133 0 0 0-1.66-2.043C11.879 4.668 10.119 3.5 8 3.5c-2.12 0-3.879 1.168-5.168 2.457A13.133 13.133 0 0 0 1.172 8z" />
                    <path fill-rule="evenodd"
                        d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                </svg>
            </button>
            <button data-toggle="modal" data-target="#editPrinterGroup"
                class="btn btn-outline-primary editarG" id="editGrupo${i.id}">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-brush-fill"
                    fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                        d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.117 8.117 0 0 1-3.078.132 3.658 3.658 0 0 1-.563-.135 1.382 1.382 0 0 1-.465-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.393-.197.625-.453.867-.826.094-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.2-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.175-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04z">
                    </path>
                </svg>
            </button>

            <button data-toggle="modal" data-target="#deletePrinterGroup"
                class="btn btn-danger eliminarG" id="eliminarGrupo${i.id}">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x" fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z">
                    </path>
                </svg>
            </button>
        </td>
    </tr>`;
}

function createDialogoEditarGrupo(i) {
    return ` <div class="modal fade" id="editPrinterGroup" tabindex="-1" role="dialog"
  aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modalEditarNombreGrupo" role="document" id="editGroup${i.id}">
      <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Editar grupo de impresoras ${i.name}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
          </div>
          <div class="modal-body">

              <form>
                  <div class="form-group">
                      <label for="changeGroupName">Nombre</label>
                      <input type="text" class="form-control" id="changeGroupName" value=${i.name}>
                  </div>
              </form>
          </div>
          <div class="modal-footer">
              <button class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
              <button class="btn btn-primary confirmarEdicionNombreGrupo" data-dismiss="modal">Guardar</button>
          </div>
      </div>
  </div>
</div>`;
}

function createDialogoBorrarGrupoImpresora(i) {
    return ` <div class="modal fade" id="deletePrinterGroup" tabindex="-1" role="dialog"
  aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Eliminar el grupo de impresora ${i.name}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
          </div>
          <div class="modal-body">
              <p>¿Está seguro de que desea eliminar el grupo impresora ${i.name}?<br> Se eliminará el grupo pero no
                  sus impresoras</p>
          </div>
          <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-danger eliminarG" data-dismiss="modal" id="eliminarG${i.id}">Aceptar</button>
          </div>
      </div>
  </div>
</div>`;
}

function createDialogoMostrarGrupo(i) {

    var tablaImpresoras = "";

    i.printers.forEach(e => {
        var impresora = buscarImpresora(e);
        console.log(impresora);
        tablaImpresoras = tablaImpresoras.concat(`<tr>
        <th scope="row">${impresora.alias}</th>
        <td>${impresora.status}</td>
        <td>${impresora.model}</td>
    </tr>`);
    });
    return `
    <div class="modal fade" id="showPrinterGroup" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Impresoras pertenecientes al grupo ${i.name}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <table class="table">
                            <thead class="table-primary">
                                <tr>
                                    <th scope="col" class="campo">Alias </th>
                                    <th scope="col" class="campo">Estado </th>
                                    <th scope="col" class="campo">Modelo </th>

                                </tr>
                            </thead>
                            <tbody>
                                ` + tablaImpresoras + `

                            </tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>`;
}

function verTrabajos(i) {
    var tablaTrabajos = "";

    i.queue.forEach(e => {
        var trabajo = buscarTrabajo(e)

        tablaTrabajos = tablaTrabajos.concat(`
        <tr id="filaTrabajo${trabajo.id}">
            <td scope="row">${trabajo.id}</td>
                <td>${trabajo.fileName}</td>
                <td>${trabajo.owner}</td>
                <td>
                
                    <button data-toggle="modal" data-target="#deletePrinterWork${trabajo.id}" class="btn btn-outline-primary botonBorrarTrabajo" id="botonBorrarTrabajo${trabajo.id}">
                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z">
                            </path>
                        </svg>
                    </button>
                </td>
        </tr>`);
    });
    return `<div class="modal fade" id="verTrabajos${i.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="false">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Trabajos de ${i.alias}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <table id="printerWorkTable" class="table">
                    <thead class="table-primary">
                        <tr>
                            <th scope="col" class="campo">Id </th>
                            <th scope="col" class="campo">Fichero</th>
                            <th scope="col" class="campo">Autor</th>
                            <th scope="col" class="campo">Borrar</th>
                        </tr>
                    </thead>
                    <tbody>` + tablaTrabajos + `
                        
                    </tbody>
                </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
            </div>
        </div>
    </div>
</div>`;
}


function createDialogoBorrarTrabajos(i) {
    return `<div class="modal fade emergente" id="deletePrinterWork${i.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="false">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Eliminar trabajo de impresión ${i.fileName}</h5>
                <button class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p>¿Está seguro de que desea eliminar este trabajo de impresión ${i.fileName}?<br>
                </p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button class="btn btn-danger deleteJob" id="deleteJob${i.id}">Eliminar</button>
            </div>
        </div>
    </div>
</div>`;
}


// funcion para generar datos de ejemplo: impresoras, grupos, trabajos, ...
// se puede no-usar, o modificar libremente
async function populate(minPrinters, maxPrinters, minGroups, maxGroups, jobCount) {
    const U = Pmgr.Util;

    // genera datos de ejemplo
    minPrinters = minPrinters || 10;
    maxPrinters = maxPrinters || 20;
    minGroups = minGroups || 1;
    maxGroups = maxGroups || 3;
    jobCount = jobCount || 100;
    let lastId = 0;

    let printers = U.fill(U.randomInRange(minPrinters, maxPrinters),
        () => U.randomPrinter(lastId++));

    let groups = U.fill(U.randomInRange(minPrinters, maxPrinters),
        () => U.randomGroup(lastId++, printers, 50));

    let jobs = [];
    for (let i = 0; i < jobCount; i++) {
        let p = U.randomChoice(printers);
        let j = new Pmgr.Job(lastId++,
            p.id, [
                U.randomChoice([
                    "Alice", "Bob", "Carol", "Daryl", "Eduardo", "Facundo", "Gloria", "Humberto"
                ]),
                U.randomChoice([
                    "Fernández", "García", "Pérez", "Giménez", "Hervás", "Haya", "McEnroe"
                ]),
                U.randomChoice([
                    "López", "Gutiérrez", "Pérez", "del Oso", "Anzúa", "Báñez", "Harris"
                ]),
            ].join(" "),
            U.randomString() + ".pdf");
        p.queue.push(j.id);
        jobs.push(j);
    }

    if (Pmgr.globalState.token) {
        console.log("Updating server with all-new data");

        // FIXME: remove old data
        // FIXME: prepare update-tasks
        let tasks = [];
        for (let t of tasks) {
            try {
                console.log("Starting a task ...");
                await t().then(console.log("task finished!"));
            } catch (e) {
                console.log("ABORTED DUE TO ", e);
            }
        }
    } else {
        console.log("Local update - not connected to server");
        Pmgr.updateState({
            jobs: jobs,
            printers: printers,
            groups: groups
        });
    }
}

function buscadorImpresoras() {
    // Declare variables
    let input, filter, table, tr, td, i, txtValue;

    input = document.getElementById("input");
    filter = input.value.toUpperCase();
    table = document.getElementById("impresoras");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function buscadorGrupos() {
    // Declare variables
    let input, filter, table, tr, td, i, txtValue;

    input = document.getElementById("input");
    filter = input.value.toUpperCase();
    table = document.getElementById("tablaGrupos");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function buscarImpresora(id) {
    var sol = null;
    Pmgr.globalState.printers.forEach(e => {
        if (id == e.id) {
            sol = e;
        }
    });
    return sol;
}

function buscarImpresoraPorAlias(alias) {
    var sol = null;
    Pmgr.globalState.printers.forEach(e => {
        if (alias == e.alias) {
            sol = e;
        }
    });
    return sol;
}

function buscarGrupo(id) {
    var sol = null;
    Pmgr.globalState.groups.forEach(e => {
        if (id == e.id) {
            sol = e;
        }
    });
    return sol;
}

function buscarTrabajo(id) {
    var sol = null;
    Pmgr.globalState.jobs.forEach(e => {
        if (id == e.id) {
            sol = e;
        }
    });
    return sol;
}

function activaBusquedaDropdown(div, actualizaElementos) {
    let search = $(div).find('input[type=search]');
    let select = $(div).find('select');
    console.log(search, select);
    // vacia el select, lo llena con impresoras validas
    // FALTA: poner como marcadas las que ya estaban seleccionadas de antes
    select.empty();
    actualizaElementos(select);

    // filtrado dinámico
    $(search).on('input', () => {
        let w = $(search).val().trim().toLowerCase();
        if(w)
            select.show();
        
        let items = $(select).find("option");
        console.log(items);
        items.each((i, o) =>
            $(o).text().toLowerCase().indexOf(w) > -1 ? $(o).show() : $(o).hide());
    });
}

function posiblesGrupos() {
    var grupos = "";
    Pmgr.globalState.groups.forEach(e => {
        grupos = grupos.concat(`
        <option id="seleccionGrupo${e.id}" value="${e.id}">${e.name}</option>`);
    });
    return `<label for="exampleFormControlSelect1">Grupo</label>
    <select class="form-control" id="selectDeGrupos"> ` + grupos + `
    </select>`;
}

function posiblesImpresorasYGrupos() {
    var grupos = "";
    Pmgr.globalState.groups.forEach(e => {
        grupos = grupos.concat(`
        <option value="selectGroupForJob${e.id}">${e.name}</option>`);
    });

    var impresoras = "";
    Pmgr.globalState.printers.forEach(e => {
        impresoras = impresoras.concat(`
        <option value="${e.id}">${e.alias}</option>`);
    });

    return `<div class="form-check">
    <input class="form-check-input" type="radio" name="exampleRadios" id="checkGrupo" value="option1" checked>
    <label class="form-check-label" for="checkGrupo">
        Grupo de impresoras
    </label>
    <select class="form-control" id="seleccionGrupos">
        ` + grupos + `
    </select>
</div>

<div class="form-check" id="seleccionarImpresoraParaTrabajo">
    <input class="form-check-input" type="radio" name="exampleRadios" id="checkImpresora" value="option2">
    <label class="form-check-label" for="checkImpresora">
        Impresora
    </label>
    <select class="form-control" id="seleccionImpresoras">
        ` + impresoras + `

    </select>`;
}
//
// PARTE 2:
// Código de pegamento, ejecutado sólo una vez que la interfaz esté cargada.
// Generalmente de la forma $("selector").cosaQueSucede(...)
//
$(function() {

    // funcion de actualización de ejemplo. Llámala para refrescar interfaz
    function update(result) {
        try {
            // vaciamos un contenedor
            $("#impresoras").empty();
            $("#tablaGrupos").empty();
            // y lo volvemos a rellenar con su nuevo contenido
            Pmgr.globalState.printers.forEach(m => $("#impresoras").append(createImpresora(m)));
            Pmgr.globalState.groups.forEach(m => $("#tablaGrupos").append(createGrupo(m)));
            // y asi para cada cosa que pueda haber cambiado

        } catch (e) {
            console.log('Error actualizando', e);
        }
    }


    // Servidor a utilizar. También puedes lanzar tú el tuyo en local (instrucciones en Github)
    //const serverUrl = "http://localhost:8080/api/";
    const serverUrl = "http://gin.fdi.ucm.es/iu/api/";
    Pmgr.connect(serverUrl);

    // ejemplo de login
    Pmgr.login("g7", "Guacamole2").then(d => {
        if (d !== undefined) {
            /* const u = Gb.resolve("HDY0IQ");*/
            console.log("login ok!");

            update();

            $('.tablitaImpresora').hide();
            $('#dropdownBuscableImpresora').hover(function() {
                $('*').click(function(){$('.tablitaImpresora').show();})    
            }, function() {
                $('*').click(function(){$('.tablitaImpresora').hide();})
            });       

            $('.tablitaGrupo').hide();
            $('#dropdownBuscableGrupo').hover(function() {
                $('*').click(function(){$('.tablitaGrupo').show();})   
            }, function() {
                $('*').click(function(){$('.tablitaGrupo').hide();})
            });  

            $('.tablitaJob').hide();
            $('#dropdownBuscableJob').hover(function() {
                $('*').click(function(){$('.tablitaJob').show();})                  
            }, function() {
                $('*').click(function(){$('.tablitaJob').hide();})
            });  

            activaBusquedaDropdown($('#dropdownBuscableImpresora'),
                (select) => Pmgr.globalState.printers.forEach(m =>
                    select.append(`<option class="dropdownImpr" value="${m.id}">${m.alias} | ${m.status} | ${m.model} | ${m.location} | ${m.ip}</option>`),
                )
            );

            activaBusquedaDropdown($('#dropdownBuscableGrupo'),
                (select) => Pmgr.globalState.groups.forEach(m =>
                    select.append(`<option class="dropdownGrupo"  value="${m.id}">${m.name}</option>`),
                )
            );

            activaBusquedaDropdown($('#dropdownBuscableJob'),
                (select) => Pmgr.globalState.jobs.forEach(m =>
                    select.append(`<option class="dropdownJob"  value="${m.id}">${m.fileName} | ${m.owner}</option>`),
                )
            );
        } else {
            console.log("Error de login");
        }
    });

    /* 
        Funciones de control de las impresoras
                                                     */

    //Crea el dialogo para editar impresoras HECHO
    $("#impresoras").on("click", "button.editar", function() {
        let id = $(this).attr('id');
        let dataTarget = $(this).attr('data-target');
        console.log("Hola soy el boton: " + id + " y tengo que sacar el modal: " + dataTarget);
        var valorId = id.substring(10);
        console.log(valorId);
        $("#dialogosEditarImpresora").empty();
        $("#dialogosEditarImpresora").append(createDialogoVerImpresora(buscarImpresora(valorId)));
    });

    $("#multiple").on("click", "option.dropdownImpr", function() {
        let id = $(this).attr('id');
        let dataTarget = $(this).attr('data-target');
        console.log("Hola soy el boton: " + id + " y tengo que sacar el modal: " + dataTarget);
        var valorId = id.substring(10);
        console.log(valorId);
        $("#dialogosEditarImpresora").empty();
        $("#dialogosEditarImpresora").append(createDialogoVerImpresora(Pmgr.globalState.printers[valorId]));
    });

    $("#multiple").on("click", "option.dropdownGrupo", function() {
        let id = $(this).attr('id');
        let dataTarget = $(this).attr('data-target');
        console.log("Hola soy el boton: " + id + " y tengo que sacar el modal: " + dataTarget);
        var valorId = id.substring(9);
        //console.log(valorId);
        $("#dialogosEditarGrupoImpresora").empty();
        var grupo = buscarGrupo(valorId);
        console.log(grupo);
        $("#dialogosEditarGrupoImpresora").append(createDialogoEditarGrupo(grupo));
    });

    //Crea el dialogo para eliminar impresoras HECHO
    $("#impresoras").on("click", "button.borrarImp", function() {
        let id = $(this).attr('id');
        let dataTarget = $(this).attr('data-target');
        console.log("Hola soy el boton: " + id + " y tengo que sacar el modal: " + dataTarget);

        var valorId = id.substring(12);
        console.log(valorId);
        $("#dialogosBorrarImpresora").empty();
        $("#dialogosBorrarImpresora").append(createDialogoBorrarImpresora(buscarImpresora(valorId)));
    });

    //Elimina impresora HECHO
    $("#dialogosBorrarImpresora").on("click", "button.eliminar", function() {
        let id = $(this).attr('id');
        let idImprString = id.substring(8)
        let idImpr = parseInt(idImprString, 10);
        Pmgr.rmPrinter(idImpr).then(update);
    });



    //Aniadir grupo de impresoras HECHO
    $("#modalAddGroup").on("click", "button.confirmarAddGrupo", function() {
        let nombreGrupo = $('#addNombreGrupo').val();
        Pmgr.addGroup({ name: nombreGrupo }).then(update);
    });

    //Crea el dialogo para mostrar grupo de impresoras HECHO
    $("#tablaGrupos").on("click", "button.mostrarG", function() {
        let id = $(this).attr('id');
        let dataTarget = $(this).attr('data-target');
        console.log("Hola soy el boton: " + id + " y tengo que sacar el modal: " + dataTarget);
        var valorId = id.substring(12);
        //console.log(valorId);
        $("#dialogosMostrarGrupoImpresora").empty();
        var grupo = buscarGrupo(valorId);
        console.log(grupo);
        $("#dialogosMostrarGrupoImpresora").append(createDialogoMostrarGrupo(grupo));
    });

    //Crea el dialogo para editar grupo de impresoras HECHO
    $("#tablaGrupos").on("click", "button.editarG", function() {
        let id = $(this).attr('id');
        let dataTarget = $(this).attr('data-target');
        console.log("Hola soy el boton: " + id + " y tengo que sacar el modal: " + dataTarget);
        var valorId = id.substring(9);
        //console.log(valorId);
        $("#dialogosEditarGrupoImpresora").empty();
        var grupo = buscarGrupo(valorId);
        console.log(grupo);
        $("#dialogosEditarGrupoImpresora").append(createDialogoEditarGrupo(grupo));
    });


    //Crea el dialogo para eliminar grupo impresoras HECHO
    $("#tablaGrupos").on("click", "button.eliminarG", function() {
        let id = $(this).attr('id');
        let dataTarget = $(this).attr('data-target');
        console.log("Hola soy el boton: " + id + " y tengo que sacar el modal: " + dataTarget);

        var valorId = id.substring(13);
        console.log(valorId);
        $("#dialogosBorrarGrupoImpresora").empty();
        var grupo = buscarGrupo(valorId);
        console.log(grupo.id);
        $("#dialogosBorrarGrupoImpresora").append(createDialogoBorrarGrupoImpresora(grupo));
    });

    //Elimina grupo HECHO
    $("#dialogosBorrarGrupoImpresora").on("click", "button.eliminarG", function() {
        let id = $(this).attr('id');
        let idGImpr = id.substring(9);
        console.log("Hola soy el boton: " + id + " y tengo que eliminar el grupo de impresoras: " + idGImpr);

        let idGImpr2 = parseInt(idGImpr, 10);
        Pmgr.rmGroup(idGImpr2).then(update);
    });

    //Crea el dialogo para ver trabajos HECHO
    $("#impresoras").on("click", "button.botonVerTrabajos", function() {
        let id = $(this).attr('id');
        let dataTarget = $(this).attr('data-target');
        console.log("Hola soy el boton: " + id + " y tengo que sacar el modal: " + dataTarget);
        var valorId = id.substring(11);
        console.log(valorId);
        $("#dialogosVerTrabajos").empty();
        var trabajos = verTrabajos(buscarImpresora(valorId));
        $("#dialogosVerTrabajos").append(trabajos);
    });

    //Crea el dialogo para eliminar trabajos
    /*  $("#impresoras").on("click", "button.botonBorrarTrabajo", function() {
         let id = $(this).attr('id');
         let dataTarget = $(this).attr('data-target');
         console.log("Hola soy el boton: " + id + " y tengo que sacar el modal: " + dataTarget);
    
         var valorId = id.substring(18);
         console.log(valorId);
         $("#dialogosBorrarTrabajo").empty();
         $("#dialogosBorrarTrabajo").append(createDialogoBorrarTrabajos(buscarTrabajo(valorId)));
     }); */

    //Elimina trabajo HACER
    $("#dialogosVerTrabajos").on("click", "button.botonBorrarTrabajo", function() {
        let id = $(this).attr('id');
        let idTr = id.substring(18);

        console.log(idTr);
        var valorFila = "#filaTrabajo" + idTr;
        console.log(valorFila);
        $(valorFila).empty();
    });

    //Crea el dialogo para anadir impresoras HECHO
    $("#divAnadirImp").on("click", "button.anadirImpresora", function() {
        let id = $(this).attr('id');
        let dataTarget = $(this).attr('data-target');
        console.log("Hola soy el boton: " + id + " y tengo que sacar el modal: " + dataTarget);
        var valorId = id.substring(6);
        console.log(valorId);
        $("#seleccionarGrupos").empty();
        $("#seleccionarGrupos").append(posiblesGrupos());
    });


    //crea impresora FALTA aniadir grupos
    $("#modalAddPrinter").on("click", "button.confirmarAddImpresora", function() {
        let ipAdd = $('#addIP').val();
        let nombre = $('#addAlias').val()
        let modelo = $('#addModelo').val();
        let localizacion = $('#addLocation').val();
        let idGrupo = $('#selectDeGrupos').val();
        var estado;
        if ($("#estadoCargado").prop('checked')) {
            estado = Pmgr.PrinterStates.PAUSED;
        } else if ($("#estadoSinPapel").prop('checked')) {
            estado = Pmgr.PrinterStates.NO_PAPER;
        } else {
            console.log("ha entrado en no tinta");
            estado = Pmgr.PrinterStates.NO_INK;
        }

        //Pmgr.addPrinter({alias: "AA", model: "CXGIE-379", location: "Despacho 231", ip: "192.168.0.64", status: "NO_PAPER"});
        let cadena = Pmgr.addPrinter({ alias: nombre, model: modelo, location: localizacion, ip: ipAdd, status: estado }).then(update);
        //let imprNueva = buscarImpresoraPorAlias(nombre);
        //console.log(imprNueva);
        /*console.log(Pmgr.globalState.printers);
        let grupo = buscarGrupo(idGrupo);
        grupo.printers.push(imprNueva.id);
        Pmgr.setGroup(grupo);*/
    });

    //crea trabajo HACER
    $("#addPrinterWork").on("click", "button.confirmarAddJob", function() {
        let fichero = $('input[type=file]').val().split('\\').pop();
        let nombreAutor = $('#autorTrabajo').val();
        //let nombre = $('#addAlias').val()
        //let modelo = $('#addModelo').val();
        //let localizacion = $('#addLocation').val();
        //let idGrupo = $('#selectDeGrupos').val();

        console.log(fichero);
        console.log(nombreAutor);
        let impresora;
        if($("#checkImpresora").prop('checked')){
            console.log("Checked impresora");
            impresora = $('#seleccionImpresoras').val()
            console.log(impresora);
        } else {
            console.log("Checked grupo");
        }

        Pmgr.addJob({printer : impresora, owner : nombreAutor, fileName : fichero}).then(update);
       //let cadena = Pmgr.addPrinter({ alias: nombre, model: modelo, location: localizacion, ip: ipAdd, status: estado }).then(update);
        //let imprNueva = buscarImpresoraPorAlias(nombre);
        //console.log(imprNueva);
        /*console.log(Pmgr.globalState.printers);
        let grupo = buscarGrupo(idGrupo);
        grupo.printers.push(imprNueva.id);
        Pmgr.setGroup(grupo);*/
    });

    //NUEVO
    //confirma editar impresora FALTA cambiar location
    $("#dialogosEditarImpresora").on("click", "button.confirmarEdicionImpresora", function() {
        let idHTML = $('.modalEditar').attr('id');
        let id = parseInt(idHTML.substring(4), 10);
        let ipChange = $('#changeIp').val();
        let modelo = $('#changeModel').val();
        let localizacion = $('#changeLocation').val();
        var estado;
        if ($("#estadoCargado").prop('checked')) {
            estado = Pmgr.PrinterStates.PAUSED;
        } else if ($("#estadoSinPapel").prop('checked')) {
            estado = Pmgr.PrinterStates.NO_PAPER;
        } else {
            console.log("ha entrado en no tinta");
            estado = Pmgr.PrinterStates.NO_INK;
        }
        let impresoraEditada = buscarImpresora(idHTML.substring(4));
        //console.log(impresoraEditada);
        //impresoraEditada.ip = ipChange;
        //impresoraEditada.modelo = modelo;
        //impresoraEditada.status = estado;
        //console.log(impresoraEditada);
        Pmgr.setPrinter({id : impresoraEditada.id, alias : impresoraEditada.alias, model : modelo, location : localizacion, ip : ipChange, queue : impresoraEditada.queue, status : estado}).then(update);
    });

    //confirma editar nombre de grupo HECHO
    $("#dialogosEditarGrupoImpresora").on("click", "button.confirmarEdicionNombreGrupo", function() {
        let idHTML = $('.modalEditarNombreGrupo').attr('id');
        let id = parseInt(idHTML.substring(9), 10);
        let nameChange = $('#changeGroupName').val();


        let grupoEditado = buscarGrupo(idHTML.substring(9));
        grupoEditado.name = nameChange;
        Pmgr.setGroup({id : grupoEditado.id, name : nameChange, printers : grupoEditado.printers}).then(update);

    });

    //Crea el dialogo para anadir trabajo HECHO Y CORREGIDO
    $("#divAnadirTrabajo").on("click", "button.anadirTrabajo", function() {
        $("#seleccionarGrupoEImpresoraParaTrabajo").empty();
        $("#seleccionarGrupoEImpresoraParaTrabajo").append(posiblesImpresorasYGrupos());
    });

});

// cosas que exponemos para usarlas desde la consola
window.populate = populate
window.Pmgr = Pmgr;
//window.createPrinterItem = createPrinterItem