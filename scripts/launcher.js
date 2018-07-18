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
		parseFlags(flags, ['expensive_purchases', 'misc', '', 'randomize_dungeon_entrances', '', '', '', '']);
	}
}

function getFlagString() {
	var dflag = 'D0';
	var scflag = 'SC0';
	var sqflag = 'SQ0';
	var mflag = 'M0';
	var lrflag = 'LR0';
	var sflag = 'S0';
	var eflag = 'ER0';
	var bflag = 'B0';
	var striflag = 'STRI0';
	var streflag = 'STRE0';
	var gflag = 'G0';
	var maflag = 'MA0';
	var epflag = 'EP0';
	var evflag = 'EV0';
	var entryflag = 'ENTRY0';

	if (document.getElementById('dswitch').checked) {
		dflag = 'D1';
	}

	if (document.getElementById('scswitch').checked) {
		scflag = 'SC1';
	}

	if (document.getElementById('sqswitch').checked) {
		sqflag = 'SQ1';
	}

	if (document.getElementById('mswitch').checked) {
		mflag = 'M1';
	}

	if (document.getElementById('lrswitch').checked) {
		lrflag = 'LR1';
	}

	if (document.getElementById('sswitch').checked) {
		sflag = 'S1';
	}

	if (document.getElementById('eswitch').checked) {
		eflag = 'ER1';
	}

	if (document.getElementById('bswitch').checked) {
		bflag = 'B1';
	}

	if (document.getElementById('striswitch').checked) {
		striflag = 'STRI1';
	}

	if (document.getElementById('streswitch').checked) {
		streflag = 'STRE1';
	}

	if (document.getElementById('gswitch').checked) {
		gflag = 'G1';
	}

	if (document.getElementById('maswitch').checked) {
		maflag = 'MA1';
	}

	if (document.getElementById('epswitch').checked) {
		epflag = 'EP1';
	}

	if (document.getElementById('evswitch').checked) {
		evflag = 'EV1';
	}

	if (document.getElementById('entryswitch').checked) {
		entryflag = 'ENTRY1';
	}

	return dflag + scflag + sqflag + mflag + lrflag + sflag + eflag + bflag + striflag + streflag + gflag + maflag + epflag + evflag + entryflag;
}

function getMostRecentFlags() {
	var flagsStr = localStorage.getItem("rando-flags");
	if (flagsStr)
		return flagsStr;
	return getFlagString();
}

function loadMostRecent() {
	var flagsstr = getMostRecentFlags();

	//Chrome defaults
	var h = 435;
	var w = 1300;

	open('tracker.html?f=' + flagsstr + '&p=1',
		'',
		'width=' + w + ',height=' + h + ',titlebar=0,menubar=0,toolbar=0,scrollbars=0,resizable=0');
}

function launch() {
	var flagsstr = getFlagString();

	//Chrome defaults
	var h = 435;
	var w = 1300;

	open('tracker.html?f=' + flagsstr + '&p=0',
		'',
		'width=' + w + ',height=' + h + ',titlebar=0,menubar=0,toolbar=0,scrollbars=0,resizable=0');
}
