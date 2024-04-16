import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface IUser {
  username: string; // username is the unique identifier
  password: string; // password is the password of the user
  firstName: string; // firstName is the first name of the user
  lastName: string; // lastName is the last name of the user
  admin: boolean; // admin is a boolean that indicates if the user is an admin or student
  email: string; // email is the email of the user
  essays: string[]; // essays is an array of essay ids
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  essays: {
    type: [String],
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

export default User;
