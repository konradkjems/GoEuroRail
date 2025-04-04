import mongoose from 'mongoose';
import { ICity } from '../types/models';
declare const City: mongoose.Model<ICity, {}, {}, {}, mongoose.Document<unknown, {}, ICity> & ICity & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default City;
