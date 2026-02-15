let calendar = document.getElementById("calendar");
let currentYear = new Date().getFullYear();

const BAR_WIDTH = 12;
const BAR_GAP = 4;
const COLUMN_PADDING = 6;

let empleados = [
    {
        nombre: "Irune",
        color: "#f87171",
        vacaciones: [ { inicio: `${currentYear}-06-10`, fin: `${currentYear}-06-18` }]
    },
    {
        nombre: "Esther",
        color: "#60a5fa",
        vacaciones: [{ inicio: `${currentYear}-06-15`, fin: `${currentYear}-06-25` }]
    },
    {
        nombre: "Santi",
        color: "#34d399",
        vacaciones: [{ inicio: `${currentYear}-07-01`, fin: `${currentYear}-07-10` }]
    }
];

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

    let monthName = new Date(currentYear, monthIndex, 1).toLocaleString("es-ES", { month: "long" });

    header.textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    header.style.cursor = "pointer";

    header.addEventListener("click", () => { mostrarVistaMensual(monthIndex);});

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

function ajustarAnchoColumnas() {

    let totalCarriles = empleados.length;

    let columnWidth = COLUMN_PADDING + totalCarriles * (BAR_WIDTH + BAR_GAP);

    let monthColumns = document.querySelectorAll(".month-column");

    monthColumns.forEach(col => { col.style.minWidth = columnWidth + "px"; });
}

function pintarVacaciones() {

    let monthColumns = document.querySelectorAll(".month-column");

    empleados.forEach((empleado, indexEmpleado) => {

        empleado.vacaciones.forEach(vacacion => {

            let fechaInicio = new Date(vacacion.inicio);
            let fechaFin = new Date(vacacion.fin);

            let mes = fechaInicio.getMonth();
            let diaInicio = fechaInicio.getDate();
            let diaFin = fechaFin.getDate();

            let monthColumn = monthColumns[mes];

            let bar = document.createElement("div");
            bar.classList.add("vacation-bar");
            bar.dataset.employee = indexEmpleado;
            bar.style.backgroundColor = empleado.color;

            let columnRect = monthColumn.getBoundingClientRect();
            let dayHeight = columnRect.height / 31;

            bar.style.top = (diaInicio - 1) * dayHeight + "px";

            bar.style.height = (diaFin - diaInicio + 1) * dayHeight + "px";

            // 🔹 Carril fijo por empleado
            let leftPosition = COLUMN_PADDING + indexEmpleado * (BAR_WIDTH + BAR_GAP);

            bar.style.left = leftPosition + "px";
            bar.style.width = BAR_WIDTH + "px";

            monthColumn.appendChild(bar);
        });
    });
}

function crearPanelEmpleados() {

    let panel = document.getElementById("employee-panel");

    empleados.forEach((empleado, index) => {

        let container = document.createElement("div");
        container.classList.add("employee-item");

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = true;
        checkbox.dataset.index = index;

        checkbox.addEventListener("change", () => {
            actualizarVisibilidad();
        });

        let label = document.createElement("label");
        label.textContent = empleado.nombre;
        label.style.color = empleado.color;

        container.appendChild(checkbox);
        container.appendChild(label);

        panel.appendChild(container);
    });
}

function actualizarVisibilidad() {

    let checkboxes = document.querySelectorAll("#employee-panel input");

    checkboxes.forEach(cb => {

        let index = cb.dataset.index;
        let bars = document.querySelectorAll(`.vacation-bar[data-employee="${index}"]`);

        bars.forEach(bar => {
            bar.style.display = cb.checked ? "block" : "none";
        });
    });
}

function actualizarInfoBar(dia, mes) {

    let infoBar = document.getElementById("info-bar");

    if (dia === null || mes === null) {
        infoBar.textContent = "";
        return;
    }

    let fecha = new Date(currentYear, mes, dia);
    let fechaTexto = fecha.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    let empleadosActivos = [];

    empleados.forEach((empleado, index) => {

        let checkbox = document.querySelector(
            `#employee-panel input[data-index="${index}"]`
        );

        if (!checkbox || !checkbox.checked) return;

        empleado.vacaciones.forEach(vacacion => {

            let inicio = new Date(vacacion.inicio);
            let fin = new Date(vacacion.fin);

            if (
                mes === inicio.getMonth() &&
                dia >= inicio.getDate() &&
                dia <= fin.getDate()
            ) {
                empleadosActivos.push(empleado.nombre);
            }
        });
    });

    if (empleadosActivos.length === 0) {
        infoBar.textContent = "";
    } else {
        infoBar.textContent = `📅 ${fechaTexto} — Vacaciones: ${empleadosActivos.join(", ")}`;
    }
}

function mostrarVistaMensual(mesIndex) {

    let yearView = document.getElementById("year-view");
    let monthView = document.getElementById("month-view");

    yearView.style.display = "none";
    monthView.style.display = "block";

    calcularDimensiones(); // 🔥 recalcular métricas para nueva vista

    construirVistaMensual(mesIndex);
}

function construirVistaMensual(mesIndex) {

    let monthView = document.getElementById("month-view");
    monthView.innerHTML = "";

    let nombreMes = new Date(currentYear, mesIndex, 1).toLocaleString("es-ES", { month: "long" });

    let titulo = document.createElement("h2");
    titulo.textContent = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1) + " " + currentYear;

    monthView.appendChild(titulo);

    let volverBtn = document.createElement("button");
    volverBtn.textContent = "← Volver a vista anual";

    volverBtn.addEventListener("click", () => {
        monthView.style.display = "none";
        document.getElementById("year-view").style.display = "block";
        calcularDimensiones(); // 🔥 recalcular métricas

    });

    monthView.appendChild(volverBtn);

    let tabla = document.createElement("div");
    tabla.style.marginTop = "20px";
    tabla.textContent = "Aquí irá la tabla mensual...";

    monthView.appendChild(tabla);
}

let calendarMetrics;

function calcularDimensiones() {
    let calRect = calendar.getBoundingClientRect();
    let headerHeight = 40;

    calendarMetrics = {
        top: calRect.top,
        height: calRect.height,
        dayHeight: (calRect.height - headerHeight) / 31,
        headerHeight
    };
}

window.addEventListener("load", calcularDimensiones);
window.addEventListener("resize", calcularDimensiones);

calendar.addEventListener("mousemove", (e) => {
    let { top, dayHeight, headerHeight } = calendarMetrics;

    let y = e.clientY - top;

    if (y <= headerHeight) {
        hoverLine.style.display = "none";
        actualizarInfoBar(null, null);
        return;
    }

    let dayIndex = Math.floor((y - headerHeight) / dayHeight);

    if (dayIndex >= 0 && dayIndex < 31) {
        hoverLine.style.display = "block";
        hoverLine.style.top = (headerHeight + dayIndex * dayHeight) + "px";
        hoverLine.style.height = dayHeight + "px";

            // 🔹 Detectar mes por posición horizontal
        let monthColumns = document.querySelectorAll(".month-column");

        let mesDetectado = null;

        monthColumns.forEach((col, index) => {
            let rect = col.getBoundingClientRect();

            if (
                e.clientX >= rect.left &&
                e.clientX <= rect.right
            ) {
                mesDetectado = index;
            }
        });

        if (mesDetectado !== null) {
            actualizarInfoBar(dayIndex + 1, mesDetectado);
        } else {
            actualizarInfoBar(null, null);
        }

    } else {
        hoverLine.style.display = "none";
        actualizarInfoBar(null, null);
    }
});

window.addEventListener("load", () => {
    ajustarAnchoColumnas();
    crearPanelEmpleados();
    pintarVacaciones();
});
