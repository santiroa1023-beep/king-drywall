
/* ========================================
   1. CONFIGURACIÓN GENERAL
======================================== */

const $ = (selector) => document.querySelector(selector);

const USERS = "kd-demo-users";
const SESSION = "kd-demo-session";

const SOCIAL_LINKS = {
    facebook: "https://www.facebook.com/profile.php?id=61584960767380",
    instagram: "https://www.instagram.com/king_drywall_/",
    whatsapp: "https://wa.me/525518166701"
};

/* ========================================
   2. FUNCIONES GENERALES
======================================== */

function read(key, defaultValue = []) {
    try {
        return JSON.parse(localStorage.getItem(key)) ?? defaultValue;
    } catch {
        return defaultValue;
    }
}

function showMessage(selector, text, type = "error") {
    const element = $(selector);

    if (!element) return;

    element.textContent = text;
    element.className = `msg ${type}`;
}

function showAuthView(view) {
    $("#login").hidden = view !== "login";
    $("#register").hidden = view !== "register";

    $("#loginMsg").className = "msg";
    $("#registerMsg").className = "msg";
}

/* ========================================
   3. SESIÓN E INGRESO A LA APLICACIÓN
======================================== */

function saveSession(user) {
    localStorage.setItem(
        SESSION,
        JSON.stringify({
            email: user.email,
            name: user.name,
            phone: user.phone || ""
        })
    );
}

function enterApplication(user) {
    saveSession(user);
    window.location.href = "pages/inicio.html";
}

/* ========================================
   4. REDES SOCIALES
======================================== */

function initializeAuthSocialFooter() {
    // Evita duplicar el pie de página.
    if (document.querySelector(".social-footer-auth")) return;

    const footer = document.createElement("footer");

    footer.className = "social-footer-auth";

    footer.innerHTML = `
        <div class="social-footer-content">

            <p class="social-footer-copy">
                King Drywall · Soluciones profesionales para tus espacios.
            </p>

            <div class="social-footer-right">

                <p class="social-footer-title">
                    Síguenos y contacta con nosotros
                </p>

                <div
                    class="social-links"
                    aria-label="Redes sociales de King Drywall"
                >

                    <a
                        class="social-button social-facebook"
                        href="${SOCIAL_LINKS.facebook}"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Visitar Facebook de King Drywall"
                    >
                        <span class="social-icon" aria-hidden="true">f</span>
                        Facebook
                    </a>

                    <a
                        class="social-button social-instagram"
                        href="${SOCIAL_LINKS.instagram}"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Visitar Instagram de King Drywall"
                    >
                        <span class="social-icon" aria-hidden="true"></span>
                        Instagram
                    </a>

                    <a
                        class="social-button social-whatsapp"
                        href="${SOCIAL_LINKS.whatsapp}"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Contactar a King Drywall por WhatsApp"
                    >
                        <span class="social-icon" aria-hidden="true">✆</span>
                        WhatsApp
                    </a>

                </div>
            </div>
        </div>
    `;

    document.body.appendChild(footer);
}

/* ========================================
   5. CAMBIAR ENTRE LOGIN Y REGISTRO
======================================== */

$("#toRegister")?.addEventListener("click", (event) => {
    event.preventDefault();
    showAuthView("register");
});

$("#toLogin")?.addEventListener("click", (event) => {
    event.preventDefault();
    showAuthView("login");
});

/* ========================================
   6. REGISTRO DE USUARIOS
======================================== */

$("#registerForm")?.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = Object.fromEntries(
        new FormData(event.currentTarget)
    );

    const users = read(USERS);
    const email = data.email.trim().toLowerCase();

    if (data.pass !== data.confirm) {
        showMessage(
            "#registerMsg",
            "Las contraseñas no coinciden."
        );
        return;
    }

    if (users.some((user) => user.email === email)) {
        showMessage(
            "#registerMsg",
            "Ya existe una cuenta con ese correo. Inicia sesión."
        );
        return;
    }

    const user = {
        name: data.name.trim(),
        email,
        phone: (data.phone || "").trim(),
        pass: data.pass
    };

    users.push(user);

    localStorage.setItem(
        USERS,
        JSON.stringify(users)
    );

    showMessage(
        "#registerMsg",
        "Cuenta creada. Abriendo la aplicación…",
        "success"
    );

    window.setTimeout(() => {
        enterApplication(user);
    }, 350);
});

/* ========================================
   7. INICIO DE SESIÓN
======================================== */

$("#loginForm")?.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = Object.fromEntries(
        new FormData(event.currentTarget)
    );

    const email = data.email.trim().toLowerCase();

    const user = read(USERS).find(
        (item) => item.email === email
    );

    if (!user) {
        showMessage(
            "#loginMsg",
            "No encontramos una cuenta con ese correo. Regístrate para continuar."
        );
        return;
    }

    if (user.pass !== data.pass) {
        showMessage(
            "#loginMsg",
            "La contraseña es incorrecta."
        );
        return;
    }

    enterApplication(user);
});

/* ========================================
   8. INICIALIZACIÓN
======================================== */

// Si ya hay una sesión, entra directamente.
const currentSession = read(SESSION, null);

if (currentSession?.email) {
    window.location.replace("pages/inicio.html");
} else {
    initializeAuthSocialFooter();
}




/* ========================================
   REGISTRO DEL SERVICE WORKER
======================================== */

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("./service-worker.js")
            .then((registration) => {
                console.log(
                    "Service Worker registrado:",
                    registration.scope
                );
            })
            .catch((error) => {
                console.error(
                    "Error al registrar el Service Worker:",
                    error
                );
            });
    });
}