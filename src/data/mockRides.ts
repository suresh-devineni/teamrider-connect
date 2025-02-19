
import { type Ride } from "@/types/ride";

export const mockRides: Ride[] = [
  {
    id: 1,
    from_location: "Downtown Office",
    to_location: "Tech Park",
    from_latitude: 37.7749,
    from_longitude: -122.4194,
    to_latitude: 37.7858,
    to_longitude: -122.4008,
    departure_time: "8:30 AM",
    departure_date: "Tomorrow",
    seats_available: 3,
    distance: "5.2 km",
    driver_id: "1",
    driver_name: "John Smith",
    created_at: new Date().toISOString(),
    ride_status: "pending"
  },
  {
    id: 2,
    from_location: "Central Station",
    to_location: "Business District",
    from_latitude: 37.7795,
    from_longitude: -122.4142,
    to_latitude: 37.7899,
    to_longitude: -122.4003,
    departure_time: "9:00 AM",
    departure_date: "Tomorrow",
    seats_available: 2,
    distance: "3.8 km",
    driver_id: "2",
    driver_name: "Sarah Johnson",
    created_at: new Date().toISOString(),
    ride_status: "pending"
  },
  {
    id: 3,
    from_location: "Innovation Hub",
    to_location: "Corporate HQ",
    from_latitude: 37.7833,
    from_longitude: -122.4167,
    to_latitude: 37.7923,
    to_longitude: -122.4073,
    departure_time: "8:45 AM",
    departure_date: "Tomorrow",
    seats_available: 4,
    distance: "6.1 km",
    driver_id: "3",
    driver_name: "Michael Chen",
    created_at: new Date().toISOString(),
    ride_status: "pending"
  }
];
