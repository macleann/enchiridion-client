import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { TrashIcon } from "../svgs/TrashIcon";
import { DragHandle } from "../svgs/DragHandle";

export const DraggableEpisode = ({ episode, index, moveEpisode, handleRemoveEpisode, displayAirDate, isMobile }) => {
    // This is the hook that allows us to drop the episodes
    const ref = useRef(null);
    // This is the hook that allows us to drag the episodes
    const dragRef = useRef(null);
  
    // This is the hook that allows us to drag and drop the episodes
    const [, drop] = useDrop({
        // The type of item we are dragging
        accept: "episode",
        // The hover function is called when we drag an item over the drop target
        hover(item, monitor) {
          // If we are not dragging over the drop target, return early
          if (!ref.current || !monitor.isOver({ shallow: true })) return;
    
          // The index of the item we are dragging
          const dragIndex = item.index;
          // The index of the item we are hovering over
          const hoverIndex = index;
    
          // If we are dragging the item we are hovering over, return early
          const hoverBoundingRect = ref.current?.getBoundingClientRect();
          // Get vertical middle
          const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
          // Determine mouse position
          const clientOffset = monitor.getClientOffset();
          // Get pixels to the top
          const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    
          // If we are dragging over the bottom half of the item we are hovering over, return early
          if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
          // If we are dragging over the top half of the item we are hovering over, return early
          if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
    
          // Move the item we are dragging to the position we are hovering over
          moveEpisode(dragIndex, hoverIndex);
          // Update the index for the item we are dragging
          item.index = hoverIndex;
        },
    });
  
    // This is the hook that allows us to drag the episodes
    const [{ isDragging }, drag] = useDrag(() => ({
      // The type of item we are dragging
      type: "episode",
      // The data we are sending
      item: { id: episode.id, index: index },
      // The drag collect function
      // Collecting generally means to get the current state of the drag and drop operation
      collect: (monitor) => ({
        // Is the item currently being dragged
        isDragging: monitor.isDragging(),
      }),
    }));
  
    const episodeimgURL = "https://www.themoviedb.org/t/p/original";
  
    // This is the hook that allows us to drag and drop the episodes
    drag(drop(ref));
    // This is the hook that allows us to drag the episodes
    drag(dragRef);

  return (
    <div
      key={episode.id}
      className="my-4"
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: "move" }}
    >
      {!isMobile ? ( // If the screen size is larger than 768px (typically considered a desktop view)
        <div className="grid grid-cols-3 items-start gap-10">
          <div className="col-span-1 flex items-center">
            <div className="mr-2" ref={dragRef} style={{ cursor: "move" }}>
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
      ) : (
        <div className="flex items-center justify-evenly">
          <div className="mr-2" ref={dragRef} style={{ cursor: "move" }}>
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