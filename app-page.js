/* ========================================
   1. CONFIGURACIÓN GENERAL
======================================== */

const $ = (selector) => document.querySelector(selector);

const SESSION = "kd-demo-session";
const REQUESTS = "kd-demo-requests";
const LOGO_PATH = "../assets/logo.jpeg";

const QUOTE_EMAIL = "santiroa1023@gmail.com";
const QUOTE_WHATSAPP = "525518166701";

// Configuración de EmailJS: utiliza únicamente la Public Key.
const EMAILJS_SERVICE_ID = "san_S_roa";
const EMAILJS_TEMPLATE_ID = "template_8ouant9";
const EMAILJS_PUBLIC_KEY = "4ido0Zcq5v4-N67eD";

if (window.emailjs) {
    window.emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY
    });
}

const SOCIAL_LINKS = {
    facebook: "https://www.facebook.com/profile.php?id=61584960767380",
    instagram: "https://www.instagram.com/king_drywall_/",
    whatsapp: "https://wa.me/525518166701"
};

/* ========================================
   2. FUNCIONES GENERALES
======================================== */

function read(key, defaultValue = null) {
    try {
        const value = localStorage.getItem(key);

        if (value === null) {
            return defaultValue;
        }

        return JSON.parse(value);
    } catch (error) {
        console.error(`Error leyendo ${key}:`, error);
        return defaultValue;
    }
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function showMessage(selector, message, type = "error") {
    const element = $(selector);

    if (!element) {
        return;
    }

    element.textContent = message;
    element.className = `msg ${type}`;
}

function getSession() {
    const session = read(SESSION, null);

    if (!session || !session.email) {
        window.location.replace("../index.html");
        return null;
    }

    return session;
}

function getRequests() {
    const requests = read(REQUESTS, []);

    if (!Array.isArray(requests)) {
        console.error("El almacenamiento de solicitudes no contiene una lista.");
        return [];
    }

    return requests;
}

function saveRequests(requests) {
    localStorage.setItem(REQUESTS, JSON.stringify(requests));
}

/* ========================================
   3. LOGOTIPO
======================================== */

function initializeLogo() {
    const header = $("header");

    if (!header) {
        return;
    }

    const logoMark = [...header.querySelectorAll("*")].find((element) => {
        return (
            element.children.length === 0 &&
            element.textContent.trim() === "KD"
        );
    });

    if (!logoMark) {
        return;
    }

    const image = document.createElement("img");

    image.src = LOGO_PATH;
    image.alt = "Logo de King Drywall";
    image.style.width = "100%";
    image.style.height = "100%";
    image.style.objectFit = "contain";
    image.style.display = "block";

    image.onerror = () => {
        image.remove();
        logoMark.textContent = "KD";
    };

    logoMark.replaceChildren(image);

    Object.assign(logoMark.style, {
        width: "48px",
        height: "48px",
        padding: "2px",
        boxSizing: "border-box",
        background: "#ffffff",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: "0"
    });
}

/* ========================================
   4. NAVEGACIÓN Y SESIÓN
======================================== */

function setActiveNavigation() {
    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll("[data-page]").forEach((link) => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }
    });
}

function initializeHeader(session) {
    const userName = $("#userName");

    if (userName) {
        userName.textContent = session.name || session.email;
    }

    const hamburger = $("#hamb");
    const navigation = $("#nav");

    hamburger?.addEventListener("click", () => {
        if (!navigation) {
            return;
        }

        const isOpen = navigation.classList.toggle("open");

        hamburger.setAttribute("aria-expanded", String(isOpen));
        hamburger.setAttribute(
            "aria-label",
            isOpen ? "Cerrar menú" : "Abrir menú"
        );
    });

    navigation?.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
            navigation.classList.remove("open");

            hamburger?.setAttribute("aria-expanded", "false");
            hamburger?.setAttribute("aria-label", "Abrir menú");
        }
    });

    $("#logout")?.addEventListener("click", () => {
        localStorage.removeItem(SESSION);
        window.location.replace("../index.html");
    });

    setActiveNavigation();
}

