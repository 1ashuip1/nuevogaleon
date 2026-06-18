
import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";
import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

const firebaseConfig = {

    apiKey: "AIzaSyDMVoHXT7zzK0R-mgr5y0JC_JBo-hJ5uNQ",
    authDomain: "paginawebgrangaleon.firebaseapp.com",
    projectId: "paginawebgrangaleon",
    storageBucket: "paginawebgrangaleon.firebasestorage.app",
    messagingSenderId: "332844805304",
    appId: "1:332844805304:web:86e8ff50c2a4f7ec09984d",
    measurementId: "G-DMLS0ETR4C"

};
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    document
        .getElementById("bodyAdmin")
        .classList.remove("hidden");

});
let editandoId = null;
let bannerPcActual = "";
let bannerMovilActual = "";
const contenido =
document.getElementById(
    "contenidoAdmin"
);

document
.querySelectorAll(".menuBtn")
.forEach(btn => {

    btn.addEventListener(
        "click",
        () => {

            const seccion =
                btn.dataset.seccion;

            cargarSeccion(
                seccion
            );

        }
    );

});
function cargarSeccion(nombre) {

    if (nombre === "eventos") {

        contenido.innerHTML = `

        <h2 class="text-3xl font-bold mb-6">
            Nuevo Evento
        </h2>

        <input
            id="titulo"
            placeholder="Título"
            class="border p-3 w-full mb-4">

        <input
            id="fecha"
            type="date"
            class="border p-3 w-full mb-4">

        <textarea
            id="descripcion"
            placeholder="Descripción"
            class="border p-3 w-full mb-4">
        </textarea>

        <label class="block font-bold mb-2">
Banner para PC
</label>

<img
id="previewPc"
class="w-64 rounded mb-3 border hidden">

<input
id="bannerPc"
type="file"
class="mb-4 border p-2 w-full">

<label class="block font-bold mb-2">
Banner para Móvil
</label>

<img
id="previewMovil"
class="w-40 rounded mb-3 border hidden">

<input
id="bannerMovil"
type="file"
class="mb-4 border p-2 w-full">

        <button
            id="guardarEvento"
            class="bg-purple-600 text-white px-6 py-3 rounded">

            Guardar

        </button>
        <hr class="my-8">

<h3 class="text-2xl font-bold mb-4">
Eventos registrados
</h3>

<div id="tablaEventos"></div>

        `;

        document
        .getElementById("guardarEvento")
        .addEventListener(
            "click",
            guardarBanner
        );
        cargarTablaEventos();
        document
.getElementById("bannerPc")
.addEventListener(
    "change",
    e => {

        const archivo =
            e.target.files[0];

        if (!archivo) return;

        const preview =
            document.getElementById(
                "previewPc"
            );

        preview.src =
            URL.createObjectURL(
                archivo
            );

        preview.classList.remove(
            "hidden"
        );

    }
);

document
.getElementById("bannerMovil")
.addEventListener(
    "change",
    e => {

        const archivo =
            e.target.files[0];

        if (!archivo) return;

        const preview =
            document.getElementById(
                "previewMovil"
            );

        preview.src =
            URL.createObjectURL(
                archivo
            );

        preview.classList.remove(
            "hidden"
        );

    }
);

    }

}
function mostrarBanner() {

contenido.innerHTML = `

<h2 class="text-3xl font-bold mb-6">
Banner
</h2>

<input
id="titulo"
placeholder="Titulo"
class="border p-3 w-full mb-3">

<input
id="fecha"
type="date"
class="border p-3 w-full mb-3">

<label>
Banner PC
</label>

<input
id="bannerPc"
type="file"
class="mb-3">

<label>
Banner Móvil
</label>

<input
id="bannerMovil"
type="file"
class="mb-3">

<button
id="guardarBanner"
class="bg-purple-600 text-white px-6 py-3 rounded">

Guardar

</button>

`;

document
.getElementById(
"guardarBanner"
)
.addEventListener(
"click",
guardarBanner
);

}
const CLOUD_NAME =
"dadfnwttp";

