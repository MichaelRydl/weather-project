import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Divider, Flex, Text, Loader } from "@mantine/core";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  favouriteLocationsState,
  weatherDataState,
  weatherLocationState,
} from "../../state/atoms";
import { wmoCodes } from "../../../wmo-codes";
import classes from "./FavouriteList.module.css";

const SortableCity = ({
  id,
  name,
  country,
  weatherData,
  isLast,
  onSelect,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 10 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={classes.city_box}
        onClick={() => onSelect(name)}
        {...attributes}
        {...listeners}
      >
        <div className={classes.city_box_overlay}>
          <Flex mih="100%" justify="space-between" align="center">
            <img
              className={classes.weather_icon}
              src={
                weatherData.isDay
                  ? wmoCodes[weatherData.weatherCode].day.image
                  : wmoCodes[weatherData.weatherCode].night.image
              }
              alt={`${
                weatherData.isDay
                  ? wmoCodes[weatherData.weatherCode].day.description
                  : wmoCodes[weatherData.weatherCode].night.description
              } icon`}
            />
            <Flex align="end" direction="column">
              <Text className={classes.city_text} size="md" c="white">
                {name}, {country}
              </Text>
              <Text size="2.5rem" c="white">
                {Math.round(weatherData.temperature)}
                <sup style={{ fontSize: "1rem" }}>
                  {weatherData.temperatureUnit}
                </sup>
              </Text>
            </Flex>
          </Flex>
        </div>
      </div>
      {!isLast && <Divider />}
    </div>
  );
};

const FavouriteList = () => {
  const setLocation = useSetRecoilState(weatherLocationState);
  const [favouriteLocations, setFavouriteLocations] = useRecoilState(
    favouriteLocationsState,
  );
  const weatherData = useRecoilValue(weatherDataState);

  const sensors = useSensors(
    // Mouse: only start dragging after moving a bit, so a plain click still
    // selects the city instead of triggering a drag.
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    // Touch: press-and-hold to drag, so a tap still selects and the list can
    // still be scrolled.
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleWeatherItemClick = (location) => {
    setLocation(location);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setFavouriteLocations((items) => {
      const oldIndex = items.findIndex((item) => item.name === active.id);
      const newIndex = items.findIndex((item) => item.name === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  return (
    <div className={classes.wrapper}>
      {weatherData ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={favouriteLocations.map((item) => item.name)}
            strategy={verticalListSortingStrategy}
          >
            {favouriteLocations?.map((favourite, i) => (
              <SortableCity
                key={favourite.name}
                id={favourite.name}
                name={favourite.name}
                country={favourite.country}
                weatherData={favourite.weatherData}
                isLast={i === favouriteLocations.length - 1}
                onSelect={handleWeatherItemClick}
              />
            ))}
          </SortableContext>
        </DndContext>
      ) : (
        <Flex h="100%" align="center" justify="center">
          <Loader w="100%" color="gray" type="dots" size={50} />
        </Flex>
      )}
    </div>
  );
};

export default FavouriteList;
