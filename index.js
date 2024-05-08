const express = require("express")
const dotEnv = require("dotenv")
const app = express();
const authRoutes = require("./route/auth.route")
const customerRoutes = require("./route/customer.route");
const { isAuthenticated } = require("./middleware/checkTenant");
dotEnv.config()
app.use(express.json())
const port = process.env.PORT

app.use("/auth", authRoutes)

app.use("/customer",isAuthenticated, customerRoutes)

app.listen(port, () => {
    console.log("API Port:", port)
})