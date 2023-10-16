exports.generateOtp = async () => {
try{
    let otp = process.env.NODE_ENV === "production"
    ? Math.floor(1000 + Math.random() * 9000)
    : "9999";
}catch(err){
    console.log(err.message)
    throw err
}
}