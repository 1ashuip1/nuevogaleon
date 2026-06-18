// ==================== IMPORTS FIREBASE ====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-analytics.js";
import { 
    getFirestore, 
    collection, 
    getDocs 
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

// ==================== CONFIG FIREBASE ====================
const firebaseConfig = {
    apiKey: "AIzaSyDMVoHXT7zzK0R-mgr5y0JC_JBo-hJ5uNQ",
    authDomain: "paginawebgrangaleon.firebaseapp.com",
    projectId: "paginawebgrangaleon",
    storageBucket: "paginawebgrangaleon.firebasestorage.app",
    messagingSenderId: "332844805304",
    appId: "1:332844805304:web:86e8ff50c2a4f7ec09984d",
    measurementId: "G-DMLS0ETR4C"
};
const whatsapp =
"59168180719";

const correo =
"contacto@grangaleon.com";

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// ==================== VARIABLES GLOBALES ====================
let startX = 0;
let endX = 0;
let indice = 0;           // ← movido aquí
let eventos = [];         // ← movido aquí

// ==================== FUNCIONES ====================

// Ocultar loader cuando todo termine
function ocultarLoader() {
    const loader = document.getElementById("loader");
    loader.style.opacity = "0";
    setTimeout(() => {
        loader.style.display = "none";
    }, 600);
}
function actualizarDots() {

    document
        .querySelectorAll(".dot")
        .forEach((dot, i) => {

            if (i === indice) {

                dot.classList.remove(
                    "bg-white/40"
                );

                dot.classList.add(
                    "bg-white",
                    "scale-125"
                );

            } else {

                dot.classList.remove(
                    "bg-white",
                    "scale-125"
                );

                dot.classList.add(
                    "bg-white/40"
                );

            }

        });

}
// ==================== BANNER ====================
async function cargarBanner() {
    try {
        const banner = document.getElementById("banner");
        const indicadores = document.getElementById("indicadores");

        const snapshot = await getDocs(collection(db, "eventos"));
        eventos = [];
        snapshot.forEach((doc) => eventos.push(doc.data()));

        if (eventos.length === 0) return;

        function mostrarEvento() {

    const evento = eventos[indice];

    const imagenBanner =
        window.innerWidth < 768
            ? evento.bannerMovil
            : evento.bannerPc;

    banner.innerHTML = `

    <!-- Fondo -->
    <img
        src="${imagenBanner}"
        class="absolute inset-0 w-full h-full object-cover blur-md scale-110">

    <div class="absolute inset-0 bg-black/40"></div>

    <!-- Imagen completa -->
    <img
        src="${imagenBanner}"
        class="relative z-10 w-full h-full object-contain">

`;

    actualizarDots();
}
        // Touch swipe
        banner.addEventListener("touchstart", e => startX = e.touches[0].clientX);
        banner.addEventListener("touchend", e => {
            endX = e.changedTouches[0].clientX;
            const diferencia = startX - endX;

            if (diferencia > 50) indice = (indice + 1) % eventos.length;
            if (diferencia < -50) indice = (indice - 1 + eventos.length) % eventos.length;

            mostrarEvento();
        });

        // Dots
        indicadores.innerHTML = eventos.map((_, i) => `
<button
    class="dot w-4 h-4 rounded-full bg-white/40 border border-white transition-all duration-300"
    data-index="${i}">
</button>
`).join("");
document
.getElementById("prevBanner")
.addEventListener("click", () => {

    indice--;

    if (indice < 0) {
        indice = eventos.length - 1;
    }

    mostrarEvento();

});

document
.getElementById("nextBanner")
.addEventListener("click", () => {

    indice++;

    if (indice >= eventos.length) {
        indice = 0;
    }

    mostrarEvento();

});

        // Click en dots
        document.querySelectorAll(".dot").forEach(dot => {
            dot.addEventListener("click", () => {
                indice = parseInt(dot.dataset.index);
                mostrarEvento();
            });
        });

        mostrarEvento();

        // Auto slide
        setInterval(() => {
            indice = (indice + 1) % eventos.length;
            mostrarEvento();
        }, 5000);

    } catch (error) {
        console.error("Error en banner:", error);
    }
}

// ==================== CARTELERA ====================
function fechaEspanol(fechaTexto) {
    const fecha = new Date(fechaTexto);
    return fecha.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });
}

async function cargarCartelera() {
    try {
        const contenedor = document.getElementById("carteleraContainer");
        contenedor.innerHTML = ""; // Limpiar antes de agregar

        const snapshot = await getDocs(collection(db, "eventos"));
        const hoy = new Date();
        const inicioSemana = new Date(hoy);
        inicioSemana.setDate(hoy.getDate() - hoy.getDay() + 1);
        inicioSemana.setHours(0, 0, 0, 0);

        const finSemana = new Date(inicioSemana);
        finSemana.setDate(inicioSemana.getDate() + 6);

        let html = "";

        snapshot.forEach(doc => {
            const evento = doc.data();
            const fechaEvento = new Date(evento.fecha);

            if (fechaEvento >= inicioSemana && fechaEvento <= finSemana) {
                html += `
<div class="backdrop-blur-md bg-black/60 border border-purple-500/30
            rounded-2xl overflow-hidden shadow-2xl
            hover:scale-105 transition duration-300">

    <img
        src="${evento.bannerMovil || evento.imagen}"
        class="w-full h-96 object-cover">

    <div class="p-5 text-center">

        <p class="text-pink-400 uppercase text-sm tracking-widest">
            Próximo Evento
        </p>

        <h3 class="text-white text-3xl font-extrabold mt-2">
            ${evento.titulo}
        </h3>

        <p class="text-yellow-400 mt-3 text-lg">
            📅 ${fechaEspanol(evento.fecha)}
        </p>

        <p class="text-gray-300 mt-4">
            ${evento.descripcion || ""}
        </p>

    </div>

</div>
`;
            }
        });

        contenedor.innerHTML = html || "<p class='col-span-3 text-center text-gray-400'>No hay eventos esta semana</p>";

    } catch (error) {
        console.error("Error en cartelera:", error);
        document.getElementById("carteleraContainer").innerHTML = 
            "<p class='text-red-500'>Error al cargar la cartelera</p>";
    }
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener("DOMContentLoaded", async () => {
    console.log("✅ Página cargada");

    await Promise.all([
        cargarVideos(),
        cargarBanner(),
        cargarCartelera()
    ]);

    ocultarLoader();

    // Menú móvil
    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");

    menuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
        menuBtn.innerHTML = mobileMenu.classList.contains("hidden") ? "☰" : "✕";
    });

    document.querySelectorAll(".movil").forEach(link => {
        link.addEventListener("click", () => mobileMenu.classList.add("hidden"));
    });

 });   
