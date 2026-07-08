
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
let editandoGaleria = null;
let imagenActual = "";

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

document.querySelectorAll(".menuBtn").forEach(btn=>{

    btn.addEventListener("click",()=>{

        document.querySelectorAll(".menuBtn").forEach(item=>{

            item.classList.remove(
                "bg-blue-700",
                "text-white",
                "shadow-lg",
                "shadow-blue-900/40"
            );

            item.classList.add(
                "hover:bg-slate-800",
                "hover:translate-x-2"
            );

        });

        btn.classList.remove(
            "hover:bg-slate-800",
            "hover:translate-x-2"
        );

        btn.classList.add(
            "bg-blue-700",
            "text-white",
            "shadow-lg",
            "shadow-blue-900/40"
        );

        cargarSeccion(btn.dataset.seccion);

    });

});
cargarSeccion("eventos");
function cargarSeccion(nombre) {

    if (nombre === "eventos") {

        contenido.innerHTML = `
<div class="max-w-7xl mx-auto">

    <h1 class="text-4xl font-bold text-white mb-8">
        Administrar Eventos
    </h1>

    <!-- FORMULARIO -->
    <div class="bg-[#111827] rounded-3xl shadow-2xl border border-blue-900 p-8 mb-10">

        <h2 class="text-2xl font-bold text-blue-400 mb-6">
            Nuevo Evento
        </h2>

        <input
            id="titulo"
            placeholder="Título del evento"
            class="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 text-white mb-4">

        <input
            id="fecha"
            type="date"
            class="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 text-white mb-4">

        <textarea
            id="descripcion"
            rows="4"
            placeholder="Descripción"
            class="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 text-white mb-4">
        </textarea>

        <div class="grid md:grid-cols-2 gap-6">

            <div>

                <label class="text-blue-300 font-bold">
                    Banner PC
                </label>

                <img
                    id="previewPc"
                    class="hidden rounded-xl border mt-3 mb-3 w-full">

                <input
                    id="bannerPc"
                    type="file"
                    class="w-full rounded-xl bg-gray-900 p-3 border border-gray-700">

            </div>

            <div>

                <label class="text-blue-300 font-bold">
                    Banner Móvil
                </label>

                <img
                    id="previewMovil"
                    class="hidden rounded-xl border mt-3 mb-3 w-full">

                <input
                    id="bannerMovil"
                    type="file"
                    class="w-full rounded-xl bg-gray-900 p-3 border border-gray-700">

            </div>

        </div>

        <button
            id="guardarEvento"
            class="mt-8 bg-blue-700 hover:bg-blue-800 px-8 py-4 rounded-xl text-white font-bold transition">

            Guardar Evento

        </button>

    </div>

    <!-- TABLA -->

    <div class="bg-[#111827] rounded-3xl shadow-2xl border border-blue-900 p-8">

        <h2 class="text-2xl font-bold text-blue-400 mb-6">

            Eventos Registrados

        </h2>

        <div id="tablaEventos"></div>

    </div>

</div>


<!-- MODAL EDITAR -->

<div
id="modalEditarEvento"
class="fixed inset-0 bg-black/80 hidden z-50 overflow-y-auto">

    <div class="min-h-screen flex items-center justify-center p-5">

        <div
        id="contenidoModalEvento"
        class="bg-[#111827] w-full max-w-3xl rounded-3xl shadow-2xl border border-blue-900 p-8 relative">

            <button
                id="cerrarModalEvento"
                class="absolute top-4 right-5 text-white text-3xl hover:text-red-500">

                ✕

            </button>

            <h2 class="text-3xl font-bold text-blue-400 mb-6">

                Editar Evento

            </h2>

            <input
            id="editTitulo"
            class="w-full p-4 rounded-xl bg-gray-900 text-white mb-4">

            <input
            id="editFecha"
            type="date"
            class="w-full p-4 rounded-xl bg-gray-900 text-white mb-4">

            <textarea
            id="editDescripcion"
            rows="4"
            class="w-full p-4 rounded-xl bg-gray-900 text-white mb-4">
            </textarea>

            <div class="grid md:grid-cols-2 gap-6">

                <div>

                    <img
                    id="editPreviewPc"
                    class="hidden w-full h-48 object-contain rounded-xl border bg-black mb-3">

                    <input
                    id="editBannerPc"
                    type="file">

                </div>

                <div>

                    <img
                    id="editPreviewMovil"
                    class="hidden w-full h-48 object-contain rounded-xl border bg-black mb-3">

                    <input
                    id="editBannerMovil"
                    type="file">

                </div>

            </div>

            <button
            id="actualizarEvento"
            class="mt-8 w-full bg-blue-700 hover:bg-blue-800 rounded-xl py-4 text-white font-bold">

                Actualizar Evento

            </button>

        </div>

    </div>

</div>
`;
document
.getElementById("cerrarModalEvento")
.addEventListener("click",()=>{

    document
    .getElementById("modalEditarEvento")
    .classList.add("hidden");

});

document
.getElementById("modalEditarEvento")
.addEventListener("click",(e)=>{

    if(e.target.id==="modalEditarEvento"){

        document
        .getElementById("modalEditarEvento")
        .classList.add("hidden");

    }

});

document
.getElementById("actualizarEvento")
.addEventListener("click",actualizarEvento);

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
    if (nombre === "videos") {

contenido.innerHTML = `

<div class="bg-[#0F172A] rounded-3xl shadow-2xl border border-slate-700 p-8">

    <div class="flex items-center justify-between mb-8">

        <div>

            <h2 class="text-4xl font-bold text-blue-400">
                🎥 Administrar Videos
            </h2>

            <p class="text-gray-400 mt-2">
                Agrega las transmisiones de Facebook o YouTube.
            </p>

        </div>

    </div>

    <div class="grid gap-6">

        <div>

            <label class="block mb-2 font-semibold text-gray-300">
                Título del Video
            </label>

            <input
                id="tituloVideo"
                placeholder="Ej. Transmisión Viernes 11"
                class="w-full rounded-2xl bg-slate-900 border border-slate-600 text-white p-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-600 outline-none">

        </div>

        <div>

            <label class="block mb-2 font-semibold text-gray-300">
                URL del Video
            </label>

            <input
                id="urlVideo"
                placeholder="https://facebook.com/..."
                class="w-full rounded-2xl bg-slate-900 border border-slate-600 text-white p-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-600 outline-none">

        </div>

        <div class="text-right">

            <button
                id="guardarVideo"
                class="bg-blue-700 hover:bg-blue-800 transition px-8 py-4 rounded-2xl text-white font-bold shadow-lg">

                💾 Guardar Video

            </button>

        </div>

    </div>

</div>

<div class="mt-10">

    <h3 class="text-3xl font-bold text-blue-400 mb-6">

        📹 Videos Registrados

    </h3>

    <div id="tablaVideos"></div>

</div>

`;

document
.getElementById("guardarVideo")
.addEventListener(
"click",
guardarVideo
);

cargarTablaVideos();

}
if (nombre === "galeria") {

    mostrarGaleria();

}

}
async function guardarVideo() {

const titulo =
document.getElementById("tituloVideo").value;

const url =
document.getElementById("urlVideo").value;

await addDoc(
collection(db,"videos"),
{
titulo,
url
});

alert("Video guardado");

document.getElementById("tituloVideo").value="";
document.getElementById("urlVideo").value="";

cargarTablaVideos();

}
async function cargarTablaVideos(){

const contenedor =
document.getElementById("tablaVideos");

const snapshot =
await getDocs(collection(db,"videos"));

let html = `

<div class="overflow-x-auto rounded-3xl border border-slate-700 shadow-2xl">

<table class="min-w-full bg-[#0F172A] text-white">

<thead class="bg-gradient-to-r from-blue-900 to-slate-900">

<tr>

<th class="px-6 py-4 rounded-tl-3xl">
Título
</th>

<th class="px-6 py-4 text-center">
Video
</th>

<th class="px-6 py-4 text-center rounded-tr-3xl">
Acciones
</th>

</tr>

</thead>

<tbody>

`;

snapshot.forEach(docSnap=>{

const video=docSnap.data();

html += `

<tr class="border-b border-slate-700 hover:bg-slate-800 transition">

<td class="px-6 py-5">

<div class="font-bold text-blue-300">

${video.titulo}

</div>

</td>

<td class="px-6 py-5 text-center">

<a
href="${video.url}"
target="_blank"
class="bg-green-700 hover:bg-green-800 px-5 py-2 rounded-xl transition">

▶ Ver Video

</a>

</td>

<td class="px-6 py-5">

<div class="flex justify-center gap-3">

<button
class="editarVideo bg-blue-700 hover:bg-blue-800 px-5 py-2 rounded-xl transition"
data-id="${docSnap.id}">

✏️ Editar

</button>

<button
class="eliminarVideo bg-red-700 hover:bg-red-800 px-5 py-2 rounded-xl transition"
data-id="${docSnap.id}">

🗑 Eliminar

</button>

</div>

</td>

</tr>

`;
});

html+=`
</tbody>
</table>
</div>
`;

contenedor.innerHTML=html;

document
.querySelectorAll(".eliminarVideo")
.forEach(btn=>{

btn.addEventListener("click",async()=>{

if(confirm("¿Eliminar video?")){

await deleteDoc(
doc(db,"videos",btn.dataset.id)
);

cargarTablaVideos();

}

});

});

}
function mostrarVideos() {
    contenido.innerHTML=`

<h2 class="text-3xl font-bold mb-6">

Administrar Videos

</h2>

<input
id="tituloVideo"
placeholder="Título"
class="border p-3 w-full mb-4">

<textarea
id="urlVideo"
placeholder="Pega aquí la URL del iframe de Facebook o Youtube"
class="border p-3 w-full mb-4 h-32">
</textarea>

<button
id="guardarVideo"
class="bg-purple-600 text-white px-6 py-3 rounded">

Guardar Video

</button>

<hr class="my-8">

<div id="tablaVideos"></div>

`;
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

<div class="overflow-x-auto rounded-3xl border border-slate-700 shadow-2xl">

<table class="min-w-full bg-[#0F172A] text-white">

<thead class="bg-gradient-to-r from-blue-900 to-slate-900">

<tr>

<th class="px-6 py-4 text-left rounded-tl-3xl">
Banner
</th>

<th class="px-6 py-4 text-left">
Título
</th>

<th class="px-6 py-4 text-center">
Fecha
</th>

<th class="px-6 py-4 text-center rounded-tr-3xl">
Acciones
</th>

</tr>

</thead>

<tbody>

`;  

    snapshot.forEach(docSnap => {

        const evento =
            docSnap.data();

       html += `

<tr class="border-b border-slate-700 hover:bg-slate-800 duration-300">

<td class="px-6 py-4">

<img
src="${evento.bannerPc}"
class="w-28 h-16 rounded-xl object-cover shadow-lg border border-slate-600">

</td>

<td class="px-6 py-4">

<div class="font-bold text-lg text-blue-300">

${evento.titulo}

</div>

</td>

<td class="px-6 py-4 text-center text-gray-300">

${evento.fecha}

</td>

<td class="px-6 py-4">

<div class="flex justify-center gap-3">

<button
class="editarEvento flex items-center gap-2 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-xl transition duration-300 shadow"
data-id="${docSnap.id}">

✏️ Editar

</button>

<button
class="eliminarEvento flex items-center gap-2 bg-red-700 hover:bg-red-800 px-4 py-2 rounded-xl transition duration-300 shadow"
data-id="${docSnap.id}">

🗑 Eliminar

</button>

</div>

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
document
.getElementById("cerrarModalEvento")
.onclick=()=>{

document
.getElementById("modalEditarEvento")
.classList.add("hidden");

};
async function editarEvento(id){

const snapshot=
await getDocs(collection(db,"eventos"));

snapshot.forEach(docSnap=>{

if(docSnap.id!==id) return;

const evento=docSnap.data();

editandoId=id;

bannerPcActual=evento.bannerPc;
bannerMovilActual=evento.bannerMovil;

document.getElementById("editTitulo").value=evento.titulo;

document.getElementById("editFecha").value=evento.fecha;

document.getElementById("editDescripcion").value=evento.descripcion;

const pc=document.getElementById("editPreviewPc");

pc.src=evento.bannerPc;

pc.classList.remove("hidden");

const movil=document.getElementById("editPreviewMovil");

movil.src=evento.bannerMovil;

movil.classList.remove("hidden");

document
.getElementById("modalEditarEvento")
.classList.remove("hidden");

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
function mostrarGaleria(){

contenido.innerHTML=`

<div class="bg-[#0F172A] rounded-3xl border border-slate-700 shadow-2xl p-8">

    <h2 class="text-4xl font-bold text-blue-400 mb-2">
        👥 Administrar Galería
    </h2>

    <p class="text-gray-400 mb-8">
        Agrega el personal o fotografías para mostrar en la página.
    </p>

    <div class="grid md:grid-cols-2 gap-6">

        <div>

            <label class="block text-gray-300 mb-2">
                Nombre
            </label>

            <input
            id="nombreGaleria"
            placeholder="Nombre"
            class="w-full bg-slate-900 border border-slate-600 rounded-2xl p-4 text-white">

        </div>

        <div>

            <label class="block text-gray-300 mb-2">
                Cargo
            </label>

            <input
            id="cargoGaleria"
            placeholder="Cargo"
            class="w-full bg-slate-900 border border-slate-600 rounded-2xl p-4 text-white">

        </div>

    </div>

    <div class="mt-6">

        <img
        id="previewGaleria"
        class="hidden w-52 h-52 object-cover rounded-2xl border border-slate-700 mb-4">

        <input
        id="imagenGaleria"
        type="file"
        class="w-full bg-slate-900 border border-slate-600 rounded-2xl p-4 text-white">

    </div>

    <button
    id="guardarGaleria"
    class="mt-8 bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-2xl shadow-lg">

        💾 Guardar

    </button>

</div>

<div class="mt-10">

<h2 class="text-3xl font-bold text-blue-400 mb-6">

Personal Registrado

</h2>

<div id="tablaGaleria"></div>

</div>
<div
id="modalGaleria"
class="fixed inset-0 bg-black/80 hidden z-50 overflow-y-auto">

<div class="min-h-screen flex justify-center items-center p-6">

<div class="bg-[#111827] max-w-xl w-full rounded-3xl p-8 relative">

<button
id="cerrarModalGaleria"
class="absolute top-4 right-5 text-3xl text-white">

✕

</button>

<h2 class="text-3xl font-bold text-blue-400 mb-6">

Editar Personal

</h2>

<input
id="editNombreGaleria"
class="w-full bg-slate-900 rounded-xl p-4 text-white mb-4">

<input
id="editCargoGaleria"
class="w-full bg-slate-900 rounded-xl p-4 text-white mb-4">

<img
id="editPreviewGaleria"
class="w-56 h-56 object-cover rounded-2xl mx-auto mb-4">

<input
id="editImagenGaleria"
type="file"
class="mb-6">

<button
id="actualizarGaleria"
class="w-full bg-blue-700 py-4 rounded-xl text-white">

Actualizar

</button>

</div>

</div>

</div>

`;
document
.getElementById("cerrarModalGaleria")
.addEventListener("click",()=>{

document
.getElementById("modalGaleria")
.classList.add("hidden");

});
document
.getElementById("modalGaleria")
.addEventListener("click",(e)=>{

if(e.target.id==="modalGaleria"){

document
.getElementById("modalGaleria")
.classList.add("hidden");

}

});
document
.getElementById("editImagenGaleria")
.addEventListener("change",e=>{

const archivo=e.target.files[0];

if(!archivo)return;

document
.getElementById("editPreviewGaleria")
.src=URL.createObjectURL(archivo);

});
document
.getElementById("actualizarGaleria")
.addEventListener(
"click",
actualizarGaleria
);
document
.getElementById("guardarGaleria")
.addEventListener("click",guardarGaleria);

document
.getElementById("imagenGaleria")
.addEventListener("change",e=>{

const archivo=e.target.files[0];

if(!archivo)return;

const preview=document.getElementById("previewGaleria");

preview.src=URL.createObjectURL(archivo);

preview.classList.remove("hidden");

});

cargarTablaGaleria();

}
function limpiarFormularioGaleria(){

document.getElementById("nombreGaleria").value="";

document.getElementById("cargoGaleria").value="";

document.getElementById("imagenGaleria").value="";

document.getElementById("previewGaleria").classList.add("hidden");

document.getElementById("guardarGaleria").innerText="Guardar";

imagenActual="";

editandoGaleria=null;

}
async function cargarTablaGaleria(){

const tabla=
document.getElementById("tablaGaleria");

const snapshot=
await getDocs(
collection(db,"galeria")
);

let html=`

<div class="overflow-x-auto rounded-3xl border border-slate-700 shadow-2xl">

<table class="min-w-full bg-[#0F172A] text-white">

<thead class="bg-gradient-to-r from-blue-900 to-slate-900">

<tr>

<th class="px-6 py-4 rounded-tl-3xl">

Foto

</th>

<th class="px-6 py-4">

Nombre

</th>

<th class="px-6 py-4">

Cargo

</th>

<th class="px-6 py-4 rounded-tr-3xl">

Acciones

</th>

</tr>

</thead>

<tbody>

`;

snapshot.forEach(docSnap=>{

const foto=docSnap.data();

html+=`

<tr class="border-b border-slate-700 hover:bg-slate-800 duration-300">

<td class="px-6 py-4">

<img
src="${foto.imagen}"
class="w-20 h-20 rounded-full object-cover border border-slate-600 shadow">

</td>

<td class="px-6 py-4 font-semibold text-blue-300">

${foto.titulo}

</td>

<td class="px-6 py-4 text-gray-300">

${foto.cargo||""}

</td>

<td class="px-6 py-4">

<div class="flex justify-center gap-3">

<button
class="editarGaleria bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-xl"
data-id="${docSnap.id}">

✏️ Editar

</button>

<button
class="eliminarGaleria bg-red-700 hover:bg-red-800 px-4 py-2 rounded-xl"
data-id="${docSnap.id}">

🗑 Eliminar

</button>

</div>

</td>

</tr>

`;
});

html+=`

</tbody>

</table>
</div>

`;

tabla.innerHTML=html;

document
.querySelectorAll(".editarGaleria")
.forEach(btn=>{

btn.onclick=()=>editarGaleria(btn.dataset.id);

});

document
.querySelectorAll(".eliminarGaleria")
.forEach(btn=>{

btn.onclick=()=>eliminarGaleria(btn.dataset.id);

});

}

async function editarGaleria(id){

const snapshot =
await getDocs(
collection(db,"galeria")
);

snapshot.forEach(docSnap=>{

if(docSnap.id===id){

const foto = docSnap.data();

editandoGaleria = id;
imagenActual = foto.imagen;

document.getElementById("editNombreGaleria").value =
foto.titulo;

document.getElementById("editCargoGaleria").value =
foto.cargo || "";

document.getElementById("editPreviewGaleria").src =
foto.imagen;

// Mostrar modal
document
.getElementById("modalGaleria")
.classList.remove("hidden");

}

});

}
async function eliminarGaleria(id){

if(!confirm("¿Eliminar?")) return;

await deleteDoc(
doc(db,"galeria",id)
);

cargarTablaGaleria();

}
async function guardarGaleria() {

    const nombre = document.getElementById("nombreGaleria").value;

    const cargo = document.getElementById("cargoGaleria").value;

    const archivo = document.getElementById("imagenGaleria").files[0];

    let urlImagen = imagenActual;

    // Si seleccionó una nueva imagen
    if (archivo) {
        urlImagen = await subirImagen(archivo);
    }

    const datos = {
        titulo: nombre,
        cargo: cargo,
        imagen: urlImagen
    };

    // EDITAR
    if (editandoGaleria) {

        await updateDoc(
            doc(db, "galeria", editandoGaleria),
            datos
        );

        alert("Personal actualizado");

    }
    // NUEVO
    else {

        await addDoc(
            collection(db, "galeria"),
            datos
        );

        alert("Personal agregado");

    }

    limpiarFormularioGaleria();

    cargarTablaGaleria();

}
document
.getElementById("actualizarEvento")
.addEventListener("click", actualizarEvento);
async function actualizarEvento() {

    const titulo = document.getElementById("editTitulo").value;
    const fecha = document.getElementById("editFecha").value;
    const descripcion = document.getElementById("editDescripcion").value;

    const archivoPc =
        document.getElementById("editBannerPc").files[0];

    const archivoMovil =
        document.getElementById("editBannerMovil").files[0];

    let urlPc = bannerPcActual;
    let urlMovil = bannerMovilActual;

    if (archivoPc) {
        urlPc = await subirImagen(archivoPc);
    }

    if (archivoMovil) {
        urlMovil = await subirImagen(archivoMovil);
    }

    await updateDoc(
        doc(db, "eventos", editandoId),
        {
            titulo,
            fecha,
            descripcion,
            bannerPc: urlPc,
            bannerMovil: urlMovil
        }
    );

    alert("Evento actualizado");

    document
        .getElementById("modalEditarEvento")
        .classList.add("hidden");

    cargarTablaEventos();
}
async function actualizarGaleria(){

const nombre =
document.getElementById("editNombreGaleria").value;

const cargo =
document.getElementById("editCargoGaleria").value;

const archivo =
document.getElementById("editImagenGaleria").files[0];

let url = imagenActual;

if(archivo){

url = await subirImagen(archivo);

}

await updateDoc(

doc(db,"galeria",editandoGaleria),

{

titulo:nombre,
cargo:cargo,
imagen:url

}

);

alert("Personal actualizado");

document
.getElementById("modalGaleria")
.classList.add("hidden");

cargarTablaGaleria();

}