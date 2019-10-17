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
		durationText : null,
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
			return String.format("{0} {1} {2}. {3}",
				this.renderTriggerText(),
				this.renderTransformationText(),
				this.renderSubjectText(),
				this.renderAdditionalExplainations());
			}
	}
	
	var imaginarySpeciesAllowed = true;
	var specificTarget = false;
	var personSubject = false;
	var subjectArticle = "a";
	
	// DATA
	// instead of static text, you can specify a "make" function that will be called at render time.
	var triggers = [
		{triggerText: "Each full moon"},
		{triggerText: "Whenever you touch an animal", subjectText: "touched animal", chosen: function(){specificTarget = true;}},
		{triggerText: "Whenever you touch a person", subjectText: "touched person", chosen: function(){specificTarget = true; personSubject = true;}},
		{triggerText: "Whenever you hear a certain phrase", additionalExplainations: ["Anyone you spend much time with will know your trigger phrase."]}, 
	];
	
	var generalTransformations = [
		{makeTransformationText:function(){return String.format("you transform into {0}", specificTarget ? "the" : subjectArticle);}},
		{makeTransformationText:function(){return String.format("your genitals become that of {0}", specificTarget ? "the" : subjectArticle);}},
		{makeTransformationText:function(){return String.format("you become a taur version of {0}", specificTarget ? "the" : subjectArticle);}},
		{makeTransformationText:function(){return String.format("you swap minds with {0}", specificTarget ? "the" : "the nearest");}, chosen: function(){imaginarySpeciesAllowed = false;}},
	];
	var inhumanTransformations = [
		{makeTransformationText:function(){return String.format("you transform into an anthro version of {0}", specificTarget ? "the" : subjectArticle);}},
	];
	
	var generalSubjects = [
		{subjectText: "member of your favorite species", chosen: function(){subjectArticle = ""}},
		{subjectText: "cow"},
		{subjectText: "german shepard"},
		{subjectText: "zebra"},
		{subjectText: "kangaroo"},
		{subjectText: "donkey"},
		{subjectText: "horse"},
		{subjectText: "komodo dragon"},
		{subjectText: "anaconda", chosen: function(){subjectArticle = "an";}},
		{subjectText: "last animal you touched", chosen: function(){specificTarget = true;}},
		{subjectText: "species of the last animal product you consumed or wore", chosen: function(){specificTarget = true;}},
	];
	var imaginarySubjects = [
		{subjectText: "last fantasy creature you killed in a video game", chosen: function(){specificTarget = true;}},
		{subjectText: "current year's zodiac animal", chosen: function(){specificTarget = true;}},
		{subjectText: "zodiac animal assigned to you at birth"},
	];
	
	// Code start
	updateCurse(curse, randomFrom(triggers));
	if (curse.renderTransformationText == null) {
		updateCurse(curse, randomFrom(buildTransformations(specificTarget, personSubject)));
	}
	if (curse.renderSubjectText == null) {
		updateCurse(curse, randomFrom(buildSubjects(imaginarySpeciesAllowed)));
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
	if (curse.subjectText == null) {
		curse.subjectText = update.subjectText;
	}
	if (curse.durationText == null) {
		curse.durationText = update.durationText;
	}
	if (curse.complicationText == null) {
		curse.complicationText = update.complicationText;
	}
	curse.additionalExplainations = curse.additionalExplainations.concat(update.additionalExplainations);
}

function randomFrom(array) {
	return array[Math.floor(Math.random()*array.length)];
}