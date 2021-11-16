import SocketIO from "socket.io";

class Socket {
	constructor(server) {
		this.io = SocketIO(server, {
			cors: {
				origin: "*:*",
				credentials: true,
			},
			allowEIO3: true,
		});

		this.usuarios = [];
		this.pujas = [];
	}

	start() {
		this.io.on("connection", (socket) => {
			// Cuando se conecta un cliente
			socket.on("join-subasta", ({ id_subasta, usuario}) => {

				console.log(`${usuario} se ha unido a la subasta con el id: ${socket.id}`);
				this.usuarios.unshift({ id: socket.id, usuario, id_subasta });

				// Conectamos al usuario a la sala de la subasta
				socket.join(id_subasta);

				this.io.to(id_subasta).emit("usuarios", {
					usuarios: this.usuarios
				});

				this.io.to(id_subasta).emit("new-usuario", {
					usuario
				});

				socket.emit("pujas", this.pujas);

			});

			socket.on("new-puja", (puja) => {
				const usuarioPujante = this.usuarios.find((u) => u.id == socket.id);

				const newPuja = {
					usuario: usuarioPujante.usuario,
					valor: puja.valor,
					id_subasta: usuarioPujante.id_subasta
				}

				this.pujas.push(newPuja);

				this.io.to(usuarioPujante.id_subasta).emit("new-puja", newPuja);

				// this.io.to(usuarioPujante.id_subasta).emit("pujas", this.pujas);

			});

			socket.on("disconnect", () => {
				const idxUser = this.usuarios.findIndex(u => u.id == socket.id);
				if (idxUser != -1) {
					const userLeft = this.usuarios.splice(idxUser, 1)[0];
					this.io.to(userLeft.id_subasta).emit("user-disconnect", `${userLeft.usuario} ha abandonado la subasta`);
					this.io.to(userLeft.id_subasta).emit("usuarios", {
						usuarios: this.usuarios
					});
				}
			});
		});
	}

	turnTake(turn) {
		this.io.sockets.emit("turns:take", turn);
	}

	turnDelete(turn) {
		this.io.sockets.emit("turns:delete", turn);
	}
}

module.exports = Socket;
