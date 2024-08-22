// src/components/Login.js
import React, { useState, useContext } from "react";
import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Auth";
import logo from "../assets/sterling.jpeg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const navigate = useNavigate();

	const { login } = useContext(AuthContext);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const { data } = await axios.post(
				"http://sterling.approot.ng/api/login",
				formData
			);

			if (data.status) {
				login(data.token);
				localStorage.setItem("role", data.role);
				localStorage.setItem("token", data.token);
				localStorage.setItem("email", data.email);
				localStorage.setItem("group", data.group);
				toast.success(data.message);

				navigate("/");

				// alert("Login successful");
			} else {
				// alert("Login failed");
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(
				error.response.data.message
					? error.response.data.message
					: "An error occured on login contact administrator"
			);
			// toast.success("An error occured on login contact administrator");
			// alert("Login failed");
		}
	};

	return (
		<div className='min-h-screen bg-gray-100 flex flex-col justify-center items-center'>
			<ToastContainer />
			<div className='bg-white shadow-md rounded-lg p-8 max-w-md w-full'>
				<div className='flex justify-center mb-6'>
					<img
						src={logo}
						className='rounded-full w-20 h-20'
						alt='Dispute Portal Logo'
					/>
				</div>
				<h2 className='text-3xl font-bold mb-6 text-center text-red-600'>
					Dispute Portal Login
				</h2>
				<form onSubmit={handleSubmit}>
					<div className='mb-4'>
						<label className='block text-gray-700 mb-2'>Email</label>
						<input
							type='email'
							name='email'
							value={formData.email}
							onChange={handleChange}
							className='w-full p-3 border rounded-lg'
							placeholder='Enter your email'
							required
						/>
					</div>
					<div className='mb-4'>
						<label className='block text-gray-700 mb-2'>Password</label>
						<input
							type='password'
							name='password'
							value={formData.password}
							onChange={handleChange}
							className='w-full p-3 border rounded-lg'
							placeholder='Enter your password'
							required
						/>
					</div>
					<button
						type='submit'
						className='w-full p-3 bg-red-600 text-white rounded-lg hover:bg-red-700'
					>
						Login
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
