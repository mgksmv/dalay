import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
  state: () => ({
    playlist: null,
    candidatesCount: null,
  }),
});
