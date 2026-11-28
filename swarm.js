// ========================================
// SWARM REBUILD ANIMATION (PARALLEL 3 CURSORS + VIEWPORT PRIORITY)
// ========================================

(function () {
    // 0. Paksa halaman kembali ke paling atas saat di-refresh
    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    window.addEventListener("beforeunload", () => {
        window.scrollTo(0, 0);
    });

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

        /* Efek kursor ketik (caret) di dalam teks */
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
            transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
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
            transition: left 0.2s ease, top 0.2s ease;
        }

        /* Transisi ikon panah vs ikon garis ketik (I-beam) */
        .swarm-cursor svg {
            position: absolute;
            top: 0;
            left: 0;
            transition: transform 0.18s ease, opacity 0.18s ease;
        }
        .swarm-cursor .cursor-ibeam {
            opacity: 0;
            transform: scale(0.5);
        }

        /* Saat mode mengetik aktif: panah hilang, garis ketik muncul */
        .swarm-cursor.is-typing .cursor-arrow {
            opacity: 0;
            transform: scale(0.5);
        }
        .swarm-cursor.is-typing .cursor-ibeam {
            opacity: 1;
            transform: scale(1);
            animation: ibeamPulse 0.7s infinite alternate;
        }
        .swarm-cursor.is-typing .swarm-cursor-label {
            left: 10px;
            top: 18px;
        }

        @keyframes ibeamPulse {
            0% { opacity: 1; }
            100% { opacity: 0.65; }
        }

        .swarm-cursor.clicking .cursor-arrow {
            transform: scale(0.8);
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
    let activeWorkers = 0;
    let isJumpingSection = false;
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
            <svg class="cursor-arrow" width="20" height="20" viewBox="0 0 24 24" fill="${agent.color}">
                <path d="M4 2L20 10.5L12.5 13L9.5 20.5L4 2Z" stroke="#0f172a" stroke-width="1.5"/>
            </svg>
            <svg class="cursor-ibeam" width="16" height="22" viewBox="0 0 16 22" fill="none">
                <path d="M4 2H12M4 20H12M8 2V20" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
                <path d="M4 2H12M4 20H12M8 2V20" stroke="${agent.color}" stroke-width="2" stroke-linecap="round"/>
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

    function setTypingCursor(cursor, typing) {
        if (typing) {
            cursor.classList.remove("clicking");
            cursor.classList.add("is-typing");
        } else {
            cursor.classList.remove("is-typing");
        }
    }

    function hideCursor(cursor) {
        cursor.style.opacity = "0";
        cursor.classList.remove("clicking", "is-typing");
    }

    function hideAllCursors() {
        cursors.forEach(hideCursor);
    }

    // Helper: Cek apakah elemen sedang tampil di layar saat ini
    function isInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < window.innerHeight;
    }

    // Helper: Ambil elemen-elemen tulisan di dalam sebuah kontainer/card
    function getInnerTextNodes(container) {
        return Array.from(
            container.querySelectorAll("h3, p, span, strong, a")
        ).filter((node) => {
            if (node.closest("h3, p, span, strong, a") !== node) return false;
            return node.textContent.trim().length > 0;
        });
    }

    // 3. Animasi Membangun Teks Mandiri (Judul / Hero)
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

        setTypingCursor(cursor, false);
        moveCursor(cursor, rect.left, rect.top);
        await sleep(250);
        if (isSkipped) return restoreElement(el);

        cursor.classList.add("clicking");
        el.classList.add("swarm-active");
        await sleep(60);

        el.style.transition = "width 0.32s cubic-bezier(0.22, 1, 0.36, 1), height 0.32s cubic-bezier(0.22, 1, 0.36, 1)";
        el.style.width = rect.width + "px";
        el.style.height = rect.height + "px";
        moveCursor(cursor, rect.right, rect.bottom);
        await sleep(340);
        if (isSkipped) return restoreElement(el);

        setTypingCursor(cursor, true);
        moveCursor(cursor, rect.left - 4, rect.top + 4);
        await sleep(160);

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

        setTypingCursor(cursor, false);

        el.innerHTML = originalHTML;
        el.style.width = "";
        el.style.height = "";
        el.style.minHeight = "";
        el.style.display = prevDisplay;
        el.classList.remove("typing-caret", "swarm-active");
        el.classList.add("swarm-done");
    }

    // 4. Animasi Membangun Kotak Tanpa Teks Ketik (Foto Profil / Tombol Hero)
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

        setTypingCursor(cursor, false);
        moveCursor(cursor, rect.left, rect.top);
        await sleep(250);
        if (isSkipped) return restoreElement(el);

        cursor.classList.add("clicking");
        el.classList.add("swarm-active");
        await sleep(60);

        el.style.transition = "width 0.38s cubic-bezier(0.22, 1, 0.36, 1), height 0.38s cubic-bezier(0.22, 1, 0.36, 1)";
        el.style.width = rect.width + "px";
        el.style.height = rect.height + "px";
        moveCursor(cursor, rect.right, rect.bottom);
        await sleep(400);
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

    // 5. Animasi Kontainer Muncul Dulu -> Kursor Berubah Jadi Garis Ketik -> Tulisannya Muncul
    async function buildCardWithText(card, cursor) {
        if (isSkipped) return;

        const textNodes = getInnerTextNodes(card);
        textNodes.forEach((node) => node.classList.add("swarm-hidden"));

        const rect = card.getBoundingClientRect();

        setTypingCursor(cursor, false);
        card.style.width = "0px";
        card.style.height = "0px";
        card.classList.remove("swarm-hidden");

        moveCursor(cursor, rect.left, rect.top);
        await sleep(240);
        if (isSkipped) return restoreElement(card);

        cursor.classList.add("clicking");
        card.classList.add("swarm-active");
        await sleep(60);

        card.style.transition = "width 0.36s cubic-bezier(0.22, 1, 0.36, 1), height 0.36s cubic-bezier(0.22, 1, 0.36, 1)";
        card.style.width = rect.width + "px";
        card.style.height = rect.height + "px";
        moveCursor(cursor, rect.right, rect.bottom);
        await sleep(380);
        if (isSkipped) return restoreElement(card);

        cursor.classList.remove("clicking");
        card.style.transition = "none";
        card.style.width = "";
        card.style.height = "";
        card.classList.remove("swarm-active");
        card.classList.add("swarm-done");

        for (const node of textNodes) {
            if (isSkipped) break;

            const nodeRect = node.getBoundingClientRect();
            const originalHTML = node.dataset.originalHtml;
            const plainText = node.dataset.plainText;

            moveCursor(cursor, nodeRect.left - 2, nodeRect.top);
            setTypingCursor(cursor, true);
            await sleep(160);
            if (isSkipped) break;

            node.textContent = "";
            node.classList.remove("swarm-hidden");
            node.classList.add("typing-caret");

            const step = plainText.length > 100 ? 6 : plainText.length > 40 ? 3 : 2;
            const delay = plainText.length > 100 ? 7 : 12;

            for (let i = 0; i < plainText.length; i += step) {
                if (isSkipped) break;
                node.textContent = plainText.slice(0, i + step);
                await sleep(delay);
            }

            node.innerHTML = originalHTML;
            node.classList.remove("typing-caret");
            node.classList.add("swarm-done");
        }

        setTypingCursor(cursor, false);

        if (isSkipped) {
            restoreElement(card);
        }
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

        el.querySelectorAll(".swarm-hidden, .typing-caret").forEach((child) => {
            if (child.dataset.originalHtml !== undefined) {
                child.innerHTML = child.dataset.originalHtml;
            }
            child.classList.remove("swarm-hidden", "typing-caret", "swarm-active");
            child.classList.add("swarm-done");
        });

        el.classList.remove("swarm-hidden", "swarm-active", "typing-caret");
        el.classList.add("swarm-done");
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
                    targets.push({ el: card, type: "card" });
                });
            } else if (secId === "#experience") {
                sec.querySelectorAll(".timeline-item").forEach((item) => {
                    targets.push({ el: item, type: "card" });
                });
            } else if (secId === "#projects") {
                sec.querySelectorAll(".project").forEach((card) => {
                    targets.push({ el: card, type: "card" });
                });
            } else if (secId === "#youtube") {
                const ytCard = sec.querySelector(".youtube-card");
                if (ytCard) targets.push({ el: ytCard, type: "card" });
            } else if (secId === "#achievements") {
                sec.querySelectorAll(".achievement").forEach((item) => {
                    targets.push({ el: item, type: "card" });
                });
            } else if (secId === "#certificates") {
                sec.querySelectorAll(".certificate").forEach((card) => {
                    targets.push({ el: card, type: "card" });
                });
            } else if (secId === "#contact") {
                const contactBox = sec.querySelector(".contact");
                if (contactBox) targets.push({ el: contactBox, type: "card" });
            }
        });

        return targets;
    }

    // 7. Inisialisasi Scroll Observer, Viewport Priority & Parallel Workers
    function initPortfolioSwarm() {
        const targets = collectTargets();
        remainingCount = targets.length;
        const targetMap = new Map();

        targets.forEach((item, index) => {
            const { el, type } = item;

            if (type === "text") {
                el.dataset.originalHtml = el.innerHTML.trim();
                el.dataset.plainText = el.textContent.replace(/\s+/g, " ").trim();
            } else if (type === "card") {
                const textNodes = getInnerTextNodes(el);
                textNodes.forEach((node) => {
                    node.dataset.originalHtml = node.innerHTML.trim();
                    node.dataset.plainText = node.textContent.replace(/\s+/g, " ").trim();
                    node.classList.add("swarm-hidden");
                });
            }

            el.classList.add("swarm-hidden");
            targetMap.set(el, { ...item, index });
        });

        const observer = new IntersectionObserver(
            (entries) => {
                if (isSkipped || isAutoPlay || isJumpingSection) return;

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
                    processQueueParallel();
                }
            },
            {
                root: null,
                threshold: 0.1
            }
        );

