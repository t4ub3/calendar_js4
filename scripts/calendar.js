const ARROW_RIGHT_PATH = "M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z";
const ARROW_LEFT_PATH = "m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z";
const TODAY_PATH = "M289-329q-29-29-29-71t29-71q29-29 71-29t71 29q29 29 29 71t-29 71q-29 29-71 29t-71-29ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z";

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
    cardCalendarSheet: document.getElementById("card-calendar-sheet"),
    calendarSheetCells: document.getElementById("cal-sheet-cells")
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

function initCalendar() {
    drawCalendarSheet(today);
    setupActionButtons();
    selectDay(today);
}

function drawCalendarSheet(date) {
    if (!isValidDate(date)) {
        throw new Error("not a valid date");
    }
    setCalendarSheetTitle(date);
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

    // previous month (if current does not start on monday)
    if (firstOfShownMonth.getDay() != 1) {
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

function selectDay(date) {
    selectedDate = date;
    loadHistoricEvents(date);
    loadHolidays(date);
    setHtmlElementsData(date);
}

function setupActionButtons() {
    let buttons = document.createElement("div");
    buttons.classList.add("card__button-group");
    let btnPrevWithIcon = buildStyledButtonWithSvgIcon(ARROW_LEFT_PATH, "card__button", "card__button-icon");
    let btnNextWithIcon = buildStyledButtonWithSvgIcon(ARROW_RIGHT_PATH, "card__button", "card__button-icon");
    let btnTodayWithIcon = buildStyledButtonWithSvgIcon(TODAY_PATH, "card__button", "card__button-icon");

    btnPrevWithIcon.onclick = function () {
        let date = new Date(firstOfShownMonth.getFullYear(), firstOfShownMonth.getMonth() - 1, 1);
        drawCalendarSheet(date);
    }
    btnNextWithIcon.onclick = function () {
        let date = new Date(firstOfShownMonth.getFullYear(), firstOfShownMonth.getMonth() + 1, 1);
        drawCalendarSheet(date);
    }
    btnTodayWithIcon.onclick = function () {
        drawCalendarSheet(today);
        selectDay(today);
    }

    buttons.append(btnPrevWithIcon, btnTodayWithIcon, btnNextWithIcon);
    elements.cardCalendarSheet.setActionsContent(buttons);
}

function buildStyledButtonWithSvgIcon(svgPath, classButton, classIcon) {
    let button = document.createElement("button");
    button = addIconToElement(button, svgPath, classIcon);
    button.classList.add(classButton);
    return button;
}

// !!! only works with fontawesome icons with default settings
function addIconToElement(el, svgPath, classIcon) {
    const svgNamespace = "http://www.w3.org/2000/svg";
    let icon = document.createElementNS(svgNamespace, "svg");
    icon.classList.add(classIcon);
    icon.setAttribute("height", "24px");
    icon.setAttribute("width", "24px");
    icon.setAttribute("viewBox", "0 -960 960 960");
    let pathElement = document.createElementNS(svgNamespace, "path");
    pathElement.setAttribute("d", svgPath);
    icon.appendChild(pathElement);
    el.appendChild(icon);
    return el;
}

function setCalendarSheetTitle(date) {
    elements.cardCalendarSheet.cardTitle = date.toLocaleString('de-de', { month: 'long', year: 'numeric' });
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
}
