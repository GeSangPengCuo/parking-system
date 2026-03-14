class Car {
    constructor(plateNumber, color) {
        this.plateNumber = plateNumber;
        this.color = color;
    }
}

class ParkingSpot {
    constructor(number) {
        this.number = number;
        this.car = null;
        this.startTime = null; // Date
    }

    isFree() {
        return this.car === null;
    }

    park(car) {
        this.car = car;
        this.startTime = new Date();
    }

    leave() {
        this.car = null;
        this.startTime = null;
    }
}

class ParkingLot {
    constructor(capacity, pricePerHour) {
        if (capacity <= 0) {
            throw new Error("Capacity must be positive");
        }
        this.pricePerHour = pricePerHour;
        this.spots = [];
        for (let i = 1; i <= capacity; i++) {
            this.spots.push(new ParkingSpot(i));
        }
    }

    hasFreeSpot() {
        return this.spots.some(s => s.isFree());
    }

    park(car) {
        for (const spot of this.spots) {
            if (spot.isFree()) {
                spot.park(car);
                return spot;
            }
        }
        return null;
    }

    leave(plateNumber) {
        for (const spot of this.spots) {
            if (!spot.isFree() && spot.car.plateNumber.toLowerCase() === plateNumber.toLowerCase()) {
                const endTime = new Date();
                const startTime = spot.startTime;
                const minutes = Math.max(0, Math.round((endTime - startTime) / 60000)); // ms -> minutes
                const hours = Math.max(1, Math.ceil(minutes / 60));
                const fee = hours * this.pricePerHour;
                spot.leave();
                return { fee, hours };
            }
        }
        return null;
    }

    findByPlate(plateNumber) {
        for (const spot of this.spots) {
            if (!spot.isFree() && spot.car.plateNumber.toLowerCase() === plateNumber.toLowerCase()) {
                return spot;
            }
        }
        return null;
    }

    getStatus() {
        const freeCount = this.spots.filter(s => s.isFree()).length;
        return {
            total: this.spots.length,
            free: freeCount,
            used: this.spots.length - freeCount,
        };
    }
}

let parkingLot = null;

