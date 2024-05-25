import dotenv from 'dotenv';
dotenv.config();

// import passport from 'passport';
// import { Strategy as Face } from 'passport-facebook';

// const FacebookStrategy = new Face({
//     "clientID": process.env.APP_FACEBOOK_ID as string,
//     "clientSecret": process.env.APP_FACEBOOK_SECRET as string,
//     "callbackURL": process.env.APP_FACEBOOK_CALLBACK as string,
// }, async (accessToken, refreshToken, profile, done) => {
//     return done(null, profile);
// });
// passport.use(FacebookStrategy);