const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null),
        locality: Joi.string().allow("", null),
        area: Joi.number().min(0).allow("", null),
        propertyType: Joi.string().valid("apartment", "house", "villa", "plot", "commercial", "pg", "other").allow("", null),
        bedrooms: Joi.number().min(0).allow("", null),
        bathrooms: Joi.number().min(0).allow("", null),
        category: Joi.string().allow("", null)
    }).required()
});

module.exports.reviewSchema =Joi.object({
    review:Joi.object({
        rating: 
        Joi.number().required().min(1).max(5),
        comment: 
        Joi.string().required(),
    }).required(),
});