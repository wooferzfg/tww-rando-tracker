function applyflags() {
	var decodeddata = atob(document.getElementById('flags').value);
	var version = '';
	var seed = '';
	var bits = '';

	while (decodeddata.charCodeAt(0) != 0 && decodeddata.length > 0) {
		version += decodeddata[0];
		decodeddata = decodeddata.substring(1);
	}

	if (decodeddata.length > 0) {
		decodeddata = decodeddata.substring(1);
	}

	while (decodeddata.charCodeAt(0) != 0 && decodeddata.length > 0) {
		seed += decodeddata[0];
		decodeddata = decodeddata.substring(1);
	}

	if (decodeddata.length > 0) {
		decodeddata = decodeddata.substring(1);
		bits = decodeddata;

		var flags = bits.charCodeAt(0);
		console.log(bits);

		if (flags >= 128) {
			document.getElementById('bswitch').checked = true;
			flags = flags - 128;
		} else {
			document.getElementById('bswitch').checked = false;
		}
		if (flags >= 64) {
			document.getElementById('eswitch').checked = true;
			flags = flags - 64;
		} else {
			document.getElementById('eswitch').checked = false;
		}
		if (flags >= 32) {
			document.getElementById('sswitch').checked = true;
			flags = flags - 32;
		} else {
			document.getElementById('sswitch').checked = false;
		}
		if (flags >= 16) {
			document.getElementById('lrswitch').checked = true;
			flags = flags - 16;
		} else {
			document.getElementById('lrswitch').checked = false;
		}
		if (flags >= 8) {
			document.getElementById('mswitch').checked = true;
			flags = flags - 8;
		} else {
			document.getElementById('mswitch').checked = false;
		}
		if (flags >= 4) {
			document.getElementById('sqswitch').checked = true;
			flags = flags - 4;
		} else {
			document.getElementById('sqswitch').checked = false;
		}
		if (flags >= 2) {
			document.getElementById('scswitch').checked = true;
			flags = flags - 2;
		} else {
			document.getElementById('scswitch').checked = false;
		}
		if (flags >= 1) {
			document.getElementById('dswitch').checked = true;
		} else {
			document.getElementById('dswitch').checked = false;
		}

		flags = bits.charCodeAt(1);

		if (flags >= 128) {
			document.getElementById('entryswitch').checked = true;
			flags = flags - 128;
		} else {
			document.getElementById('entryswitch').checked = false;
		}
		if (flags >= 64) {
			flags = flags - 64;
		}
		if (flags >= 32) {
			document.getElementById('evswitch').checked = true;
			flags = flags - 32;
		} else {
			document.getElementById('evswitch').checked = false;
		}
		if (flags >= 16) {
			document.getElementById('maswitch').checked = true;
			flags = flags - 16;
		} else {
			document.getElementById('maswitch').checked = false;
		}
		if (flags >= 8) {
			document.getElementById('gswitch').checked = true;
			flags = flags - 8;
		} else {
			document.getElementById('gswitch').checked = false;
		}
		if (flags >= 4) {
			document.getElementById('epswitch').checked = true;
			flags = flags - 4;
		} else {
			document.getElementById('epswitch').checked = false;
		}
		if (flags >= 2) {
			document.getElementById('streswitch').checked = true;
			flags = flags - 2;
		} else {
			document.getElementById('streswitch').checked = false;
		}
		if (flags >= 1) {
			document.getElementById('striswitch').checked = true;
		} else {
			document.getElementById('striswitch').checked = false;
		}
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
	var keyflag = 'KEY0';
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

	return dflag + scflag + sqflag + mflag + lrflag + sflag + eflag + bflag + striflag + streflag + gflag + maflag + epflag + evflag + keyflag + entryflag;
}

function getMostRecentFlags() {
	var flagsStr = localStorage.getItem("rando-flags");
	if (flagsStr)
		return flagsStr;
	return getFlagString();
}

function getProgressString() {
	var progressStr = localStorage.getItem("rando-progress");
	if (progressStr)
		return progressStr;
	return '0';
}

function loadMostRecent() {
	var flagsstr = getMostRecentFlags();
	var progressStr = getProgressString();

	//Chrome defaults
	var h = 500;
	var w = 1120;

	open('tracker.html?f=' + flagsstr + '&p=' + progressStr,
		'',
		'width=' + w + ',height=' + h + ',titlebar=0,menubar=0,toolbar=0,scrollbars=0,resizable=0');
}

function launch() {
	var flagsstr = getFlagString();
	var progressStr = '0';

	//Chrome defaults
	var h = 500;
	var w = 1120;

	open('tracker.html?f=' + flagsstr + '&p=' + progressStr,
		'',
		'width=' + w + ',height=' + h + ',titlebar=0,menubar=0,toolbar=0,scrollbars=0,resizable=0');
}
