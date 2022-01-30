import { ChevronDownIcon } from "@heroicons/react/outline";
import { shuffle } from "lodash";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { PlaylistIdState, PlaylistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";

const colors = [
	"from-green-500 ",
	"from-orange-500",
	"from-tangerine-500",
	"from-yellow-500 ",
	"from-red-500 ",
	"from-indigo-500 ",
	"from-blue-700",
];

function Center() {
	const { data: session } = useSession();
	const [color, setColor] = useState(null);
	const playlistId = useRecoilValue(PlaylistIdState);
	const [playlist, setPlaylist] = useRecoilState(PlaylistState);
	const spotifyApi = useSpotify();

	useEffect(() => {
		setColor(shuffle(colors).pop());
		spotifyApi.setAccessToken(session.user.accessToken);
	}, [playlistId]);

	useEffect(() => {
		spotifyApi
			.getPlaylist(playlistId)
			.then((data) => setPlaylist(data.body))
			.catch((err) => console.log("Something went wrong!", err));
	}, [spotifyApi, playlistId]);

	return (
		<div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
			<header className="absolute top-5 right-8">
				<div
					className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1  text-white"
					onClick={signOut}
				>
					<img
						className="rounded-full w-12 h-12"
						src={session?.user.image}
						alt=""
					/>
					<h2>{session?.user.name}</h2>
					<ChevronDownIcon className="w-5 h-5" />
				</div>
			</header>
			<section
				className={`flex items-end space-x-7 bg-gradient-to-b ${color} to-black text-white h-80 p-8`}
			>
				<img
					className="w-44 h-44 shadow-2xl"
					src={playlist?.images?.[0]?.url}
					alt=""
				/>
				<div>
					<p>PLAYLIST</p>
					<h1 className="text-5xl md:text-7xl xl:text-8xl font-bold">
						{playlist?.name}
					</h1>
				</div>
			</section>
			<div>
				<Songs />
			</div>
		</div>
	);
}

export default Center;
