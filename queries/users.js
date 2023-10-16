const userModel = require('../models/User');


exports.userStatus = async (userId) => {
    try{
        let user_res = await userModel.findOne({_id:userId});
        if(user_res){
            return true;
        }else{
            return false;
        }
    }catch(err){
        console.log(err.message)
        throw err
    }
}


exports.findUserWithMobileOrEmail = async (email,mobile) => {  
    try{
        let user_res = await userModel.findAll({$or:[{email:email},{mobile:mobile}]});
        return user_res;
    }catch(err){
        console.log(err.message)
        throw err
    }
}

exports.insertUser = async (data) => {
    try{
            let res = await userModel.create(data);
            return res;

    }catch(err){
        console.log(err.message)
        throw err
    }
}

exports.findUsersByEmail = async (email) => { 
    try{
        let user_res = await userModel.findOne({email:email});
        return user_res;

    }catch(err){
        console.log(err.message)    
        throw err
    }
}