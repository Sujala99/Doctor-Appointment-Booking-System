// const joi=require("joi");


// const customerSchema=joi.object({
//     full_name:joi.string().required(),
//     email:joi.string().required().email(),
//     contact_no:joi.string().required()
// })


// function CustomerValidation(req,res,next){
//     const {full_name,email,contact_no}=req.body;
//     const {error}=customerSchema.validate({full_name,email,contact_no})
//     if(error){
//      return res.json(error)
//     }
//     next()
// }


// module.exports=CustomerValidation;


const joi = require("joi");

const customerSchema = joi.object({
    full_name: joi.string().required(),
    email: joi.string().required().email(),
    contact_no: joi.string().required(),
});

function CustomerValidation(req, res, next) {
    const { full_name, email, contact_no } = req.body;
    const { error } = customerSchema.validate({ full_name, email, contact_no });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

module.exports = CustomerValidation;
