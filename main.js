import songMasterData from "./assets/songMasterData.js";

const songs = songMasterData;
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


const App = {
    songs: songs,
    render: function(){
        const html = `
            ${this.songs.map(song => `
            <div class="song">
                <div class="thumb" style="background-image: url('${song.imageUrl}')">
                </div>
                <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                <i class="fas fa-ellipsis-h"></i>
                </div>
          </div>
            `).join('')}
        
        `
        $('.playlist').innerHTML = html
    },
    
    start: function(){
        this.render();


    }

}

App.start();