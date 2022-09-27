/**
 * 1. render songs
 * 2. scroll top
 * 3 play / pause /seek
 * 4. CD rotate
 * 5. next / previous
 * 6. randomize
 * 7. next / repeat when ended
 * 8. active song
 * 9. scroll active song into view
 * 10. play song when clicked 
 */
const PLAYER_STORAGE_KEY = 'Music_Player';

const cd = document.querySelector('.cd');
const heading = document.querySelector('.header h2');
const cdImage = document.querySelector('.cd-image');
const audio = document.querySelector('#audio');
const playButton = document.querySelector('.btn-toggle-play');
const progress = document.querySelector('#progress');
const nextButton = document.querySelector('.btn-next');
const preButton = document.querySelector('.btn-prev');
const randomButton = document.querySelector('.btn-random');
const repeatButton = document.querySelector('.btn-repeat');
const playList = document.querySelector('.playlist');
const currentTime = document.querySelector('.currentTime');
const durationTime = document.querySelector('.durationTime');
const volumeAudio = document.querySelector('#volume');
const volumeChange = document.querySelector('.volume-change');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isVolumeChange: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Chạy Khỏi Thế Giớ Này',
            singer: 'Phương Ly ft. Da LAB',
            img: './assets/img/chayKhoiTheGioiNay.jpg',
            path: './assets/music/chayKhoiTheGioiNay.mp3',
        },
        {
            name: 'Chuyện Cũ Bỏ Qua',
            singer: 'Trúc Nhân ft. Risky Star',
            img: './assets/img/chuyenCuBoQua.jpg',
            path: './assets/music/chuyenCuBoQua.mp3',
        },
        {
            name: 'Đâu Ai Dám Hứa',
            singer: 'Czee',
            img: './assets/img/dauAiDamHua.jpg',
            path: './assets/music/dauAiDamHua.mp3',
        },
        {
            name: 'Mình Cưới Nhau Đi',
            singer: 'Huỳnh James ft. PjnBoys',
            img: './assets/img/minhCuoiNhauDi.jpg',
            path: './assets/music/minhCuoiNhauDi.mp3',
        },
        {
            name: 'Phi Hành Gia',
            singer: 'Lil Wuyn',
            img: './assets/img/phiHanhGia.jpg',
            path: './assets/music/phiHanhGia.mp3',
        },
        {
            name: 'Tết Là Ăn Hết',
            singer: 'Kay Trần',
            img: './assets/img/tetLaAnHet.jpg',
            path: './assets/music/tetLaAnHet.mp3',
        },
        {
            name: 'Theres No One At All',
            singer: 'Sơn Tùng MTP',
            img: './assets/img/theresNoOneAtAll.jpg',
            path: './assets/music/theresNoOneAtAll.mp3',
        },
        {
            name: 'Vượt Chướng Ngại Vật',
            singer: 'Lil Wuyn ft. Risky Star',
            img: './assets/img/vuotChuongNgaiVat.jpg',
            path: './assets/music/vuotChuongNgaiVat.mp3',
        },
        {
            name: 'Waiting For You',
            singer: 'Mono',
            img: './assets/img/waitingForYou.jpg',
            path: './assets/music/waitingForYou.mp3',
        },
        {
            name: 'Ý Em Sao',
            singer: 'Kay Trần',
            img: './assets/img/yEmSao.jpg',
            path: './assets/music/yEmSao.mp3',
        },
    ],

    setConfig: function(key, value) {
        this.config[key] = value;   
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active': ''}" data-id = "${index}">
                    <div class="thumb"
                        style="background-image: url('${song.img}');">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        }); 
        playList.innerHTML = htmls.join('');
    },

    difineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },

    handleEvents: function() {
        const _this = this;
        // Xử lí CD quay / dừng
        const CdImageAnimation = cdImage.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000,
            iterations: Infinity, 
        })

        CdImageAnimation.pause();

        // Xử lí phóng to / thu nhỏ CD
        const cdWidth = cd.offsetWidth;
        document.onscroll = function() {
            const scrollTop = document.documentElement.scrollTop || window.scrollY;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0 + 'px';  
            cd.style.opacity = newCdWidth/cdWidth;
        };

        // Xử lí play song

        playButton.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
        };

        // When song is playing
        audio.onplay = function() {
            _this.isPlaying = true;
            playButton.classList.add('playing');
            CdImageAnimation.play();
        };
        
        // When song is paused
        audio.onpause = function() {
            _this.isPlaying = false;
            playButton.classList.remove('playing');
            CdImageAnimation.pause();
        }

        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const percent = Math.floor(audio.currentTime / audio.duration * 100);  
                progress.value = percent;

                _this.getDurationTime();
                _this.getCurrentTime();
            }
        }
        
        // Xử lí khi tua song

        progress.onchange = function(e) {
            const seekTime = (audio.duration / 100 * e.target.value);
            audio.currentTime = seekTime;
        }

        // Xử lí khi next song

        nextButton.onclick = function(){
            if(_this.isRandom){
                _this.randomSong();
            }
            else{
                _this.nextSong();
            }
            audio.play();   
            _this.render();
            _this.scrollToActiveSong();
        }

        // Xử lí khi prev song

        preButton.onclick = function(){
            if(_this.isRandom){
                _this.randomSong();
            }
            else{
                _this.previousSong();
            }
            audio.play();
            _this.render();
        }

        // Xử lí random song

        randomButton.onclick = function(e){
            _this.isRandom  = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomButton.classList.toggle('active', _this.isRandom);
        }

        // Xử lí lặp lại song

        repeatButton.onclick = function(e){
            _this.isRepeat  = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatButton.classList.toggle('active', _this.isRepeat);
        }

        // Xử lí next song khi audio ended

        audio.onended = function() {
            if(_this.isRepeat){
                audio.play();
            }else {
                nextButton.click();
            }
        }

        // Lắng nghe hành vi click vào playList
        playList.onclick = function(e) {
            const songIndex = e.target.closest('.song:not(.active)');
            if( songIndex || e.target.closest('.option')){
                if(songIndex) {
                    _this.currentIndex = Number(songIndex.dataset.id);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        }

        // Xử lí sự kiện tăng giảm volume
        volumeAudio.onchange = function (e) {
            const currentVolume = (Number(volumeAudio.value) / 100);
            audio.volume = currentVolume;
			audio.play();
			if (audio.volume === 0) {
				volumeChange.classList.add('active');
			} else {
				_this.isMute = false;
				_this.setConfig('isMute', _this.isMute);
				volumeChange    .classList.remove('active');
			}
        };

        // Xử lí sự kiện volume Change 
        volumeChange.onclick = function() {
            const currentVolume = Number(audio.volume);
            _this.isVolumeChange = !_this.isVolumeChange;
            if(_this.isVolumeChange){
                volumeChange.classList.add('active', _this.isVolumeChange);
                audio.muted = true;
                volumeAudio.value = 0;
            }
            else {
                volumeChange.classList.remove('active', _this.isVolumeChange);
                audio.muted = false;
                volumeAudio.value = currentVolume * 100;
                console.log(currentVolume);
            }
        };

    },

    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdImage.style.backgroundImage = 'url(' + this.currentSong.img + ')';
        audio.src = this.currentSong.path;
    },

    loadConfig: function(){
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    scrollToActiveSong: function(){
        setTimeout( () => {
            document.querySelector('.song.active').scrollIntoView({
                behavior:'smooth',
                block:'nearest',
                inline: 'nearest'
            }, 300);
        })
    },

    nextSong: function(){ 
        this.currentIndex++;
        if(this.currentIndex == this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();  
    },

    previousSong: function(){
        this.currentIndex--;
        if(this.currentIndex == 0) {
            this.currentIndex = this.songs.length;
        }
        this.loadCurrentSong();  
    },

    randomSong: function(){
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);  
        }while(newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    getDurationTime: function() {
        const audiod = audio.duration;   
        const minutes = "0" + Math.floor(audiod / 60); 
        const seconds =  Math.floor(audiod - minutes * 60); 
        let songTime = minutes + ' : ' + seconds;
        if( Number(seconds) < 10 ) {
            songTime = minutes + ' : 0' + seconds;
        }
        durationTime.textContent = songTime;
    },

    getCurrentTime: function() {
        const currentTimePlaying = audio.currentTime;   
        const minutes = "0" + Math.floor(currentTimePlaying / 60); 
        const seconds =  Math.floor(currentTimePlaying - minutes * 60); 
        let songPlayingTime = minutes + ' : ' + seconds;
        if( Number(seconds) < 10 ) {
            songPlayingTime = minutes + ' : 0' + seconds;
        }
        currentTime.textContent = songPlayingTime;
    },

    VolumeChangeAudio: function() {
        

    },

    start: function() {
        this.loadConfig(); // Gán cấu hình từ config vào ứng dụng
        this.render(); // render danh sách bài hát 
        this.difineProperties(); // Định nghĩa các thuộc tính cho object
        this.handleEvents(); // Lắng nghe và xử lý các sự kiện
        this.loadCurrentSong(); //Tải thông tin bài hát đầu tiên khi chạy ứng dụng

        randomButton.classList.toggle('active', this.isRandom);
        repeatButton.classList.toggle('active', this.isRepeat);
        
    }

}

app.start();