/* ========================================
   5. PIE DE PÁGINA Y REDES SOCIALES
======================================== */

function renderSocialFooter() {
    const footer = $("footer");

    if (!footer) {
        return;
    }

    if (footer.querySelector(".social-footer-content")) {
        return;
    }

    footer.innerHTML = `
        <div class="social-footer-content">
            <p class="social-footer-copy">
                King Drywall · Soluciones profesionales para tus espacios.
            </p>

            <div class="social-footer-right">
                <p class="social-footer-title">
                    Síguenos y contacta con nosotros
                </p>

                <div class="social-links">
                    <a
                        class="social-button social-facebook"
                        href="${SOCIAL_LINKS.facebook}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span aria-hidden="true">f</span>
                        Facebook
                    </a>

                    <a
                        class="social-button social-instagram"
                        href="${SOCIAL_LINKS.instagram}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Instagram
                    </a>

                    <a
                        class="social-button social-whatsapp"
                        href="${SOCIAL_LINKS.whatsapp}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        WhatsApp
                    </a>
                </div>
            </div>
        </div>
    `;
}

/* ========================================
   6. CATÁLOGO DE SERVICIOS
======================================== */

const services = [
    {
        name: "Tablaroca",
        icon: "▤",
        description:
            "Muros divisorios, forros y soluciones interiores con panel de yeso."
    },
    {
        name: "Durock",
        icon: "▧",
        description:
            "Panel de cemento para espacios que requieren soluciones resistentes."
    },
    {
        name: "Plafones",
        icon: "▦",
        description:
            "Plafones corridos, reticulares y soluciones para techos."
    },
    {
        name: "Pintura y acabados",
        icon: "◒",
        description:
            "Preparación de superficies y aplicación de pintura."
    },
    {
        name: "Acabados interiores",
        icon: "◇",
        description:
            "Trabajos complementarios para espacios funcionales."
    },
    {
        name: "Proyectos industriales",
        icon: "⌂",
        description:
            "Soluciones para oficinas, locales y espacios industriales."
    }
];

function renderServices() {
    const grid = $("#serviceGrid");
    const select = $("#serviceSelect");

    if (grid) {
        grid.innerHTML = services.map((service) => `
            <article class="card">
                <div class="art" aria-hidden="true">
                    ${service.icon}
                </div>

                <div class="cardbody">
                    <h3>${escapeHTML(service.name)}</h3>
                    <p>${escapeHTML(service.description)}</p>

                    <a
                        class="service-link"
                        href="cotizar.html?servicio=${encodeURIComponent(service.name)}"
                    >
                        Cotizar este servicio →
                    </a>
                </div>
            </article>
        `).join("");
    }

    if (select) {
        const existingOptions = [...select.options].map(
            (option) => option.value
        );

        services.forEach((service) => {
            if (existingOptions.includes(service.name)) {
                return;
            }

            const option = document.createElement("option");

            option.value = service.name;
            option.textContent = service.name;

            select.appendChild(option);
        });

        const selectedService = new URLSearchParams(
            window.location.search
        ).get("servicio");

        if (services.some((service) => service.name === selectedService)) {
            select.value = selectedService;
        }
    }
}

/* ========================================
   7. MIS SOLICITUDES
======================================== */

