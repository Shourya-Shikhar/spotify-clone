import { useRecoilValue } from "recoil";
import { PlaylistState } from "../atoms/playlistAtom";
import Song from "./Song";

function Songs() {
	const playlist = useRecoilValue(PlaylistState);
	return (
		<div className="text-white space-y-1 pb-28">
			{playlist?.tracks?.items?.map((song, i) => (
				<Song key={song.id} song={song} order={i} />
			))}
		</div>
	);
}

export default Songs;
