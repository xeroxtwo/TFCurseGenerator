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
			var output = output.concat(inhumanTransformations);
		}
		return output;
	}
	
	function buildSubjects(imaginarySpeciesAllowed) {
		var output = generalSubjects;
		if (imaginarySpeciesAllowed) {
			var output = output.concat(imaginarySubjects);
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
		
		// methods
		renderAdditionalExplainations : function () {
			if (this.additionalExplainations.length > 1) {
				return String.format("<br>{0}", this.additionalExplainations.join(' '));
			} else {
				return "";
			}
		},
		
		renderText : function() {
			return String.format("{0} {1} {2}. {3}{4}",
				this.renderTriggerText(),
				this.renderTransformationText(),
				this.renderSubjectText(),
				this.renderDurationText(),
				this.renderAdditionalExplainations());
			}
	}
	
	var imaginarySpeciesAllowed = true;
	var specificTarget = false;
	var personSubject = false;
	var subjectArticle = "a";
	var happensOnce = (Math.random() <0.2); // 20% chance
	var subjectFemale = (Math.random() < 0.5); // 50% chance
	var triggerFemale = null;
	
	// DATA
	// instead of static text, you can specify a "make" function that will be called at render time.
	var triggers = [
		{makeTriggerText: function(){return happensOnce ? "If you ever catch sight of the full moon" : "Each full moon";}},
		{triggerText: "Over the next week,", durationText: "The transformation is permanent."},
		{makeTriggerText: function(){return happensOnce ? "If you happen to touch an animal" : "Whenever you touch an animal";}, subjectText: "touched animal", chosen: function(){specificTarget = true;}},
		{makeTriggerText: function(){return happensOnce ? "When you next touch a man": "Whenever you touch a man";}, subjectText: "touched man", chosen: function(){specificTarget = true; personSubject = true; triggerFemale = false}},
		{makeTriggerText: function(){return happensOnce ? "When you next touch a woman": "Whenever you touch a woman";}, subjectText: "touched woman", chosen: function(){specificTarget = true; personSubject = true; triggerFemale = true}},
		{makeTriggerText: function(){return happensOnce ? "When you next touch someone": "Whenever you touch someone";}, subjectText: "touched person", chosen: function(){specificTarget = true; personSubject = true;}},
		{makeTriggerText: function(){return happensOnce ? "There exists a phrase, and, if you ever hear it," : "You have a secret key phrase, and whenever you hear it";}, additionalExplainations: ["You can't resist dropping hints about the curse's trigger phrase."]},
		{makeTriggerText: function(){return happensOnce ? "The next time you orgasm" : "Each time you orgasm";}, additionalExplainations: ["You transform partially when you're aroused."]},
		
		{makeTriggerText: function(){return happensOnce ? "The next time you see an animal" : "Whenever you see an animal";}, subjectText: "sighted animal", chosen: function(){specificTarget = true;}},
	];
	
	var generalTransformations = [
		{makeTransformationText:function(){return String.format("you transform into {0}", specificTarget ? "a copy of the" : subjectArticle);}},
		{makeTransformationText:function(){return specificTarget ? "you merge into a two-headed creature that is a cross between you and the" : "an additional head grows beside your own. It's that of a";}, additionalExplainations:["You have no control over this head. Sometimes it behaves lika a sibling, other times a lover."]},
		{makeTransformationText:function(){return String.format("{0} into {1}", happensOnce ? "you spend the next 24 hours transforming" : "you transform a little bit more", specificTarget ? "a copy of the" : subjectArticle);}, durationText: ""},
		{makeTransformationText:function(){return String.format("your genitals are replaced by those of {0}", specificTarget ? "the" : subjectArticle);}},
		{makeTransformationText:function(){return String.format("you become a taur version of {0}", specificTarget ? "the" : subjectArticle);}},
		{makeTransformationText:function(){return String.format("you become an sentient sex toy in the form of {0}", specificTarget ? "the" : subjectArticle);}, additionalExplainations:["The new mental conditioning makes fufilling your duties a pleasure."]},
		{makeTransformationText:function(){return String.format("you swap minds with {0}", specificTarget ? "the" : "the nearest");}, chosen: function(){imaginarySpeciesAllowed = false; if(triggerFemale != null){subjectFemale = triggerFemale;};}},
	];
	var inhumanTransformations = [
		{makeTransformationText:function(){return String.format("you transform into an anthro version of {0}", specificTarget ? "the" : subjectArticle);}},
		{makeTransformationText:function(){return String.format("you transform into a kemono version of {0}", specificTarget ? "the" : subjectArticle);}},
		{makeTransformationText:function(){return String.format("you become an inflatable pool toy shaped like {0}", specificTarget ? "the" : subjectArticle);}},

	];
	
	var generalSubjects = [
		{subjectText: "your favorite species", chosen: function(){subjectArticle = ""}},
		{makeSubjectText: function(){return subjectFemale ? "cow" : "bull";}},
		{makeSubjectText: function(){return subjectFemale ? "rottweiler bitch" : "rottweiler stud";}},
		{makeSubjectText: function(){return subjectFemale ? "german shepherd bitch" : "german shepherd stud";}},
		{subjectText: "zebra"},
		{subjectText: "kangaroo"},
		{subjectText: "donkey"},
		{subjectText: "monkey"},
		{makeSubjectText: function(){return subjectFemale ? "mare" : "stallion";}},
		{subjectText: "komodo dragon"},
		{subjectText: "anaconda", chosen: function(){subjectArticle = "an";}},
		{subjectText: "last animal you touched", chosen: function(){specificTarget = true;}},
		{subjectText: "species of the last animal product you consumed or wore", chosen: function(){specificTarget = true;}},
	];
	var imaginarySubjects = [
		{subjectText: "last fantasy creature you killed in a video game", chosen: function(){specificTarget = true;}},
		{subjectText: "current year's zodiac animal", chosen: function(){specificTarget = true;}},
		{subjectText: "zodiac animal assigned to you at birth"},
		{subjectText: "elf", chosen: function(){subjectArticle = "an";}},
		{subjectText: "dragon", additionalExplainations: ["You have a lust for hoarding treasure that is impossible to ignore."]},
		{subjectText: "unicorn"},
		{subjectText: "kobold"},
		{subjectText: "wyvern"},
	];
	
	var durations = [
		{durationText: ""},
		{durationText: "You remain this way until you have sex."},
		{durationText: "You return to normal after one week."},
		{durationText: "You remain this way for a full 24 hours."},
		{makeDurationText: function(){return subjectFemale ? "Your original form can only be restored by giving birth." : "Your original form can only be restored by reproducing.";}},
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
}

function randomFrom(array) {
	return array[Math.floor(Math.random()*array.length)];
}