import { RouterProvider, createBrowserRouter } from "react-router";
import Body from "./components/Body";
import Login from "./components/Login";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";

function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Body />,
      children: [
        {
          path: "/",
          element: <Login />,
        },
        {
          path: "/feed",
          element: <Feed /> 
        },
        {
          path: "/test",
          element: <div>test</div>,
        },
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