// Worker untuk tiap kursor agar bekerja secara paralel
        async function runCursorWorker(cursor, workerIndex) {
            while (!isSkipped) {
                // Jika antrean kosong sementara:
                // tunggu sebentar jika worker lain masih jalan agar bisa menangkap item susulan dari scroll
                if (buildQueue.length === 0) {
                    if (activeWorkers > 1) {
                        hideCursor(cursor);
                        await sleep(60);
                        if (buildQueue.length === 0) break;
                        continue;
                    }
                    break;
                }

                if (!isAutoPlay) {
                    // Urutkan ulang antrean: yang tampil di layar selalu didahulukan
                    buildQueue.sort((a, b) => {
                        const aVis = isInViewport(a.el) ? 0 : 1;
                        const bVis = isInViewport(b.el) ? 0 : 1;
                        if (aVis !== bVis) return aVis - bVis;
                        return a.index - b.index;
                    });

                    // Kembalikan ke observer jika elemen terdepan sudah keluar dari layar
                    if (!isInViewport(buildQueue[0].el)) {
                        const skippedItem = buildQueue.shift();
                        if (skippedItem && skippedItem.el.dataset.swarmBuilt !== "true") {
                            skippedItem.el.dataset.queued = "false";
                            observer.observe(skippedItem.el);
                        }
                        continue;
                    }
                }

                const item = buildQueue.shift();
                if (!item) continue;

                const { el, type } = item;

                if (el.dataset.swarmBuilt === "true") continue;
                el.dataset.swarmBuilt = "true";

                // Hanya worker 0 yang mengendalikan auto-scroll agar tidak rebutan scroll
                if (isAutoPlay && workerIndex === 0) {
                    const rect = el.getBoundingClientRect();
                    const isOutOfView = rect.top < 90 || rect.bottom > window.innerHeight - 50;
                    if (isOutOfView) {
                        el.scrollIntoView({ behavior: "smooth", block: "center" });
                        await sleep(320);
                    }
                } else if (isAutoPlay && workerIndex > 0) {
                    await sleep(80);
                }

                if (isSkipped) break;
                if (!isAutoPlay && item.fromAutoPlay) {
                    el.dataset.swarmBuilt = "false";
                    el.dataset.queued = "false";
                    observer.observe(el);
                    continue;
                }

                if (type === "text") {
                    await buildText(el, cursor);
                } else if (type === "card") {
                    await buildCardWithText(el, cursor);
                } else {
                    await buildBox(el, cursor);
                }

                remainingCount--;
            }

            if (!isSkipped) {
                hideCursor(cursor);
            }
        }

        // Jalankan ketiga kursor secara bersamaan (dan bangunkan lagi jika ada yang sempat berhenti)
        const workerStates = cursors.map(() => false);

        function processQueueParallel() {
            if (isSkipped) return;

            cursors.forEach((cursor, index) => {
                if (workerStates[index]) return; // Worker ini sudah aktif
                if (buildQueue.length === 0) return;

                workerStates[index] = true;
                activeWorkers++;

                runCursorWorker(cursor, index).finally(() => {
                    workerStates[index] = false;
                    activeWorkers--;

                    if (!isSkipped && activeWorkers === 0) {
                        hideAllCursors();
                        if (remainingCount <= 0 && controlsBox.parentNode) {
                            controlsBox.remove();
                        }
                    }
                });
            });
        }
        // Prioritaskan elemen yang tampil di layar saat menu navigasi / tombol anchor diklik
        function prioritizeVisibleElements() {
            if (isSkipped || isAutoPlay) return;

            while (buildQueue.length > 0) {
                const oldItem = buildQueue.pop();
                if (oldItem.el.dataset.swarmBuilt !== "true") {
                    oldItem.el.dataset.queued = "false";
                    observer.observe(oldItem.el);
                }
            }

            targets.forEach((item, index) => {
                if (item.el.dataset.swarmBuilt !== "true" && isInViewport(item.el)) {
                    item.el.dataset.queued = "true";
                    observer.unobserve(item.el);
                    buildQueue.push({ ...item, index, fromAutoPlay: false });
                }
            });

            if (buildQueue.length > 0) {
                processQueueParallel();
            }
        }

        // Tangkap klik pada link anchor (#about, #skills, #projects, tombol View Projects, dll.)
        document.addEventListener("click", (e) => {
            const anchor = e.target.closest('a[href^="#"]');
            if (!anchor || isSkipped) return;

            const targetId = anchor.getAttribute("href");
            if (!targetId || targetId === "#") return;

            const targetSection = document.querySelector(targetId);
            if (!targetSection) return;

            if (isAutoPlay) {
                isAutoPlay = false;
                autoBtn.textContent = "Auto Play ▶";
                autoBtn.classList.remove("is-playing");
            }

            isJumpingSection = true;

            while (buildQueue.length > 0) {
                const oldItem = buildQueue.pop();
                if (oldItem.el.dataset.swarmBuilt !== "true") {
                    oldItem.el.dataset.queued = "false";
                    observer.observe(oldItem.el);
                }
            }

            setTimeout(() => {
                isJumpingSection = false;
                prioritizeVisibleElements();
            }, 550);
        });

        // Deteksi saat user selesai scroll manual cepat ke bagian mana pun
        let scrollEndTimer = null;
        window.addEventListener("scroll", () => {
            if (isSkipped || isAutoPlay || isJumpingSection) return;
            clearTimeout(scrollEndTimer);
            scrollEndTimer = setTimeout(() => {
                prioritizeVisibleElements();
            }, 150);
        }, { passive: true });

        targets.forEach(({ el }) => observer.observe(el));

        // Aksi Toggle Tombol Auto Play / Stop
        autoBtn.addEventListener("click", () => {
            if (isSkipped) return;

            if (!isAutoPlay) {
                isAutoPlay = true;
                observer.disconnect();

                autoBtn.textContent = "Stop Auto ⏹";
                autoBtn.classList.add("is-playing");

                targets.forEach((item, index) => {
                    if (item.el.dataset.queued !== "true" && item.el.dataset.swarmBuilt !== "true") {
                        item.el.dataset.queued = "true";
                        buildQueue.push({ ...item, index, fromAutoPlay: true });
                    }
                });

                processQueueParallel();
            } else {
                isAutoPlay = false;

                autoBtn.textContent = "Auto Play ▶";
                autoBtn.classList.remove("is-playing");

                for (let i = buildQueue.length - 1; i >= 0; i--) {
                    const queuedItem = buildQueue[i];
                    if (queuedItem.el.dataset.swarmBuilt !== "true") {
                        queuedItem.el.dataset.queued = "false";
                        buildQueue.splice(i, 1);
                    }
                }

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
            hideAllCursors();
            if (controlsBox.parentNode) controlsBox.remove();
        });
    }

    window.addEventListener("load", initPortfolioSwarm);
})();