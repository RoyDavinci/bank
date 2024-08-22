import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { CloudUpload } from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";

const CreateDispute = () => {
	const [formData, setFormData] = useState({
		category: "",
		subCategory: "",
		newCategory: "",
		newSubCategory: "",
		description: "",
		startTime: "",
		endTime: "",
		file: null,
		title: "",
	});
	const [categories, setCategories] = useState([]);
	const [subCategories, setSubCategories] = useState([]);
	const navigate = useNavigate();

	const fetchCategoriesAndSubCategories = async () => {
		try {
			const { data } = await axios.get(
				"http://sterling.approot.ng/api/disputes/categories",
				{
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
				}
			);
			console.log(data);
			if (data.status) {
				setCategories(data.categories);
				setSubCategories(data.subCategories);
			}
		} catch (error) {
			handleApiError(error);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleFileChange = (e) => {
		setFormData((prevData) => ({
			...prevData,
			file: e.target.files[0],
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const {
			category,
			subCategory,
			newCategory,
			newSubCategory,
			description,
			startTime,
			endTime,
			file,
			title,
		} = formData;
		const form = new FormData();

		if (newCategory) {
			form.append("category_name", newCategory);
		} else {
			form.append("category_name", category);
		}

		if (newSubCategory) {
			form.append("sub_category_name", newSubCategory);
		} else {
			form.append("sub_category_name", subCategory);
		}

		form.append("description", description);
		form.append("start_time", startTime);
		form.append("end_time", endTime);
		form.append("file", file);
		form.append("title", title);

		try {
			const { data } = await axios.post(
				"http://sterling.approot.ng/api/dispute",
				form,
				{
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
				}
			);
			console.log(data);
			if (data.status) {
				toast.success("Dispute created successfully");
				// Reset form
				setFormData({
					category: "",
					subCategory: "",
					newCategory: "",
					newSubCategory: "",
					description: "",
					startTime: "",
					endTime: "",
					title: "",
					file: null,
				});
				navigate("/");
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			handleApiError(error);
		}
	};

	const handleApiError = (error) => {
		if (error.response) {
			// Server responded with a status other than 200 range
			if (error.response.status === 401) {
				toast.error("Session expired. Please log in again.");
				navigate("/login");
			} else {
				toast.error(error.response.data.message || "An error occurred");
			}
		} else if (error.request) {
			// Request was made but no response received
			toast.error("Network error. Please check your connection.");
		} else {
			// Something else happened in setting up the request
			toast.error("An error occurred. Please try again.");
		}
	};

	useEffect(() => {
		fetchCategoriesAndSubCategories();
	}, []);

	return (
		<div className='max-w-5xl mx-auto mt-10'>
			<ToastContainer />
			<h1 className='text-2xl font-bold mb-4'>Create Dispute</h1>
			<form onSubmit={handleSubmit} className='flex flex-wrap -mx-4'>
				<div className='mb-4 w-full md:w-1/2 px-4'>
					<label className='block text-gray-700'>Category</label>
					<select
						name='category'
						value={formData.category}
						onChange={handleInputChange}
						className='w-full p-2 border border-gray-300 rounded mt-2'
					>
						<option value=''>Select Category</option>
						{categories.map((cat) => (
							<option key={cat.id} value={cat.name}>
								{cat.name}
							</option>
						))}
					</select>
				</div>
				<div className='mb-4 w-full md:w-1/2 px-4'>
					<label className='block text-gray-700'>Or Enter New Category</label>
					<input
						type='text'
						name='newCategory'
						value={formData.newCategory}
						onChange={handleInputChange}
						className='w-full p-2 border border-gray-300 rounded mt-2'
						placeholder='New Category'
					/>
				</div>
				<div className='mb-4 w-full md:w-1/2 px-4'>
					<label className='block text-gray-700'>Sub Category</label>
					<select
						name='subCategory'
						value={formData.subCategory}
						onChange={handleInputChange}
						className='w-full p-2 border border-gray-300 rounded mt-2'
					>
						<option value=''>Select Sub Category</option>
						{subCategories
							.filter(
								(sub) =>
									sub.category_id ===
									categories.find((cat) => cat.name === formData.category)?.id
							)
							.map((sub) => (
								<option key={sub.id} value={sub.name}>
									{sub.name}
								</option>
							))}
					</select>
				</div>
				<div className='mb-4 w-full md:w-1/2 px-4'>
					<label className='block text-gray-700'>
						Or Enter New Sub Category
					</label>
					<input
						type='text'
						name='newSubCategory'
						value={formData.newSubCategory}
						onChange={handleInputChange}
						className='w-full p-2 border border-gray-300 rounded mt-2'
						placeholder='New Sub Category'
					/>
				</div>
				<div className='mb-4 w-full md:w-1/2 px-4'>
					<label className='block text-gray-700'>Description</label>
					<textarea
						name='description'
						value={formData.description}
						onChange={handleInputChange}
						className='w-full p-2 border border-gray-300 rounded mt-2'
						placeholder='Description'
						rows='6'
					/>
				</div>
				<div className='mb-4 w-full px-4'>
					<label className='block text-gray-700'>Title</label>
					<input
						type='text'
						name='title'
						value={formData.title}
						onChange={handleInputChange}
						className='w-full p-2 border border-gray-300 rounded mt-2'
						placeholder='Enter Title'
					/>
				</div>
				<div className='mb-4 w-full md:w-1/2 px-4'>
					<label className='block text-gray-700 mb-2'>File Upload</label>
					<div className='flex items-center justify-center w-full'>
						<label
							htmlFor='file-upload'
							className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'
						>
							<CloudUpload className='text-gray-500 mb-2' fontSize='large' />
							<p className='text-gray-500'>
								<span className='font-semibold'>Click to upload</span> or drag
								and drop
							</p>
							<input
								id='file-upload'
								type='file'
								onChange={handleFileChange}
								className='hidden'
							/>
						</label>
					</div>
				</div>
				<div className='mb-4 w-full md:w-1/2 px-4'>
					<label className='block text-gray-700'>Start Time</label>
					<input
						type='datetime-local'
						name='startTime'
						value={formData.startTime}
						onChange={handleInputChange}
						className='w-full p-2 border border-gray-300 rounded mt-2'
					/>
				</div>
				<div className='mb-4 w-full md:w-1/2 px-4'>
					<label className='block text-gray-700'>End Time</label>
					<input
						type='datetime-local'
						name='endTime'
						value={formData.endTime}
						onChange={handleInputChange}
						className='w-full p-2 border border-gray-300 rounded mt-2'
					/>
				</div>
				{/* <div className='mb-4 w-full px-4'>
					<label className='block text-gray-700'>File Upload</label>
					<input
						type='file'
						onChange={handleFileChange}
						className='w-full p-2 border border-gray-300 rounded mt-2'
					/>
				</div> */}

				<div className='w-full px-4 flex justify-end'>
					<button type='submit' className='bg-blue-500 text-white p-2 rounded'>
						Create Dispute
					</button>
				</div>
			</form>
		</div>
	);
};

export default CreateDispute;
