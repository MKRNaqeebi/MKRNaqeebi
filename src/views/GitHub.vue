<template>
  <div class="home-view">
    <div class="home-view__header">
      <h3 class="home-view__title">Gantt Chart</h3>
      <div class="home-view__form">
        <input type="text" placeholder="username" v-model="username" @keyup.enter="fetchIssues" />
        <input type="password" placeholder="password" v-model="password" @keyup.enter="fetchIssues" />
      </div>
    </div>
  </div>
  <HeaderNew v-if="username && password" />
  <FortyHours v-if="username && password" 
    :username="username" :password="password" />
  
</template>

<script>
import FortyHours from "../components/FortyHours.vue";
import HeaderNew from "../components/HeaderNew.vue";
export default {
  name: "HomeView",
  components: { FortyHours, HeaderNew },
  data() {
    return {
      username: "",
      password: "",
      fetch: false,
      assignees: [
        "MKRNaqeebi",
        "usama2762",
        "1abdurRehman",
        "ahsan-coaldev",
        "aishatasaduq",
        "AliHanifdev1",
        "ammarhaider001",
        "hamza-coaldev",
        "LaiqaRafiq",
        "NajamBilalDev",
        "noumandev11",
        "RehmanCoaldev",
      ],
    };
  },
  methods: {
    fetchIssues() {
      this.fetch = true;
    },
  },
};
</script>
<style>
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

.icon {
  margin-left: 81%;
}

.img-repo {
  text-align: center;
  margin: 12px 17px;
}

.text-align {
  text-align: center;
  margin: 12px 0px;
}


.aselect {
  margin-left: 20px;
  width: 24%;
  text-align: left;
}

.aselect1 {
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
  ;
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

.ulStyle {
  width: 100%;
  list-style-type: none;
  padding: 0;
  margin: 0;
  font-size: 16px;
  border: 1px solid gainsboro;
  position: absolute;
  z-index: 10;
  background: #F7B696;
  border-radius: 8px;

}

.liStyle {
  padding: 12px;
  color: #495175;
  background: #F7B696;
  border-radius: 8px;
}

.liStyle:hover {
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

.section2 {
  display: flex;
}
</style>
