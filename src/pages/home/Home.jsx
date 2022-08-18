/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../components/Loading';
import Nav from '../../components/Nav';

function App() {
	const params = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [event, setEvent] = useState();
	const [logo, setLogo] = useState(null);
	const [phone, setPhone] = useState('');
	const [visitor, setVisitor] = useState(undefined);
	const [error, setError] = useState(false);

	function normalizePhone(value) {
		setError(false);
		if (!value) return value;
		const currentValue = value.replace(/[^\d]/g, '');
		const cvLength = currentValue.length;
		if (cvLength < 3) return currentValue;
		if (cvLength < 7) return `(${currentValue.slice(0, 2)}) ${currentValue.slice(2)}`;
		return `(${currentValue.slice(0, 2)}) ${currentValue.slice(2, 7)}-${currentValue.slice(7, 11)}`;
	}

	function handleChangePhone(value) {
		setPhone(normalizePhone(value));
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setError(false);
		setLoading(true);
		if (!phone || phone.length < 15) {
			setError(true);
			setLoading(false);
			return;
		}
		try {
			const res = await axios.post(`${process.env.REACT_APP_API}events/pod/confirm`, {
				eventID: params.id,
				phone: `+55${phone.replace(/\D/g, '')}`,
			});
			if (res && res.status === 200) {
				console.log(res.data)
				setVisitor(res.data);
			}
			else setError(true);
		} catch (err) {
			setError(true);
		}
		setLoading(false);
	}

	async function handleEvent() {
		setLoading(true);
		try {
			let response = await fetch(`${process.env.REACT_APP_API}events/${params.id}`);
			const eventResponse = await response.json();
			if (!eventResponse.id) navigate('/');
			setEvent(eventResponse);
			response = await fetch(`${process.env.REACT_APP_API}events/logo/${params.id}`);
			const { path } = await response.json();
			setLogo(path);
			setLoading(false);
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error(err);
			setLoading(false);
			navigate('/');
		}
	}

	function isDisabled() {
		if (phone.length < 15) return true;
		return false;
	}

	useEffect(() => {
		if (params.id) {
			handleEvent();
		} else {
			navigate('/');
		}
	}, []);

	function renderPhone() {
		return (
			<>
				<h2 className="text-2xl text-center">Digite o Celular</h2>
				<form onSubmit={(e) => handleSubmit(e)} className="w-full flex justify-end items-center relative">
					<input
						value={phone || ''}
						onChange={(e) => handleChangePhone(e.target.value)}
						type="tel"
						className={`w-full p-3 text-xl font-bold bg-white bg-clip-padding border border-solid rounded transition ease-in-out m-0 focus:border-amber-500 focus:outline-none ${
							error ? 'border-red-500' : 'border-amber-300'
						}`}
					/>
					<button type="submit" className="absolute right-2" disabled={isDisabled()}>
						<i className={`bx bxs-phone-outgoing  text-4xl ${error ? 'text-red-500' : 'text-secondary'}`} />
					</button>
				</form>
			</>
		);
	}

	function renderVisitor() {
		return (
			<>
				<p className="text-2xl text-center">{phone}</p>
				<p className="text-2xl text-center">Confirmado: {!visitor.confirmation ? 'Não' : 'Sim'}</p>
				<p className="text-2xl text-center">Item Retirado: {!visitor.codeUsed ? 'Não' : 'Sim'}</p>
				<button type='button' className='bg-secondary px-4 py-2 rounded text-white font-bold shadow-lg'>Confirmar Retirada</button>
			</>
		);
	}

	return (
		<>
			<Nav eventID={params.id}  />
			<div className="h-screen flex flex-row justify-center items-center">
				{loading && <Loading />}
				{!loading && event && (
					<div className="bg-white w-full mx-4 sm:w-10/12 md:w-6/12 sm:mx-0 p-8 sm:p-8 flex flex-col justify-center items-center gap-4 rounded-lg shadow-lg">
						{logo && (
							<img
								alt="logo"
								className="object-scale-down w-6/12 rounded-md"
								src={`${process.env.REACT_APP_LOGO_BUCKET}${logo}`}
							/>
						)}
						<h1 className="font-bold text-2xl text-center">{event.name}</h1>
						{!visitor && renderPhone()}
						{visitor && renderVisitor()}
					</div>
				)}
			</div>
		</>
	);
}

export default App;
