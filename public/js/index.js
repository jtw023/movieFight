// what to show on the autocomplete
const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
<img src="${imgSrc}"/>
${movie.Title}
(${movie.Year})
`;
    },

    // what should go inside of the input when a choice is made
    inputValue(movie) {
        return movie.Title;
    },
    // actually fetch the data or show an alert if we get an empty response back
    async fetchData(searchTerm) {
        const response = await axios.get('https://www.omdbapi.com/', {
            params: {
                apikey: 'e926c0f2',
                s: searchTerm,
            },
        });

        if (response.data.Error) {
            alert(
                'No results found. Please make sure to enter the full movie title.'
            );
            return [];
        }

        return response.data.Search;
    },
};

// customize first autocomplete function to this specific project
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    // what to do when someone clicks on an option
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    },
});

// customize second autocomplete function to this specific project
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    // what to do when someone clicks on an option
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    },
});

let leftMovie;
let rightMovie;

// The final call to the api to display all of the info about a specific movie
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('https://www.omdbapi.com/', {
        params: {
            apikey: 'e926c0f2',
            i: movie.imdbID,
        },
    });

    summaryElement.innerHTML = movieTemplate(response.data);

    if (side === 'left') {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }

    if (leftMovie && rightMovie) {
        runComparison();
    }
};

const runComparison = () => {
    const leftSideStats = document.querySelectorAll(
        '#left-summary .notification'
    );
    const rightSideStats = document.querySelectorAll(
        '#right-summary .notification'
    );

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];

        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);

        if (rightSideValue > leftSideValue) {
            rightStat.classList.remove('is-info');
            rightStat.classList.add('is-primary');
            leftStat.classList.remove('is-info');
            leftStat.classList.add('is-warning');
        } else {
            leftStat.classList.remove('is-info');
            leftStat.classList.add('is-primary');
            rightStat.classList.remove('is-info');
            rightStat.classList.add('is-warning');
        }
    });
};

const movieTemplate = (movieDetail) => {
    const runtime = parseInt(movieDetail.Runtime.replace(/'min'/g, ''));

    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);

        if (isNaN(value)) {
            return prev;
        } else {
            return prev + value;
        }
    }, 0);

    const rating = parseFloat(movieDetail.imdbRating);

    const votes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));

    return `
  <article class="media">
  <figure class="media-left">
  <p class="image">
  <img src="${movieDetail.Poster}" />
  <h2 class="title" id="title">${movieDetail.Title} - Rated ${movieDetail.Rated}</h2>
  </p>
  </figure>
  <div class="media-content">
  <div class="content">
  <h4>${movieDetail.Genre}</h4>
  <h6>Top Actors: ${movieDetail.Actors}</h6>
  <p class="underline">Summary</p>
  <p>${movieDetail.Plot}</p>

  </div>
  </div>
  </article>
  <article id="boxes" data-value=${runtime} class="notification is-info">
  <p class="title">Runtime: ${movieDetail.Runtime}</p>
  </article>
  <article id="boxes" data-value=${awards} class="notification is-info">
  <p class="title">${movieDetail.Awards}</p>
  <p class="subtitle">Awards</p>
  </article>
  <article id="boxes" data-value=${rating} class="notification is-info">
  <p class="title">${movieDetail.imdbRating}</p>
  <p class="subtitle">IMDB Rating</p>
  </article>
  <article id="boxes" data-value=${votes} class="notification is-info">
  <p class="title">${movieDetail.imdbVotes}</p>
  <p class="subtitle">IMDB Votes</p>
  </article>
  `;
};
