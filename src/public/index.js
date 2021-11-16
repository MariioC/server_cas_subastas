function keyPressUsuario(e) {
    const usuario = e.value;

    const links = document.querySelectorAll(".link-subasta");

    links.forEach((link) => {
        const href = link.getAttribute("data-href");
        link.setAttribute("href", `${href}&usuario=${usuario}`);
    });
}
