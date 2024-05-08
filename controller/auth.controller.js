const User = require("../model/user.model")
const Tenant = require("../model/tenant.model")
const { switchDB, getDBModel } = require("../config/switchDb");
const jwt = require("jsonwebtoken")
const RootSchemas = new Map([['user', User], ['tenant', Tenant]])
// const TenantSchemas = new Map([['tenant', Tenant]])
exports.register = async (req, res) =>{
    try {
        const rootDB = await switchDB('root', RootSchemas);
        const userModel = await getDBModel(rootDB, "user");
        const tenantModel = await getDBModel(rootDB, "tenant");
        const {name, email, password} = req.body
        const isUserExist = await userModel.findOne({email: email})
        if(isUserExist){
            return res.status(403).send("user already exist");
        }
        const tenantId = email.split("@")[0] +"-"+ generateFourDigitNumber()
        
        const user = await userModel.create({name, email, password, tenant_id: tenantId})
        
        await tenantModel.create({tenant_id: tenantId})

        user.hashed_password = undefined;
        user.salt = undefined;

        return res.status(200).json({
            message: "user register",
            user: user
        })

    } catch (error) {
        return res.status(500).send("internal server error")
    }
}
exports.login = async (req, res) =>{
    try {
        const {email, password} = req.body;
        const rootDB = await switchDB('root', RootSchemas);
        const userModel = await getDBModel(rootDB, "user");
        if(!email || !password){
            return res.status(400).send("Send valid Data") 
        }
        const user = await userModel.findOne({ email });

        if (!user.authenticate(password)) {
            throw "Email or Password does not matched";
        }
        const loginToken = jwt.sign(
            {
              id: user._id
            },
            process.env.JWT_SECRET
        );
        user.hashed_password = undefined;
        user.salt = undefined;
        return res.status(200).send({
            message: "Logged in successfully",
            token: loginToken,
            user: user
        })
    } catch (error) {
        return res.status(500).send(error)
    }
}
function generateFourDigitNumber() {
    return Math.floor(1000 + Math.random() * 9000);
}
