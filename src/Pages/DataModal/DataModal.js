import React, { Component } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import './DataModal.css';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

const DataModal = ({ data, show, handleClose }) => {
	return (
		<div>
			<Modal open={show} onClose={handleClose}>
				<Box sx={style}>
					<Typography className='modal-modal-title' variant='h6' component='h2'>
						{data && data.data_type === 'salesman' ? 'Salesman Data' : 'Product Data'}
					</Typography>
					<Typography id='modal-modal-description' sx={{ mt: 2 }}>
						{
							// show all fields in data
							data && Object.keys(data).length > 0
								? Object.keys(data).map((key) => {
                                    if (key !== 'data_type')
										return (
											<div key={key}>
												<span className='modal-key'>{key}: </span>
												<span className='modal-value'>{data[key]}</span>
											</div>
										);
								  })
								: ''
						}
					</Typography>
					<div style={{ textAlign: 'center', width: '100%' }}>
						<Button onClick={handleClose} className='modal-cancel'>
							Close
						</Button>
					</div>
				</Box>
			</Modal>
		</div>
	);
};

export default DataModal;
