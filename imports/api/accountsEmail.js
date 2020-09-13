Accounts.emailTemplates.siteName = "JuryRoom";
Accounts.emailTemplates.from = "JuryRoom <no-reply@juryroom.com>";
//todo, the base url is hard coded ie "localhost:3000. need to set this as env
// variable per inspiring code from here: https://forums.meteor.com/t/custom-enrollaccount/17102/2
Accounts.emailTemplates.enrollAccount = {
    subject(user) {
        return "JuryRoom Invite";
    },
    text(user, url) {
        const id = url.substring(url.lastIndexOf('/') + 1);
        return `Hi, you've been invited to participate in JuryRoom, 
Click the link below to get started.
${process.env.BASE_URL}/enroll-account/${id}
http://localhost:3000/enroll-account/${id}

please use username: ${user.username}
If you didn't request this email, please ignore it.
Thanks,
`
    },
    html(user, url) {
        // This is where HTML email content would go.
        // See the section about html emails below.
        `</p>Hi, you've been invited to participate in JuryRoom, 
Click the link below to get started.
${url}

please use username: ${user.username}
If you didn't request this email, please ignore it.
Thanks,</p>
`
    }
};

// Accounts.emailTemplates.enrollAccount.text = function(user, url) {
//     var id = url.substring(url.lastIndexOf('/') + 1)
//     return `Click this link to set your password and
//     start using the service: ${process.env.BASE_URL}/enroll-account/${id}`
// }
