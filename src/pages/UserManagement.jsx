import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import UserDeleteModal from "../components/UserDeleteModal";

const UserManagement = () => {
	const [users, setUsers] = useState([]);
	const [open, setOpen] = useState(false);
	const [userIds, setUserIds] = useState(null);

	const navigate = useNavigate();

	useEffect(() => {
		fetchUsers();
	}, []);

	const deleteUser = async () => {
		try {
			const response = await axios.delete(
				`http://sterling.approot.ng/api/delete/user/${userIds}`,
				// { id: userIds },
				{
					headers: {
						// "Content-Type": "multipart/form-data",
						Authorization: `Bearer ${localStorage.getItem("token")}`,
						data: { id: userIds },
					},
				}
			);

			if (response.data.status) {
				toast.success("User deleted successfully");
				window.location.reload();
				setOpen(false);
				navigate("/user-management"); // Navigate to the user management page or any other appropriate page
			} else {
				toast.error(response.data.message || "Failed to delete user");
				localStorage.clear();
				setOpen(false);
				navigate("/login");
			}
		} catch (error) {
			if (error.response) {
				if (error.response.status === 401) {
					toast.error("Session expired. Please log in again.");
					setOpen(false);
					navigate("/login");
				} else {
					toast.error(error.response.data.message || "An error occurred");
					setOpen(false);
					setOpen(false);
					navigate("/login");
				}
			} else if (error.request) {
				toast.error("Network error. Please check your connection.");
				setOpen(false);
				navigate("/login");
			} else {
				toast.error("An error occurred. Please try again.");
				setOpen(false);
				navigate("/login");
			}
		}
	};

	const fetchUsers = async () => {
		try {
			const { data } = await axios.get("http://sterling.approot.ng/api/users", {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			console.log(data);
			if (data.status) {
				setUsers(data.data);
			} else {
				toast.error(data.message);
				// setOpen(false);
				navigate("/login");
			}
		} catch (error) {
			console.error("Error fetching users:", error.response.data);
			handleApiError(error);
		}
	};

	const handleApiError = (error) => {
		if (error.response) {
			if (error.response.status === 401) {
				toast.error("Session expired. Please log in again.");
				localStorage.clear();
				navigate("/login");
			} else {
				toast.error(error.response.data.message || "An error occurred");
				localStorage.clear();
				navigate("/login");
			}
		} else if (error.request) {
			toast.error("Network error. Please check your connection.");
			localStorage.clear();
			navigate("/login");
		} else {
			toast.error("An error occurred. Please try again.");
			localStorage.clear();
			navigate("/login");
		}
	};

	const handleDelete = (userId) => {
		// Add delete logic here
		console.log(userId);
		setOpen(true);
		setUserIds(userId);
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 90 },
		{ field: "username", headerName: "Name", width: 150 },
		{ field: "email", headerName: "Email", width: 150 },
		{ field: "role", headerName: "Role", width: 110 },
		{
			field: "actions",
			headerName: "Actions",
			width: 150,
			renderCell: (params) => (
				<>
					<Link
						to={`/edit-user/${params.row.id}`}
						className='bg-blue-500 text-white py-1 px-2 rounded mr-2'
					>
						Edit
					</Link>
					<button
						onClick={() => handleDelete(params.row.id)}
						className='bg-red-500 text-white py-1 px-2 rounded'
					>
						Delete
					</button>
				</>
			),
		},
	];

	return (
		<div>
			<ToastContainer />
			<div className='flex justify-between items-center mb-4'>
				<h1 className='text-2xl'>User Management</h1>
				<Link
					to='/create-user'
					className='bg-blue-500 text-white py-2 px-4 rounded'
				>
					Add User
				</Link>
			</div>
			<div style={{ height: 400, width: "100%" }}>
				<DataGrid
					rows={users}
					columns={columns}
					pageSize={5}
					checkboxSelection
				/>
			</div>
			<UserDeleteModal
				isOpen={open}
				onClose={() => setOpen(!open)}
				onConfirm={deleteUser}
			/>
		</div>
	);
};

export default UserManagement;
