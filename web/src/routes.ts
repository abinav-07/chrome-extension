import BlankLayout from "./layout/blank"
import BasicLayout from "./layout/layout"
import FeatureList from "./pages/admin/features"

import LoginAdminPage from "./pages/admin/login"
import UserFeatures from "./pages/features"
import UserFeature from "./pages/features/[id]"
import LoginUserPage from "./pages/login"
import RegisterUserPage from "./pages/register"

const PageRoutes = [
  // User pages
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
    layout: BlankLayout,
    component: RegisterUserPage,
  },
  {
    name: "Landing Page",
    path: "/features",
    privateRoute: true,
    adminRoute: false,
    layout: BasicLayout,
    component: UserFeatures
  },
  {
    name: "Feature",
    path: "/features/:id",
    privateRoute: true,
    adminRoute: false,
    layout: BasicLayout,
    component: UserFeature
  },

  // Admin Pages
  {
    name: "Admin Login Page",
    path: "/admin/login",
    privateRoute: false,
    adminRoute: false,
    layout: BlankLayout,
    component: LoginAdminPage
  },
  {
    name: "Admin Features Page",
    path: "/admin/features",
    privateRoute: true,
    adminRoute: true,
    layout: BasicLayout,
    component: FeatureList
  },
]

export default PageRoutes
