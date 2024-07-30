import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { Provider, UserInterface, UserModel } from "./models/user.model";

dotenv.config();

const comparePassword = (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

//local strategy for form based auth
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const userFound = await UserModel.getByEmail(email);
        if (userFound.result && await comparePassword(password, userFound.user.password)) {
          return done(null, userFound.user);
        } else {
          return done(null, false, { message: "Invalid credentials" });
        }
      } catch (e) {
        console.error(e);
        return done(e, false);
      }
    }
  )
);

//google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENTID || "your-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "your-google-client-secret",
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3200/users/auth/google/callback",
    },
    async function (accessToken, refreshtoken, profile, done) {
      try {
        const email = profile.emails ? profile.emails[0].value : "";
        if (!email) {
          return done(null, false, { message: "No email found in profile" });
        }

        let userExist = await UserModel.getByEmail(email);
        if (userExist.result) {
          return done(null, userExist.user);
        } else {
          const userDetails: UserInterface = {
            email: email,
            provider: Provider.google,
            socialId: profile.id,
            username: profile.displayName,
            profilePicture: profile.photos ? profile.photos[0].value : "",
            isVerified: profile.emails ? profile.emails[0].verified : false,
            password: "",
          };
          const newUser = await UserModel.create(userDetails);
          return done(null, newUser);
        }
      } catch (error) {
        console.error(error);
        return done(error, false);
      }
    }
  )
);

//facebook strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APPID || "your-facebook-app-id",
      clientSecret: process.env.FACEBOOK_SECRET || "your-facebook-app-secret",
      callbackURL: process.env.FACEBOOK_REDIRECT || "/users/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails", "profileUrl"],
    },
    async function (accessToken, refreshtoken, profile, done) {
      try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : "";
        if (!email) {
          return done(null, false, { message: "No email found in profile" });
        }

        let userExist = await UserModel.getByEmail(email);
        if (userExist.result) {
          return done(null, userExist.user);
        } else {
          const fbUser: UserInterface = {
            username: profile.displayName,
            socialId: profile.id,
            profilePicture: profile.profileUrl || "",
            email: email,
            provider: Provider.facebook,
            isVerified: true,
            password: "",
          };
          const newUser = await UserModel.create(fbUser);
          return done(null, newUser);
        }
      } catch (error) {
        console.error(error);
        return done(error, false);
      }
    }
  )
);

passport.serializeUser(function (user: any, done) {
  return done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await UserModel.getbyId(id);
    if (user) {
      done(null, user);
    } else {
      done(new Error("User not found"), null);
    }
  } catch (error) {
    done(error, null);
  }
});
