import masterData from "./assets/songMasterData.js"

const songsFromMasterData = masterData;
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const btnPausePlay = $('.btn-toggle-play');
const player = $('.player');
const cdThumb = $('.cd-thumb');
const cd = $('.cd');
const playlist = $('.playlist');
const headerDashboard = $('header h2');
const btnNext = $('.btn-next');
const btnPrevious = $('.btn-prev');
var songActive;
const audioElement = document.getElementById('audio');

//footer
const footerItem = $$('.footer-item');
const footerListItem = $('.footer-list-items');

const App = {
    currentPlayingSong: 0,
    songs : songsFromMasterData,
    isPlay: false,
    renderSongs(){
        const htmlToRender = `
            ${this.songs.map((song, index) => `
            <div class="song ${index === this.currentPlayingSong && 'active'}" index-data = "${index}">
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
        
        playlist.innerHTML = htmlToRender;
        songActive = $('.song.active');
    },
    renderCurrentSong(){
        const currentSong = this.songs[this.currentPlayingSong];

        headerDashboard.innerHTML = currentSong.name
        cdThumb.style.backgroundImage = `url(${currentSong.imageUrl})`
    },
    handlerScrollScreen(){
        const cdWidth = cd.offsetWidth;

        document.onscroll = function(){
            const scrollValue = window.scrollY;
            const newWidOfCd = cdWidth - scrollValue;

            cd.style.width = newWidOfCd < 0 ? 0 : newWidOfCd+ 'px';
            cdThumb.style.opacity = newWidOfCd / scrollValue;
        }
    },
    nextAndPreviousSong(){
        const _this =this
        btnNext.onclick = function(){
            if(_this.currentPlayingSong === _this.songs.length-1){
                _this.currentPlayingSong = 0
            }
            else{
                _this.currentPlayingSong += 1;
            }

            audioElement.src = _this.songs[_this.currentPlayingSong].path;
            audioElement.play();
            audioElement.onplay = function(){
                player.classList.add('playing')
                cdThumb.style.animationPlayState = "running"
            }
            _this.renderCurrentSong();
            _this.renderSongs(); 
            songActive.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
        }

        btnPrevious.onclick = function(){
            if(_this.currentPlayingSong === 0){
                _this.currentPlayingSong = _this.songs.length-1
            }
            else{
                _this.currentPlayingSong -= 1;
            }

            audioElement.src = _this.songs[_this.currentPlayingSong].path;
            audioElement.play();
            audioElement.onplay = function(){
                player.classList.add('playing')
                cdThumb.style.animationPlayState = "running"
            }
            _this.renderCurrentSong();
            _this.renderSongs(); 
            songActive.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
        }
    },
    selectSong(){
        const _this = this;

        playlist.onclick = function(e){
            const songSelectEle = e.target.closest('.song:not(.active)')
            if(songSelectEle || e.target.closest('.option')){
                
                const indexSongSelect = songSelectEle.getAttribute('index-data');
                _this.currentPlayingSong = parseInt(indexSongSelect);
                audioElement.src = _this.songs[_this.currentPlayingSong].path;
                audioElement.play();
                audioElement.onplay = function(){
                    player.classList.add('playing')
                    cdThumb.style.animationPlayState = "running"
                }
                _this.renderCurrentSong();
                _this.renderSongs();
            }   
        }
    },
    shuffle(array) {
        let currentIndex = array.length,  randomIndex;
        while (currentIndex != 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }

        return array;
      },
      selectOption(){
        footerListItem.onclick = function(e){
            const footerListItemRoot = e.target.closest('.footer-item');
            if(footerListItemRoot){
                const [...nodeList] = footerItem 
                const eleHasActive = nodeList.find(item => item.classList.contains('active'))
                if(eleHasActive !== footerListItemRoot){
                    eleHasActive.classList.remove('active');
                    footerListItemRoot.classList.add('active');
                }
            }
        }
      },
      pauseAndPlaySong(){
        const _this = this
        const currentSong = this.songs[this.currentPlayingSong];
        
        audioElement.src = currentSong.path

        btnPausePlay.onclick = function(){
            _this.isPlay = !_this.isPlay
            if(_this.isPlay){
                audioElement.play();
            }
            else{
                audioElement.pause();
            }

            audioElement.onplay = function(){
                player.classList.add('playing')
                cdThumb.style.animationPlayState = "running"
            }
            audioElement.onpause = function(){
                player.classList.remove('playing')
                cdThumb.style.animationPlayState = "paused"
            }
        }
      },
    start(){
        this.shuffle(this.songs)
        this.renderSongs();
        this.handlerScrollScreen();
        this.renderCurrentSong();
        this.nextAndPreviousSong();
        this.selectSong();
        this.selectOption();
        this.pauseAndPlaySong();
    }
}

App.start();