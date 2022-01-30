import React, { useEffect, useState } from "react";
import {
	HomeIcon,
	SearchIcon,
	LibraryIcon,
	PlusCircleIcon,
	RssIcon,
} from "@heroicons/react/outline";
import { HeartIcon } from "@heroicons/react/solid";
import { signOut, useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from "recoil";
import { PlaylistIdState } from "../atoms/playlistAtom";

function Sidebar() {
	const spotifyApi = useSpotify();
	const { data: session, status } = useSession();
	const [playlists, setPlaylists] = useState([]);
	const [playlistId, setPlaylistId] = useRecoilState(PlaylistIdState);

	useEffect(() => {
		if (spotifyApi.getAccessToken()) {
			spotifyApi
				.getUserPlaylists()
				.then((data) => setPlaylists(data.body.items));
		}
	}, [session, spotifyApi]);

	return (
		<div className="text-gray-500 p-5 pr-10 text-xs lg:text-sm border-r border-gray-900 pb-36 overflow-y-scroll h-screen scrollbar-hide sm: max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex">
			<div className="space-y-4">
				<button className="flex items-center space-x-2 hover:text-white">
					<HomeIcon className="h-5 w-5" />
					<p>Home</p>
				</button>
				<button className="flex items-center space-x-2 hover:text-white">
					<SearchIcon className="h-5 w-5" />
					<p>Search</p>
				</button>
				<button className="flex items-center space-x-2 hover:text-white">
					<LibraryIcon className="h-5 w-5" />
					<p>Your Library</p>
				</button>
				<hr className="border-t-[0.1px] border-gray-900 -mx-10" />
				<button className="flex items-center space-x-2 hover:brightness-150 hover:contrast-150">
					<PlusCircleIcon className="h-5 w-5 text-red-500 " />
					<p>Create Playlist</p>
				</button>
				<button className="flex items-center space-x-2  hover:brightness-150 hover:contrast-150">
					<HeartIcon className="h-5 w-5 text-blue-600" />
					<p>Liked Songs</p>
				</button>
				<button className="flex items-center space-x-2 hover:brightness-150 hover:contrast-150">
					<RssIcon className="h-5 w-5  text-[#1DB954] " />
					<p>Your Episodes</p>
				</button>
				<hr className="border-t-[0.1px] border-gray-900 -mx-10" />
				{/* Playlists... */}
				{playlists.map((playlist) => (
					<p
						key={playlist.id}
						onClick={() => setPlaylistId(playlist.id)}
						className="cursor-pointer hover:text-white"
					>
						{playlist.name}
					</p>
				))}
			</div>
		</div>
	);
}

export default Sidebar;
