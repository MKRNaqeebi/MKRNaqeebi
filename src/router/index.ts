import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import IncomingTaskView from "../views/IncomingTaskView.vue";
import GitHub from "../views/GitHub.vue";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/IncomingTaskView",
    name: "IncomingTaskView",
    component: IncomingTaskView,
  },
  {
    path: "/GitHub",
    name: "GitHub",
    component: GitHub,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
