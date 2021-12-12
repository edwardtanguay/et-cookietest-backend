import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import session from 'express-session';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

app.use(morgan("dev"));
app.set('trust proxy', 1);
app.use(cors({
	// origin: process.env.FRONTEND_ORIGIN,
	origin: ["http://et-cookietest-frontend.herokuapp.com","https://et-cookietest-frontend.herokuapp.com"],
	credentials: true
}));

app.use(cookieParser());
app.use(session({
	name: 'testsession',
	secret: 'h$lYS$cr§t!',
	resave: true,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		maxAge: 60 * 60 * 24,
		sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
		secure: process.env.NODE_ENV === "production"
	}
}))

app.get('/', (req, res) => {
	let user = req.session.user;
	if (!user) {
		res.json({ message: `${(new Date()).toISOString()}: nobody is logged in` })
	} else {
		res.json({ message: `${(new Date()).toISOString()}: ${user} is logged in` })
	}
});

app.get('/login', (req, res) => {
	req.session.user = "user001"
	res.json({
		message: `${(new Date()).toISOString()}: ${req.session.user} is now logged in`
	})
})

app.get('/logout', (req, res) => {
	req.session.destroy();
	res.json({ message: `${(new Date()).toISOString()}: user logged out` })
});

const PORT = process.env.PORT || 3011
app.listen(PORT, () => {
	console.log(`API listening on http://localhost:${PORT}`);
});