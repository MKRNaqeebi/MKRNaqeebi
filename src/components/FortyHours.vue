<template>
  <div class="w-full h-screen">
    <div v-if="buttonClickedHide">
      <header class="text-gray-600 body-font my-header">
        <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <img src="../assets/logo.svg" />
          </a>
        </div>
      </header>
    </div>
    <header class="text-gray-600 body-font my-header" v-if="buttonClickedHeader">
      <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <img src="../assets/logo.svg" @click="resetButtonClicked" />
        </a>
        <nav class="md:ml-11 flex flex-wrap items-center text-base justify-center">
          <button @click="selectIssuesByRepo"
            v-bind:class="this.selectRepoIssue == false ? 'button inline-flex items-center border-0 py-1 px-3 focus:outline-none text-base mt-4 md:mt-0' : 'button inline-flex items-center border-0 py-1 px-3 focus:outline-none rounded text-base mt-4 md:mt-0 btn-select'">
            Dev Report
          </button>
        </nav>
        <nav class="md:ml-11 flex flex-wrap items-center text-base justify-center">
          <button @click="selectIssueReport"
            v-bind:class="this.selectReportIssue == false ? 'button inline-flex items-center border-0 py-1 px-3 focus:outline-none text-base mt-4 md:mt-0' : 'button inline-flex items-center border-0 py-1 px-3 focus:outline-none rounded text-base mt-4 md:mt-0 btn-select'">
            Issue Report
          </button>
        </nav>
      </div>
    </header>
    <div class="bg-color py-6 ">
      <div class="container mx-auto p-5 bg-color w-5/6">
        <div class="flex " v-if="buttonClickedHide">
          <div>
            <input class=" border-black border rounded-lg w-60 h-10" type="text" placeholder=" Github username"
              v-model="username" @keyup.enter="fetchIssues"/>
          </div>
          <div>
            <input class="border-black border ml-20 rounded-lg w-60 h-10" type="password" placeholder=" Github password"
              v-model="password" @keyup.enter="fetchIssues"/>
          </div>
          <div>
            <input class="border-black border ml-20 rounded-lg w-60 h-10" type="text"
              placeholder="  organization e.g CoalAi" v-model="organization" @keyup.enter="fetchIssues"/>
          </div>
          <div>
            <button @click="login" class="btn ml-10 rounded-lg w-44 border-0 h-10">Fetch</button>
          </div>
        </div>
        <div>
          <div class="flex my-5" v-if="buttonClicked">
            <div class="flex-1 w-64">
              <p class="text-xl">Developer Info</p>
            </div>
            <div class="flex-1 w-96">
              <div class="flex">
                <div class="flex-1 w-0 my-3">
                  <img class="icon-calendar" src="../assets/SwitchCalendarIcon.svg"/>
                </div>
                <div class="flex-1 w-8 my-3">Switch your calender view</div>
                <div class="flex-1 w-6 ml-1">
                  <div class="aselect" :data-value="value" :data-list="list">
                    <div class="selector" @click="toggle()">
                      <div class="label">
                        <p class="text-lg">{{ value }}</p>
                      </div>
                      <div class="arrow" :class="{ expanded: visible }"></div>
                      <div :class="{ hidden: !visible, visible }">
                        <ul class="ul-style">
                          <li class="li-style" :class="{ current: item === value }" v-for="item in list"
                            @click="select(item)"><b>{{ item }}</b></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-4 gap-16" v-if="buttonClicked">
            <div v-for="(hour, assignee, index) in hours">
              <div class="container mr-5 p-3">
                <div class="mb-3">{{ assignee }}</div>
                <div class="bg-white rounded-2xl drop-shadow-lg"
                  v-bind:class="index % 2 == 0 ? 'left-border1' : 'left-border2'">
                  <div class="grid grid-cols-2 gap-0 rounded-2xl">
                    <div class="pt-3 text-center">Current hours</div>
                    <div class="num-style-open-task">{{ hour.current }}</div>
                    <div class="pt-3 text-center">Previous hours</div>
                    <div class="num-style-close-task">{{ hour.previous }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="conatiner bg-white drop-shadow-lg my-5 rounded-2xl h-screen " v-if="buttonClicked">
            <div class="gantt-div ">
               <GanttChart v-if="username && password && repositories" 
                :username="username" 
                :password="password"
                :repositories="repositories" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="selectReportIssue">
      <div class="bg-color py-6 ">
        <div class="container mx-auto p-5 bg-color w-5/6">
          <div class="flex z-10 ml-52" style="margin-top: -80px;">
            <div class="mb-6 flex">
              <div>
                <label>Start Date:</label>
                <input class="ml-6" type="date" v-model="startDate" @keyup.enter="fetchAllIssuess">
              </div>
              <div class="ml-20">
                <label>End Date:</label>
                <input class="ml-6" type="date" v-model="endDate" @keyup.enter="fetchAllIssuess">
              </div>
            </div>
            <div>
              <button style="margin-top: -10px; " @click="fetchAllIssuess"
                class="btn ml-20 rounded-lg w-44 border-0 h-10">Fetch</button>
            </div>
          </div>
          <div class="grid grid-cols-4 gap-16">
            <div v-for="(Hour, assignee, index) in Hours">
              <div class="container mr-5 p-3">
                <div class="mb-3">{{ assignee }}</div>
                <div class="bg-white rounded-2xl drop-shadow-lg"
                  v-bind:class="index % 2 == 0 ? 'left-border1' : 'left-border2'">
                  <div class="grid grid-cols-2 gap-0 rounded-2xl">
                    <div class="pt-3 text-center">Closed Task</div>
                    <div class="num-style-close-task">{{ Hour.closedTasks }}</div>
                    <div class="pt-3 text-center">Closed Task Hours</div>
                    <div class="num-style-close-task">{{ Hour.closedHours }}</div>
                    <div class="pt-3 text-center">Open Task</div>
                    <div class="num-style-close-task">{{ Hour.openTasks }}</div>
                    <div class="pt-3 text-center">open Task hours</div>
                    <div class="num-style-close-task">{{ Hour.openHours }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
      </div>
    </div>

    <div v-show="selectRepoIssue">
      <div class="bg-color py-6 ">
        <div class="container mx-auto p-5 bg-color w-5/6">
          <div class="flex z-10 ml-52" style="margin-top: -80px;">
            <div class="mb-6 flex">
              <div>
                <label>Start Date:</label>
                <input class="ml-6" type="date" v-model="firstDate" @keyup.enter="fetch">
              </div>
              <div class="ml-20">
                <label>End Date:</label>
                <input class="ml-6" type="date" v-model="lastDate" @keyup.enter="fetch">
              </div>
            </div>
            <div>
              <button style="margin-top: -10px; " @click="fetch"
                class="btn ml-20 rounded-lg w-44 border-0 h-10">Fetch</button>
            </div>
          </div>
          <div>
            <label class="text-align"> Developers: </label>
            <select id="assignee-dropdown" v-model="selectedAssignee" class="as-elect">
              <option value="">Developers</option>
              <option class="li-style" v-for="(value, key) in performaceHours" :value="key">{{ key }}</option>
            </select>
            <div v-if="selectedAssignee !== ''">

              <div>{{ selectedAssignee }}:</div>
              <div class="grid grid-cols-4 gap-16">
                <div class="container mr-5 p-3">
                  <div class="bg-white rounded-2xl drop-shadow-lg">
                    <div class="grid grid-cols-2 gap-0 rounded-2xl left-border1">
                      <div class="pt-3 text-center">Closed Task</div>
                      <div class="num-style-close-task">{{ performaceHours[selectedAssignee].closedTasks }}</div>
                      <div class="pt-3 text-center">Closed Task Hours</div>
                      <div class="num-style-close-task">{{ performaceHours[selectedAssignee].closedHours }}</div>
                      <div class="pt-3 text-center">Open Task</div>
                      <div class="num-style-close-task">{{ performaceHours[selectedAssignee].openTasks }}</div>
                      <div class="pt-3 text-center">open Task hours</div>
                      <div class="num-style-close-task">{{ performaceHours[selectedAssignee].openHours }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="gantt-div ">
                <PerformanceGanttChart  v-if="username && password && repositories && selectedAssignee " 
                 :username="username" 
                 :password="password" 
                 :repositories="performaceHours[selectedAssignee].repoName" 
                 :selectedAssignee="selectedAssignee"
                 />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import GanttChart from "../components/GanttChart.vue";
import LateTask from "../components/LateTask.vue";
import PerformanceGanttChart from "../components/PerformanceGanttChart.vue";
import axios from "axios";
export default {
  name: "FortyHours",
  components: { GanttChart, LateTask, PerformanceGanttChart },
  data() {
    return {
      username: "",
      password: "",
      startDate: null,
      endDate: null,
      hours: {},
      Hours: {},
      performaceHours: {},
      repositories: [],
      organization: "",
      value: 'Weekly',
      list: ['Weekly', 'Monthly'],
      visible: false,
      buttonClicked: false,
      buttonClickedHeader: false,
      buttonClickedHide: true,
      selectAllIssues: false,
      selectRepoIssue: false,
      selectReportIssue: false,
      selectedAssignee: "",
      firstDate: null,
      lastDate: null,
    };
  },
  methods: {
    selectAllOpenIssues() {
      this.selectAllIssues = true;
      this.selectRepoIssue = false;
      this.selectReportIssue = false;
    },

    selectIssuesByRepo() {
      this.selectRepoIssue = true;
      this.selectAllIssues = false;
      this.selectReportIssue = false;
      this.buttonClicked = false;

    },
    selectIssueReport() {
      this.selectReportIssue = true;
      this.selectAllIssues = false;
      this.selectRepoIssue = false;
      this.buttonClicked = false;

    },
    resetButtonClicked() {
      this.buttonClicked = true
      this.selectReportIssue = false;
      this.selectAllIssues = false;
      this.selectRepoIssue = false;
    },
    login() {
      axios.get(`https://api.github.com/user`, {
        auth: {
          username: this.username,
          password: this.password,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            this.fetchIssues();
            this.loadTheTemplateAbove();
            this.loadTheTemplateHide();
            this.loadTheTemplate()
          }

        })
        .catch((error) => {
          console.error(); ("ee", error)
          if (error.response.status === 403) {
            alert("given credential is not valid!!!");
          }
        });
    },
    toggle() {
      this.visible = !this.visible;
    },
    loadTheTemplateAbove() {
      this.buttonClicked = !this.buttonClicked;
    },
    loadTheTemplate() {
      this.buttonClickedHeader = !this.buttonClickedHeader;
    },
    loadTheTemplateHide() {
      this.buttonClickedHide = !this.buttonClickedHide;
    },
    select(option) {
      this.value = option;
    },
    select(item) {
      this.value = item;
      this.visible = false;
      if (item === 'Monthly') {
        this.hours = {}
        this.fetchIssues();
      }
      if (item === 'Weekly') {
        this.hours = {}
        this.fetchIssues();
      }
    },
    getPreviousMonday() {
      var prevMonday = new Date();
      prevMonday.setDate(prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7));
      prevMonday.setHours(0, 0, 0, 0);
      return prevMonday;
    },
    getStatingMonday() {
      var startingDay = new Date(this.getPreviousMonday());
      startingDay.setDate(startingDay.getDate() - 7);
      startingDay = startingDay.toISOString().split("T")[0];
      return startingDay;
    },
    formateIssueWeekly(issues) {
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
              if (issueClosedAt <= prevMonday && issueClosedAt >= startingMonday) {
                this.hours[issue.assignee.login.toLowerCase()]["previous"] += parseInt(label.name);
              }
              if (issueClosedAt >= prevMonday) {
                this.hours[issue.assignee.login.toLowerCase()]["current"] += parseInt(label.name);
              }
            }
          } catch (error) {
            console.error(error);
            console.error(issue.html_url);
          }
        });
      });
    },
    formateIssueMonthly(issues) {
      issues.forEach((issue) => {
        if (issue.labels.length < 1) return;
        // check if issue is closed before last Monday
        issue.labels.forEach((label) => {
          try {
            label.name = label.name.replace("hrs", "");
            if (label.name.length < 3 && /^\d+$/.test(label.name)) {
              var today = new Date();
              const currentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
              const prveMonth = new Date(currentMonth);
              prveMonth.setDate(currentMonth.getDate() - 30);
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
              if (issueClosedAt >= prveMonth && issueClosedAt <= currentMonth) {
                this.hours[issue.assignee.login.toLowerCase()]["previous"] += parseInt(label.name);
              }
              if (issueClosedAt >= currentMonth) {
                this.hours[issue.assignee.login.toLowerCase()]["current"] += parseInt(label.name);
              }
            }
          } catch (error) {
            console.error(); (error);
            console.error(issue.html_url);
          }
        });
      });
    },
    formateIssue(issues) {
      issues.forEach((issue) => {
        if (issue.labels.length < 1) return;
        // check if issue is closed before last Monday
        issue.labels.forEach((label) => {
          try {
            label.name = label.name.replace("hrs", "");
            if (label.name.length < 3 && /^\d+$/.test(label.name)) {
              var today = new Date();
              const currentMonth = new Date(this.endDate)
              const prveMonth = new Date(this.startDate)
              var issueClosedAt = new Date(issue.closed_at);
              var issueCreatedAt = new Date(issue.created_at);
              currentMonth.setHours(0, 0, 0, 0);
              prveMonth.setHours(0, 0, 0, 0);
              issueClosedAt.setHours(0, 0, 0, 0);
              issueCreatedAt.setHours(0, 0, 0, 0);

              if (!issue.assignee) {
                issue.assignee = issue.assignees[0];
              }
              if (!issue.assignee) return;
              if (!this.Hours[issue.assignee.login.toLowerCase()]) {
                this.Hours[issue.assignee.login.toLowerCase()] = {
                  closedHours: 0,
                  openHours: 0,
                  closedTasks: 0,
                  openTasks: 0,
                  next: 0,
                };
              }
              if (issue.state == 'closed' && issueClosedAt >= prveMonth && issueClosedAt <= currentMonth) {
                this.Hours[issue.assignee.login.toLowerCase()]["closedHours"] += parseInt(label.name);
              }
              if (issue.state == 'open' && issueCreatedAt >= prveMonth && issueCreatedAt <= currentMonth) {
                this.Hours[issue.assignee.login.toLowerCase()]["openHours"] += parseInt(label.name);
              }
              // increment the number of closed tasks for the assignee
              if (issue.state == 'closed' && issueClosedAt >= prveMonth && issueClosedAt <= currentMonth) {
                this.Hours[issue.assignee.login.toLowerCase()].closedTasks++;
              }
              if (issue.state == 'open' && issueCreatedAt >= prveMonth && issueCreatedAt <= currentMonth) {
                this.Hours[issue.assignee.login.toLowerCase()].openTasks++;
              }
            }
          } catch (error) {
            console.error(error);
            console.error(issue.html_url);
          }
        });
      });
    },
    formateAllIssue(issues) {
      issues.forEach((issue) => {
        if (issue.labels.length < 1) return;
        issue.labels.forEach((label) => {
          try {
            label.name = label.name.replace("hrs", "");
            if (label.name.length < 3 && /^\d+$/.test(label.name)) {
              const today = new Date();
              const currentMonth = new Date(this.lastDate);
              const prevMonth = new Date(this.firstDate);
              const issueClosedAt = new Date(issue.closed_at);
              const issueCreatedAt = new Date(issue.created_at);
              currentMonth.setHours(0, 0, 0, 0);
              prevMonth.setHours(0, 0, 0, 0);
              issueClosedAt.setHours(0, 0, 0, 0);
              issueCreatedAt.setHours(0, 0, 0, 0);


              if (!issue.assignee) {
                issue.assignee = issue.assignees[0];
              }
              if (!issue.assignee) return;
              if (!this.performaceHours[issue.assignee.login.toLowerCase()]) {
                this.performaceHours[issue.assignee.login.toLowerCase()] = {
                  closedHours: 0,
                  openHours: 0,
                  closedTasks: 0,
                  openTasks: 0,
                  repoName: [],
                  next: 0,
                };
              }

              const myArray = issue.repository_url.split("https://api.github.com/repos/");
              if (myArray[1]) {
                const repo = myArray[1];
                // Check if the repository name is not already in the array before pushing it
                if (!this.performaceHours[issue.assignee.login.toLowerCase()]["repoName"].includes(repo)) {
                  this.performaceHours[issue.assignee.login.toLowerCase()]["repoName"].push(repo);
                }
              }

              if (issue.state === "closed" && issueClosedAt >= prevMonth && issueClosedAt <= currentMonth) {
                this.performaceHours[issue.assignee.login.toLowerCase()]["closedHours"] += parseInt(label.name);
              }
              if (issue.state === "open" && issueCreatedAt >= prevMonth && issueCreatedAt <= currentMonth) {
                this.performaceHours[issue.assignee.login.toLowerCase()]["openHours"] += parseInt(label.name);
              }

              // Increment the number of closed tasks for the assignee
              if (issue.state === "closed" && issueClosedAt >= prevMonth && issueClosedAt <= currentMonth) {
                this.performaceHours[issue.assignee.login.toLowerCase()].closedTasks++;
              }
              if (issue.state === "open" && issueCreatedAt >= prevMonth && issueCreatedAt <= currentMonth) {
                this.performaceHours[issue.assignee.login.toLowerCase()].openTasks++;
              }
            }
          } catch (error) {
            console.error(error);
            console.error(issue.html_url);
          }
        });
      });
    },
    allIssues(repositories) {
      if (!repositories) {
        console.error('Error: repos is undefined.');
        return;
      }
      if (this.value === "Weekly") {
        const startingDay = this.getStatingMonday();
        var lastDay = new Date(startingDay);
        lastDay.setDate(lastDay.getDate() - 7); // set last day to one week ago
        repositories.forEach((repo) => {
          axios({
            method: "get",
            url: `https://api.github.com/repos/${repo.full_name}/issues?state=closed&archived:false&+closed=${startingDay}`,
            auth: {
              username: this.username,
              password: this.password,
            },
          })
            .then((response) => {
              this.formateIssueWeekly(response.data);
            })
            .catch((error) => {
              console.error(error);
            });
        });
      } else if (this.value === "Monthly") {
        var today = new Date(); // create a new Date object with today's date
        var firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // create a new Date object with the first day of the current month
        var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // create a new Date object with the last day of the current month
        firstDayOfMonth = firstDayOfMonth.toISOString().split("T")[0];
        lastDayOfMonth = lastDayOfMonth.toISOString().split("T")[0];
        repositories.forEach((repo) => {
          axios({
            method: "get",
            url: `https://api.github.com/repos/${repo.full_name}/issues?state=closed&archived:false&+closed=${firstDayOfMonth}..closed=${lastDayOfMonth}`,
            auth: {
              username: this.username,
              password: this.password,
            },
          })
            .then((response) => {
              this.formateIssueMonthly(response.data);
            })
            .catch((error) => {
              console.error(error);
            });
        });
      }
    },
    selectIssue(repositories) {
      var first = this.firstDate;
      var last = this.lastDate;

      repositories.forEach((repo) => {
        // Function to recursively fetch pages of issues
        const fetchIssues = (url, state) => {
          axios({
            method: "get",
            url: url,
            auth: {
              username: this.username,
              password: this.password,
            },
          })
            .then((response) => {
              this.formateIssue(response.data);

              // Check if there are more pages to fetch
              const linkHeader = response.headers.link;
              if (linkHeader && linkHeader.includes('rel="next"')) {
                // Extract the URL for the next page
                const nextUrl = linkHeader
                  .split(", ")
                  .find((link) => link.includes('rel="next"'))
                  .split(";")[0]
                  .trim()
                  .slice(1, -1);

                // Fetch the next page of issues
                fetchIssues(nextUrl, state);
              }
            })
            .catch((error) => {
              console.error(error);
            });
        };

        // Fetch closed issues
        const closedIssuesUrl = `https://api.github.com/repos/${repo.full_name}/issues?state=closed&archived=false&closed=${first}..${last}`;
        fetchIssues(closedIssuesUrl, "closed");

        // Fetch open issues
        const openIssuesUrl = `https://api.github.com/repos/${repo.full_name}/issues?state=open&archived=false&created=${first}..${last}`;
        fetchIssues(openIssuesUrl, "open");
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
            console.error(error);
            return;
          });
        page++;
        if (page > 5) {
          nextPage = false;
          return;
        }
      }
    },
    fetchAllIssuess() {
      this.Hours = {};
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
            this.selectIssue(response.data)
            if (response.data.length < 1) {
              nextPage = false;
              return;
            }
          })
          .catch((error) => {
            nextPage = false;
            console.error(error);
            return;
          });
        page++;
        if (page > 5) {
          nextPage = false;
          return;
        }
      }
    },
    selectAllIssue(repositories) {
      var first = this.firstDate;
      var last = this.lastDate;

      repositories.forEach((repo) => {
        // Function to recursively fetch pages of issues
        const fetchIssues = (url, state) => {
          axios({
            method: "get",
            url: url,
            auth: {
              username: this.username,
              password: this.password,
            },
          })
            .then((response) => {
              this.formateAllIssue(response.data);

              // Check if there are more pages to fetch
              const linkHeader = response.headers.link;
              if (linkHeader && linkHeader.includes('rel="next"')) {
                // Extract the URL for the next page
                const nextUrl = linkHeader
                  .split(", ")
                  .find((link) => link.includes('rel="next"'))
                  .split(";")[0]
                  .trim()
                  .slice(1, -1);

                // Fetch the next page of issues
                fetchIssues(nextUrl, state);
              }
            })
            .catch((error) => {
              console.error(error);
            });
        };

        // Fetch closed issues
        const closedIssuesUrl = `https://api.github.com/repos/${repo.full_name}/issues?state=closed&archived=false&closed=${first}..${last}`;
        fetchIssues(closedIssuesUrl, "closed");

        // Fetch open issues
        const openIssuesUrl = `https://api.github.com/repos/${repo.full_name}/issues?state=open&archived=false&created=${first}..${last}`;
        fetchIssues(openIssuesUrl, "open");
      });
    },
    fetch() {
      this.performaceHours = {};
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
            this.selectAllIssue(response.data)
            if (response.data.length < 1) {
              nextPage = false;
              return;
            }
          })
          .catch((error) => {
            nextPage = false;
            console.error(error);
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
* {
  font-family: "Montserrat";
}

.my-header {
  background-color: #495175;
}

button {
  color: white;
}

.btn-select {
  color: black;
  background-color: #F7B696;
  border-radius: 20px;
}

.bg-color {
  background-color: #EFEDE9;
}

.num-style-open-task {
  font-size: 3rem;
  color: #495175;
  text-align: center;
}

.num-style-close-task {
  font-size: 3rem;
  color: #F7B696;
  text-align: center;
}

.left-border1 {
  border-left: 10px solid #F7B696;
}

.left-border2 {
  border-left: 10px solid #495175;
}

.icon-calendar {
  margin-left: 81%;
}

.selector {
  border: 1px solid #F7B696;
  background: #F7B696;
  position: relative;
  z-index: 1;
  border-radius: 8px;
}

.arrow {
  position: absolute;
  right: 10px;
  top: 40%;
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 10px solid #495175;
  transform: rotateZ(0deg) translateY(0px);
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(.59, 1.39, .37, 1.01);
}

.expanded {
  transform: rotateZ(180deg) translateY(2px);
}

.label {
  display: block;
  padding: 10px;
  font-size: 16px;
  color: black;
}

.ul-style {
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

.li-style {
  padding: 12px;
  color: #495175;
  background: #F7B696;
  border-radius: 8px;
}

.li-style:hover {
  color: black;
  background: #f3d2c2;
}

.current {
  background: #f3d2c2;
}

.hidden {
  visibility: hidden;
}

.visible {
  visibility: visible;
}

.btn {
  background-color: #2b3046;
  color: white;
}

.my-header {
  background-color: #495175;
}

.text-align {
  text-align: center;
  margin: 12px 0px;
}

.as-elect {
  margin-left: 20px;
  width: 13rem;
  height: 40px;
  text-align: left;
  border: 1px solid #F7B696;
  background: #F7B696;
  border-radius: 8px;
  border: none;
}

.c {
  border: 1px solid #F7B696;
  background: #F7B696;
  border-radius: 8px;
}

.li-style {
  margin: 12px;
  color: #495175;
  background: #F7B696;
  border-radius: 8px;
}
</style>
