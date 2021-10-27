let accessToken = '';
let url = 'https://graphql.anilist.co';
let login = document.querySelector('#login')
let main = document.querySelector('main');
let submitBtn = document.querySelector('#submit');
let resetBtn = document.querySelector('#reset');
let h2 = document.querySelector('h2');
let h3 = document.querySelector('h3');
let ul = document.querySelector('ul');

if (!accessToken) {
    main.innerHTML = '';
} else {
    login.innerHTML = '';
}

submitBtn.addEventListener('click', e => {
    e.preventDefault()
    let name = document.querySelector('#name').value;
    let type = document.querySelector('input[name="type"]:checked').value;
    let status = document.querySelector('#status').value;
    let getUserMediaTitles = `
        query ($name: String, $type: MediaType, $status: MediaListStatus) {
            Page {
                mediaList (userName: $name, type: $type, status: $status) {
                    media {
                        id,
                        title {
                            romaji,
                            english
                        }
                    }
                }
            }
        }`
    let variables = {
        name: name,
        type: type,
        status: status
    };
    fetch(url, {
        method: "POST",
        headers: {
            "authorization": "Bearer " + accessToken,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            query: getUserMediaTitles,
            variables: variables
        }),
    })
        .then(checkStatus)
        .then(res => res.json())
        .then(data => {
            h2.textContent = `${type}`;
            h3.textContent = `${status}`;
            for (let i = 0; i < data.data.Page.mediaList.length; i++) {
                if (type === 'ANIME') {
                    ul.insertAdjacentHTML('beforeend', `<li>Romaji: ${data.data.Page.mediaList[i].media.title.romaji}<br>
                                                                   English: ${data.data.Page.mediaList[i].media.title.english}<br>
                                                                   Link: <a href="https://anilist.co/anime/${data.data.Page.mediaList[i].media.id}" target="_blank">Click here</a></li>`);
                } else if (type === 'MANGA') {
                    ul.insertAdjacentHTML('beforeend', `<li>Romaji: ${data.data.Page.mediaList[i].media.title.romaji}<br>
                                                                   English: ${data.data.Page.mediaList[i].media.title.english}<br>
                                                                   Link: <a href="https://anilist.co/manga/${data.data.Page.mediaList[i].media.id}" target="_blank">Click here</a></li>`);
                }
            }
        })
});

resetBtn.addEventListener('click', () => {
    h2.textContent = '';
    h3.textContent = '';
    ul.innerHTML = '';
});

function checkStatus(res) {
    if (res.ok) {
        return Promise.resolve(res);
    } else {
        return Promise.reject(new Error(res.statusText));
    }
}