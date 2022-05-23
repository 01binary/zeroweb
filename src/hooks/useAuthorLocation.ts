import locations from '../../locations.json';

const useAuthorLocation = (location: string) =>
  location && {
    displayName: location,
    avatarUrl: locations[location]?.avatarUrl,
    locationName: locations[location]?.locationName,
    locationUrl: locations[location]?.locationUrl,
    description: locations[location]?.description,
  };

export default useAuthorLocation;
