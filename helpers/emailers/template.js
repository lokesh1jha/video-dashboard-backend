exports.generateOtpHtmlBody = async (name,otp) => {
    return (
        `
        <html>
        <div>
          Hi ${name},<br/>
          <p>
          Your One Time Password is ${otp}
          <p/>
           <br/>
        </div>
        </html>
        `
    )
}