const container = document.querySelector(".container"),
      header = document.querySelector(".header"),
      menu = document.querySelector(".menu"),
      rowCard = document.querySelector(".row-card"),
      card = document.querySelector(".card"),
      closes = document.querySelector(".close"),
      playerMusik = document.querySelector(".player-musik"),
      playerMusikBar = document.querySelector(".player-musik-bar");

rowCard.style.height = container.offsetHeight - header.offsetHeight - menu.offsetHeight+"px";


card.onclick = function() {
    playerMusik.style.top = "0";
}
closes.onclick = function() {
    playerMusik.style.top = "100%";
    playerMusikBar.style.top ="unset";
    playerMusikBar.style.bottom ="0";
}