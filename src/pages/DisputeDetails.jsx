import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaFileDownload } from "react-icons/fa";
import axios from "axios";
import Loading from "../components/Loading";

const DisputeDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [dispute, setDispute] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [user, setUser] = useState({ email: "", group: "" });

	const [newReply, setNewReply] = useState("");

	const handleReplyChange = (e) => {
		setNewReply(e.target.value);
	};

	const handleReplySubmit = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("token");
		setLoading(true);
		try {
			const { data } = await axios.post(
				`http://sterling.approot.ng/api/dispute/reply`,
				{ dispute_id: id, reply: newReply },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			console.log(data);
			fetchDispute();
			setNewReply("");
			// setDispute(data.dispute);
			setLoading(false);
		} catch (error) {
			console.log(error.response.data);
			setError("Error fetching dispute details");
			setNewReply("");
			setLoading(false);
		}
	};

	const fetchDispute = async () => {
		const token = localStorage.getItem("token");
		setLoading(true);
		try {
			const { data } = await axios.get(
				`http://sterling.approot.ng/api/disputes/view/${id}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			console.log(data);
			setDispute(data.dispute);
			setLoading(false);
		} catch (error) {
			console.log(error.response.data);
			setError("Error fetching dispute details");
			setLoading(false);
		}
	};

	useEffect(() => {
		const email = localStorage.getItem("email");
		const group = localStorage.getItem("group");

		setUser({ email, group });

		fetchDispute();
	}, [id]);

	if (loading) return <Loading />;
	if (error)
		return <div className='text-red-500 text-center py-10'>{error}</div>;

	return (
		<div className='max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-lg border border-gray-200'>
			<button
				onClick={() => navigate("/")}
				className='text-blue-600 hover:text-blue-800 mb-6 flex items-center text-lg font-semibold'
			>
				<FaArrowLeft className='mr-2' /> Back to List
			</button>

			<h2 className='text-3xl font-bold mb-6 border-b border-gray-300 pb-2'>
				Dispute Details
			</h2>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
				<div className='bg-gray-50 p-6 rounded-lg shadow-sm'>
					<h3 className='text-xl font-semibold text-gray-800'>Title</h3>
					<p className='text-gray-700 mt-2'>{dispute.title}</p>
				</div>
				<div className='bg-gray-50 p-6 rounded-lg shadow-sm'>
					<h3 className='text-xl font-semibold text-gray-800'>Category</h3>
					<p className='text-gray-700 mt-2'>{dispute.category}</p>
				</div>
				<div className='bg-gray-50 p-6 rounded-lg shadow-sm'>
					<h3 className='text-xl font-semibold text-gray-800'>Subcategory</h3>
					<p className='text-gray-700 mt-2'>{dispute.subcategory}</p>
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
				<div className='bg-gray-50 p-6 rounded-lg shadow-sm'>
					<h3 className='text-xl font-semibold text-gray-800'>Status</h3>
					<p className={`text-xl mt-2 ${getStatusColor(dispute.status)}`}>
						{dispute.status}
					</p>
				</div>
				<div className='bg-gray-50 p-6 rounded-lg shadow-sm'>
					<h3 className='text-xl font-semibold text-gray-800'>Tracking ID</h3>
					<p className='text-gray-700 mt-2'>{dispute.tracking_id}</p>
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
				<div className='bg-gray-50 p-6 rounded-lg shadow-sm'>
					<h3 className='text-xl font-semibold text-gray-800'>Start Time</h3>
					<p className='text-gray-700 mt-2'>
						{new Date(dispute.start_time).toLocaleString()}
					</p>
				</div>
				<div className='bg-gray-50 p-6 rounded-lg shadow-sm'>
					<h3 className='text-xl font-semibold text-gray-800'>End Time</h3>
					<p className='text-gray-700 mt-2'>
						{new Date(dispute.end_time).toLocaleString()}
					</p>
				</div>
			</div>

			<div className='bg-gray-50 p-6 rounded-lg shadow-sm mb-8'>
				<h3 className='text-xl font-semibold text-gray-800'>Description</h3>
				<p className='text-gray-700 mt-2'>{dispute.description}</p>
			</div>

			{dispute.file_path && (
				<div className='bg-gray-50 p-6 rounded-lg shadow-sm mb-8'>
					<h3 className='text-xl font-semibold text-gray-800'>File</h3>
					<a
						href={dispute.file_path}
						className='text-blue-500 hover:text-blue-700 flex items-center mt-2'
						target='_blank'
						rel='noopener noreferrer'
					>
						<FaFileDownload className='mr-2' /> Download File
					</a>
				</div>
			)}
			<div className='p-4 bg-white rounded-lg shadow-md'>
				<h2 className='text-2xl font-semibold mb-4'>Replies</h2>
				<div className='mb-4'>
					{dispute.replies.length === 0 ? (
						<p className='text-gray-600'>
							No replies yet. Be the first to add a comment.
						</p>
					) : (
						<p className='text-gray-600 mb-2'>
							{dispute.replies.length}{" "}
							{dispute.replies.length === 1 ? "Reply" : "Replies"}
						</p>
					)}
				</div>
				<ul className='space-y-4'>
					{dispute.replies.map((reply) => (
						<li key={reply.id} className='border-b border-gray-200 pb-2'>
							<p className='text-gray-800'>{reply.reply}</p>
							<small className='text-gray-500'>
								{reply.email} ({reply.group})
							</small>
						</li>
					))}
				</ul>
				<form onSubmit={handleReplySubmit} className='mt-4'>
					<textarea
						value={newReply}
						onChange={handleReplyChange}
						placeholder='Type your reply here...'
						className='w-full p-2 border border-gray-300 rounded-lg mb-2'
						rows='4'
						required
					/>
					<button
						type='submit'
						className='bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600'
					>
						Submit Reply
					</button>
				</form>
				<div className='mt-4'>
					<p className='text-gray-600'>
						Logged in as: {user.email} (
						{user.group.toLowerCase() === "sterling"
							? "Sterling Admin"
							: "Ringo Admin"}
						)
					</p>
				</div>
			</div>
		</div>
	);
};

// Helper function to get status color
const getStatusColor = (status) => {
	switch (status) {
		case "pending":
			return "text-yellow-600";
		case "in_progress":
			return "text-blue-600";
		case "resolved":
			return "text-green-600";
		default:
			return "text-gray-700";
	}
};

export default DisputeDetails;
