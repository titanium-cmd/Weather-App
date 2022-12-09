require('dotenv').config();

window.addEventListener('load', () => {
    const getLocBtn = document.querySelector('#top-section > button');
    const searchBtn = document.querySelector('#search-bar > button');
    const searchBox = document.querySelector('#search-bar > input');
    const BASE_URL = `https://api.openweathermap.org/data/2.5/weather`;
    const API_KEY = process.env.API_KEY;
    getCurrentWeather(BASE_URL, API_KEY);

    getLocBtn.addEventListener("click", ()=>{
        getCurrentWeather(BASE_URL, API_KEY);
    });

    searchBtn.addEventListener('click', ()=>{
        detailsIsShowing(false);
        const customLocation = searchBox.value;
        if (customLocation === ''){
            displayMessage('Enter Location', false);
            setTimeout(()=>displayMessage('', true), 2000); 
        }else{
            searchBox.value = '';
            displayMessage('Loading...', true);
            getSearchedCityWeather(BASE_URL, API_KEY, customLocation);
        }
    });
});

const displayMessage = (msg, state) => {
    const message = document.querySelector('#message > p');
    (state) ? message.style.color = 'black':  message.style.color = 'rgb(165, 30, 30)';
    message.textContent = msg;
}

const getSearchedCityWeather = async (BASE_URL, API_KEY, customLocation) => {
    try {
        const res = await fetch(`${BASE_URL}?q=${customLocation}&appid=${API_KEY}`);
        const data = await res.json();
        if (res.status == 200) {
            displayMessage('', true);
            displayDetails(data);
        }else{
            displayMessage(data.message, false);
        }
    } catch (error) {
        console.log(error.message);
    }
}

const getCurrentWeather = (BASE_URL, API_KEY) => {
    detailsIsShowing(false);
    navigator.geolocation.getCurrentPosition(async (position)=>{
        displayMessage('Loading...', true);
        const {latitude, longitude} = position.coords;
        const api = `${BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
        try {
            const res = await fetch(api);
            if (res.status == 200) {
                const data = await res.json();
                displayMessage('', true);
                displayDetails(data);
            }
        } catch (error) {
            console.log(error);
        }
    }, (err)=>{
        console.log(err);
    });
}

const kelvinToCelcius = (temp) => {
    return Math.round(temp - 273.15);
}

const displayDetails = (data) => {
    const icon = document.querySelector('#icon');
    const _main = document.querySelector('#main');
    const city = document.querySelector('#city');
    const temperature = document.querySelector('#temp');
    const {weather, main, sys} = data;
    const date = new Date().toString().substr(0, 15);

    const dateTag = document.createElement('small');
    dateTag.append(`as at ${date}`);
    dateTag.style.color = '#FFFFFF';
    city.innerHTML = `Weather report for ${data.name} in ${sys.country} <br/>`; 
    city.appendChild(dateTag);
    temperature.textContent = `${kelvinToCelcius(main.temp)}°c`;
    _main.textContent = `${weather[0].main} | ${weather[0].description}`;
    icon.setAttribute('src', 'https://openweathermap.org/img/wn/'+weather[0].icon+'.png');
    detailsIsShowing(true);
}

const detailsIsShowing = (showing) => {
    const detailsSection = document.querySelector('#details');

    if(showing){
        detailsSection.style.visibility = 'visible';
    }else{
        detailsSection.style.visibility = 'hidden';
    }
}