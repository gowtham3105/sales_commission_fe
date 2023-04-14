import logo from './logo.svg';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { AddSalesPage } from './Pages/AddSalesPage/AddSalesPage';

import './App.css';
import { ViewSales } from './Pages/ViewSales/ViewSales';

function App() {
	return (
		<div className='App'>
			<Router>
				<Routes>
					<Route path='/' element={<AddSalesPage />} />

					<Route path='/sales' element={<ViewSales />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
