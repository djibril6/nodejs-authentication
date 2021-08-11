import { NextFunction } from "express";
import passport from "passport";
import passportLocal from "passport-local";

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<any, any>((req: Request, user: any, done: any) =>  {
    done(undefined, user);
});

passport.deserializeUser((id, done) => {
    done("", {});
});

passport.use(new LocalStrategy)