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
const tgOption = {
	shouldFilter: function() {return !tgSelected;},
}
const humanOption = {
	shouldFilter: function() {return !humansSelected;},
}
const humanoidOption = {
	shouldFilter: function() {return !humanoidsSelected;},
}
const beastOption = {
	shouldFilter: function() {return !beastsSelected;},
}
const inanimateOption = {
	shouldFilter: function() {return !inanimateSelected;},
}
const mentalOption = {
	shouldFilter: function() {return !mentalSelected;},
}
const extantCreaturesAllowed = {
	shouldFilter: function() {return !beastsSelected && !humansSelected;},
}
const humanoidOrBeastOption = {
	shouldFilter: function(){return !humanoidsSelected && !beastsSelected;},
	onChoice: function() {},
}



var generation = 0;
var sfwSelected = false;
var nsfwSelected = false;
var lewdSelected = false;
var maleSelected= false;
var femaleSelected = false;
var otherSexSelected = false;
var humansSelected = true;
var humanoidsSelected = true;
var beastsSelected = true;
var inanimateSelected = true;
var mentalSelected = true;
var tgSelected = true;

$(document).ready(function() {
    $("#goButton").click(function(){
		// curse counter
		fetch("https://www.freevisitorcounters.com/en/home/counter/588546/t/3", {credentials: "omit", mode: 'no-cors',});
		updateOptionStatuses();
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

function updateOptionStatuses() {
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
	inanimateSelected = document.getElementById("inanimateCheckbox").checked;
	mentalSelected = document.getElementById("mentalCheckbox").checked;
	tgSelected = document.getElementById("transgenderCheckbox").checked;
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
			curse.additionalExplainations.push(function() {return update.additionalExplaination;});
		}
		if (update.makeAdditionalExplaination) {
			curse.additionalExplainations.push(update.makeAdditionalExplaination);
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
		additionalExplainations : [],
		renderClosingRemarkText: null,
		
		renderAdditionalExplainations : function () {
			if (this.additionalExplainations.length > 0) {
				var explainations = "";
				for (var i = 0; i < this.additionalExplainations.length; i++) {
					explainations = explainations + " " + this.additionalExplainations[i]();
				}
				return String.format("<br></p><p>{0}", explainations);
			} else {
				return "";
			}
		},

		renderGenderedSubjectText: function() {
			if (renderSubjectGender && !specificTarget) {
				return String.format("{0} {1}",
					decidedAndTrue(subjectFemale) ? "female" : "male",
					curse.renderSubjectText());
			}
			return curse.renderSubjectText();
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
				shouldRenderSubjectText ? this.renderGenderedSubjectText() : "",
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
	
	function renderUndecidedSex(method) {
		tempFemale = subjectFemale;
		subjectFemale = null;
		var output = method();
		subjectFemale = tempFemale;
		return output;
	}
	
	var subjectArticle = "a";
	var happensOnce = (Math.random() <0.2); // 20% chance, more with some triggers that force it.
	var shouldRenderSubjectText = true;
	var shortDurationOnly = false;
	var extemitiesName = "paws";
	var facialFeatureName = "ears";
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
	// 	subject* = status of the transformation's end result
	//  target* = status of the target / other participant (if applicable)
	//  starting* = status of user before the curse hits.
	//  a null value signifies that the status is not decided and ambiguous verbage should be used.
	//  ALL STATUS VARIABLE CHECKS MUST INCLUDE NULL CHECKS FOR THIS REASON.
	//	USE THE decidedAndTrue() and isDecided() CONVENIENCE METHODS FOR CLARITY
	var subjectHuman = null;
	var touchTrigger = false;
	var triggerFemale =  null;
	var startingFemale = maleSelected ? false : femaleSelected ? true : null;
	var subjectFemale = !tgSelected ? startingFemale : null; // if TG is disabled, set the end result sex same as starting.
	var inanimateTF = false;
	var transformationAffectsSubjectSex = true;
	var tfCannotAssignSubject = false;
	var specificTarget = false;
	var isMundaneAnimalSubject = null;
	var subjectHybrid = false;
	var replacingGenitals = null;
	var subjectNonLiving = null;
	var subjectInanimate = null;
	var stagesTF = null;
	var renderSubjectGender = true;
	var singularSubject = null;

	// TAGS
	const tfInStages = {
		shouldFilter: function(){return !isDecided(stagesTF) || decidedAndFalse(stagesTF);},
		onChoice: function() {stagesTF = true},
	}
	const tfAtomic = {
		shouldFilter: function(){return decidedAndTrue(stagesTF);},
		onChoice: function() {stagesTF = false},
	}
	const subjectIsNonLiving = {
		shouldFilter: function(){return decidedAndFalse(subjectNonLiving)},
		onChoice: function() {subjectNonLiving = true;
			beastsSelected = true; humanoidsSelected = true; humansSelected = true;} // allow beastial inanimate tfs
	}
	
	const subjectIsInanimate = {
		shouldFilter: function(){return !isDecided(subjectInanimate) || decidedAndFalse(subjectInanimate)},
		onChoice: function() {subjectNonLiving = true; subjectInanimate = true; 
			beastsSelected = true; humanoidsSelected = true; humansSelected = true;} // allow beastial inanimate tfs
	}
	
	const subjectIsLiving = {
		shouldFilter: function(){return decidedAndTrue(subjectInanimate) || decidedAndTrue(subjectNonLiving);},
		onChoice: function() {subjectNonLiving = false; subjectInanimate = false; inanimateSelected = false;}
	}
	
	const subjectIsAnimate = {
		shouldFilter: function(){return decidedAndTrue(subjectInanimate);},
		onChoice: function() {subjectInanimate = false;}
	}
	
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
		shouldFilter: function() {
			return isDecided(startingFemale) 
				&& !tgSelected
				&& ((isDecided(triggerFemale) && triggerFemale != startingFemale) || (isUndecided(triggerFemale)));
		},
		onChoice: function() {if(isDecided(triggerFemale)){subjectFemale = triggerFemale;}}
	}
	
	const subjectSexBecomesSpecificTriggerSex = {
		shouldFilter: function() {
			return isDecided(startingFemale) 
				&& !tgSelected
				&& isDecided(triggerFemale)
				&& triggerFemale != startingFemale;
		},
		onChoice: function() {
			if(isDecided(triggerFemale) && specificTarget){
				subjectFemale = triggerFemale;
			}
		}
	}
	
	const triggerSexBecomesOppositeSubjectSex = {
		shouldFilter: function() {return false;},
		onChoice: function() {if(isDecided(subjectFemale)){triggerFemale = !subjectFemale;}}
	}
	
	const determinesRandomSex = {
		shouldFilter: function(){return false;},
		onChoice: function() {
			if(isUndecided(subjectFemale) && transformationAffectsSubjectSex){
				subjectFemale = Math.random() < 0.5; // 50% chance
			}
			renderSubjectGender = false;
		}, 
	}
	
	const determinesMostlyFemaleSex = {
		shouldFilter: function(){return false;},
		onChoice: function() {
			if(isUndecided(subjectFemale) && transformationAffectsSubjectSex){
				subjectFemale = Math.random() < 0.8; // 80% chance
			}
			renderSubjectGender = false;
		}, 
	}
	
	const subjectIsMale = {
		shouldFilter: function(){return decidedAndTrue(subjectFemale)},
		onChoice: function() {subjectFemale = false;}
	}
	
	const subjectIsFemale = {
		shouldFilter: function(){return decidedAndFalse(subjectFemale);},
		onChoice: function() {subjectFemale = true;}
	}

	const genderAgnostic = {
		shouldFilter: function(){return false;},
		onChoice: function() {renderSubjectGender = true;}
	}
	
	const doNotAssignSubjectSex = {
		shouldFilter: function(){return false;},
		onChoice: function() {transformationAffectsSubjectSex = false;}
	}

	const subjectTransformation = {
		shouldFilter: function(){return false;},
		onChoice: function() {tfCannotAssignSubject = true;}
	}

	const tfSuppliesOwnSubject = {
		shouldFilter: function(){return decidedAndTrue(tfCannotAssignSubject);},
		onChoice: function() {}
	}

	const specificIndividualTarget = {
		shouldFilter: function(){return decidedAndFalse(specificTarget);},
		onChoice: function() {specificTarget = true; subjectArticle = "the"; singularSubject = true;}
	}
	
	const oneSubject = {
		shouldFilter: function(){return decidedAndFalse(singularSubject);},
		onChoice: function() {singularSubject = true;}
	}

	const varyingSubject = {
		shouldFilter: function(){return decidedAndTrue(singularSubject);},
		onChoice: function() {singularSubject = false;}
	}
	
	const mundaneAnimalSubject = {
		shouldFilter: function(){return decidedAndFalse(isMundaneAnimalSubject) || decidedAndTrue(subjectHuman) || !isDecided(mundaneAnimalSubject);},
		onChoice: function() {subjectHuman = false; isMundaneAnimalSubject = true;}
	}

	const nonMundaneSubject = {
		shouldFilter: function(){return decidedAndTrue(isMundaneAnimalSubject);},
		onChoice: function() {subjectHuman = false;  isMundaneAnimalSubject = false;}

	}
	
	const becomingCreatureHybrid = {
		shouldFilter: function(){return !isDecided(subjectHybrid) || subjectHybrid == false;},
		onChoice: function() {subjectHybrid = true; beastsSelected = true; humansSelected = false;} // beasts are allowed for hybrids
	}

	const notBecomingHybrid = {
		shouldFilter: function(){return decidedAndTrue(subjectHybrid)},
		onChoice: function() {subjectHybrid = false;}
	}
	
	const genitalReplacementAllowed = {
		shouldFilter: function(){return decidedAndTrue(replacingGenitals)},
		onChoice: function() {}
	}
	
	const replacesGenitals = {
		shouldFilter: function(){return false;},
		onChoice: function() {replacingGenitals = true;}
	}
	const setPussyName = function(newPussyName) {
		return {
			shouldFilter: function(){return false;},
			onChoice: function() {pussyName = newPussyName;},
		}
	}
	const setDickName = function(newDickName) {
		return {
			shouldFilter: function(){return false;},
			onChoice: function() {dickName = newDickName;},
		}
	}
	const allowBeastsIfHumanoid = {
		shouldFilter: function(){return false;},
		onChoice: function() {if (humanoidsSelected){beastsSelected = true;}},
	}
	const subjectCanBeFemale = {
		shouldFilter: function(){return decidedAndFalse(startingFemale) && !tgSelected;},
		onChoice: function() {},
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
			makeTriggerText: function() {return String.format("{0}When {1}, you take a pregnancy test. It comes back positive. As your pregnancy progresses,",
				randomFrom([
					"You wake up tomorrow feeling queasy. ",
					"You notice that you're eating a lot more than usual. ",
					"Your chest feels sore. ",
					decidedAndFalse(startingFemale) ? String.format("You wake up with the {0} of {1} {2} between your legs. ",
						pussyName, subjectArticle, curse.renderSubjectText()) : "",
					decidedAndFalse(startingFemale) ? "You wake up to find you've grown a pair of breasts. " : "",
					"",
				]),
				randomFrom([
					"your belly starts to descend",
					"you feel a kicking in your tummy",
					"your nipples leak droplets of milk",
					"your stomach grows so large you can no longer fit into your pants",
					"something starts moving inside your belly",
				])
			);},
			makeDurationText: function() {return String.format("The pregnancy lasts {0}, and by the time you go into labor, you are fully transformed.",
				randomFrom(["nine months", "just one hour", "just one day", "a year", "six months", "three months"]));},
			makeAdditionalExplaination: function() {return String.format("You give birth to {0}.{1}",
				randomFrom([
					String.format("{0} {1}",renderUndecidedSex(curse.renderSubjectText), randomFrom(["twins", "triplets", "quadruplets"])),
					String.format("{0} {1}", randomFrom(["a baby", "an adorable little", "a full-grown", "a roudy little"]), curse.renderGenderedSubjectText())]),
				randomFrom([
					String.format("{0} {1} {2}.",
						" You immediately crave the same foods as",
						subjectArticle,
						curse.renderSubjectText()),
					" You have an urge to get pregnant again as soon as possible.",
					" You're willing to do whatever it takes to be a good mom.",
					" A few weeks later, you realize you're pregnant again!",
					"",
				])
			)},
			chosen: function(){happensOnce = true;},
			requires: [humanoidOrBeastOption, nsfw, subjectCanBeFemale],
			sets: [subjectIsFemale, subjectIsLiving, tfInStages, subjectTransformation, oneSubject],
		},
		{
			// SCENARIO TRIGGER: touch animal
			makeTriggerText: function(){
				var drawAndTrigger = [
						["They are always happy to see you", happensOnce ? "upset them" : "pet them"],
						["They never leave you alone", "escape them"]
				]; 
				if (lewdSelected) {
					drawAndTrigger.push(["You find yourselves hopelessly attracted to each other", "give in to temptation and have sex with them"]);
					drawAndTrigger.push(triggerFemale ? ["They are prone to entering intense, sexual heats where they produce pheromones that you find irresistibly arousing", "give in to temptation and try having sex with them"]
						: ["They are prone to entering intense, sexual heats where they view you as a potential mate", "touch their penis"]);
				}
				if (nsfwSelected || lewdSelected) {
					drawAndTrigger.push([randomFrom(["They love to wrestle", "They always try to lay on you", "They constantly want to be stroked", "They constantly rub against you"]), "happen to touch their genitals"]);
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
					subjectFemale == triggerFemale ? curse.renderGenderedSubjectText : renderOppositeSex(curse.renderGenderedSubjectText),// this is required to cover merge cases.
					randomFrom(["Any time you are separated, you have an urge to return to them", "You are compelled to adopt them as a new pet", "You cannot stand to be away from them"]),
					selectedDrawAndTrigger[0],
					happensOnce ? "If you ever" : "Each time you",
					selectedDrawAndTrigger[1],
					)},
			requires: [humanoidOrBeastOption],
			sets: [determinesRandomSex, triggerSexBecomesOppositeSubjectSex, genderAgnostic, touchTransformation, subjectTransformation, subjectInhuman, oneSubject]
		},
		{
			// SCENARIO TRIGGER: Genitals first animal
			makeTriggerText: function(){
				var conditionPrep = happensOnce ? "if you ever" : "each time you";
				var cursedBodyPart = String.format("{0}'s {1}", renderOppositeSex(curse.renderGenderedSubjectText), subjectFemale ? dickName : pussyName);
				var grownBodyPart = String.format("{0} of {1} {2}", subjectFemale ? pussyName : dickName, subjectArticle,  curse.renderSubjectText());
				var initialTransformation = String.format("Tomorrow morning, you awake to discover the {0} between your legs.", grownBodyPart);
				if (Math.random() < 0.5) {
					var gloryHoleDescription = subjectFemale ? 
						String.format("A moment later, a {0} is thrust through the hole. It sits there, dripping precum and waiting.", cursedBodyPart)
						: String.format("Peering through, you find a {0} pressed against the other side, sopping wet and ready for action.", cursedBodyPart);
					return String.format("{0} As if this wasn't strange enough, "
						+ "any time you are alone in a bathroom stall, a glory hole appears on the wall. {1} The scent is strong, but not unpleasant, "
						+ "and you find yourself missing it when you're away. However, {2} indulge in the pleasures of the glory hole,",
						initialTransformation,
						gloryHoleDescription,
						conditionPrep);
				} else {
					var sexToy = subjectFemale ? "dildo" : "pocket pussy";
					return String.format("{0} The next day, you receive a package containing a lifelike {1} shaped like a {2}. "
						+ "It's extremely tempting, but {3} use it,",
						initialTransformation,
						sexToy,
						cursedBodyPart,
						conditionPrep);
				}
			},
			requires: [nsfw, humanoidOrBeastOption],
			sets: [determinesRandomSex, triggerSexBecomesOppositeSubjectSex, subjectIsLiving, genderAgnostic, subjectTransformation, replacesGenitals, subjectInhuman, oneSubject]
		},
		{
			makeTriggerText: function() {return String.format("{0} without {1}{2}",
				happensOnce ? "If you ever go one week" : "The longer you go",
				randomFrom([
					nsfwSelected || lewdSelected ? randomFrom(["having sex", "having an orgasm"]) : "cuddling someone",
					"cuddling someone",
					"bringing someone home on the first date",
					lewdSelected ? "using a glory hole" : "wrestling someone",
					"privacy",
					"being called a freak",
				]),					
				happensOnce ? "," : ", the more");},
			durationText: happensOnce ? "If you don't fulfill the curse's requirement in one week, you are fully and permanently transformed.":
				"Each time you return to normal, you miss your curse a little bit more.",
			sets: [tfInStages],
		},
		{
			makeTriggerText: function() {return String.format("{0} {1},",
				happensOnce ? "The next time you" : "Every time you",
				randomFrom([
					nsfwSelected || lewdSelected ? randomFrom(["go on a date", "bring a date home"]) : "shiver from being too cold",
					"step into a bar",
					"visit a park",
					"dance",
					"attend a wedding",
					"enter a body of water",
					"get caught in the rain",
					"sneeze",
					"go outside",
					"sweat from a workout",
					"shiver from being too cold",
					"feel anxious",
					"go to a birthday party",
					"tell a lie",
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
		randomFrom([ // fewer permanent durations.
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
					"You will be kidnapped by a cult. They perform a profane ritual on you where",
					"A cruel witch will spike the punch at the next party you attend, and all the guests' bodies twist into new shapes. This includes you, and",
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
				requires: [beastOption]
			},
			{
				triggerText: happensOnce ? "If you are ever bitten by an animal," : "Whenever you touch an animal's tail,", 
				subjectText: "animal", 
				sets: [touchTransformation, specificIndividualTarget, mundaneAnimalSubject],
				requires: [beastOption]
			}
		]),
		randomFrom([ // fewer gendered animal touch options
			{
				makeTriggerText: function(){return happensOnce ? "If you ever touch a female animal," : "Whenever you touch a male animal,";},
				subjectText: "touched animal", 
				chosen: function(){triggerFemale = true;},
				sets: [touchTransformation, specificIndividualTarget, mundaneAnimalSubject],
				requires: [beastOption],
			},
			{
				makeTriggerText: function(){return happensOnce ? "If you ever touch a male animal," : "Whenever you touch a male animal,";},
				subjectText: "touched animal", 
				chosen: function(){triggerFemale = false;},
				sets: [touchTransformation, specificIndividualTarget, mundaneAnimalSubject],
				requires: [beastOption]
			},
		]),
		{
			makeTriggerText: function(){return happensOnce ? "If you ever eat meat or another animal product," : "Whenever you eat meat or another animal product,";},
			subjectText: "consumed species", 
			sets: [specificIndividualTarget, mundaneAnimalSubject],
			requires: [beastOption],
		},
		randomFrom([ // fewer gendered human touch triggers
			{
				makeTriggerText: function(){return happensOnce ? "When you next touch a man,": "Whenever you touch a man";},
				subjectText: "touched man", 
				chosen: function(){triggerFemale = false;},
				sets: [touchTransformation, specificIndividualTarget, subjectIsHuman],
				requires: [humanOption],
			},
			{
				makeTriggerText: function(){return happensOnce ? "When you next touch a woman": "Whenever you touch a woman";},
				subjectText: "touched woman", 
				chosen: function(){triggerFemale = true;},
				sets: [touchTransformation, specificIndividualTarget, subjectIsHuman],
				requires: [humanOption]
			},
		]),
		{
			makeTriggerText: function(){
				return String.format(happensOnce ? "When you next touch {0},": "Whenever you touch {0},",
				randomFrom(["someone", "your best friend", "your romantic partner", "a stranger in public", "your boss"]));},
			subjectText: "touched person",
			sets: [touchTransformation, specificIndividualTarget, subjectIsHuman],
			requires: [humanOption],
		},
		{
			makeTriggerText: function(){
				return String.format(happensOnce ? "The next time you{0} with {1}," : "Whenever you{0} with {1},",
				randomFrom(["'re alone", " lock eyes"]),
				randomFrom(["someone you hate", "someone you love", "a stranger", "your best friend", "a colleague"]));},
			makeAdditionalExplaination: function() {return randomFrom([
					nsfwSelected || lewdSelected ? "The other person finds this incredibly arousing." : "The other person finds this cute.",
					"The other person is afflicted with a similar curse.", 
					"The other person will take advantage of your curse.", 
					"The other person will help you hide your curse."
					]);},
			subjectText: "the other person",
			sets: [specificIndividualTarget, subjectIsHuman],
			requires: [humanOption],
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
			makeAdditionalExplaination: function() {return happensOnce ? "You transform partially when you're embarrassed." : "The more embarrassed you are, the more you change.";},
			sets: [tfInStages],
		},
		{
			makeTriggerText: function(){return happensOnce ? "The next time you get blackout drunk,": "Whenever you get drunk,";},
			makeAdditionalExplaination: function() {return happensOnce ? "If you only have a couple drinks, you transform partially." : "The more intoxicated you are, the more you change.";},
			sets: [tfInStages],
		},
		{
			makeTriggerText: function(){return happensOnce ? "There exists a phrase, and, if you ever hear it," : "You have a secret key phrase, and whenever you hear it";},
			additionalExplaination: randomFrom([
				"You can't resist dropping hints about the curse's trigger phrase.",
				"You can't resist saying the curse's trigger phrase when you think you're alone.",
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
			requires: [nsfw],
			sets: [tfInStages],
		},
		{
			makeTriggerText: function(){return happensOnce ? "Immediately after the next time you have sex," : "Each time you have sex,";},
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
			requires: [beastOption]
		},
		{
			makeTriggerText: function(){
				var costume = String.format("{0} {1}", 
					randomFrom(["a humanoid", "an anthro", "a jolly", "a polka-dot", "a bright pink", "a neon green", "a bright orange", "a bright blue", "a purple", "a glow-in-the-dark"]),
					curse.renderSubjectText());
				return String.format("{0} {1} costume. {2} {3}",
					randomFrom([
						"You will find", 
						"You will be chosen to be your school's new mascot at homecoming. They give you",
						"You will receive a package in the mail containing"
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
			sets: [specificIndividualTarget, subjectInhuman, subjectIsLiving],
			requires: [humanoidOrBeastOption],
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
	
	var bodyType = randomFrom([
		"a thicc",
		"a plump",
		decidedAndTrue(subjectFemale) ? "a volumptuous" : "a muscular", 
		"an athletic",
		"a musclebound",
		"a curvy",
		decidedAndTrue(subjectFemale) ? "a tomboy" : "a feminine", 
		decidedAndTrue(subjectFemale) ? "a flat-chested" : "an androgynous", 
		decidedAndTrue(subjectFemale) ? "a shortstack" : "a short",
		"a gigantic",]);
	var pussyName = randomFrom(["pussy", "vulva", "vagina"]);
	var dickName = randomFrom(["dick", "cock", "penis"]);
	var transformations = [
		// general transformations
		{
			makeTransformationText:function(){return String.format("you transform into {0}", specificTarget ? "a copy of the" : subjectArticle);},
			requires: [subjectSexBecomesSpecificTriggerSex],
			sets: [subjectSexBecomesSpecificTriggerSex]
		},
		{
			makeTransformationText:function(){return String.format("you {0} shift into {1}", 
						randomFrom(["pleasurably", "painfully", "quickly", "slowly", "violently", "noisily", "cartoonishly"]), specificTarget ? "a copy of the" : subjectArticle);},
			requires: [subjectSexBecomesSpecificTriggerSex],
			sets: [subjectSexBecomesSpecificTriggerSex]
		},
		{
			makeTransformationText:function(){return String.format("you become {0}", specificTarget ? "a copy of the" : subjectArticle);}, 
			requires: [subjectSexBecomesSpecificTriggerSex],
			sets: [subjectSexBecomesSpecificTriggerSex]
		},
		randomFrom([ // make head transformations a little less common.
			{
				makeTransformationText:function(){return specificTarget 
					? "an additional head grows beside your own. It's that of the" 
						: String.format("an additional head grows beside your own, and your original head changes to match. The heads are those of {0}", subjectArticle);},
				additionalExplaination: randomFrom([
					specificTarget ? "The new head retains its own mind." : "You have no control over your new head.",
					"You control the additional head fully.",
					"Your personality is split between the heads. One gets your libido and passion, the other gets your logic and restraint.",
					"You get along with your new head like a sibling most of the time, but it's always making sexual advances."]),
				closingRemarkText: "It isn't always easy <a href=\"https://www.furaffinity.net/view/21328649/\"> sharing a body with others</a>.",
				sets: [doNotAssignSubjectSex],
				requires: [tfAtomic],
			},			
			{
				makeTransformationText:function(){return String.format("your head transforms into that of {0}", specificTarget ? "the" : subjectArticle);},
				sets: [doNotAssignSubjectSex, becomingCreatureHybrid],
				requires: [subjectInhuman, humanoidOrBeastOption],
			},
			{
				makeTransformationText:function(){return String.format("you upside-down transform into {0}", specificTarget ? "a copy of the" : subjectArticle);},
				makeAdditionalExplaination: function(){return String.format(
					"The new head emerges from your crotch, while your own head is reduced to its new {0}. {1}",
					randomFrom([
						isDecided(subjectFemale) ? subjectFemale ? pussyName : dickName : "genitals",
						isDecided(subjectFemale) ? subjectFemale ? pussyName : dickName : "reproductive organs",
						isDecided(subjectFemale) ? subjectFemale ? pussyName : dickName : "backside",
						"asshole"]),
					randomFrom([
						"Your consciousness remains confined to your new body's backside, leaving you a helpless passenger. Your body's new owner is horny, mischevious, and has access to your memories.",
						"Your consciousness remains confined to your new body's backside, leaving you a helpless passenger. Your body's new owner appears to be a mental duplicate of yourself and has no idea you still exist.",
						"Your consciousness remains confined to your new body's backside, but you can wrestle with your bodymate for control.",
						"The moment when your conciousness shifts from one head to the other is very disorienting.",
					]));},
				sets: [subjectSexBecomesSpecificTriggerSex],
				requires: [lewd, subjectSexBecomesSpecificTriggerSex],
			},
			{
				makeTransformationText:function(){return specificTarget 
					? String.format("you grow a copy of the {0}'s genitals in your mouth", curse.renderSubjectText())
					: String.format("your {0} transforms into the {1} of {2} {3}", 
						decidedAndFalse(subjectFemale) ? "tongue" : "mouth",
						subjectFemale ? pussyName : dickName, subjectArticle, curse.renderGenderedSubjectText());},
				sets: [subjectSexBecomesSpecificTriggerSex, determinesRandomSex, becomingCreatureHybrid, allowBeastsIfHumanoid],
				requires: [lewd, subjectSexBecomesSpecificTriggerSex],
				chosen: function(){shouldRenderSubjectText = false;},
			},
			{
				makeTransformationText:function(){return String.format("your genitals transform into the mouth of {0}", specificTarget ? "the" : subjectArticle);},
				additionalExplaination: randomFrom([
					"You have no control over your new mouth.",
					"Whatever was between your legs before ends up incorporated into your new mouth.",
					"Whatever was between your legs before ends up incorporated into your original mouth.",
					"Eating is an orgasmic experience."]),
				sets: [doNotAssignSubjectSex, becomingCreatureHybrid, allowBeastsIfHumanoid],
				requires: [lewd]
			},
		]),
		{
			makeTransformationText:function(){return String.format("{0}", happensOnce 
				? "you spend the next 24 hours transforming into" : 
				randomFrom([
					String.format("you transform a little bit more into {0}",
						specificTarget ? "a copy of the" : subjectArticle),
					String.format("a new part of your body transforms into that of {0}", 
						specificTarget ? "the" : subjectArticle)])
			);}, 
			durationText: happensOnce ? "" :
				randomFrom([
					"After each change, you lose control of yourself for a time as your new instincts overwhelm you.", 
					"If you focus, you can suppress the changes for up to an hour at a time.", 
					nsfwSelected || lewdSelected ? "You can suppress the changes, but it makes you unbearably horny." : "You can suppress the changes, but it makes you unbearably hungry.", 
					""
				]),
			closingRemarkText: "I looooove the slow burn.",
			requres: [subjectSexBecomesSpecificTriggerSex],
			sets: [subjectSexBecomesSpecificTriggerSex, tfInStages]
		},
		{
			makeTransformationText:function(){return String.format("your {0} of {1}", 
				decidedAndTrue(startingFemale) ? "pussy is replaced by that" : decidedAndFalse(startingFemale) ? "cock and balls are replaced by those" : "genitals are replaced by those",
				specificTarget ? "the" : subjectArticle);},
			additionalExplaination: randomFrom([
				"You adopt the donor's sexual urges.",
				"You adopt the donor's sexual preferences.",]),
			requires: [nsfw, genitalReplacementAllowed, tfAtomic],
			sets: [allowBeastsIfHumanoid],
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
			requires: [tfSuppliesOwnSubject, humanOption, tgOption]
		},
		{
			makeTransformationText:function(){return String.format("you become a taur version of {0}", subjectArticle);},
			sets: [subjectSexBecomesSpecificTriggerSex, becomingCreatureHybrid],
			requires: [humanoidOption, subjectSexBecomesSpecificTriggerSex],
		},
		{
			makeTransformationText:function(){return String.format("you become a sentient sex doll made to look like {0}",
				specificTarget ? "the" : subjectArticle);},
			additionalExplaination: randomFrom([
				"Mental conditioning makes fulfilling your duties a pleasure.",
				"Whenever anyone sees you, they have an urge to use you.",
				"You cannot refuse any command."]),
			sets: [subjectSexBecomesSpecificTriggerSex, subjectIsNonLiving],
			requires: [nsfw, inanimateOption, subjectSexBecomesSpecificTriggerSex]
		},
		{
			makeTransformationText:function(){return String.format("you become a {0} {1}",
				randomFrom(["stone statue of", "wooden carving of", "fountain shaped like", ]),
				specificTarget ? "the" : subjectArticle);},
			additionalExplaination: randomFrom([
				"You retain your senses.",
				"Time passes quickly.",]),
			sets: [subjectSexBecomesSpecificTriggerSex, subjectIsInanimate],
			requires: [nsfw, inanimateOption, subjectSexBecomesSpecificTriggerSex]
		},
		{
			makeTransformationText:function(){return String.format("your skin hardens, your joints freeze, and you become a {0} yourself",
				randomFrom(["stone statue of ", "wooden carving of", "fountain shaped like", "cake shaped like"]));},
			additionalExplaination: randomFrom([
				"You retain your senses.",
				"Time passes quickly.",]),
			chosen: function(){shouldRenderSubjectText = false;},
			subjectText: "",
			sets: [subjectSexBecomesSpecificTriggerSex, subjectIsInanimate],
			requires: [nsfw, inanimateOption, tfSuppliesOwnSubject, subjectSexBecomesSpecificTriggerSex]
		},
		{
			makeTransformationText: function() {return String.format("your {0} and {1} transform into those of {2}", 
				randomSelectionFrom(["arms", "hands", "torso", "legs", "head"]).join(', '),
				nsfwSelected ? "genitals" : "backside",
				specificTarget ? "the" : subjectArticle)},
			sets: [becomingCreatureHybrid],
			requires: [humanoidOption, subjectInhuman],
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
			chosen: function(){shouldRenderSubjectText = false;},
			subjectText: "",
			sets: [doNotAssignSubjectSex, becomingCreatureHybrid],
			requires: [subjectInhuman, tfSuppliesOwnSubject, humanoidOption],
		},
		// Inhuman transformations
		{
			makeTransformationText:function(){return String.format("you transform into {0} anthro version of {1}", 
				Math.random() < .5 ? "an" : bodyType,
				specificTarget ? "the" : subjectArticle);},
			sets: [becomingCreatureHybrid],
			requires: [subjectInhuman, humanoidOption],
		},
		{
			makeTransformationText:function(){return String.format("you grow the tail, {0}, and {1} of {2}", facialFeatureName, extemitiesName, specificTarget ? "the" : subjectArticle);},
			sets: [doNotAssignSubjectSex, becomingCreatureHybrid],
			requires: [subjectInhuman, humanoidOption, tfAtomic],
		},
		{
			makeTransformationText:function(){return String.format("you transform into {0} {1} version of {2}",
				Math.random() < .5 ? "a" : bodyType,
				subjectFemale ? "monstergirl" : "monsterboy",
				specificTarget ? "the" : subjectArticle);},
			closingRemarkText: randomFrom([
				"Just inhuman enough for mass appeal.", "How kawaii!"]),
			sets: [becomingCreatureHybrid, determinesRandomSex],
			requires: [subjectInhuman, humanoidOption],
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
				"Your valve is an erogenous zone."])},
			chosen: function() {beastsSelected = true;}, // Allow beasts in this one case.
			sets: [subjectIsInanimate],
			requires: [subjectInhuman, inanimateOption, tfAtomic],
		},
		{ // Dildo / masturbator TF
			makeTransformationText:function(){
				var subjectGenitals = subjectFemale ? pussyName : dickName;
				var toyName = subjectFemale ? "pocket pussy" : "dildo";
				var bodyPart = String.format("{0}'s {1}", 
					curse.renderGenderedSubjectText, 
					specificTarget ? isUndecided(triggerFemale) ? subjectGenitals : triggerFemale ? pussyName : dickName : subjectGenitals);
				var sexToy = String.format("{0}{1} shaped like {2} {3}", 
					randomFrom(["lifelike ", "large ", "wriggling ", "rubber ", "strangely realistic ", ""]), 
					specificTarget ? isUndecided(triggerFemale) ? toyName : triggerFemale ? "pocket pussy" : "dildo" : toyName,
					subjectArticle,
					bodyPart);
				var tfText = randomFrom([
					"your limbs melt away, and your body shrinks and stiffens",
					"your body collapses into your genitals as they shift and reform"
				]);
				return String.format("{0}, reducing you to a {1}", tfText, sexToy);},
			closingRemarkText: randomFrom([
				"At least you'll be able to bring joy to others.",
				]),
			makeAdditionalExplaination: function() {
				var matchingBodyPart = String.format("{0} of {1} {2}", !subjectFemale ? pussyName : dickName, subjectArticle,  renderOppositeSex(curse.renderGenderedSubjectText));
				return randomSelectionFrom([
				"You can still sense the world around you when transformed.",
				"While transformed, every touch brings unimaginable pleasure.", 
				"You are constantly horny.",
				decidedAndTrue(subjectFemale) ? "Your opening is always moist with its own synthetic lubricant." 
					: "You leak a synthetic lubricant when touched.",
				"Anyone who picks you up has an irresistable urge to use you.",
				String.format("Any time someone touches you, their genitals reform into the {0}.",
					matchingBodyPart),
				"You can still move a little bit and even wriggle along the floor if given enough time."])
				.join(' ');},
			chosen: function(){shouldRenderSubjectText = false;},
			sets: [determinesRandomSex, subjectIsInanimate, oneSubject],
			requires: [inanimateOption, lewd, tfAtomic],
		},
		{
			makeTransformationText:function(){return randomFrom([
				String.format("your {0} turn into the {1} of {2}", 
					randomFrom(["hands", "feet"]), extemitiesName, specificTarget ? "the" : subjectArticle),
				String.format("you sprout the tail of {0}", 
					specificTarget ? "the" : subjectArticle)]);},
			makeComplicationText: function() {return happensOnce 
				? "Over the next year, the rest of your body transforms to match." 
				: String.format("Each time you transform, {0} changes.", randomFrom(["an additional bodypart also", "a different bodypart"]));},
			sets: [doNotAssignSubjectSex, becomingCreatureHybrid, tfInStages],
			requires: [subjectInhuman, beastOption],
		},
		{
			makeTransformationText: function() {return String.format("you sprout the {0} of {1}", facialFeatureName, specificTarget ? "the" : subjectArticle, )},
			makeAdditionalExplaination: function() {return randomFrom([
				nsfwSelected || lewdSelected ? "Your transformed parts are erogenous zones." : "Other people find your face hypnotically cute.",
				String.format("Animal noises slip out of your mouth when you're {0}.", randomFrom(["nervous", "excited", nsfwSelected || lewdSelected ? "aroused" : "hungry"])),
				"Other people find your face hypnotically cute."
			])},
			sets: [doNotAssignSubjectSex, becomingCreatureHybrid],
			requires: [subjectInhuman, beastOption, tfAtomic],
		},
		{
			makeTransformationText:function(){return String.format("you become {0} {1} from the waist down",
				specificTarget ? "the" : subjectArticle, curse.renderGenderedSubjectText());},
			chosen: function(){shouldRenderSubjectText = false;},
			sets: [becomingCreatureHybrid],
			requires: [subjectInhuman, humanoidOption],
		},
		// touch transformations
		{
			makeTransformationText:function(){return randomFrom([
				"you merge with them, becoming a two-headed hybrid",
				String.format("you merge with them, becoming the {0} of a new taur",
					randomFrom(["top half", "bottom half"]))])
			},
			subjectText: "",
			chosen: function(){shouldRenderSubjectText = false;},
			closingRemarkText: "I hope you really liked them.",
			sets: [subjectSexBecomesTriggerSex, becomingCreatureHybrid],
			requires: [subjectSexBecomesTriggerSex, touchTransformation, tfAtomic, humanoidOption, tfSuppliesOwnSubject],
		},
		{
			makeTransformationText:function(){return String.format("you merge with them, becoming their new {0}",
				isUndecided(triggerFemale) ? "genitals" : triggerFemale ? pussyName : dickName);},
			additionalExplaination: randomFrom([
				"You don't lose your eyes when you merge. They remain above your host's junk, taking in the views and looking pretty upset.",
				"You can exert some control over your host's libido.",
				"You can communicate with your host mentally and access their senses.",
				"Your new host doesn't remember the transformation."]),
			chosen: function(){shouldRenderSubjectText = false;},
			sets: [subjectSexBecomesTriggerSex],
			requires: [touchTransformation, lewd, tfAtomic, inanimateOption, subjectSexBecomesTriggerSex],
		},
		// mental transformations
		{
			makeTransformationText:function(){return String.format("you swap minds with {0}", specificTarget ? "the" : "the nearest");},
			requires: [extantCreaturesAllowed, tfAtomic, mentalOption, subjectIsAnimate, subjectSexBecomesTriggerSex],
			sets: [subjectSexBecomesTriggerSex, mundaneAnimalSubject]
		},
		{
			makeTransformationText:function(){return String.format("you are possessed by the {0} spirit of {1}", 
				randomFrom(["malevolent", "bubbly", "dominating", "mischievous", "jealous", "unpredictable", "horny"]), subjectArticle)},
			additionalExplaination: String.format("{0}, and {1}", 
				randomFrom([
					"The spirit is always fighting you for control",
					"The spirit forcibly takes control if you don't sate their needs",
					"The spirit asserts itself by transforming parts of your body at inopportune times",
					"Control of your body swaps between you and the spirit at random intervals"]),
				randomFrom([
					nsfwSelected || lewdSelected ? "it compels you to breed." : "it compels you with an insatiable hunger.",
					"it compels you with an insatiable hunger.",
					"it just wants to party.",
					"it wants you to find it a better vessel.",
					"you black out when it is in control."])),
			requires: [mentalOption, nsfw, subjectIsAnimate],
		},
	];
	
	var breed1 = randomFrom([
					"rottweiler",
					"doberman",
					"mastiff",
					"great dane",
					"burmese mountain dog",
					"husky"]);
	var breed2 = randomFrom([
					"german shepherd",
					"golden retriever",
					"corgi",
					"labrador",
					"poodle"]);
	var crotchBoobsDescription = function() {
		if (decidedAndTrue(subjectNonLiving)) {
			return "";
		}
		return decidedAndTrue(subjectFemale) ? 
		String.format("You have a {0} pair of {1} teats nestled above your crotch.{2}",
			randomFrom([
				"small",
				"petite",
				"motherly",
				"large",
				"wobbly",
				"giant",
				"perky"
			]),
			randomFrom([
				"breast-like",
				"beastial",
				"sloshing",
				"",
			]),
			randomFrom([
				" They swell steadily throughout the day and, if they don't get milked, begin to ache.",
				" You're lactating, but you can never milk yourself.",
				" They bounce noticeably with every step.",
				" Your milk is deeply addictive to others.",
				" Anyone who consumes your milk is also afflicted with your curse.",
				"",
			])) 
		: randomFrom([
			String.format("You have the digestive system {0}of {1} {2}.",
				nsfwSelected || lewdSelected ? "and asshole " : "",
				subjectArticle,
				curse.renderSubjectText()),
			"Whenever you're standing on grass, you forget that going to the bathroom in public is frowned upon.",
			"You find walking on all fours very natural."
			]);};


	var subjects = [
		{	
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "cow" : "bull" : "cow";}, //[sic] gender-neutral is "cattle" but everyone just calls them cows
			closingRemarkText: "Uhh. . . Moo?",
			chosen: function(){extemitiesName = "hooves", facialFeatureName = "clumsy snout";},
			makeAdditionalExplaination: function() {return randomFrom([
				decidedAndTrue(subjectFemale) ? "You also have an udder and give milk." : "You can always feel a 'moo' building in your throat, begging to be let out.",
				decidedAndTrue(subjectFemale) ? "You also have an udder, and the milk is deeply addictive." : "You hate the color red, and you find cows strangely alluring.",
				"You can always feel a 'moo' building in your throat, begging to be let out."]);},
			sets: [determinesRandomSex, mundaneAnimalSubject, setPussyName("sloppy ".concat(pussyName))],
			requires: [beastOption],
		},
		{

			makeSubjectText: function(){return String.format("{0}{1}",
				breed1,
				isDecided(subjectFemale) ? subjectFemale ? " bitch" : " stud" : "");},
			closingRemarkText: randomFrom([
				"That's a solid breed.",
				"Now beg.",
				"Some people have a hard time <a href=\"https://d.facdn.net/art/xerox2/stories/1557626425/1557626425.xerox2_a_hair_of_the_dog__1_.pdf\"> " +
					"resisting the urge to let their inner dog out</a>.",]),
			sets: [determinesRandomSex, mundaneAnimalSubject, setPussyName("puffy ".concat(pussyName)), setDickName("knotted ".concat(dickName))],
			requires: [beastOption],
		},
		{

			makeSubjectText: function(){return String.format("{0}{1}",
				breed2,
				isDecided(subjectFemale) ? subjectFemale ? " bitch" : " stud" : "")},
			closingRemarkText: randomFrom(["That's a good doggy.","Are you going to pretend to be someone's pet?"]),
			sets: [determinesRandomSex, mundaneAnimalSubject, setPussyName("puffy ".concat(pussyName)), setDickName("knotted ".concat(dickName))],
			requires: [beastOption],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "doe" : "buck" : "deer";},
			chosen: function(){extemitiesName = "hooves", facialFeatureName = "magnificent antlers";},
			closingRemarkText: "A noble animal with a great rack.",
			makeAdditionalExplaination: function(){return Math.random() < .5 ? "" : crotchBoobsDescription()},
			sets: [determinesRandomSex, mundaneAnimalSubject, setDickName("long and slender ".concat(dickName))],
			requires: [beastOption],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "female cat" : "tom cat" :  "cat";},
			chosen: function(){facialFeatureName = "whiskers";},
			sets: [determinesRandomSex, mundaneAnimalSubject],
			requires: [beastOption],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "fluffy ewe" : "ram" : "sheep";},
			chosen: function(){extemitiesName = "hooves", facialFeatureName = "curled, powerful horns";},
			makeAdditionalExplaination: function() {return randomFrom([
				String.format("Your wool needs to be sheared regularly, but it makes great {0}.",
					randomFrom(["blankets", "sweaters", "yarn"])),
				crotchBoobsDescription(),]);},
			sets: [determinesRandomSex, mundaneAnimalSubject],
			requires: [beastOption],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "hen" : "rooster" : "chicken";},
			chosen: function(){extemitiesName = "talons", facialFeatureName = randomFrom(["beak", "plumage"]);},
			sets: [determinesRandomSex, mundaneAnimalSubject, setPussyName("cloaca"), setDickName("cloaca")],
			requires: [becomingCreatureHybrid, beastOption],
		},
		{
			subjectText: randomFrom(["rat", "mouse", "kangaroo mouse"]),
			chosen: function(){facialFeatureName = randomFrom(["whiskers", "pointed snout"]);},
			sets: [determinesRandomSex],
			requires: [beastOption],
		},
		{
			makeSubjectText: function(){return randomFrom(["hawk", 
				"bluebird", 
				isDecided(subjectFemale) ? subjectFemale ? "peahen" : "peacock" : "peafowl",
				"secretary bird"]);}, 
			chosen: function(){extemitiesName = "talons"; facialFeatureName = randomFrom(["beak", "plumage"]);},
			requires: [beastOption],
			sets: [genderAgnostic, mundaneAnimalSubject, setPussyName("cloaca"), setDickName("cloaca")],
		},
		{
			makeSubjectText: function(){return decidedAndTrue(subjectFemale) ? "vixen" : "fox";},
			closingRemarkText: randomFrom([
				"I've never understood the appeal of foxes, but I have a feeling you'll appretiate this one.",
				"Foxes always remind me of <a href=\"https://d.facdn.net/art/xerox2/stories/1545116203/1545116203.xerox2_comfort_zone_v1.pdf\">the time I visited your house.</a>",]),
			sets: [determinesRandomSex, mundaneAnimalSubject, setDickName("knotted ".concat(dickName))],
			requires: [beastOption],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "nanny goat" : "billy goat" : "goat";},
			chosen: function(){extemitiesName = "hooves"; facialFeatureName = "horns";},
			makeAdditionalExplaination: function(){return decidedAndTrue(subjectFemale) 
				? "You have a swollen pair of dugs between your legs that must be milked twice a day."
				: "Your pupils are horizontal, and you attract the attention of a lot of cultists.";},
			closingRemarkText: "Maybe it'll make you a better climber.",
			sets: [determinesRandomSex, mundaneAnimalSubject],
			requires: [beastOption],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "she-bear" : "male bear" : "bear";},
			requires: [beastOption],
			sets: [mundaneAnimalSubject, determinesRandomSex],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "zebra mare" : "zebra stallion" : "zebra";},
			chosen: function(){extemitiesName = "hooves";},
			makeAdditionalExplaination: function(){return Math.random() < .5 ? "" : crotchBoobsDescription()},
			requires: [beastOption],
			sets: [mundaneAnimalSubject, determinesRandomSex, setPussyName("winking ".concat(pussyName)), setDickName("flared ".concat(dickName))],
		},
		{
			subjectText: randomFrom(["snow leopard", "leopard", "panther", "cougar"]),
			requires: [beastOption],
			sets: [genderAgnostic, mundaneAnimalSubject, setDickName("barbed ".concat(dickName))],
		},
		{
			makeSubjectText: function() {return decidedAndTrue(subjectFemale) ? randomFrom(["tigress", "lioness"]) : randomFrom(["tiger", "lion"]);},
			requires: [beastOption],
			sets: [mundaneAnimalSubject, determinesRandomSex, setDickName("barbed ".concat(dickName))],
		},
		{
			subjectText: "hyena",
			chosen: function(){facialFeatureName = randomFrom(["bonecrushing jaws", "paddle-like ears"]);},
			makeAdditionalExplaination: function(){return randomFrom([
				decidedAndTrue(subjectFemale) 
					? "You have a pseudopenis, complete with a fatty sack standing in for testicles." 
					: "Remember: male hyenas are submissive to the females.",
				"An infectious laughter spills out from between your lips when you least expect it.",])
				;},
			closingRemarkText: "<a href=\"https://d.facdn.net/art/xerox2/stories/1567301094/1567301094.xerox2_yeen_queen.pdf\">Yeen Queen</a> is my favorite band!",
			requires: [genderAgnostic, beastOption],
			sets: [mundaneAnimalSubject, setPussyName("pseudopenis")],
		},
		{
			subjectText: "squirrel",
			chosen: function(){facialFeatureName = randomFrom(["whiskers", "ears"]);},
			additionalExplaination: randomFrom([
				"You become twitchy and skittish.",
				lewdSelected || nsfwSelected ? "You develop a strange fascination with caressing, licking, and sucking people's nuts." : "You have a strange craving for nuts.",
				"You have a strange craving for nuts.",
				"You have tantalizingly soft fur.",
			]),
			requires: [genderAgnostic, becomingCreatureHybrid, beastOption],
			sets: [mundaneAnimalSubject],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "rabbit doe" : "rabbit buck" : randomFrom(["rabbit", "bunny"]);},
			chosen: function(){facialFeatureName = randomFrom(["nose and whiskers", "long ears"]);},
			additionalExplaination: randomFrom([
				decidedAndTrue(subjectFemale) 
					? "Each hop causes a lot of jiggling." 
					: "Walking and running become more difficult than hopping.",
				String.format("You are extraordinarily {0}.", isDecided(subjectFemale) ? subjectFemale ? "fertile" : "virile" : "fertile")
				]),
			requires: [beastOption],
			sets: [determinesRandomSex, mundaneAnimalSubject],
		},
		{
			subjectText: randomFrom(["frog", "toad"]),
			chosen: function(){facialFeatureName = "long, sticky tongue";},
			makeAdditionalExplaination: function(){return decidedAndTrue(subjectFemale) 
				? "Each hop causes a lot of jiggling." 
				: "Walking and running become more difficult than hopping.";},
			requires: [genderAgnostic, beastOption],
			sets: [mundaneAnimalSubject],
		},
		{
			subjectText: "kangaroo",
			chosen: function(){facialFeatureName = "pointed snout";},
			makeAdditionalExplaination: function(){return decidedAndTrue(subjectFemale) 
				? "Each hop causes a lot of jiggling." 
				: "Walking and running become more difficult than hopping.";},
			closingRemarkText: "G'day, mate!",
			requires: [genderAgnostic, beastOption],
			sets: [mundaneAnimalSubject, setDickName("upside-down dick")],
		},
		{
			subjectText: randomFrom(["monkey", "baboon", "lemur"]),
			closingRemarkText: "Maybe you should try living in a treehouse.",
			requires: [genderAgnostic, beastOption],
			sets: [mundaneAnimalSubject],
		},
		{
			subjectText: "squid",
			chosen: function(){extemitiesName = "spades", facialFeatureName = "beak";},
			requires: [genderAgnostic, becomingCreatureHybrid, beastOption],
			sets: [mundaneAnimalSubject, setPussyName("siphon")],
		},
		{
			subjectText: "skunk",
			chosen: function(){facialFeatureName = "furry muzzle";},
			closingRemarkText: "Do you smell something?",
			additionalExplaination: randomFrom([
				"You spray reflexively when startled.",
				"You find cats strangely alluring.",
				"You can't resist sharing your scent with those you love.",
				"You have tantalizingly soft fur.",
			]),
			requires: [genderAgnostic, beastOption],
			sets: [mundaneAnimalSubject],
		},
		{
			subjectText: "otter", 
			chosen: function(){extemitiesName = "webbed paws"; subjectArticle = "an"},
			requires: [genderAgnostic, beastOption],
			sets: [mundaneAnimalSubject],
		},
		{
			subjectText: randomFrom(["ferret", "weasel", "raccoon"]),
			chosen: function(){facialFeatureName = "furry muzzle";},
			requires: [genderAgnostic, beastOption],
			sets: [mundaneAnimalSubject],
		},
		{
			subjectText: "closest pet", 
			closingRemarkText: "Is it better or worse if it's your own pet?",
			requires: [genderAgnostic, varyingSubject, beastOption, tfAtomic],
			sets: [mundaneAnimalSubject, specificIndividualTarget],
		},
		randomFrom([
			{
				subjectText: randomFrom(["whale", "dolphin"]), 
				chosen: function(){extemitiesName = "fins"; facialFeatureName = "dorsal fin";},
				makeAdditionalExplaination: function() {return randomFrom([
					"A fishy smell follows you around.",
					"Your rubbery skin must be moistened regularly.",
					lewdSelected && decidedAndFalse(subjectFemale) ? "Your penis is prehensile, but it often moves with a mind of its own." : ""]);},
				requires: [genderAgnostic, becomingCreatureHybrid, beastOption],
				sets: [mundaneAnimalSubject, setPussyName("muscular vent"), setDickName("muscular penis")],
			},
			{
				subjectText: randomFrom(["goldfish", "catfish"]), 
				chosen: function(){extemitiesName = "fins";},
				makeAdditionalExplaination: function() {return randomFrom([
					"A fishy smell follows you around.",
					"You have both gills and lungs, allowing you to live comfortably in the water and on land.",
					lewdSelected && decidedAndFalse(subjectFemale) ? "You cum whenever you smell fish eggs." : ""]);},
				requires: [genderAgnostic, becomingCreatureHybrid, beastOption],
				sets: [mundaneAnimalSubject, setPussyName("vent"), setDickName("genital vent")],
			}
		]),
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "jenny" : "jackass": "donkey";}, 
			chosen: function(){extemitiesName = "hooves", facialFeatureName = "long ears";},
			makeAdditionalExplaination: function(){return Math.random() < .5 ? "Your speech is interspersed with loud, ugly brays." : crotchBoobsDescription()},
			closingRemarkText: randomFrom([
				"Too bad it had to be such an awkward animal.",
				"Don't make an ass out of yourself."]),
			sets: [determinesRandomSex, mundaneAnimalSubject],
			requires: [beastOption],
		},
		{
			subjectText: randomFrom(["bee", "spider", "scorpion", "ant", "centipede", "wasp", "fly"]),
			chosen: function(){extemitiesName = "pointed legs"; facialFeatureName = "insectoid eyes";},
			closingRemarkText: "Becoming a buggo isn't <a href=\"https://d.facdn.net/art/xerox2/stories/1550080085/1550080085.xerox2_catalyst__pilot.pdf\"> always so bad</a>.",
			requires: [genderAgnostic, becomingCreatureHybrid, beastOption],
			sets: [mundaneAnimalSubject, setPussyName("gaster"), setDickName("gaster")],
		},
		/*{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "mare" : "stallion" : "horse";}, 
			chosen: function(){extemitiesName = "hooves";},
			makeAdditionalExplaination: function(){return Math.random() < .5 ? "" : crotchBoobsDescription()},
			sets: [determinesRandomSex, mundaneAnimalSubject, setPussyName("winking ".concat(pussyName)), setDickName("flared ".concat(dickName))],
			requires: [beastOption],
		},
		{
			subjectText: randomFrom(["komodo dragon", "skink", "newt", "alligator", "crocodile"]), 
			chosen: function(){extemitiesName = "claws", facialFeatureName = "toothy snout";},
			requires: [genderAgnostic, becomingCreatureHybrid, beastOption],
			sets: [mundaneAnimalSubject, setPussyName("vent"), setDickName("hemipenes")],
		},
		{
			subjectText: randomFrom(["python", "pit viper", "cobra"]),
			chosen: function(){extemitiesName = "nothings", facialFeatureName = "fangs";},
			additionalExplaination: randomFrom([
				"Your eyes have a deeply comforting quality about them.",
				"You produce a venom that acts as a powerful aphrodisiac.",
				"Bondage suddenly seems like a great pastime."
			]),
			closingRemarkText: "Just as I like 'em: thick and slithery.",
			requires: [genderAgnostic, beastOption],
			sets: [mundaneAnimalSubject, setPussyName("scaled vent"), setDickName("hemipenes")],
		},
		{
			subjectText: "last animal you touched", 
			requires: [genderAgnostic, varyingSubject, beastOption, tfAtomic],
			sets: [mundaneAnimalSubject, specificIndividualTarget],
		},
		{
			subjectText: "last animal you ate", 
			closingRemarkText: randomFrom([
				"Sample any exotic meats lately?",
				"Mmm-mm. This beef tastes just like you."]),
			requires: [genderAgnostic, varyingSubject, beastOption, tfAtomic],
			sets: [mundaneAnimalSubject, specificIndividualTarget],
		},
		{
			subjectText: "last fantasy creature you killed in a video game", 
			closingRemarkText: "Mana really does flow from computer monitors these days.",
			sets: [specificIndividualTarget, subjectInhuman, nonMundaneSubject],
			requires: [genderAgnostic, varyingSubject, nonMundaneSubject, beastOption, tfAtomic],
		},
		randomFrom([// less zodiac
			{
				subjectText: "current year's Chinese zodiac animal", 
				sets: [specificIndividualTarget, subjectInhuman, nonMundaneSubject],
				requires: [genderAgnostic, varyingSubject, nonMundaneSubject, beastOption],
			},
			{
				subjectText: "Chinese zodiac animal assigned to you at birth", 
				sets: [specificIndividualTarget, subjectInhuman, nonMundaneSubject],
				requires: [genderAgnostic, varyingSubject, nonMundaneSubject, beastOption],
			},]),
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "dire wolf bitch": "dire wolf stud" : "dire wolf";},
			sets: [subjectInhuman, determinesRandomSex, setPussyName("puffy ".concat(pussyName)), nonMundaneSubject],
			requires: [nonMundaneSubject, beastOption],
		},
		{
			makeSubjectText: function(){return String.format("{0} {1}-{2}", 
				randomFrom([
					"purple", "green", "red", "pink", "blue"
				]),
				randomFrom(["goo", "slime", "jelly"]),
				isDecided(subjectFemale) ? subjectFemale ? "girl": "boy" : "person");},
				chosen: function(){facialFeatureName = "gooey hair";},
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
			sets: [determinesRandomSex, subjectInhuman, setPussyName("gelatinous ".concat(pussyName)), setDickName("rubbery ".concat(dickName)), nonMundaneSubject],
			requires: [notBecomingHybrid, nonMundaneSubject, humanoidOption]
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "dragoness": "drake" : "dragon";},
			chosen: function(){extemitiesName = "claws", facialFeatureName = "majestic horns";},
			additionalExplaination: randomFrom([
				"You have a lust for hoarding treasure that is impossible to ignore.",
				"You become hopelessly narcissistic.", 
				"You have an uncanny ability to get others to follow your orders.", 
				"People who spend a lot of time near you slowly transform into obedient kobold slaves.", 
				]),
			closingRemarkText: randomFrom([
				"I said you looked lucky, didn't I?",
				"Dragons are such sluts.",
				"Reminds me of that great story <a href=\"https://d.facdn.net/art/xerox2/stories/1577031098/1576996765.xerox2_mounted__secret_santa_.pdf\">Mounted</a>"]),
			sets: [determinesRandomSex, nonMundaneSubject, subjectInhuman,
				setPussyName("powerful, scaled slit"), 
				setDickName(randomFrom(["ridged ", "mighty ", "ribbed ", "massive "]).concat(dickName))],
			requires: [nonMundaneSubject, beastOption],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "unicorn mare": "unicorn stallion" : "unicorn";},
			chosen: function(){extemitiesName = "hooves", facialFeatureName = "horn";},
			makeAdditionalExplaination: function(){return Math.random() < .5 ? "" : crotchBoobsDescription()},
			sets: [determinesRandomSex, subjectInhuman, nonMundaneSubject],
			requires: [nonMundaneSubject, beastOption],
		},
		{
			subjectText: "kobold",
			chosen: function(){extemitiesName = "claws", facialFeatureName = "tiny horns";},
			additionalExplaination: randomFrom([
				"You have a hopeless need to be commanded by a powerful, preferably scaled master.", 
				"When you're upset, puffs of smoke erupt from your nostrils."
				]),
			closingRemarkText: randomFrom(["I think you'll be adorable.", "I love those thick, lizardy tails!"]),
			sets: [nonMundaneSubject, subjectInhuman, setPussyName("scaled ".concat(pussyName))],
			requires: [genderAgnostic, nonMundaneSubject, beastOption],
		},
		{
			subjectText: "wyvern",
			chosen: function(){facialFeatureName = "frilly crest";},
			closingRemarkText: "Is trading your hands for the power of flight worth it?",
			sets: [subjectInhuman, nonMundaneSubject, setPussyName("scaled slit")],
			requires: [genderAgnostic, nonMundaneSubject, beastOption],
		},
		{
			subjectText: "sea serpent",
			sets: [subjectInhuman, setPussyName("vent"), nonMundaneSubject],
			requires: [genderAgnostic, nonMundaneSubject, beastOption],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "demoness": "demon" : "demon";},
			sets: [subjectInhuman, determinesRandomSex, nonMundaneSubject],
			requires: [nonMundaneSubject, humanoidOption],
			chosen: function(){extemitiesName = "claws"; facialFeatureName = "horns";},
		}, 
		{
			subjectText: "mammoth",
			chosen: function(){extemitiesName = "feet"; facialFeatureName = "furry trunk";},
			makeAdditionalExplaination: function(){return Math.random() < .5 ? "" : crotchBoobsDescription()},
			closingRemarkText: "What a majestic trumpet you have.",
			sets: [subjectInhuman, nonMundaneSubject],
			requires: [beastOption, nonMundaneSubject],
		},
		{
			subjectText: "giraffe",
			chosen: function(){extemitiesName = "hooves"; facialFeatureName = "long neck";},
			makeAdditionalExplaination: function(){return Math.random() < .5 ? "" : crotchBoobsDescription()},
			closingRemarkText: "You'll always have a great view at concerts.",
			sets: [subjectInhuman, mundaneAnimalSubject],
			requires: [beastOption],
		},
		{
			subjectText: "last character you played in a video game", 
			closingRemarkText: "Mana really does flow from computer monitors these days.",
			sets: [specificIndividualTarget, subjectInhuman, nonMundaneSubject],
			requires: [genderAgnostic, varyingSubject, notBecomingHybrid, nonMundaneSubject, tfAtomic, humanoidOption],
		},
		{
			subjectText: "goblin", 
			chosen: function(){extemitiesName = "hands"; facialFeatureName = "vibrant hair";},
			additionalExplaination: randomFrom([
				String.format("You are extraordinarily {0}.", isDecided(subjectFemale) ? subjectFemale ? "fertile" : "virile" : "fertile"),
				"Wearing clothes seems ridiculous to you."]),
			sets: [subjectInhuman, nonMundaneSubject],
			requires: [genderAgnostic, notBecomingHybrid, nonMundaneSubject, humanoidOption],
		},
		{
			subjectText: "orc", 
			chosen: function(){extemitiesName = "hands"; subjectArticle = "an"; facialFeatureName = randomFrom(["horns", "tusks"]);},
			sets: [subjectInhuman, setPussyName("powerful ".concat(pussyName)), nonMundaneSubject],
			requires: [genderAgnostic, notBecomingHybrid, nonMundaneSubject, humanoidOption],
		},
		{
			subjectText: randomFrom(["watermelon", "peach", "pumpkin", "pear", "apple", "squash", "orange"]),
			chosen: function(){extemitiesName = "leaves";},
			sets: [subjectInhuman, subjectIsInanimate, setPussyName("flower"), setDickName("flower"), nonMundaneSubject],
			makeAdditionalExplaination: function(){return String.format("Being eaten is incredibly pleasurable, and you regenerate quickly. {0}",
				randomFrom([
					"Your body is an aphrodesiac.",
					"You are absolutely delicious.",
					"You drool tasty juice.",
					"Your smell makes people hungry.",
					"You can feel pieces of your body a while after they're separated from you.",
					"People have an urge to take bites from you.",
				]));},
			requires: [genderAgnostic, notBecomingHybrid, inanimateOption, subjectIsLiving],
		},
		{
			subjectText: "sphinx",
			sets: [subjectInhuman, nonMundaneSubject],
			requires: [genderAgnostic, notBecomingHybrid, nonMundaneSubject, beastOption],
		},
		{
			subjectText: "naga",
			chosen: function(){extemitiesName = "claws"; facialFeatureName = "crest";},
			additionalExplaination: randomFrom([
					"Holding a lover or helpless victim in your coils is such a delight.",
					"",
					]),
			closingRemarkText: "I hope you don't mind having a lisssp.",
			sets: [subjectInhuman, setPussyName("scaled ".concat(pussyName)), nonMundaneSubject],
			requires: [genderAgnostic, notBecomingHybrid, nonMundaneSubject, humanoidOption],
		},
		{
			subjectText: randomFrom(["cerberus", "hydra"]),
			chosen: function(){facialFeatureName = "horns";},
			sets: [subjectInhuman, nonMundaneSubject],
			requires: [genderAgnostic, notBecomingHybrid, nonMundaneSubject, beastOption],
			closingRemarkText: "Stop fighting with yourself!",
		},
		{
			subjectText: "satyr",
			chosen: function(){extemitiesName = "hands"; facialFeatureName = "horns";},
			sets: [subjectInhuman, nonMundaneSubject],
			requires: [genderAgnostic, notBecomingHybrid, nonMundaneSubject, humanoidOption],
		},
		{
			makeSubjectText: function(){return !isDecided(subjectFemale) ? "mer-person" : subjectFemale ? "mermaid": "merman";},
			chosen: function(){extemitiesName = "hands"; facialFeatureName = "frilly hair";},
			additionalExplaination: "Your singing voice is mesmerizingly beautiful.",
			closingRemarkText: "Something smells fishy.",
			sets: [determinesRandomSex, subjectInhuman, nonMundaneSubject],
			requires: [notBecomingHybrid, nonMundaneSubject, humanoidOption],
		},
		{
			makeSubjectText: function(){return decidedAndTrue(subjectFemale) ?  "gorgon": "minotaur";},
			chosen: function(){return decidedAndTrue(subjectFemale) ? function(){facialFeatureName = "snake hair"} : function(){facialFeatureName = "horns";};},
			sets: [determinesRandomSex, subjectInhuman, nonMundaneSubject],
			requires: [notBecomingHybrid, nonMundaneSubject, humanoidOption],
		},
		{
			makeSubjectText: function(){return decidedAndTrue(subjectFemale) ? "succubus": "incubus";},
			chosen: function(){extemitiesName = "hands"; subjectArticle = decidedAndTrue(subjectFemale) ? "a" : "an";},
			sets: [determinesRandomSex, subjectInhuman, setPussyName("needy ".concat(pussyName)), nonMundaneSubject],
			requires: [notBecomingHybrid, humanoidOption, nonMundaneSubject],
		},
		{	// Human types
			makeSubjectText: function() {
				var primaryDescriptors = [
					decidedAndTrue(subjectFemale) ? "big-breasted" : "musclebound",
					decidedAndTrue(subjectFemale) ? "curvy" : "feminine",
					"sexy",
					"gorgeous",
					"tall",
					randomFrom(["short", "five foot tall", "six foot tall", "four-and-a-half foot tall", "tall", "seven foot tall"]),
					decidedAndTrue(subjectFemale) ? "leggy" : "fit",
					"fit"
				];
				var secondaryDescriptors = [
					"brunette",
					"blonde",
					"redheaded",
					"asian",
					"black",
					"white",
					"latino",
				];
				var afterDescriptor = [
					decidedAndTrue(subjectFemale) ? " with breast implants" : "",
					decidedAndTrue(subjectFemale) ? " with fake-looking breast implants" : "",
					decidedAndTrue(subjectFemale) ? " with an enormous ass" : "",
					decidedAndTrue(subjectFemale) ? " with massive, natural breasts" : "",
					decidedAndTrue(subjectFemale) ? " with an hourglass figure" : "",
				];
				var usePrimary = Math.random() <.7;
				var useSecondary = Math.random() <.9;
				return String.format("{0}{1}{2}{3}{4}{5}", 
					usePrimary ? randomFrom(primaryDescriptors) : "",
					usePrimary ? " " : "",
					useSecondary ? randomFrom(secondaryDescriptors) : "",
					useSecondary ? " " : "",
					isDecided(subjectFemale) ? subjectFemale ? "woman": "man" : "person",
					usePrimary ? "" : randomFrom(afterDescriptor));
			},
			sets: [determinesMostlyFemaleSex],
			requires: [humanOption, subjectIsHuman, notBecomingHybrid],
		},*/
	]

	
	// =======================
	//        DURATIONS
	// =======================
	var durations = [
		{
			makeDurationText: function() {return decidedAndTrue(subjectInanimate) ? "You remain this way until someone has sex with you." 
				: "You remain this way until you have sex.";}, 
			closingRemarkText: "Don't worry, I think you're plenty charming. You'll be back to normal in no time.",
			requires: [nsfw]
		},
		{
			makeDurationText: function() {return decidedAndTrue(subjectInanimate) ? "You remain this way until someone kisses you." 
				: "You remain this way until you can convince someone to kiss you.";},
			closingRemarkText: "You're lucky I didn't say the person kissing had to be a princess."
		},
		{
			durationText: String.format("You remain this way until {0}.",
				randomFrom([
					"someone hugs you without you asking",
					"someone massages you",
					"someone slaps your ass",
					"someone spanks you",
				])),
			requires: [subjectIsAnimate],
		},
		{
			durationText: "You remain this way until you reveal your curse to someone new.",
			closingRemarkText: randomFrom(["Who will you show first?",
					"How many times before you run out of people you trust?", 
					"I hope the people you tell don't use their knowledge against you."]),
			requires: [subjectIsAnimate],
		},
		{
			makeDurationText: function() {return String.format("You remain this way until {0}.", 
				randomFrom([
					"someone has sex with you",
					isDecided(subjectFemale) ? 
						subjectFemale ? "someone eats you out" : "someone gives you a blowjob" 
						: "someone brings you to climax with their mouth",
				])
			);},
			requires: [subjectIsAnimate, nsfw],
		},
		{
			makeDurationText: function() {return String.format("You revert to your old self in {0} hours, but, if you {1}, the transformation becomes permanent.",
				randomFrom(["two", "four", "six", "twelve"]),
				randomFrom([
					decidedAndTrue(subjectInanimate) ? "are used by five humans" : "have sex", 
					decidedAndTrue(subjectInanimate) ? "are used by a human" : decidedAndTrue(subjectFemale) ? "get pregnant" : "reproduce", 
					decidedAndTrue(subjectInanimate) ? "are used by any creature" : "orgasm",
					"are recognized by someone else you know"]));},
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
			requires: [mundaneAnimalSubject, notBecomingHybrid, beastOption],
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
			requires: [nsfw, subjectIsAnimate]
		},
		{
			makeDurationText: function(){return isUndecided(subjectFemale) ? "You can only return to normal by reproducing." : 
				subjectFemale ? "You can only return to normal by giving birth." : "You can only return to normal by siring young.";},
			requires: [nsfw, subjectIsLiving]
		},
		{
			makeDurationText: function(){return isUndecided(subjectFemale)
					? "You remain this way until you have sex with 5 different people." 
				: subjectFemale ? "You can only return to normal once 5 people cum inside of you." 
					: "You can only return to normal once you cum inside 5 people.";},
			requires: [lewd, subjectIsLiving]
		},
		{
			makeDurationText: function() {return String.format(
				"You remain this way until you have sex with {0} {1}.",
				subjectArticle,
				renderOppositeSex(curse.renderGenderedSubjectText));},
			closingRemarkText: randomFrom([
				"It's not really amoral if you're the same species, right?",
				"It's okay. I don't think anyone will judge you."
			]),
			requires: [lewd, mundaneAnimalSubject, subjectIsAnimate],
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
			makeComplicationText: function(){return String.format("{0} must obey the orders of any human.",
				happensOnce ? "You" : "While transformed, you");},
			requires: [subjectIsAnimate],
		},
		{
			makeComplicationText: function(){return happensOnce 
				? "No one remembers you being any other way." 
				: "While transformed, everyone thinks you've always been this way.";},
			closingRemarkText: "But you and I will always know the truth. ;)",
		},
		{
			complicationText: "Your sex drive and production of bodily fluids are greatly increased. When you're hungry, you drool. When you're horny, well. . .",
			closingRemarkText: "Does bodily fluids include sweat? That could be kinda gross.",
			requires: [nsfw, subjectIsLiving]
		},
		{
			makeComplicationText: function(){return String.format("Your {0} constantly dripping {1}.", 
				isUndecided(subjectFemale) ? "genitals are" : subjectFemale ? "pussy is" : "penis is",
				isUndecided(subjectFemale) ? "bodily fluids" : subjectFemale ? "fem-lube" : "pre-cum");},
				requires: [lewd, subjectIsLiving]
		},
		{
			complicationText: randomFrom(["Your curse is sexually transmittable.", "People you come in contact with catch your curse like the common cold."]),
			closingRemarkText: "It won't be long before prospective lovers ask each other to get tested for it.",
			requires: [nsfw],
		},
		{
			complicationText: "Your bodily fluids are a potent aphrodisiac, but you must trick your target into drinking something tainted with them.",
			requires: [nsfw, subjectIsLiving]
		},
		{
			complicationText: "Your pheromones allow you to seduce any creature with a nose.",
			requires: [nsfw, subjectIsLiving]
		},
		{
			complicationText: "You produce a strong musk.",
			requires: [nsfw, subjectIsLiving]
		},
		{
			complicationText: String.format("Also, you must lay {0} every day.", randomFrom(["one large egg", "one fist-sized egg", "one melon-sized egg", "a dozen eggs", "six eggs"])),
			additionalExplaination: randomFrom([
				"The time of day when you lay your eggs is random. A shifting feeling in your belly gives you 30 seconds warning before you drop.",
				"The first time laying is painful. By the end of the first week, it starts to become pleasurable.",
				"Your eggs can be fertilized by any creature. You can tell which ones are carrying young and have an urge to nest on them.",
				"Others who spend time around your eggs are compelled to take care of them."
				]),
			makeClosingRemarkText: function(){return String.format("Does that mean you have a cloaca now? {0}", 
				randomFrom(["Weird.", "Cool!", "Fascinating.", "Gross.", "Huh.", "Delightful."]))},
			requires: [subjectIsLiving, humanoidOption],
		},
		{
			makeComplicationText: function() {return decidedAndTrue(subjectFemale) ? "Also, you grow an extra pair of breasts." : "Also, you grow a pair of breasts."},
			closingRemarkText: "An extra pair of tits never hurt anyone.",
			requires: [nsfw, subjectIsLiving]
		},
		{
			makeComplicationText: function(){return String.format("You grow {0} extra pairs of breasts. {1}", 
				randomFrom(["two", "three", "four"]),
				randomFrom(["They're all the same size.", "Each additional pair is smaller than those above."]));},
			requires: [lewd, subjectIsLiving]
		},
		{
			makeComplicationText: function(){
				if (!tgSelected && decidedAndTrue(subjectFemale)) {
					return "An additional pussy opens beside your first."
				}
				return decidedAndTrue(subjectFemale) ? "A penis grows above your pussy." : "You grow an additional penis."
			}, 
			requires: [lewd, subjectIsAnimate],
		},
		{
			makeComplicationText: function() {
				if (!tgSelected && decidedAndFalse(subjectFemale)) {
					return "An additional penis sprouts beside your first."
				}
				return isUndecided(subjectFemale) ? 
					"You grow a pussy." : subjectFemale ? 
					"You grow an additional pussy next to your first." : "Your taint splits open to reveal a freshly formed pussy.";},
			requires: [lewd, subjectIsAnimate, subjectCanBeFemale], 
			sets: [subjectIsFemale]
		},
		{
			complicationText: "Your wardrobe changes to accommodate your new form."
		},
		{
			complicationText: "Your clothes are ruined by the transformation.",
			requires: [tfAtomic]
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
				"If you weren't before, you are now {0}.", randomFrom(["bisexual", "gay"]));},
			requires: [subjectIsAnimate],
		},
		{
			makeComplicationText: function(){return String.format(
				"{0} a hermaphrodite.", happensOnce ? "You become" : "While transformed, you are");},
			sets: [subjectIsFemale],
			requires: [lewd, subjectIsAnimate, tgOption]
		},
		{
			makeComplicationText: function(){return String.format(
				"{0} {1}", happensOnce ? "You become" : "While transformed, you are",
				isUndecided(subjectFemale) || subjectFemale ? "kinda, like, an air-headed bimbo." : "a meat-headed hunk.");},
			requires: [subjectIsAnimate],
		},
		{
			makeComplicationText: function(){return happensOnce 
				? "You don't quite remember your life before the transformation." 
				: "While transformed, you don't remember being any other way."}
		},
		{
			makeComplicationText: function(){return String.format("After your transformation, {0}",
				isUndecided(subjectFemale) ? "you feel compelled to reproduce until you are successful." : 
					subjectFemale ? "you feel a kicking and realize you're pregnant!" 
					: "the nearest female becomes pregnant with your children.");},
			requires: [nsfw, subjectIsLiving]
		},
		{
			makeComplicationText: function(){return happensOnce 
				? "Your sex drive is supercharged." : "While transformed, you are always horny.";},
			requires: [nsfw]
		},
		{
			makeComplicationText: function(){return isUndecided(subjectFemale) 
				? "Your genitals are oversized." : 
					subjectFemale ? String.format("Your {0} is oversized and gets dripping wet whenever you're aroused.", pussyName) 
					: "Your penis is exceptionally large, and there's no way to hide it.";},
			requires: [lewd, subjectIsLiving]
		},
		{
			complicationText: "You and the relevant species experience a mutual attraction.",
			requires: [nsfw, mundaneAnimalSubject, beastOption]
		},
		{
			complicationText: "You can speak to other members of the relevant species.",
			requires: [mundaneAnimalSubject, subjectIsAnimate, beastOption],
		},
		{
			makeComplicationText: function() {return String.format("The longer you remain transformed, the more your thoughts become the simple instincts of {0} {1}.",
				subjectArticle,
				curse.renderSubjectText());},
			requires: [mundaneAnimalSubject, beastOption, subjectIsAnimate],
		},
		{
			makeComplicationText: function() {return "The longer you remain transformed, the more your mind fades away.";},
			requires: [subjectIsInanimate],
		},
		{
			makeComplicationText: function(){return String.format(
				"{0} lose your ability to read and write.", happensOnce ? "You" : "While transformed, you");},
			requires: [mundaneAnimalSubject, subjectIsAnimate],
		},
		{
			complicationText: "You retain your ability to speak English.",
			requires: [mundaneAnimalSubject, subjectIsAnimate],
		},
		{
			complicationText: "You get all the instincts of the relevant species and can't resist acting on them.",
			requires: [mundaneAnimalSubject, subjectIsAnimate],
		},
		{
			makeComplicationText: function(){return happensOnce 
				? "You are sold to a rich, private collector who uses you for his own entertainment."
				: "While in human form, you retain some parts of your other form.";},
			requires: [subjectInhuman, tfAtomic],
		},
		{
			makeComplicationText: function(){return happensOnce 
				? "You are captured for scientific research. Most tests seem to be focused around reproduction." : "Each time you return to normal, you retain more of your cursed form.";},
			requires: [subjectInhuman, subjectIsAnimate],
		},
		{
			complicationText: "You gain the memories of the other person.",
			closingRemarkText: "Pilfer their dirty secrets.",
			requires: [subjectIsHuman, specificIndividualTarget],
		},
		{
			complicationText: "Whenever the other person becomes aroused, you are as well. And vice-versa.",
			requires: [nsfw, subjectIsHuman, specificIndividualTarget],
		},
		{
			complicationText: "Whenever the other person orgasms, so do you. And vice-versa.",
			requires: [nsfw, subjectIsHuman, specificIndividualTarget],
		},
		{
			complicationText: "You cannot refuse orders from the other person.",
			requires: [subjectIsHuman, specificIndividualTarget, subjectIsAnimate],
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
	//
	//
	if (!humansSelected && !humanoidsSelected && !beastsSelected && !inanimateSelected) {
		return {curseText: "You turn into nothing.", circeText: "What did you expect?"};
	}
	
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

	if (happensOnce) {
		updateCurse(curse, {durationText: "The transformation is permanent."});
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

	if (isUndecided(subjectFemale) && transformationAffectsSubjectSex && renderSubjectGender) {
		subjectFemale = Math.random() < 0.5; // 50% chance
	}
	if (renderSubjectGender && !specificTarget) {
		subjectArticle = "a";
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
