function calcfirstMonday(date) {
    firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    let factor = (firstOfMonth.getDay() + 6) % 7;
    let firstMonday = new Date(firstOfMonth.valueOf() - (86400000 * factor));
    return firstMonday;
}

function getWeekNr(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return weekNo;
}

function isValidDate(value) {
    return value instanceof Date && !isNaN(value);
}

function dayIsPrime(dateNumber) {
    return ([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31].includes(dateNumber));
}

function getFirstOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}