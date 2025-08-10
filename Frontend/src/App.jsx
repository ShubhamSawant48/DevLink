import { RouterProvider, createBrowserRouter } from "react-router";
import Body from "./components/Body";
import Login from "./components/Login";

function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Body />,
      children: [
        {
          path: "/login",
          element: <Login />
        },
        {
          path: "/test",
          element: <div>test</div>
        }
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  );
}

export default App;
