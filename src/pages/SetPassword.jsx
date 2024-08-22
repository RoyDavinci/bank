import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaKey } from "react-icons/fa";
import logo from "../assets/sterling.jpeg"; // Path to your logo
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
	const [form, setForm] = useState({
		password: "",
		confirmPassword: "",
		token: new URLSearchParams(window.location.search).get("token") || "", // Get token from URL query string
	});
	console.log(form);

	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (form.password !== form.confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}
		try {
			const { data } = await axios.post(
				"http://sterling.approot.ng/api/reset-password",
				form
			); // Adjust the endpoint URL as needed
			if (data.status) {
				toast.success(data.message);
				navigate("/login");
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error("Error resetting password");
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100'>
			<ToastContainer />
			<div className='bg-white p-6 rounded-lg shadow-lg max-w-md w-full'>
				<div className='text-center mb-6'>
					<img
						src={logo}
						alt='Logo'
						className='mx-auto h-20 rounded-full w-20'
					/>
				</div>
				<h2 className='text-center text-2xl font-bold text-gray-800 mb-4'>
					Reset Your Password
				</h2>
				<form onSubmit={handleSubmit}>
					<div className='mb-4'>
						<label htmlFor='password' className='block text-gray-700 mb-2'>
							New Password
						</label>
						<div className='flex items-center border border-gray-300 rounded-lg'>
							<FaKey className='text-gray-500 p-2' />
							<input
								type='password'
								id='password'
								name='password'
								value={form.password}
								onChange={handleChange}
								className='w-full p-2 focus:outline-none'
								placeholder='Enter your new password'
								required
							/>
						</div>
					</div>
					<div className='mb-4'>
						<label
							htmlFor='confirmPassword'
							className='block text-gray-700 mb-2'
						>
							Confirm Password
						</label>
						<div className='flex items-center border border-gray-300 rounded-lg'>
							<FaKey className='text-gray-500 p-2' />
							<input
								type='password'
								id='confirmPassword'
								name='confirmPassword'
								value={form.confirmPassword}
								onChange={handleChange}
								className='w-full p-2 focus:outline-none'
								placeholder='Confirm your new password'
								required
							/>
						</div>
					</div>
					<button
						type='submit'
						className='w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
					>
						Reset Password
					</button>
				</form>
			</div>
		</div>
	);
};

export default ResetPassword;
