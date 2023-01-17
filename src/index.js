import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

console.log('debounce');

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

inputEl.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch() {
  if (!inputEl.value.trim()) {
    infoEl.innerHTML = '';
    listEl.innerHTML = '';
    return;
  }
  fetchCountries(inputEl.value.trim())
    .then(countries => {
      if (countries.length === 1) {
        createCountryDescription(countries);
        listEl.innerHTML = '';
      } else if (countries.length > 10) {
        Notiflix.Notify.warning(
          'Too many matches found. Please enter a more specific name.'
        );
        listEl.innerHTML = '';
        infoEl.innerHTML = '';
      } else if (countries.length >= 2 && countries.length <= 10) {
        createCountryList(countries);
        infoEl.innerHTML = '';
      }
    })
    .catch(error => {
      // if (error === '404') {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      listEl.innerHTML = '';
      infoEl.innerHTML = '';
      // }
    });
}
function createCountryDescription(countries) {
  const markup = countries
    .map(country => {
      return `<img src="${country.flags.svg}" alt="flag" width="25">
    <h2 class="text">${country.name.official}<span></span></h2>
    <p><span class="text">Capital: </span>${country.capital}</p>
    <p><span class="text">Population: </span>${country.population}</p>
    <p><span class="text">Languages: </span>${Object.values(
      country.languages
    )}</p>`;
    })
    .join('');
  infoEl.innerHTML = markup;
}
function createCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<li>
        <img src="${country.flags.svg}" alt="flag" width="25">
        <p class="country-text">${country.name.official};</p>
      </li>`;
    })
    .join('');
  listEl.innerHTML = markup;
}
