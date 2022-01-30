import { getProviders, signIn } from "next-auth/react";

function Login({ providers }) {
	return (
		<div className="flex flex-col items-center justify-center bg-[#111] min-h-screen">
			<img
				src="https://www.freepnglogos.com/uploads/spotify-logo-png/file-spotify-logo-png-4.png"
				alt=""
				className="w-52 mb-5 contrast-125"
			/>
			{Object.values(providers).map((provider) => (
				<div key={provider.name}>
					<button
						className="bg-[#18D860] p-5 rounded-full text-[#111] font-bold font-sans contrast-125"
						onClick={() => signIn(provider.id, { callbackUrl: "/" })}
					>
						Login with {provider.name}
					</button>
				</div>
			))}
		</div>
	);
}

export default Login;

export async function getServerSideProps() {
	const providers = await getProviders();
	return {
		props: {
			providers,
		},
	};
}
