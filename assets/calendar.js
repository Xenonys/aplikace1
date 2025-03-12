const calendarDays = document.getElementById("calendar-days");
const monthYear = document.getElementById("month-year");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");

let currentDate = new Date();

function renderCalendar(date) {
    calendarDays.innerHTML = "";

    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // Get first day of the month (0=Sunday, 6=Saturday)
    const lastDate = new Date(year, month + 1, 0).getDate();

    monthYear.innerText = date.toLocaleString("default", { month: "long", year: "numeric" });

    // Adjust start index so Monday is the first day
    const startIndex = (firstDay === 0) ? 6 : firstDay - 1;

    // Add empty divs for alignment
    for (let i = 0; i < startIndex; i++) {
        const emptyDiv = document.createElement("div");
        calendarDays.appendChild(emptyDiv);
    }

    // Populate days
    for (let day = 1; day <= lastDate; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.innerText = day;
        const realDate = new Date();
        if (day === realDate.getDate() && month === realDate.getMonth() && year === realDate.getFullYear()) {
            dayDiv.classList.add("today");
        }
        calendarDays.appendChild(dayDiv);
    }
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
