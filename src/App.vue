<template>
  <GitHub v-if="github" />
  <HomeView v-else />
</template>

<script>
import HomeView from "./views/HomeView.vue";
import GitHub from "./views/GitHub.vue";

export default {
  name: "App",
  components: {
    HomeView,
    GitHub,
  },
  data() {
    return {
      github: false,
    };
  },
};
</script>
