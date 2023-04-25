<template>
  <div class="bg-slate-200 py-2">
    <div class="max-w-4xl w-10/12 mx-auto flex justify-between items-center">
      <router-link to="/" class="flex items-center gap-2">
        <img src="/images/logo.svg" alt="" width="32" height="32"/>
        <p class="text-center text-slate-700 text-lg font-bold">Trigonometry Simulator</p>
      </router-link>
      <div>
        <router-link
          to="/graph"
          class="px-2 py-1 rounded-md hover:bg-slate-300 transition-colors"
        >
          Graph
        </router-link>
      </div>
    </div>
  </div>
</template>