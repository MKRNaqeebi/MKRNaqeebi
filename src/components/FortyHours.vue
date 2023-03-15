<template>
  <div class="bg_color py-5">
    <div class="container mx-auto p-5 bg_color w-5/6">
      <div class="flex my-5">
        <div class="flex-1 w-64">
          <p class="text-xl">Developer Info</p>
        </div>
        <div class="flex-1 w-96">
          <div class="flex">
            <div class="flex-1 w-0 my-3">
              <img class="icon" src="../assets/SwitchCalendarIcon.svg" />
            </div>
            <div class="flex-1 w-8 my-3">Switch your calender view</div>
            <div class="flex-1 w-6 ml-1">

              <div class="aselect1" :data-value="value" :data-list="list">
                <div class="selector" @click="toggle()">
                  <div class="label">
                    <p class="text-lg">{{ value }}</p>
                  </div>
                  <div class="arrow" :class="{ expanded: visible }"></div>
                  <div :class="{ hidden: !visible, visible }">
                    <ul class="ulStyle">
                      <li class="liStyle" :class="{ current: item === value }" v-for="item in list" @click="select(item)">
                        <b>{{ item }}</b>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-4 gap-16">
        <div v-for="hour, assignee in hours">
          <div class="container mr-5 p-3">
            <div class="mb-3">{{ assignee }}</div>
            <div class="bg-white rounded-2xl drop-shadow-lg">
              <div
                v-bind:class="index % 2 == 0 ? 'grid grid-cols-2 gap-0 left_border1 rounded-2xl' : 'grid grid-cols-2 gap-0 left_border2 rounded-2xl'">
                <div class="pt-3 text-center">Current hours</div>
                <div class="num_style_open_task">{{ hour.current }}</div>
                <div class="pt-3 text-center">Previous hours</div>
                <div class="num_style_close_task">{{ hour.previous }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="conatiner bg-white drop-shadow-lg my-5 rounded-2xl">
        <div class=" m-3 py-3">
          <div class="section2 ml--5">
            <div class="img_repo"><img src="../assets/RepositriesIcon.svg" alt=""></div>
            <div class="text_align">Respositries</div>
            <div class="aselect ">
              <div class="selector" @click="changeRepo($event)">
                <div class="label">
                  <h4 class="text-lg">{{ valueRepo ? valueRepo : "Select Repository" }}</h4>
                </div>
                <div class="arrow" :class="{ expanded: visibleRepo }"></div>
                <div :class="{ hidden: !visibleRepo, visibleRepo }">
                  <ul class="ulStyle">
                    <li class="liStyle" :class="{ current: item === valueRepo }" v-for="item in this.repositories"
                      @click="selectRepo(item)"><b>{{ item }}</b>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div>
            <GanttChart v-if="username && password && valueRepo" :username="username" :password="password"
              :repository="valueRepo" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <div>
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
  <LateTask
    v-if="username && password"
    :username="username"
    :password="password"
  /> -->
</template>

<script>
import GanttChart from "../components/GanttChart.vue";
import LateTask from "../components/LateTask.vue";
import axios from "axios";
export default {
  name: "FORTY",
  components: { GanttChart, LateTask },
  props: ["username", "password"],
  data() {
    return {
      hours: {},
      repositories: [],
      repo: "",
      organization: "CoalAI",
      visibleRepo: false,
      valueRepo: null,
      value: 'Select',
      list: ["Select", "Monthly", "Weekly"],
      visible: false,
    };
  },
  mounted() {
    this.fetchIssues();
  },
  methods: {
    toggle() {
      this.visible = !this.visible;
    },
    select(option) {
      this.value = option;
    },

    toggleRepo() {
      this.visibleRepo = !this.visibleRepo;
    },
    selectRepo(option) {
      this.valueRepo = option;
    },
    changeRepo() {
      this.visibleRepo = !this.visibleRepo;
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
.ulStyle {
  width: 100%;
  list-style-type: none;
  padding: 0;
  margin: 0;
  font-size: 16px;
  border: 1px solid gainsboro;
  position: absolute;
  z-index: 1;
  background: #F7B696;
  border-radius: 8px;
  max-height: 150px;
  overflow: hidden;
  overflow-y: auto;

}
</style>
