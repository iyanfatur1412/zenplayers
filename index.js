const content = document.querySelector(".content");
const navsBtn = document.querySelectorAll(".navs span");
const navs = [...navsBtn];
let audio = new Audio();

navs.map( btn => {
    btn.addEventListener("click", function() {
        let key = this.dataset.name;
        navs.forEach(item => item.classList.remove("active"));
        this.classList.add("active");
        if(key == "song") {
            getAllData(showAllSong);
        }else if(key == "album") {
            getArtistDatabase(showSongByAlbum);
        }else if(key == "artist") {
            getArtistDatabase(showSongByArtist);
        }
    })
})

getAllData(showAllSong);


function getAllData(callback) {
    fetch("data.json").then(response => response.json()).then(response => callback(response)).catch(response => callback(response));
}

function getDataById(callback, key) {
    fetch("data.json").then(response => response.json()).then(response => callback(response[key])).catch(response => callback(response));
}

function getDataBySpesific(callback, key, value) {
    fetch("data.json").then(response => response.json())
    .then(response => {
        let data = response.filter(item => item[key] == value);
        callback(data);
    })
    .catch(response => callback(response));
}

function getArtistDatabase(callback) {
    fetch("artist.json")
    .then(response => response.json())
    .then(response => callback(response))
    .catch(response => callback(response));
}

function showAllSong(data) {
    let card = "";
    data.sort((a, b) => a.song.localeCompare(b.song));
    data.forEach((item, id) => card += elSong(item, id));
    content.innerHTML = `<div class="content-row">${card}</div>`;
    chooseSong();
}

function showSongByAlbum(data) {
    let card = "";
    let arr = [];
    data.forEach(item => {
        item.album.forEach(count => arr.push(count));
    })
    arr.sort((a, b) => a.title.localeCompare(b.title));
    arr.forEach(album => card += elAlbum(album));
    content.innerHTML = `<div class="content-column">${card}</div>`;
    showDetailSong("album");
}

function showSongByArtist(data) {
    let card = "";
    data.sort((a, b) => a.artist.localeCompare(b.artist));
    data.forEach(item => card += elArtist(item));
    content.innerHTML = `<div class="content-column">${card}</div>`;
    showDetailSong("artist");
}

function showDetailSong(key) {
    const cardVertical = document.querySelectorAll(".card-vertical");
    let card = [...cardVertical];
    card.map(btn => {
        btn.addEventListener("click", function() {
            getDataBySpesific(showAllSong, key, this.dataset.title);
        })
    })
}

function chooseSong() {
    const file = document.querySelectorAll(".card");
    const song = [...file];
    song.map(btn => {
        btn.addEventListener("click", function() {
            audioCheck(this.dataset.file);
            getDataBySpesific(setCurrentSong, "file", this.dataset.file)
        })
    })
}

function audioCheck(src) {
    if(audio.paused == true) {
        audio.src = "file/" + src;
        audio.play();
        loadData();
    }else {
        audio.pause();
        audio.src = "file/" + src;
        audio.play();
        loadData();
    }
}

function loadData() {
    const elLoad = document.querySelector(".loading-col");
    audio.addEventListener("loadstart", function() {
        elLoad.innerHTML = eLoad();
    })
    audio.addEventListener("playing", function() {
        elLoad.innerHTML = "";
    })
}

function setCurrentSong(data) {
    const currentInfo = document.querySelector(".current-info");
    let card = "";
    data.forEach(item => card += elCurrentSong(item));
    currentInfo.innerHTML = card;
}

function elCurrentSong(data) {
    return `
    <figure class="card">
        <div class="img">
            <img src="img/${data.img}" alt="">
        </div>
        <figcaption>
            <h4>${data.song}</h4>
            <p>${data.artist}</p>
        </figcaption>
    </figure>
    `
}

function elArtist(data) {
    return `
    <figure class="card-vertical" data-title="${data.artist}">
        <div class="img">
            <img src="img/${data.img}" alt="">
        </div>
        <figcaption>
            <h4>${data.artist.substring(0, 9)}</h4>
        </figcaption>
    </figure>
    `
}

function elAlbum(data) {
    return `
    <figure class="card-vertical" data-title="${data.title}">
        <div class="img">
            <img src="img/${data.img}" alt="">
        </div>
        <figcaption>
            <h4>${data.title.substring(0,9)}</h4>
        </figcaption>
    </figure>
    `
}

function elSong(data, id) {
    return `
    <figure class="card" data-id='${id}' data-file='${data.file}'>
        <div class="img">
            <img src="img/${data.img}" alt="">
        </div>
        <figcaption>
            <h4>${data.song}</h4>
            <p>${data.artist}</p>
        </figcaption>
    </figure>
    `
}

function eLoad() {
    return `
    <div class="loading">
        <p>Processing Song...</p>
    </div>
    `
}