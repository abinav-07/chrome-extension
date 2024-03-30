
import BlankLayout from "./layout/blank";
import LoginUserPage from "./pages/login";
import RegisterUserPage from "./pages/register";

const PageRoutes = [
    {
        name: "Login User Page",
        path: "/login",
        privateRoute: false, //access to all users
        adminRoute: false,
        layout: BlankLayout,
        component: LoginUserPage,
    },
    {
        name: "Register Page",
        path: "/register",
        privateRoute: false, //access to all users
        adminRoute: false,
        exact: true,
        displaySearchBar: false,
        layout: BlankLayout,
        component: RegisterUserPage,
    },
    // {
    //     name: "Landing Page",
    //     path: "/features",
    //     privateRoute: true,
    //     adminRoute: false,

    // },
    // {
    //     name: "Admin Login Page",
    //     path: "/admin/login",
    //     privateRoute: false,
    //     adminRoute: true,
    //     layout: BlankLayout,
    //     component: LoginAdminPage
    // },
]

export default PageRoutes;