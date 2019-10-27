// I apologize for this in advance.

const circeTexts = [
	"Alright, here's your curse! Enjoy.",
	"God, you mortals are so picky. Here, how's this one?"
]

// Tags for global status.
const sfw = {
	shouldFilter: function() {return false;},
}
const nsfw = {
	shouldFilter: function() {return sfwSelected;},
}
const lewd = {
	shouldFilter: function() {return sfwSelected || nsfwSelected;},
}


var generation = 0;
var sfwSelected = false;
var nsfwSelected = false;
var lewdSelected = false;

$(document).ready(function() {
    $("#goButton").click(function(){
		// curse counter
		fetch("https://www.freevisitorcounters.com/en/home/counter/588546/t/3", {credentials: "omit", mode: 'no-cors',});
		updateExplicitSuggestion();
		$("#circePre").html(getCircePreText());
		generation = generation + 1;
		var curseOutput = generateCurse();
		
		$("#goButton").html("Wait, can I get a different one?");
		$(".curseOutput").html(curseOutput.curseText);
		$("#circePost").html(curseOutput.circeText);
		$("#secretCopyField").html(String.format("{0}\n\n\"{1}\"", curseOutput.curseText, curseOutput.circeText));
		$(".curseRow").css("display", "block");
		$(".circeOnlyOnce").css("display", "none");	
    }); 
	//visitor counter
	fetch("https://www.freevisitorcounters.com/en/home/counter/588555/t/3", {mode: 'no-cors',});
});

function updateExplicitSuggestion() {
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
}

function getCircePreText() {
	if (generation >= circeTexts) {
		return circeTexts[circeTexts.length - 1];
	} else {
		return circeTexts[generation];
	}
}

