//Estado inicial de los items
const state = {
    linterna: "sin_pilas", // puede ser "sin_pilas", "con_pilas", "rota"
    nota: false,           // false = no la has cogido, true = en inventario
    notaTraducida: false   // desbloqueado al hablar con la bibliotecaria
};


//Mostrar escena
function showScene(scene) {
    const title = document.getElementById("title");
    const text = document.getElementById("text");
    const choices = document.getElementById("choices");
    choices.innerHTML = "";

    // Si hay imagen, la metemos antes del texto
    text.innerHTML = scene.image
        ? `<img src="${scene.image}" alt="" class="scene-image">${scene.text}`
        : scene.text;

    title.textContent = scene.title;

    scene.options.forEach(opt => {
        const button = document.createElement("button");
        button.textContent = opt.text;
        button.onclick = () => {
            if (opt.setState) Object.assign(state, opt.setState);
            showScene(opt.next());
        };
        choices.appendChild(button);
    });
}

// Escenas del juego
const scenes = {
    inicio: {
        title: "El Guardián de la Niebla",
        text: "Te despiertas en medio de un bosque misterioso. Observas alrededor, primero ves que al lado tuya hay una linterna y una nota. Y cuando levantas la vista, ves un camino que se adentra en el bosque y otro que lleva hacia un pequeño pueblo a lo lejos.",
        image: "img/inicio.jpg",
        options: [
            {
                text: "Recoger la nota",
                setState: { nota: true },
                next: () => scenes.inicioConNota
            },
            {
                text: "Recoger la linterna",
                setState: { linterna: "sin_pilas" },
                next: () => scenes.inicioConLinterna
            },
            { text: "Caminar hacia el pueblo", next: () => scenes.pueblo },
            { text: "Intentar entrar al bosque", next: () => scenes.bosqueBloqueado }
        ]
    },

};