import { Document, Schema, Model, model } from "mongoose";
import * as bcrypt from 'bcrypt';
import { IUserDocument } from '../interfaces/user';

export interface IUser extends IUserDocument {
    comparePassword(password: string): boolean
}

export interface IUserModel extends Model<IUser> {
    hashPassword(password: string): string
}

export var userSchema: Schema = new Schema({
    _id: Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.method('comparePassword', function(password: string): boolean {
    if(bcrypt.compareSync(password, this.password)) return true;
    return false;
});

userSchema.method('hashPassword', function(password: string): string {
    return bcrypt.hashSync(password, 10);
})

export const User: IUserModel = model<IUser, IUserModel>('User', userSchema);
export default User
