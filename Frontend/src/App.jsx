import { RouterProvider, createBrowserRouter } from "react-router";
import Body from "./components/Body";
import Login from "./components/Login";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import Profile from "./components/Profile";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import Chat from "./components/Chat";
function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Body />,
      children: [
        {
          path: "/",
          element: <Feed />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/profile/edit",
          element: <Profile />,
        },
        {
          path: "/user/connections",
          element: <Connections />,
        },
        {
          path: "/user/request/recieved",
          element: <Requests />,
        },
        {
          path:"/chat/:targetUserId",
          element:<Chat />
        }
      ],
    },
  ]);

  return (
    <>
      <Provider store={appStore}>
          <RouterProvider router={appRouter} />
      </Provider>
    </>
  );
}

export default App;
