<template>
  <GitHub v-if="github" />
  <HomeView v-else />
</template>

<script>
import { mapGetters } from "vuex";

import HomeView from "./views/HomeView.vue";
import GitHub from "./views/GitHub.vue";

export default {
  name: "App",
  components: {
    HomeView,
    GitHub,
  },
  computed: {
    ...mapGetters(["github"]),
  },
};
</script>