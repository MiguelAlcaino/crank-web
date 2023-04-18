import {createRouter, createWebHistory} from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue"
import RegisterView from "../views/RegisterView.vue"
import BookingCalendarView from "../views/BookingCalendarView.vue"
import ProfileView from "../views/ProfileView.vue"
import ClassView from "../views/ClassView.vue"
import BookingsView from "../views/BookingsView.vue"

import {authService} from "@/services/authService";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
        },
        {
            path: "/login",
            name: "login",
            component: LoginView,
        },
        {
            path: "/register",
            name: "register",
            component: RegisterView,
        },
        {
            path: "/profile",
            name: "profile",
            component: ProfileView,
        },
        {
            path: "/calendar",
            name: "calendar",
            component: BookingCalendarView,
        },
        {
            path: "/class/:id",
            name: "class",
            component: ClassView,
        },
        {
            path: "/bookings",
            name: "bookings",
            component: BookingsView,
        },
        {
            path: "/about",
            name: "about",
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/AboutView.vue"),
        },
    ],
});


router.beforeEach(async (to, from, next) => {
    const publicPages = ["/login", "/register"];
    const authRequired = !publicPages.includes(to.path);

    if (authRequired && !authService.isLoggedId()) {
        next("/login");
    } else {
        next();
    }
});


export default router;
