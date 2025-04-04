import mongoose from 'mongoose';
import { IAttraction } from '../types/models';
declare const Attraction: mongoose.Model<IAttraction, {}, {}, {}, mongoose.Document<unknown, {}, IAttraction> & IAttraction & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default Attraction;
