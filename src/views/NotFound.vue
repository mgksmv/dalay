<template>
    <div class="d-flex vh-100 justify-content-center align-items-center">
      <div class="d-flex justify-content-center">
        <h4>Страница не найдена</h4>
        <button @click="router.push({name: 'home'})" class="btn btn-primary ms-3">На главную</button>
      </div>
    </div>
</template>

<script setup>
import router from '@/router/index.js';
</script>