const UPLOAD_PRESET =
"grangaleon";
async function subirImagen(file) {

const formData =
new FormData();

formData.append(
"file",
file
);

formData.append(
"upload_preset",
UPLOAD_PRESET
);

const respuesta =
await fetch(

`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,

{
method: "POST",
body: formData
}

);

const data =
await respuesta.json();

return data.secure_url;

}

async function guardarBanner() {

const titulo =
document.getElementById(
"titulo"
).value;

const fecha =
document.getElementById(
"fecha"
).value;

const archivoPc =
document.getElementById(
"bannerPc"
).files[0];

const archivoMovil =
document.getElementById(
"bannerMovil"
).files[0];

let urlPc = bannerPcActual;
let urlMovil = bannerMovilActual;

if (archivoPc) {

    urlPc =
    await subirImagen(
        archivoPc
    );

}

if (archivoMovil) {

    urlMovil =
    await subirImagen(
        archivoMovil
    );

}

const datos = {

    titulo,
    fecha,
    descripcion:
        document.getElementById(
            "descripcion"
        ).value,

    bannerPc: urlPc,
    bannerMovil: urlMovil

};

if (editandoId) {

    await updateDoc(

        doc(
            db,
            "eventos",
            editandoId
        ),

        datos

    );

    alert("Evento actualizado");

limpiarFormulario();

cargarTablaEventos();

    editandoId = null;

} else {

    await addDoc(

        collection(
            db,
            "eventos"
        ),

        datos

    );

    alert("Evento guardado");

limpiarFormulario();

cargarTablaEventos();

}
}
async function cargarTablaEventos() {

    const contenedor =
        document.getElementById(
            "tablaEventos"
        );

    const snapshot =
        await getDocs(
            collection(db, "eventos")
        );

    let html = `
    <table class="w-full bg-white shadow rounded">

        <thead class="bg-purple-600 text-white">

            <tr>
                <th class="p-3">Imagen</th>
                <th>Título</th>
                <th>Fecha</th>
                <th>Acciones</th>
            </tr>

        </thead>

        <tbody>
    `;

    snapshot.forEach(docSnap => {

        const evento =
            docSnap.data();

        html += `
        <tr class="border-b">

            <td class="p-2">

                <img
                    src="${evento.bannerPc}"
                    class="w-24 h-14 object-cover rounded">

            </td>

            <td>
                ${evento.titulo}
            </td>

            <td>
                ${evento.fecha}
            </td>

            <td class="space-x-2">

    <button
        class="editarEvento bg-blue-600 text-white px-3 py-1 rounded"
        data-id="${docSnap.id}">

        Editar

    </button>

    <button
        class="eliminarEvento bg-red-600 text-white px-3 py-1 rounded"
        data-id="${docSnap.id}">

        Eliminar

    </button>

</td>

        </tr>
        `;

    });

    html += `
        </tbody>
    </table>
    `;

    contenedor.innerHTML = html;

    document
    .querySelectorAll(".eliminarEvento")
    .forEach(btn => {

        btn.addEventListener(
            "click",
            async () => {

                if(
                    confirm(
                        "¿Eliminar evento?"
                    )
                ){

                    await deleteDoc(
                        doc(
                            db,
                            "eventos",
                            btn.dataset.id
                        )
                    );

                    cargarTablaEventos();

                }

            }
        );

    });
    document
.querySelectorAll(".editarEvento")
.forEach(btn => {

    btn.addEventListener(
        "click",
        () => editarEvento(btn.dataset.id)
    );

});

}
async function editarEvento(id) {

    const snapshot =
        await getDocs(
            collection(db, "eventos")
        );

    snapshot.forEach(docSnap => {

        if (docSnap.id === id) {

            const evento =
                docSnap.data();

            bannerPcActual =
                evento.bannerPc || "";

            bannerMovilActual =
                evento.bannerMovil || "";

            document.getElementById(
                "titulo"
            ).value =
                evento.titulo || "";

            document.getElementById(
                "fecha"
            ).value =
                evento.fecha || "";

            document.getElementById(
                "descripcion"
            ).value =
                evento.descripcion || "";

            document.getElementById(
                "previewPc"
            ).src =
                evento.bannerPc || "";

            document.getElementById(
                "previewMovil"
            ).src =
                evento.bannerMovil || "";

            document.getElementById(
                "previewPc"
            ).classList.remove(
                "hidden"
            );

            document.getElementById(
                "previewMovil"
            ).classList.remove(
                "hidden"
            );

            editandoId = id;

            document.getElementById(
                "guardarEvento"
            ).innerText =
                "Actualizar Evento";

        }

    });

}
function limpiarFormulario() {

    document.getElementById("titulo").value = "";
    document.getElementById("fecha").value = "";
    document.getElementById("descripcion").value = "";

    document.getElementById("bannerPc").value = "";
    document.getElementById("bannerMovil").value = "";

    document.getElementById("previewPc").src = "";
    document.getElementById("previewMovil").src = "";

    document.getElementById("previewPc").classList.add("hidden");
    document.getElementById("previewMovil").classList.add("hidden");

    bannerPcActual = "";
    bannerMovilActual = "";

    editandoId = null;

    document.getElementById(
        "guardarEvento"
    ).innerText = "Guardar";
}
document
.getElementById("logoutBtn")
.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href =
        "login.html";

});