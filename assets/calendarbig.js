const calendarDays = document.getElementById("calendar-days");
const monthYear = document.getElementById("month-year");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");

let currentDate = new Date();

const events = {
    "2024-02-02": "yellow",
    "2024-02-05": "blue",
    "2024-02-08": "yellow",
    "2024-02-16": "blue",
    "2024-02-25": "yellow",
    "2024-02-27": "yellow"
};

function renderCalendar(date) {
    calendarDays.innerHTML = "";

    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevMonthLastDate = new Date(year, month, 0).getDate();

    const startIndex = (firstDay === 0) ? 6 : firstDay - 1;
    const totalCells = 6 * 7;

    for (let i = startIndex - 1; i >= 0; i--) {
        const prevDayDiv = document.createElement("div");
        prevDayDiv.innerText = prevMonthLastDate - i;
        prevDayDiv.classList.add("faded");
        calendarDays.appendChild(prevDayDiv);
    }

    for (let day = 1; day <= lastDate; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.innerText = day;
        const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        if (fullDate in events) {
            const eventDiv = document.createElement("div");
            eventDiv.classList.add("event", `event-${events[fullDate]}`);
            dayDiv.appendChild(eventDiv);
        }

        const realDate = new Date();
        if (day === realDate.getDate() && month === realDate.getMonth() && year === realDate.getFullYear()) {
            dayDiv.classList.add("ctoday");
        }
        calendarDays.appendChild(dayDiv);
    }

    let remainingCells = totalCells - (startIndex + lastDate);
    for (let i = 1; i <= remainingCells; i++) {
        const nextDayDiv = document.createElement("div");
        nextDayDiv.innerText = i;
        nextDayDiv.classList.add("faded");
        calendarDays.appendChild(nextDayDiv);
    }

    monthYear.innerText = date.toLocaleString("default", { month: "long", year: "numeric" });
}

prevMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

nextMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

renderCalendar(currentDate);
