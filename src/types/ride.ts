
export type Ride = {
  id: number;
  from: string;
  to: string;
  time: string;
  date: string;
  seatsAvailable: number;
  distance: string;
  driver_id: string;
  driver_name: string;
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
