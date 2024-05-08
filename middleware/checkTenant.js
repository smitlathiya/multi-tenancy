const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const { switchDB, getDBModel } = require("../config/switchDb");
const RootSchemas = new Map([['user', User]])
exports.isAuthenticated = async (req, res, next) => {
    try {
        const auth = req.headers['authorization'];
        const token = auth.replace("Bearer ", "")
        
        if (!token) {
            return res
            .status(403)
            .send({ message: "A token is required for authentication" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const rootDB = await switchDB('root', RootSchemas);
        const userModel = await getDBModel(rootDB, "user");
        
        const { id } = decoded;
        const user = await userModel.findById(id).select("tenant_id")
        
        req.user = id;
        req.tenantId = user.tenant_id
        next();
    } catch (error) {
        return res.status(500).send("You're Unauthorized")
    }
}