(function () {
    "use strict";

    const I18N = {
        kz: {
            overview: "Шолу",
            orders: "Тапсырыстар",
            track: "Трекинг",
            logout: "Шығу",
            panelTitle: "Басқару панелі",
            panelSub: "Детейлинг орталығы — тапсырыстар",
            myOrders: "Мои тапсырыстар",
            panelTitleAdmin: "Басқару панелі",
            panelSub: "Детейлинг орталығы — тапсырыстар",
            companySub: "Детейлинг орталығы",
            revenue: "Касса",
            inQueue: "Кезекте",
            inWork: "Жұмыс үстінде",
            done: "Дайын",
            totalTasks: "Барлық тапсырмалар",
            roleAdmin: "Администратор",
            roleWorker: "Мастер",
            revenueChart: "Кіріс динамикасы",
            brandChart: "Маркалар үлесі",
            leaderboard: "Топ шеберлер",
            liveSearch: "Іздеу (марка / нөмірі)",
            search_placeholder: "Іздеу (марка / госномер)...",
            archive_title: "Архив",
            archive_sub: "Аяқталған тапсырыстар мұнда көрсетіледі",
            allMasters: "Барлық шеберлер",
            addCar: "Жаңа көлік қосу",
            kanbanTitle: "Тапсырыстар тақтасы",
            statusPending: "Күтуде",
            statusProgress: "Жұмыс үстінде",
            statusReady: "Дайын",
            service: "Қызмет",
            master: "Шебер",
            received: "Қабылданды",
            duration: "Жұмыс уақыты",
            countdown: "Қалған уақыт",
            checkWash: "Жуу",
            checkMain: "Негізгі жұмыс",
            checkAccept: "Қабылдау",
            before: "📸 Дейін",
            after: "✨ Кейін",
            printReceipt: "Басып шығару",
            orderNum: "Тапсырыс",
            modalTitle: "Жаңа көлік қосу",
            brand: "Марка",
            model: "Модель",
            plate: "Госномер",
            phone: "Телефон клиента",
            serviceSelect: "Қызмет",
            masterSelect: "Шебер",
            save: "Сақтау",
            cancel: "Болдырмау",
            add_car: "Жаңа көлік қосу",
            addMaster: "Шебер қосу",
            addMasterSub: "Жаңа қызметкерлер тізімге қосылады.",
            currentMasters: "Ағымдағы шеберлер",
            currentMastersSub: "Қызметкерлердің байланыстары мен рөлдері.",
            password: "Құпия сөз",
            noPhone: "Телефон көрсетілмеген",
            noMasters: "Тіркелген шеберлер жоқ",
            team: "Команданы басқару",
            archive: "Тапсырыстар архиві",
            master_rating: "Шеберлер рейтингі",
            toastOk: "Статус заказа успешно обновлен!",
            emptyCol: "Бос",
        },
        ru: {
            overview: "Обзор",
            orders: "Заказы",
            track: "Трекинг",
            logout: "Выйти",
            panelTitle: "Панель управления",
            panelSub: "Детейлинг-центр — заказы",
            myOrders: "Мои заказы",
            panelTitleAdmin: "Панель управления",
            panelSub: "Детейлинг-центр — заказы",
            companySub: "Детейлинг-центр",
            revenue: "Выручка",
            inQueue: "В очереди",
            inWork: "В работе",
            done: "Готово",
            totalTasks: "Всего задач",
            roleAdmin: "Администратор",
            roleWorker: "Мастер",
            revenueChart: "Динамика дохода",
            brandChart: "Доля марок",
            leaderboard: "Рейтинг мастеров",
            liveSearch: "Поиск (марка / госномер)",
            search_placeholder: "Поиск (марка / госномер)...",
            archive_title: "Архив",
            archive_sub: "Завершённые заказы отображаются здесь",
            allMasters: "Все мастера",
            addCar: "Добавить авто",
            kanbanTitle: "Доска заказов",
            statusPending: "В ожидании",
            statusProgress: "В работе",
            statusReady: "Готово",
            service: "Услуга",
            master: "Мастер",
            received: "Принято",
            duration: "Срок работы",
            countdown: "Осталось",
            checkWash: "Мойка",
            checkMain: "Основная работа",
            checkAccept: "Приемка",
            before: "📸 До",
            after: "✨ После",
            printReceipt: "Печать чека",
            orderNum: "Заказ",
            modalTitle: "Добавить автомобиль",
            brand: "Марка",
            model: "Модель",
            plate: "Госномер",
            phone: "Телефон клиента",
            serviceSelect: "Услуга",
            masterSelect: "Мастер",
            save: "Сохранить",
            cancel: "Отмена",
            add_car: "Добавить авто",
            addMaster: "Добавить мастера",
            addMasterSub: "Новые сотрудники сразу появятся в общем списке.",
            currentMasters: "Текущие мастера",
            currentMastersSub: "Список сотрудников с контактами и ролями.",
            password: "Пароль",
            noPhone: "Телефон не указан",
            noMasters: "Нет зарегистрированных мастеров.",
            team: "Управление командой",
            archive: "Архив заказов",
            master_rating: "Рейтинг мастеров",
            toastOk: "Статус заказа успешно обновлен!",
            emptyCol: "Пусто",
        },
    };

    const STATUS_MAP = {
        pending: { col: "pending", prev: null, next: "in_progress" },
        in_progress: { col: "in_progress", prev: "pending", next: "completed" },
        completed: { col: "completed", prev: "in_progress", next: null },
    };

    let currentLang = localStorage.getItem("theme_lang") || localStorage.getItem("crm_lang") || "ru";
    let revenueChart = null;
    let brandChart = null;
    let readySound = null;

    function t(key) {
        return (I18N[currentLang] && I18N[currentLang][key]) || I18N.ru[key] || key;
    }

    function applyLanguage() {
        document.querySelectorAll("[data-i18n]").forEach((el) => {
            const key = el.getAttribute("data-i18n");
            if (key) el.textContent = t(key);
        });
        document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
            const key = el.getAttribute("data-i18n-placeholder");
            if (key) el.placeholder = t(key);
        });
        document.querySelectorAll(".lang-btn").forEach((btn) => {
            btn.classList.toggle("active", btn.dataset.lang === currentLang);
        });
        localStorage.setItem("theme_lang", currentLang);
        localStorage.setItem("crm_lang", currentLang);
        updateMobileTabLabels();
    }

    function updateMobileTabLabels() {
        document.querySelectorAll(".mobile-kanban-tabs button").forEach((btn) => {
            const st = btn.dataset.status;
            if (st === "pending") btn.textContent = t("statusPending");
            if (st === "in_progress") btn.textContent = t("statusProgress");
            if (st === "completed") btn.textContent = t("statusReady");
        });
    }

    function changeLanguage(lang) {
        currentLang = lang;
        applyLanguage();
        initCharts();
    }
    window.changeLanguage = changeLanguage;

    function getUsdRate() {
        const r = parseFloat(document.body.dataset.usdKztRate || "450", 10);
        return r > 0 ? r : 450;
    }

    function formatKzt(n) {
        return `${Math.round(n).toLocaleString("ru-RU")} ₸`;
    }

    function formatUsd(kzt) {
        const usd = kzt / getUsdRate();
        return `$${usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    function showToast(msg, ok) {
        const c = document.getElementById("toast-container");
        if (!c) return;
        const id = `t${Date.now()}`;
        c.insertAdjacentHTML("beforeend", `<div id="${id}" class="toast toast-ok align-items-center border-0" role="alert"><div class="d-flex"><div class="toast-body">${msg}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div></div>`);
        const el = document.getElementById(id);
        const toast = new bootstrap.Toast(el, { delay: 3000 });
        toast.show();
        el.addEventListener("hidden.bs.toast", () => el.remove());
    }

    function playReadySound() {
        try {
            if (!readySound) {
                readySound = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE=");
            }
            readySound.currentTime = 0;
            readySound.play().catch(() => {});
        } catch (e) {}
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            o.frequency.value = 880;
            g.gain.setValueAtTime(0.15, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
            o.start();
            o.stop(ctx.currentTime + 0.25);
        } catch (e) {}
    }

    function updateChecklistProgress(card) {
        const boxes = card.querySelectorAll(".chk-item");
        const fill = card.querySelector(".prog-fill");
        if (!boxes.length || !fill) return;
        let done = 0;
        boxes.forEach((b) => { if (b.checked) done++; });
        fill.style.width = `${Math.round((done / boxes.length) * 100)}%`;
    }

    function initChecklists() {
        document.querySelectorAll(".oc").forEach((card) => {
            card.querySelectorAll(".chk-item").forEach((chk) => {
                chk.addEventListener("change", () => updateChecklistProgress(card));
            });
            updateChecklistProgress(card);
        });
    }

    function initCountdowns() {
        document.querySelectorAll(".oc[data-deadline]").forEach((card) => {
            const el = card.querySelector(".countdown-val");
            const deadline = card.dataset.deadline;
            if (!el || !deadline) return;
            const tick = () => {
                const end = new Date(deadline).getTime();
                const now = Date.now();
                let diff = Math.max(0, end - now);
                const h = Math.floor(diff / 3600000);
                diff %= 3600000;
                const m = Math.floor(diff / 60000);
                const s = Math.floor((diff % 60000) / 1000);
                el.textContent = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
            };
            tick();
            setInterval(tick, 1000);
        });
    }

    function filterCards() {
        const q = (document.getElementById("live-search")?.value || "").toLowerCase().trim();
        const master = document.getElementById("master-filter")?.value || "";
        document.querySelectorAll(".oc").forEach((card) => {
            const brand = (card.dataset.brand || "").toLowerCase();
            const plate = (card.dataset.plate || "").toLowerCase();
            const mid = card.dataset.masterId || "";
            const matchQ = !q || brand.includes(q) || plate.includes(q);
            const matchM = !master || mid === master;
            card.classList.toggle("hidden-by-filter", !(matchQ && matchM));
        });
    }

    async function patchStatus(orderId, newStatus) {
        const res = await fetch(`/api/v1/orders/${orderId}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({ status: newStatus }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
            throw new Error(data?.error?.message || "Ошибка обновления");
        }
        return data;
    }

    function getColumnList(status) {
        return document.querySelector(`.kanban-list[data-status="${status}"]`);
    }

    function updateColCounts() {
        ["pending", "in_progress", "completed"].forEach((st) => {
            const list = getColumnList(st);
            const col = list?.closest(".kanban-col");
            const badge = col?.querySelector(".col-count");
            if (list && badge) {
                const n = list.querySelectorAll(".oc:not(.hidden-by-filter)").length;
                badge.textContent = String(n);
            }
        });
    }

    function onCardMoved(card, newStatus) {
        card.dataset.status = newStatus;
        card.classList.remove("status-pending", "status-in-progress", "status-ready");
        if (newStatus === "pending") card.classList.add("status-pending");
        if (newStatus === "in_progress") card.classList.add("status-in-progress");
        if (newStatus === "completed") card.classList.add("status-ready");
        const printBtn = card.querySelector(".btn-print");
        if (printBtn) printBtn.style.display = newStatus === "completed" ? "block" : "none";
        updateColCounts();
    }

    function initSortable() {
        if (typeof Sortable === "undefined") return;
        document.querySelectorAll(".kanban-list").forEach((list) => {
            Sortable.create(list, {
                group: "kanban-orders",
                animation: 180,
                ghostClass: "sortable-ghost",
                dragClass: "sortable-drag",
                onEnd: async (evt) => {
                    const card = evt.item;
                    const orderId = card.dataset.orderId;
                    const newStatus = evt.to.dataset.status;
                    const oldStatus = card.dataset.status;
                    if (!orderId || !newStatus || newStatus === oldStatus) return;
                    try {
                        await patchStatus(orderId, newStatus);
                        onCardMoved(card, newStatus);
                        if (newStatus === "completed") playReadySound();
                        showToast(t("toastOk"), true);
                        refreshStats();
                    } catch (err) {
                        showToast(err.message, false);
                        evt.from.insertBefore(card, evt.from.children[evt.oldIndex] || null);
                    }
                },
            });
        });
    }

    async function refreshStats() {
        try {
            const res = await fetch("/api/v1/analytics", { credentials: "same-origin" });
            const json = await res.json();
            if (!json.success) return;
            const d = json.data;
            const map = {
                "stat-revenue": d.total_cash != null ? formatKzt(d.total_cash) : null,
                "stat-pending": d.pending_queue,
                "stat-progress": d.cars_in_progress,
                "stat-ready": d.completed_orders,
            };
            Object.keys(map).forEach((id) => {
                const el = document.getElementById(id);
                if (el && map[id] != null) el.textContent = map[id];
            });
        } catch (e) {}
    }

    function initCharts() {
        const cfg = window.DASHBOARD_CHARTS;
        if (!cfg || typeof Chart === "undefined") return;
        const revCtx = document.getElementById("revenueChart");
        if (revCtx) {
            if (revenueChart) revenueChart.destroy();
            revenueChart = new Chart(revCtx, {
                type: "line",
                data: {
                    labels: cfg.revenue.labels,
                    datasets: [{
                        label: t("revenue"),
                        data: cfg.revenue.values,
                        borderColor: "#00ff88",
                        backgroundColor: "rgba(0,255,136,0.1)",
                        fill: true,
                        tension: 0.35,
                    }],
                },
                options: {
                    responsive: true,
                    plugins: { legend: { labels: { color: "#9ca3af" } } },
                    scales: {
                        x: { ticks: { color: "#9ca3af" }, grid: { color: "rgba(255,255,255,0.05)" } },
                        y: { ticks: { color: "#9ca3af" }, grid: { color: "rgba(255,255,255,0.05)" } },
                    },
                },
            });
        }
        const pieCtx = document.getElementById("brandChart");
        if (pieCtx) {
            if (brandChart) brandChart.destroy();
            brandChart = new Chart(pieCtx, {
                type: "pie",
                data: {
                    labels: cfg.brand.labels,
                    datasets: [{
                        data: cfg.brand.values,
                        backgroundColor: ["#00ff88", "#4dabf7", "#ff8c32", "#b197fc", "#f472b6", "#fbbf24"],
                    }],
                },
                options: {
                    responsive: true,
                    plugins: { legend: { position: "bottom", labels: { color: "#9ca3af" } } },
                },
            });
        }
    }

    function initMobileKanban() {
        const tabs = document.querySelectorAll(".mobile-kanban-tabs button");
        const panels = document.querySelectorAll(".mobile-kanban-panel");
        tabs.forEach((btn) => {
            btn.addEventListener("click", () => {
                const st = btn.dataset.status;
                tabs.forEach((b) => b.classList.toggle("active", b === btn));
                panels.forEach((p) => p.classList.toggle("active", p.dataset.status === st));
            });
        });
    }

    function initDashboardTabs() {
        const sideButtons = Array.from(document.querySelectorAll('.side-nav-button'));
        const sidebarLinks = Array.from(document.querySelectorAll('.sidebar [data-tab]'));
        const navElements = sideButtons.concat(sidebarLinks);
        const tabs = document.querySelectorAll('.dashboard-tab');

        function activate(tabName, activeEl) {
            tabs.forEach((t) => t.classList.toggle('active', t.id === `tab-${tabName}`));
            navElements.forEach((el) => el.classList.toggle('active', el === activeEl));
            const activePanel = document.querySelector(`#tab-${tabName}`);
            if (activePanel) activePanel.scrollTop = 0;
        }

        navElements.forEach((el) => {
            el.addEventListener('click', (e) => {
                const tab = el.dataset.tab;
                if (!tab) return;
                // if link, prevent default navigation
                if (el.tagName.toLowerCase() === 'a') e.preventDefault();
                activate(tab, el);
            });
        });

        const defaultEl = document.querySelector('.side-nav-button.active') || document.querySelector('.sidebar [data-tab].active') || navElements[0];
        if (defaultEl) activate(defaultEl.dataset.tab, defaultEl);
    }

    function printReceipt(card) {
        const area = document.getElementById("receipt-print-area");
        if (!area) return;
        area.innerHTML = `
            <div class="receipt-print">
                <h2>DetailPro — Чек</h2>
                <p>Заказ №${card.dataset.orderId}</p>
                <table>
                    <tr><td>Госномер</td><td><strong>${card.dataset.plate}</strong></td></tr>
                    <tr><td>Автомобиль</td><td>${card.dataset.brand} ${card.dataset.model}</td></tr>
                    <tr><td>Услуга</td><td>${card.dataset.service}</td></tr>
                    <tr><td>Мастер</td><td>${card.dataset.worker}</td></tr>
                    <tr><td>Сумма</td><td>${formatKzt(parseFloat(card.dataset.price))} / ${formatUsd(parseFloat(card.dataset.price))}</td></tr>
                </table>
                <p style="margin-top:16px;font-size:12px;color:#666;">Спасибо за визит!</p>
            </div>`;
        window.print();
    }

    function initPrintButtons() {
        document.querySelectorAll(".btn-print").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                printReceipt(btn.closest(".oc"));
            });
        });
    }

    function initPhotoUpload() {
        document.querySelectorAll(".photo-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const card = btn.closest(".oc");
                const orderId = card.dataset.orderId;
                const photoType = btn.dataset.photoType;
                const fileInput = card.querySelector(`.photo-input[data-photo-type="${photoType}"]`);
                
                if (fileInput) {
                    fileInput.click();
                }
            });
        });

        document.querySelectorAll(".photo-input").forEach((input) => {
            input.addEventListener("change", async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const card = input.closest(".oc");
                const orderId = card.dataset.orderId;
                const photoType = input.dataset.photoType;

                const formData = new FormData();
                formData.append("file", file);

                try {
                    const res = await fetch(`/upload_photo/${orderId}/${photoType}`, {
                        method: "POST",
                        credentials: "same-origin",
                        body: formData,
                    });
                    const data = await res.json();
                    if (!res.ok || !data.success) {
                        throw new Error(data?.error?.message || "Ошибка при загрузке фото");
                    }
                    showToast(`Фото ${photoType === "before" ? "До" : "После"} успешно загружено!`, true);
                    // Reload page after successful upload
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } catch (err) {
                    showToast(err.message || "Ошибка при загрузке фото", false);
                }
                // Reset input for next file selection
                input.value = "";
            });
        });
    }

    function initQuickOrderForm() {
        const form = document.getElementById("quick-order-form");
        if (!form) return;
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const payload = {
                brand: form.brand.value.trim(),
                model: form.model.value.trim(),
                license_plate: form.license_plate.value.trim(),
                owner_phone: form.owner_phone.value.trim(),
                service_id: parseInt(form.service_id.value, 10),
                user_id: parseInt(form.user_id.value, 10),
            };
            try {
                const res = await fetch("/api/v1/quick-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "same-origin",
                    body: JSON.stringify(payload),
                });
                const data = await res.json();
                if (!res.ok || !data.success) throw new Error(data?.error?.message || "Ошибка");
                bootstrap.Modal.getInstance(document.getElementById("addCarModal"))?.hide();
                showToast(t("toastOk"), true);
                window.location.reload();
            } catch (err) {
                showToast(err.message, false);
            }
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll(".lang-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                currentLang = btn.dataset.lang;
                applyLanguage();
                initCharts();
            });
        });
        applyLanguage();

        document.getElementById("live-search")?.addEventListener("input", filterCards);
        document.getElementById("master-filter")?.addEventListener("change", filterCards);

        initChecklists();
        initCountdowns();
        initSortable();
        initMobileKanban();
        initDashboardTabs();
        initPrintButtons();
        initPhotoUpload();
        initQuickOrderForm();
        initCharts();
        updateColCounts();
    });
})();
