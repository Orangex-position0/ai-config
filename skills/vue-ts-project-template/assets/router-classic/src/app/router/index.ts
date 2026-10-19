import { createRouter, createWebHistory } from "vue-router";

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "workspace",
      component: () => import("../../features/workspace").then(({ WorkspaceView }) => WorkspaceView),
    },
  ],
});
