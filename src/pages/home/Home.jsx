/* eslint-disable no-unused-vars */
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
	const [code, setCode] = useState('');
	const [visitor, setVisitor] = useState(undefined);
	const [final, setFinal] = useState(undefined);
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
			const res = await axios.post(`${process.env.REACT_APP_API}events/visitors`, {
				eventID: params.id,
				phone: `+55${phone.replace(/\D/g, '')}`,
			});
			if (res && res.status === 200) {
				setVisitor(res.data)
			} else {
				setError(true);
			}
		} catch (err) {
			setError(true);
		}
		setLoading(false);
	}

	async function handleSubmitCode(e) {
		e.preventDefault();
		setError(false);
		setLoading(true);
		if (!code || code.length < 6 || +code !== +visitor.code){
			console.log(code)
			setError(true);
			setLoading(false);
			return;
		}
		try {
			const res = await axios.post(`${process.env.REACT_APP_API}events/confirm`, {
				visitorID: visitor.id,
				eventID: params.id,
				phone: visitor.phone,
				code
			});
			if (res && res.status === 200) {
				setFinal(res.data)
			} else {
				setError(true);
			}
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

	function isCodeDisabled() {
		if (code.length < 6) return true;
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
				<h2 className="text-2xl text-center">Digite seu Celular</h2>
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
				<p className="text-xl text-center">E retire seu copo gratuitamente!</p>
			</>
		);
	}

	function renderCode() {
		return (
			<>
				<h2 className="text-2xl text-center">Código de Verificação</h2>
				<form onSubmit={(e) => handleSubmitCode(e)} className="w-full flex justify-end items-center relative">
					<input
						value={code || ''}
						onChange={(e) => setCode(e.target.value)}
						type="number"
						className={`w-full p-3 text-xl font-bold bg-white bg-clip-padding border border-solid rounded transition ease-in-out m-0 focus:border-amber-500 focus:outline-none ${
							error ? 'border-red-500' : 'border-amber-300'
						}`}
					/>
					<button type="submit" className="absolute right-2" disabled={isCodeDisabled()}>
						<i className={`bx bxs-right-top-arrow-circle text-4xl ${error ? 'text-red-500' : 'text-secondary'}`} />
					</button>
				</form>
				<p className="text-xl text-center">
					{/* Participe de nossa pesquisa ao final do evento e concora a um kit cervejeiro! */}
					Você recebeu seu código por SMS no número cadastrado.
				</p>
			</>
		);
	}

	function renderFinal() {
		return (
			<>
				<h2 className="text-2xl text-center">Obrigado pela sua participação!</h2>
				<p className="text-xl text-center">
					Retire seu copo gratuitamente em um dos pontos identificados.
				</p>
				<p className="text-xl text-center">
					Participe de nossa pesquisa ao final do evento e concora a um kit cervejeiro!
				</p>
			</>
		);
	}

	return (
		<>
			<Nav />
			<div className="h-screen flex flex-row justify-center items-center">
				{loading && <Loading />}
				{!loading && event && (
					<div className="bg-white w-full mx-4 sm:w-10/12 md:w-6/12 sm:mx-0 p-8 sm:p-8 flex flex-col justify-center items-center gap-4 rounded-lg shadow-lg">
						{logo && <img alt="logo" className="object-scale-down w-6/12 rounded-md" src={`${process.env.REACT_APP_LOGO_BUCKET}${logo}`} />}
						<h1 className="font-bold text-2xl text-center">{event.name}</h1>
						{!visitor && !final && renderPhone()}
						{visitor && !final && renderCode()}
						{visitor && final && renderFinal()}
					</div>
				)}
			</div>
		</>
	);
}

export default App;
