exports.action = function(data, callback, config, SARAH) {
	var appleTvKeys = {
		'Menu' : 1,
		'H_Menu' : 2,
		'Up' : 3,
		'Down' : 4,
		'Select' : 5,
		'Left' : 6,
		'Right' : 7,
		'Play_Pause' : 10,
		'Pause' : 15,
		'Play' : 16,
		'Stop' : 17,
		'Forward' : 18,
		'Rewind' : 19,
		'S_Forward' : 20,
		'S_Backwards' : 21,
		'H_Select' : 22
	};
	var appleTvCommands = {
		'Sleep' : 'sleep=1',
		'Wake' : 'wake=1'
	};
	var appleTvPlugins = {
		'YouTube' : 'internet-youtube',
		'XBMC' : 'com.apple.frontrow.appliance.xbmc',
		'Photo' : 'photo-stream',
		'Settings' : 'com.apple.frontrow.appliance.settings'
	};
	var url = "";
	var repeat = 1;
	var rawConfig = config;
	config = config.modules.appletv;

	if (!config.ip_appletv) {
	  console.log("Missing AppleTv @ip configuration");
	  callback({'tts': "Je n'ai pas trouvé d'apeule tévé de configurée"});
	  return;
	}
 
    // Take action...
	if (data.key) {
	  	url = 'http://' + config.ip_appletv + '/remoteAction=' + appleTvKeys[data.key];		
	}
	if (data.cmd) {
		url = 'http://' + config.ip_appletv + '/' + appleTvCommands[data.cmd];
	}
	if (data.plugin) {
		url = 'http://' + config.ip_appletv + '/plugin=' + appleTvPlugins[data.plugin];		
	}
	
	if (data.repeat) {
		repeat = data.repeat;
	}
    
	sendRequest(function (status) {
					if (status == 'error') {
						callback({'tts' : "Erreur de communication avec l'appeule tévé"})
					} else {
						callback({'tts' : "commande effectué"})
					}
				}, url, repeat);

}

function sendRequest(callback, url, repeat) {
	var request = require('request');
	console.log(repeat + ' x ' + url);
	// Sending X-1 requests...
	for(var i = 0 ; i < repeat-1 ; i++) {
		request({
	          		url : url
	      		}, function (err, response, body){
					if (err || response.statusCode != 200) {
						// Error detected, giving up...
						callback('error');
						return;
					}
		});
	}
	// Sending the last request...
	request({
          		url : url
      		}, function (err, response, body){
				if (err || response.statusCode != 200) {
					// Error detected, giving up...
					callback('error');
					return;
				}
				callback(body);
	});
}