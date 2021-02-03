	module.exports = {
	  servers: {
	    one: {
	      // TODO: set host address, username, and authentication method
	      host: '54.252.248.27',  //the IPv4 Public IP address for the AWS VM
	      username: 'ubuntu',  //default username for an AWS VM
	      pem: 'JuryRoomAWSKey.pem'  //this is the relative path to the pem file for AWS. It's currently in the app-dempy folder which is were we are working from
	      // password: 'server-password'
	      // or neither for authenticate from ssh-agent
	    }
	  },
	
	  app: {
	    // TODO: change app name and path
	    name: 'juryroom',  //app name
	    path: '..', //this is the relative path to the app project folder. We are inside the project dir so this is just up one level.
	
	    servers: {
	      one: {},
	    },
	
	    buildOptions: {
	      serverOnly: true,
	    },
	
	    env: {
		  // specify the port for NGINX, not working for ips outside of my own it seems like.		
		  // PORT: 3000,
	      // TODO: Change to your app's url
	      // If you are using ssl, it needs to start with https://
	      ROOT_URL: 'https://huriwhakatau.com',  //I used the public IP with http:// prepended. Not sure if that's right but its working
		  MONGO_URL: 'mongodb+srv://juryroom_admin:zYfxFoxfonx9F9ey@cluster0.ar8ij.azure.mongodb.net/juryroom?retryWrites=true',  //the connection url for the mongdb as specified by  the atlas page: https://cloud.mongodb.com/v2/5f1cc6142cf6153cab37b71c#clusters/commandLineTools/Cluster0
		  MAIL_URL: 'smtps://huriwhakatau%40gmail.com:huriwhakataujuryroom@smtp.gmail.com:465/',
	    },
	
	    docker: {
	      // abernix/meteord:node-12-base works with Meteor 1.9 - 1.10
	      // If you are using a different version of Meteor,
	      // refer to the docs for the correct image to use.
	      image: 'abernix/meteord:node-12-base',
	    },
	
	    // Show progress bar while uploading bundle to server
	    // You might need to disable it on CI servers
	    enableUploadProgressBar: true
	  },
	
	  // (Optional) Use the proxy to setup ssl or to route requests to the
      // correct app when there are several apps
	  proxy: {
	    domains: 'huriwhakatau.com,www.huriwhakatau.com',
	
	    ssl: {
	      // Enable Let's Encrypt
	      letsEncryptEmail: 'huriwhakatau@gmail.com',
	      forceSSL: true
	    }
	  }
	};
