/**
 * New node file
 */


function isoStringToDate(s) {
	
	var createdAt = new Date(Date.parse(s.replace(/( \+)/, ' UTC$1')))
	var offset = createdAt.getTimezoneOffset() * 60 * 1000;
	var twitterDateWithOffset = createdAt.getTime() - offset;
	
	return twitterDateWithOffset;
}


module.exports.isoStringToDate = isoStringToDate;