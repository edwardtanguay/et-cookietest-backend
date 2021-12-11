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
	origin: process.env.FRONTEND_ORIGIN,
	credentials: true
}));

app.use(cookieParser());
app.use( session({
  name: 'testsession',
  secret: 'h$lYS$cr§t!',
  resave: true,
  saveUninitialized: true,
  cookie: {
//     httpOnly: true,
//     maxAge: 60*60*24,
//     sameSite: "lax", // process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: false 
  }
}))

app.get('/', (req, res) => {
	const body = { message: `${(new Date()).toISOString()}: backend is running...` };
	console.log(body);
	res.json(body);
});

app.get('/login', (req, res) => {
	req.session.user = "user001"
	res.json({
		message: `${(new Date()).toISOString()}: user logged in`
	})
})

app.get('/stayloggedin', (req, res) => {
	res.json({
		message: `${(new Date()).toISOString()}: user should still be [user011], user is [${req.session.user}]`
	})
});

const PORT = process.env.PORT || 3011 
app.listen(PORT, () => {
	console.log(`API listening on http://localhost:${PORT}`);
});