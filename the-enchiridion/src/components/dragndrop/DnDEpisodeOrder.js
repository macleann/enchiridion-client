import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DraggableEpisode } from './DraggableEpisode';

export const DnDEpisodeOrder = ({ episodes, onReorder, handleRemoveEpisode, displayAirDate, isMobile }) => {
  // This function accepts the index of the item we are dragging and the index of the item we are hovering over
  const moveEpisode = (dragIndex, hoverIndex) => {
    // The item we are dragging
    const dragEpisode = episodes[dragIndex];
    // The new array of episodes
    const newEpisodes = [...episodes];
    // Remove the item we are dragging from the array
    newEpisodes.splice(dragIndex, 1);
    // Insert the item we are dragging to the position we are hovering over
    newEpisodes.splice(hoverIndex, 0, dragEpisode);
    // Update the episode order
    onReorder(newEpisodes);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {episodes.map((episode, index) => (
        <DraggableEpisode
          key={`episode--${episode.id}`}
          episode={episode}
          index={index}
          moveEpisode={moveEpisode}
          handleRemoveEpisode={handleRemoveEpisode}
          displayAirDate={displayAirDate}
          isMobile={isMobile}
        />
      ))}
    </DndProvider>
  );
};