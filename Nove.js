new Vue({
  el: "#app",
  data() {
    return {
      audio: null,
      circleLeft: null,
      barWidth: null,
      duration: null,
      currentTime: null,
      isTimerPlaying: false,
      tracks: [
        {
          name: "Ashes",
          artist: "Owsey",
          cover: "Materiales/Artwork.jpg",
          source: "Materiales/Musica/1.mp3",
          url: "https://youtu.be/WvmrXptNH8g",
          favorited: false
        },
        {
          name: "And Then i Wake Up",
          artist: "Owsey",
          cover: "Materiales/Wake.jpg",
          source: "Materiales/Musica/2.mp3",
          url: "",
          favorited: true
        },
        {
          name: "to the child drifting out at sea",
          artist: "Owsey",
          cover: "Materiales/Find.jpg",
          source: "Materiales/Musica/3.mp3",
          url: "https://www.youtube.com/watch?v=ICjyAe9S54c",
          favorited: false
        },
        {
          name: "She Passed Away Alone at Sea",
          artist: "Owsey",
          cover: "Materiales/Artwork.jpg",
          source: "Materiales/Musica/4.mp3",
          url: "",
          favorited: false
        },
        {
          name: "Be Still my Tongue",
          artist: "Snorris",
          cover: "https://cdn.donmai.us/original/b0/22/__original_drawn_by_starshadowmagician__b0224b11ad2d6bfe1cf50885a13ff4c7.jpg",
          source: "Materiales/Musica/5.mp3",
          url: "",
          favorited: true
        },
        {
          name: "Trigger",
          artist: "Gallileo-Galilei",
          cover: "https://cdn.donmai.us/sample/aa/b3/__original_drawn_by_flowersbloodart__sample-aab3af1d96d1cc06ac21c2e41fef6a6e.jpg",
          source: "Materiales/Musica/6.mp3",
          url: "",
          favorited: true
        },
        {
          name: "Alive",
          artist: "Reona",
          cover: "https://cdn.donmai.us/original/30/3c/__amiya_w_siege_and_closure_arknights__303ca5e2a55e20b06ee747e77e82b2e4.jpg",
          source: "Materiales/Musica/7.mp3",
          url: "",
          favorited: false
        },
        {
          name: "Von",
          artist: "Yoko Kano",
          cover: "https://cdn.donmai.us/original/54/33/__original_drawn_by_rajawat__5433263ec53ad259d86774f7304cdb78.jpg",
          source: "Materiales/Musica/8.mp3",
          url: "",
          favorited: false
        },
        {
          name: "Northern Lights",
          artist: "Owsey",
          cover: "https://cdn.donmai.us/original/26/5e/__original_drawn_by_rajawat__265ea7996d2c73f27f59c8a2c33e8f03.jpg",
          source: "Materiales/Musica/9.mp3",
          url: "",
          favorited: false
        }
      ],
      currentTrack: null,
      currentTrackIndex: 0,
      transitionName: null
    };
  },
  methods: {
    play() {
      if (this.audio.paused) {
        this.audio.play();
        this.isTimerPlaying = true;
      } else {
        this.audio.pause();
        this.isTimerPlaying = false;
      }
    },
    generateTime() {
      let width = (100 / this.audio.duration) * this.audio.currentTime;
      this.barWidth = width + "%";
      this.circleLeft = width + "%";
      let durmin = Math.floor(this.audio.duration / 60);
      let dursec = Math.floor(this.audio.duration - durmin * 60);
      let curmin = Math.floor(this.audio.currentTime / 60);
      let cursec = Math.floor(this.audio.currentTime - curmin * 60);
      if (durmin < 10) {
        durmin = "0" + durmin;
      }
      if (dursec < 10) {
        dursec = "0" + dursec;
      }
      if (curmin < 10) {
        curmin = "0" + curmin;
      }
      if (cursec < 10) {
        cursec = "0" + cursec;
      }
      this.duration = durmin + ":" + dursec;
      this.currentTime = curmin + ":" + cursec;
    },
    updateBar(x) {
      let progress = this.$refs.progress;
      let maxduration = this.audio.duration;
      let position = x - progress.offsetLeft;
      let percentage = (100 * position) / progress.offsetWidth;
      if (percentage > 100) {
        percentage = 100;
      }
      if (percentage < 0) {
        percentage = 0;
      }
      this.barWidth = percentage + "%";
      this.circleLeft = percentage + "%";
      this.audio.currentTime = (maxduration * percentage) / 100;
      this.audio.play();
    },
    clickProgress(e) {
      this.isTimerPlaying = true;
      this.audio.pause();
      this.updateBar(e.pageX);
    },
    prevTrack() {
      this.transitionName = "scale-in";
      this.isShowCover = false;
      if (this.currentTrackIndex > 0) {
        this.currentTrackIndex--;
      } else {
        this.currentTrackIndex = this.tracks.length - 1;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    nextTrack() {
      this.transitionName = "scale-out";
      this.isShowCover = false;
      if (this.currentTrackIndex < this.tracks.length - 1) {
        this.currentTrackIndex++;
      } else {
        this.currentTrackIndex = 0;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    resetPlayer() {
      this.barWidth = 0;
      this.circleLeft = 0;
      this.audio.currentTime = 0;
      this.audio.src = this.currentTrack.source;
      setTimeout(() => {
        if(this.isTimerPlaying) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      }, 300);
    },
    favorite() {
      this.tracks[this.currentTrackIndex].favorited = !this.tracks[
        this.currentTrackIndex
      ].favorited;
    }
  },
  created() {
    let vm = this;
    this.currentTrack = this.tracks[0];
    this.audio = new Audio();
    this.audio.src = this.currentTrack.source;
    this.audio.ontimeupdate = function() {
      vm.generateTime();
    };
    this.audio.onloadedmetadata = function() {
      vm.generateTime();
    };
    this.audio.onended = function() {
      vm.nextTrack();
      this.isTimerPlaying = true;
    };

    // this is optional (for preload covers)
    for (let index = 0; index < this.tracks.length; index++) {
      const element = this.tracks[index];
      let link = document.createElement('link');
      link.rel = "prefetch";
      link.href = element.cover;
      link.as = "image"
      document.head.appendChild(link)
    }
  }
});