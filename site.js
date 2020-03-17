// I apologize for this in advance.

const circeTexts = [
	"Alright, here's your curse! Enjoy.",
	"God, you mortals are so picky. Here, how's this one?"
]

const noValidComponent = "no valid component";

var generation = 0;

$(document).ready(function() {
    $("#goButton").click(function(){
		// curse counter
		fetch("https://www.freevisitorcounters.com/en/home/counter/588546/t/3", {credentials: "omit", mode: 'no-cors',});
		var options = updateOptionStatuses();
		var curseOutput;
	    var i;
	    for (i = 0; i < 3; i++) {
			try {
				curseOutput = generateSecondPersonCurse(options);
				break;
			} catch(err) {
				console.log("failed to generate curse " + i + ": " + err);
				console.log(err.stack);
			}
		}
	    	if (i == 3) {
			return;
		}
		
		generation = generation + 1;
		$("#goButton").html("Wait, can I get a different one?");
		$("#circePre").html(getCircePreText());
		$(".curseOutput").html(curseOutput.curseText);
		$("#circePost").html(curseOutput.circeText);
		$("#secretCopyField").html(String.format("{0}\n\n\"{1}\"", curseOutput.curseText, curseOutput.circeText));
		$(".curseRow").css("display", "block");
		$(".circeOnlyOnce").css("display", "none");	
    }); 
	//visitor counter
	fetch("https://www.freevisitorcounters.com/en/home/counter/588555/t/3", {mode: 'no-cors',});
});

function updateOptionStatuses() {
    var sfwSelected = false;
    var nsfwSelected = true;
    var lewdSelected = false;
    var maleSelected= false;
    var femaleSelected = false;
    var otherSexSelected = true;
    var humansSelected = true;
    var humanoidsSelected = true;
    var beastsSelected = true;
    var mythicalSelected = true;
    var inanimateSelected = true;
    var mentalSelected = true;
    var tgSelected = true;
	var radios = document.getElementsByName('inlineRadioOptions');
	for (var i = 0, length = radios.length; i < length; i++) {
		if (radios[i].checked) {
			if (i == 0) {
				sfwSelected = true;
				nsfwSelected = false;
				lewdSelected = false;
			} else if (i == 1) {
				sfwSelected = false;
				nsfwSelected = true;
				lewdSelected = false;
			} else {
				sfwSelected = false;
				nsfwSelected = false;
				lewdSelected = true;
			}
			break;
		}
	}
	radios = document.getElementsByName('sexOptions');
	for (var i = 0, length = radios.length; i < length; i++) {
		if (radios[i].checked) {
			if (i == 0) {
				maleSelected = true;
				femaleSelected = false;
				otherSexSelected = false;
			} else if (i == 1) {
				maleSelected = false;
				femaleSelected = true;
				otherSexSelected = false;
			} else {
				maleSelected = false;
				femaleSelected = false;
				otherSexSelected = true;
			}
			break;
		}
	}
	humansSelected = document.getElementById("humanCheckbox").checked;
	humanoidsSelected = document.getElementById("humanoidCheckbox").checked;
	beastsSelected = document.getElementById("beastCheckbox").checked;
	mythicalSelected = document.getElementById("mythicalCheckbox").checked;
	inanimateSelected = document.getElementById("inanimateCheckbox").checked;
	mentalSelected = document.getElementById("mentalCheckbox").checked;
	tgSelected = document.getElementById("transgenderCheckbox").checked;
	return new TfOptions(sfwSelected,
        nsfwSelected,
        lewdSelected,
        maleSelected,
        femaleSelected,
        otherSexSelected,
        humansSelected,
        humanoidsSelected,
        beastsSelected,
        mythicalSelected,
        inanimateSelected,
        mentalSelected,
        tgSelected);
}

function getCircePreText() {
	if (generation >= circeTexts) {
		return circeTexts[circeTexts.length - 1];
	} else {
		return circeTexts[generation];
	}
}


window.onload = function () {
	document.getElementById("copyButton").addEventListener("click", function() {
    copyToClipboard(document.getElementById("secretCopyField"));});
};

function copyToClipboard(elem) {
	  // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);
    
    // copy the selection
    var succeed;
    try {
    	  succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }
    
    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}