function formatDate(d) {
    if (!d) return "-";
    const pad = n => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDuration(startTime) {
    if (!startTime) return "-";
    const now = new Date();
    const minutes = Math.max(0, Math.round((now - startTime) / 60000));
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m} 分钟`;
    if (m === 0) return `${h} 小时`;
    return `${h} 小时 ${m} 分钟`;
}

function addMessage(text, type = "info") {
    const container = document.getElementById("messages");
    if (!container) return;
    const div = document.createElement("div");
    div.className = `message ${type}`;

    const timeEl = document.createElement("time");
    const now = new Date();
    timeEl.textContent = now.toTimeString().slice(0, 8);

    const span = document.createElement("span");
    span.textContent = text;

    div.appendChild(timeEl);
    div.appendChild(span);
    container.prepend(div);
}

function renderStatus() {
    const summaryEl = document.getElementById("status-summary");
    const tbody = document.querySelector("#status-table tbody");
    tbody.innerHTML = "";

    if (!parkingLot) {
        summaryEl.textContent = "尚未初始化停车场。请先在上方输入车位总数和收费金额并点击“初始化”。";
        return;
    }

    const status = parkingLot.getStatus();
    summaryEl.innerHTML = `
        <span class="badge accent">总车位：${status.total}</span>
        <span class="badge">空闲：${status.free}</span>
        <span class="badge">已用：${status.used}</span>
        <span class="badge">当前单价：${parkingLot.pricePerHour.toFixed(2)} 元/小时</span>
    `;

    for (const spot of parkingLot.spots) {
        const tr = document.createElement("tr");
        tr.className = spot.isFree() ? "free" : "occupied";

        const statusText = spot.isFree() ? "空闲" : "占用";
        const plate = spot.car?.plateNumber ?? "-";
        const color = spot.car?.color ?? "-";

        tr.innerHTML = `
            <td>${spot.number}</td>
            <td class="status">${statusText}</td>
            <td>${plate}</td>
            <td>${color}</td>
            <td>${spot.startTime ? formatDate(spot.startTime) : "-"}</td>
            <td>${spot.startTime ? formatDuration(spot.startTime) : "-"}</td>
        `;
        tbody.appendChild(tr);
    }
}

function bindEvents() {
    const initBtn = document.getElementById("init-btn");
    const capacityInput = document.getElementById("capacity-input");
    const priceInput = document.getElementById("price-input");
    const enterBtn = document.getElementById("enter-btn");
    const enterPlateInput = document.getElementById("enter-plate-input");
    const enterColorInput = document.getElementById("enter-color-input");
    const leaveBtn = document.getElementById("leave-btn");
    const leavePlateInput = document.getElementById("leave-plate-input");
    const searchBtn = document.getElementById("search-btn");
    const searchPlateInput = document.getElementById("search-plate-input");

    initBtn.addEventListener("click", () => {
        const capacity = parseInt(capacityInput.value, 10);
        const price = parseFloat(priceInput.value);
        if (Number.isNaN(capacity) || capacity <= 0) {
            addMessage("请输入有效的车位总数（正整数）。", "error");
            capacityInput.focus();
            return;
        }
        if (Number.isNaN(price) || price < 0) {
            addMessage("请输入有效的每小时收费金额（大于等于 0）。", "error");
            priceInput.focus();
            return;
        }
        try {
            parkingLot = new ParkingLot(capacity, price);
            addMessage(`停车场初始化成功：总车位 ${capacity} 个，收费 ${price.toFixed(2)} 元/小时。`, "success");
            renderStatus();
        } catch (e) {
            addMessage(`初始化失败：${e.message}`, "error");
        }
    });

    enterBtn.addEventListener("click", () => {
        if (!parkingLot) {
            addMessage("请先初始化停车场。", "error");
            return;
        }
        if (!parkingLot.hasFreeSpot()) {
            addMessage("停车场已满，无法继续停车！", "error");
            return;
        }
        const plate = enterPlateInput.value.trim();
        const color = enterColorInput.value.trim();
        if (!plate) {
            addMessage("请输入车牌号。", "error");
            enterPlateInput.focus();
            return;
        }
        if (!color) {
            addMessage("请输入车辆颜色。", "error");
            enterColorInput.focus();
            return;
        }
        const car = new Car(plate, color);
        const spot = parkingLot.park(car);
        if (spot) {
            addMessage(`停车成功，车牌 ${plate} 停在车位 ${spot.number}。`, "success");
        } else {
            addMessage("停车失败，没有可用车位。", "error");
        }
        enterPlateInput.value = "";
        enterColorInput.value = "";
        renderStatus();
    });

    leaveBtn.addEventListener("click", () => {
        if (!parkingLot) {
            addMessage("请先初始化停车场。", "error");
            return;
        }
        const plate = leavePlateInput.value.trim();
        if (!plate) {
            addMessage("请输入要离场车辆的车牌号。", "error");
            leavePlateInput.focus();
            return;
        }
        const result = parkingLot.leave(plate);
        if (!result) {
            addMessage(`未找到车牌为 ${plate} 的车辆，离场失败。`, "error");
        } else {
            addMessage(
                `车牌 ${plate} 离场成功，应支付停车费：${result.fee.toFixed(2)} 元（计费时长 ${result.hours} 小时）。`,
                "success"
            );
        }
        leavePlateInput.value = "";
        renderStatus();
    });

    searchBtn.addEventListener("click", () => {
        if (!parkingLot) {
            addMessage("请先初始化停车场。", "error");
            return;
        }
        const plate = searchPlateInput.value.trim();
        if (!plate) {
            addMessage("请输入要查询的车牌号。", "error");
            searchPlateInput.focus();
            return;
        }
        const spot = parkingLot.findByPlate(plate);
        if (!spot) {
            addMessage(`未找到车牌为 ${plate} 的车辆。`, "info");
        } else {
            addMessage(
                `车牌 ${plate} 在车位 ${spot.number}，入场时间 ${formatDate(spot.startTime)}，已停 ${formatDuration(
                    spot.startTime
                )}。`,
                "info"
            );
        }
    });
}

window.addEventListener("DOMContentLoaded", () => {
    bindEvents();
    renderStatus();
    addMessage("欢迎使用停车场管理系统网页版！请先在上方初始化停车场。", "info");
});

