import { pixabayApi } from "./js/pixabay-api.js";
import Notiflix from 'notiflix';
import getRefs from "./js/refs.js";

const Pixabay = new pixabayApi();
const refs = getRefs();

refs.form.addEventListener('submit', submitForm);
refs.loadMoreBtn.addEventListener('click', loadMore);
refs.input.addEventListener('input', inputForm);

let inputValue = null;
refs.searchBtn.disabled = true
function inputForm(e) {
    refs.searchBtn.disabled = false
  inputValue = e.target.value.trim();

  if (!inputValue) {
    resetMarkup(refs.gallery);
    Notiflix.Notify.info('Gallery cleared!');
    refs.loadMoreBtn.classList.add('hidden');
    refs.searchBtn.disabled = true
    return;
  }
}

async function loadMore(e) {
  try {
    const data = await Pixabay.search(inputValue);
    renderImg(data.hits);
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
    if (data.totalHits !== 0) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)
    }
    if (data.totalHits === 0){
      Notiflix.Notify.failure(`We found ${data.totalHits} images.`)
      hiddenBtn()
      resetMarkup(refs.gallery)
      throw new Error ('Sorry, there are no images matching your search query. Please try again.')
  }
  if (data.totalHits <= 12) {
    hiddenBtn()
  }
    renderImg(data.hits);
  } catch (error) {
    console.error(error);
}
function hiddenBtn() {
  refs.loadMoreBtn.classList.add('hidden')
}

}
function renderImg(data) {
  if (data !== undefined) {
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
}

function resetMarkup(el) {
  el.innerHTML = '';
}
