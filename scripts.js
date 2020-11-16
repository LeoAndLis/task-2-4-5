const responseList = document.querySelector('.response-list');
const repList = document.querySelector('.rep-list');
const input = document.querySelector('.form__input');
const url = 'https://api.github.com/search/repositories';

const debounce = (fn, debounceTime) => {
    let inDebouns;
    return function() {
        clearTimeout(inDebouns);
        inDebouns = setTimeout(() => fn.apply(this, arguments), debounceTime);
    }
};

function addLiToListHandler(name, owner, stars) {
    const fragment = document.createRange().createContextualFragment(
        `<li class="rep-list__item">
            <ul class="rep-data-list">
                <li class="rep-data-list__item">Name: ${name}</li>
                <li class="rep-data-list__item">Owner: ${owner}</li>
                <li class="rep-data-list__item">Stars: ${stars}</li>
            </ul>
            <button class="rep-list__delete-item" onclick="deleteRepItemHandler(this)"></button>
        </li>`
    );

    repList.appendChild(fragment);
    responseList.innerHTML = '';
    input.value = '';
}

function deleteRepItemHandler(el) {
    el.closest('.rep-list__item').remove();
}

async function getData() {
    if (this.value === '') {
        responseList.innerHTML = "";
        return;
    }

    let resUrl = url + '?q=' + this.value;

    const response = await fetch(resUrl);

    if ( !response.ok) {
        alert("Ошибка HTTP: " + response.status);
        return;
    }

    let json = await response.json();
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 5; i++) {
        if ( json.items[i] === undefined ) {
            break;
        }
        const {name, stargazers_count: stars, owner:{login: owner}} = json.items[i];
        const li = document.createElement('li');
        li.classList.add('response-list__item');
        li.innerText = json.items[i].name;
        li.onclick = () => addLiToListHandler(name, owner, stars);

        fragment.appendChild(li);
    }

    responseList.innerHTML = "";
    responseList.appendChild(fragment);
}

const debouncedRequestHandler = debounce(getData, 500);

input.addEventListener('input', debouncedRequestHandler);