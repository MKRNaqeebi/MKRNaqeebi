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
      assignees: [
        "MKRNaqeebi",
        "usama2762",
        "1abdurRehman",
        "ahsan-coaldev",
        "aishatasaduq",
        "AliHanifdev1",
        "ammarhaider001",
        "hamza-coaldev",
        "LaiqaRafiq",
        "NajamBilalDev",
        "noumandev11",
        "RehmanCoaldev",
      ],
    };
  },
  methods: {
    fetchIssues() {
      this.fetch = true;
    },
  },
};
</script>
