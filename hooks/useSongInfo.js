import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackState } from "../atoms/songAtom";
import useSpotify from "./useSpotify";

function useSongInfo() {
	const { data: session } = useSession();
	const spotifyApi = useSpotify();
	spotifyApi.setAccessToken(session.user.accessToken);
	// console.log(spotifyApi.getAccessToken());
	const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackState);
	const [songInfo, setSongInfo] = useState(null)
	useEffect(() => {
		const fetchsongInfo = async () => {
			if (currentTrackId) {
				const trackInfo = await fetch(
					`https://api.spotify.com/v1/tracks/${currentTrackId}`,
					{
						headers: {
							Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
						},
					}
				).then((res) => res.json());
				setSongInfo(trackInfo);
			}
		};
		fetchsongInfo();
	}, [currentTrackId]);

	return songInfo;
}
export default useSongInfo;
