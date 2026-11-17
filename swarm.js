// ========================================
// SWARM REBUILD ANIMATION (SCROLL + AUTO PLAY/STOP TOGGLE)
// ========================================

(function () {
    // 1. Suntikkan CSS khusus Swarm
    const swarmStyles = document.createElement("style");
    swarmStyles.textContent = `
        /* State awal elemen sebelum dibangun */
        .swarm-hidden {
            opacity: 0 !important;
        }

        /* Garis kerangka biru sesuai tema portofolio (#38bdf8) */
        .swarm-active {
            opacity: 1 !important;
            outline: 1.5px solid #38bdf8;
            outline-offset: 3px;
            background-color: rgba(56, 189, 248, 0.05);
            overflow: hidden;
        }

        /* State selesai dibangun */
        .swarm-done {
            opacity: 1 !important;
            outline: none;
            transition: background-color 0.4s ease;
        }

        /* Efek kursor ketik (caret) */
        .typing-caret::after {
            content: "|";
            color: #38bdf8;
            font-weight: bold;
            animation: swarmBlink 0.6s infinite;
        }
        @keyframes swarmBlink {
            50% { opacity: 0; }
        }

        /* Desain Kursor Multiplayer */
        .swarm-cursor {
            position: fixed;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 99999;
            opacity: 0;
            transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
        }
        .swarm-cursor-label {
            position: absolute;
            left: 14px;
            top: 14px;
            color: #ffffff;
            font-size: 11px;
            font-weight: 600;
            padding: 2px 9px;
            border-radius: 99px;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
            font-family: Arial, sans-serif;
        }
        .swarm-cursor.clicking svg {
            transform: scale(0.8);
            transition: transform 0.1s;
        }

        /* Wadah Tombol Kontrol di pojok kanan bawah */
        .swarm-controls {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 99998;
            display: flex;
            gap: 10px;
        }

        .swarm-btn {
            background: rgba(30, 41, 59, 0.9);
            color: #38bdf8;
            border: 1px solid #38bdf8;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: bold;
            cursor: pointer;
            backdrop-filter: blur(6px);
            transition: 0.3s;
            font-family: Arial, sans-serif;
        }
        .swarm-btn:hover {
            background: #38bdf8;
            color: #0f172a;
        }

        .swarm-btn-auto {
            background: #38bdf8;
            color: #0f172a;
        }
        .swarm-btn-auto:hover {
            background: #0ea5e9;
            border-color: #0ea5e9;
        }
        .swarm-btn-auto.is-playing {
            background: #f43f5e;
            border-color: #f43f5e;
            color: #ffffff;
        }
        .swarm-btn-auto.is-playing:hover {
            background: #e11d48;
            border-color: #e11d48;
        }

        @media (max-width: 500px) {
            .swarm-controls {
                bottom: 14px;
                right: 14px;
                gap: 8px;
            }
            .swarm-btn {
                padding: 7px 12px;
                font-size: 12px;
            }
        }
    `;
    document.head.appendChild(swarmStyles);

    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
    let isSkipped = false;
    let isAutoPlay = false;
    let isProcessing = false;
    let cursorTurn = 0;
    let remainingCount = 0;
    const buildQueue = [];

    // 2. Agen Kursor
    const agents = [
        { name: "DCA · Designer", color: "#38bdf8" },
        { name: "DCA · Developer", color: "#10b981" },
        { name: "DCA · Creator", color: "#f43f5e" }
    ];

    const cursors = agents.map((agent) => {
        const el = document.createElement("div");
        el.className = "swarm-cursor";
        el.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${agent.color}">
                <path d="M4 2L20 10.5L12.5 13L9.5 20.5L4 2Z" stroke="#0f172a" stroke-width="1.5"/>
            </svg>
            <div class="swarm-cursor-label" style="background:${agent.color}; ${agent.color === '#38bdf8' ? 'color:#0f172a;' : ''}">${agent.name}</div>
        `;
        el.style.transform = `translate(${Math.random() * window.innerWidth}px, ${window.innerHeight}px)`;
        document.body.appendChild(el);
        return el;
    });

    // Buat Wadah & Tombol Auto Play / Stop + Skip Build
    const controlsBox = document.createElement("div");
    controlsBox.className = "swarm-controls";

    const autoBtn = document.createElement("button");
    autoBtn.className = "swarm-btn swarm-btn-auto";
    autoBtn.textContent = "Auto Play ▶";

    const skipBtn = document.createElement("button");
    skipBtn.className = "swarm-btn";
    skipBtn.textContent = "Skip Build ⏭";

    controlsBox.appendChild(autoBtn);
    controlsBox.appendChild(skipBtn);
    document.body.appendChild(controlsBox);

    function moveCursor(cursor, x, y) {
        cursor.style.opacity = "1";
        cursor.style.transform = `translate(${x}px, ${y}px)`;
    }

    function hideCursors() {
        cursors.forEach((c) => {
            c.style.opacity = "0";
            c.classList.remove("clicking");
        });
    }

    // 3. Animasi Membangun Teks
    async function buildText(el, cursor) {
        if (isSkipped) return;

        const originalHTML = el.dataset.originalHtml;
        const plainText = el.dataset.plainText;
        const rect = el.getBoundingClientRect();

        const prevDisplay = el.style.display;
        if (getComputedStyle(el).display === "inline") {
            el.style.display = "inline-block";
        }

        el.textContent = "";
        el.style.width = "0px";
        el.style.height = "0px";
        el.classList.remove("swarm-hidden");

        moveCursor(cursor, rect.left, rect.top);
        await sleep(280);
        if (isSkipped) return restoreElement(el);

        cursor.classList.add("clicking");
        el.classList.add("swarm-active");
        await sleep(70);

        el.style.transition = "width 0.35s cubic-bezier(0.22, 1, 0.36, 1), height 0.35s cubic-bezier(0.22, 1, 0.36, 1)";
        el.style.width = rect.width + "px";
        el.style.height = rect.height + "px";
        moveCursor(cursor, rect.right, rect.bottom);
        await sleep(370);
        if (isSkipped) return restoreElement(el);

        cursor.classList.remove("clicking");
        el.style.transition = "none";
        el.style.height = "auto";
        el.style.minHeight = rect.height + "px";
        el.classList.add("typing-caret");

        const step = plainText.length > 120 ? 5 : plainText.length > 50 ? 2 : 1;
        const delay = plainText.length > 120 ? 8 : 14;

        for (let i = 0; i < plainText.length; i += step) {
            if (isSkipped) break;
            el.textContent = plainText.slice(0, i + step);
            await sleep(delay);
        }

        el.innerHTML = originalHTML;
        el.style.width = "";
        el.style.height = "";
        el.style.minHeight = "";
        el.style.display = prevDisplay;
        el.classList.remove("typing-caret", "swarm-active");
        el.classList.add("swarm-done");
    }

    // 4. Animasi Membangun Kotak / Gambar / Card
    async function buildBox(el, cursor) {
        if (isSkipped) return;

        const rect = el.getBoundingClientRect();
        const img = el.querySelector("img");

        if (img && el.classList.contains("profile")) {
            img.style.width = rect.width + "px";
            img.style.height = rect.height + "px";
        }

        el.style.width = "0px";
        el.style.height = "0px";
        el.classList.remove("swarm-hidden");

        moveCursor(cursor, rect.left, rect.top);
        await sleep(280);
        if (isSkipped) return restoreElement(el);

        cursor.classList.add("clicking");
        el.classList.add("swarm-active");
        await sleep(70);

        el.style.transition = "width 0.4s cubic-bezier(0.22, 1, 0.36, 1), height 0.4s cubic-bezier(0.22, 1, 0.36, 1)";
        el.style.width = rect.width + "px";
        el.style.height = rect.height + "px";
        moveCursor(cursor, rect.right, rect.bottom);
        await sleep(420);
        if (isSkipped) return restoreElement(el);

        cursor.classList.remove("clicking");
        el.style.transition = "none";
        el.style.width = "";
        el.style.height = "";
        if (img && el.classList.contains("profile")) {
            img.style.width = "";
            img.style.height = "";
        }

        el.classList.remove("swarm-active");
        el.classList.add("swarm-done");
    }

    function restoreElement(el) {
        if (el.dataset.originalHtml !== undefined) {
            el.innerHTML = el.dataset.originalHtml;
        }
        el.style.width = "";
        el.style.height = "";
        el.style.minHeight = "";
        el.style.display = "";
        const img = el.querySelector("img");
        if (img) {
            img.style.width = "";
            img.style.height = "";
        }
        el.classList.remove("swarm-hidden", "swarm-active", "typing-caret");
        el.classList.add("swarm-done");
    }

    // 5. Pemroses Antrean
    async function processQueue() {
        if (isProcessing || isSkipped) return;
        isProcessing = true;

        while (buildQueue.length > 0 && !isSkipped) {
            const item = buildQueue.shift();
            const { el, type } = item;

            if (el.dataset.swarmBuilt === "true") continue;
            el.dataset.swarmBuilt = "true";

            // Jika mode Auto Play aktif, scroll layar otomatis mengikuti elemen
            if (isAutoPlay) {
                const rect = el.getBoundingClientRect();
                const isOutOfView = rect.top < 90 || rect.bottom > window.innerHeight - 50;
                if (isOutOfView) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                    await sleep(320);
                }
            }

            // Cek ulang jika user menekan Stop atau Skip saat jeda scroll
            if (isSkipped) break;
            if (!isAutoPlay && item.fromAutoPlay) {
                el.dataset.swarmBuilt = "false";
                el.dataset.queued = "false";
                continue;
            }

            const cursor = cursors[cursorTurn % cursors.length];
            cursorTurn++;

            if (type === "text") {
                await buildText(el, cursor);
            } else {
                await buildBox(el, cursor);
            }

            remainingCount--;
        }

        isProcessing = false;

        if (!isSkipped) {
            hideCursors();
            if (remainingCount <= 0 && controlsBox.parentNode) {
                controlsBox.remove();
            }
        }
    }

    // 6. Kumpulkan target elemen dari portofolio
    function collectTargets() {
        const targets = [];

        const heroEls = [
            { sel: ".hero-text h3", type: "text" },
            { sel: ".hero-text h1", type: "text" },
            { sel: ".hero-text h2", type: "text" },
            { sel: ".hero-text p", type: "text" },
            { sel: ".profile", type: "box" },
            { sel: ".hero-text .buttons", type: "box" }
        ];

        heroEls.forEach((item) => {
            const el = document.querySelector(item.sel);
            if (el) targets.push({ el, type: item.type });
        });

        const sections = [
            "#about",
            "#skills",
            "#experience",
            "#projects",
            "#youtube",
            "#achievements",
            "#certificates",
            "#contact"
        ];

        sections.forEach((secId) => {
            const sec = document.querySelector(secId);
            if (!sec) return;

            const title = sec.querySelector(".section-title h2");
            if (title) targets.push({ el: title, type: "text" });

            if (secId === "#about") {
                sec.querySelectorAll(".about-content p").forEach((p) => {
                    targets.push({ el: p, type: "text" });
                });
            } else if (secId === "#skills") {
                sec.querySelectorAll(".skill").forEach((card) => {
                    targets.push({ el: card, type: "box" });
                });
            } else if (secId === "#experience") {
                sec.querySelectorAll(".timeline-item").forEach((item) => {
                    targets.push({ el: item, type: "box" });
                });
            } else if (secId === "#projects") {
                sec.querySelectorAll(".project").forEach((card) => {
                    targets.push({ el: card, type: "box" });
                });
            } else if (secId === "#youtube") {
                const ytCard = sec.querySelector(".youtube-card");
                if (ytCard) targets.push({ el: ytCard, type: "box" });
            } else if (secId === "#achievements") {
                sec.querySelectorAll(".achievement").forEach((item) => {
                    targets.push({ el: item, type: "box" });
                });
            } else if (secId === "#certificates") {
                sec.querySelectorAll(".certificate").forEach((card) => {
                    targets.push({ el: card, type: "box" });
                });
            } else if (secId === "#contact") {
                const contactBox = sec.querySelector(".contact");
                if (contactBox) targets.push({ el: contactBox, type: "box" });
            }
        });

        return targets;
    }

    // 7. Inisialisasi Scroll Observer & Tombol Kontrol
    function initPortfolioSwarm() {
        const targets = collectTargets();
        remainingCount = targets.length;
        const targetMap = new Map();

        targets.forEach((item, index) => {
            const { el, type } = item;
            if (type === "text") {
                el.dataset.originalHtml = el.innerHTML.trim();
                el.dataset.plainText = el.textContent.replace(/\s+/g, " ").trim();
            }
            el.classList.add("swarm-hidden");
            targetMap.set(el, { ...item, index });
        });

        // Pantau elemen yang masuk layar saat scroll manual
        const observer = new IntersectionObserver(
            (entries) => {
                if (isSkipped || isAutoPlay) return;

                const newlyVisible = entries
                    .filter((entry) => entry.isIntersecting)
                    .map((entry) => targetMap.get(entry.target))
                    .filter((item) => item && item.el.dataset.queued !== "true")
                    .sort((a, b) => a.index - b.index);

                newlyVisible.forEach((item) => {
                    item.el.dataset.queued = "true";
                    observer.unobserve(item.el);
                    buildQueue.push({ ...item, fromAutoPlay: false });
                });

                if (buildQueue.length > 0) {
                    processQueue();
                }
            },
            {
                root: null,
                threshold: 0.12
            }
        );

        targets.forEach(({ el }) => observer.observe(el));

        // Aksi Toggle Tombol Auto Play / Stop
        autoBtn.addEventListener("click", () => {
            if (isSkipped) return;

            if (!isAutoPlay) {
                // MULAI AUTO PLAY
                isAutoPlay = true;
                observer.disconnect();

                autoBtn.textContent = "Stop Auto ⏹";
                autoBtn.classList.add("is-playing");

                // Masukkan semua elemen yang belum dibangun ke antrean
                targets.forEach((item) => {
                    if (item.el.dataset.queued !== "true" && item.el.dataset.swarmBuilt !== "true") {
                        item.el.dataset.queued = "true";
                        buildQueue.push({ ...item, fromAutoPlay: true });
                    }
                });

                processQueue();
            } else {
                // BERHENTI (STOP AUTO PLAY) & KEMBALI KE MODE SCROLL MANUAL
                isAutoPlay = false;

                autoBtn.textContent = "Auto Play ▶";
                autoBtn.classList.remove("is-playing");

                // Hapus sisa antrean yang berasal dari Auto Play dan belum sempat dibangun
                for (let i = buildQueue.length - 1; i >= 0; i--) {
                    const queuedItem = buildQueue[i];
                    if (queuedItem.el.dataset.swarmBuilt !== "true") {
                        queuedItem.el.dataset.queued = "false";
                        buildQueue.splice(i, 1);
                    }
                }

                // Aktifkan kembali pantauan scroll manual untuk elemen yang tersisa
                targets.forEach(({ el }) => {
                    if (el.dataset.swarmBuilt !== "true") {
                        observer.observe(el);
                    }
                });
            }
        });

        // Aksi Tombol Skip Build
        skipBtn.addEventListener("click", () => {
            isSkipped = true;
            isAutoPlay = false;
            observer.disconnect();
            buildQueue.length = 0;
            targets.forEach(({ el }) => restoreElement(el));
            hideCursors();
            if (controlsBox.parentNode) controlsBox.remove();
        });
    }

    window.addEventListener("load", initPortfolioSwarm);
})();