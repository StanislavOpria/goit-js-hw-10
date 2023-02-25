import './css/styles.css';
import fetchCountrys from './fetchCountries';
import Notiflix from 'notiflix';

const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
const input = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const contryInfo = document.querySelector('.country-info');

// console.log(input, contryInfo, countryList);
input.addEventListener('input', debounce(searchCountrys, DEBOUNCE_DELAY));

function searchCountrys(e) {
  const name = e.target.value.trim();
  if (name) {
    fetchCountrys(name)
      .then(renderMarkup)
      .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        countryList.innerHTML = '';
        contryInfo.innerHTML = '';
      });
  }
  countryList.innerHTML = '';
  contryInfo.innerHTML = '';
}

function renderMarkup(countrys) {
  if (countrys.length === 1) {
    renderOneCountry(countrys);
    countryList.innerHTML = '';
  } else if (countrys.length > 1 && countrys.length < 11) {
    renderCountrys(countrys);
    contryInfo.innerHTML = '';
  } else if (countrys.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    countryList.innerHTML = '';
    return;
  }
}

function renderOneCountry(countrys) {
  const markup = countrys
    .map(({ name, capital, population, flags, languages }) => {
      return `<img class="flag" width = 28 src=${flags.svg} alt="flag icon">
          <p class="name"><b>${name.official}</b></p>
          <p class="capital">Capital: ${capital}</p>
          <p class="population">Population: ${population}</p>
<p class="languages">Languages: ${Object.values(languages)}</p>`;
    })
    .join('');
  contryInfo.innerHTML = markup;
}

function renderCountrys(countrys) {
  const markup = countrys
    .map(({ name, flags }) => {
      return `<li><img class="flag" width = 28 src=${flags.svg} alt="flag icon">
          <p class="name"><b>${name.official}</b></p></li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}
