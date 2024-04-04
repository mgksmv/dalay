<template>
  <div class="settings-card vh-100 d-flex justify-content-center align-items-center">
    <div class="card">
      <div class="card-header">
        Настройки
      </div>

      <div class="card-body">

        <h5 class="card-title">{{ playlist.title }}</h5>
        <h6 class="card-subtitle mb-4 text-body-secondary">{{ playlist.videos.length }} видео</h6>

        <div class="mb-4">
          <label for="candidates" class="form-label">Кандидаты</label>
          <select v-model="candidatesCount" id="candidates" class="form-select">
            <option v-for="number in availableCandidateNumbers" :value="number">{{ number }}</option>
          </select>
        </div>

        <button @click="onClickReturnBack" class="btn btn-danger float-start">Вернуться назад</button>
        <button @click="startGame" class="btn btn-primary float-end">Продолжить</button>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import router from '@/router/index.js';
import { useMainStore } from '@/stores/main.js';
import { shuffle } from '@/helpers/index.js';

const mainStore = useMainStore();
const playlist = mainStore.playlist;
const candidatesCount = ref();
const allowedCandidateNumbers = [128, 64, 32, 16, 8, 4];

const availableCandidateNumbers = computed(() => {
  const videosCount = playlist.videos.length;
  const filteredCandidateNumbers = allowedCandidateNumbers.filter((num) => num <= videosCount);

  candidatesCount.value = filteredCandidateNumbers[0];

  return filteredCandidateNumbers;
});

function onClickReturnBack() {
  mainStore.playlist = null;
  router.push({name: 'playlistSelect'});
}

function startGame() {
  const shuffledVideos = shuffle(mainStore.playlist.videos);
  mainStore.playlist.videos = shuffledVideos.slice(0, candidatesCount.value);
  mainStore.candidatesCount = candidatesCount.value;
  router.push({name: 'home'});
}
</script>
