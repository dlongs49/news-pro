import {
    createRouter,
    createWebHistory,
} from "vue-router";

const routes = [
    {
        path: '/',
        name: 'home',
        component: () =>
            import ('@/views/home/index.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: "NotFound",
        component: () =>
            import ("@/components/Error/404.vue"),
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;

