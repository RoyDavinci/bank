// src/components/DisputeTable.js
import React, { useEffect, useState } from "react";
// import DataGrid from "@mui/x-data-grid";
// import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { toast, ToastContainer } from "react-toastify";
import { FaEdit, FaTrash, FaFileDownload, FaEye } from "react-icons/fa";
import axios from "axios";
import DeleteModal from "./DeleteModal";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	ArcElement,
	CategoryScale,
	LinearScale,
	BarElement,
	LineElement,
} from "chart.js";
import Loading from "./Loading";
import Error from "./Error";

ChartJS.register(
	Title,
	Tooltip,
	Legend,
	ArcElement,
	CategoryScale,
	LinearScale,
	BarElement,
	LineElement
);

const DisputeTable = () => {
	const [disputes, setDisputes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [trackingId, setTrackingId] = useState("");
	const [selectedDispute, setSelectedDispute] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [filteredDisputes, setFilteredDisputes] = useState([]);

	const [analytics, setAnalytics] = useState({
		statusCounts: {},
		categoryCounts: {},
		trends: [],
	});
	const [error, setError] = useState(null);

	const navigate = useNavigate();
	const handleEdit = (id) => {
		navigate(`/edit/dispute/${id}`);
	};
	const handleSeeMore = (id) => {
		// Navigate to the detailed view of the dispute, you can use react-router-dom or any other routing mechanism
		navigate(`/dispute/${id}`);
	};

	const handleDelete = (id) => {
		setSelectedDispute(id);
		setIsModalOpen(true);
	};

	const getCellStyle = (status) => {
		switch (status) {
			case "pending":
				return {
					backgroundColor: "#f7b7a3", // Light red
					color: "#333",
					padding: "6px",
					textAlign: "center",
					borderRadius: "6px",
					fontWeight: "bold",
				};
			case "in_progress":
				return {
					backgroundColor: "#a1c4fd", // Light blue
					color: "#333",
					padding: "6px",
					textAlign: "center",
					borderRadius: "6px",
					fontWeight: "bold",
				};
			case "resolved":
				return {
					backgroundColor: "#d4f1d0", // Light green
					color: "#333",
					padding: "6px",
					textAlign: "center",
					borderRadius: "6px",
					fontWeight: "bold",
				};
			default:
				return {};
		}
	};

	const confirmDelete = async () => {
		console.log(selectedDispute);
		const token = localStorage.getItem("token");
		console.log(token);
		try {
			const { data } = await axios.delete(
				"http://sterling.approot.ng/api/delete/dispute",

				{
					headers: { Authorization: `Bearer ${token}` },
					data: { id: selectedDispute },
				}
			);
			console.log(data);
			if (data.status) {
				setDisputes((prevDisputes) =>
					prevDisputes.filter((dispute) => dispute.id !== selectedDispute)
				);
				toast.success("Dispute deleted successfully");
				setIsModalOpen(false);
			} else {
				toast.error("An error occurred while deleting the dispute");
				setIsModalOpen(false);
			}
		} catch (error) {
			console.log(error.response.data);
			toast.error("Failed to delete dispute");
			setIsModalOpen(false);
		}
	};

	const fetchData = async () => {
		const token = localStorage.getItem("token");
		setLoading(true);
		try {
			const { data } = await axios.get(
				"http://sterling.approot.ng/api/disputes",
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			console.log(data);

			if (data.message === "Unauthorized" || data.message.includes("Invalid")) {
				setLoading(false);
				localStorage.clear();
				navigate("/login");
			} else {
				setLoading(false);
				const uniqueSortedData = data.data
					.filter(
						(value, index, self) =>
							index === self.findIndex((t) => t.id === value.id) // Remove duplicates
					)
					.sort((a, b) => a.id - b.id);
				setDisputes(uniqueSortedData);
				setFilteredDisputes(uniqueSortedData);
				setAnalytics(data.analytics);
			}
		} catch (error) {
			setLoading(false);
			setError("Failed to load data. Please try again later.");

			if (
				error.response.data.message === "Unauthorized" ||
				error.response.data.message.includes("Invalid")
			) {
				setLoading(false);
				localStorage.clear();
				navigate("/login");
				setError("Failed to load data. Please try again later.");
			}
			setLoading(false);
			setError("Failed to load data. Please try again later.");
		}
	};

	const columns = [
		{
			field: "seeMore",
			headerName: "See More",
			width: 80,
			renderCell: (params) => (
				<button
					onClick={() => handleSeeMore(params.row.id)}
					className='text-gray-500 hover:text-blue-500 transition duration-200'
					title='View Details'
				>
					<FaEye size={20} />
				</button>
			),
		},
		{ field: "title", headerName: "Title", width: 90 },
		{
			field: "status",
			headerName: "Status",
			width: 150,
			renderCell: (params) => {
				const style = getCellStyle(params.value);
				return <div style={style}>{params.value}</div>;
			},
		},
		// { field: "description", headerName: "Description", width: 300 },
		{ field: "start_time", headerName: "Start Time", width: 180 },
		{ field: "end_time", headerName: "End Time", width: 180 },
		{ field: "tracking_id", headerName: "Tracking Id", width: 180 },
		{
			field: "actions",
			headerName: "Actions",
			width: 200,
			renderCell: (params) => (
				<div className='flex space-x-2'>
					<button
						onClick={() => handleEdit(params.row.id)}
						className='bg-blue-600 text-white py-1 px-3 rounded-lg flex items-center hover:bg-blue-700 transition duration-200'
					>
						<FaEdit className='mr-1' /> Edit
					</button>
					<button
						onClick={() => handleDelete(params.row.id)}
						className='bg-red-600 text-white py-1 px-3 rounded-lg flex items-center hover:bg-red-700 transition duration-200'
					>
						<FaTrash className='mr-1' /> Delete
					</button>
				</div>
			),
		},
		{
			field: "file_path",
			headerName: "View/Download File",
			width: 180,
			renderCell: (params) => (
				<a
					href={params.value}
					className='text-blue-500 hover:underline flex items-center cursor-pointer'
					target='_blank'
					rel='noopener noreferrer'
				>
					<FaFileDownload className='mr-1' /> Download
				</a>
			),
		},
	];

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		if (trackingId) {
			setFilteredDisputes(
				disputes.filter((dispute) => dispute.tracking_id.includes(trackingId))
			);
		} else {
			setFilteredDisputes(disputes);
		}
	}, [trackingId, disputes]);

	if (loading) return <Loading />;
	if (error) return <Error message={error} />;

	return (
		<div className='flex flex-col h-screen p-4'>
			<ToastContainer />
			<div className='p-4'>
				<div>
					{disputes.length === 0 ? (
						<div className='flex flex-col justify-center items-center h-full'>
							<p className='text-gray-500 text-lg mb-4'>No disputes found.</p>
							<Link to='/create-dispute'>
								<button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
									Create Dispute
								</button>
							</Link>
						</div>
					) : (
						<div style={{ height: 600, width: "100%" }}>
							<div className='flex justify-end mb-4'>
								<input
									type='text'
									placeholder='Filter by Tracking ID'
									value={trackingId}
									onChange={(e) => setTrackingId(e.target.value)}
									className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
									style={{ width: "300px" }}
								/>
							</div>
							<DataGrid
								rows={disputes}
								columns={columns}
								pageSize={10}
								rowsPerPageOptions={[10, 20, 50]}
								checkboxSelection
								disableSelectionOnClick
								className='bg-white shadow-lg rounded-lg'
							/>
						</div>
					)}
				</div>
				{/* <div style={{ height: 600, width: "100%" }}>
					<DataGrid
						rows={disputes}
						columns={columns}
						pageSize={10}
						loading={loading}
						rowsPerPageOptions={[10, 20, 50]}
						checkboxSelection
						disableSelectionOnClick
						className='bg-white shadow-lg rounded-lg'
					/>
				</div> */}
			</div>
			<DeleteModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onConfirm={confirmDelete}
			/>
		</div>
	);
};

export default DisputeTable;

// export default DisputeTable;
