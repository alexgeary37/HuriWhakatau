Accounts.emailTemplates.siteName = "Huri Whakatau";
Accounts.emailTemplates.from = "HuriWhakatau <no-reply@huriwhakatau.com>";
// setting base url inspiring code from here: https://forums.meteor.com/t/custom-enrollaccount/17102/2
Accounts.emailTemplates.enrollAccount = {
    subject(user) {
        return "Huri Whakatau Sign-up";
    },
    text(user, url) {
        //id is the validation token generated by Meteor.
        // extracting this so that the return url can be dynamically generated depending on deployment environment
        const id = url.substring(url.lastIndexOf('/') + 1);
        return `Hi, you've been invited to participate in Huri Whakatau, 
            Click the link below to get started.
            ${process.env.ROOT_URL}enroll-account/${id}
            
            Please use username ${user.username} to complete your sign-up.
            
            Huri Whakatau is a prototype project of the University of Waikato. The information you provide by using the 
            site may be used in academic studies. If you are concerned about how your data may be used please 
            do not complete your enrollment at this time.
            
            When the project is more fully developed a comprehensive informed consent procedure will be implemented.
            
            If you did not request this email, please ignore it.
            Thank you.`
    },
    html(user, url) {
        // This is where HTML email content would go. may need to create a component to go here
        `</p></p>
`
    }
};
