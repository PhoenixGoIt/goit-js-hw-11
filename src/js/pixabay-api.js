import axios from "axios";
import Notiflix from 'notiflix';
import getRefs from "./refs";

export class pixabayApi {
  constructor() {
    this.baseUrl = 'https://pixabay.com/api/';
    this.apiKey = '24796012-24b5258be9d2a1f3ae4215f6c';
    this.perPage = 40;
    this.page = 1
    this.refs = new getRefs();
  }
  
  async search(query) {
    const url = `${this.baseUrl}?key=${this.apiKey}&q=${query}&page=${this.page}&per_page=${this.perPage}&orientation=horizontal&safesearch=true`;

    const response = await axios.get(url);

    if (response.data.totalHits === 0){
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
      this.refs.loadMoreBtn.classList.add('hidden')
      this.resetMarkup(this.refs.gallery)
      throw new Error ('Sorry, there are no images matching your search query. Please try again.')
    }

    this.incrementPage()

    this.refs.loadMoreBtn.classList.remove('hidden')

    return response.data.hits;

  }

  incrementPage(){
    this.page += 1;
  } 
  
  resetMarkup(el) {
    el.innerHTML = '';
  }

  resetPage(){
    this.page = 1
  }
} 