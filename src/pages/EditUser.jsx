import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Loading from "../components/Loading";

const EditUser = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [userData, setUserData] = useState({
		username: "",
		email: "",
		role_id: "",
	});

	useEffect(() => {
		const fetchUser = async () => {
			setLoading(true);
			try {
				const response = await axios.get(
					`http://sterling.approot.ng/api/users/${id}`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					}
				);
				setUserData(response.data.data);
				setLoading(false);
			} catch (error) {
				handleApiError(error);
				setLoading(false);
			}
		};

		fetchUser();
	}, [id]);

	const handleApiError = (error) => {
		if (error.response) {
			if (error.response.status === 401) {
				toast.error("Session expired. Please log in again.");
				navigate("/login");
			} else {
				toast.error(error.response.data.message || "An error occurred");
			}
		} else if (error.request) {
			toast.error("Network error. Please check your connection.");
		} else {
			toast.error("An error occurred. Please try again.");
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setUserData({ ...userData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const response = await axios.post(
				"http://sterling.approot.ng/api/update/user",
				userData,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
						"Content-Type": "application/json",
					},
				}
			);
			if (response.data.status) {
				setLoading(false);
				toast.success("User updated successfully");
				navigate("/user-management");
			} else {
				setLoading(false);
				toast.error(response.data.message || "Failed to update user");
			}
		} catch (error) {
			handleApiError(error);
			setLoading(true);
		}
	};

	if (loading) return <Loading />;
	return (
		<div className='max-w-md mx-auto mt-10 p-4 border rounded-lg shadow-lg'>
			<ToastContainer />
			<h2 className='text-2xl font-bold mb-4'>Edit User</h2>
			<form onSubmit={handleSubmit}>
				<div className='mb-4'>
					<label className='block text-gray-700 mb-2'>Name</label>
					<input
						type='text'
						name='username'
						value={userData.username}
						onChange={handleChange}
						className='w-full p-2 border border-gray-300 rounded'
					/>
				</div>
				<div className='mb-4'>
					<label className='block text-gray-700 mb-2'>Email</label>
					<input
						type='email'
						name='email'
						value={userData.email}
						onChange={handleChange}
						className='w-full p-2 border border-gray-300 rounded'
					/>
				</div>
				<div className='mb-4'>
					<label className='block text-gray-700 mb-2'>Role</label>
					<select
						name='role_id'
						value={userData.role_id}
						onChange={handleChange}
						className='w-full p-2 border border-gray-300 rounded'
					>
						<option value=''>Select Role</option>
						<option value='1'>Super Admin</option>
						<option value='2'>Admin</option>
						<option value='3'>Customer Support</option>
					</select>
				</div>
				<div className='flex justify-end'>
					<button
						type='submit'
						className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
					>
						Save Changes
					</button>
				</div>
			</form>
		</div>
	);
};

export default EditUser;
