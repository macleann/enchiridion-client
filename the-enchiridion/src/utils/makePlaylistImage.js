export const makePlaylistImage = (playlist) => {
  const smImgUrl = "https://www.themoviedb.org/t/p/original";
  const placeholderImage =
    "https://via.placeholder.com/130x195.png?text=No+Image";

  if (!playlist || !playlist.episodes) {
    return (
      <img
        className="w-full h-full object-cover"
        src={placeholderImage}
        alt="placeholder"
      />
    );
  }

  const episodeImages = playlist.episodes
    .slice(0, 4)
    .map((episode) => episode.still_path);

  if (episodeImages.length === 0) {
    return (
      <img
        className="w-full h-full object-cover"
        src={placeholderImage}
        alt="placeholder"
      />
    );
  }

  let gridCols, gridRows, layoutClass;
  if (episodeImages.length === 2) {
    gridCols = 2;
    gridRows = 2;
    layoutClass = 'grid-cols-2 grid-rows-2';
  } else {
    gridCols = episodeImages.length <= 2 ? episodeImages.length : 2;
    gridRows = episodeImages.length === 3 ? 2 : Math.ceil(episodeImages.length / 2);
    layoutClass = `grid-cols-${gridCols} grid-rows-${gridRows}`;
  }

  return (
    <div className="flex justify-center items-center">
      <div className="w-full">
        <div className={`grid ${layoutClass} gap-0`}>
          {episodeImages.map((img, index) => (
            <img
              key={index}
              className={`w-full object-cover ${index === 0 && episodeImages.length === 2 ? 'col-start-1 row-start-1' : index === 1 && episodeImages.length === 2 ? 'col-start-2 row-start-2' : ''} ${episodeImages.length === 3 && index === 2 ? 'col-start-1' : ''}`}
              src={`${smImgUrl}${img}`}
              alt="episode"
            />
          ))}
        </div>
      </div>
    </div>
  );
};