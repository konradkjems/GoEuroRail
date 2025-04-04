import csv
import math
from typing import List, Tuple

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371  # Earth's radius in kilometers

    # Convert latitude and longitude to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])

    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    distance = R * c

    return distance

def find_nearest_cities(target_lat: float, target_lon: float, n: int) -> List[Tuple[str, float]]:
    cities = []
    
    with open('data/geonames-all-cities-with-a-population-10000-csv.csv', 'r', encoding='utf-8') as file:
        csv_reader = csv.reader(file, delimiter=';')
        for row in csv_reader:
            try:
                # Extract coordinates from the last field
                coords = row[-1].split(',')
                if len(coords) != 2:
                    continue
                    
                city_lat = float(coords[0].strip())
                city_lon = float(coords[1].strip())
                
                # Calculate distance
                distance = haversine_distance(target_lat, target_lon, city_lat, city_lon)
                
                # Get city name from the second field if available, otherwise use empty string
                city_name = row[1] if len(row) > 1 else ""
                
                cities.append((city_name, distance))
                
            except (ValueError, IndexError):
                continue

    # Sort cities by distance and return top N
    return sorted(cities, key=lambda x: x[1])[:n]

def main():
    # Example coordinates (Berlin)
    target_lat = 52.5200
    target_lon = 13.4050
    
    # Find 5 nearest cities
    nearest_cities = find_nearest_cities(target_lat, target_lon, 5)
    
    # Print results
    print(f"\nNearest cities to ({target_lat}, {target_lon}):")
    for city, distance in nearest_cities:
        print(f"{city}: {distance:.2f} km")

if __name__ == '__main__':
    main() 