import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { useRecoilState } from "recoil";
import { currentTrackState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";
import {
	RewindIcon,
	SwitchHorizontalIcon,
	VolumeOffIcon,
	FastForwardIcon,
	ReplyIcon,
} from "@heroicons/react/outline";
import { PauseIcon, PlayIcon, VolumeUpIcon } from "@heroicons/react/solid";
import { debounce } from "lodash";

function Player() {
	const { data: session } = useSession();
	const spotifyApi = useSpotify();
	spotifyApi.setAccessToken(session.user.accessToken);
	const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackState);
	const [isPlaying, setPlaying] = useRecoilState(isPlayingState);
	const [volume, setVolume] = useState(50);

	const songInfo = useSongInfo();

	const fetchCurrentSong = () => {
		if (!songInfo) {
			spotifyApi.getMyCurrentPlayingTrack().then((data) => {
				console.log("Now playing ", data.body?.item);
				setCurrentTrackId(data.body?.item?.id);
			});

			spotifyApi.getMyCurrentPlaybackState().then((data) => {
				console.log(data.body?.is_playing);
				setPlaying(data.body?.is_playing);
			});
		}
	};

	useEffect(() => {
		if (spotifyApi.getAccessToken() && !currentTrackId) {
			fetchCurrentSong();
			setVolume(50);
		}
	}, [currentTrackState, spotifyApi, session]);

	const handlePlayPause = () => {
		spotifyApi.getMyCurrentPlaybackState().then((data) => {
			if (data.body?.is_playing) {
				spotifyApi.pause();
				setPlaying(false);
			} else {
				spotifyApi.play();
				setPlaying(true);
			}
		});
	};

	const debouncedAdjustVolume = useCallback(
		debounce((volume) => {
			spotifyApi.setVolume(volume).catch((err) => {});
		}, 500),
		[]
	);

	useEffect(() => {
		if (volume > 0 && volume < 100) {
			debouncedAdjustVolume(volume);
		}
	}, [volume]);

	useEffect(() => {
		// Space bar play and pause
		document.body.onkeydown = function (e) {
			if (e.key === " ") {
				// stops default behaviour of space bar. Stop page scrolling down
				e.preventDefault();
				handlePlayPause();
			}
			if (e.key === "ArrowUp") {
				e.preventDefault()
				volume < 100 && setVolume(volume + 10);
			} else if (e.key === "ArrowDown") {
				e.preventDefault()
				volume > 0 && setVolume(volume - 10);
			}
		};
	}, []);

	return (
		<div className="h-24 flex items-center justify-between bg-gradient-to-b from-black to-gray-900 text-white grid-cols-3 gap-4 text-xs md:text-base px-2 md:px-8">
			{/* Left */}
			<div className="flex items-center space-x-4">
				<img
					src={songInfo?.album?.images?.[0].url}
					className="hidden md:inline h-10 w-10"
					alt=""
				/>
				<div className="">
					<h3>{songInfo?.name}</h3>
					<p className="text-gray-500 truncate">
						{songInfo?.artists
							.map((art, i) => {
								const nameArr = [];
								nameArr.push(art.name);
								return nameArr;
							})
							.join(", ")}
					</p>
				</div>
			</div>
			{/* Center */}
			<div className="flex space-x-4 items-center justify-evenly">
				<SwitchHorizontalIcon className="button" />
				<RewindIcon
					className="button"
					onClick={() => spotifyApi.skipToPrevious()}
				/>
				{!isPlaying ? (
					<PlayIcon className="play-button" onClick={handlePlayPause} />
				) : (
					<PauseIcon className="play-button" onClick={handlePlayPause} />
				)}
				<FastForwardIcon
					className="button"
					onClick={() => spotifyApi.skipToNext()}
				/>
				<ReplyIcon className="button" />
			</div>
			{/* Right */}
			<div className="flex space-x-3 md:space-x-4 items-center">
				<VolumeOffIcon
					onClick={() => volume > 0 && setVolume(volume - 10)}
					className="button"
				/>
				<input
					className="w-14 md:w-28"
					type="range"
					value={volume}
					min={0}
					max={100}
					onChange={(e) => setVolume(Number(e.target.value))}
				/>
				<VolumeUpIcon
					className="button"
					onClick={() => volume <= 100 && setVolume(volume + 10)}
				/>
			</div>
		</div>
	);
}

export default Player;
