<template>
  <div class="about">
    <h1>Gantt Chart</h1>
  </div>
  <div>
    <IncomingTask></IncomingTask>
  </div>
</template>
<script>
import IncomingTask from "../components/IncominTask.vue"
export default {
  name: "IncomingTaskView",
  components: { IncomingTask },
};
</script>
