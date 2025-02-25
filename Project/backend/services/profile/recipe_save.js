require("dotenv").config();
const Recipe = require("../../models/Recipe");
const jwtt = require('jsonwebtoken');


const recipe_save = async (recipe, jwt) => {
    
    response = {
        message: "",
        success: false,
    }

    try {
        user_data = jwtt.decode(JSON.parse(jwt));

        const rec = new Recipe({ recipe: JSON.stringify(recipe), user_id: user_data.userId });
        await rec.save();

        response.message = "Succesfully saved";
        response.success = true;

        return response;

    } catch(err) {
        response.message = "Internal Error";
        console.log(err);
        
        return response
    }
}

module.exports = { recipe_save };