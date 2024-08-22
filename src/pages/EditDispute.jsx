import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CloudUpload } from "@mui/icons-material";
import Loading from "../components/Loading";

const EditDispute = () => {
	const [formData, setFormData] = useState({
		category: "",
		subCategory: "",
		newCategory: "",
		newSubCategory: "",
		description: "",
		startTime: "",
		endTime: "",
		file: null,
		existingFilePath: "",
		status: "",
		title: "",
	});
	const [fileError, setFileError] = useState("");
	const [categories, setCategories] = useState([]);
	const [subCategories, setSubCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const { id } = useParams();

	const fetchDisputeDetails = async () => {
		try {
			setLoading(true);
			const { data } = await axios.get(
				`http://127.0.0.1:8000/api/disputes/${id}`,
				{
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
				}
			);

			if (data.status) {
				const dispute = data.dispute;
				setFormData({
					category: dispute.category_id,
					subCategory: dispute.subcategory_id,
					newCategory: "",
					newSubCategory: "",
					description: dispute.description,
					startTime: dispute.start_time,
					endTime: dispute.end_time,
					file: null,
					existingFilePath: data.filePath || "",
					status: data.dispute.status,
					title: data.dispute.title,
				});
				setCategories(data.categories);
				setSubCategories(data.subCategories);
				setLoading(false);
			} else {
				toast.error(data.message);
				setLoading(false);
			}
		} catch (error) {
			handleApiError(error);
			setLoading(false);
		}
	};

	console.log(categories);
	console.log(subCategories);

	console.log(formData);
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				// 5MB limit
				setFileError("File size exceeds 5MB. Please upload a smaller file.");
			} else {
				setFileError("");
				setFormData((prevData) => ({
					...prevData,
					file,
				}));
			}
		}
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
			status,
			title,
		} = formData;

		const form = new FormData();
		form.append("id", id);
		form.append("description", description);
		form.append("start_time", startTime);
		form.append("end_time", endTime);
		form.append("status", status);
		form.append("title", title);

		if (newCategory) {
			form.append("category_name", newCategory);
		} else {
			form.append("category_id", category);
		}

		if (newSubCategory) {
			form.append("sub_category_name", newSubCategory);
		} else {
			form.append("subcategory_id", subCategory);
		}

		if (file) {
			form.append("file", file);
		}
		setLoading(false);
		try {
			const { data } = await axios.post(
				"http://sterling.approot.ng/api/dispute/update",
				form,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			);
			console.log(data);
			if (data.status) {
				toast.success("Dispute updated successfully");
				navigate("/");
				setLoading(false);
			} else {
				toast.error(data.message);
				setLoading(false);
			}
		} catch (error) {
			setLoading(false);
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
	console.log(formData);

	useEffect(() => {
		fetchDisputeDetails();
	}, []);

	if (loading) return <Loading />;

	return (
		<div className='max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg'>
			<ToastContainer />
			<h1 className='text-3xl font-bold mb-6 text-gray-800'>Edit Dispute</h1>

			<form onSubmit={handleSubmit} className='space-y-6'>
				{/* Category */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					<div className='w-full'>
						<label className='block text-gray-700 text-lg mb-2'>Title</label>
						<input
							type='text'
							name='title'
							value={formData.title}
							onChange={handleInputChange}
							className='w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
							placeholder='New Sub Category'
						/>
					</div>
					<div className='w-full'>
						<label className='block text-gray-700 text-lg mb-2'>Category</label>
						<select
							name='category'
							value={formData.category}
							onChange={handleInputChange}
							className='w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
						>
							<option value=''>Select Category</option>
							{categories.map((cat) => (
								<option key={cat.id} value={cat.id}>
									{cat.name}
								</option>
							))}
						</select>
					</div>
					<div className='w-full'>
						<label className='block text-gray-700 text-lg mb-2'>
							Or Enter New Category
						</label>
						<input
							type='text'
							name='newCategory'
							value={formData.newCategory}
							onChange={handleInputChange}
							className='w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
							placeholder='New Category'
						/>
					</div>
				</div>

				{/* Sub Category */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					<div className='w-full'>
						<label className='block text-gray-700 text-lg mb-2'>
							Sub Category
						</label>
						<select
							name='subCategory'
							value={formData.subCategory}
							onChange={handleInputChange}
							className='w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
						>
							<option value=''>Select Sub Category</option>
							{subCategories
								.filter(
									(subCat) => subCat.category_id === Number(formData.category)
								)
								.map((subCat) => (
									<option key={subCat.id} value={subCat.id}>
										{subCat.name}
									</option>
								))}
						</select>
					</div>
					<div className='w-full'>
						<label className='block text-gray-700 text-lg mb-2'>
							Or Enter New Sub Category
						</label>
						<input
							type='text'
							name='newSubCategory'
							value={formData.newSubCategory}
							onChange={handleInputChange}
							className='w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
							placeholder='New Sub Category'
						/>
					</div>
					<div className='w-full'>
						<label className='block text-gray-700 text-lg mb-2'>Status</label>
						<select
							name='status'
							value={formData.status}
							onChange={handleInputChange}
							className='w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
						>
							<option value=''>Select Status</option>
							<option value='pending'>Pending</option>
							<option value='in_progress'>In Progress</option>
							<option value='resolved'>Resolved</option>
						</select>
					</div>
				</div>

				{/* Start and End Time */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					<div className='w-full'>
						<label className='block text-gray-700 text-lg mb-2'>
							Start Time
						</label>
						<input
							type='datetime-local'
							name='startTime'
							value={formData.startTime}
							onChange={handleInputChange}
							className='w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
						/>
					</div>
					<div className='w-full'>
						<label className='block text-gray-700 text-lg mb-2'>End Time</label>
						<input
							type='datetime-local'
							name='endTime'
							value={formData.endTime}
							onChange={handleInputChange}
							className='w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
						/>
					</div>
					<div className='w-full'>
						<label className='block text-gray-700 text-lg mb-2'>
							Description
						</label>
						<textarea
							name='description'
							value={formData.description}
							onChange={handleInputChange}
							className='w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
							rows='5'
						/>
					</div>
				</div>

				{/* File Upload */}
				<div className='w-full'>
					<label className='block text-gray-700 text-lg mb-2'>
						File Upload
					</label>
					<div className='flex items-center justify-center w-full'>
						<label
							htmlFor='file-upload'
							className='flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all'
						>
							<CloudUpload className='text-gray-500 mb-2' fontSize='large' />
							<p className='text-gray-500 text-center'>
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
						{fileError && <p className='text-red-500 mt-2'>{fileError}</p>}
					</div>
				</div>

				{/* Submit Button */}
				<div className='w-full flex justify-end'>
					<button
						type='submit'
						className='bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors'
					>
						Update Dispute
					</button>
				</div>
			</form>
		</div>
	);
};

export default EditDispute;
