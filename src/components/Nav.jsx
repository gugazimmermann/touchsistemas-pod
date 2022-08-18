import LogoIcon from '../images/LogoIcon';

export default function Nav({eventID}) {
	return (
		<nav id="header" className="fixed w-full z-30 top-0 bg-white shadow">
			<div className="flex flex-row items-center justify-between align-middle py-2 px-4 w-full container mx-auto">
				<a
					className="flex flex-row items-center text-primary no-underline hover:no-underline font-bold text-2xl lg:text-2xl"
					href={`https://pod.touchsistemas.com.br/${eventID}`}
				>
					<LogoIcon styles="h-10 w-10" />
					<span data-testid="title">{process.env.REACT_APP_TITLE}</span>
				</a>
			</div>
		</nav>
	);
}
