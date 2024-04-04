<template>
  <div class="d-flex vh-100 align-items-center">
    <div class="w-100 align-items-center">
      <div class="row descriptions">
        <div class="col-4"></div>
        <div class="col-4 d-flex align-items-center justify-content-center">
          <h1>{{ rounds }}</h1>
        </div>
        <div class="col-4 d-flex align-items-center justify-content-end">
          <h5 class="me-3">{{ playlistTitle }}</h5>
        </div>
      </div>

      <div class="row align-items-center">
        <div ref="leftSide" class="col-6 h-100 pe-0">
          <div class="h-100 d-flex align-items-center">
            <div class="w-100">
              <youtube-iframe :video-id="video1Id" @ready="onPlayer1Ready($event, leftSide)" />
              <a @click="chooseRoundWinner(video1, video2)" class="select-btn left">
                <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="white" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
                Выбрать
              </a>
            </div>
          </div>
        </div>

        <div ref="rightSide" class="col-6 h-100 ps-0">
          <div class="h-100 d-flex align-items-center">
            <div class="w-100">
              <youtube-iframe :video-id="video2Id" @ready="onPlayer2Ready($event, rightSide)" />
              <a @click="chooseRoundWinner(video2, video1)" class="select-btn right">
                <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="white" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
                Выбрать
              </a>
            </div>
          </div>
        </div>

        <div id="versus"></div>

        <div v-if="showRoundWinner" id="round-winner">
          <div class="round-winner-container" :class="winnerContainerClass">
            <h1 class="text-center mb-3">
              <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="white" d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z"/></svg>
              Победитель:
            </h1>
            <h4>{{ roundWinner.snippet.title }}</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useMainStore } from '@/stores/main.js';
import { shuffle } from '@/helpers/index.js';
import { YoutubeIframe } from '@vue-youtube/component';

const mainStore = useMainStore();
const playlistTitle = computed(() => mainStore.playlist.title);
const videos = computed(() => mainStore.playlist.videos);
const candidatesCount = computed(() => mainStore.candidatesCount);
const leftSide = ref();
const rightSide = ref();
const currentRound = ref(1);
const totalRounds = ref(candidatesCount.value / 2);
const video1 = ref(videos.value[0]);
const video2 = ref(videos.value[1]);
const videoPlayer1 = ref();
const videoPlayer2 = ref();
const roundWinners = ref([]);
const roundWinner = ref();
const showRoundWinner = ref(false);
const winnerContainerClass = ref();

const video1Id = computed(() => {
  return video1.value.snippet.resourceId.videoId;
});
const video2Id = computed(() => {
  return video2.value.snippet.resourceId.videoId;
});

const rounds = computed(() => {
  if (currentRound.value === 1 && totalRounds.value === 1) {
    return 'Финал';
  }

  return currentRound.value + '/' + totalRounds.value;
});

function chooseRoundWinner(winnerVideo, loserVideo) {
  showRoundWinner.value = true;
  roundWinner.value = winnerVideo;
  roundWinners.value.push(winnerVideo);
  mainStore.playlist.videos = videos.value.filter((video) => video.id !== winnerVideo.id);
  mainStore.playlist.videos = videos.value.filter((video) => video.id !== loserVideo.id);

  if (winnerVideo.id === video1.value.id) {
    winnerContainerClass.value = 'red';
  } else {
    winnerContainerClass.value = 'blue';
  }

  if (currentRound.value === 1 && totalRounds.value === 1) {
    return;
  }

  if (currentRound.value === totalRounds.value) {
    mainStore.playlist.videos = roundWinners.value;
    roundWinners.value = [];
  }

  const shuffledVideos = shuffle(mainStore.playlist.videos);

  setTimeout(() => {
    if (currentRound.value === totalRounds.value) {
      currentRound.value = 1;
      totalRounds.value = totalRounds.value / 2;
    } else {
      currentRound.value++;
    }

    showRoundWinner.value = false;
    video1.value = shuffledVideos[0];
    video2.value = shuffledVideos[1];
  }, 3000);

  setTimeout(() => {
    videoPlayer1.value.stopVideo();
    videoPlayer2.value.stopVideo();
  }, 3100);
}

function onPlayer1Ready(event, side) {
  const videoPlayer = event.target;
  videoPlayer1.value = videoPlayer;
  setSideEventListeners(side, videoPlayer);
}

function onPlayer2Ready(event, side) {
  const videoPlayer = event.target;
  videoPlayer2.value = videoPlayer;
  setSideEventListeners(side, videoPlayer);
}

function setSideEventListeners(side, videoPlayer) {
  side.addEventListener('mouseover', () => {
    videoPlayer.playVideo();
  });

  side.addEventListener('mouseleave', () => {
    videoPlayer.pauseVideo();
  });
}
</script>

<style>
#app {
  overflow: hidden;
}

iframe {
  width: 100%;
  height: 600px;
}
</style>

<style scoped>
#versus {
  width: 100%;
  height: calc(7*(1vw + 1vh - 1vmin));
  max-width: 100%;
  max-height: 50%;
  background-image: url('src/assets/images/vs.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center top;
  position: fixed;
  left: 0;
  z-index: 1;
  pointer-events: none;
}

#round-winner {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  height: 100vh;
  top: 0;
  left: 0;
  color: #fff;
  background: rgba(24, 24, 24, 0.67);
  transition: 1s;
  z-index: 2;
}

.descriptions {
  margin-bottom: 16px;
}

.round-winner-container {
  padding: 32px;
  border-radius: 8px;
}

.round-winner-container.red {
  background-color: #ec4758;
}

.round-winner-container.blue {
  background-color: #1c84c6;
}

.select-btn {
  opacity: .7;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #fff;
  text-transform: uppercase;
  font-size: 24px;
  line-height: 133%;
  transition: .2s;
  padding: 16px 0;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
}

.select-btn.left {
  background: #ec4758;
}

.select-btn.right {
  background: #1c84c6;
}

.select-btn.left:hover, .select-btn.right:hover {
  filter: brightness(0.85);
}
</style>
