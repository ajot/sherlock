'use strict';
var Alexa = require('alexa-sdk'); // import the library
var appId = ''; //'amzn1.echo-sdk-ams.app.your-skill-id';
var data = require('./datafiles/dataset.js');

var states = {
    SEARCHMODE: '_SEARCHMODE',
    DESCRIPTION: '_DESCRIPTION',
};

// Skills name
var skillName = "Evangelist Finder:";

// Message when the skill is first called
var welcomeMessage = "Welcome to Sherlock - the Alexa evangelist finder. I can help you find more information about an Alexa Evangelist and Solutions Architects. Just say the first name of the person you would like to find info for, like who is Dave, or who is Paul";

// Message when the skill is first called
var newSearchMessage = "Just say the first name of the person you would like to find, like who is paul, or find jeff";

// Message for help intent
var HelpMessage = "Here are some things you can say: Who is Dave? or tell me more about Dave";

var descriptionStateHelpMessage = "Here are some things you can say: Tell me more, or give me his contact info";

// Used when there is no data within a time period
var NoDataMessage = "Sorry, I didn't find that.";

// Used to tell user skill is closing
var shutdownMessage = "Ok see you again soon.";

// Used with stop and cancel intents
var killSkillMessage = "Ok, great, see you next time.";

var output = "";

exports.handler = function(event,context,callback){
	var alexa = Alexa.handler(event,context);
	alexa.appId = appId;
	// alexa.registerHandlers(handlers);
	alexa.registerHandlers(newSessionHandlers, startSearchHandlers, descriptionHandlers);
	alexa.execute();
}

var newSessionHandlers = {
    'LaunchRequest': function () {
        this.handler.state = states.SEARCHMODE;
        this.emit(':ask', welcomeMessage, welcomeMessage);
    },
};

var startSearchHandlers = Alexa.CreateStateHandler(states.SEARCHMODE, {
	'AMAZON.YesIntent': function () {
        output = newSearchMessage;
        this.emit(':ask', output, newSearchMessage);
    },
	'AMAZON.NoIntent': function () {
        this.emit(':tell', shutdownMessage);
	    },
	'AMAZON.RepeatIntent': function () {
         this.emit(':ask', output, HelpMessage);
     },
	 'SearchIntent':function(){
			var contactNameSlot = this.event.request.intent.slots.contactName;
			var speechOutput;
			var cardTitle;
			var cardContent;

			console.log("contactNameSlot:" + contactNameSlot);

			if (contactNameSlot && contactNameSlot.value) { //checking if the slot key and value exist
				var name = contactNameSlot.value.toLowerCase();
				var searchResult = searchByFirstName(name);
				this.attributes['currentContact'] = searchResult;
				speechOutput = searchResult.message;

				if (searchResult.matchFound == true){ //if match found
					console.log(speechOutput);
					speechOutput = searchResult.message + ". To learn more about, " + name + " you can say tell me more"
					this.handler.state = states.DESCRIPTION; // change state to description
					this.emit(':ask', speechOutput);
					this.attributes['endedSessionCount'] += 1;
				}
				else{ // no match found
					console.log("Sorry, no match found.");
					this.emit(':ask', speechOutput);
				}
			 }
		},
		'AMAZON.HelpIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, output);
    },
		'AMAZON.StopIntent': function () {
        this.emit(':tell', killSkillMessage);
    },

    'AMAZON.CancelIntent': function () {
        this.emit(':tell', killSkillMessage);
    },

    'SessionEndedRequest': function () {
        this.emit('AMAZON.StopIntent');
    },

    'Unhandled': function () {
				console.log("Unhandled intent in SEARCH state handler");
        this.emit(':ask', HelpMessage, HelpMessage);
    }
});

var descriptionHandlers = Alexa.CreateStateHandler(states.DESCRIPTION, {
	'TellMeMoreIntent': function() {
			var sessionObject = this.attributes.currentContact.theContact;
			var sessionFirstName = sessionObject["fname"];
			var sessionLastName = sessionObject["lname"];
			var sessionTwitter = sessionObject["twitter"];
			var sessionPrettyTwitter = sessionObject["prettyTwitter"];
			var cardTitle = 'Contact Info for ' + helper.titleCase(sessionFirstName) + " " + helper.titleCase(sessionLastName);

      //creating card content that will be sent to the Alexa app.
			var cardContent =
					helper.titleCase(sessionObject["fname"]) + " " + helper.titleCase(sessionObject["lname"]) + " \n"
					+ "Twitter: " + "@" + sessionObject["twitter"] + " \n"
					+ "GitHub: " + sessionObject["github"] + " \n"
					+ "LinkedIn: " + sessionObject["linkedin"];

			var speechOutput = (sessionFirstName + "'s Twitter handle is " + sessionPrettyTwitter
        + ". That's spelled - " + helper.spellOut(sessionTwitter)
        + ". You can check the Alexa companion app for Jeff'e contact info, like LinkedIn, GitHub and Twitter handle. Would you like to find another evangelist? Say yes or no");
			var repromptSpeech = "Would you like find another evangelist? Say yes or no";
			console.log("the contact you're trying to find more info about is " + sessionFirstName);
			this.handler.state = states.SEARCHMODE;
			this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent);
	},
	'AMAZON.HelpIntent': function () {
      this.emit(':ask', descriptionStateHelpMessage, descriptionStateHelpMessage);
    },
	'AMAZON.StopIntent': function () {
	        this.emit(':tell', killSkillMessage);
	  },
	'AMAZON.CancelIntent': function () {
	        this.emit(':tell', killSkillMessage);
	  },
	'AMAZON.NoIntent': function () {
      this.emit(':tell', shutdownMessage);
  	},
	'AMAZON.YesIntent': function () {
		this.emit("TellMeMoreIntent");
		},
	'SessionEndedRequest': function () {
	  this.emit('AMAZON.StopIntent');
  	},
  'Unhandled': function () {
			console.log("Unhandled intent in DESCRIPTION state handler");
      this.emit(':ask', HelpMessage, HelpMessage);
  	}
});

function searchByFirstName(name){
	var matchFound = false;
	var message;
	console.log("beginning search");
	for(var i = 0; i < data.length && (!matchFound);i++){
		console.log(i + ". Comparing " + name.toLowerCase() + " and " + data[i].fname);
		if (name.toLowerCase() == data[i].fname){
			matchFound = true;
			console.log("Found in " + (i+1) + " rounds");
			message = (data[i].fname + " " + data[i].lname + " " + data[i].bio + " based out of " + data[i].city);
			break; //if found, break out of the for loop.
		}
	}

	if (matchFound == false){
		message = "Sorry. No match found. You can ask me, who is Dave?";
	}

	return {
		message: message,
		matchFound: matchFound,
		theContact: data[i]
	}
}

// --------------- Helper Functions  -----------------------

var helper = {
	titleCase: function (str){
  	return str.replace(str[0],str[0].toUpperCase());
	},
	spellOut: function (str){
	  return str.split('').join('<break time="0.05s"/>');
	}
};
