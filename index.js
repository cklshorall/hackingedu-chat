// variables that are used by the entire class
var peopleStates = {}
var numbers = ["+14125763782", "+15106219993", "+13254504371", "+15107538163", "+12173902292", "+15105841044"];


var express = require('express');
var app = express();
var accountSid = process.env.ACCOUNT_SID;
var authToken = process.env.AUTH_TOKEN_PRIMARY;
var bodyParser = require('body-parser');


var willing = [];
var needing = [];



console.log('YOYOYOY', accountSid, authToken);

var client = require('twilio')(accountSid, authToken);

// the code to send a text message

numbers.forEach(function(number){
    peopleStates[number] = {
        state: "nothing"
    }
    client.messages.create({
    body: 'Have you finished your homework? Y/N', 
    to: number,
    from:'+14125203533'
}, function(err, message) {
    console.error(err);
    console.log(message);
})

});


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieParser())

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.get('/', function(request, response) {
  response.send(process.env.ACCOUNT_SID)
});

app.get('/cool', function(request, response) {
  response.send(cool());
});


app.post('/', function(req, res) {
    var twilio = require('twilio');
    var twiml = new twilio.TwimlResponse();
    var from = req.body.From;

 
    console.log(req.body.Body, peopleStates[from]["state"]);
    if (req.body.Body == 'Y' && peopleStates[from]["state"] == "nothing") {
        twiml.message('Do you want to help a classmate? Y/N');
        peopleStates[from]["state"] = "asked question 1";
    }
    else if(req.body.Body == 'Y' && peopleStates[from]["state"] == "asked question 1") {
        twiml.message('Thanks. Please stand by!');
        peopleStates[from]["state"] = "asked question 2";
        //peopleStates[from]["state"].forEach(function())
        console.log(from);

        if (willing.indexOf(from) == -1) {
            willing.push(from); // helpers is the array of tutors.
        }

        console.log(willing);
        matching();


    }
    else if(req.body.Body == 'N' && peopleStates[from]["state"] == "asked question 1") {
        twiml.message('Thanks. Just to let you know, you have missed out on an amazing extra credit opportunity.');
        peopleStates[from]["state"] = "asked question 2";
    } 
    else if(req.body.Body == 'N' && peopleStates[from]["state"] == "nothing") {
        twiml.message('Do you need help? Y/N');
        peopleStates[from]["state"] = "asked question 1b"
    } 
    else if(req.body.Body == 'Y' && peopleStates[from]["state"] == "asked question 1b") {
        twiml.message('A classmate is on their way to help you.');
        peopleStates[from]["state"] = "asked question 2b";
        console.log(from);

        if (needing.indexOf(from) == -1) {
            needing.push(from);
        }

        console.log(needing);
        matching();

    } 
    else if(req.body.Body == 'N' && peopleStates[from]["state"] == "asked question 1b") {
        twiml.message('We\'ll get back to you in an hour.');
        peopleStates[from]["state"] = "asked question 2b"
    } 
    else if(req.body.Body == 'N' && peopleStates[from]["state"] == "asked question 2")
    {

    }
    else {
        twiml.message('Please respond Y or N');
    }
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
});



function matching() {
    console.log('inside matching')
    console.log(willing);
    console.log(needing);
    
    var hangouts = ['https://hangouts.google.com/call/2wcdvtgmg33ijmhv53ummfarlma', 'https://hangouts.google.com/call/dt2hzy6x2y4d6m7435xeoxaxuia', 'https://hangouts.google.com/call/ditjqt7ntgavboxf2wgpxe5scaa', 'https://hangouts.google.com/call/dnpioyrybkvdvbejhgopuspydua']

    if (willing.length && needing.length) {
        console.log('inside matching if')
        client.messages.create({
        body: 'https://hangouts.google.com/call/2wcdvtgmg33ijmhv53ummfarlma', 
        to: willing[0],
        from:'+14125203533', 
    },
        function(err, message) {
        console.error(err);
        console.log(message);
})
        client.messages.create({
        body: 'https://hangouts.google.com/call/2wcdvtgmg33ijmhv53ummfarlma', 
        to: needing[0],
        from:'+14125203533', 
    },
        function(err, message) {
        console.error(err);
        console.log(message);
})
        needing.splice(0,1);
        willing.splice(0,1);
    }

}

function repeat() {
    
}




app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


