
import { type Ride } from "@/types/ride";

export const mockRides: Ride[] = [
  {
    id: 1,
    from_location: "Downtown Office",
    to_location: "Tech Park",
    departure_time: "8:30 AM",
    departure_date: "Tomorrow",
    seats_available: 3,
    distance: "5.2 km",
    driver_id: "1",
    driver_name: "John Smith",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    from_location: "Central Station",
    to_location: "Business District",
    departure_time: "9:00 AM",
    departure_date: "Tomorrow",
    seats_available: 2,
    distance: "3.8 km",
    driver_id: "2",
    driver_name: "Sarah Johnson",
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    from_location: "Innovation Hub",
    to_location: "Corporate HQ",
    departure_time: "8:45 AM",
    departure_date: "Tomorrow",
    seats_available: 4,
    distance: "6.1 km",
    driver_id: "3",
    driver_name: "Michael Chen",
    created_at: new Date().toISOString()
  }
];
