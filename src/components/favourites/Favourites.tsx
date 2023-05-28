import "./Favourites.css";

interface ActivityDetails {
  startTime: string;
  endTime: string;
  name: string;
}

interface ActivityList {
  [key: number]: ActivityDetails[];
}

interface FavouriteActivities {
  [key: string]: ActivityList;
}

interface FavouritesProps {
  favouriteActivities: FavouriteActivities;
  favouriteDests: string[];
}

function Favourites({ favouriteActivities, favouriteDests }: FavouritesProps) {
  console.log(favouriteActivities);
  return (
    <div className="favourites-container">
      <h2>Favourites</h2>
      {favouriteDests.map((destination: string, index: number) => (
        <div key={index}>
          <h3>Favourites for {destination}</h3>
          <ul>
            {Object.entries(favouriteActivities[destination]).map(
              ([day, activities]) => (
                <li key={day}>
                  <h4>Day {day}</h4>
                  {activities.map(
                    (activity: ActivityDetails, subIndex: number) => (
                      <div key={subIndex}>
                        <p>Start Time: {activity.startTime}</p>
                        <p>End Time: {activity.endTime}</p>
                        <p>Name: {activity.name}</p>
                      </div>
                    )
                  )}
                </li>
              )
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Favourites;
