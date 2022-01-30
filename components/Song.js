import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { currentTrackState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import { millisToMinutesAndSeconds } from "../lib/time";

function Song({ song, order }) {
	const { data: session } = useSession();
	const spotifyApi = useSpotify();
	spotifyApi.setAccessToken(session.user.accessToken);
	const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackState);
	const [isPlaying, setPlaying] = useRecoilState(isPlayingState);

	useEffect(() => {
		spotifyApi.setAccessToken(session.user.accessToken);
	}, [currentTrackId, isPlaying]);

	const playSong = function () {
		setCurrentTrackId(song.track.id);
		setPlaying(true);
		spotifyApi.play({
			uris: [song.track.uri],
		});
	};

	return (
		<div
			className="grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer"
			onClick={playSong}
		>
			<div className="flex items-center space-x-4">
				<p>{order + 1}</p>
				<img
					className="w-10 h-10"
					src={song.track.album.images[0].url}
					alt=""
				/>
				<div>
					<p className="w-36 lg:w-64 truncate text-white">{song.track.name}</p>
					<p className="w-40">{song.track.artists[0].name}</p>
				</div>
			</div>
			<div className="flex items-center justify-between ml-auto md:ml-0">
				<p className="hidden md:inline">{song.track.album.name}</p>
				<p>{millisToMinutesAndSeconds(song.track.duration_ms)}</p>
			</div>
		</div>
	);
}

export default Song;
