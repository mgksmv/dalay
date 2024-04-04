<template>
  <div class="settings-card vh-100 d-flex justify-content-center align-items-center">
    <div class="settings-card__content">
      <div class="logo">
        <img src="/src/assets/images/logo.svg" alt="" >
      </div>

      <div class="card">
        <div class="card-header">
          Выбор плейлиста
        </div>

        <div class="card-body">

          <div class="mb-3">
            <label for="youtube-playlist-link" class="form-label">Ссылка на плейлист с YouTube</label>
            <input
                v-model="youtubePlaylistLink"
                type="text"
                id="youtube-playlist-link"
                name="youtube_playlist_link"
                placeholder="Вставьте ссылку"
                class="form-control"
                :class="validationErrorMessage ? 'is-invalid' : null"
            >
            <div class="form-text">Плейлист должен быть публичным.</div>
            <div v-if="validationErrorMessage" class="invalid-feedback">
              {{ validationErrorMessage }}
            </div>
          </div>

          <button @click="onClickLoad" class="btn btn-primary float-end load-btn" :class="isLoading ? 'disabled' : null">
            <template v-if="!isLoading">
              Загрузить
            </template>
            <template v-else>
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            </template>
          </button>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toast-notification';
import router from '@/router/index.js';
import { useMainStore } from '@/stores/main.js';
import Youtube from '@/services/youtube.js';

const isLoading = ref(false);
const youtubePlaylistLink = ref();
const validationErrorMessage = ref();
const mainStore = useMainStore();
const toast = useToast();

async function onClickLoad() {
  validationErrorMessage.value = '';

  if (!youtubePlaylistLink.value) {
    validationErrorMessage.value = 'Вставьте ссылку.';
  } else {
    let playlist = null;
    isLoading.value = true;

    async function promise() {
      return new Promise(async (resolve) => {
        const youtubePlaylistId = Youtube.parsePlaylistIdFromURL(youtubePlaylistLink.value);

        if (!youtubePlaylistId) {
          validationErrorMessage.value = 'Вставьте верную ссылку.';
          toast.error('Это не похоже на YouTube ссылку');
        } else {
          const playlistData = await Youtube.getPlaylistData(youtubePlaylistId);

          if (playlistData === null) {
            toast.error('Что-то пошло не так...');
          } else if (playlistData.videos.length < 4) {
            toast.error('В плейлисте должно быть как минимум 4 видео');
          } else {
            playlist = playlistData;
          }
        }

        await resolve();
      });
    }

    await promise().then(async () => {
      isLoading.value = false;

      if (playlist) {
        mainStore.playlist = playlist;
        await router.push({name: 'settings'});
      }
    });
  }
}
</script>
