import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";

async function customrefreshAccessToken(token) {
	try {
		console.log("Refreshing...", token);
		spotifyApi.setAccessToken(token.accessToken);
		spotifyApi.setRefreshToken(token.refreshToken);

		const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
		console.log("Refreshed Token is", refreshedToken);

		return {
			...token,
			accessToken: refreshedToken.access_token,
			accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000, // =1 hour as 3600 returns from spotify API
			refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
			// replace if new one comes or use the original
		};
	} catch (error) {
		console.error(error);
		return {
			...token,
			error: "RefreshAccessTokenError",
		};
	}
}

export default NextAuth({
	// Configure one or more authentication providers
	providers: [
		SpotifyProvider({
			clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
			clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
			authorization: LOGIN_URL,
		}),
		// ...add more providers here
	],
	secret: process.env.JWT_SECRET,
	pages: {
		signIn: "/login",
	},
	callbacks: {
		async jwt({ token, account, user }) {
			// initial sign in
			if (account && user) {
				console.log("Account>>>>>>", account);
				return {
					...token,
					accessToken: account.access_token,
					refreshToken: account.refresh_token,
					username: account.providerAccountId,
					accessTokenExpires: account.expires_at * 1000,
				};
			}

			// return previous token if the previous token has not expired
			if (Date.now() < token.accessTokenExpires) {
				console.log("EXISTING ACCESS TOKEN IS VALID");
				return token;
			}

			// Access token expired and now refresh it
			console.log("ACCESS TOKEN HAS EXPIRED,REFRESHING...");
			return await customrefreshAccessToken(token);
		},
		async session({ session, token }) {
			session.user.accessToken = token.accessToken;
			session.user.refreshToken = token.refreshToken;
			session.user.username = token.username;

			return session;
		},
	},
});
