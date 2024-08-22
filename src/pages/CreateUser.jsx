import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const CreateUser = () => {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		role_id: "",
	});
	const navigate = useNavigate();

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("token");
		try {
			const { data } = await axios.post(
				"http://sterling.approot.ng/api/register",
				formData,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			console.log(data);
			if (data.status) {
				toast.success(data.message);
				navigate("/user-management");
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			console.log(error);
			handleApiError(error);
		}
	};

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

	return (
		<div className='max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
			<ToastContainer />
			<h2 className='text-2xl font-bold mb-6'>Create User</h2>
			<form onSubmit={handleSubmit}>
				<div className='mb-4'>
					<label className='block text-gray-700 text-sm font-bold mb-2'>
						Name
					</label>
					<input
						type='text'
						name='username'
						value={formData.username}
						onChange={handleInputChange}
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
						required
					/>
				</div>
				<div className='mb-4'>
					<label className='block text-gray-700 text-sm font-bold mb-2'>
						Email
					</label>
					<input
						type='email'
						name='email'
						value={formData.email}
						onChange={handleInputChange}
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
						required
					/>
				</div>
				<div className='mb-4'>
					<label className='block text-gray-700 text-sm font-bold mb-2'>
						Password
					</label>
					<input
						type='password'
						name='password'
						value={formData.password}
						onChange={handleInputChange}
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
						required
					/>
				</div>
				<div className='mb-4'>
					<label className='block text-gray-700 text-sm font-bold mb-2'>
						Role
					</label>
					<select
						name='role_id'
						value={formData.role_id}
						onChange={handleInputChange}
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
						required
					>
						<option value=''>Select Role</option>
						<option value='1'>Super Admin</option>
						<option value='2'>Admin</option>
						<option value='3'>Customer Support</option>
					</select>
				</div>
				<div className='flex items-center justify-between'>
					<button
						type='submit'
						className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
					>
						Create User
					</button>
				</div>
			</form>
		</div>
	);
};

export default CreateUser;
