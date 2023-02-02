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
        <input
          type="text"
          placeholder="repository"
          v-model="repository"
          @keyup.enter="fetchIssues"
        />
        <button @click="fetchIssues">Fetch</button>
      </div>
    </div>
  </div>
  <FortyHours
    v-if="username && password"
    :username="username"
    :password="password"
  />
  <GanttChart
    v-if="username && password && repository && fetch"
    :username="username"
    :password="password"
    :repository="repository"
  />
</template>

<script>
import GanttChart from "../components/GanttChart.vue";
import FortyHours from "../components/FortyHours.vue";

export default {
  name: "HomeView",
  components: { GanttChart, FortyHours },
  data() {
    return {
      username: "",
      password: "",
      repository: "",
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
