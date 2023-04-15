import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { GetSales } from '../../api/api';
import DataModal from '../DataModal/DataModal';
import './ViewSales.css';

export const ViewSales = () => {
	var today_date = new Date().toISOString().split('T')[0];
	const [date, setDate] = useState(today_date);
	const [results, setResults] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [modalData, setModalData] = useState(null);

	const columns = [
		{ field: 'id', headerName: 'ID', width: 90 },
		{ field: 'product', headerName: 'Product', width: 150 },
		{ field: 'product_quantity', headerName: 'Product Quantity', width: 150 },
		{ field: 'sale_amount', headerName: 'Sale Amount', width: 150 },
		{ field: 'salesman_name', headerName: 'Salesman Name', width: 150 },
		{
			field: 'salesman_commission',
			headerName: 'Salesman Commission',
			width: 150,
		},
		{ field: 'salesman_area', headerName: 'Salesman Area', width: 150 },
		{ field: 'created_date', headerName: 'Created Date', width: 150 },
	];

	useEffect(() => {
		GetSales(date)
			.then((res) => {
				setResults(res);
			})
			.catch((err) => {
				console.log(err, 'err');
				alert('Error fetching sales data');
			});
	}, [date]);

	const handleModalClose = () => {
		setShowModal(false);
	};

	return (
		<div style={{ height: 400, width: '100%' }}>
			<div>
				View Sales for Date:  
				<input
					type='date'
					value={date}
					onChange={(e) => setDate(e.target.value)}
				/>
			</div>
			<br />
			{results && results.length > 0 && (
				<DataGrid
					rows={results}
					columns={columns}
					pageSize={10}
					pagination
					autoHeight
					onCellClick={(e) => {
						if (e.field === 'salesman_name') {
							setShowModal(true);
							setModalData({
								data_type: 'salesman',
								'Salesman Name': e.row.salesman_name,
								'Commission Amount': e.row.salesman_commission,
								Area: e.row.salesman_area,
								'Sales Amount': e.row.sale_amount,
							});
						} else if (e.field === 'product') {
							setShowModal(true);
							setModalData({
								data_type: 'product',
								'Product Name': e.row.product,
								Area: e.row.salesman_area,
								Quantity: e.row.product_quantity,
								'Sales Amount': e.row.sale_amount,
							});
						}
					}}
					getCellClassName={(params) => {
						return params.field === 'salesman_name' ||
							params.field === 'product'
							? 'clickable'
							: '';
					}}
				/>
			)}
			{results && results.length === 0 && (
				<div style={{ textAlign: 'center' }}>No Sales Found</div>
			)}
			<DataModal
				data={modalData}
				show={showModal}
				handleClose={handleModalClose}
			/>
		</div>
	);
};
