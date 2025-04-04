import mongoose from 'mongoose';
import { ITrip } from '../types/models';
declare const Trip: mongoose.Model<ITrip, {}, {}, {}, mongoose.Document<unknown, {}, ITrip> & ITrip & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default Trip;
