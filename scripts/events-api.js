const API_BASE_URL = "https://history.muffinlabs.com/date";

const eventsWrapper = document.getElementById("events-wrapper");

function loadHistoricEvents(date) {
    if (!isValidDate(date)) {
        throw new Error("not a valid date");
    }
    const url = buildUrl(date);
    console.log(url);
    fetchHistoricEvents(url);
}


//API call
function fetchHistoricEvents(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayData(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// build the url string for a given date
function buildUrl(date) {
    if (!isValidDate(date)) {
        return `${API_BASE_URL}/1/1`;
    }
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return `${API_BASE_URL}/${month}/${day}`;
}

function isValidDate(value) {
    return value instanceof Date && !isNaN(value);
}

// filters the data and renders it on the website
function displayData(data) {
    let events = pickRandom(5, data.data.Events);
    let birthdays = pickRandom(5, data.data.Births);
    let deaths = pickRandom(5, data.data.Deaths);
    renderCard("events-historic-content", events);
    renderCard("events-deaths-content", deaths);
    renderCard("events-birthdays-content", birthdays);
}

//renders a card at the end of the website
function renderCard(elementId, data) {
    let cardContent = document.getElementById(elementId);

    let list = document.createElement("dl");
    data.forEach(el => {
        let date = document.createElement("dt");
        date.classList.add("card__text--light");
        date.innerHTML = el.year;
        list.appendChild(date);
        let text = document.createElement("dd");
        text.innerHTML = el.text;
        list.appendChild(text);
    });
    
    cardContent.replaceChildren(list);
    // cardContent.appendChild(list);
}

// select n random elements from a list 
function pickRandom(amount, list) {
    if (!Array.isArray(list)) {
        throw new TypeError("First argument must be an array.");
    }
    if (typeof amount !== "number" || amount < 0 || !Number.isInteger(amount)) {
        throw new TypeError("Second argument must be a non-negative integer.");
    }
    if (amount > list.length) {
        return list;
    }

    const shuffled = [...list].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, amount);
}

// loadHistoricEvents();