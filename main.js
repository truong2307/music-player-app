import songMasterData from "./assets/songMasterData.js";

const songs = songMasterData;
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const headerDashboard = $('header h2');
const cdThumb = $('.cd-thumb');
const cd = $('.cd');
const player = $('.player');
const btnTogglePlay = $('.btn-toggle-play');
const audio = $('#audio');
const playList = $('.playlist');

const App = {
    songPlay: 1,
    isPlay: false,
    songs: songs,
    render: function(){
        const html = `
            ${this.songs.map((song, index) => `
            <div class="song" data-index = "${index}">
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
        playList.innerHTML = html
    },
    handlerEvents(){
        const _this = this
        const widthCd = cd.offsetWidth
        //handler scroll screen
        document.onscroll = function(){
            const scrollValue = window.scrollY;
            const newWidthCd = widthCd - scrollValue;
            cd.style.width = newWidthCd < 0 ? 0 : newWidthCd +'px';
            cd.style.opacity = newWidthCd/scrollValue
        }

        // handler when click play or pause button
        btnTogglePlay.onclick = function(){
            if(audio.src === ''){
                audio.src = _this.songs[_this.songPlay].path
            }
            
            _this.isPlay = !_this.isPlay;
            if(_this.isPlay === false){
                audio.pause();
            }
            else{
                audio.play();
            }

            audio.onplay = function(){
                player.classList.add('playing')
            }

            audio.onpause = function(){
                player.classList.remove('playing')
            }
        }

        //handler click 1 song
        playList.onclick = function(e){
            const songRoot = e.target.closest('.song');

            if( songRoot || e.target.closest('.option')){

                if(songRoot){
                    const indexSong = songRoot.getAttribute('data-index');
                    _this.songPlay = indexSong
                    _this.renderDashboard();

                    _this.isPlay = true

                    audio.src = _this.songs[_this.songPlay].path
                    audio.play();
                    audio.onplay = function(){
                        player.classList.add('playing')
                    }
                    console.log(songRoot)
                }
            }
        }

    },
    renderDashboard(){
        const song = this.songs[this.songPlay]
        headerDashboard.textContent = song.name
        cdThumb.style.backgroundImage = `url(${song.imageUrl})`
    },
    start: function(){
        this.render();
        this.handlerEvents();
        this.renderDashboard();

    }

}

App.start();