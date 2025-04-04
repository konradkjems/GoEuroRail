import { Document, Types } from 'mongoose';
export interface ICoordinates {
    lat: number;
    lng: number;
}
export interface ICity extends Document {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
    station_codes: string[];
    timezone: string;
    region: string;
    popular_routes_from: Types.ObjectId[];
    image_url: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ITravelPreferences {
    prefer_night_trains: boolean;
    scenic_routes: boolean;
    low_budget: boolean;
}
export interface IUser extends Document {
    email: string;
    password: string;
    home_city: Types.ObjectId;
    saved_routes: Types.ObjectId[];
    travel_preferences: ITravelPreferences;
    interrail_pass_type: string;
    language: string;
    notifications_enabled: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export interface ICityVisit {
    city: Types.ObjectId;
    arrival: Date;
    departure: Date;
}
export interface ITrip extends Document {
    user_id: Types.ObjectId;
    trip_name: string;
    start_date: Date;
    end_date: Date;
    cities: ICityVisit[];
    transport_modes: string[];
    total_distance: number;
    total_duration: number;
    budget_estimate: number;
    travel_notes: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IConnection extends Document {
    from_city: Types.ObjectId;
    to_city: Types.ObjectId;
    departure_time: Date;
    arrival_time: Date;
    duration: number;
    train_number: string;
    operator: string;
    train_type: string;
    requires_reservation: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface IAttraction extends Document {
    city_id: Types.ObjectId;
    name: string;
    category: string;
    coordinates: ICoordinates;
    opening_hours: string;
    entry_fee: number;
    description: string;
    photo_url: string;
    createdAt: Date;
    updatedAt: Date;
}
