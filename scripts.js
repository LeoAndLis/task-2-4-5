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

    responseList.innerHTML = "";

    let resUrl = url + '?q=' + this.value.trim().split('').map(el => el === ' ' ? '+' : el).join('');

    const response = await fetch(resUrl);

    if ( !response.ok) {
        alert("Ошибка HTTP: " + response.status);
        return;
    }

    let json = await response.json();
    const fragment = document.createDocumentFragment();
    let i = 0;

    while( i < 5 && json.items[i] ) {
        let name = json.items[i].name;
        let owner = json.items[i].owner.login;
        let stars = json.items[i].stargazers_count;
        const li = document.createElement('li');
        li.classList.add('response-list__item');
        li.innerText = json.items[i].name;
        li.onclick = () => addLiToListHandler(name, owner, stars);
        fragment.appendChild(li);
        i++;
    }

    if ( i > 0 ) {
        responseList.appendChild(fragment);
    }

    return;
}

const debouncedRequestHandler = debounce(getData, 500);

input.addEventListener('keydown', debouncedRequestHandler);