async function cargarVideos() {

    const contenedor =
        document.getElementById(
            "videosContainer"
        );

    const snapshot =
        await getDocs(
            collection(db, "videos")
        );

    contenedor.innerHTML = "";

    snapshot.forEach(doc => {

        const video =
            doc.data();

        contenedor.innerHTML += `
        
        <div
            class="bg-white rounded-xl shadow-lg overflow-hidden">

            <iframe
                src="${video.url}"
                class="w-full h-48"
                allowfullscreen>
            </iframe>

            <div class="p-3">

                <h3 class="font-bold">
                    ${video.titulo}
                </h3>

            </div>

        </div>
        `;
    });

}
async function cargarGaleria() {

    const contenedor =
        document.getElementById(
            "galeriaContainer"
        );

    const snapshot =
        await getDocs(
            collection(db, "galeria")
        );

    contenedor.innerHTML = "";

    snapshot.forEach(doc => {

        const foto =
            doc.data();

        contenedor.innerHTML += `
        
        <div class="mb-4 break-inside-avoid">

            <img
                src="${foto.imagen}"
                alt="${foto.titulo}"
                class="w-full rounded-xl shadow-lg hover:scale-105 transition duration-300 cursor-pointer">

        </div>
        `;
    });

}
await cargarGaleria();
document.addEventListener("click", e => {

    if (e.target.tagName === "IMG") {

        document
            .getElementById("modal")
            .classList.remove("hidden");

        document
            .getElementById("modalImg")
            .src = e.target.src;

    }

});
const modal =
    document.getElementById("modal");

modal.addEventListener("click", (e) => {

    if (e.target === modal) {

        modal.classList.add("hidden");

    }

});
const imagenesNosotros = [
    "assets/Logo.jpg",
    "assets/logonav.png",
    "assets/logonav2.png"
];

let indiceNosotros = 0;

setInterval(() => {

    indiceNosotros++;

    if (
        indiceNosotros >=
        imagenesNosotros.length
    ) {

        indiceNosotros = 0;

    }

    document.getElementById(
        "imagenNosotros"
    ).src =
        imagenesNosotros[
            indiceNosotros
        ];

}, 4000);
document
.getElementById("btnWhatsapp")
.addEventListener("click", () => {

    const nombre =
        document.getElementById("nombre").value;

    const telefono =
        document.getElementById("telefono").value;

    const mensaje =
        document.getElementById("mensaje").value;

    const texto = encodeURIComponent(
`Hola, soy ${nombre}

Teléfono: ${telefono}

Mensaje:
${mensaje}`
    );

    window.open(
        `https://wa.me/${whatsapp}?text=${texto}`,
        "_blank"
    );

});
document
.getElementById("btnCorreo")
.addEventListener("click", () => {

    const nombre =
        document.getElementById("nombre").value;

    const telefono =
        document.getElementById("telefono").value;

    const mensaje =
        document.getElementById("mensaje").value;

    window.location.href =
`mailto:${correo}?subject=Consulta desde la web&body=Nombre: ${nombre}%0ATeléfono: ${telefono}%0A%0A${mensaje}`;

});
const topBar = document.getElementById("topBar");
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {

    // SOLO EN PC
    if (window.innerWidth >= 768) {

        if (window.scrollY > 20) {

            // Ocultar barra superior
            topBar.style.transform = "translateY(-100%)";

            // Subir navbar
            navbar.style.top = "0";

            // Fondo sólido
            navbar.classList.remove(
                "bg-black/20",
                "backdrop-blur-sm"
            );

            navbar.classList.add(
                "bg-black"
            );

        } else {

            // Mostrar barra superior
            topBar.style.transform = "translateY(0)";

            // Dejar espacio para topBar
            navbar.style.top = "28px";

            // Transparente con blur
            navbar.classList.remove(
                "bg-black"
            );

            navbar.classList.add(
                "bg-black/20",
                "backdrop-blur-sm"
            );

        }

    } else {

        // MÓVIL
        topBar.style.transform = "translateY(0)";
        navbar.style.top = "0";

        navbar.classList.remove(
            "bg-black/20",
            "backdrop-blur-sm"
        );

        navbar.classList.add(
            "bg-black"
        );

    }

});
let clicksAdmin = 0;

document
.getElementById("adminAccess")
.addEventListener("click", () => {

    clicksAdmin++;

    if (clicksAdmin >= 5) {

        window.location.href =
            "/admin/login.html";

    }

});