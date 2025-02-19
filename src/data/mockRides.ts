
import { type Ride } from "@/types/ride";

export const mockRides: Ride[] = [
  {
    id: 1,
    from: "Downtown Office",
    to: "Tech Park",
    time: "8:30 AM",
    date: "Tomorrow",
    seatsAvailable: 3,
    distance: "5.2 km",
    driver_id: "1",
    driver_name: "John Smith",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    from: "Central Station",
    to: "Business District",
    time: "9:00 AM",
    date: "Tomorrow",
    seatsAvailable: 2,
    distance: "3.8 km",
    driver_id: "2",
    driver_name: "Sarah Johnson",
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    from: "Innovation Hub",
    to: "Corporate HQ",
    time: "8:45 AM",
    date: "Tomorrow",
    seatsAvailable: 4,
    distance: "6.1 km",
    driver_id: "3",
    driver_name: "Michael Chen",
    created_at: new Date().toISOString()
  }
];
