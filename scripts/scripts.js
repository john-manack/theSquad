'use strict';

const apiKey = '4d8fb5b93d4af21d66a2948710284366';
const generateWeather = document.querySelector('#generateWeather');

generateWeather.addEventListener('submit', event => {
    event.preventDefault();

    const citySelector = document.querySelector('#cityInput');
    const stateSelector = document.querySelector('#stateInput')
    const countrySelector = document.querySelector('#countryInput')

    console.log(stateSelector.value);
    if (stateSelector.value !== 'None' && stateSelector.value !== 'Select State') {
        let inputArray = [citySelector, stateSelector, countrySelector];
        getWeatherWithState(inputArray[0].value, inputArray[1].value, inputArray[2].value);
    } else {
        let inputArray = [citySelector, countrySelector];
        getWeatherNoState(inputArray[0].value, inputArray[1].value)
    }
});

function getWeatherWithState(city, state, country) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},${country}&units=imperial&appid=${apiKey}`;
    console.log(url);
    get(url).then(response => {
        updateBody(response.name, response.sys.country, response.main.temp, response.main.feels_like, response.weather[0].description, response.main.temp_max, response.main.temp_min)
        console.log(response)
    });
}

function getWeatherNoState(city, country) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=imperial&appid=${apiKey}`;
    console.log(url);
    get(url).then(response => {
        updateBody(response.name, response.sys.country, response.main.temp, response.main.feels_like, response.weather[0].description, response.main.temp_max, response.main.temp_min)
        console.log(response)
    });
}

function getState() {
    const url ="https://gist.githubusercontent.com/mshafrir/2646763/raw/8b0dbb93521f5d6889502305335104218454c2bf/states_titlecase.json";
    get(url).then(response => {
        buildStateList(response);
    })

    function buildStateList(responseObject) {
        let stateArray = [];
        responseObject.forEach(element => stateArray.push(element["abbreviation"]));
        addStateSelectors(stateArray)
    }

    function addStateSelectors(array1) {
        
        const stateSelect = document.querySelector("#stateInput");
        array1.map(state => {
            let stateOption = document.createElement('option');
            stateOption.value = state;
            stateOption.text = state;
            stateSelect.appendChild(stateOption);
        });
    }
}

getState();

function getCountry() {
    const url ="https://restcountries.eu/rest/v2/all";
    get(url).then(response => {
        buildCountryList(response);
    })

    function buildCountryList(responseObject) {
        let countryArray = [];
        responseObject.forEach(element => countryArray.push(element["name"]));
        addCountrySelectors(countryArray);
    }

    function addCountrySelectors(array1) {
        const countrySelect = document.querySelector("#countryInput");
        array1.map(country => {
            let countryOption = document.createElement('option');
            countryOption.value = country;
            countryOption.text = country;
            countrySelect.appendChild(countryOption);
        });
    }
}

getCountry();

function updateBody(city, country, currentTemp, feelsLike, description, high, low) {
    let reportArray = [city, country]
    const placeholders = document.querySelectorAll('.location_placeholder');
    placeholders.forEach(function (placeholders, index) {
        placeholders.innerHTML = reportArray[index];
    });

    const masterDiv = document.querySelector('#reportWeatherData');
    masterDiv.style.display = "initial";
    const div1 = document.querySelector('#reportCurrentTemp');
    div1.innerHTML = (`<p class="output-span">Current Temperature: </p>` + `<p class="output-p">${currentTemp}<sup>°F</sup></p>`);
    const div2 = document.querySelector('#reportFeelsLike');
    div2.innerHTML = (`<p class="span">Feels Like: </p>` + `<p class="output-p">${feelsLike}<sup>°F</sup></p>`);
    const div3 = document.querySelector('#reportDescription');
    div3.innerHTML = description;
    const div4 = document.querySelector('#reportHigh');
    div4.innerHTML = (`<p class="span">Today's High: </p>` + `<p class="output-p">${high}<sup>°F</sup></p>`);
    const div5 = document.querySelector('#reportLow');
    div5.innerHTML = (`<p class="span">Today's Low: </p>` + `<p class="output-p">${low}<sup>°F</sup></p>`);
}