let darkmode = localStorage.getItem('darkmode');
const modeToggle = document.getElementById('theme-toggle');

function setBackgroundColors() {
    colorSurface = window.getComputedStyle(document.body).getPropertyValue('--surface');
    colorSurfaceVariant = window.getComputedStyle(document.body).getPropertyValue('--surface-variant');

    colorCellDead = parseHexToRgbObject(colorSurface);
    colorCellAlive = parseHexToRgbObject(colorSurfaceVariant);
}

function setDarkMode(darkmodeState) {
    localStorage.setItem('darkmode', darkmodeState);
    document.body.setAttribute("darkmode", darkmodeState);

    if (darkmodeState === "on") {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    //needs to be called after setting the "dark-mode" class on body
    setBackgroundColors();
}

setDarkMode(darkmode);

modeToggle.addEventListener("click", function () {
    darkmode = (darkmode === "on") ? "off" : "on";
    setDarkMode(darkmode);
})