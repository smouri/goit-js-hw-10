import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const listEl = document.querySelector('.country-list');
const divEl = document.querySelector('.country-info');
const inputEl = document.querySelector('#search-box');

const addCounrtyList = arr => {
    divEl.innerHTML = '';

    const list = arr
        .map(el => {
            console.log();
            return `<li class="country-item">
                <img class="country-img" src="${el.flags.svg}" alt="flag">
                <span class="counntry-name">${el.name.common}</span>
            </li>`;
        })
        .join('');

    listEl.innerHTML = `${list}`;
};

const addCounrtyCard = arr => {
    listEl.innerHTML = '';

    const card = arr
        .map(el => {
            const langs = Object.values(el.languages).join(',');

            return `<div class="country-name__wrapper">
                <img class="country-img" src="${el.flags.svg}" alt="flag">
                <span class="country-card-name">${el.name.common}</span>
            </div>
            <ul class="country-info-list">
                <li class="country-info-item">
                    <span class="country-info-text">Capital:</span>
                    ${el.capital}
                </li>
                <li class="country-info-item">
                    <span class="country-info-text">Population:</span>
                    ${el.population}
                </li>
                <li class="country-info-item">
                    <span class="country-info-text">Languages:</span>
                    ${langs}
                </li>
            </ul>
            `;
        })
        .join('');

    divEl.innerHTML = `${card}`;
};

const onSearchForm = event => {
    const countryName = event.target.value.trim();

    if (!countryName) {
        divEl.innerHTML = '';
        listEl.innerHTML = '';
        return;
    }

    fetchCountries(countryName)
        .then(data => {
            if (data.length > 10) {
                divEl.innerHTML = '';
                listEl.innerHTML = '';
                Notiflix.Notify.info(
                    'Too many matches found. Please enter a more specific name.'
                );
            } else if (data.length < 10 && data.length > 1) {
                divEl.innerHTML = '';
                addCounrtyList(data);
            } else {
                addCounrtyCard(data);
            }
        })
        .catch(error => {
            divEl.innerHTML = '';
            listEl.innerHTML = '';
            Notiflix.Notify.failure('Oops, there is no country with that name');
        });
};

const initialSaveData = debounce(onSearchForm, DEBOUNCE_DELAY);

inputEl.addEventListener('input', initialSaveData);