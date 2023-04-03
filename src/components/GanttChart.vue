<template>
  <div>
    <div class="m-3 py-3">
      <div class="flex ml--5">
        <div class="img-repo"><img src="../assets/RepositoriesIcon.svg" alt=""></div>
        <div class="text-align">Repositories</div>
        <div class="as-elect " :data-value="valueRepo" :data-list="repositories">
          <div class="selector" @click="toggleRepo()">
            <div class="label">
              <h4 class="text-lg">{{ valueRepo }}</h4>
            </div>
            <div class="arrow" :class="{ expanded: visibleRepo }"></div>
            <div :class="{ hidden: !visibleRepo, visibleRepo }">
              <ul class="ul-style">
                <li class="li-style" :class="{ current: item === valueRepo }" v-for="item in this.repositories"
                  @click="selectRepo(item)"><b>{{ item }}</b></li>
              </ul>
            </div>
          </div>
        </div>
        <button @click="fetchIssues(); loadTheTemplateAbove();" class="btn ml-8 rounded-lg w-24 border-0 h-12">Fetch</button>
      </div>
      <div class="my-20 gantt-div" v-if="buttonClicked">
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
    </div> 
  </div>
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
    repositories: {
      type: Array,
    }
  },
  data() {
    return {
      start: "",
      end: "",
      issues: [],
      visible: false,
      valueRepo: "Select Repository",
      visibleRepo: false,
      buttonClicked: false,
    };
  },
  methods: {
    toggleRepo() {
      this.visibleRepo = !this.visibleRepo;
    },
    loadTheTemplateAbove() {
      this.buttonClicked = !this.buttonClicked;
    },
    changeRepo(event) {
      this.repo = event.target.value;
      this.visibleRepo = !this.visibleRepo;
    },
    selectRepo(option) {
      this.valueRepo = option;
    },
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
    },
    fetchIssues() {
      axios({
        method: "get",
        url: `https://api.github.com/repos/${this.valueRepo}/issues?state=open`,
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
<style scoped>
.btn {
  background-color: #2b3046;
  color: white;
  
}
.img-repo {
  text-align: center;
  margin: 12px 17px;
}
.text-align {
  text-align: center;
  margin: 12px 0px;
}
.as-elect {
  margin-left: 20px;
  width: 13rem;
  text-align: left;
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
.gantt-div{
  position: absolute;
  left: 0px;
  top: 0px;
  right:0px;
  z-index: -1;
}
</style>