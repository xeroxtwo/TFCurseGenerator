// I apologize for this in advance.

$(document).ready(function() {
    $("#goButton").click(function(){
		$("#output").html(generateCurseText());
    }); 
});

function generateCurseText() {
	// Methods
	function buildTransformations(specificTarget, personSubject) {
		var output = generalTransformations;
		if (!personSubject) {
			output = output.concat(inhumanTransformations);
		}
		return output;
	}
	
	function buildSubjects(imaginarySpeciesAllowed) {
		var output = generalSubjects;
		if (imaginarySpeciesAllowed) {
			output = output.concat(imaginarySubjects);
		}
		return output;
	}
	
	function buildComplications(imaginarySpeciesAllowed, personSubject) {
		var output = generalComplications;
		if (!personSubject) {
			if (!imaginarySpeciesAllowed) {
				output = output.concat(mundaneAnimalComplications);
			}
		} else {
			output = output.concat(personSubjectComplications);
		}
		return output;
	}
	
	// Variables
	var curse = {
		renderTriggerText : null,
		renderTransformationText : null,
		renderSubjectText : null,
		renderDurationText : null,
		complicationText : null,
		additionalExplainations : [""],
		renderClosingRemarkText: null,
		
		// methods
		renderAdditionalExplainations : function () {
			if (this.additionalExplainations.length > 1) {
				return String.format("<br>{0}", this.additionalExplainations.join(' '));
			} else {
				return "";
			}
		},
		
		renderClosingRemarkBlock: function() {
			if(this.renderClosingRemarkText != null) {
				return String.format("<br><br>{0}", this.renderClosingRemarkText());
			} else {
				return "";
			}
		},
		
		renderText : function() {
			return String.format("{0} {1} {2}. {3} {4}{5}{6}",
				this.renderTriggerText(),
				this.renderTransformationText(),
				this.renderSubjectText(),
				this.renderDurationText(),
				this.renderComplicationText(),
				this.renderAdditionalExplainations(),
				this.renderClosingRemarkBlock());
			},
	}
	
	var imaginarySpeciesAllowed = true;
	var specificTarget = false;
	var personSubject = false;
	var subjectArticle = "a";
	var happensOnce = (Math.random() <0.3); // 30% chance
	var subjectFemale = (Math.random() < 0.5); // 50% chance
	var triggerFemale =  null;
	var sexUndecided = false;
	
	// DATA
	// instead of static text, you can specify a "make" function that will be called at render time.
	var triggers = [
		{makeTriggerText: function(){return happensOnce ? "If you ever catch sight of the full moon" : "Each full moon";}},
		{triggerText: "Immediately,", durationText: "The transformation is permanent."},
		{makeTriggerText: function(){return happensOnce ? "In one week" : String.format("Every {0}", randomFrom(["Monday", "Saturday", "Friday"]));}},
		{triggerText: "Immediately,", durationText: "The transformation is permanent.", chosen: function(){happensOnce = true;}},
		{makeTriggerText: function(){return happensOnce ? "If you happen to touch an animal" : "Whenever you touch an animal";},
				subjectText: "touched animal", chosen: function(){specificTarget = true; sexUndecided = true;}},
		{makeTriggerText: function(){return happensOnce ? "If you ever touch a male animal" : "Whenever you touch a male animal";},
				subjectText: "touched animal", chosen: function(){specificTarget = true; triggerFemale = true; subjectFemale = true;}},
		{makeTriggerText: function(){return happensOnce ? "If you ever eat meat or an animal product" : "Whenever you eat meat or an animal product";},
				subjectText: "consumed species", chosen: function(){specificTarget = true;}},
		{makeTriggerText: function(){return happensOnce ? "When you next touch a man": "Whenever you touch a man";},
				subjectText: "touched man", chosen: function(){specificTarget = true; personSubject = true; triggerFemale = false}},
		{makeTriggerText: function(){return happensOnce ? "When you next touch a woman": "Whenever you touch a woman";},
				subjectText: "touched woman", chosen: function(){specificTarget = true; personSubject = true; triggerFemale = true}},
		{makeTriggerText: function(){return happensOnce ? "When you next touch someone": "Whenever you touch someone";},
				subjectText: "touched person", chosen: function(){specificTarget = true; personSubject = true;sexUndecided = true;}},
		{makeTriggerText: function(){return happensOnce 
				? "There exists a phrase, and, if you ever hear it," : "You have a secret key phrase, and whenever you hear it";},
				additionalExplainations: [],
				chosen: function(){this.additionalExplainations.push(randomFrom([
						"You can't resist dropping hints about the curse's trigger phrase.",
						"You have the curse's trigger phrase tattooed above your ass.",
						"Your rival knows the curse's trigger phrase."]));}},
		{makeTriggerText: function(){return happensOnce ? "The next time you orgasm" : "Each time you orgasm";},
				additionalExplainations: ["You transform partially when you're aroused."]},
		{makeTriggerText: function(){return happensOnce ? "Immediately after the next time you have sex" : "Each time you have sex";},
				chosen: function(){this.closingRemarkText = randomFrom([
						"Welp, that's going to be awkward.",
						"How's that for an afterglow?",
						"Hopefully your partner doesn't die of surprise."]);}},
		{makeTriggerText: function(){return happensOnce ? "The next time you see an animal" : "Whenever you see an animal,";},
				subjectText: "sighted animal", chosen: function(){specificTarget = true;sexUndecided = true;}},
	];
	
	var generalTransformations = [
		{makeTransformationText:function(){return String.format("you transform into {0}", specificTarget ? "a copy of the" : subjectArticle);},
				chosen: function(){if(triggerFemale != null){subjectFemale = triggerFemale;}}},
		{makeTransformationText:function(){return String.format("you painfully shift into {0}", specificTarget ? "a copy of the" : subjectArticle);}},
		{makeTransformationText:function(){return String.format("you become {0}", specificTarget ? "a copy of the" : subjectArticle);}},
		{makeTransformationText:function(){return specificTarget 
				? "an additional head grows beside your own. It's that of the" : "an additional head grows beside your own. It's that of a";},
				additionalExplainations:["You have no control over your extra head. Sometimes it behaves lika a sibling, other times a lover."]},
		{makeTransformationText:function(){return String.format("{0} into {1}", happensOnce 
				? "you spend the next 24 hours transforming" : "you transform a little bit more",
				specificTarget ? "a copy of the" : subjectArticle);}, durationText: ""},
		{makeTransformationText:function(){return String.format("your genitals are replaced by those of {0}", specificTarget ? "the" : subjectArticle);}},
		{makeTransformationText:function(){return String.format("you become a taur version of {0}", specificTarget ? "the" : subjectArticle);}},
		{makeTransformationText:function(){return String.format("you become an sentient sex toy in the form of {0}",
				specificTarget ? "the" : subjectArticle);},
				additionalExplainations:["The new mental conditioning makes fufilling your duties a pleasure."]},
		{makeTransformationText:function(){return String.format("you swap minds with {0}", specificTarget ? "the" : "the nearest");},
				chosen: function(){imaginarySpeciesAllowed = false; if(triggerFemale != null){subjectFemale = triggerFemale;};}},
	];
	var inhumanTransformations = [
		{makeTransformationText:function(){return String.format("you transform into an anthro version of {0}", specificTarget ? "the" : subjectArticle);}},
		{makeTransformationText:function(){return String.format("you transform into a kemono version of {0}", specificTarget ? "the" : subjectArticle);}},
		{makeTransformationText:function(){return String.format("you become an inflatable pool toy shaped like {0}", specificTarget ? "the" : subjectArticle);}},
	];
	
	var generalSubjects = [
		{subjectText: "member of your favorite species"},
		{makeSubjectText: function(){return subjectFemale ? "cow" : "bull";}, closingRemarkText: "Uhh. . . Moo?"},
		{makeSubjectText: function(){return subjectFemale ? "rottweiler bitch" : "rottweiler stud";}},
		{makeSubjectText: function(){return subjectFemale ? "german shepherd bitch" : "german shepherd stud";}},
		{makeSubjectText: function(){return subjectFemale ? "doe" : "buck";}},
		{makeSubjectText: function(){return subjectFemale ? "cat" : "tom cat";}},
		{makeSubjectText: function(){return subjectFemale ? "ewe" : "ram";}},
		{makeSubjectText: function(){return subjectFemale ? "hen" : "rooster";}},
		{makeSubjectText: function(){return subjectFemale ? "vixen" : "fox";}},
		{makeSubjectText: function(){return subjectFemale ? "nanny goat" : "billy goat";}},
		{subjectText: "zebra"},
		{subjectText: "snow leopard"},
		{subjectText: "tiger"},
		{subjectText: "squirrel"},
		{subjectText: "lizard"},
		{subjectText: "closest pet", chosen: function(){specificTarget = true;}},
		{subjectText: "kangaroo"},
		{subjectText: "donkey"},
		{subjectText: "monkey"},
		{makeSubjectText: function(){return subjectFemale ? "mare" : "stallion";}},
		{subjectText: "komodo dragon"},
		{subjectText: "anaconda", chosen: function(){subjectArticle = "an";}},
		{subjectText: "last animal you touched", chosen: function(){specificTarget = true;}},
		{subjectText: "the last animal you ate", chosen: function(){specificTarget = true;}},
	];
	var imaginarySubjects = [
		{subjectText: "last fantasy creature you killed in a video game", chosen: function(){specificTarget = true;}},
		{subjectText: "current year's zodiac animal", chosen: function(){specificTarget = true;}},
		{subjectText: "zodiac animal assigned to you at birth", chosen: function(){specificTarget = true;}},
		{subjectText: "demon", chosen: function(){subjectArticle = "an";}},
		{subjectText: "dragon", additionalExplainations: ["You have a lust for hoarding treasure that is impossible to ignore."]},
		{subjectText: "unicorn"},
		{subjectText: "kobold"},
		{subjectText: "wyvern"},
		{makeSubjectText: function(){return subjectFemale ? "succubus": "minotaur";}},
		{makeSubjectText: function(){return subjectFemale ? "gorgon": "incubus";}},
	];
	
	var durations = [
		{durationText: ""},
		{durationText: "You remain this way until you have sex."},
		{durationText: "You remain this way until you have sex with a human."},
		{durationText: "You return to normal after one week."},
		{durationText: "You remain this way for a full 24 hours."},
		{durationText: "You will return to normal in a week, but each time you orgasm, the duration is increased by a day."},
		{makeDurationText: function(){return sexUndecided ? "Your original form can only be restored by reproducing" : 
				subjectFemale ? "Your original form can only be restored by giving birth." : "Your original form can only be restored by siring young.";}},
	]

	var generalComplications = [
		{makeComplicationText: function(){return String.format("{0} must obey the orders of any human", happensOnce ? "You" : "While transformed, you");}},
		{complicationText: "Your sex drive and production of bodily fluids are greatly increased."},
		{complicationText: "Your curse is sexually transmittable."},
		{complicationText: "Also, you must lay one large egg every day."},
		{complicationText: "Also, you grow an extra pair of breasts"},
		{makeComplicationText: function(){return String.format("{0} a hermaphrodite.", happensOnce ? "You become" : "While transformed, you are");}},
		{makeComplicationText: function(){return String.format("Immediately after your transformation {0}",
				sexUndecided ? "You feel compelled to reproduce until you are successful." : 
						subjectFemale ? "you feel a kicking and realize you're pregnant!" : "the nearest female becomes pregnant with your children.");}},
		{makeComplicationText: function(){return happensOnce ? "Your sex drive is supercharged." : "While transformed, you are always horny.";}},
		{makeComplicationText: function(){return sexUndecided ? "Your genitals are oversized." : 
				subjectFemale ? "Your pussy is oversized and gets dripping wet whenever you're aroused." : "Your penis is exceptionally large.";}},
	]
	var mundaneAnimalComplications = [
		{complicationText: "You and the relevant species experience a mutual attraction."},
		{complicationText: "You retain your ability to speak English."},
		{makeComplicationText: function(){return String.format("{0} lose your ability to read and write", happensOnce ? "You" : "While transformed, you");}},
		{complicationText: "You get all the instincts of the relevant species and can't resist acting on them."},
		{makeComplicationText: function(){return happensOnce ? "You are sold to a rich, private collector." : "While in human form, you retain some parts of your other form.";}},
	]
	var personSubjectComplications = [
		{complicationText: "You gain the memories of the other person."},
		{complicationText: "Whenever the other person becomes aroused, you are as well."},
		{complicationText: "Whenever the other person becomes orgasms, so do you."},
		{complicationText: "You cannot refuse orders from the other person."},
	]
	
	// Code start
	if (happensOnce) {
		updateCurse(curse, {durationText: "The transformation is permanent."});
	}
	
	updateCurse(curse, randomFrom(triggers));
	if (curse.renderTransformationText == null) {
		updateCurse(curse, randomFrom(buildTransformations(specificTarget, personSubject)));
	}
	if (curse.renderSubjectText == null) {
		updateCurse(curse, randomFrom(buildSubjects(imaginarySpeciesAllowed)));
	}
	if (curse.renderDuration == null) {
		updateCurse(curse, randomFrom(durations));
	}
	if (curse.renderComplicationText == null) {
		if(Math.random() < 0.35) {
			updateCurse(curse, randomFrom(buildComplications(imaginarySpeciesAllowed, personSubject)));
		} else {
			updateCurse(curse, {complicationText: ""});
		}
	}
	
	return curse.renderText();
}


