<template>
  <div>
    <div class="forty-hours">
      <div class="forty-hours__header">
        <h3 class="forty-hours__title">Forty Hours</h3>
        <input
          type="text"
          placeholder="organization"
          v-model="organization"
          @keyup.enter="fetchIssues"
        />
        <button @click="fetchIssues">Fetch</button>
        <ul>
          <li v-for="(hour, assignee) in hours" v-bind:key="assignee">
            {{ assignee }}: current: {{ hour.current }} and previous:
            {{ hour.previous }} hours
          </li>
        </ul>
      </div>
      <div id="vue-instance" class="form-group">
        <select class="form-control" @change="changeRepo($event)">
          <option value="" selected disabled>Please Select</option>
          <option v-for="(repo, index) in repositories" :key="index">
            {{ repo }}
          </option>
        </select>
      </div>
    </div>
  </div>
  <GanttChart
    v-if="username && password && repo"
    :username="username"
    :password="password"
    :repository="repo"
  />
</template>

<script>
import GanttChart from "../components/GanttChart.vue";
import axios from "axios";
export default {
  name: "FORTY",
  components: { GanttChart },
  // props: ["username", "password"],
  data() {
    return {
      hours: {},
      repositories: [],
      repo: "CoalDevInvoice",
      organization: "CoalAI",
      username: "LaiqaRafiq",
      password: "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",
    };
  },
  mounted() {
    this.fetchIssues();
  },
  methods: {
    changeRepo(event) {
      this.repo = event.target.value;
    },
    getPreviousMonday() {
      var prevMonday = new Date();
      prevMonday.setDate(
        prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7)
      );
      prevMonday.setHours(0, 0, 0, 0);
      return prevMonday;
    },
    getStatingMonday() {
      var startingDay = new Date(this.getPreviousMonday());
      startingDay.setDate(startingDay.getDate() - 7);
      startingDay = startingDay.toISOString().split("T")[0];
      return startingDay;
    },
    formateIssue(issues) {
      issues.forEach((issue) => {
        if (issue.labels.length < 1) return;
        // check if issue is closed before last Monday
        issue.labels.forEach((label) => {
          try {
            label.name = label.name.replace("hrs", "");
            if (label.name.length < 3 && /^\d+$/.test(label.name)) {
              const prevMonday = this.getPreviousMonday();
              // minus 7 days from prevMonday
              var startingMonday = new Date(prevMonday);
              startingMonday.setDate(startingMonday.getDate() - 7);
              var issueClosedAt = new Date(issue.closed_at);
              if (!issue.assignee) {
                issue.assignee = issue.assignees[0];
              }
              if (!issue.assignee) return;
              if (!this.hours[issue.assignee.login.toLowerCase()]) {
                this.hours[issue.assignee.login.toLowerCase()] = {
                  current: 0,
                  previous: 0,
                  next: 0,
                };
              }
              if (
                issueClosedAt <= prevMonday &&
                issueClosedAt >= startingMonday
              ) {
                this.hours[issue.assignee.login.toLowerCase()]["previous"] +=
                  parseInt(label.name);
              }
              if (issueClosedAt >= prevMonday) {
                this.hours[issue.assignee.login.toLowerCase()]["current"] +=
                  parseInt(label.name);
              }
            }
          } catch (error) {
            console.log(error);
            console.log(issue.html_url);
          }
        });
      });
    },
    allIssues(repos) {
      const startingDay = this.getStatingMonday();
      var lastDay = new Date(startingDay);
      lastDay.setDate(lastDay.getDate() - 7);
      lastDay = lastDay.toISOString().split("T")[0];
      repos.forEach((repo) => {
        axios({
          method: "get",
          url: `https://api.github.com/repos/${repo.full_name}/issues?state=closed&archived:false+closed=${startingDay}`,
          auth: {
            username: this.username,
            password: this.password,
          },
        })
          .then((response) => {
            this.formateIssue(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      });
    },
    allRepo(repos) {
      repos.forEach((repo) => {
        this.repositories.push(repo.full_name);
      });
    },
    fetchIssues() {
      let nextPage = true;
      let page = 1;
      while (nextPage) {
        axios({
          method: "get",
          url: `https://api.github.com/orgs/${this.organization}/repos?&page=${page}&per_page=100`,
          auth: {
            username: this.username,
            password: this.password,
          },
        })
          .then((response) => {
            this.allIssues(response.data);
            this.allRepo(response.data);
            if (response.data.length < 1) {
              nextPage = false;
              return;
            }
          })
          .catch((error) => {
            nextPage = false;
            console.log(error);
            return;
          });
        page++;
        if (page > 5) {
          nextPage = false;
          return;
        }
      }
    },
  },
};
</script>
<style scoped>
ul {
  display: flex;
  column-gap: 2rem;
}
</style>
