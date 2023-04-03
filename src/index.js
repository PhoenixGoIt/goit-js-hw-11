import { pixabayApi } from "./js/pixabay-api.js";
import Notiflix from 'notiflix';
import axios from "axios";
import getRefs from "./js/refs.js";

const Pixabay = new pixabayApi();
const refs = getRefs();

refs.form.addEventListener('submit', submitForm);
refs.loadMoreBtn.addEventListener('click', loadMore);
refs.input.addEventListener('input', inputForm);

let inputValue = null;

function inputForm(e) {
  inputValue = e.target.value.trim();

  if (!inputValue) {
    resetMarkup(refs.gallery);
    Notiflix.Notify.info('Gallery cleared!');
    refs.loadMoreBtn.classList.add('hidden');
    return;
  }
}

async function loadMore(e) {
  try {
    const data = await Pixabay.search(inputValue);
    renderImg(data);
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure('Sorry, something went wrong!');
  }
}

async function submitForm(e) {
  e.preventDefault();
  Pixabay.resetPage();
  resetMarkup(refs.gallery);
  try {
    const data = await Pixabay.search(inputValue);
    renderImg(data);
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure('Sorry, something went wrong!');
  }
}

function renderImg(data) {
  const markup = data.map(({ likes, views, comments, downloads, webformatURL }) => {
      return `<div class="photo-card">
        <img src="${webformatURL}" alt="" loading="lazy" width="420" height="300"/>
        <ul class="info">
          <li class="info-item">
            <p>Likes</p> 
            <b>${likes}</b>
          </li>
          <li class="info-item">
            <p>Views</p> 
            <b>${views}</b>
          </li>
          <li class="info-item">
            <p>Comments</p> 
            <b>${comments}</b>
          </li>
          <li class="info-item">
            <p>Downloads</p>
            <b>${downloads}</b>
          </li>
        </ul>
      </div>`;
    })
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function resetMarkup(el) {
  el.innerHTML = '';
}