import express from 'express';
import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as CustomStrategy } from 'passport-custom';
import { Strategy as LocalStrategy } from 'passport-local';

// const session = require('express-session');
// const pgSessionStore = require('connect-pg-simple')(session);
import session from 'express-session';
import pgSessionStore from 'connect-pg-simple';

const router = express.Router({mergeParams: true});
passport.use(new LocalStrategy({
    passReqToCallback:true,
},


const sessionMiddleware = session({
    store: new pgSessionStore(session)({
        pool: pg_pool,
        tableName : 'user_sessions'
    }),
    secret: 'asdasdasdqwe',
    cookie: {
        maxAge: 1000*60*60*24*365*5,
        secure: argv.env == 'dev' ? false : true,
        sameSite: argv.env == 'dev' ? undefined : 'none',
    },
    resave: false,
    saveUninitialized: false,
});
router.use(sessionMiddleware);
router.use(passport.initialize());
router.use(passport.session());


async function(req, username, password, done) {
    if(username == '__anonymous_login') {
        const token = password;
        const ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        const ip = ip_address;
        const request_headers = req.headers;

        const user = await user_actions.create_anon_user({anon_score: null, ip, request_headers});
        return done(null, user);
    } else {
        return done(null, false, { message: 'Regular login not implemented yet.' });
    }
}
));

passport.serializeUser(function(user, done) {
let { id, public_id } = user;
done(null, id ? { id, public_id } : null);
});

passport.deserializeUser(async function(serialized_user, done) {
let user = await user_queries.get_user_by_id({id: serialized_user.id});
if(user) {
    done(null, user);
} else {
    done(null, false);
}
});

const twitter_credentials = getCredentials('twitter');

if(twitter_credentials && twitter_credentials.key && twitter_credentials.secret) {
    passport.use('twitter', new TwitterStrategy({
            consumerKey: twitter_credentials.key,
            consumerSecret: twitter_credentials.secret,
            callbackURL: twitter_credentials.callback_url || 'http://127.0.0.1:8004/api/auth/twitter_callback',
            passReqToCallback: true,
        },
        async function(req, token, tokenSecret, profile, done) {
            const { name, screen_name, followers_count, friends_count, favourites_count,  } = profile._json;
            const _profile = { name, screen_name, followers_count, friends_count, favourites_count,  };

            let existing_user = await user_queries.get_user_by_twitter_handle({twitter_handle: screen_name});

            if(existing_user) {
                const user = existing_user;
                done(null, user);
            } else if(req.user) {
                const user = await user_actions.update_user({user_id: req.user.id, fields: {twitter: _profile, twitter_handle: screen_name}});
                done(null, user);
            } else {
                const user = await user_actions.add_user({user: {twitter: _profile, twitter_handle: screen_name, props: {request_headers: req.headers, ip: req.ip}}});
                done(null, user);
            }

        })
    );
}

passport.use('email-direct', new CustomStrategy(async (req, done) => {
    let user = await user_queries.get_user_by_email({email: req.body.email});
    return done(null, user);
}));

passport.use('handle-direct', new CustomStrategy(async (req, done) => {
    let user = await user_queries.get_user_by_handle_and_password({handle: req.body.handle, password: req.body.password});
    return done(null, user);
}));


router.post('/api/auth/email', async(req, res, next) => {
    // NEEDS TO CHECK PASSWORD ON PROD
    
    passport.authenticate('email-direct', (error, user, info) => {
        req.login(user, {}, function(err) {
            res.json({user});
        });
    })(req, res, next);
});

router.post('/api/auth/handle', async(req, res, next) => {
    passport.authenticate('handle-direct', (error, user, info) => {
        req.login(user, {}, function(err) {
            res.json({user});
        });
    })(req, res, next);
});

router.get('/api/auth/twitter', async(req, res, next) => {
    const redirect = req.query.redirect;
    req.session.returnTo = redirect;
    next();
}, passport.authenticate('twitter', {successReturnToOrRedirect: '/'}));

router.get('/api/auth/twitter_callback', passport.authenticate('twitter', { failureRedirect: '/login' }), async(req, res) => {
    let redirect = req.session.returnTo;

    return res.redirect(redirect);
    //return res.send(JSON.stringify({ok: true, user: req.user, }, null, 4));
});


export default router;