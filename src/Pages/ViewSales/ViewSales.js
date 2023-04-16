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

	const [productData, setProductData] = useState(null);
	const [salesmanData, setSalesmanData] = useState(null);

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
				setProductData(calculateProductSales(res));
				setSalesmanData(calculateSalesmanSales(res));
			})
			.catch((err) => {
				console.log(err, 'err');
				alert('Error fetching sales data');
			});
	}, [date]);

	const calculateProductSales = (data) => {
		// calculate product sales quantity and value by area
		let product_sales = {};
		data.forEach((sale) => {
			if (product_sales[sale.product]) {
				if (product_sales[sale.product][sale.salesman_area]) {
					product_sales[sale.product][sale.salesman_area]['product_quantity'] +=
						parseInt(sale.product_quantity);
					product_sales[sale.product][sale.salesman_area]['sale_amount'] +=
						parseInt(sale.sale_amount);
				} else {
					product_sales[sale.product][sale.salesman_area] = {
						product_quantity: parseInt(sale.product_quantity),
						sale_amount: parseInt(sale.sale_amount),
					};
				}
			} else {
				// to int

				product_sales[sale.product] = {
					[sale.salesman_area]: {
						product_quantity: parseInt(sale.product_quantity),
						sale_amount: parseInt(sale.sale_amount),
					},
				};
			}
		});

		return product_sales;
	};

	const calculateSalesmanSales = (data) => {
		// calculate salesman sales quantity and value by area

		let salesman_sales = {};

		data.forEach((sale) => {
			if (salesman_sales[sale.salesman_name]) {
				if (salesman_sales[sale.salesman_name][sale.salesman_area]) {
					salesman_sales[sale.salesman_name][sale.salesman_area][
						'salesman_commission'
					] += parseFloat(sale.salesman_commission);

					salesman_sales[sale.salesman_name][sale.salesman_area][
						'sale_amount'
					] += parseInt(sale.sale_amount);
				} else {
					salesman_sales[sale.salesman_name][sale.salesman_area] = {
						salesman_commission: parseFloat(sale.salesman_commission),
						sale_amount: parseInt(sale.sale_amount),
					};
				}
			} else {
				salesman_sales[sale.salesman_name] = {};
				salesman_sales[sale.salesman_name][sale.salesman_area] = {
					salesman_commission: parseFloat(sale.salesman_commission),
					sale_amount: parseInt(sale.sale_amount),
				};
			}
		});

		return salesman_sales;
	};

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
								'Commission Amount':
								// round to 2 decimal places
									Math.floor(
									salesmanData[e.row.salesman_name][e.row.salesman_area][
										'salesman_commission'
									]* 10 
								)/ 10,
								Area: e.row.salesman_area,
								'Sales Amount':
									salesmanData[e.row.salesman_name][e.row.salesman_area][
										'sale_amount'
									],
							});
						} else if (e.field === 'product') {
							setShowModal(true);
							setModalData({
								data_type: 'product',
								'Product Name': e.row.product,
								Area: e.row.salesman_area,
								Quantity:
									productData[e.row.product][e.row.salesman_area][
										'product_quantity'
									],
								'Sales Amount':
									productData[e.row.product][e.row.salesman_area][
										'sale_amount'
									],
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
