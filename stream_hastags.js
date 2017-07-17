/**
 * Created by ag913 on 4/8/2017.
 */
var Twit = require('twit');
var config = require('./config');
var cluster = require('cluster');
var fs = require('fs');
var path = require('path');

var numCPUs = 4;

var T = new Twit(config);

var array=["conexionhonduras13","ancestralcode","team10","examellevaconariana","loveisiand","championsdinner","bbuk","losrules","shelleyhennig","forazericardo","dalebolso","theloch","preguntaquantum","psg","alexis","loveisland","indulgeafilmorsong","dodgerssweep","rainbow","leavecomments","videonuevodisplis","why","lalobritotrendy","dannapaola","blazblue","queen","bezretuszu","uswomensopen","isabellacastillo","libertad",
           "wimbeldon2017","sextape","poldark","u20f","veranomtv2017","ehs","vamostricolor","16jvzla","chicon","indyto"];

var hashTagArray=array.map(function(x){ return x.toUpperCase() });
//console.log(array);

var stream = T.stream('statuses/filter', { track: [array] });

var filePath = 'C:\\trending_hashtags_20170716\\hastag_tweets_20170716.txt';
//var stream = fs.createWriteStream("append.txt", {flags:'a'});
//var fd = fs.open(path.join('C:\trending_hashtags_20170716', 'hastag_tweets_20170716.txt'), 'a');
var fileStream = fs.createWriteStream(filePath, {flags:'a'});

function exitHandler(options, err) {
    if (options.cleanup) console.log('clean');
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
    if (fileStream) {fileStream.end();}
    //if (stream) {stream.end();}
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));


stream.on('disconnect', function (disconnectMessage) {
	  console.log(disconnectMessage);
})

	if (cluster.isMaster) {
	    for (var i = 0; i < numCPUs; i++) {
	        cluster.fork();
	    }
	} else {
	    stream.on('tweet', function (tweet) {
	    	//var str = ' (' + tweet.user.screen_name  + '   '+tweet.created_at+')';
	    	
	    	var hashtags = null;
	    	if(tweet.entities.hashtags){
	    		
	    		hashtags = tweet.entities.hashtags;
	    		console.log(hashtags);
	    	}
	    	    	  	
	    	//console.log(hashtags.length);
	    	console.log(tweet.text);
	    	var tagStr = "[";
	    	
	    	if(hashtags && hashtags.length >=1){
	    		
	    		for(var i=0;i<hashtags.length;i++){
		    		
		    		if(hashTagArray.includes(hashtags[i].text.toUpperCase())){
		    			
		    			console.log(hashtags[i].text);
			    		tagStr+=("#"+hashtags[i].text.toUpperCase()+",");
		    		}
		    		
		    	}
	    	}
	    	
	    	tagStr=tagStr.substring(0, tagStr.length-1);
	    	tagStr+="]";
	    	console.log("TAGS:  "+tagStr);
	        //console.log( ' (' + tweet.user.screen_name  + ' '+tweet.created_at+')');
	        fileStream.write(tweet.user.screen_name  + ' '+tagStr+' '+tweet.created_at + "\n");
	    })
	}




