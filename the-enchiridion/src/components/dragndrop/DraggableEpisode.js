import { TrashIcon } from "../svgs/TrashIcon";
import { DragHandle } from "../svgs/DragHandle";

export const DraggableEpisode = ({ episode, index, moveEpisode, handleRemoveEpisode, displayAirDate, isMobile }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ id: episode.id, index }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    moveEpisode(data.index, index);
  };

  const episodeimgURL = "https://www.themoviedb.org/t/p/original";

  return (
    <div
      key={episode.id}
      id={episode.id}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {!isMobile ? ( // If the screen size is larger than 768px (typically considered a desktop view)
        <div className="grid grid-cols-3 items-start gap-10">
          <div className="col-span-1 flex items-center">
            <div id={`${episode.id}-drag-handle`} className="mr-2" style={{ cursor: "move" }}>
              <DragHandle />
            </div>
            <img
              src={`${episodeimgURL}${episode.still_path}`}
              alt={episode.name}
              className="w-full h-auto rounded-md"
            />
          </div>
          <div className="col-span-1">
            <h2 className="font-bold text-xl">{episode.name}</h2>
            <p className="text-sm">
              {episode.series_name} - Season {episode.season_number} Episode{" "}
              {episode.episode_number}
            </p>
            <p className="text-sm text-gray-500">{episode.overview}</p>
            <p className="text-sm text-gray-500">{displayAirDate(episode)}</p>
          </div>
          <div className="col-span-1 flex items-start justify-end">
            <button
              className="button-delete bg-white hover:bg-red-500 text-black hover:text-white"
              value={episode.id}
              onClick={handleRemoveEpisode}
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      ) : ( // If the screen size is smaller than 768px (typically considered a mobile view)
        <div className="flex items-center justify-evenly">
          <div id={`${episode.id}-drag-handle`} className="mr-2" style={{ cursor: "move" }}>
            <DragHandle />
          </div>
          <div className="flex-col justify-start mr-2">
            <h2 className="font-bold text-xl">{episode.name}</h2>
            <p className="text-sm text-gray-500">
              {episode.series_name} - Season {episode.season_number} Episode{" "}
              {episode.episode_number}
            </p>
          </div>
          <div className="flex items-center">
            <button
              className="button-delete bg-white hover:bg-red-500 text-black hover:text-white"
              value={episode.id}
              onClick={handleRemoveEpisode}
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};