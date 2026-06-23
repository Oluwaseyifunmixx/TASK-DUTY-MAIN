import mongoose, {Schema, Document} from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    otpCode: string | undefined;
    otpExpire: Date | undefined;
    emailVerifyToken: string | undefined;
    emailVerifyExpire: Date | undefined;
    resetPasswordToken: string | undefined;
    resetPasswordExpire: Date | undefined;
    comparePassword(enteredPassword: string): Promise<boolean>
}

const UserSchema  = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },

        email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // never return password in queries
    },

      emailVerifyToken: {
         type: String,
       },
       otpCode: { 
         type: String 
       },
       otpExpire: { 
         type: Date
        },
       
       emailVerifyExpire: {
         type: Date,
       },
       resetPasswordToken: {
         type: String,
       },
       resetPasswordExpire: {
         type: Date,
       },
    },
    {
        timestamps: true,
    }
)

// Hashing Password before saving to database
UserSchema.pre<IUser>("save", async function (this: IUser) {
    if (!this.isModified("password")) {
        return
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// Compare password during login

UserSchema.methods.comparePassword = async function (
    enteredPassword: string
): Promise<boolean>{
   return await bcrypt.compare(enteredPassword, this.password)
};

const User = mongoose.model<IUser> ("User", UserSchema)
export default User;