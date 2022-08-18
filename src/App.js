import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import NotFound from './pages/not-found/NotFound';

function App() {
	return (
		<Routes>
			<Route path="*" element={<NotFound />} />
			<Route path="/:id" element={<Home />} />
		</Routes>
	);
}

export default App;
