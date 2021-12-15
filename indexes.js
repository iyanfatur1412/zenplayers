const container = document.querySelector(".container"),
      header = document.querySelector(".header"),
      menu = document.querySelector(".menu");

const rowCard = document.querySelector(".row-card"),
      lagu = document.querySelectorAll(".card-info .artis-song"),
      imgAlbum = document.querySelectorAll(".card .img img");



const playerMusik = document.querySelector(".player-musik"),
      closes = document.querySelector(".close"),
      titleSong = document.querySelector(".player-musik .title-song"),
      artisSong = document.querySelector(".player-musik .artis-song"),
      btnPlay = document.querySelectorAll(".play"),
      btnPrev = document.querySelectorAll(".prev"),
      btnNext = document.querySelectorAll(".next"),
      proggress =document.querySelector(".proggress"),
      colImgAlbum = document.querySelector(".row-img .img img");


const playerMusikBar = document.querySelector(".player-musik-bar"),
      btnSongBar = document.querySelector(".info-song-bar"),
      infoSongBar = document.querySelector(".info-song-bar h4");


const musik = document.querySelector("audio");
      
let currentMusik = 0;

let infoSong = [],
    srcAlbum = [],
    durasi = 0,
    interval,
    timeOut,
    fullDurasi;
    
rowCard.style.height = container.offsetHeight - header.offsetHeight - menu.offsetHeight+"px";

for(let i=0; i<lagu.length; i++) {
    infoSong.push(lagu[i].innerHTML.split(" - "));
    srcAlbum.push(imgAlbum[i].src);
}



// Functions


function autoPlay(arg) {
    clearInterval(interval);
    clearTimeout(timeOut);
    playerMusik.style.right = "0";
    btnPlay[0].innerHTML = "||";
    btnPlay[1].innerHTML = "||";
    resetInfoSong(infoSong[arg-1][1], infoSong[arg-1].join(" - "), srcAlbum[arg-1]);
    musik.src = "bahan/musik/"+ infoSong[arg-1][1].toLowerCase() +".mp3";
    musik.play();
    musik.onloadedmetadata = function() {
        proggressBar();
        setTimer(musik.duration);
    }
    currentMusik = arg;
}

function resetInfoSong(title, infoSong, srcAlbum) {
    titleSong.innerHTML = title;
    artisSong.innerHTML = infoSong;
    colImgAlbum.src = srcAlbum;
    infoSongBar.innerHTML = infoSong;
}

function proggressBar() {
        durasi = musik.duration;
        durasiNode = 1 / (durasi/100);
        interval = setInterval(function() {
            amount = 1 / (durasi/100);
            proggress.style.width = Number(durasiNode.toFixed(2)) +"%";
            durasiNode += amount;
        }, 1000);
}


function setTimer(arg) {
    fullDurasi = arg*1000;
    timeOut = setTimeout(function() {
        clearInterval(interval);
        proggress.style.width = "0";
        nextPlay();
    }, fullDurasi);
}

function nextPlay() {
    currentMusik++;
    if(currentMusik > lagu.length) {
        currentMusik = 1;
    }
    btnPlay[0].innerHTML = "||";
    btnPlay[1].innerHTML = "||";
    autoPlay(currentMusik);
}

function prevPlay() {
    currentMusik--;
    if(currentMusik < 1) {
        currentMusik = lagu.length;
    }
    btnPlay[0].innerHTML = "||";
    btnPlay[1].innerHTML = "||";
    autoPlay(currentMusik);
}

function playPause() {
    if(musik.paused) {
        musik.play();
        btnPlay[0].innerHTML = "||";
        btnPlay[1].innerHTML = "||";
        interval = setInterval(function() {
            proggress.style.width = Number(durasiNode.toFixed(2)) +"%";
            durasiNode += amount;
        }, 1000);
            setTimer((fullDurasi/1000) - musik.currentTime);
    }else {
        musik.pause();
        btnPlay[0].innerHTML = "&gt";
        btnPlay[1].innerHTML = "&gt";
        clearInterval(interval);
        clearTimeout(timeOut)
    }
}


// Event Click

btnPlay[0].onclick = playPause;
btnPlay[1].onclick = playPause;

btnNext[0].onclick = nextPlay;
btnNext[1].onclick = nextPlay;

btnPrev[0].onclick = prevPlay;
btnPrev[1].onclick = prevPlay;

closes.onclick = function() {
    playerMusik.style.right = "100%";
    playerMusikBar.style.transform ="translateX(0)";
}

btnSongBar.onclick = function() {
    playerMusik.style.right = "0";
}