function renderRequests(session) {
    const list = $("#requestsList") || $("#requestList");
    const totalElement = $("#totalRequests");
    const pendingElement = $("#pendingRequests");
    const otherElement = $("#otherRequests");

    if (!list) {
        console.warn("No se encontró el contenedor del historial.");
        return;
    }

    const normalizeEmail = (value) =>
        String(value || "").trim().toLowerCase();

    const sessionEmail = normalizeEmail(session?.email);

    if (!sessionEmail) {
        console.warn("No hay correo de sesión para filtrar solicitudes.");
        return;
    }

    const requests = getRequests()
        .filter((request) => {
            const ownerEmail = normalizeEmail(request.email);
            const contactEmail = normalizeEmail(request.contactEmail);

            return ownerEmail === sessionEmail ||
                (!ownerEmail && contactEmail === sessionEmail);
        })
        .sort((a, b) => {
            return new Date(b.created || 0) - new Date(a.created || 0);
        });

    const isPending = (request) => {
        const status = String(request.status || "")
            .trim()
            .toLowerCase();

        return status.includes("pendiente") ||
            status.includes("revisión") ||
            status.includes("revision");
    };

    const pendingCount = requests.filter(isPending).length;
    const otherCount = requests.length - pendingCount;

    if (totalElement) {
        totalElement.textContent = String(requests.length);
    }

    if (pendingElement) {
        pendingElement.textContent = String(pendingCount);
    }

    if (otherElement) {
        otherElement.textContent = String(otherCount);
    }

    if (requests.length === 0) {
        list.innerHTML = `
            <div class="empty">
                <h3>Todavía no tienes solicitudes</h3>
                <p>
                    Cuando registres una cotización, aparecerá aquí
                    para que puedas consultar sus detalles.
                </p>
                <a class="btn" href="cotizar.html">
                    Nueva cotización →
                </a>
            </div>
        `;

        return;
    }

    list.innerHTML = requests.map((request) => {
        const createdDate =
            request.created && !Number.isNaN(Date.parse(request.created))
                ? new Date(request.created).toLocaleDateString("es-MX")
                : "Fecha no disponible";

        const hasSurface =
            request.meters !== "" &&
            request.meters !== null &&
            request.meters !== undefined;

        const surface = hasSurface
            ? `<p>Superficie: ${escapeHTML(request.meters)} m²</p>`
            : "";

        return `
            <article class="request">
                <div class="request-details">
                    <b>
                        ${escapeHTML(request.service || "Servicio no especificado")}
                        · ${escapeHTML(request.id || "Sin folio")}
                    </b>

                    <p>
                        Ubicación:
                        ${escapeHTML(request.location || "No especificada")}
                    </p>

                    <p>
                        Fecha de registro:
                        ${escapeHTML(createdDate)}
                    </p>

                    <p>
                        Fecha deseada:
                        ${escapeHTML(request.date || "Sin fecha definida")}
                    </p>

                    ${surface}

                    <p>${escapeHTML(request.description || "")}</p>
                </div>

                <span class="status">
                    ${escapeHTML(request.status || "Pendiente")}
                </span>
            </article>
        `;
    }).join("");

    console.log(
        `King Drywall: ${requests.length} solicitud(es) mostrada(s).`
    );
}

/* ========================================
   8. FORMULARIO DE COTIZACIÓN
======================================== */

