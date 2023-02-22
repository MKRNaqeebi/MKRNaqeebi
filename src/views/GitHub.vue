<template>
  <div class="home-view">
    <div class="home-view__header">
      <h3 class="home-view__title">Gantt Chart</h3>
      <div class="home-view__form">
        <input
          type="text"
          placeholder="username"
          v-model="username"
          @keyup.enter="fetchIssues"
        />
        <input
          type="password"
          placeholder="password"
          v-model="password"
          @keyup.enter="fetchIssues"
        />
      </div>
    </div>
  </div>
  <FortyHours
    v-if="username && password"
    :username="username"
    :password="password"
  />
</template>

<script>
import FortyHours from "@/components/FortyHours.vue";

export default {
  name: "HomeView",
  components: { FortyHours },
  data() {
    return {
      username: "",
      password: "",
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
