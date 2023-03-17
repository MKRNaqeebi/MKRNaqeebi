<template>
  <button @click="fetchIssues">Fetch</button>
  <!-- <g-gantt-chart
    :chart-start="'2023-02-01 01:00'"
    :chart-end="'2023-02-03 08:00'"
    precision="hour"
    bar-start="'2023-02-01 01:00'"
    bar-end="'2023-02-03 08:00'"
  > -->
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
      :label="issue.bar[0].ganttBarConfig.no"
      :bars="issue.bar"
    />
    <!-- .bar[0].ganttBarConfig.no" -->
  </g-gantt-chart>
</template>

<script>
import axios from "axios";

export default {
  name: "GanttChart",
  props: {
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    repository: {
      type: String,
    },
  },
  data() {
    return {
      start: "",
      end: "",
      issues: [],
      // repository: "CoalAI/ganttissues",
      // username: "LaiqaRafiq",
      // password: "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",

      // hours: {},
      // repositories: [],
      // repo: "CoalAI/ganttissues",
      // organization: "CoalAI",

    };
  },
  mounted() {
    this.fetchIssues();
  },
//   methods: {
//     changeRepo(event) {
//       this.repo = event.target.value;
//     },
//     getPreviousMonday() {
//       var prevMonday = new Date();
//       prevMonday.setDate(
//         prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7)
//       );
//       prevMonday.setHours(0, 0, 0, 0);
//       return prevMonday;
//     },
//     getStatingMonday() {
//       var startingDay = new Date(this.getPreviousMonday());
//       startingDay.setDate(startingDay.getDate() - 7);
//       startingDay = startingDay.toISOString().split("T")[0];
//       return startingDay;
//     },
//     formateIssue(issues) {
//       issues.forEach((issue) => {
//         if (issue.labels.length < 1) return;
//         // check if issue is closed before last Monday
//         issue.labels.forEach((label) => {
//           try {
//             label.name = label.name.replace("hrs", "");
//             if (label.name.length < 3 && /^\d+$/.test(label.name)) {
//               const prevMonday = this.getPreviousMonday();
//               // minus 7 days from prevMonday
//               var startingMonday = new Date(prevMonday);
//               startingMonday.setDate(startingMonday.getDate() - 7);
//               var issueClosedAt = new Date(issue.closed_at);
//               if (!issue.assignee) {
//                 issue.assignee = issue.assignees[0];
//               }
//               if (!issue.assignee) return;
//               if (!this.hours[issue.assignee.login.toLowerCase()]) {
//                 this.hours[issue.assignee.login.toLowerCase()] = {
//                   current: 0,
//                   previous: 0,
//                   next: 0,
//                 };
//               }
//               if (
//                 issueClosedAt <= prevMonday &&
//                 issueClosedAt >= startingMonday
//               ) {
//                 this.hours[issue.assignee.login.toLowerCase()]["previous"] +=
//                   parseInt(label.name);
//               }
//               if (issueClosedAt >= prevMonday) {
//                 this.hours[issue.assignee.login.toLowerCase()]["current"] +=
//                   parseInt(label.name);
//               }
//             }
//           } catch (error) {
//             console.log(error);
//             console.log(issue.html_url);
//           }
//         });
//       });
//     },
//     allIssues(repos) {
//       const startingDay = this.getStatingMonday();
      
//       var lastDay = new Date(startingDay);
//       lastDay.setDate(lastDay.getDate() - 7);
//       lastDay = lastDay.toISOString().split("T")[0];
//       repos.forEach((repo) => {
//         // console.log("repo.full_name", repo.full_name);
//         // console.log("startingDay", startingDay);
//         axios({
//           method: "get",
//           url: `https://api.github.com/repos/${repo.full_name}/issues?state=closed&archived:false+closed=${startingDay}`,
//           auth: {
//             username: this.username,
//             password: this.password,
//           },
//         })
//           .then((response) => {
//             this.formateIssue(response.data);
//           })
//           .catch((error) => {
//             console.log(error);
//           });
//       });
//     },
//     allRepo(repos) {
//       repos.forEach((repo) => {
//         this.repositories.push(repo.full_name);
//       });
//     },
//     fetchIssues() {
//       let nextPage = true;
//       let page = 1;
//       while (nextPage) {
//         axios({
//           method: "get",
//           url: `https://api.github.com/orgs/${this.organization}/repos?&page=${page}&per_page=2`,
//           auth: {
//             username: this.username,
//             password: this.password,
//           },
//         })
//           .then((response) => {
//             this.allIssues(response.data);
//             this.allRepo(response.data);
//             if (response.data.length < 1) {
//               nextPage = false;
//               return;
//             }
//           })
//           .catch((error) => {
//             nextPage = false;
//             console.log(error);
//             return;
//           });
//         page++;
//         if (page > 5) {
//           nextPage = false;
//           return;
//         }
//       }
//     },
//   },
// };
  methods: {
    formateIssue(issues) {
      let tempIssues = [];
      issues.forEach((issue) => {
        if (issue.labels.length < 1) return;
        let temp = {};
        temp.title = issue.title;
        temp.id = issue.id;
        temp.bar = [{}];
        // console.log("issue", issue);
        issue.labels.forEach((label) => {
          console.log("label", label);
          try {
            if (label.name.length == 8 && /^\d+$/.test(label.name)) {
              const endDate = label.name.replace(
                /(\d{4})(\d{2})(\d{2})/,
                "$1-$2-$3 00:00"
              );
              // console.log("endDate", endDate);
              var hours = 2;
              issue.labels.forEach((label) => {
                if (label.name.length < 3 && /^\d+$/.test(label.name)) {
                  hours = parseInt(label.name);
                }
              });
              // console.log("endDate", endDate);
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
              temp.bar[0].ganttBarConfig.no = issue.number;
              // if end date is less than current date, set bar color to red
              if (new Date(endDate) < new Date()) {
                temp.bar[0].ganttBarConfig.style = {};
                temp.bar[0].ganttBarConfig.style.background = "red";
              }
              tempIssues.push(temp);
            }
          } catch (error) {
            console.log(error);
          }
        });
      });
      this.issues = tempIssues;
      // this.start = "2023-01-19";
      // this.end = "2023-01-24";
      // this.beginDate = "2023-01-19";
      // this.endDate = "2023-01-24";
      console.log("start and end date:", this.start, this.end);
      console.log("beginDate and endDate:", this.beginDate, this.endDate);
    },
    fetchIssues() {
      console.log("repository", this.repository);
      axios({
        method: "get",
        url: `https://api.github.com/repos/${this.repository}/issues?state=open`,
        auth: {
          // username: this.username,
          // password: this.password,
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
