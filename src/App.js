import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DisputeTable from "./components/DisputeTable";
import CreateDispute from "./pages/CreateDispute";
import EditDispute from "./pages/EditDispute";
import UserManagement from "./pages/UserManagement";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";
import SetPassword from "./pages/SetPassword";
import DisputeDetails from "./pages/DisputeDetails";

function App() {
	const router = createBrowserRouter([
		{
			path: "/register",
			element: <Register />,
		},
		{
			path: "/login",
			element: <Login />,
		},
		{
			path: "/reset/password",
			element: <SetPassword />,
		},
		{
			path: "/",
			element: <Dashboard />,
			children: [
				{ path: "/", element: <DisputeTable /> },
				{ path: "/create-dispute", element: <CreateDispute /> },
				{ path: "/edit/dispute/:id", element: <EditDispute /> },
				{ path: "/edit-user/:id", element: <EditUser /> },
				{ path: "/user-management", element: <UserManagement /> },
				{ path: "/create-user", element: <CreateUser /> },
				{ path: "/dispute/:id", element: <DisputeDetails /> },
			],
		},
	]);
	return (
		<div className='App'>
			<RouterProvider router={router} />
		</div>
	);
}

export default App;
