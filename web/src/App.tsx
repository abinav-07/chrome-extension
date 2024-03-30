import { useCallback, useEffect, useState } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { AuthProvider, parseJwt } from "./utils"
import { message } from "antd"
import { Navigate, Routes, Route, BrowserRouter as Router } from "react-router-dom"
import { Roles } from "./utils/constants"
import PageRoutes from "./routes"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
})

const PrivateRouter = () => {
  useEffect(() => {
    message.info({
      content: "You must login to view this page!",
    })
  })

  return <Navigate to={"/login"} />
}

const AdminPrivateRouter = () => {
  useEffect(() => {
    message.info({
      content: "You must be admin to view this page!",
    })
  })
  return <Navigate to="/admin/login" />
}

const App = () => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  const initialLoad = useCallback(() => {
    try {
      setUser(parseJwt())
      return
    } catch (error) {
      setUser(null)
      message.error("Unauthorized User")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    initialLoad()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider loading={loading} user={user} setUser={setUser} role={user?.role as Roles}>
        <Router>
          <Routes>
            {PageRoutes.map(
              ({ path, privateRoute, adminRoute, layout: Layout, component: Component }, i) => {
                if (privateRoute && !adminRoute) {
                  return (
                    <Route
                      key={`${path}_${i}`}
                      path={path}
                      element={
                        !!user?.role ? (
                          <PrivateRouter />
                        ) : (
                          <Layout>
                            <Component />
                          </Layout>
                        )
                      }
                    />
                  )
                } else if (privateRoute && adminRoute) {
                  return (
                    <Route
                      key={`${path}_${i}`}
                      path={path}
                      element={
                        user?.role !== "admin" ? (
                          <AdminPrivateRouter />
                        ) : (
                          <Layout>
                            <Component />
                          </Layout>
                        )
                      }
                    />
                  )
                } else {
                  return (
                    <Route
                      key={`${path}_${i}`}
                      path={path}
                      element={
                        <Layout>
                          <Component />
                        </Layout>
                      }
                    ></Route>
                  )
                }
              },
            )}
            {/* <Route path="*">
            <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>Page Not Found!</div>
          </Route> */}
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}
export default App
