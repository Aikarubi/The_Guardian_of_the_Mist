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
    bosqueBloqueado: {
        title: "Bosque con niebla",
        image: "img/bosque.jpg",
        text: () => {
            if (state.linterna === "con_pilas") {
                return "La linterna ilumina la espesura y puedes avanzar con seguridad.";
            }
            return "La niebla es demasiado espesa, no ves a un metro de distancia. Si entras sin luz acabarías perdido para siempre.";
        },
        options: [
            ...(state.linterna === "con_pilas"
                ? [{ text: "Avanzar al bosque", next: () => scenes.bosque }]
                : []),
            { text: "Volver al claro", next: () => scenes.inicio }
        ]
    },
    nota: {
        title: "La Nota Misteriosa",
        image: "img/nota.jpg",
        text: () => {
            if (!state.nota) {
                return "No tienes ninguna nota contigo.";
            }
            if (state.notaTraducida) {
                return `La nota, ya traducida por la bibliotecaria, dice:<br><br>
                        <em>
                        "Tres puertas guarda la niebla,<br>
                        una con luz que engaña,<br>
                        otra con oscuridad eterna,<br>
                        y solo la tercera conduce al guardián."
                        </em>`;
            }
            return "La nota está escrita en un idioma extraño que no entiendes. Tal vez alguien pueda ayudarte a descifrarla.";
        },
        options: [
            { text: "Guardar la nota", next: () => scenes.inicio }
        ]
    },

    pueblo: {
        title: "El Pueblo",
        image: "img/pueblo.jpg",
        text: "Llegas a un pequeño pueblo cubierto por la niebla. Las calles están silenciosas, pero una taberna permanece abierta. Tal vez allí consigas información.",
        options: [
            { text: "Entrar en la taberna", next: () => scenes.taberna1 }
        ]
    },

    taberna1: {
        title: "La Taberna",
        image: "img/taberna.jpg",
        text: "Una vez dentro, el tabernero, un hombre de mirada siniestra, te observa. Le cuentas lo de la linterna y la nota, buscando ayuda. Él sonríe con malicia y te dice que en una cabaña a las afueras del pueblo podrías encontrar suministros. No tienes otra opción clara.",
        options: [
            { text: "Ir a la cabaña", next: () => scenes.cabana },
        ]
    },

    cabana: {
        title: "La Cabaña",
        image: "img/cabana.jpg",
        text: "Encuentras la cabaña cerrada. Tras dar vueltas, decides forzar la entrada. Te haces algunas heridas, pero consigues entrar. Tras registrar las habitaciones descubres que no hay nada útil. Cuando vas a salir, un encapuchado aparece dispuesto a atraparte por invadir su propiedad.",
        options: [
            { text: "Correr hacia el pueblo", next: () => scenes.persecucion },
            { text: "Huir hacia las afueras", next: () => scenes.afueras }
        ]
    },

    persecucion: {
        title: "La Persecución",
        image: "img/persecucion.jpg",
        text: "Corres por la oscuridad, tropezando varias veces pero consigues despistar al encapuchado y regresar al pueblo. Exhausto, ves que todas las casas están cerradas excepto una, iluminada por dentro.",
        options: [
            { text: "Acercarte a la casa iluminada", next: () => scenes.sanadora }
        ]
    },

    sanadora: {
        title: "La Sanadora",
        image: "img/sanadora.jpg",
        text: "Una mujer de aspecto tranquilo ve tu reflejo lleno de heridas por la vetana y te invita a entrar. Observa tus heridas y dice que puede curarte a cambio de una moneda. Recuerdas a ver visto una fuente en el pueblo, quizá allí encuentres algo.",
        options: [
            { text: "Buscar en la fuente", next: () => scenes.fuente }
        ]
    },

    fuente: {
        title: "La Fuente",
        image: "img/fuente.jpg",
        text: "Te acercas a la fuente del pueblo. Tras rebuscar un rato, encuentras una vieja moneda oxidada.",
        options: [
            {
                text: "Llevar la moneda a la sanadora",
                setState: { moneda: true },
                next: () => scenes.sanadoraCuracion
            }
        ]
    },

    sanadoraCuracion: {
        title: "La Sanadora",
        image: "img/sanadora.jpg",
        text: "La sanadora toma la moneda y cura tus heridas. Además, te permite descansar en su casa. Tras escuchar tu historia, te aconseja hablar con el herrero para arreglar la linterna.",
        options: [
            { text: "Ir a la herrería", next: () => scenes.herreria }
        ]
    },

    herreria: {
        title: "La Herrería",
        image: "img/herreria.jpg",
        text: "El herrero examina tu linterna. 'Necesita dos pilas. Solo tengo una, falta la otra', te dice. Te recomienda hablar de nuevo con el tabernero.",
        options: [
            { text: "Regresar a la taberna", next: () => scenes.taberna2 }
        ]
    },

    taberna2: {
        title: "La Taberna",
        image: "img/taberna.jpg",
        text: "El tabernero ríe al verte. 'Así que necesitas la otra pila, ¿eh? Puedo dártela, pero quiero algo a cambio.' La oferta suena turbia.",
        options: [
            {
                text: "Aceptar el trato sucio y llevarle la pila al herrero",
                setState: { linterna: "con_pilas" },
                next: () => scenes.linternaReparada
            },
            {
                text: "Rechazar el trato",
                setState: { linterna: "rota" },
                next: () => scenes.linternaRota
            }
        ]
    },

    linternaReparada: {
        title: "Linterna reparada",
        image: "img/linterna.jpg",
        text: "Con las dos pilas, el herrero logra reparar tu linterna. Ahora puedes aventurarte en el bosque con seguridad.",
        options: [
            { text: "Entrar al bosque", next: () => scenes.bosque }
        ]
    },

    linternaRota: {
        title: "Linterna rota",
        image: "img/linterna-rota.jpg",
        text: "El tabernero rompe tu linterna en mil pedazos. Ahora el bosque queda cerrado para ti. Solo te queda explorar otras zonas del pueblo y sus afueras.",
        options: [
            { text: "Explorar las afueras del pueblo", next: () => scenes.afueras }
        ]
    },

    // Placeholder: bosque y afueras para continuar
    bosque: {
        title: "El Bosque",
        image: "img/bosque.jpg",
        text: "Con tu linterna encendida, la niebla del bosque se disipa un poco. Te adentras en lo desconocido...",
        options: [
            { text: "Continuará...", next: () => scenes.inicio }
        ]
    },

    afueras: {
        title: "Las Afueras",
        image: "img/afueras.jpg",
        text: "Escapas hacia las afueras del pueblo, donde otros misterios esperan. Puede que aún haya caminos hacia el Guardián.",
        options: [
            { text: "Continuará...", next: () => scenes.inicio }
        ]
    }

};

showScene(scenes.inicio);
