// src/components/Register.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

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
				"http://sterling.approot.ng/backend/register.php",
				formData
			);
			setSuccess("Registration successful! Please log in.");
			setError("");
		} catch (error) {
			console.error(error);
			alert("Registration failed");
		}
	};

	return (
		<form onSubmit={handleSubmit} className='max-w-md mx-auto mt-10 p-5 border'>
			<h2 className='text-2xl font-bold mb-4'>Register</h2>
			{error && <p className='mb-4 text-red-500'>{error}</p>}
			{success && <p className='mb-4 text-green-500'>{success}</p>}
			<div className='mb-4'>
				<label className='block mb-1'>Username</label>
				<input
					type='text'
					name='username'
					value={formData.username}
					onChange={handleChange}
					className='w-full p-2 border'
				/>
			</div>
			<div className='mb-4'>
				<label className='block mb-1'>Email</label>
				<input
					type='email'
					name='email'
					value={formData.email}
					onChange={handleChange}
					className='w-full p-2 border'
				/>
			</div>
			<div className='mb-4'>
				<label className='block mb-1'>Password</label>
				<input
					type='password'
					name='password'
					value={formData.password}
					onChange={handleChange}
					className='w-full p-2 border'
				/>
			</div>
			<button type='submit' className='w-full p-2 bg-blue-500 text-white'>
				Register
			</button>
		</form>
	);
};

export default Register;