function generateCurse() {
	selectAnother = function(components) {
		var anotherSelected = randomFrom(components);
		if (chosenTrigger == anotherSelected
			|| chosenTransformation == anotherSelected
			|| chosenSubject == anotherSelected
			|| chosenDuration == anotherSelected
			|| chosenComplication == anotherSelected) {
			return selectAnother(components);
		} else {
			return anotherSelected;
		}


	}

	function setTagsForComponent(component) {
		if (component.sets != null) {
			for (var i = 0; i < component.sets.length; i++) {
				component.sets[i].onChoice();
			}
		}
	}
	
	// return true if any tag on the component things it should be filtered out.
	function shouldFilterComponent(component) {
		if (component.requires == null) {
			return false;
		} else {
			for (var i = 0; i < component.requires.length; i++) {
				var tag = component.requires[i];
				if (tag.shouldFilter()) {
					return true;
				}
			}
			return false;
		}
	}
	
	// return a list of components filtered based on their requires.
	function filterComponents(components) {
		var output = [];
		for (var i = 0; i < components.length; i++) {
			if (shouldFilterComponent(components[i])) {
				continue;
			} else {
				output.push(components[i]);
			}
		}
		return output;
	}
	
	function buildDurations() {
		var output = durations;
		if (!shortDurationOnly) {
			output = output.concat(longDurations);
		}
		return filterComponents(output);
	}
	
	function updateCurse(curse, update) {
		setTagsForComponent(update);
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
		if (update.additionalExplaination) {
			curse.additionalExplainations.push(update.additionalExplaination);
		}
		if (update.makeAdditionalExplaination) {
			//TODO: This means makeAdiditionalExplainations are not run at render time. Should fix so they're consistent. 
			curse.additionalExplainations.push(update.makeAdditionalExplaination());
		}
		if (curse.renderClosingRemarkText == null) {
			if (update.makeClosingRemarkText != null) {
				curse.renderClosingRemarkText = update.makeClosingRemarkText;
			}
			if (update.closingRemarkText != null) {
				curse.renderClosingRemarkText = function(){return update.closingRemarkText;};
			} 
		}
	}
	
	// Variables
	var curse = {
		renderTriggerText : null,
		renderTransformationText : null,
		renderSubjectText : null,
		renderDurationText : null,
		renderComplicationText : null,
		additionalExplainations : [""],
		renderClosingRemarkText: null,
		
		renderAdditionalExplainations : function () {
			if (this.additionalExplainations.length > 1) {
				return String.format("<br></p><p>{0}", this.additionalExplainations.join(' '));
			} else {
				return "";
			}
		},
		
		renderCirceText: function() {
			if(this.renderClosingRemarkText != null) {
				return String.format("{0}", this.renderClosingRemarkText());
			} else {
				return "";
			}
		},
		
		renderText : function() {
			return String.format("<p>{0} {1}{2}{3}. {4} {5}{6}</p>",
				this.renderTriggerText(),
				this.renderTransformationText(),
				shouldRenderSubjectText ? " " : "",
				shouldRenderSubjectText ? this.renderSubjectText() : "",
				this.renderDurationText(),
				this.renderComplicationText(),
				this.renderAdditionalExplainations());
			},
	}
	
	function renderOppositeSex(method) {
		subjectFemale = !subjectFemale;
		var output = method();
		subjectFemale = !subjectFemale;
		return output;
	}
	
	var subjectArticle = "a";
	var happensOnce = (Math.random() <0.2); // 20% chance, more with some triggers that force it.
	var shouldRenderSubjectText = true;
	var shortDurationOnly = false;
	var extemitiesName = "paws";
	var becomingHybrid = false;
	
	
	function decidedAndTrue(statusVariable) {
		return isDecided(statusVariable) && statusVariable;
	}
	
	function decidedAndFalse(statusVariable) {
		return isDecided(statusVariable) && !statusVariable;
	}
	
	function isDecided(statusVariable) {
		return statusVariable != null;
	}
	
	function isUndecided(statusVariable) {
		return !isDecided(statusVariable);
	}
	
	// Status variables
	// The convention is this:
	// 	subject* = status of the person transforming
	//  target* = status of the target (if applicable)
	//  a null value signifies that the status is not decided and ambiguous verbage should be used.
	//  ALL STATUS VARIABLE CHECKS MUST INCLUDE NULL CHECKS FOR THIS REASON.
	//	USE THE decidedAndTrue() and isDecided() CONVENIENCE METHODS FOR CLARITY
	var subjectHuman = null;
	var touchTrigger = false;
	var triggerFemale =  null;
	var subjectFemale = null;
	var filterGenderAgnosticSubject = false;
	var inanimateTF = false;
	var transformationAffectsSubjectSex = true;
	var tfCannotAssignSubject = false;
	var specificTarget = false;
	var isMundaneAnimalSubject = null;
	var subjectHybrid = false;
	

	// TAGS 
	const subjectInhuman = {
		shouldFilter: function() {return decidedAndTrue(subjectHuman);},
		onChoice: function() {subjectHuman = false;} 
	}
	
	const subjectIsHuman  = {
		shouldFilter: function() {return decidedAndFalse(subjectHuman);},
		onChoice: function() {subjectHuman = true;} 
	}
	
	const touchTransformation = {
		shouldFilter: function() {return decidedAndFalse(touchTrigger);},
		onChoice: function() {touchTrigger = true;}
	}
	
	const subjectSexBecomesTriggerSex = {
		shouldFilter: function() {return false;},
		onChoice: function() {if(isDecided(triggerFemale)){subjectFemale = triggerFemale;}}
	}
	
	const subjectSexBecomesSpecificTriggerSex = {
		shouldFilter: function() {return false;},
		onChoice: function() {if(isDecided(triggerFemale) && specificTarget){subjectFemale = triggerFemale;}}
	}
	
	const triggerSexBecomesOppositeSubjectSex = {
		shouldFilter: function() {return false;},
		onChoice: function() {if(isDecided(subjectFemale)){triggerFemale = !subjectFemale;}}
	}
	
	const determinesRandomSex = {
		shouldFilter: function(){return false;},
		onChoice: function() {
			if(isUndecided(subjectFemale) && transformationAffectsSubjectSex){
				subjectFemale = Math.random() < 0.5}}, // 50% chance}
	}
	
	const subjectIsMale = {
		shouldFilter: function(){return decidedAndTrue(subjectFemale)},
		onChoice: function() {subjectFemale = false;}
	}
	
	const subjectIsFemale = {
		shouldFilter: function(){return decidedAndFalse(subjectFemale);},
		onChoice: function() {subjectFemale = true;}
	}
	
	const subjectMustDetermineSex = {
		shouldFilter: function(){return false;},
		onChoice: function() {filterGenderAgnosticSubject = true;}
	}
	
	const genderAgnostic = {
		shouldFilter: function(){return filterGenderAgnosticSubject;},
		onChoice: function() {filterGenderAgnosticSubject = false;}
	}
	
	const nonSpecificSubject = {
		shouldFilter: function(){return specificTarget;},
		onChoice: function() {}
	}
	
	const doNotAssignSubjectSex = {
		shouldFilter: function(){return false;},
		onChoice: function() {
			transformationAffectsSubjectSex = false;
			subjectFemale = null;}
	}

	const subjectTransformation = {
		shouldFilter: function(){return false;},
		onChoice: function() {tfCannotAssignSubject = true;}
	}

	const tfSuppliesOwnSubject = {
		shouldFilter: function(){return tfCannotAssignSubject;},
		onChoice: function() {}
	}

	const specificIndividualTarget = {
		shouldFilter: function(){return !specificTarget;},
		onChoice: function() {specificTarget = true; subjectArticle = "the";}
	}
	
	const mundaneAnimalSubject = {
		shouldFilter: function(){return decidedAndFalse(isMundaneAnimalSubject);},
		onChoice: function() {subjectHuman = false; isMundaneAnimalSubject = true;}
	}

	const nonMundaneSubject = {
		shouldFilter: function(){return decidedAndTrue(mundaneAnimalSubject);},
		onChoice: function() {subjectHuman = false;  isMundaneAnimalSubject = false;}

	}
	
	const becomingCreatureHybrid = {
		shouldFilter: function(){return decidedAndFalse(subjectHybrid)},
		onChoice: function() {subjectHybrid = true;}
	}

	const notBecomingHybrid = {
		shouldFilter: function(){return decidedAndTrue(subjectHybrid)},
		onChoice: function() {subjectHybrid = false;}
	}
	
	
	// DATA
	// instead of static text, you can specify a "make" function that will be called at render time.
	// Every type of component can set the values for any "downstream" components by specifying them. They're secretly all of the same type.
	//  TAGS:
	//		Tags can be included in the "sets" or "requires" field. If included in "requires," the component
	//		will not be a candidate for choice of the tag's condition isn't met. When included in the "sets"
	//		field, the tag make whatever state changes it needs to signal it has been set if and when the component
	//		is selected.
	// 		
	var triggers = [
		{
			// SCENARIO TRIGGER: touch animal
			makeTriggerText: function(){
				var drawAndTrigger = [
						["They are always happy to see you", happensOnce ? "upset them" : "pet them"],
						["They never leave you alone", "escape them"]
				]; 
				if (lewdSelected) {
					drawAndTrigger.push(["You find yourselves hopelessly attracted to each other", "give in to temptation and touch them sexually"]);
					drawAndTrigger.push(triggerFemale ? ["They are prone to entering intense, sexual heats where they produce pheramones that you find irresitably arousing", "give in to temptation and try having sex with them"]
						: ["They are prone to entering intense, sexual heats where they view you as a potential mate", "you touch their penis"]);
				}
				if (nsfwSelected || lewdSelected) {
					drawAndTrigger.push([randomFrom(["They love to wrestle", "They always try to lay on you", "They constantly want to be stroked", "While together, they rub against you constantly"]), "happen to touch their genitals"]);
				}
				var selectedDrawAndTrigger = randomFrom(drawAndTrigger);
				return String.format(
					"{0} {1} {2}. {3}. {4}. {5} {6},", 
					randomFrom([
						"The next time you are out in nature alone, you will encounter", 
						"You will land a job where you have any-time, private access to",
						String.format("You will return home one day to find your {0} occupied by", randomFrom(["bed", "couch", "living room"])),
						"One evening, you will hear a noise at your door. You open it to find", 
					]),
					subjectArticle, 
					subjectFemale == triggerFemale  ? curse.renderSubjectText : renderOppositeSex(curse.renderSubjectText),// this is required to cover merge cases.
					randomFrom(["Any time you are separated, you have an urge to return to them", "You are compelled to adopt them as a new pet", "You cannot stand to be away from them"]),
					selectedDrawAndTrigger[0],
					happensOnce ? "If you ever" : "Each time you",
					selectedDrawAndTrigger[1],
					)},
			sets: [determinesRandomSex, triggerSexBecomesOppositeSubjectSex, subjectMustDetermineSex, touchTransformation, subjectTransformation]
		},
		// You find a glory hole in the bathroom of xyz. A XYZ dick is uncermoneously shoved through. you find it addictve and each time you go back, turn female animal.
		
		{
			makeTriggerText: function() {return String.format("{0} go without {1}{2}",
				happensOnce ? "If you ever" : "The longer you",
				randomFrom([
					nsfwSelected || lewdSelected ? randomFrom(["having sex", "having an orgasm"]) : "cuddling someone",
					"bringing someone home on the first date",
					lewdSelected ? "using a glory hole" : "wrestling someone",
					"privacy",
					"being called a freak",
				]),					
				happensOnce ? " for one week," : ", the more");},
			durationText: "If you don't fulfill the curse's requirement in one week, you are fully and permanently transformed."
		},
		{
			makeTriggerText: function() {return String.format("{0} {1},",
				happensOnce ? "The next time you" : "Every time you",
				randomFrom([
					nsfwSelected || lewdSelected ? randomFrom(["go on a date", "bring a date home"]) : "shiver from being too cold",
					"step into a bar",
					"visit a park",
					"attend a wedding",
					"enter a body of water",
					"get caught in the rain",
					"go outside",
					"sweat from a workout",
					"shiver from being too cold",
					"feel anxious",
					"go to a birthday party",
				]));},
		},
		{
			makeTriggerText: function(){return happensOnce ? "If you ever catch sight of the full moon," : "Each full moon";},
		},
		{
			makeTriggerText: function(){return happensOnce ? "The next time you are splashed with water" : "Each time you are splashed with water";},
		},
		{
			makeTriggerText: function(){return happensOnce ? "In one week" : String.format("Every {0}", randomFrom(["Monday", "Saturday", "Friday"]));},
			chosen: function(){shortDurationOnly = true;}
		},
		randomFrom([ // fewer permanant durations.
			{
				triggerText: "Immediately,", 
				durationText: "The transformation is permanent.", 
				chosen: function(){happensOnce = true;},
				closingRemarkText: randomFrom([
					"I hope you're sitting at home in front of your desktop right now.",
					"Who's going to find you like that?",
					"This might be awkward if you're out in public.",
					"Surprise!",
					"If you don't send me feedback, I'll know why.",
					"I hope whatever clothes you're wearing don't get damaged."])
			},
			{
				triggerText: randomFrom([
					"You will be kidnapped by a cult. They will perform a profane ritual on you where",
					"A cruel witch will spike the punch at the next party you attend, and all the guests' bodies twist into bizarre, inhuman shapes. This includes you, and",
					"You will be exposed to toxic sludge via a chemical spill. Instead of getting sick,"]), 
				durationText: "There's no way to return to normal.", 
				chosen: function(){happensOnce = true;},
			},
		]),
		randomFrom([{
				makeTriggerText: function(){return String.format(happensOnce ? "If you happen to touch {0}," : "Whenever you touch {0},", 
					randomFrom(["someone's pet", "a wild animal", nsfwSelected || lewdSelected ? "an animal in heat" : "an angry animal", "an animal"]));},
				subjectText: "touched animal", 
				sets: [touchTransformation, specificIndividualTarget, mundaneAnimalSubject],
			},
			{
				triggerText: happensOnce ? "If you are ever bitten by an animal," : "Whenever you touch an animal's tail,", 
				subjectText: "biting animal", 
				sets: [touchTransformation, specificIndividualTarget, mundaneAnimalSubject],
			}
		]),
		randomFrom([ // fewer gendered animal touch options
			{
				makeTriggerText: function(){return happensOnce ? "If you ever touch a female animal," : "Whenever you touch a male animal,";},
				subjectText: "touched animal", 
				chosen: function(){triggerFemale = true;},
				sets: [touchTransformation, specificIndividualTarget, mundaneAnimalSubject],
			},
			{
				makeTriggerText: function(){return happensOnce ? "If you ever touch a male animal," : "Whenever you touch a male animal,";},
				subjectText: "touched animal", 
				chosen: function(){triggerFemale = false;},
				sets: [touchTransformation, specificIndividualTarget, mundaneAnimalSubject],
			},
		]),
		{
			makeTriggerText: function(){return happensOnce ? "If you ever eat meat or another animal product," : "Whenever you eat meat or another animal product,";},
			subjectText: "consumed species", 
			sets: [specificIndividualTarget, mundaneAnimalSubject],
		},
		randomFrom([ // fewer gendered human touch triggers
			{
				makeTriggerText: function(){return happensOnce ? "When you next touch a man,": "Whenever you touch a man";},
				subjectText: "touched man", 
				chosen: function(){triggerFemale = false;},
				sets: [touchTransformation, specificIndividualTarget, subjectIsHuman]
			},
			{
				makeTriggerText: function(){return happensOnce ? "When you next touch a woman": "Whenever you touch a woman";},
				subjectText: "touched woman", 
				chosen: function(){triggerFemale = true;},
				sets: [touchTransformation, specificIndividualTarget, subjectIsHuman]
			},
		]),
		{
			makeTriggerText: function(){
				return String.format(happensOnce ? "When you next touch {0},": "Whenever you touch {0},",
				randomFrom(["someone", "your best friend", "your romantic partner", "a stranger in public", "your boss"]));},
			subjectText: "touched person",
			sets: [touchTransformation, specificIndividualTarget, subjectIsHuman],
		},
		{
			makeTriggerText: function(){return happensOnce ? "The next time someone sees your privates,": "Whenever anyone sees your privates,";}, 
			closingRemarkText: randomFrom([
				"I don't think this is what they were expecting when you said \"I'll show you mine.\"",
				"I hope you don't get pantsed anytime soon.",]),
			requires: [nsfw]
		},
		{
			makeTriggerText: function(){return happensOnce ? "The next time you get publicly humiliated,": "Whenever you are embarrassed,";},
			additionalExplaination: happensOnce ? "You transform partially when you're embarrassed." : "The more embarrassed you are, the more you change.",
		},
		{
			makeTriggerText: function(){return happensOnce ? "There exists a phrase, and, if you ever hear it," : "You have a secret key phrase, and whenever you hear it";},
			additionalExplaination: randomFrom([
				"You can't resist dropping hints about the curse's trigger phrase.",
				"You have the curse's trigger phrase tattooed above your ass.",
				"Your rival knows the curse's trigger phrase.",
				"The trigger phrase is any comment about your appearance.",
				"The trigger phrase is any of your online usernames.",
				"The trigger phrase is any compliment directed toward you.",
				"The trigger phrase is any insult directed toward you.",
				"The trigger phrase is the name of the creature you transform into.",
				"The trigger phrase is immediately texted to everyone on your contacts list.",
				"The trigger phrase is your own name."]),
		},
		{
			makeTriggerText: function(){return happensOnce ? "The next time you orgasm," : "Each time you orgasm,";},
			additionalExplaination: "You transform partially when you're aroused.",
			requires: [nsfw]
		},
		{
			makeTriggerText: function(){return happensOnce ? "Immediately after the next time you have sex with someone," : "Each time you have sex with someone,";},
			closingRemarkText: randomFrom([
				"Welp, that's going to be awkward.",
				"How's that for an afterglow?",
				"Hopefully your partner doesn't die of surprise."]),
			sets: [touchTransformation],
			requires: [nsfw]
		},
		{
			makeTriggerText: function(){return happensOnce ? "The next time you see an animal" : "Whenever you see an animal,";},
			subjectText: "sighted animal", 
			sets: [specificIndividualTarget],
		},
		{
			makeTriggerText: function(){
				var costume = String.format("{0} {1}", 
					randomFrom(["a humanoid", "an anthro", "a jolly", subjectArticle, "a polka-dot", "a bright pink", "a neon green", "a day-glow orange", "a bright blue", "a checkerboard-patterned", "a purple", "a glow-in-the-dark"]),
					curse.renderSubjectText());
				return String.format("{0} {1} costume. {2} {3}",
					randomFrom([
						"You will find", 
						"You will be chosen to be your school's new mascot at homecoming. They give you",
						"You will recieve a package in the mail containing"
						]),
					costume,
					happensOnce ? "If you ever wear it," : "Whenever you wear it,",
					randomFrom([
						String.format("the zipper disappears, the fabric turns to flesh, and you find yourself stuck as a cartoonish version of {0}", costume),
						String.format("the costume merges with your flesh, turning you into {0}", costume),
						String.format("the costume merges with your flesh and disappears, leaving you as {0}", costume),
						String.format("the costume's fabric replaces your flesh, leaving you trapped as a giant, animated plushy that looks like {0}", costume),
						String.format("the costume's fabric replaces your flesh, leaving you trapped as an animate version of {0} that is made out of synthetic material", costume)
					])
				)}, 
			transformationText: "",
			chosen: function(){shouldRenderSubjectText = false;},
			sets: [specificIndividualTarget],
			closingRemarkText: randomFrom(["I have the strangest urge to beat you up right now.", "I just want to cuddle you!"])
		},
		{
			makeTriggerText: function(){return happensOnce ? "Tomorrow morning" : String.format("Every {0},", randomFrom(["sunrise", "sunset", "night at midnight"]));},
			chosen: function(){shortDurationOnly = true;},
			closingRemarkText: randomFrom(["You just have to find a new routine.", "I hope you're at your own house.", "That's not that long from now!"])
		},
	];
	
	// =====================
	//    TRANSFORMATIONS
	// =====================
	var transformations = [
		// general transformations
		{
			makeTransformationText:function(){return String.format("you transform into {0}", specificTarget ? "a copy of the" : subjectArticle);},
		},
		{
			makeTransformationText:function(){return String.format("you {0} shift into {1}", 
						randomFrom(["pleasurably", "painfully", "quickly", "slowly"]), specificTarget ? "a copy of the" : subjectArticle);},
			sets: [subjectSexBecomesSpecificTriggerSex]
		},
		{
			makeTransformationText:function(){return String.format("you become {0}", specificTarget ? "a copy of the" : subjectArticle);}, 
			sets: [subjectSexBecomesSpecificTriggerSex]
		},
		randomFrom([ // make head transformations a little less common.
			{
				makeTransformationText:function(){return specificTarget 
					? "an additional head grows beside your own. It's that of the" 
						: "an additional head grows beside your own, and your original head changes to match. The heads are that of a";},
				additionalExplaination: randomFrom([
					specificTarget ? "The new head retains its own mind." : "You have no control over your new head.",
					"You control the additional head fully.",
					"Your personality is split between the heads. One gets your libido and passion, the other gets your logic and restraint.",
					"You get along with your new head like a sibling most of the time, but it's always making sexual advances."]),
				sets: [doNotAssignSubjectSex],
			},			
			{
				makeTransformationText:function(){return String.format("your head transforms into that of {0}", specificTarget ? "the" : subjectArticle);},
				chosen: function(){becomingHybrid = true;},
				sets: [doNotAssignSubjectSex],
				requires: [subjectInhuman],
			},
			{
				makeTransformationText:function(){return String.format("you upside-down transform into {0}", specificTarget ? "a copy of the" : subjectArticle);},
				makeAdditionalExplaination: function(){return String.format(
					"Your new form's head emerges from your crotch, while your own head turns into its new backside. {0}",
					randomFrom([
						"Your conciousness remains confined to your new body's backside, leaving you a helpless passenger. Your body's new owner is horny, mischevious, and has access to your memories.",
						"Your conciousness remains confined to your new body's backside, leaving you a helpless passenger. Your body's new owner appears to be a duplicate of yourself and has no idea you still exist.",
						"The moment when your conciousness shifts from one head to the other is very disorienting.",
						"The moment when your conciousness shifts from one head to the other is very disorienting.",
					]));},
				sets: [subjectSexBecomesSpecificTriggerSex],
				requires: [lewd]
			},
		]),
		{
			makeTransformationText:function(){return String.format("{0} into {1}", happensOnce 
				? "you spend the next 24 hours transforming" : "you transform a little bit more",
			specificTarget ? "a copy of the" : subjectArticle);}, durationText: "",
			closingRemarkText: "I looooove the slow burn.",
			sets: [subjectSexBecomesSpecificTriggerSex]
		},
		{
			makeTransformationText:function(){return String.format("your genitals are replaced by those of {0}", specificTarget ? "the" : subjectArticle);},
			additionalExplaination: randomFrom([
				"You adopt the donor's sex drive.",
				"You adopt the doner's sexual preferences",]),
			requires: [nsfw]
		},
		{
			transformationText: "you switch genders",
			additionalExplaination: randomFrom([
				"You absolutely love your new life.",
				"All your friends start hitting on you, and you're tempted to start dating one of them.",
				"You look like an androgynous version of your old self, but the equipment between your legs is the real deal.",
				"You never quite feel comfortable as your new sex, and often \"crossdress\" to match your original gender.",
				"You find yourself hopelessly attracted to all your friends."]),
			chosen: function(){shouldRenderSubjectText = false;},
			subjectText: "",
			sets: [subjectIsHuman],
			requires: [tfSuppliesOwnSubject]
		},
		{
			makeTransformationText:function(){return String.format("you become a taur version of {0}", specificTarget ? "the" : subjectArticle);},
			sets: [subjectSexBecomesSpecificTriggerSex]
		},
		randomFrom([ // less genital-mouths
			{
				makeTransformationText:function(){return specificTarget 
					? String.format("you grow a copy of the {0}'s genitals in your mouth", curse.renderSubjectText())
					: String.format("your {0} transforms into the {1} of {2} {3}", 
						subjectFemale ? "mouth" : "tongue", subjectFemale ? "pussy" : "penis", subjectArticle, curse.renderSubjectText());},
				sets: [subjectSexBecomesSpecificTriggerSex, determinesRandomSex],
				requires: [lewd],
				chosen: function(){shouldRenderSubjectText = false;},
			},
			{
				makeTransformationText:function(){return String.format("your genitals transform into the mouth of {0}", specificTarget ? "the" : subjectArticle);},
				additionalExplaination: randomFrom([
					"You have no control over your new mouth.",
					"Whatever was between your legs before ends up incorporated into your new mouth.",
					"Whatever was between your legs before ends up incorporated into your original mouth.",
					"Eating is an orgasmic experience."]),
				sets: [doNotAssignSubjectSex],
				requires: [lewd]
			},
		]),
		{
			makeTransformationText:function(){return String.format("you become an sentient sex doll made to look like {0}",
				specificTarget ? "the" : subjectArticle);},
			additionalExplaination: randomFrom([
				"Mental conditioning makes fulfilling your duties a pleasure.",
				"Whenever anyone sees you, they have an urge to use you.",
				"You cannot refuse any command."]),
			sets: [subjectSexBecomesSpecificTriggerSex],
			requires: [nsfw]
		},
		{
			makeTransformationText:function(){return String.format("you swap minds with {0}", specificTarget ? "the" : "the nearest");},
			sets: [subjectSexBecomesTriggerSex, mundaneAnimalSubject]
		},
		{
			makeTransformationText: function() {return String.format("your {0}, and legs transform into those of {1}", 
				randomSelectionFrom(["arms", "hands", "backside", "head"]).join(', '),
				specificTarget ? "the" : subjectArticle)},
			chosen: function(){becomingHybrid = true;},
			sets: [doNotAssignSubjectSex],
		},
		{
			makeTransformationText: function() {return String.format("your {0} transform into {1} tentacles", 
				randomFrom(["arms", "legs", "arms and legs", "arms, legs, and tailbone"]),
				randomFrom(["squid", "octopus", "alien"]))},
			additionalExplaination: randomFrom([
				"You have no control over your new tentacles.",
				"Your tentacles constantly produce slime.",
				"You find controlling your new tentacles to be very intuitive.",
				"Your tentacles dry out if you don't moisten them regularly.",
				nsfwSelected || lewdSelected ? "Whenever you're not paying attention to your tentacles, they creep toward your privates and start massaging them." 
					: "Your new tentacles are exceptionally large.",
				lewdSelected ? "The tips of your tentacles are erogenous zones." 
					: "Your tentacles can't stay still for long."]),
			chosen: function(){shouldRenderSubjectText = false; becomingHybrid = true;},
			subjectText: "",
			sets: [doNotAssignSubjectSex],
			requires: [subjectInhuman, tfSuppliesOwnSubject],
		},
		// Inhuman transformations
		{
			makeTransformationText:function(){return String.format("you transform into an anthro version of {0}", specificTarget ? "the" : subjectArticle);},
			chosen: function(){becomingHybrid = true;},
			requires: [subjectInhuman],
		},
		{
			makeTransformationText:function(){return String.format("you grow the tail and {0} of {1}", extemitiesName, specificTarget ? "the" : subjectArticle);},
			chosen: function(){becomingHybrid = true;},
			sets: [doNotAssignSubjectSex],
			requires: [subjectInhuman],
		},
		{
			makeTransformationText:function(){return String.format("you transform into a {0} version of {1}",
				isDecided(subjectFemale) ? subjectFemale ? "monstergirl" : "monsterboy" : "kemono",
				specificTarget ? "the" : subjectArticle);},
			closingRemarkText: randomFrom([
				"Just inhuman enough for mass appeal.", "How kawaii!"]),
			chosen: function(){becomingHybrid = true;},
			requires: [subjectInhuman],
		},
		{
			makeTransformationText:function(){return String.format("you become an inflatable pool toy shaped like {0}", specificTarget ? "the" : subjectArticle);},
			closingRemarkText: randomFrom([
				"What are you going to do in the winter?", 
				"Hopefully you can warn people ahead of time.",
				"I'd put my lips on your nozzle ;)",
				"I've always wondered what it feels like to get inflated. You'll have to tell me."]),
			makeAdditionalExplaination: function() {return randomFrom([
				"You go unconcious when deflated.",
				"You can still move when transformed.", 
				"Everyone loves playing with you.",
				lewdSelected || nsfwSelected ? "Your asshole turns into your new nozzle." 
					: "Your nozzle is in the place of your belly button.",
				"Your valve is an erogenous zone"])},
			requires: [subjectInhuman],
		},
		{
			makeTransformationText:function(){return randomFrom([
				String.format("your {0} turn into the {1} of {2}", 
					randomFrom(["hands", "feet"]), extemitiesName, specificTarget ? "the" : subjectArticle),
				String.format("you sprout the tail of {0}", 
					specificTarget ? "the" : subjectArticle)]);},
			additionalExplaination: happensOnce 
				? "Over the next year, the rest of your body transforms to match." 
				: "Each time you transform, an additional bodypart also changes.",
			chosen: function(){becomingHybrid = true;},
			sets: [doNotAssignSubjectSex],
			requires: [subjectInhuman],
		},
		{
			makeTransformationText:function(){return String.format("you become {0} {1} from the waist down",
				specificTarget ? "the" : subjectArticle, curse.renderSubjectText());},
			chosen: function(){shouldRenderSubjectText = false; becomingHybrid = true;},
			requires: [subjectInhuman],
		},
		// touch transformations
		{
			makeTransformationText:function(){return randomFrom([
				"you merge with them, becoming a two-headed hybrid",
				String.format("you merge with them, becoming the {0} of a new taur",
					randomFrom(["top half", "bottom half"]))])
			},
			chosen: function(){shouldRenderSubjectText = false;},
			closingRemarkText: "I hope you really liked them.",
			sets: [subjectSexBecomesTriggerSex, becomingCreatureHybrid],
			requires: [touchTransformation],
		},
		{
			makeTransformationText:function(){return String.format("you merge with them, becoming their new {0}",
				isUndecided(triggerFemale) ? "genitals" : triggerFemale ? "pussy" : "penis");},
			additionalExplaination: randomFrom([
				"You don't lose your eyes when you merge. They remain above your host's junk, taking in the views and looking pretty upset.",
				"You can exert some control over your host's libido.",
				"You can communicate with your host mentally and access their senses.",
				"Your new host doesn't remember the transformation."]),
			chosen: function(){shouldRenderSubjectText = false;},
			sets: [subjectSexBecomesTriggerSex],
			requires: [touchTransformation, lewd],
		},
	];
	
	var subjects = [
		{
			makeSubjectText: function() {return String.format("{0} member of your favorite species", subjectFemale ? "female" : "male")},
			sets: [determinesRandomSex, mundaneAnimalSubject],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "cow" : "bull" : "cow";}, //[sic] gender-neutral is "cattle" but everyone just calls them cows
			closingRemarkText: "Uhh. . . Moo?",
			chosen: function(){extemitiesName = "hooves";},
			makeAdditionalExplaination: function(){return decidedAndTrue(subjectFemale)
				? "You also have an udder and give milk." 
				: "You hate the color red, and you find cows strangely alluring.";},
			sets: [determinesRandomSex, mundaneAnimalSubject],
		},
		{
			makeSubjectText: function(){return String.format("{0}{1}",
				randomFrom([
					"rottweiler",
					"doberman",
					"mastiff",
					"great dane",
					"burmese mountain dog",
					"husky"]),
				isDecided(subjectFemale) ? subjectFemale ? " bitch" : " stud" : "");},
			closingRemarkText: randomFrom(["That's a solid breed.","Beg for the biscuit!"]),
			sets: [determinesRandomSex, mundaneAnimalSubject],
		},
		{
			makeSubjectText: function(){return String.format("{0}{1}",
				randomFrom([
					"german shepherd",
					"austrialian shepherd",
					"corgi",
					"labrador",
					"poodle"]),
				isDecided(subjectFemale) ? subjectFemale ? " bitch" : " stud" : "")},
			closingRemarkText: randomFrom(["Do you know any tricks?","Are you going to pretend to be someone's pet?"]),
			sets: [determinesRandomSex, mundaneAnimalSubject],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "doe" : "buck" : "deer";},
			chosen: function(){extemitiesName = "hooves";},
			closingRemarkText: "A noble animal with a great rack.",
			sets: [determinesRandomSex, mundaneAnimalSubject],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "female cat" : "tom cat" :  "cat";},
			sets: [determinesRandomSex, mundaneAnimalSubject],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "fluffy ewe" : "ram" : "sheep";},
			chosen: function(){extemitiesName = "hooves";},
			additionalExplaination: "Your wool needs to be sheared regularly, but it makes great blankets.",
			sets: [determinesRandomSex, mundaneAnimalSubject],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "hen" : "rooster" : "chicken";},
			chosen: function(){extemitiesName = "talons";},
			sets: [determinesRandomSex, mundaneAnimalSubject],
		},
		{
			subjectText: randomFrom(["hawk", "bluebird", "secretary bird"]), 
			chosen: function(){extemitiesName = "talons";},
			requires: [genderAgnostic],
			sets: [mundaneAnimalSubject],
		},
		{
			makeSubjectText: function(){return decidedAndTrue(subjectFemale) ? "vixen" : "fox";},
			closingRemarkText: "I've never understood the appeal of foxes, but I have a feeling you'll appretiate this one.",
			sets: [determinesRandomSex, mundaneAnimalSubject],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "nanny goat" : "billy goat" : "goat";},
			chosen: function(){extemitiesName = "hooves";},
			makeAdditionalExplaination: function(){return decidedAndTrue(subjectFemale) 
				? "You have a swollen pair of dugs between your legs that must be milked twice a day."
				: "Your pupils are horizontal, and you attract the attention of a lot of cultists.";},
			closingRemarkText: "Maybe it'll make you a better climber.",
			sets: [determinesRandomSex, mundaneAnimalSubject],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "she-bear" : "he-bear" : "bear";},
			requires: [mundaneAnimalSubject],
			sets: [determinesRandomSex],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "zebra mare" : "zebra stallion" : "zebra";},
			chosen: function(){extemitiesName = "hooves";},
			requires: [mundaneAnimalSubject],
			sets: [determinesRandomSex],
		},
		{
			subjectText: "snow leopard",
			requires: [genderAgnostic],
			sets: [mundaneAnimalSubject],
		},
		{
			makeSubjectText: function() {return String.format(randomFrom(["tiger{0}", "lion{0}"]), 
				decidedAndTrue(subjectFemale) ? "ess" : "")},
			requires: [genderAgnostic],
			sets: [mundaneAnimalSubject],
		},
		{
			subjectText: "hyena",
			makeAdditionalExplaination: function(){return decidedAndTrue(subjectFemale) 
				? "You have a pseudopenis, complete with a fatty sack standing in for testicles." 
				: "Remember: male hyenas are submissive to the females.";},
			closingRemarkText: "Yeen Queen is my favorite band!",
			requires: [genderAgnostic],
			sets: [mundaneAnimalSubject],
		},
		{
			subjectText: "squirrel",
			additionalExplaination: randomFrom([
				"You become twitchy and skittish.",
				lewdSelected || nsfwSelected ? "You develop a strange fascination with caressing, licking, and sucking people's nuts." : "You have a strange craving for nuts.",
			]),
			requires: [genderAgnostic],
			sets: [mundaneAnimalSubject],
		},
		{
			subjectText: "kangaroo",
			makeAdditionalExplaination: function(){return decidedAndTrue(subjectFemale) 
				? "Each hop causes a lot of jiggling." 
				: "Walking and running become more difficult than hopping.";},
			closingRemarkText: "G'day, mate!",
			requires: [genderAgnostic],
			sets: [mundaneAnimalSubject],
		},
		{
			subjectText: randomFrom(["monkey", "baboon", "lemur"]),
			closingRemarkText: "Maybe you should try living in a treehouse.",
			requires: [genderAgnostic],
			sets: [mundaneAnimalSubject],
		},
		{
			subjectText: "squid",
			chosen: function(){extemitiesName = "spades";},
			requires: [genderAgnostic],
			sets: [mundaneAnimalSubject],
		},
		{
			subjectText: "skunk",
			closingRemarkText: "Do you smell something?",
			additionalExplaination: randomFrom([
				"You spray reflexively when startled.",
				"You find cats strangely alluring."]),
			requires: [genderAgnostic],
			sets: [mundaneAnimalSubject],
		},
		{
			subjectText: "otter", 
			chosen: function(){extemitiesName = "webbed paws"; subjectArticle = "an"},
			requires: [genderAgnostic],
			sets: [mundaneAnimalSubject],
		},
		{
			subjectText: "closest pet", 
			chosen: function(){specificTarget = true;},
			closingRemarkText: "Is it better or worse if it's your own pet?",
			requires: [genderAgnostic, nonSpecificSubject],
			sets: [mundaneAnimalSubject],
		},
		randomFrom([
			{
				subjectText: randomFrom(["whale", "dolphin"]), 
				chosen: function(){extemitiesName = "fins";},
				makeAdditionalExplaination: function() {return randomFrom([
					"A fishy smell follows you around.",
					"Your rubbery skin must be moistened regularly.",
					lewdSelected && decidedAndFalse(subjectFemale) ? "Your penis is prehensile, but it often moves with a mind of its own." : ""]);},
				requires: [genderAgnostic],
				sets: [mundaneAnimalSubject],
			},
			{
				subjectText: randomFrom(["goldfish", "catfish"]), 
				chosen: function(){extemitiesName = "fins";},
				makeAdditionalExplaination: function() {return randomFrom([
					"A fishy smell follows you around.",
					"You have both gills and lungs, allowing you to live comfortably in the water and on land.",
					lewdSelected && decidedAndFalse(subjectFemale) ? "You cum whenever you smell fish eggs." : ""]);},
				requires: [genderAgnostic],
				sets: [mundaneAnimalSubject],
			}
		]),
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "jenny" : "jackass": "donkey";}, 
			chosen: function(){extemitiesName = "hooves";},
			closingRemarkText: randomFrom([
				"Too bad it had to be such an awkward animal.",
				"Don't make an ass out of yourself."]),
			sets: [determinesRandomSex, mundaneAnimalSubject],
		},
		{
			subjectText: randomFrom(["bee", "spider", "scorpion"]),
			chosen: function(){extemitiesName = "pointed legs";},
			requires: [genderAgnostic],
			sets: [mundaneAnimalSubject],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "mare" : "stallion" : "horse";}, 
			chosen: function(){extemitiesName = "hooves";},
			sets: [determinesRandomSex, mundaneAnimalSubject],
		},
		{
			subjectText: randomFrom(["komodo dragon", "skink", "newt"]), 
			chosen: function(){extemitiesName = "claws";},
			requires: [genderAgnostic],
			sets: [mundaneAnimalSubject],
		},
		{
			subjectText: "anaconda", 
			chosen: function(){subjectArticle = "an"; extemitiesName = "nothings";},
			closingRemarkText: "Just as I like 'em: thick and slithery.",
			requires: [genderAgnostic],
			sets: [mundaneAnimalSubject],
		},
		{
			subjectText: "last animal you touched", 
			chosen: function(){specificTarget = true;},
			requires: [genderAgnostic, nonSpecificSubject],
			sets: [mundaneAnimalSubject],
		},
		{
			subjectText: "last animal you ate", 
			chosen: function(){specificTarget = true;},
			closingRemarkText: randomFrom([
				"Sample any exotic meats lately?",
				"Mmm-mm. This beef tastes just like you."]),
			requires: [genderAgnostic, nonSpecificSubject],
			sets: [mundaneAnimalSubject],
		},
		{
			subjectText: "last fantasy creature you killed in a video game", 
			chosen: function(){specificTarget = true;},
			closingRemarkText: "Mana really does flow from computer monitors these days.",
			sets: [specificIndividualTarget, subjectInhuman],
			requires: [genderAgnostic, nonSpecificSubject, nonMundaneSubject],
		},
		{
			subjectText: "current year's Chinese zodiac animal", 
			sets: [specificIndividualTarget, subjectInhuman],
			requires: [genderAgnostic, nonSpecificSubject, nonMundaneSubject],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "dire wolf bitch": "dire wolf stud" : "dire wolf";},
			sets: [subjectInhuman, determinesRandomSex],
			requires: [nonMundaneSubject],
		},
		{
			subjectText: "Chinese zodiac animal assigned to you at birth", 
			sets: [specificIndividualTarget, subjectInhuman],
			requires: [genderAgnostic, nonSpecificSubject, nonMundaneSubject],
		},
		{
			makeSubjectText: function(){return String.format("{0} {1}-{2}", 
				randomFrom([
					"purple", "green", "red", "pink", "blue"
				]),
				randomFrom(["goo", "slime", "jelly"]),
				isDecided(subjectFemale) ? subjectFemale ? "girl": "boy" : "person");},
			additionalExplaination: randomFrom([
				lewdSelected ? "You can form fully-sensitive reproductive organs anywhere on your body."
					: "Holding your form takes a lot of concentration.",
				"Whenever you relax, you melt into a puddle.", 
				nsfwSelected || lewdSelected ?  "Contact with your body causes arousal."
					: "Contact with your body causes drowsiness.", 
				"You can alter your body shape, \"hair\", and facial features with a little effort.", 
				"You control the viscosity of each part of your body individually.", 
				]),
			closingRemarkText: "Seems kind of messy to me.",
			sets: [determinesRandomSex, subjectInhuman],
			requires: [notBecomingHybrid, nonMundaneSubject]
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "dragoness": "drake" : "dragon";},
			additionalExplaination: randomFrom([
				"You have a lust for hoarding treasure that is impossible to ignore.",
				"You become hopelessly narcissistic.", 
				"You have an uncanny ability to get others to follow your orders.", 
				"People who spend a lot of time near you slowly transform into obedient kobold slaves.", 
				]),
			closingRemarkText: "I said you looked lucky, didn't I?",
			sets: [determinesRandomSex, subjectInhuman],
			requires: [nonMundaneSubject],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "unicorn mare": "unicorn stallion" : "unicorn";},
			chosen: function(){extemitiesName = "hooves";},
			sets: [determinesRandomSex, subjectInhuman],
			requires: [nonMundaneSubject],
		},
		{
			subjectText: "kobold",
			closingRemarkText: randomFrom(["I think you'll be adorable.", "I love those thick, lizardy tails!"]),
			sets: [subjectInhuman],
			requires: [genderAgnostic, nonMundaneSubject],
		},
		{
			subjectText: "wyvern",
			closingRemarkText: "Is trading your hands for the power of flight worth it?",
			sets: [subjectInhuman],
			requires: [genderAgnostic, nonMundaneSubject],
		},
		{
			subjectText: "sea serpent",
			sets: [subjectInhuman],
			requires: [genderAgnostic, nonMundaneSubject],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "demoness": "demon" : "demon";},
			sets: [subjectInhuman, determinesRandomSex],
			requires: [notBecomingHybrid, nonMundaneSubject],
			chosen: function(){extemitiesName = "claws";},
		}, 
		{
			subjectText: "last character you played in a video game", 
			closingRemarkText: "Mana really does flow from computer monitors these days.",
			sets: [specificIndividualTarget, subjectInhuman],
			requires: [genderAgnostic, nonSpecificSubject, notBecomingHybrid, nonMundaneSubject],
		},
		{
			subjectText: "goblin", 
			chosen: function(){extemitiesName = "hands";},
			sets: [subjectInhuman],
			requires: [genderAgnostic, notBecomingHybrid, nonMundaneSubject],
		},
		{
			subjectText: "orc", 
			chosen: function(){extemitiesName = "hands";},
			sets: [subjectInhuman],
			requires: [genderAgnostic, notBecomingHybrid, nonMundaneSubject],
		},
		{
			subjectText: "sphinx",
			sets: [subjectInhuman],
			requires: [genderAgnostic, notBecomingHybrid, nonMundaneSubject],
		},
		{
			subjectText: "naga",
			sets: [subjectInhuman],
			requires: [genderAgnostic, notBecomingHybrid, nonMundaneSubject],
		},
		{
			subjectText: "cerberus",
			sets: [subjectInhuman],
			requires: [genderAgnostic, notBecomingHybrid, nonMundaneSubject],
			closingRemarkText: "Stop fighting with yourself!",
		},
		{
			makeSubjectText: function(){return !isDecided(subjectFemale) ? "mer-person" : subjectFemale ? "mermaid": "mer-man";},
			closingRemarkText: "Something smells fishy.",
			sets: [determinesRandomSex, subjectInhuman],
			requires: [notBecomingHybrid, nonMundaneSubject],
		},
		{
			makeSubjectText: function(){return decidedAndTrue(subjectFemale) ?  "gorgon": "minotaur";},
			sets: [determinesRandomSex, subjectInhuman],
			requires: [notBecomingHybrid, nonMundaneSubject],
		},
		{
			makeSubjectText: function(){return decidedAndTrue(subjectFemale) ? "succubus": "incubus";},
			sets: [determinesRandomSex, subjectInhuman],
		},
	]
	
	// =======================
	//        DURATIONS
	// =======================
	var durations = [
		{
			durationText: "You remain this way until you have sex.", 
			closingRemarkText: "Don't worry, I think you're plenty charming. You'll be back to normal in no time.",
			requires: [nsfw]
		},
		{
			durationText: "You remain this way until you can convince someone to kiss you.",
			closingRemarkText: "You're lucky I didn't say the person kissing had to be a princess."
		},
		{
			durationText: "You remain this way until you reveal your curse to someone new.",
			closingRemarkText: randomFrom(["Who will you show first?",
					"How many times before you run out of people you trust?", 
					"I hope the people you tell don't use their knowledge against you."])
		},
		{
			durationText: "You remain this way until you have sex with someone.", 
			requires: [nsfw]
		},
		{
			makeDurationText: function() {return String.format("You revert to your old self in {0} hours, but, if you {1}, the transformation becomes permanant.",
				randomFrom(["two", "four", "six", "twelve"]),
				randomFrom([
					"have sex", 
					decidedAndTrue(subjectFemale) ? "get pregnant" : "reproduce", 
					"orgasm",
					"are seen by someone else you know"]));},
			closingRemarkText: "I'm sure you won't have any trouble resisting the urge to stay that way forever.",
			requires: [nsfw],
		},
	]
	var longDurations = [
		{
			durationText: "You remain this way for 24 hours.",
			closingRemarkText: "You get to experience everything the day has to offer."
		},
		{
			durationText: "You return to normal after one week.",
			closingRemarkText: "I've noticed you've been taking a lot of one-week vacations lately. . ."
		},
		{
			durationText: String.format("You remain this way until you have been owned by a human for at least a {0}.", 
				randomFrom(["week", "month", "year"])),
			closingRemarkText: "You'd better learn to follow commands and be docile. Don't want them to get rid of you.",
			requires: [mundaneAnimalSubject],
		},
		{
			durationText: "You return to normal in one year.",
			closingRemarkText: "Just when you were getting used to living your new life, you turn back. I love it."
		},
		{
			durationText: "You return to normal after one day, but each transformation lasts twice as long as the last.",
			closingRemarkText: "The more you like it, the more dangerous it is."
		},
		{
			durationText: "You will return to normal in a week, but each time you orgasm, the duration is increased by a day.", 
			requires: [nsfw]
		},
		{
			makeDurationText: function(){return isUndecided(subjectFemale) ? "Your original form can only be restored by reproducing." : 
				subjectFemale ? "Your original form can only be restored by giving birth." : "Your original form can only be restored by siring young.";},
			requires: [nsfw]
		},
		{
			makeDurationText: function(){return isUndecided(subjectFemale)
				? "You remain this way until you have sex with 5 different people." 
				: subjectFemale ? "You will be restored to your original form once 5 people cum inside of you." 
					: "You will be restored to your original form once you cum inside 5 people.";},
			requires: [lewd]
		},
		{
			makeDurationText: function() {return String.format(
				"You remain this way until you have sex with {0} {1}.",
				subjectArticle,
				renderOppositeSex(curse.renderSubjectText));},
			closingRemarkText: randomFrom([
				"It's not really amoral if you're the same species, right?",
				"It's okay. I don't think anyone will judge you."
			]),
			requires: [lewd, mundaneAnimalSubject],
		},
	]

	var complications = [
		{
			// Double complications
			makeComplicationText: function(){
				var comp1 = selectAnother(filterComponents(complications));
				var comp2 = selectAnother(filterComponents(complications));
				var compText1 = comp1.complicationText == null ? comp1.makeComplicationText() : comp1.complicationText;
				var compText2 = comp2.complicationText == null ? comp2.makeComplicationText() : comp2.complicationText;
				return String.format("<br></p><p>{0} {1}", 
					compText1,
					compText2);
			},
			requires: [nsfw],

		},
		{
			// Triple complications
			makeComplicationText: function(){
				var comp1 = selectAnother(filterComponents(complications));
				var comp2 = selectAnother(filterComponents(complications));
				var comp3 = selectAnother(filterComponents(complications));
				var compText1 = comp1.complicationText == null ? comp1.makeComplicationText() : comp1.complicationText;
				var compText2 = comp2.complicationText == null ? comp2.makeComplicationText() : comp2.complicationText;
				var compText3 = comp3.complicationText == null ? comp3.makeComplicationText() : comp3.complicationText;
				return String.format("<br></p><p>{0} {1} {2}", 
					compText1,
					compText2,
					compText3,);
			},
			requires: [lewd],

		},
		{
			makeComplicationText: function(){return String.format("{0} must obey the orders of any human.",
				happensOnce ? "You" : "While transformed, you");}
		},
		{
			makeComplicationText: function(){return happensOnce 
				? "No one remembers you being any other way." 
				: "While transformed, everyone thinks you've always been this way.";},
			closingRemarkText: "But you and I will always know the truth. ;)",
		},
		{
			complicationText: "Your sex drive and production of bodily fluids are greatly increased. When you're hungy, you drool. When you're horny, well. . .",
			closingRemarkText: "Does bodily fluids include sweat? That could be kinda gross.",
			requires: [nsfw]
		},
		{
			makeComplicationText: function(){return String.format("Your {0} constantly dripping {1}.", 
				isUndecided(subjectFemale) ? "genitals are" : subjectFemale ? "pussy is" : "penis is",
				isUndecided(subjectFemale) ? "bodily fluids" : subjectFemale ? "fem-lube" : "pre-cum");},
				requires: [lewd]
		},
		{
			complicationText: randomFrom(["Your curse is sexually transmittable.", "People you come in contact with catch your curse like the common cold."]),
			closingRemarkText: "It won't be long before prospective lovers ask each other to get tested for it.",
			requires: [nsfw]
		},
		{
			complicationText: "Your bodily fluids are a potent aphrodesiac, but you must trick your target into drinking something tainted with them.",
			requires: [nsfw]
		},
		{
			complicationText: "Your pheromones allow you to seduce any creature with a nose.",
			requires: [nsfw]
		},
		{
			complicationText: "Also, you must lay one large egg every day.",
			additionalExplaination: randomFrom([
				"The time of day when you lay your egg is random. A shifting feeling in your belly gives you 30 seconds warning before you drop.",
				"The first time laying is painful. By the end of the first week, it starts to become pleasurable.",
				"Your eggs can be fertilized by any creature. You can tell which ones are carrying young and have an urge to nest on them."]),
			makeClosingRemarkText: function(){return String.format("Does that mean you have a cloaca now? {0}", 
				randomFrom(["Weird.", "Cool!", "Fascinating.", "Gross.", "Huh."]))}
		},
		{
			complicationText: "Also, you grow an extra pair of breasts.",
			closingRemarkText: "An extra pair of tits never hurt anyone.",
			requires: [nsfw]
		},
		{
			makeComplicationText: function(){return String.format("You grow {0} extra pairs of breasts.", 
				randomFrom(["two", "three", "four", "five"]));},
			requires: [lewd]
		},
		{
			complicationText: decidedAndTrue(subjectFemale) ? "A penis grows above your pussy." : "You grow an additional penis.", 
			requires: [lewd],
		},
		{
			complicationText: isUndecided(subjectFemale) ? "You grow a pussy." : subjectFemale ? "You grow an additional pussy next to your first." : "Your taint splits open to reveal a freshly formed pussy.", 
			requires: [lewd], 
			sets: [subjectIsFemale]
		},
		{
			complicationText: "Your wardrobe changes to accomodate your new form."
		},
		{
			complicationText: "No one seems to think your new curse is at all unusual."
		},
		{
			complicationText: "Your current romantic interest is afflicted with a similar curse.",
			closingRemarkText: "At least you have a friend.",
		},
		{
			makeComplicationText: function(){return String.format(
				"If you weren't before, you are now {0}.", randomFrom(["bisexual", "gay"]));}
		},
		{
			makeComplicationText: function(){return String.format(
				"{0} a hermaphrodite.", happensOnce ? "You become" : "While transformed, you are");},
			sets: [determinesRandomSex],
			requires: [lewd]
		},
		{
			makeComplicationText: function(){return String.format(
				"{0} {1}", happensOnce ? "You become" : "While transformed, you are",
				isUndecided(subjectFemale) || subjectFemale ? "kinda, like, an air-headed bimbo." : "a meat-headed hunk.");},
		},
		{
			makeComplicationText: function(){return happensOnce 
				? "You don't quite remember your life before the transformation" 
				: "While transformed, you don't remember being any other way."}
		},
		{
			makeComplicationText: function(){return String.format("After your transformation, {0}",
				isUndecided(subjectFemale) ? "you feel compelled to reproduce until you are successful." : 
					subjectFemale ? "you feel a kicking and realize you're pregnant!" 
					: "the nearest female becomes pregnant with your children.");},
			requires: [nsfw]
		},
		{
			makeComplicationText: function(){return happensOnce 
				? "Your sex drive is supercharged." : "While transformed, you are always horny.";},
			requires: [nsfw]
		},
		{
			makeComplicationText: function(){return isUndecided(subjectFemale) 
				? "Your genitals are oversized." : 
					subjectFemale ? "Your pussy is oversized and gets dripping wet whenever you're aroused." 
					: "Your penis is exceptionally large, and there's no way to hide it.";},
			requires: [lewd]
		},
		{
			complicationText: "You and the relevant species experience a mutual attraction.",
			requires: [nsfw, mundaneAnimalSubject]
		},
		{
			complicationText: "You can speak to other members of the relevant species.",
			requires: [mundaneAnimalSubject],
		},
		{
			makeComplicationText: function() {return String.format("The longer you remain transformed, the more your thoughts become the simple instincts of {0} {1}.",
				subjectArticle,
				curse.renderSubjectText());},
			requires: [mundaneAnimalSubject],
		},
		{
			makeComplicationText: function(){return String.format(
				"{0} lose your ability to read and write", happensOnce ? "You" : "While transformed, you");},
			requires: [mundaneAnimalSubject],
		},
		{
			complicationText: "You retain your ability to speak English.",
			requires: [subjectInhuman],
		},
		{
			complicationText: "You get all the instincts of the relevant species and can't resist acting on them.",
			requires: [subjectInhuman],
		},
		{
			makeComplicationText: function(){return happensOnce 
				? "You are sold to a rich, private collector who uses you for his own entertainment."
				: "While in human form, you retain some parts of your other form.";},
			requires: [subjectInhuman],
		},
		{
			makeComplicationText: function(){return happensOnce 
				? "You are captured for scientific research. Most tests seem to be focused around reproduction." : "Each time you revert to human, you retain more parts of your other form.";},
			requires: [subjectInhuman],
		},
		{
			complicationText: "You gain the memories of the other person.",
			closingRemarkText: "Pilfer their dirty secrets.",
			requires: [subjectIsHuman],
		},
		{
			complicationText: "Whenever the other person becomes aroused, you are as well. And vice-versa.",
			requires: [nsfw, subjectIsHuman],
		},
		{
			complicationText: "Whenever the other person orgasms, so do you. And vice-versa.",
			requires: [nsfw, subjectIsHuman],
		},
		{
			complicationText: "You cannot refuse orders from the other person.",
			requires: [subjectIsHuman],
		},
	]
	
	var generalClosingRemarks = [
		{closingRemarkText: "That might be pretty difficult to hide. . ."},
		{closingRemarkText: "Do you think you'll be able to live a normal life like that?"},
		{closingRemarkText: "So. . . are you going to tell anyone you know about it?"},
		{closingRemarkText: "How could you possibly adapt?"},
		{closingRemarkText: "I wonder if you can use that as a way to make money. . ."},
		{closingRemarkText: "Guess I was wrong about you being lucky."},
		{closingRemarkText: "Ooof. Well, not everyone gets off that easy."},
		{closingRemarkText: "I think I'll like you more this way."},
		{closingRemarkText: "I think people will like you more this way."},
		{closingRemarkText: "You may have to get a new job."},
		{closingRemarkText: "That might be kinda fun."},
		{closingRemarkText: "You'll come around to it eventually."},
	]
	
	// Code start
	if (happensOnce) {
		updateCurse(curse, {durationText: "The transformation is permanent."});
	}

	/*// TEST Subjects
	var subjects = buildSubjects(imaginarySpeciesAllowed);
	for (var i = 0; i < subjects.length; i++) {
		if (subjects[i].makeSubjectText == null) {
			console.log(subjects[i].subjectText);
		} else {
			console.log(subjects[i].makeSubjectText());
		}
	}*/
	

	var chosenTrigger = randomFrom(filterComponents(triggers));
	updateCurse(curse, chosenTrigger);
	
	var chosenTransformation = randomFrom(filterComponents(transformations));
	if (curse.renderTransformationText == null) {
		updateCurse(curse, chosenTransformation);
	}

	var chosenSubject = randomFrom(filterComponents(subjects));
	if (curse.renderSubjectText == null) {
		updateCurse(curse, chosenSubject);
	}

	var chosenDuration = randomFrom(buildDurations());
	if (curse.renderDurationText == null) {
		updateCurse(curse, chosenDuration);
	}

	var chosenComplication = null;
	if (curse.renderComplicationText == null) {
		var chance = lewdSelected ? .8 : nsfwSelected ? .35 : .15;
		if(Math.random() < chance) {
			chosenComplication = randomFrom(filterComponents(complications));
		} else {
			chosenComplication = {complicationText:""};
		}
		updateCurse(curse, chosenComplication);
	}
	if (curse.renderClosingRemarkText == null) {
		if(Math.random() < .3) {
			updateCurse(curse, randomFrom(filterComponents(generalClosingRemarks)));
		}
	}
	return {curseText: curse.renderText(), circeText: curse.renderCirceText()};

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

function randomFrom(array) {
	return array[Math.floor(Math.random()*array.length)];
}

function randomSelectionFrom(array) {
	const shuffled = array.sort(() => 0.5 - Math.random());
	var selection = shuffled.slice(0, Math.floor(Math.random()*shuffled.length));
	if (selection.length == 0) {
		// fuck it
		return randomSelectionFrom(array);
	}
	return selection;
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
