const STATUS_FLOW = {
    Pending: { prev: null, next: "In Progress", columnKey: "pending" },
    "In Progress": { prev: "Pending", next: "Ready", columnKey: "in-progress" },
    Ready: { prev: "In Progress", next: null, columnKey: "ready" },
};

const SUCCESS_MESSAGE = "Статус заказа успешно обновлен!";

function getUsdRate() {
    const rate = parseFloat(document.body.dataset.usdKztRate || "0", 10);
    return rate > 0 ? rate : 450;
}

function formatKzt(amount) {
    return `${Math.round(amount).toLocaleString("ru-RU")} ₸`;
}

function formatUsdFromKzt(amountKzt) {
    const usd = amountKzt / getUsdRate();
    return `$${usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function updateCardPriceUsd(card) {
    const kztEl = card.querySelector(".price-kzt");
    const usdEl = card.querySelector(".price-usd");
    if (!kztEl || !usdEl) {
        return;
    }
    const kzt = parseFloat(card.dataset.totalPrice, 10);
    kztEl.textContent = formatKzt(kzt);
    usdEl.textContent = formatUsdFromKzt(kzt);
}

function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) {
        return;
    }

    const toastId = `toast-${Date.now()}`;
    const toastClass = type === "success" ? "toast-neon-success" : "toast-neon-danger";
    const icon = type === "success" ? "bi-check-circle-fill" : "bi-exclamation-octagon-fill";

    const html = `
        <div id="${toastId}" class="toast ${toastClass} align-items-center border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="bi ${icon} me-2"></i>${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;

    container.insertAdjacentHTML("beforeend", html);
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 3200 });
    toast.show();
    toastElement.addEventListener("hidden.bs.toast", () => toastElement.remove());
}

function getColumnByStatus(status) {
    const flow = STATUS_FLOW[status];
    if (!flow) {
        return null;
    }
    return document.querySelector(`.kanban-column.${flow.columnKey} .kanban-cards`);
}

function updateColumnCount(status) {
    const flow = STATUS_FLOW[status];
    if (!flow) {
        return;
    }
    const column = document.querySelector(`.kanban-column.${flow.columnKey}`);
    if (!column) {
        return;
    }
    const cardsContainer = column.querySelector(".kanban-cards");
    const countBadge = column.querySelector(".column-count");
    if (!countBadge || !cardsContainer) {
        return;
    }
    const cardCount = cardsContainer.querySelectorAll(".order-card").length;
    countBadge.textContent = String(cardCount);

    const emptyPlaceholder = cardsContainer.querySelector(".empty-column");
    if (cardCount === 0 && !emptyPlaceholder) {
        const emptyText =
            status === "Pending"
                ? "Нет заказов в ожидании"
                : status === "In Progress"
                  ? "Нет заказов в работе"
                  : "Нет готовых заказов";
        cardsContainer.innerHTML = `<div class="empty-column">${emptyText}</div>`;
    } else if (cardCount > 0 && emptyPlaceholder) {
        emptyPlaceholder.remove();
    }
}

function updateCardStatusUi(card, newStatus) {
    card.dataset.status = newStatus;
    card.classList.remove("status-pending", "status-in-progress", "status-ready");
    const cssClass =
        newStatus === "Pending"
            ? "status-pending"
            : newStatus === "In Progress"
              ? "status-in-progress"
              : "status-ready";
    card.classList.add(cssClass);

    const backBtn = card.querySelector(".btn-back");
    const forwardBtn = card.querySelector(".btn-forward");
    const flow = STATUS_FLOW[newStatus];

    if (backBtn) {
        backBtn.dataset.newStatus = flow.prev || "";
        backBtn.disabled = !flow.prev;
    }
    if (forwardBtn) {
        forwardBtn.dataset.newStatus = flow.next || "";
        forwardBtn.disabled = !flow.next;
    }
}

function moveCardToColumn(card, oldStatus, newStatus) {
    const targetColumn = getColumnByStatus(newStatus);
    if (!targetColumn) {
        return;
    }

    const sourceColumn = getColumnByStatus(oldStatus);
    if (sourceColumn && sourceColumn.contains(card)) {
        card.remove();
    }

    targetColumn.appendChild(card);
    updateCardStatusUi(card, newStatus);
    updateColumnCount(oldStatus);
    updateColumnCount(newStatus);
}

async function refreshDashboardStats() {
    try {
        const response = await fetch("/api/v1/analytics", { credentials: "same-origin" });
        const result = await response.json();
        if (!response.ok || !result.success) {
            return;
        }

        const data = result.data;
        const pendingEl = document.querySelector('[data-stat="pending"]');
        const progressEl = document.querySelector('[data-stat="in-progress"]');
        const completedEl = document.querySelector('[data-stat="completed"]');
        const cashKztEl = document.querySelector('[data-stat="cash-kzt"]');
        const cashUsdEl = document.querySelector('[data-stat="cash-usd"]');

        if (pendingEl) {
            pendingEl.textContent = data.pending_queue;
        }
        if (progressEl) {
            progressEl.textContent = data.cars_in_progress;
        }
        if (completedEl) {
            completedEl.textContent = data.completed_orders;
        }
        if (cashKztEl && data.total_cash !== undefined) {
            cashKztEl.textContent = formatKzt(data.total_cash);
        }
        if (cashUsdEl && data.total_cash_usd !== undefined) {
            cashUsdEl.textContent = `≈ $${Number(data.total_cash_usd).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
    } catch (error) {
        console.error("Не удалось обновить статистику:", error);
    }
}

async function moveOrderStatus(orderId, newStatus, button) {
    const card = button.closest(".order-card");
    if (!card) {
        return;
    }

    const oldStatus = card.dataset.status;
    if (oldStatus === newStatus) {
        return;
    }

    const payload = {
        car_id: parseInt(card.dataset.carId, 10),
        user_id: parseInt(card.dataset.userId, 10),
        service_id: parseInt(card.dataset.serviceId, 10),
        total_price: parseFloat(card.dataset.totalPrice),
        status: newStatus,
    };

    const allButtons = card.querySelectorAll(".btn-status");
    allButtons.forEach((btn) => {
        btn.disabled = true;
    });

    try {
        const response = await fetch(`/api/v1/orders/${orderId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "same-origin",
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            const message =
                result?.error?.message ||
                result?.error?.details?.[0]?.message ||
                "Не удалось обновить статус заказа.";
            showToast(message, "danger");
            allButtons.forEach((btn) => {
                btn.disabled = false;
            });
            return;
        }

        moveCardToColumn(card, oldStatus, newStatus);
        updateCardPriceUsd(card);
        await refreshDashboardStats();
        showToast(SUCCESS_MESSAGE, "success");
    } catch (error) {
        console.error(error);
        showToast("Ошибка сети при обновлении заказа.", "danger");
    } finally {
        allButtons.forEach((btn) => {
            const flow = STATUS_FLOW[card.dataset.status];
            if (btn.classList.contains("btn-back")) {
                btn.disabled = !flow.prev;
            }
            if (btn.classList.contains("btn-forward")) {
                btn.disabled = !flow.next;
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".order-card").forEach(updateCardPriceUsd);

    document.querySelectorAll(".btn-status").forEach((button) => {
        button.addEventListener("click", () => {
            const orderId = button.dataset.orderId;
            const newStatus = button.dataset.newStatus;
            if (!orderId || !newStatus) {
                return;
            }
            moveOrderStatus(orderId, newStatus, button);
        });
    });
});
