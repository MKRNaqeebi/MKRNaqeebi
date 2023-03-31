<template>
  <div class="w-full h-screen">
    <div  v-if="buttonClickedHide">
     <header class="text-gray-600 body-font my-header" >
      <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <img src="../assets/logo.svg" />
        </a>
      </div>
      </header>
    </div>
    <HeaderViewVue v-if="buttonClicked"/>
    <div class="bg-color py-6 ">
      <div class="container mx-auto p-5 bg-color w-5/6">
        <div class="flex " v-if="buttonClickedHide">
          <div>
            <input class=" border-black border rounded-lg w-60 h-10" type="text" placeholder=" Github username"
              v-model="username" @keyup.enter="fetchIssues" />
          </div>
          <div>
            <input class="border-black border ml-20 rounded-lg w-60 h-10" type="password" placeholder=" Github password"
              v-model="password" @keyup.enter="fetchIssues" />
          </div>
          <div>
            <input class="border-black border ml-20 rounded-lg w-60 h-10" type="text" placeholder="  organization e.g CoalAi"
              v-model="organization" @keyup.enter="fetchIssues" />
          </div>
          <div>
            <button @click="login" class="btn ml-10 rounded-lg w-44 border-0 h-10">Fetch</button>
          </div>
        </div>
        <div class="flex my-5" v-if="buttonClicked">
          <div class="flex-1 w-64">
            <p class="text-xl">Developer Info</p>
          </div>
          <div class="flex-1 w-96">
            <div class="flex">
              <div class="flex-1 w-0 my-3">
                <img class="icon-calendar" src="../assets/SwitchCalendarIcon.svg" />
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
              <GanttChart v-if="username && password  && repositries "
                :username="username" 
                :password="password"
                :repositries="repositries" />
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GanttChart from "../components/GanttChart.vue";
import LateTask from "../components/LateTask.vue";
import HeaderViewVue from "./HeaderView.vue";
import axios from "axios";

export default {
  name: "FORTY",
  components: { GanttChart, LateTask, HeaderViewVue },
  data() {
    return {
      username: "",
      password: "",
      hours: {},
      organization: "",
      repositries: [],
      value: 'Select',
      list: ["Select", "Monthly", "Weekly"],
      visible: false,
      buttonClicked: false,
      buttonClickedHide: true,
    };
  },
  methods: {
    login() {
      axios.get(`https://api.github.com/user`, {
          auth: {
            username: this.username,
            password: this.password,
          },
        })
        .then((response) => {
          if(response.status===200){
            this.fetchIssues();
            this.loadTheTemplateAbove(); 
            this.loadTheTemplateHide(); 
          }
        
        })
        .catch((error) => {
          console.log("ee",error)
          if(error.response.status===403){
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
    loadTheTemplateHide() {
      this.buttonClickedHide = !this.buttonClickedHide;
    },
    select(option) {
      this.value = option;
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
              if (issueClosedAt <= prevMonday && issueClosedAt >= startingMonday) {
                this.hours[issue.assignee.login.toLowerCase()]["previous"] += parseInt(label.name);
              }
              if (issueClosedAt >= prevMonday) {
                this.hours[issue.assignee.login.toLowerCase()]["current"] += parseInt(label.name);
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
        this.repositries.push(repo.full_name);
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
  * {
    font-family: "Montserrat";
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
</style>
