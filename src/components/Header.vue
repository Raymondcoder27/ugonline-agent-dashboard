<script setup lang="ts">
import Logo from "@/assets/images/banner.png";
import TopMenu from "@/components/TopMenu.vue";
import { useStorage } from "@vueuse/core";
import { computed, unref, ref } from "vue";
import type { ComputedRef } from "vue";
import { useWindowSize } from "@vueuse/core";
const { width } = useWindowSize();
const isMobile: ComputedRef<boolean> = computed(() => unref(width) <= 768);
const sideMenuOpen = ref(useStorage("sms", true));
</script>

<template>
  <nav
    class="top-0 relative z-50 w-full md:flex-row md:flex-nowrap flex items-center px-2 py-3 navbar-expand-lg border-b border-primary-200 bg-white"
  >
    <div class="flex items-center justify-between w-full px-4">
      <!-- Left side: Logo and sidebar toggle button -->
      <div class="flex items-center">
        <span
          @click="sideMenuOpen = !sideMenuOpen"
          class="text-primary text-xl block cursor-pointer mr-4"
        >
          <i
            :class="
              sideMenuOpen
                ? 'transition ease-in-out rotate-0 duration-200'
                : 'transition ease-in-out -rotate-180 duration-200'
            "
            class="fa-solid fa-angles-left"
          ></i>
        </span>
        <div class="flex items-center">
          <span
            class="my-auto mx-2 text-white rounded font-bold text-xl shadow"
          >
            <b class="rounded-l bg-black-800 p-1">ug</b>
            <b class="bg-yellow-500 p-1">On</b>
            <b class="rounded-r bg-primary-700 p-1">line</b>
          </span>
        </div>
      </div>

      <!-- Centered TopMenu -->
      <div class="flex-1 flex justify-center items-center">
        <TopMenu />
      </div>

      <!-- Right side: Person icon and logout button -->
      <div class="flex items-center">
        <i class="fa-solid fa-user text-xl mr-4"></i>
        <p class="text-sm font-bold">Username</p>
        <button
          class="px-2 border border-primary-500 text-primary-700 rounded text-xs hover:bg-primary hover:text-white"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
