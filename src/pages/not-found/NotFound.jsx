import NotFoundImg from '../../images/404.svg';
import Nav from '../../components/Nav';

function NotFound() {
	return (
		<div className="container bg-white mx-auto">
			<Nav />
			<main className="flex h-screen justify-center items-center">
				<div className="flex flex-col items-center text-5xl text-primary">
					<h1 data-testid="title" className="mb-4">
						Not Found
					</h1>
					<img src={NotFoundImg} alt="not found" className=" w-8/12" />
				</div>
			</main>
		</div>
	);
}

export default NotFound;
