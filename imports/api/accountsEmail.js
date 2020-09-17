Accounts.emailTemplates.siteName = "JuryRoom";
Accounts.emailTemplates.from = "JuryRoom <no-reply@juryroom.com>";
//todo, the base url is hard coded ie "localhost:3000. need to set this as env
// variable per inspiring code from here: https://forums.meteor.com/t/custom-enrollaccount/17102/2
Accounts.emailTemplates.enrollAccount = {
    subject(user) {
        return "Huri Whakatau Invite";
    },
    text(user, url) {
        const id = url.substring(url.lastIndexOf('/') + 1);
        return `Hi, you've been invited to participate in Huri Whakatau, 
Click the link below to get started.
${process.env.ROOT_URL}/enroll-account/${id}

please use username: ${user.username}
If you didn't request this email, please ignore it.
Thanks,
`
    },
    html(user, url) {
        // This is where HTML email content would go. may need to create a component to go here
        `</p>Hi, you've been invited to participate in Huri Whakatau, 
Click the link below to get started.
${process.env.ROOT_URL}/enroll-account/${id}

please use username: ${user.username}
If you didn't request this email, please ignore it.
Thanks,</p>
`
    }
};
