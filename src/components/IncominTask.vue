<template>
    <h1>incoming task</h1>
    <div>
      <input type="username" placeholder="username" v-model="username" />
      <input type="password" placeholder="password" v-model="password" />
      <button v-on:click="fetchAllIssues">Fetch</button>
    </div>
    <div class="div1">
      <li>
        developer: {{ Object.keys(tempassignee) }}
        total Hours:
        {{ Object.values(tempassignee) }}
      </li>
    </div>
    <div class="div1">
      <g-gantt-chart
        :chart-start="start"
        :chart-end="end"
        precision="hour"
        bar-start="beginDate"
        bar-end="endDate"
      >
        <g-gantt-row
          v-for="issue in issues"
          :key="issue.id"
          label=""
          :bars="issue.bar"
        />
      </g-gantt-chart>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  export default {
    name: "IncomingTask",
    data() {
      return {
        username: "",
        password: "",
        start: "",
        end: "",
        issues: [],
        tempassignee: {},
      };
    },
    methods: {
      formateIssue(issues) {
        let tempIssues = [];
        issues.forEach((issue) => {
          if (issue.labels.length < 1) return;
          let temp = {};
          temp.title = issue.title;
          temp.id = issue.id;
          temp.bar = [{}];
          issue.labels.forEach((label) => {
            try {
              if (label.name.length == 8 && /^\d+$/.test(label.name)) {
                const endDate = label.name.replace(
                  /(\d{4})(\d{2})(\d{2})/,
                  "$1-$2-$3 00:00"
                );
                var hours = 2;
                issue.labels.forEach((label) => {
                  if (label.name.length < 3 && /^\d+$/.test(label.name)) {
                    hours = parseInt(label.name);
                  }
                });
                let issueAssign = issue.assignee.login;
                if (issueAssign in this.tempassignee) {
                  this.tempassignee[issueAssign] =
                    this.tempassignee[issueAssign] + hours;
                } else {
                  this.tempassignee[issueAssign] = hours;
                }
                temp.bar[0].endDate = endDate;
                let beginDate = new Date(endDate);
                // minus hours from myBeginDate
                beginDate.setHours(beginDate.getHours() - hours);
                // convert myBeginDate to string
                beginDate = beginDate.toISOString();
                temp.bar[0].beginDate = beginDate.replace(
                  /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).*/,
                  "$1-$2-$3 $4:$5"
                );
                if (this.start == "") {
                  this.start = temp.bar[0].beginDate;
                }
                if (this.end == "") {
                  this.end = temp.bar[0].endDate;
                }
                if (this.start > temp.bar[0].beginDate) {
                  this.start = temp.bar[0].beginDate;
                }
                if (this.end < temp.bar[0].endDate) {
                  this.end = temp.bar[0].endDate;
                }
                temp.bar[0].ganttBarConfig = {};
                temp.bar[0].ganttBarConfig.id = issue.id;
                temp.bar[0].ganttBarConfig.label = `#${issue.number} ${issue.title}`;
                // if end date is less than current date, set bar color to red
                var currentDate = new Date();
                var currentDateWithFormat =
                  new Date().toJSON().slice(0, 10) + " 00:00";
                if (currentDateWithFormat > endDate) {
                  temp.bar[0].ganttBarConfig.style = {};
                  temp.bar[0].ganttBarConfig.style.background = "red";
                  tempIssues.push(temp);
                } else {  // if end date is greater than current date, set bar color to green
                  temp.bar[0].ganttBarConfig.style = {};
                  temp.bar[0].ganttBarConfig.style.background = "green";
                  tempIssues.push(temp);
                }
              }
            } catch (error) {
              console.log(error);
            }
          });
        });
        this.issues = tempIssues;
      },
      fetchAllIssues() {
        axios({
          method: "get",
          url: `https://api.github.com/issues?state=open&q=type:issue+user:CoalAI`,
          auth: {
            username: this.username,
            password: this.password,
          },
        })
          .then((response) => {
            this.formateIssue(response.data);
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      },
    },
  };
  </script>
  <style scoped>
  .div1 {
    margin-top: 10px;
  }
  </style>
  