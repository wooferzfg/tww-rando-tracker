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

function applyflags() {
	var decodeddata = atob(document.getElementById('flags').value);
	var bits = '';

	while (decodeddata.charCodeAt(0) != 0 && decodeddata.length > 0) {
		//version
		decodeddata = decodeddata.substring(1);
	}

	if (decodeddata.length > 0) {
		decodeddata = decodeddata.substring(1);
	}

	while (decodeddata.charCodeAt(0) != 0 && decodeddata.length > 0) {
		//seed
		decodeddata = decodeddata.substring(1);
	}

	if (decodeddata.length > 0) {
		decodeddata = decodeddata.substring(1);
		bits = decodeddata;

		var flags = bits.charCodeAt(0);
		parseFlags(flags, ['dungeons', 'great_fairies', 'puzzle_secret_caves', 'combat_secret_caves', 'short_sidequests', 'long_sidequests', 'spoils_trading', 'minigames']);
		flags = bits.charCodeAt(1);
		parseFlags(flags, ['free_gifts', 'mail', 'platforms_rafts', 'submarines', 'eye_reef_chests', 'big_octos_gunboats', 'triforce_charts', 'treasure_charts']);
		flags = bits.charCodeAt(2);
		parseFlags(flags, ['expensive_purchases', 'misc', 'key_lunacy', 'randomize_dungeon_entrances', '', '', '', '']);
	}
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

function loadMostRecent() {
	var flagStr = getFlagString();
	var version = localStorage.getItem("version");
	var versionStr = '';
	if (version) {
		versionStr = '&v=' + version;
	}

	//Chrome defaults
	var h = 455;
	var w = 1320;

	open('tracker.html?f=' + flagStr + '&p=1' + versionStr,
		'',
		'width=' + w + ',height=' + h + ',titlebar=0,menubar=0,toolbar=0,scrollbars=0,resizable=0');
}

function launch() {
	var flagStr = getFlagString();

	//Chrome defaults
	var h = 455;
	var w = 1320;

	open('tracker.html?f=' + flagStr + '&p=0',
		'',
		'width=' + w + ',height=' + h + ',titlebar=0,menubar=0,toolbar=0,scrollbars=0,resizable=0');
}
