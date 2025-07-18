const express = require("express")
const app = express()

const cookieParser = require("cookie-parser")
const cors = require("cors")
const userRoutes = require("./routes/user.routes")
const cafeRoutes = require("./routes/cafe.routes")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:8080",
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
}))


app.use("/api/users", userRoutes)
app.use("/api/dashboard", cafeRoutes)

module.exports = app