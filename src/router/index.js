import { createRouter, createWebHistory } from 'vue-router';
import { useMainStore } from '@/stores/main.js';
import HomeView from '@/views/HomeView.vue';
import PlaylistSelect from '@/views/PlaylistSelect.vue';
import SettingsView from '@/views/SettingsView.vue';
import NotFound from '@/views/NotFound.vue';

function checkVideosPresenceBeforeEnter() {
  const mainStore = useMainStore();
  if (!mainStore.playlist) {
    return router.push({name: 'playlistSelect'});
  }

  return true;
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: () => {
        checkVideosPresenceBeforeEnter();
      },
    },
    {
      path: '/playlist-select',
      name: 'playlistSelect',
      component: PlaylistSelect
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      beforeEnter: () => {
        checkVideosPresenceBeforeEnter();
      },
    },
    {
      path: '/:catchAll(.*)',
      component: NotFound
    }
  ]
});

export default router;
