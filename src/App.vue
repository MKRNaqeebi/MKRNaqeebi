<template>
  <AllOpenIssues v-if="github" />
  <HomeView v-else />
</template>

<script>
import { mapGetters } from "vuex";

import HomeView from "./views/HomeView.vue";
import AllOpenIssues from "./views/AllOpenIssues.vue";

export default {
  name: "App",
  components: {
    HomeView,
    AllOpenIssues
  },
  computed: {
    ...mapGetters(["github"]),
  },
};
</script>
<style>
@font-face {
  font-family: "Montserrat";
  src: local("Montserrat"),
   url(./fonts/montserrat-500.ttf) format("truetype");
}
</style>
