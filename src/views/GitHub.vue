<template>
  <FortyHours/>
</template>

<script>
import FortyHours from "../components/FortyHours.vue";
export default {
  name: "HomeView",
  components: { FortyHours, },
  data() {
    return {
      fetch: false,
    };
  },
  methods: {
    fetchIssues() {
      this.fetch = true;
    },
  },
};
</script>
