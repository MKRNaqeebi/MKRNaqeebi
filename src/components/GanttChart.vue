<template>
  <div>
    <div class="toolbox"></div>
    <div class="gstc-wrapper" ref="gstc"></div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import GSTC from "gantt-schedule-timeline-calendar/dist/gstc.wasm.esm.min.js";
import { Plugin as CalendarScroll } from "gantt-schedule-timeline-calendar/dist/plugins/calendar-scroll.esm.min.js";
import { Plugin as TimelinePointer } from "gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js";
import "gantt-schedule-timeline-calendar/dist/style.css";

let gstc, state;
const ZOOM_LEVEL = 19;

const days = [
  {
    zoomTo: 100,
    period: "day",
    periodIncrement: 1,
    format({ timeStart }) {
      return timeStart.format("DD MMM");
    },
  },
];
const hours = [
  {
    zoomTo: 100,
    period: "hour",
    periodIncrement: 3,
    main: true,
    format({ timeStart, timeEnd }) {
      const hoursMapping = {
        "00": "1",
        "03": "2",
        "06": "3",
        "09": "4",
        "12": "5",
        "15": "6",
        "18": "7",
        "21": "8",
      };
      return hoursMapping[timeStart.format("HH")];
    },
  },
];

export default {
  name: "GSTC",
  data() {
    return {
      startDate: null,
      endDate: null,
      issues: {},
      issueItems: {},
      repository: "CoalAI/ganttissues",
      username: "LaiqaRafiq",
      password: "",
    };
  },
  mounted() {
    this.fetchIssues();
  },

  beforeUnmount() {
    if (gstc) gstc.destroy();
  },

  methods: {
    formatGantt() {
      const config = {
        licenseKey:
          "====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====",
        plugins: [
          TimelinePointer(),
          CalendarScroll(),
        ],
        list: {
          columns: {
            data: {
              [GSTC.api.GSTCID("id")]: {
                id: GSTC.api.GSTCID("id"),
                width: 60,
                data: ({ row }) => GSTC.api.sourceID(row.id),
                header: {
                  content: "Issue No",
                },
              },
              [GSTC.api.GSTCID("label")]: {
                id: GSTC.api.GSTCID("label"),
                width: 200,
                data: "label",
                header: {
                  content: "Issue Tittle",
                },
              },
            },
          },
          rows: this.issues,
        },
        chart: {
          items: this.issueItems,
          time: {
            from: this.startDate.valueOf(),
            to: this.endDate.valueOf(),
            zoom: ZOOM_LEVEL,
          },
          calendarLevels: [days, hours],
        },
      };

      state = GSTC.api.stateFromConfig(config);

      gstc = GSTC({
        element: this.$refs.gstc,
        state,
      });
    },
    formateIssue(issues) {
      let tempIssues = {};
      issues.forEach((issue) => {
        if (issue.labels.length < 2) return;

        const issueNo = GSTC.api.GSTCID(issue.number.toString());
        tempIssues[issueNo] = {
          id: issueNo,
          label: issue.title,
        };

        let issueItem = {
          id: null,
          label: "",
          rowId: issueNo,
          time: {
            start: null,
            end: null,
          },
        };

        issue.labels.forEach((label) => {
          if (label.name.length == 8 && /^\d+$/.test(label.name)) {
            issueItem.id = GSTC.api.GSTCID(label.id.toString());
            issueItem.label = issue.number;

            let endDate = moment(
              label.name.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"),
              "YYYY-MM-DD"
            );
            issueItem.time.end = endDate.endOf("day").valueOf();
          } else if (/^\d+$/.test(label.name)) {
            let hours = parseInt(label.name);

            issueItem.time.start = moment(issueItem.time.end)
              .subtract(hours * 3, "hours")
              .startOf("day")
              .valueOf();

            issueItem.time.end = moment(issueItem.time.start)
              .add(hours * 3, "hours")
              .valueOf();

            if (!this.startDate || this.startDate > issueItem.time.start) {
              this.startDate = moment(issueItem.time.start)
                .startOf("day")
                .valueOf();
            }
            if (!this.endDate || this.endDate < issueItem.time.end) {
              this.endDate = moment(issueItem.time.end).endOf("day").valueOf();
            }
          }
        });

        if (issueItem.time.start) {
          this.issueItems[issueItem.id] = issueItem;
        }
      });
      this.issues = tempIssues;
      this.formatGantt();
    },
    fetchIssues() {
      axios({
        method: "get",
        url: `https://api.github.com/repos/${this.repository}/issues?state=open`,
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
.gstc-component {
  margin: 0;
  padding: 0;
}
.toolbox {
  padding: 10px;
}
</style>
