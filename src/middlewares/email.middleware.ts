import nodemailer from 'nodemailer';

const mailSender = async (emailAddress:string, userName:string, randomPassword:any) => {
  console.log(emailAddress, userName);

  // 1. create an email transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nagdaneha97@gmail.com',
      pass: 'yete ksxe jsem cjvf',
    },
  });

  // 2. declare email content
  const mailOptions = {
    from: 'nagdaneha97@gmail.com',
    to: emailAddress,
    subject: 'login with this temporary password',
    text:
    `Hello ${userName}, restore your account with this temporary password (${randomPassword}), 
    and then choose password of your choice once you sign in`,
  };

  // 3. Send email
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export default mailSender;
