export const useGeocodeSearch = () => {
    const searchPlaces = async (query, cityContext = "") => {
        const fullQuery = cityContext.name ? `${query} ${cityContext.name}` : query;
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullQuery)}&format=json&accept-language=es&limit=5`
        );

        const data = await response.json();
        return data.map((item) => ({
            label: item.display_name,
            coordinates: {
                lat: parseFloat(item.lat),
                lon: parseFloat(item.lon),
            },
            name: item.name
        }));
    };

    return { searchPlaces };
};