import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/sterling.jpeg";
import { FaSignOutAlt } from "react-icons/fa"; // Importing an icon for the logout button

const Sidebar = () => {
	const role = localStorage.getItem("role");
	const group = localStorage.getItem("group");
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.clear(); // Clear any stored data
		navigate("/login"); // Navigate to the login page
	};

	// console.log(role);

	const menuItems = [{ id: 1, name: "Dashboard", link: "/" }];
	if (group && group.toLowerCase() === "sterling") {
		menuItems.push({ id: 2, name: "Create Dispute", link: "/create-dispute" });
	}

	if (role && role === "super_admin") {
		menuItems.push({
			id: 3,
			name: "User Management",
			link: "/user-management",
		});
	}

	return (
		<div className='flex flex-col justify-between h-full bg-gray-900 text-white'>
			<div>
				<div className='flex items-center justify-center mb-8'>
					<img
						src={logo}
						className='rounded-full w-20 h-20 border border-gray-700'
						alt='Sterling Bank'
					/>
				</div>
				<ul>
					{menuItems.map((item) => (
						<li key={item.id} className='mb-4'>
							<Link
								to={item.link}
								className='block py-2 px-4 rounded hover:bg-red-600 transition duration-200'
							>
								{item.name}
							</Link>
						</li>
					))}
				</ul>
			</div>
			<div className='mb-6'>
				<button
					onClick={handleLogout}
					className='flex items-center justify-center w-full py-2 px-4 rounded bg-red-600 hover:bg-red-700 transition duration-200 text-white'
				>
					<FaSignOutAlt className='mr-2' />
					Logout
				</button>
			</div>
		</div>
	);
};

export default Sidebar;
