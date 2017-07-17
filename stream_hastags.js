/**
 * Created by ag913 on 4/8/2017.
 */
var Twit = require('twit');
var config = require('./config');
var util = require('./util');
var cluster = require('cluster');
var fs = require('fs');
var path = require('path');

var numCPUs = 4;

var T = new Twit(config);

var array=["djritzyuyo2ekomix","qanda","2017ss","fpjapunangharapan","voteforexoth","tenshino3p","rtl","asiaprogress","yugbam","at_x","oto2","bladerunner2049","alaire","izmiresc","askmaris","izmirecort","jodohwasiatbapak90","teammaymay","bbcdp","primenews","npwl","ihdconfessions","trendsonsocmed","ohmpawat","kavinkvp","mvrkatotohanan","buenlunes","preseason","ajiradigital","idmulingpagkikita",
           "horacero","2pm","tvasahi","share","choicesummersong","junho","morningjoe","markbam","boomkrittapak","careerarc"];

var hashTagArray=array.map(function(x){ return x.toUpperCase() });

var stream = T.stream('statuses/filter', { track: [array] });

var filePath = 'C:\\trending_hashtags_20170716\\hastag_tweets_20170716.txt';

var fileStream = fs.createWriteStream(filePath, {flags:'a'});

function exitHandler(options, err) {
	
    if (options.cleanup) console.log('clean');
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
    if (fileStream) {fileStream.end();}
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
	    	
	    	var hashtags = null;
	    	if(tweet.entities.hashtags){
	    		
	    		hashtags = tweet.entities.hashtags;
	    	}
	    	
	    	var twitterDate = util.isoStringToDate(tweet.created_at);
	    	var d = new Date(twitterDate);
	    	console.log(d);
	    	    	  	
	    	var tagStr = "[";
	    	
	    	if(hashtags && hashtags.length >=1){
	    		
	    		for(var i=0;i<hashtags.length;i++){
		    		
		    		if(hashTagArray.includes(hashtags[i].text.toUpperCase())){
		    			
			    		tagStr+=("#"+hashtags[i].text.toUpperCase()+",");
		    		}
		    	}
	    	}
	    	
	    	if(tagStr.length>1){
	    		
	    		tagStr=tagStr.substring(0, tagStr.length-1);
	    	}
	    	
	    	tagStr+="]";
	    	
	    	if(tagStr != '[]'){
	    		
	    		console.log(tagStr);
	    		fileStream.write(tweet.user.screen_name  + ' '+tagStr+' '+twitterDate + "\n");
	    	}
	    })
	}




