const content = document.querySelector(".content");
const navsBtn = document.querySelectorAll(".navs span");
const navs = [...navsBtn];
let audio = new Audio();
const btn = document.getElementById("dark-mode-btn");
const body = document.querySelector("body");
const navbar = document.querySelector(".navbar");
const navsu = document.querySelector(".navs");
const container = document.querySelector(".container");
const contento = document.querySelector(".content");
const bawah = document.querySelector(".current-play")
const logo = document.querySelector(".logo");
const logoSrc = logo.getAttribute("src");
const darkModeLogoSrc = "./img/ico/whaito-icon.png";
const lightSrc = "./img/light.png"
const yingAndYang = document.querySelector('.yinAndYang');
const yinAndYangSrc = yingAndYang.getAttribute("src");

btn.addEventListener("click", function () {
    body.classList.toggle("mode");
    if (body.classList.contains("mode")) {
        logo.src = darkModeLogoSrc;
        yingAndYang.src = lightSrc;
    } else {
        logo.src = logoSrc;
        yingAndYang.src = yinAndYangSrc;
    }
});

function toggleDarkMode() {
    body.classList.toggle("dark-modes");
    navbar.classList.toggle("dark-modes-nav");
    navsu.classList.toggle("dark-modes-navs");
    container.classList.toggle("dark-modes-contain");
    contento.classList.toggle("dark-modes-content");
    bawah.classList.toggle("dark-modes-bawah");
}

const darkModeBtn = document.getElementById("dark-mode-btn");
darkModeBtn.addEventListener("click", toggleDarkMode);

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
getDataById(btnPlay, 0);

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
        })
    })
}

function audioCheck(src) {
    const btn = document.querySelector(".btn-play img");
    if(audio.paused == true) {
        audio.src = "file/" + src;
        audio.play();
        btn.src = "img/btn-play.png";
        loadData();
    }else {
        btn.src = "img/btn-pause.png";
        audio.pause();
        audio.src = "file/" + src;
        audio.play();
        btn.src = "img/btn-play.png";
        loadData();
    }
    getDataBySpesific(setCurrentSong, "file", src);
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

function btnPlay(data) {
    const btn = document.querySelector(".btn-play img");
    const arr = [];
    arr.push(data);
    btn.addEventListener("click", function() {
        if(audio.paused == true) {
            if(audio.src == "") {
                audioCheck(data.file);
            }else {
                audio.play()
            }
            this.src = "img/btn-play.png";
        }else {
            audio.pause();
            this.src = "img/btn-pause.png";
        }
    })
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
        <img src="./img/loading.gif" alt="loading" class="loading-img">
    </div>
    `
}

