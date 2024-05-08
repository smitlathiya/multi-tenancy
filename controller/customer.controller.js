const customer = require("../model/customer.model")
const { switchDB, getDBModel } = require("../config/switchDb");
const DbSchemas = new Map([['customer', customer]])
// const TenantSchemas = new Map([['tenant', Tenant]])
exports.addCustomer = async (req, res) =>{
    try {
        const customerDB = await switchDB(req.tenantId, DbSchemas);
        const customerModel = await getDBModel(customerDB, "customer");
        
        const customer = await customerModel.create({...req.body})

        return res.status(200).json({
            message: "customer save",
            customer: customer
        })

    } catch (error) {
        return res.status(500).send("internal server error")
    }
}
exports.getCustomer = async (req, res) =>{
    try {
        const customerDB = await switchDB(req.tenantId, DbSchemas);
        const customerModel = await getDBModel(customerDB, "customer");
        
        const customer = await customerModel.find()

        return res.status(200).json({
            message: "customer List",
            customer: customer
        })

    } catch (error) {
        return res.status(500).send("internal server error")
    }
}