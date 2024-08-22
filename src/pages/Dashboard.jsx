import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "./AuthContext";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Auth";
import Sidebar from "../components/Sidebar";
import logo from "../assets/download.jpeg";
import { Popover, List, ListItem, ListItemText, Avatar } from "@mui/material";

const Dashboard = () => {
	const [user, setUser] = useState(null);

	const [anchorEl, setAnchorEl] = useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const navigate = useNavigate();

	const checkLocalStorage = () => {
		const token = localStorage.getItem("token");
		return !token && <Navigate to='/login' replace={true} />;
	};
	const open = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;

	useEffect(() => {
		checkLocalStorage();
	}, []);

	return (
		<div className='grid grid-cols-6 h-screen'>
			<div className='col-span-2 w-[15%] bg-gray-900 text-white p-4 fixed h-full shadow-md'>
				<Sidebar />
			</div>
			<div className='col-span-5 col-start-2 p-6 overflow-auto h-full bg-gray-100'>
				<div className='flex justify-between items-center p-4 mb-8 bg-red-700 text-white rounded-lg shadow-md'>
					<h1 className='text-2xl font-bold'>Dispute Portal</h1>
					<div className='flex items-center space-x-4'>
						<button
							onClick={handleClick}
							className='flex items-center hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition duration-200'
						>
							<Avatar
								alt='User Avatar'
								src={(user && user?.avatarUrl) || logo} // Default avatar if user avatar URL is not available
								className='w-10 h-10 rounded-full'
							/>
						</button>
						<Popover
							id={id}
							open={open}
							anchorEl={anchorEl}
							onClose={handleClose}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "right",
							}}
							transformOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
						>
							<List component='nav' className='p-4'>
								<ListItem button onClick={handleClose}>
									<ListItemText primary='User Profile' />
								</ListItem>
								<ListItem
									button
									onClick={() => {
										localStorage.clear();
										navigate("/login");
									}}
								>
									<ListItemText primary='Logout' />
								</ListItem>
							</List>
						</Popover>
					</div>
				</div>
				<Outlet />
			</div>
		</div>
	);
};

export default Dashboard;

// import React from "react";
// import { Link, Outlet, useNavigate } from "react-router-dom";
// import Avatar from "@material-ui/core/Avatar";
// import List from "@material-ui/core/List";
// import ListItem from "@material-ui/core/ListItem";
// import ListItemText from "@material-ui/core/ListItemText";
// import Popover from "@material-ui/core/Popover";
// import logo from "../assets/sterling.jpeg";

// const Sidebar = () => {
//     const menuItems = [
//         { id: 1, name: "Dashboard", link: "/" },
//         { id: 2, name: "Create Dispute", link: "/create-dispute" },
//         { id: 3, name: "View Disputes", link: "/view-disputes" },
//         // Add more items as needed
//     ];
//     return (
//         <div>
//             <div className='flex items-center justify-center mb-10'>
//                 <img src={logo} className='rounded-full w-20 h-20' alt='' />
//             </div>
//             <ul>
//                 {menuItems.map((item) => (
//                     <li key={item.id} className='mb-4'>
//                         <Link to={item.link} className='hover:text-gray-400'>
//                             {item.name}
//                         </Link>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// const DashboardLayout = ({ handleClick, anchorEl, open, handleClose, user, id }) => {
//     const navigate = useNavigate();
//     return (
//         <div className='grid grid-cols-6 h-screen'>
//             <div className='col-span-1 w-[15%] bg-gray-800 text-white p-4 fixed h-full'>
//                 <Sidebar />
//             </div>
//             <div className='col-span-5 col-start-2 p-4 ml-[15%] overflow-auto h-full'>
//                 <div className='flex justify-between items-center p-4 mb-10 bg-gray-800 text-white rounded-lg shadow-md'>
//                     <div>
//                         <h1 className='text-2xl font-bold'>Dispute Portal</h1>
//                     </div>
//                     <div className='flex items-center'>
//                         <button
//                             onClick={handleClick}
//                             className='flex items-center hover:bg-gray-600 text-white py-2 px-4 rounded-lg'
//                         >
//                             <Avatar
//                                 alt='User Avatar'
//                                 src={(user && user?.avatarUrl) || logo} // Default avatar if user avatar URL is not available
//                                 className='mr-2'
//                             />
//                         </button>
//                         <Popover
//                             id={id}
//                             open={open}
//                             anchorEl={anchorEl}
//                             onClose={handleClose}
//                             anchorOrigin={{
//                                 vertical: "bottom",
//                                 horizontal: "left",
//                             }}
//                             transformOrigin={{
//                                 vertical: "top",
//                                 horizontal: "left",
//                             }}
//                         >
//                             <List component='nav' className='p-4'>
//                                 <ListItem button onClick={handleClose}>
//                                     <ListItemText primary='User Profile' />
//                                 </ListItem>
//                                 <ListItem
//                                     button
//                                     onClick={() => {
//                                         localStorage.clear();
//                                         navigate("/login");
//                                     }}
//                                 >
//                                     <ListItemText primary='Logout' />
//                                 </ListItem>
//                             </List>
//                         </Popover>
//                     </div>
//                 </div>
//                 <Outlet />
//             </div>
//         </div>
//     );
// };

// export default DashboardLayout;
