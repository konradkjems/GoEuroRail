import mongoose from 'mongoose';
import { IConnection } from '../types/models';
declare const Connection: mongoose.Model<IConnection, {}, {}, {}, mongoose.Document<unknown, {}, IConnection> & IConnection & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default Connection;
