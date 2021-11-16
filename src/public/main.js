let socket;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const usuario = urlParams.get("usuario");
const id_subasta = urlParams.get("id_subasta");

function sendPuja() {
    var puja = {
        usuario,
        valor: document.getElementById("valor").value,
    };

    socket.emit("new-puja", puja);
}

function initSubasta() {
    if (!usuario || !id_subasta) return alert("No se ha conectado a la subasta");

    socket = io.connect("http://localhost:3000", { forceNew: true });

    socket.emit("join-subasta", { id_subasta, usuario });

    initSocket();
}

initSubasta();

function initSocket() {
    socket.on("new-puja", (data) => {
        console.log(data);
        pujaDOM(data);
    });

    socket.on("new-usuario", ({ usuario }) => {
        console.log(usuario);
        // usuarioDOM(usuario);
    });

    socket.on("usuarios", ({ usuarios }) => {
        const containerUsuarios = document.querySelector("#container-usuarios");
        const countUsuarios = document.querySelector("#count-usuarios");
        countUsuarios.innerHTML = usuarios.length
        containerUsuarios.innerHTML = '';

        usuarios.forEach(({ usuario }) => {
            usuariosDOM(usuario);
        });

    });

    socket.on("pujas", (pujas) => {
        console.log(pujas);
        pujas.forEach(({ usuario, valor }) => {
            pujaDOM({ usuario, valor });
        });
    });

    socket.on("user-disconnect", (data) => {
        console.log(data);
    });
}

function usuariosDOM( usuario ) {
    const containerUsuarios = document.querySelector("#container-usuarios");
    const divUsuario = document.createElement('div');
    divUsuario.classList.add('usuario', 'd-flex', 'justify-content-center', 'align-items-center', 'mb-2')
    divUsuario.innerHTML = `
        <div class="img-usuario border border-2 rounded-circle d-flex justify-content-center align-items-center overflow-hidden">
            <img src="hombre.png" alt="hombre" width="60" height="60" class="d-block">
        </div>
        <h5 class="mx-2" title="${usuario}">${usuario}</h5>
    `;
    containerUsuarios.appendChild(divUsuario);
}

function pujaDOM({ usuario, valor }) {
    const containerHistorialPujas = document.querySelector(".container-pujas");

    const divPuja = document.createElement('div');

    divPuja.classList.add('puja', 'list-group-item', 'list-group-item-action', 'flex-column', 'align-items-start', 'border-2', 'mb-2', 'rounded-2')
    divPuja.innerHTML = `
        <div class="d-flex w-100 justify-content-between">
            <div class="mb-1 d-flex align-items-center">
                <div class="img-usuario border border-success border-2 rounded-circle d-flex justify-content-center align-items-center overflow-hidden">
                    <img src="mujer.png" alt="hombre" width="50" height="50" class="d-block">
                </div>
                <h5 class="mx-2" title="${usuario}">${usuario}</h5>
            </div>
            <small class="text-muted">2:04 pm</small>
        </div>
        <p class="my-1 text-center">Realizó una puja por un valor de <span class="fw-bold">$${valor}</span></p>
    `;

    containerHistorialPujas.prepend(divPuja);
}
