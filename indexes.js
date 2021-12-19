const musik = document.querySelector("audio");
let getElement = className => document.querySelector("."+className);
let getElements = className => document.querySelectorAll("."+className);
let currentMusik = 0,
    infoSong,
    interval,
    timeOut;
    
getElement("row-card").style.height = getElement("container").offsetHeight - getElement("header").offsetHeight - getElement("menu").offsetHeight+"px";

infoSong = [].slice.call(getElements("card-info .artis-song")).map(arr => arr.innerHTML.split(" - "));

// Functions

function autoPlay(arg) {
    clearInterval(interval);
    clearTimeout(timeOut);
    resetElement();
    resetInfoSong(infoSong[arg-1][1], infoSong[arg-1].join(" - "), infoSong[arg-1][1].toLowerCase());
    musik.src = "bahan/musik/"+ infoSong[arg-1][1].toLowerCase() +".mp3";
    musik.onloadeddata = () => { setTimer(musik.duration); proggressBar() }
    musik.play();
    currentMusik = arg;
}

function resetElement() {
    getElement("proggress").value = 0;
    getElement("player-musik").style.right = "0";
    [].slice.call(getElements("play")).forEach(arr => arr.innerHTML = "||");
}

function resetInfoSong(title, infoSong, srcAlbum) {
    getElement("player-musik .title-song").innerHTML = title;
    getElement("player-musik .artis-song").innerHTML = infoSong;
    getElement("row-img .img img").src = "bahan/"+ srcAlbum +".jpg";
    getElement("info-song-bar h4").innerHTML = infoSong;
}

function proggressBar() {
    getElement("proggress").setAttribute("max", musik.duration);
    interval = setInterval(() => {
        getElement("proggress").value = musik.currentTime;
    }, 1000);
}

function setTimer(arg) {
    timeOut = setTimeout(() => {
        clearInterval(interval);
        getElement("proggress").value = musik.currentTime;
        nextPlay();
    }, arg*1000);
}

function nextPlay() {
    currentMusik++;
    currentMusik > infoSong.length ? currentMusik = 1 : "";
    [].slice.call(getElements("play")).forEach(arr => arr.innerHTML = "||");
    autoPlay(currentMusik);
}

function prevPlay() {
    currentMusik--;
    currentMusik < 1 ? currentMusik = infoSong.length : "";
    [].slice.call(getElements("play")).forEach(arr => arr.innerHTML = "||");
    autoPlay(currentMusik);
}

function playPause() {
    if(musik.paused) {
        musik.play();
        [].slice.call(getElements("play")).forEach(arr => arr.innerHTML = "||");
        interval = setInterval(function() {
            proggress.value = musik.currentTime;
        }, 1000)
            setTimer(musik.duration - musik.currentTime);
    }else {
        musik.pause();
        [].slice.call(getElements("play")).forEach(arr => arr.innerHTML = ">");
        clearInterval(interval);
        clearTimeout(timeOut);
    }
}

// Event Click

[].slice.call(getElements("play")).forEach(arr => { arr.onclick = playPause });
[].slice.call(getElements("next")).forEach(arr => { arr.onclick = nextPlay });
[].slice.call(getElements("prev")).forEach(arr => { arr.onclick = prevPlay });


getElement("close").onclick = () => {
    getElement("player-musik").style.right = "100%";
    getElement("player-musik-bar").style.transform ="translateX(0)";
}

getElement("info-song-bar").onclick = () => { getElement("player-musik").style.right = "0"; }

getElement("proggress").onchange = function() {
    musik.currentTime = proggress.value;
    clearTimeout(timeOut);
    setTimer(musik.duration - musik.currentTime);
}