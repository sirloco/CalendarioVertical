let calendar = document.getElementById("calendar");
let currentYear = new Date().getFullYear();

// 🔹 Esquina superior izquierda
let emptyCorner = document.createElement("div");
emptyCorner.classList.add("cell");
emptyCorner.textContent = "📅";
calendar.appendChild(emptyCorner);

// 🔹 Crear cabecera meses
[...Array(12).keys()].forEach((monthIndex) => {

    let header = document.createElement("div");
    header.classList.add("cell");
    header.style.fontWeight = "bold";

    let monthName = new Date(currentYear, monthIndex, 1)
        .toLocaleString("es-ES", { month: "long" });

    header.textContent =
        monthName.charAt(0).toUpperCase() + monthName.slice(1);

    calendar.appendChild(header);
});

// 🔹 Crear columna izquierda de días
for (let day = 1; day <= 31; day++) {

    let dayCell = document.createElement("div");
    dayCell.classList.add("cell");
    dayCell.textContent = day;
    dayCell.style.fontWeight = "bold";

    calendar.appendChild(dayCell);
}

// 🔹 Crear contenedores verticales de meses
[...Array(12).keys()].forEach((monthIndex) => {

    let monthColumn = document.createElement("div");
    monthColumn.classList.add("month-column");

    // Columna 1 es días, por eso sumamos 2
    monthColumn.style.gridColumn = monthIndex + 2;

    calendar.appendChild(monthColumn);
});

let hoverLine = document.createElement("div");
hoverLine.classList.add("calendar-hover-line");
calendar.appendChild(hoverLine);

calendar.addEventListener("mousemove", (e) => {

    let calendarRect = calendar.getBoundingClientRect();
    let y = e.clientY - calendarRect.top;

    let headerHeight = 40;

    if (y <= headerHeight) {
        hoverLine.style.display = "none";
        return;
    }

    let dayHeight = (calendarRect.height - headerHeight) / 31;
    let dayIndex = Math.floor((y - headerHeight) / dayHeight);

    if (dayIndex >= 0 && dayIndex < 31) {

        hoverLine.style.display = "block";
        hoverLine.style.top = (headerHeight + dayIndex * dayHeight) + "px";
        hoverLine.style.height = dayHeight + "px";

    } else {
        hoverLine.style.display = "none";
    }
});