function initializeQuoteForm(session) {
    const form = $("#quoteForm");

    if (!form) {
        return;
    }

    const nameInput = $("#qName");
    const emailInput = $("#qEmail");
    const phoneInput = $("#qPhone");

    if (nameInput && !nameInput.value) {
        nameInput.value = session.name || "";
    }

    if (emailInput && !emailInput.value) {
        emailInput.value = session.email || "";
    }

    if (phoneInput && !phoneInput.value) {
        phoneInput.value = session.phone || "";
    }

    function createQuoteMessage(request) {
        return [
            "NUEVA SOLICITUD DE COTIZACIÓN",
            "KING DRYWALL",
            "",
            `Folio: ${request.id}`,
            `Nombre: ${request.name}`,
            `Correo del cliente: ${request.contactEmail || request.email}`,
            `Teléfono: ${request.phone}`,
            `Servicio: ${request.service}`,
            `Ubicación: ${request.location}`,
            `Superficie: ${request.meters ? `${request.meters} m²` : "No especificada"}`,
            `Fecha deseada: ${request.date || "No especificada"}`,
            "",
            "Descripción del proyecto:",
            request.description,
            "",
            `Fecha de registro: ${new Date(request.created).toLocaleString("es-MX")}`
        ].join("\n");
    }

    function showQuoteActions(request) {
        let actions = $("#quoteActions");

        if (!actions) {
            actions = document.createElement("section");
            actions.id = "quoteActions";
            actions.className = "quote-actions";
            actions.hidden = true;

            actions.innerHTML = `
                <p id="quoteActionsText" role="status"></p>

                <div class="quote-action-links">
                    <a id="sendEmail" class="btn" href="#">
                        Preparar correo →
                    </a>

                    <a
                        id="sendWhatsApp"
                        class="btn"
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Enviar por WhatsApp →
                    </a>
                </div>
            `;

            form.insertAdjacentElement("afterend", actions);
        }

        const actionsText = $("#quoteActionsText");
        const sendEmail = $("#sendEmail");
        const sendWhatsApp = $("#sendWhatsApp");

        const message = createQuoteMessage(request);
        const subject = `Cotización ${request.id} - King Drywall`;

        if (sendEmail) {
            sendEmail.href =
                `mailto:${QUOTE_EMAIL}` +
                `?subject=${encodeURIComponent(subject)}` +
                `&body=${encodeURIComponent(message)}`;
        }

        if (sendWhatsApp) {
            sendWhatsApp.href =
                `https://wa.me/${QUOTE_WHATSAPP}` +
                `?text=${encodeURIComponent(message)}`;
        }

        if (actionsText) {
            if (request.delivery?.email === "Enviado") {
                actionsText.textContent =
                    `La solicitud ${request.id} se envió por correo. También puedes compartirla por WhatsApp.`;
            } else if (!navigator.onLine) {
                actionsText.textContent =
                    `Solicitud ${request.id} guardada en este dispositivo. Cuando vuelva internet, podrás compartirla.`;
            } else if (request.delivery?.email === "Error") {
                actionsText.textContent =
                    `La solicitud ${request.id} está guardada, pero falló el correo. Puedes compartirla por correo manual o WhatsApp.`;
            } else {
                actionsText.textContent =
                    `Solicitud ${request.id} guardada. Elige un canal para compartirla.`;
            }
        }

        actions.hidden = false;
    }

    const savedRequests = getRequests();

    const lastRequest = savedRequests.find((request) => {
        return String(request.email || "").trim().toLowerCase() ===
            String(session.email || "").trim().toLowerCase();
    });

    if (lastRequest) {
        showQuoteActions(lastRequest);
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!form.reportValidity()) {
            return;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText =
            submitButton?.textContent || "Guardar solicitud →";

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Guardando y enviando...";
        }

        const formData = Object.fromEntries(new FormData(form));

        const request = {
            id: `KD-${Date.now().toString().slice(-8)}`,
            name: String(formData.name || "").trim(),
            email: String(session.email || "").trim().toLowerCase(),
            contactEmail: String(formData.email || "").trim(),
            phone: String(formData.phone || "").trim(),
            service: String(formData.service || "").trim(),
            location: String(formData.location || "").trim(),
            meters: formData.meters ? Number(formData.meters) : "",
            date: String(formData.date || ""),
            description: String(formData.description || "").trim(),
            status: "Pendiente de seguimiento",
            delivery: {
                email: "Pendiente",
                whatsapp: "Pendiente"
            },
            created: new Date().toISOString()
        };

        if (
            !request.name ||
            !request.email ||
            !request.contactEmail ||
            !request.phone ||
            !request.service ||
            !request.location ||
            request.description.length < 10
        ) {
            showMessage(
                "#quoteMsg",
                "Completa correctamente todos los campos obligatorios.",
                "error"
            );

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }

            return;
        }

        // Guardar primero: si falla el correo, la solicitud no se pierde.
        try {
            const requests = getRequests();

            requests.unshift(request);
            saveRequests(requests);

            const saved = getRequests().some(
                (item) => item.id === request.id
            );

            if (!saved) {
                throw new Error("No se pudo verificar el registro guardado.");
            }
        } catch (error) {
            console.error("Error guardando la cotización:", error);

            showMessage(
                "#quoteMsg",
                "No se pudo guardar la solicitud. Revisa el almacenamiento del navegador.",
                "error"
            );

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }

            return;
        }

        if (!navigator.onLine) {
            request.delivery.email = "Error";
            request.delivery.emailError = "No hay conexión a internet.";

            showMessage(
                "#quoteMsg",
                `La solicitud ${request.id} quedó guardada, pero necesitas conexión a internet para enviar el correo.`,
                "error"
            );
        } else if (!window.emailjs) {
            request.delivery.email = "Error";
            request.delivery.emailError = "La biblioteca EmailJS no se cargó.";

            showMessage(
                "#quoteMsg",
                `La solicitud ${request.id} quedó guardada, pero no se pudo cargar el servicio de correo.`,
                "error"
            );
        } else {
            try {
                await window.emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    {
                        folio: request.id,
                        nombre: request.name,
                        correo: request.contactEmail,
                        telefono: request.phone,
                        servicio: request.service,
                        ubicacion: request.location,
                        superficie: request.meters !== ""
                            ? `${request.meters} m²`
                            : "No especificada",
                        fecha: request.date || "No especificada",
                        descripcion: request.description,

                        // Variables de la plantilla predeterminada Contact Us.
                        name: request.name,
                        email: request.contactEmail,
                        title: request.id,
                        message: createQuoteMessage(request),
                        time: new Date(request.created).toLocaleString("es-MX")
                    }
                );

                request.delivery.email = "Enviado";
                request.status = "Correo enviado";

                showMessage(
                    "#quoteMsg",
                    `¡Cotización ${request.id} guardada y enviada por correo!`,
                    "success"
                );
            } catch (error) {
                console.error(
                    "Error enviando la cotización por EmailJS:",
                    error
                );

                request.delivery.email = "Error";
                request.delivery.emailError = String(
                    error?.text || error?.message || "Error de envío"
                );

                showMessage(
                    "#quoteMsg",
                    `La solicitud ${request.id} quedó guardada, pero el correo no se pudo enviar. Revisa Email History en EmailJS.`,
                    "error"
                );
            }
        }

        // Actualizar la solicitud guardada sin duplicarla.
        try {
            const requests = getRequests().map((item) =>
                item.id === request.id ? request : item
            );

            saveRequests(requests);
        } catch (error) {
            console.error(
                "No se pudo actualizar el estado del correo:",
                error
            );
        }

        showQuoteActions(request);
        renderRequests(session);

        form.reset();

        if (nameInput) {
            nameInput.value = session.name || "";
        }

        if (emailInput) {
            emailInput.value = session.email || "";
        }

        if (phoneInput) {
            phoneInput.value = session.phone || "";
        }

        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });

    window.addEventListener("online", () => {
        const actionsText = $("#quoteActionsText");

        if (actionsText) {
            actionsText.textContent =
                "Ya hay conexión. Puedes compartir la solicitud por correo o WhatsApp.";
        }
    });

    window.addEventListener("offline", () => {
        const actionsText = $("#quoteActionsText");

        if (actionsText) {
            actionsText.textContent =
                "Sin conexión. La solicitud permanece guardada en este dispositivo.";
        }
    });
}

/* ========================================
   9. INICIALIZACIÓN
======================================== */

function initializeApp() {
    const session = getSession();

    if (!session) {
        return;
    }

    initializeLogo();
    initializeHeader(session);
    renderServices();
    renderRequests(session);
    initializeQuoteForm(session);
    renderSocialFooter();
}

initializeApp();

/* ========================================
   10. SERVICE WORKER
======================================== */

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("../service-worker.js")
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
