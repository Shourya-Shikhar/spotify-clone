import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";

function useSpotify() {
	const { status,data: session } = useSession();

	const spotifyApi = new SpotifyWebApi({
		clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
		clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
	});

	useEffect(() => {
		if (session) {
			if (session.error === "RefreshAccessTokenError" || status === "unauthenticated") {
				console.log("here");
				signIn();
			}
			spotifyApi.setAccessToken(session.user.accessToken);
			spotifyApi.setRefreshToken(session.user.refreshToken)
		}
	}, [session]);

	return spotifyApi;
}

export default useSpotify;
