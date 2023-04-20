<template>
  <div class="bg-slate-200 py-4">
    <div class="max-w-4xl w-10/12 mx-auto">
      <p class="text-center text-slate-700">
        Developed By
        <a target="_blank" href="https://yskkyle.com" class="text-slate-500 font-mono">Kyle Smith</a>
      </p>
      <div class="h-4"></div>
      <div class="grid grid-cols-2 text-center">
        <div class="flex flex-col items-center">
          <router-link to="/contact">Contact Us</router-link>
          <a target="_blank" href="https://discord.gg/dJKUYq5qEn">Community Discord</a>
        </div>
        <div class="flex flex-col items-center">
          <router-link to="/privacy">Privacy Policy</router-link>
          <router-link to="/terms">Terms of Service</router-link>
          <router-link to="/returns">Return Policy</router-link>
        </div>
      </div>
    </div>
  </div>
</template>