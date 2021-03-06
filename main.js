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
var totalTimeOfSong;
const audioElement = document.getElementById('audio');
const lineTimeSong = document.getElementById('progress');
const repeatButton = $('.btn-repeat');
const randomButton = $('.btn-random');
//footer
const footerItem = $$('.footer-item');
const footerListItem = $('.footer-list-items');

const App = {
    currentPlayingSong: 0,
    songs : songsFromMasterData,
    isPlay: false,
    getCurrSong(){
        return this.songs[this.currentPlayingSong];
    },
    goNextSong(){
        if(this.currentPlayingSong === this.songs.length-1){
            this.currentPlayingSong = 0
        }
        else{
            this.currentPlayingSong += 1;
        }

        audioElement.src = this.getCurrSong().path;
        audioElement.play();
        this.isPlay = true;
        audioElement.onplay = function(){
            player.classList.add('playing')
            cdThumb.style.animationPlayState = "running"
        }
        this.renderCurrentSong();
        this.renderSongs(); 
        songActive.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
    },
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
        const currentSong = this.getCurrSong();

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
            _this.goNextSong();
        }

        btnPrevious.onclick = function(){
            if(_this.currentPlayingSong === 0){
                _this.currentPlayingSong = _this.songs.length-1
            }
            else{
                _this.currentPlayingSong -= 1;
            }

            audioElement.src = _this.getCurrSong().path;
            audioElement.play();
            _this.isPlay = true;
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
                audioElement.src = _this.getCurrSong().path;
                _this.isPlay = true;
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
        const currentSong = this.getCurrSong();
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
      handlerTimeOfSong(){
          const _this = this;
        
        var eventOnChange;
        
        audioElement.addEventListener("loadeddata", function() {
            totalTimeOfSong = this.duration; 
           });
        
        audioElement.ontimeupdate = function(){
            const currentTime = audioElement.currentTime;
            const valueOfLineTimeSong = (currentTime * 100) / totalTimeOfSong;
           
            lineTimeSong.oninput = function(e){
                eventOnChange = e;
                const timeSongNew = lineTimeSong.value;
                const startSongNewTime = (timeSongNew * totalTimeOfSong) / 100;
                audioElement.currentTime = startSongNewTime;
                }

            lineTimeSong.value = valueOfLineTimeSong;    
            if(totalTimeOfSong === currentTime && !randomButton.classList.contains('active')){
                _this.goNextSong();
            }
            else if(totalTimeOfSong === currentTime){
                _this.currentPlayingSong = _this.selectRandomSong();;
                _this.goNextSong();
            }

            if(repeatButton.classList.contains('active')){
                audioElement.loop = true;
            } 
            else{
                audioElement.loop = false;
            }
        }
      },
      repeatSongAndRandomBtn(){
        repeatButton.onclick = function(){
            repeatButton.classList.toggle('active');

            if(repeatButton.classList.contains('active')){
                randomButton.classList.remove('active');
            }
            
        }

        randomButton.onclick = function(){
            randomButton.classList.toggle('active');
            
            if(randomButton.classList.contains('active')){
                repeatButton.classList.remove('active');
            }
        }
      },
      selectRandomSong(){
        const min = 0;
        const max = this.songs.length - 1;
        const result = Math.round(Math.random() * (max - min) + min);
        if(result === this.currentPlayingSong){
            switch (result) {
                case result === this.songs.length -1:
                    result = result - 1;
                    break;
                    case result === 0:
                    result = result + 1;
                    break;
                    default:
                    result = result + 1;
                    break;
            }
        }

        return result;
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
        this.handlerTimeOfSong();
        this.repeatSongAndRandomBtn();
    }
}

App.start();