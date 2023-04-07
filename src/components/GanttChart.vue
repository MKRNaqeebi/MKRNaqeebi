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
      <div>
        <div class="my-2.5">
          <div ref="gantt" class="gantt-container" id="gantt_chart_container"></div>
        </div>
      </div>
    </div> 
  </div>
</template>

<script>
import axios from "axios";
import "dhtmlx-gantt";
import { gantt } from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import moment from "moment";
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
      tasks: [],
      visible: false,
      valueRepo: "Select Repository",
      visibleRepo: false,
      buttonClicked: false,
    };
  },
  watch: {
  valueRepo(newVal, oldVal) {
    // Call fetchIssues method again when valueRepo property changes
    this.fetchIssues();
  }
},
  mounted() { 
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
  fetchIssues() {
    this.tasks = []; // clear previous tasks
    axios({
      method: "get",
      url: `https://api.github.com/repos/${this.valueRepo}/issues?state=open`,
      auth: {
        username: this.username,
        password: this.password,
      },
    })
      .then((response) => {
        const issues = response.data;
        console.log("issues", issues)
        issues.forEach((issue) => {
          let endDate; 
          var hours = 1;
          const startDate = moment(issue.created_at, "YYYY-MM-DDTHH:mm:ssZ").format("YYYY-MM-DD");
          if (issue.labels && Array.isArray(issue.labels)) {
            issue.labels.forEach((label) => {
              if (label.name.length < 3 && /^\d+$/.test(label.name)) {
                hours = parseInt(label.name);
              }
              if (label.name.length == 8 && /^\d+$/.test(label.name)) {
                endDate = label.name.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
              }
            });
            console.log("endDate", endDate)
          }
          const today=  moment().format("YYYY-MM-DD");
          console.log(" today",  today)
          if (endDate && endDate < today) {
            this.tasks.push({
              id: issue.number,
              text: issue.number,
              start_date: startDate,
              duration: hours,
              time: hours,
              open: false,
              color: "red"
            });
          }
          if (endDate && endDate > today) {
            this.tasks.push({
              id: issue.number,
              text: issue.number,
              start_date: startDate,
              duration: hours,
              time: hours,
              open: false,
              color: "green"
            });
          }
        });
        gantt.templates.timeline_cell_class = function(task,date){
          if(date.getDay()==0||date.getDay()==6){
            return "weekend";
          }
        };
        gantt.config.columns = [
          {name:"id", label:"Task name",  width: 144, tree:true },
          {name:"time", label:"time", align: "center", },
        ];
        gantt.config.date_format = "%Y-%m-%d";
        gantt.config.duration_step = 1;
        gantt.config.work_time = true;
        gantt.config.duration_unit = "hour";
        gantt.config.workday = {
          hours: 8,
        }; 
        gantt.init(this.$refs.gantt, {
          width: 1000,
          height: 600,
          autofit: true
        });

        gantt.config.drag_mode = "resize";
        console.log(JSON.parse(JSON.stringify(this.tasks)));
        gantt.clearAll();
        gantt.parse({ data: this.tasks });
        gantt.render();
        var style = document.createElement("style");
        style.innerHTML = ".weekend {  background: #f4f7f4!important  }";
        document.getElementsByTagName("head")[0].appendChild(style);
      })
      .catch((error) => {
        console.error(error);
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
.weekend {
  background: #f4f7f4 !important;
}
#gantt_chart_container {
  width: 100%;
  height: 500px;
}
</style>