const nodemailer = require('nodemailer');

const createHtml = randomNumber => 
    `<div style="font-family: 'Apple SD Gothic Neo', 'sans-serif' !important; width: 540px; height: 600px; border-top: 4px solid {$point_color}; margin: 100px auto; padding: 30px 0; box-sizing: border-box;">\
        <h1 style="margin: 0; padding: 0 5px; font-size: 28px; font-weight: 400;">\
            <span style="font-size: 15px; margin: 0 0 10px 3px;"></span><br />\
            <span style="color: {$point_color};">이메일 인증</span> 안내입니다.\
        </h1>\
        <p style="font-size: 16px; line-height: 26px; margin-top: 50px; padding: 0 5px;">\
            안녕하세요.<br />\
            요청하신 이메일 인증번호가 전달되었습니다.<br />\
        </p>\
        <p style="font-size: 16px; margin: 40px 5px 20px; line-height: 28px;">\
            이메일 인증번호: <br />\
            <span style="font-size: 24px;">${randomNumber}</span>\
        </p>\
        <a style="color: #FFF; text-decoration: none; text-align: center;" href="{$find_url}" target="_blank"><p style="display: inline-block; width: 210px; height: 45px; margin: 30px 5px 40px; background: {$point_color}; line-height: 45px; vertical-align: middle; font-size: 16px;">생성 확인</p></a>\
    </div>`

    
module.exports = async function mailAuth(receiverEmail, randomNumber) {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: `${process.env.GMAIL_ID}`,
            pass: `${process.env.GMAIL_PW}`
        }
    });

    let info = await transporter.sendMail({
        from: '"Team_5689" <1891179@hansung.ac.kr>',
        to: receiverEmail,
        subject: "인증 메일입니다",
        html: createHtml(randomNumber)
    });

}