String.format = function() {
  var s = arguments[0];
  for (var i = 0; i < arguments.length - 1; i++) {       
	  var reg = new RegExp("\\{" + i + "\\}", "gm");             
	  s = s.replace(reg, arguments[i + 1]);
  }
  return s;
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function updateCurse(curse, update) {
	if (update.chosen != null) {
		update.chosen();
	}
	if (curse.renderTriggerText == null) {
		if (update.makeTriggerText != null) {
			curse.renderTriggerText = update.makeTriggerText;
		}
		if (update.triggerText != null) {
			curse.renderTriggerText = function(){return update.triggerText;};
		}
	}
	if (curse.renderTransformationText == null) {
		if (update.makeTransformationText != null) {
			curse.renderTransformationText = update.makeTransformationText;
		}
		if (update.transformationText != null) {
			curse.renderTransformationText = function(){return update.transformationText;};
		} 
	}
	if (curse.renderSubjectText == null) {
		if (update.makeSubjectText != null) {
			curse.renderSubjectText = update.makeSubjectText;
		}
		if (update.subjectText != null) {
			curse.renderSubjectText = function(){return update.subjectText;};
		} 
	}
	if (curse.renderDurationText == null) {
		if (update.makeDurationText != null) {
			curse.renderDurationText = update.makeDurationText;
		}
		if (update.durationText != null) {
			curse.renderDurationText = function(){return update.durationText;};
		} 
	}
	if (curse.renderComplicationText == null) {
		if (update.makeComplicationText != null) {
			curse.renderComplicationText = update.makeComplicationText;
		}
		if (update.complicationText != null) {
			curse.renderComplicationText = function(){return update.complicationText;};
		} 
	}
	curse.additionalExplainations = curse.additionalExplainations.concat(update.additionalExplainations);
	if (curse.renderClosingRemarkText == null) {
		if (update.makeClosingRemarkText != null) {
			curse.renderClosingRemarkText = update.makeClosingRemarkText;
		}
		if (update.closingRemarkText != null) {
			curse.renderClosingRemarkText = function(){return update.closingRemarkText;};
		} 
	}
}

function randomFrom(array) {
	return array[Math.floor(Math.random()*array.length)];
}

window.onload = function () {
	document.getElementById("copyButton").addEventListener("click", function() {
    copyToClipboard(document.getElementById("output"));});
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