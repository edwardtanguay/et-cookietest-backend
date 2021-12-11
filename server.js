import express from 'express'
import cors from "cors"
import morgan from 'morgan'
import session from 'express-session';
const app = express();

app.use(morgan("dev")) // log all calls to our API to console...

app.set('trust proxy', 1); // trust Heroku proxy to set / forward secure cookies 

app.use(cors({
	origin: process.env.FRONTEND_ORIGIN,
	credentials: true // accept incoming cookies
}))

// app.use(
// 	session({
// 		name: 'sessId',
// 		secret: 'h$lYS$cr§t!',
// 		resave: false,
// 		saveUninitialized: true,
// 		cookie: {
// 			httpOnly: true,
// 			maxAge: 60*1000*30,
// 			sameSite: 'lax',
// 			secure: false
// 		}
// 	})
// );


// SESSION & COOKIE CONFIGURATION (for Heroku)
app.use( session({
  name: 'sessId',
  secret: 'h$lYS$cr§t!',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, // httpOnly => cookie can just be written by browser and not by Javascript code
    maxAge: 60*1000*30, // 30 minutes cookie lifetime
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // allow cookies transfer from OTHER origins / domains
    secure: process.env.NODE_ENV === "production" // will be set to true on heroku. allow cookies to be set just via HTTPS or trusted proxies
  }
}))

app.get('/', (req, res) => {
	res.json({ message: 'backend is running...' });
});

app.get('/login', (req, res) => {
	req.session.user = "Rob"
	req.session.status = "LoggedIn"
	res.json({
		message: "Logged in!"
	})
})

app.get('/stayloggedin', (req, res) => {
	res.json({
		message: `user should still be [Rob], user is [${req.session.user}]`
	})
});

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`API listening on http://localhost:${PORT}`);
});