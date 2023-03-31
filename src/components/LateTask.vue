<template>
    <div  class="m-8 mt-6">
      <h1>List all red issues</h1>
      <button @click="fetchAllIssues">Fetch ALL task</button>
    </div>
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
  </template>
  
  <script>
  import axios from "axios";
  export default {
    name: "LateTask",
    props: {
    username: {
      type: String,
    },
    password: {
      type: String,
    },
  },
    data() {
      return {
        start: "",
        end: "",
        issues: [],
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
                var currentDate = new Date();
                var currentDateWithFormat =
                  new Date().toJSON().slice(0, 10) + " 00:00";
                var hours = 2;
                issue.labels.forEach((label) => {
                  if (label.name.length < 3 && /^\d+$/.test(label.name)) {
                    hours = parseInt(label.name);
                  }
                });
                temp.bar[0].endDate = endDate;
                let beginDate = new Date(endDate);
                // minus hours from myBeginDate
                beginDate.setHours(beginDate.getHours() - hours);
                // convert myBeginDate to string
                beginDate = beginDate.toISOString();
                temp.bar[0].beginDate = beginDate.replace(
                  /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).*/,
                  "$1-$2-$3 00:00"
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
                // if current date is greater than the enddate, set bar color to red
                if (currentDateWithFormat > endDate) {
                  temp.bar[0].ganttBarConfig.style = {};
                  temp.bar[0].ganttBarConfig.style.background = "red";
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
          })
          .catch((error) => {
            console.log(error);
          });
      },
    },
  };
  </script>
