// get all the needed html elements
const elements = {
    todayWeekdayAndDate: document.getElementById("today-weekday-and-date"),
    todayDayInMonth: document.getElementById("today-day-in-month"),
    nowMsUtc: document.getElementById("now-ms-utc"),
    listCurrentWeekdays: document.getElementsByName("current-weekday"),
    numberOfWeekday: document.getElementById("number-of-weekday"),
    currentMonth: document.getElementById("current-month"),
    primeOrNot: document.getElementById("prime-or-not"),
    fullDate: document.getElementById("full-date"),
    body: document.getElementById("holds-background"),
    calendarSheet: document.getElementById("calendar-sheet"),
    calendarSheetCells: document.getElementById("cal-sheet-cells"),
    btnPrevMonth: document.getElementById("btn-prev-month"),
    btnNextMonth: document.getElementById("btn-next-month")
}

const calendarCells = new Array(48).fill(1);
const today = new Date(Date.now());
let selectedDate = today;
let firstOfShownMonth = getFirstOfMonth(today);

let firstMonday;
let lastOfPreviousMonth;
let firstOfNextMonth;
let lastOfCurrentMonth;

let currentMonthElements = [];

function selectDay(date) {
    selectedDate = date;
    loadHistoricEvents(date);
    loadHolidays(date);
    setHtmlElementsData(date);
}

elements.btnNextMonth.onclick = function () {
    console.log("next button clicked!");
    let date = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1);
    drawCalendarSheet(date);
}
elements.btnPrevMonth.onclick = function () {
    console.log("previous button clicked!");
    let date = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);
    drawCalendarSheet(date);
}

function drawCalendarSheet(date) {
    if (!isValidDate(date)) {
        throw new Error("not a valid date");
    }
    if (elements.calendarSheetCells) {
        elements.calendarSheetCells.replaceChildren(); // = delete all children
    }
    firstOfShownMonth = getFirstOfMonth(date);
    setBasicDataForSheet(firstOfShownMonth);

    let totalCount = 0;
    let weekCount = getWeekNr(firstMonday);

    // set the first calendar week
    el = document.createElement("li");
    el.innerText = weekCount.toString();
    el.classList.add('cal-monthly__week-nr');
    elements.calendarSheetCells.appendChild(el);
    totalCount++;
    weekCount++;

    // previous month
    for (i = firstMonday.getDate(); i <= lastOfPreviousMonth.getDate(); i++) {
        el = document.createElement("li");
        el.innerText = i.toString();
        el.classList.add('cal-monthly__day--prev-month');
        //check for weekends
        if (totalCount % 8 >= 6) {
            el.classList.add('cal-monthly__day--weekend');
        }
        elements.calendarSheetCells.appendChild(el);
        totalCount++;
    }

    // current month
    for (i = 1; i <= lastOfCurrentMonth.getDate(); i++) {
        el = document.createElement("li");
        if (totalCount % 8 === 0) {
            el.innerText = weekCount.toString();
            el.classList.add('cal-monthly__week-nr');
            elements.calendarSheetCells.appendChild(el);
            weekCount++;
            totalCount++;
            i--;
        }
        // for all actual days
        else {
            el.innerText = i.toString();
            el.classList.add('cal-monthly__day--current-month');
            //check for weekends
            if (totalCount % 8 >= 6) {
                el.classList.add('cal-monthly__day--weekend');
            }
            // check for today
            if (i === today.getDate() && firstOfShownMonth.getMonth() === today.getMonth()) {
                el.classList.add('cal-monthly__day--today');
            }
            // check for selected day
            if (i === selectedDate.getDate() && firstOfShownMonth.getMonth() === selectedDate.getMonth()) {
                el.classList.add('cal-monthly__day--selected');
            }
            el.addEventListener("click", function () {
                let date = new Date(`${firstOfShownMonth.getFullYear()}-${firstOfShownMonth.getMonth() + 1}-${this.innerText}`);
                selectDay(date);
                drawCalendarSheet(date);
            });
            elements.calendarSheetCells.appendChild(el);
            currentMonthElements.push(el);
            totalCount++;
        }
    }

    // next month
    for (i = 1; totalCount < calendarCells.length; i++) {
        el = document.createElement("li");
        if (totalCount % 8 === 0) {
            el.innerText = weekCount.toString();
            el.classList.add('cal-monthly__week-nr');
            elements.calendarSheetCells.appendChild(el);
            weekCount++;
            totalCount++;
            i--;
        }
        // for all actual days
        else {
            el.innerText = i.toString();
            el.classList.add('cal-monthly__day--next-month');
            //check for weekends
            if (totalCount % 8 >= 6) {
                el.classList.add('cal-monthly__day--weekend');
            }
            elements.calendarSheetCells.appendChild(el);
            totalCount++;
        }
    }
}

function setBasicDataForSheet(date) {
    firstOfShownMonth = getFirstOfMonth(date);
    firstMonday = calcfirstMonday(firstOfShownMonth);
    lastOfPreviousMonth = new Date(firstOfShownMonth.valueOf() - 86400000);
    firstOfNextMonth = (date.getMonth() === 11) ? new Date(date.getFullYear() + 1, 1, 1) : new Date(date.getFullYear(), date.getMonth() + 1, 1);
    lastOfCurrentMonth = new Date(firstOfNextMonth.valueOf() - 86400000);
}

function setHtmlElementsData(date) {
    elements.nowMsUtc.innerHTML = date.getTime().toString();
    elements.todayDayInMonth.innerHTML = date.getDate().toString();
    elements.primeOrNot.innerHTML = dayIsPrime(date.getDate()) ? "eine" : "keine";
    elements.listCurrentWeekdays.forEach((item) => {
        item.innerHTML = date.toLocaleString('de-de', { weekday: 'long' });
    })
    elements.fullDate.innerHTML = date.toLocaleString('de-de', { year: 'numeric', month: '2-digit', day: '2-digit' });
    elements.currentMonth.innerHTML = date.toLocaleString('de-de', { month: 'long' });
    elements.numberOfWeekday.innerHTML = (Math.floor(date.getDate() / 7) + 1).toString();
    elements.calendarSheet.cardTitle = date.toLocaleString('de-de', { month: 'long', year: 'numeric' });
}

drawCalendarSheet(today);
selectDay(today);