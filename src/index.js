import axios from "axios";
import Notiflix from "notiflix";

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

let page = 1;
let searchQuery = '';

async function fetchImages(query, pageNum) {
    try {
        const apiKey = '40077620-b33d7d6f744e065ea0d98c96c';
        const perPage = 40;
        const response = await axios.get('https://pixabay.com/api/', {
            params: {
                key: apiKey,
                q: query,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                page: pageNum,
                per_page: perPage,
            },
        });
        
        return response.data;
    } catch (error) {
        console.error('Error fetching images:', error);
        return null;
    }
}

function renderImageCards(images) {
    images.forEach((image) => {
        const card = document.createElement('div');
        card.className = 'photo-card';
        card.innerHTML = `
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
            <div class="info">
                <p class="info-item"><b>Likes:</b> ${image.likes}</p>
                <p class="info-item"><b>Views:</b> ${image.views}</p>
                <p class "info-item"><b>Comments:</b> ${image.comments}</p>
                <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
            </div>
        `;
        gallery.appendChild(card);
    });
}


searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    page = 1;
    searchQuery = searchForm.searchQuery.value;
    gallery.innerHTML = '';
    loadMoreButton.style.display = 'none';
    const imagesData = await fetchImages(searchQuery, page);
    if (imagesData && imagesData.hits.length > 0) {
        renderImageCards(imagesData.hits);
        if (imagesData.hits.length === 40) {
            loadMoreButton.style.display = 'block';
        }
    } else {
        Notiflix.Notify.failure("Вибачте. Не знайдено жодного зображення яке б відповідало вашому запиту");
    }
});

loadMoreButton.addEventListener('click', async () => {
    page++;
    const imagesData = await fetchImages(searchQuery, page);
    if (imagesData && imagesData.hits.length > 0) {
        renderImageCards(imagesData.hits);
        if (imagesData.hits.length < 40) {
            loadMoreButton.style.display = 'none';
        }
    } else {
        loadMoreButton.style.display = 'none';
        Notiflix.Notify.info("Ви досягли кінця списку результатів.");
    }
});
