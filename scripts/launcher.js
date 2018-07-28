var currentVersion = "1.2.0";

function parseFlags(flags, ids) {
	var curVal = 128;
	var i = 7;
	while (curVal >= 1) {
		var element = document.getElementById(ids[i])
		if (flags >= curVal) {
			if (element) {
				element.checked = true;
			}
			flags = flags - curVal;
		} else if (element) {
			element.checked = false;
		}
		i--;
		curVal /= 2;
	}
}

function applyflags(element) {
	try {
		var decodedData = atob(document.getElementById('flags').value);
		var version = '';
		var bits = '';

		while (decodedData.charCodeAt(0) != 0 && decodedData.length > 0) {
			version += decodedData[0];
			decodedData = decodedData.substring(1);
		}

		if (/^[0-9.]+$/.test(version) && version != currentVersion) {
			showBrokenPermalink(element, true);
			return;
		}

		if (decodedData.length > 0) {
			decodedData = decodedData.substring(1); // space between version and seed
		}

		while (decodedData.charCodeAt(0) != 0 && decodedData.length > 0) {
			decodedData = decodedData.substring(1); // seed
		}

		if (decodedData.length > 0) {
			decodedData = decodedData.substring(1); // space between seed and flags
			bits = decodedData;

			var flags = bits.charCodeAt(0);
			parseFlags(flags, ['dungeons', 'great_fairies', 'puzzle_secret_caves', 'combat_secret_caves', 'short_sidequests', 'long_sidequests', 'spoils_trading', 'minigames']);
			flags = bits.charCodeAt(1);
			parseFlags(flags, ['free_gifts', 'mail', 'platforms_rafts', 'submarines', 'eye_reef_chests', 'big_octos_gunboats', 'triforce_charts', 'treasure_charts']);
			flags = bits.charCodeAt(2);
			parseFlags(flags, ['expensive_purchases', 'misc', 'key_lunacy', 'randomize_dungeon_entrances', '', '', '', '']);

			$(element).notify("Flags applied.", {
				autoHideDelay: 5000,
				className: "success",
				position: "top left"
			});
		} else {
			showBrokenPermalink(element, false);
		}
	}
	catch {
		showBrokenPermalink(element, false);
	}
}

function showBrokenPermalink(element, wrongVersion) {
	if (wrongVersion) {
		var notificationMessage = "Flags could not be applied for Wind Waker Randomizer " + currentVersion + ".";
	} else {
		var notificationMessage = "Flags could not be applied.";
	}
	$(element).notify(notificationMessage, {
		autoHideDelay: 5000,
		className: "error",
		position: "top left"
	});
}

function getFlagString() {
	var flagNames = ['D', 'GF', 'PSC', 'CSC', 'SSQ', 'LSQ', 'ST', 'MG', 'FG', 'MAI', 'PR', 'SUB', 'ERC', 'BOG', 'TRI', 'TRE', 'EP', 'MIS', 'KL', 'RDE'];
	var buttonNames = ['dungeons', 'great_fairies', 'puzzle_secret_caves', 'combat_secret_caves', 'short_sidequests', 'long_sidequests', 'spoils_trading', 'minigames',
		'free_gifts', 'mail', 'platforms_rafts', 'submarines', 'eye_reef_chests', 'big_octos_gunboats', 'triforce_charts', 'treasure_charts',
		'expensive_purchases', 'misc', 'key_lunacy', 'randomize_dungeon_entrances'];

	var result = '';
	for (var i = 0; i < buttonNames.length; i++) {
		var curButton = buttonNames[i];
		var curFlag = flagNames[i];
		if (document.getElementById(curButton).checked) {
			result += curFlag + '1';
		} else {
			result += curFlag + '0';
		}
	}
	return result;
}

function openTracker(loadProgress) {
	var flagStr = getFlagString();
	var progressStr = '0';
	var versionStr = currentVersion;
	if (loadProgress) {
		var storedVersion = localStorage.getItem("version");
		if (storedVersion) {
			versionStr = storedVersion;
		}
		progressStr = '1';
	}

	//Chrome defaults
	var h = 455;
	var w = 1320;

	open('tracker.html?f=' + flagStr + '&p=' + progressStr + '&v=' + versionStr,
		'',
		'width=' + w + ',height=' + h + ',titlebar=0,menubar=0,toolbar=0,scrollbars=0,resizable=0');
}

function loadMostRecent() {
	openTracker(true);
}

function launch() {
	openTracker(false);
}
