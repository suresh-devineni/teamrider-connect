
export type Ride = {
  id: number;
  from_location: string;
  to_location: string;
  from_latitude: number | null;
  from_longitude: number | null;
  to_latitude: number | null;
  to_longitude: number | null;
  departure_time: string;
  departure_date: string;
  seats_available: number;
  distance: string;
  driver_id: string;
  driver_name: string;
  created_at: string;
};

export type RideRequest = {
  id: number;
  ride_id: number;
  requester_id: string;
  requester_name: string;
  status: 'pending' | 'accepted' | 'rejected';
  seats_requested: number;
  created_at: string;
};

export type Message = {
  id: number;
  ride_id: number;
  sender_id: string;
  sender_name: string;
  content: string;
  created_at: string;
};
