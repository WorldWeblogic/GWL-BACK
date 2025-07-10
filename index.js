const express = require("express")
const app = express();
const cors = require('cors')
const database = require("./config/database")
const cookieParser = require('cookie-parser')
const userRoutes = require('./routes/route');
const errorMiddleware = require("./middleware/error-middleware");
const path = require("path");
// port connection
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database.connect();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())



const allowedOrigins = [
  'https://gwl-front.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true // only if you're using cookies or sessions,
};

app.use(cors(corsOptions));
// app.options('*',cors(corsOptions));

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: 'Your server is up and running....'
  });
});



app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use(errorMiddleware);
app.use('/api', userRoutes);


// port connection
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})