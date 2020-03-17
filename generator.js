const SECOND_PERSON_ARG = "$SECONDPERSON$";

class TfOptions {
    constructor(sfw, nsfw, lewd, male, female, otherSex, humans, humanoid, beasts, mythical, inanimate, mental, tg) {
        this.sfwSelected = sfw;
        this.nsfwSelected = nsfw;
        this.lewdSelected = lewd;
        this.maleSelected= male;
        this.femaleSelected = female;
        this.otherSexSelected = otherSex;
        this.humansSelected = humans;
        this.humanoidsSelected = humanoid;
        this.beastsSelected = beasts;
        this.mythicalSelected = mythical;
        this.inanimateSelected = inanimate;
        this.mentalSelected = mental;
        this.tgSelected = tg;
    }
}

function generateSecondPersonCurse(tfOptions) {
    return generateTransformation(SECOND_PERSON_ARG, true, tfOptions);
}

function generateSecondPersonTF(isCurse, tfOptions) {
    return generateTransformation(SECOND_PERSON_ARG, isCurse, tfOptions);
}

function generateTransformation(targetName, isCurse, options) {
    var sfwSelected = options.sfwSelected;
    var nsfwSelected = options.nsfwSelected;
    var lewdSelected = options.lewdSelected;
    var maleSelected= options.maleSelected;
    var femaleSelected = options.femaleSelected;
    var otherSexSelected = options.otherSexSelected;
    var humansSelected = options.humansSelected;
    var humanoidsSelected = options.humanoidsSelected;
    var beastsSelected = options.beastsSelected;
    var mythicalSelected = options.mythicalSelected;
    var inanimateSelected = options.inanimateSelected;
    var mentalSelected = options.mentalSelected;
    var tgSelected = options.tgSelected;

	selectAnotherComplication = function(components) {
		var anotherSelected = randomFrom(components);
		if (chosenComplication == anotherSelected) {
			return selectAnotherComplication(components);
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
		if (update == null) {
			throw noValidComponent;
		}
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
				var explainations = this.additionalExplainations[0]();
				for (var i = 1; i < this.additionalExplainations.length; i++) {
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
		    if (isCurse) {
    			return String.format("<p>{0} {1}{2}{3}. {4} {5} {6}</p>",
                    this.renderTriggerText(),
                    this.renderTransformationText(),
                    shouldRenderSubjectText ? " " : "",
                    shouldRenderSubjectText ? this.renderGenderedSubjectText() : "",
                    this.renderDurationText(),
                    this.renderComplicationText(),
                    this.renderAdditionalExplainations());
		    } else {
    			return String.format("<p>{0}{1}{2}. {3} {4}</p>",
                    this.renderTransformationText(),
                    shouldRenderSubjectText ? " " : "",
                    shouldRenderSubjectText ? this.renderGenderedSubjectText() : "",
                    this.renderComplicationText(),
                    this.renderAdditionalExplainations());
		    }
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

	var happensOnce = !isCurse ? true : (Math.random() <0.2); // 20% chance, more with some triggers that force it.
	var shouldRenderSubjectText = true;
	var shortDurationOnly = false;
	const defaultExtremitiesName = "feet";
	var extremitiesName = defaultExtremitiesName;
	const defaultFacialFeatureName = "ears";
	var facialFeatureName = defaultFacialFeatureName;
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
	var mustUseStandardSubject = false;
	var specificTarget = false;
	var isMundaneAnimalSubject = null;
	var subjectHybrid = false;
	var replacingGenitals = null;
	var subjectNonLiving = null;
	var subjectInanimate = false;
	var stagesTF = null;
	var isAnExpansionTF = null;
	var renderSubjectGender = true;
	var singularSubject = null;
	var noTransformation = false;

	// TAGS
	const veryUncommon = {
		shouldFilter: function(){return Math.random() < 0.75;},
		onChoice: function() {},
	}
	const uncommon = {
		shouldFilter: function(){return Math.random() < 0.5;},
		onChoice: function() {},
	}
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
			humanoidsSelected = true; humansSelected = true;} // allow beastial inanimate tfs
	}

	const subjectIsInanimate = {
		shouldFilter: function(){return !isDecided(subjectInanimate) || decidedAndFalse(subjectInanimate)},
		onChoice: function() {subjectNonLiving = true; subjectInanimate = true;
			humanoidsSelected = true; humansSelected = true;} // allow beastial inanimate tfs
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

	const chosenTFNotExpansion = {
		shouldFilter: function() {return decidedAndTrue(isAnExpansionTF);},
		onChoice: function() {},
	}

	const isExpansionTF = {
		shouldFilter: function() {},
		onChoice: function() {isAnExpansionTF = true;},
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

	const subjectSexBecomesStartingSex = {
		shouldFilter: function() {return false;},
		onChoice: function() {if(!isDecided(subjectFemale)){subjectFemale = startingFemale;}}
	}

	const transgenderTF = {
		shouldFilter: function() {return false;},
		onChoice: function() {if(isDecided(startingFemale)){subjectFemale = !startingFemale;}}
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

	const doNotAssignSubjectSex = {
		shouldFilter: function(){return false;},
		onChoice: function() {transformationAffectsSubjectSex = false;}
	}

	const doNotRenderSubject = {
		shouldFilter: function(){},
		onChoice: function() {shouldRenderSubjectText = false;}
	}

	const canSupplySubject = {
		// For components that buck the trend of using the curse's chosen subject.
		shouldFilter: function(){return (null != curse.renderSubjectText)
				|| mustUseStandardSubject;},
		onChoice: function() {}
	}

	const usesStandardSubject = {
		// for filtering components that require a subject (like a complication that references species)
		// OR for signaling that a standard subject must be used. (on Triggers usually)
		shouldFilter: function(){return curse.renderSubjectText() == "";},
		onChoice: function() {mustUseStandardSubject = true;}
	}

	const specificIndividualTarget = {
		shouldFilter: function(){return decidedAndFalse(specificTarget);},
		onChoice: function() {specificTarget = true; subjectArticle = "the"; singularSubject = true;}
	}
	const noSpecificIndividualTarget = {
		shouldFilter: function(){return decidedAndTrue(specificTarget);},
		onChoice: function() {},
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
		shouldFilter: function(){return decidedAndFalse(isMundaneAnimalSubject) || decidedAndTrue(subjectHuman) || !isDecided(isMundaneAnimalSubject);},
		onChoice: function() {subjectHuman = false; isMundaneAnimalSubject = true;}
	}

	const nonMundaneSubject = {
		shouldFilter: function(){return decidedAndTrue(isMundaneAnimalSubject) || !mythicalSelected;},
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

	const setExtremitiesName = function(newExtremityName) {
		return {
			shouldFilter: function(){return false;},
			onChoice: function() {extremitiesName = newExtremityName;},
		}
	}
	const setFacialFeature = function(newFacialFeature) {
		return {
			shouldFilter: function(){return false;},
			onChoice: function() {facialFeatureName = newFacialFeature;},
		}
	}
	const allowBeastsIfHumanoid = {
		shouldFilter: function(){return false;},
		onChoice: function() {if (humanoidsSelected){beastsSelected = true;}},
	}
	const allowBeasts = {
		shouldFilter: function(){return false;},
		onChoice: function() {beastsSelected = true;},
	}
	const subjectCanBeFemale = {
		shouldFilter: function(){return decidedAndFalse(startingFemale) && !tgSelected;},
		onChoice: function() {},
	}
	const nonDefaultFacialFeature = {
		shouldFilter: function() {return facialFeatureName == defaultFacialFeatureName;},
		onChoice: function() {},
	}
	const nonDefaultExtremities = {
		shouldFilter: function() {return extremitiesName == defaultExtremitiesName;},
		onChoice: function() {},
	}
	const mentalOnly = {
		shouldFilter: function() {return false;},
		onChoice: function() {noTransformation = true;},
	}

	const beingTransformed = {
		shouldFilter: function() {return noTransformation;},
		onChoice: function() {},
	}

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

	// DATA
	// instead of static text, you can specify a "make" function that will be called at render time.
	// Every type of component can set the values for any "downstream" components by specifying them. They're secretly all of the same type.
	//  TAGS:
	//		Tags can be included in the "sets" or "requires" field. If included in "requires," the component
	//		will not be a candidate for choice of the tag's condition isn't met. When included in the "sets"
	//		field, the tag make whatever state changes it needs to signal it has been set if and when the component
	//		is selected.
	//
	const activity = randomFrom([
		randomFrom([{a: "running", b: "running"}, {a:"walking", b:"walking"}]),
		randomFrom([{a: "watching TV", b: "vegging out"}, {a: "playing video games", b: "vegging out"}]),
		randomFrom([{a: "intoxicated", b: "getting drunk"}, {a: "high", b: "getting stoned"}]),
		randomFrom([{a: "dancing", b: "dancing"}, {a: "speaking to someone", b: "talking to anyone"}]),
		nsfwSelected || lewdSelected ? {a: "aroused", b: "getting horny"} : {a: "bicycling", b: "riding %your/their% bike"},
		nsfwSelected || lewdSelected ? {a: "masturbating", b: "pleasuring %yourself/themselves%"} : {a: "cuddling", b: "cuddling"},
		nsfwSelected || lewdSelected ? {a: "orgasming", b: "climaxing"} : {a: "cuddling", b: "cuddling"},
		nsfwSelected || lewdSelected ? {a: "having sex", b: "having sex"} : {a: "cuddling", b: "cuddling"},
	]);
	var triggers = [
		{
			makeTriggerText: function() {return String.format("{0}{1}When {2}, %you/they% take a pregnancy test. It comes back positive. As %your/their% pregnancy progresses,",
				decidedAndFalse(startingFemale) ? String.format("%You/They% wake up with the {0} of {1} {2} between %your/their% legs. ",
					pussyName, subjectArticle, curse.renderSubjectText()) : "",
				randomFrom([
					"%You/They% wake up tomorrow feeling queasy. ",
					"%You/They% notice that %you/they%'re eating a lot more than usual. ",
					"%Your/Their% chest feels sore. ",
					decidedAndFalse(startingFemale) ? "%You/They% wake up to find %you/they%'ve grown a pair of breasts. " : "",
					"",
				]),
				randomFrom([
					"%your/their% belly starts to descend",
					"%you/they% feel a kicking in %your/their% tummy",
					"%your/their% nipples leak droplets of milk",
					"%your/their% stomach grows so large %you/they% can no longer fit into %your/their% pants",
					"something starts moving inside %your/their% belly",
				])
			);},
			makeDurationText: function() {return String.format("The pregnancy lasts {0}, and by the time %you/they% go into labor, %you/they% are fully transformed.",
				randomFrom(["nine months", "just one hour", "just one day", "a year", "six months", "three months"]));},
			makeAdditionalExplaination: function() {return String.format("%You/They% give birth to {0}.{1}",
				randomFrom([
					String.format("{0} {1}",renderUndecidedSex(curse.renderSubjectText), randomFrom(["twins", "triplets", "quadruplets"])),
					String.format("{0} {1}", randomFrom(["a baby", "an adorable little", "a full-grown", "a roudy little"]), curse.renderGenderedSubjectText())]),
				randomFrom([
					String.format("{0} {1} {2}.",
						" %You/They% immediately crave the same foods as",
						subjectArticle,
						curse.renderSubjectText()),
					" %You/They% have an urge to get pregnant again as soon as possible.",
					" %You/They%'re willing to do whatever it takes to be a good mom.",
					" A few weeks later, %you/they% realize %you/they%'re pregnant again!",
					"",
				])
			)},
			chosen: function(){happensOnce = true;},
			requires: [humanoidOrBeastOption, nsfw, subjectCanBeFemale],
			sets: [subjectIsFemale, subjectIsLiving, tfInStages, oneSubject, usesStandardSubject],
		},
		{
			// SCENARIO TRIGGER: touch animal
			makeTriggerText: function(){
				var drawAndTrigger = [
						["They are always happy to see %you/them%", happensOnce ? "upset them" : "pet them"],
						["They never leave %you/them% alone", "escape them"]
				];
				if (lewdSelected) {
					drawAndTrigger.push(["%You/They% find yourselves hopelessly attracted to each other", "give in to temptation and have sex with them"]);
					drawAndTrigger.push(triggerFemale ? ["They are prone to entering intense, sexual heats where they produce pheromones that %you/they% find irresistibly arousing", "give in to temptation and try having sex with them"]
						: ["They are prone to entering intense, sexual heats where they view %you/them% as a potential mate", "touch their penis"]);
				}
				if (nsfwSelected || lewdSelected) {
					drawAndTrigger.push([randomFrom(["They love to wrestle", "They always try to lay on %you/them%", "They constantly want to be stroked", "They constantly rub against %you/them%"]), "happen to touch their genitals"]);
				}
				var selectedDrawAndTrigger = randomFrom(drawAndTrigger);
				return String.format(
					"{0} {1} {2}. {3}. {4}. {5} {6},",
					randomFrom([
						"The next time %you/they% are out in nature alone, %you/they% will encounter",
						"%You/They% will land a job where %you/they% have any-time, private access to",
						String.format("%You/They% will return home one day to find %your/their% {0} occupied by", randomFrom(["bed", "couch", "living room"])),
						"One evening, %you/they% will hear a noise at %your/their% door. You open it to find",
					]),
					subjectArticle,
					subjectFemale == triggerFemale ? curse.renderGenderedSubjectText : renderOppositeSex(curse.renderGenderedSubjectText),// this is required to cover merge cases.
					randomFrom(["Any time %you/they% are separated, %you/they% have an urge to return to them", "%You/They% are compelled to adopt them as a new pet", "%You/They% cannot stand to be away from them"]),
					selectedDrawAndTrigger[0],
					happensOnce ? "If %you/they% ever" : "Each time %you/they%",
					selectedDrawAndTrigger[1]
					)},
			requires: [humanoidOrBeastOption],
			sets: [determinesRandomSex, usesStandardSubject, triggerSexBecomesOppositeSubjectSex, touchTransformation, subjectInhuman, oneSubject]
		},
		{
			// SCENARIO TRIGGER: Genitals first animal
			makeTriggerText: function(){
				var conditionPrep = happensOnce ? "if %you/they% ever" : "each time %you/they%";
				var cursedBodyPart = String.format("{0}'s {1}", renderOppositeSex(curse.renderGenderedSubjectText), subjectFemale ? dickName : pussyName);
				var grownBodyPart = String.format("{0} of {1} {2}", subjectFemale ? pussyName : dickName, subjectArticle,  curse.renderSubjectText());
				var initialTransformation = String.format("Tomorrow morning, %you/they% awake to discover the {0} between %your/their% legs.", grownBodyPart);
				if (Math.random() < 0.5) {
					var gloryHoleDescription = subjectFemale ?
						String.format("A moment later, a {0} is thrust through the hole. It sits there, dripping precum and waiting.", cursedBodyPart)
						: String.format("Peering through, %you/they% find a {0} pressed against the other side, sopping wet and ready for action.", cursedBodyPart);
					return String.format("{0} As if this wasn't strange enough, "
						+ "any time %you/they% are alone in a bathroom stall, a glory hole appears on the wall. {1} The scent is strong, but not unpleasant, "
						+ "and %you/they% find %yourself/themselves% missing it when %you/they%'re away. However, {2} indulge in the pleasures of the glory hole,",
						initialTransformation,
						gloryHoleDescription,
						conditionPrep);
				} else {
					var sexToy = subjectFemale ? "dildo" : "pocket pussy";
					return String.format("{0} The next day, %you/they% receive a package containing a lifelike {1} shaped like a {2}. "
						+ "It's extremely tempting, but {3} use it,",
						initialTransformation,
						sexToy,
						cursedBodyPart,
						conditionPrep);
				}
			},
			requires: [nsfw, humanoidOrBeastOption],
			sets: [determinesRandomSex, usesStandardSubject, triggerSexBecomesOppositeSubjectSex, subjectIsLiving, replacesGenitals, subjectInhuman, oneSubject]
		},
		{
			makeTriggerText: function() {return String.format("{0} without {1}{2}",
				happensOnce ? "If %you/they% ever go one week" : "The longer %you/they% go",
				randomFrom([
					nsfwSelected || lewdSelected ? randomFrom(["having sex", "having an orgasm"]) : "cuddling someone",
					"cuddling someone",
					"bringing someone home on the first date",
					lewdSelected ? "using a glory hole" : "wrestling someone",
					"privacy",
					"being called a freak",
				]),
				happensOnce ? "," : ", the more");},
			durationText: happensOnce ? "If %you/they% don't fulfill the curse's requirement in one week, %you/they% are fully and permanently transformed.":
				"Each time %you/they% return to normal, %you/they% miss %your/their% curse a little bit more.",
			sets: [tfInStages],
		},
		{
			makeTriggerText: function() {return String.format("The longer %you/they% spend {0}, the more", activity.a);},
			makeDurationText: function() {
				var hours = randomFrom(["two", "ten", "a hundred", "fifty", "twenty-four"]);
				return happensOnce ?
					String.format("Once %you/they% spend a total of {0} hours {1}, %you/they% are fully and permanently transformed.",
						hours,
						activity.b)
				: String.format("If %you/they% can resist {0} for {1} hours, %you/they% slowly return to normal.", activity.b, hours)},
			sets: [tfInStages],
		},
		{
			makeTriggerText: function() {return String.format("{0} {1},",
				happensOnce ? "The next time %you/they%" : "Every time %you/they%",
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
			makeTriggerText: function(){return happensOnce ? "If %you/they% ever catch sight of the full moon," : "Each full moon";},
		},
		{
			makeTriggerText: function(){return happensOnce ? "The next time %you/they% are splashed with water" : "Each time %you/they% are splashed with water";},
		},
		{
			makeTriggerText: function(){return happensOnce ? "In one week" : String.format("Every {0}", randomFrom(["Monday", "Saturday", "Friday"]));},
			chosen: function(){shortDurationOnly = true;}
		},
		{
			triggerText: "Immediately,",
			durationText: "The transformation is permanent.",
			chosen: function(){happensOnce = true;},
			closingRemarkText: randomFrom([
				"I hope %you/they%'re sitting at home in front of %your/their% desktop right now.",
				"Who's going to find %you/them% like that?",
				"This might be awkward if %you/they%'re out in public.",
				"Surprise!",
				"If %you/they% don't send me feedback, I'll know why.",
				"I hope whatever clothes %you/they%'re wearing don't get damaged."]),
			requires: [uncommon],
		},
		{
			triggerText: randomFrom([
				"%You/They% will be kidnapped by a cult. They perform a profane ritual on %you/them% where",
				"A cruel witch will spike the punch at the next party %you/they% attend, and all the guests' bodies twist into new shapes. This includes %you/them%, and",
				"%You/They% will be exposed to toxic sludge via a chemical spill. Instead of getting sick,"]),
			durationText: "There's no way to return to normal.",
			chosen: function(){happensOnce = true;},
			requires: [uncommon],
		},
		{
			makeTriggerText: function(){return String.format(happensOnce ? "If %you/they% happen to touch {0}," : "Whenever %you/they% touch {0},",
				randomFrom(["someone's pet", "a wild animal", nsfwSelected || lewdSelected ? "an animal in heat" : "an angry animal", "an animal"]));},
			subjectText: "touched animal",
			sets: [touchTransformation, specificIndividualTarget, mundaneAnimalSubject, doNotAssignSubjectSex],
			requires: [beastOption, uncommon]
		},
		{
			triggerText: happensOnce ? "If %you/they% are ever bitten by an animal," : "Whenever %you/they% touch an animal's tail,",
			subjectText: "animal",
			sets: [touchTransformation, specificIndividualTarget, mundaneAnimalSubject, doNotAssignSubjectSex],
			requires: [beastOption, uncommon]
		},
		{
			makeTriggerText: function(){return happensOnce ? "If %you/they% ever touch a female animal," : "Whenever %you/they% touch a female animal,";},
			subjectText: "touched animal",
			chosen: function(){triggerFemale = true;},
			sets: [touchTransformation, specificIndividualTarget, mundaneAnimalSubject],
			requires: [beastOption, uncommon],
		},
		{
			makeTriggerText: function(){return happensOnce ? "If %you/they% ever touch a male animal," : "Whenever %you/they% touch a male animal,";},
			subjectText: "touched animal",
			chosen: function(){triggerFemale = false;},
			sets: [touchTransformation, specificIndividualTarget, mundaneAnimalSubject],
			requires: [beastOption, uncommon]
		},
		{
			makeTriggerText: function(){return happensOnce ? "If %you/they% ever eat meat or another animal product," : "Whenever %you/they% eat meat or another animal product,";},
			subjectText: "consumed species",
			sets: [specificIndividualTarget, mundaneAnimalSubject, doNotAssignSubjectSex],
			requires: [beastOption],
		},
		{
			makeTriggerText: function(){return happensOnce ? "When %you/they% next touch a man,": "Whenever %you/they% touch a man";},
			subjectText: "touched man",
			chosen: function(){triggerFemale = false;},
			sets: [touchTransformation, specificIndividualTarget, subjectIsHuman],
			requires: [humanOption, uncommon],
		},
		{
			makeTriggerText: function(){return happensOnce ? "When %you/they% next touch a woman": "Whenever %you/they% touch a woman";},
			subjectText: "touched woman",
			chosen: function(){triggerFemale = true;},
			sets: [touchTransformation, specificIndividualTarget, subjectIsHuman],
			requires: [humanOption, uncommon]
		},
		{
			makeTriggerText: function(){
				return String.format(happensOnce ? "When %you/they% next touch {0},": "Whenever %you/they% touch {0},",
				randomFrom(["someone", "%your/their% best friend", "%your/their% romantic partner", "a stranger in public", "%your/their% boss"]));},
			subjectText: "touched person",
			sets: [touchTransformation, specificIndividualTarget, subjectIsHuman],
			requires: [humanOption],
		},
		{
			makeTriggerText: function(){
				return String.format(happensOnce ? "The next time %you/they%{0} with {1}," : "Whenever %you/they%{0} with {1},",
				randomFrom(["'re alone", " lock eyes"]),
				randomFrom(["someone %you/they% hate", "someone %you/they% love", "a stranger", "%your/their% best friend", "a colleague"]));},
			makeAdditionalExplaination: function() {return randomFrom([
					nsfwSelected || lewdSelected ? "The other person finds this incredibly arousing." : "The other person finds this cute.",
					"The other person is afflicted with a similar curse.",
					"The other person will take advantage of %your/their% curse.",
					"The other person will help %you/them% hide %your/their% curse."
					]);},
			subjectText: "the other person",
			sets: [specificIndividualTarget, subjectIsHuman],
			requires: [humanOption],
		},
		{
			makeTriggerText: function(){return happensOnce ? "The next time someone sees %your/their% privates,": "Whenever anyone sees %your/their% privates,";},
			closingRemarkText: randomFrom([
				"I don't think this is what they were expecting when %you/they% said \"I'll show you mine.\"",
				"I hope %you/they% don't get pantsed anytime soon.",]),
			requires: [nsfw]
		},
		{
			makeTriggerText: function(){return happensOnce ? "The next time %you/they% get publicly humiliated,": "Whenever %you/they% are embarrassed,";},
			makeAdditionalExplaination: function() {return happensOnce ? "%You/They% transform partially when %you/they%'re embarrassed." : "The more embarrassed %you/they% are, the more %you/they% change.";},
			sets: [tfInStages],
		},
		{
			makeTriggerText: function(){return happensOnce ? "The next time %you/they% get blackout drunk,": "Whenever %you/they% get drunk,";},
			makeAdditionalExplaination: function() {return happensOnce ? "If %you/they% only have a couple drinks, %you/they% transform partially." : "The more intoxicated %you/they% are, the more %you/they% change.";},
			makeDurationText: function(){return happensOnce ? "The transformation is permanent." : ""},
			sets: [tfInStages],
		},
		{
			makeTriggerText: function(){return happensOnce ? "There exists a phrase, and, if %you/they% ever hear it," : "%You/They% have a secret key phrase, and whenever %you/they% hear it";},
			additionalExplaination: randomFrom([
				"%You/They% can't resist dropping hints about the curse's trigger phrase.",
				"%You/They% can't resist saying the curse's trigger phrase when %you/they% think %you/they%'re alone.",
				"%You/They% have the curse's trigger phrase tattooed above %your/their% ass.",
				"%Your/Their% rival knows the curse's trigger phrase.",
				"The trigger phrase is any comment about %your/their% appearance.",
				"The trigger phrase is any of %your/their% online usernames.",
				"The trigger phrase is any compliment directed toward %you/them%.",
				"The trigger phrase is any insult directed toward %you/them%.",
				"The trigger phrase is the name of the creature %you/they% transform into.",
				"The trigger phrase is immediately texted to everyone on %your/their% contacts list.",
				"The trigger phrase is %your/their% own name."]),
		},
		{
			makeTriggerText: function(){return happensOnce ? "The next time %you/they% orgasm," : "Each time %you/they% orgasm,";},
			additionalExplaination: "%You/They% transform partially when %you/they%'re aroused.",
			requires: [nsfw],
			sets: [tfInStages],
		},
		{
			makeTriggerText: function(){return happensOnce ? "Immediately after the next time %you/they% have sex," : "Each time %you/they% have sex,";},
			closingRemarkText: randomFrom([
				"Welp, that's going to be awkward.",
				"How's that for an afterglow?",
				"Hopefully %your/their% partner doesn't die of surprise."]),
			sets: [touchTransformation],
			requires: [nsfw]
		},
		{
			makeTriggerText: function(){return happensOnce ? "The next time %you/they% see an animal" : "Whenever %you/they% see an animal,";},
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
						"%You/They% will find",
						"%You/They% will be chosen to be %your/their% school's new mascot at homecoming. They give %you/them%",
						"%You/They% will receive a package in the mail containing"
						]),
					costume,
					happensOnce ? "If %you/they% ever wear it," : "Whenever %you/they% wear it,",
					randomFrom([
						String.format("the zipper disappears, the fabric turns to flesh, and %you/they% find %yourself/themselves% stuck as a cartoonish version of {0}", costume),
						String.format("the costume merges with %your/their% flesh, turning %you/them% into {0}", costume),
						String.format("the costume merges with %your/their% flesh and disappears, leaving %you/them% as {0}", costume),
						String.format("the costume's fabric replaces %your/their% flesh, leaving %you/them% trapped as a giant, animated plushy that looks like {0}", costume),
						String.format("the costume's fabric replaces %your/their% flesh, leaving %you/them% trapped as an animate version of {0} that is made out of synthetic material", costume)
					])
				)},
			transformationText: "",
			sets: [specificIndividualTarget, subjectInhuman, subjectIsLiving, doNotRenderSubject],
			requires: [humanoidOrBeastOption],
			closingRemarkText: randomFrom(["I have the strangest urge to beat %you/them% up right now.", "I just want to cuddle %you/them%!"])
		},
		{
			makeTriggerText: function(){return happensOnce ? "Tomorrow morning" : String.format("Every {0},", randomFrom(["sunrise", "sunset", "night at midnight"]));},
			chosen: function(){shortDurationOnly = true;},
			closingRemarkText: randomFrom(["%You/They% just have to find a new routine.", "I hope %you/they%'re at %your/their% own house.", "That's not that long from now!"])
		},
	];

	// =====================
	//    TRANSFORMATIONS
	// =====================

	var getBodyType = function(){return randomFrom([
		"a thicc",
		"a plump",
		decidedAndTrue(subjectFemale) ? "a volumptuous" : "a muscular",
		"an athletic",
		"a musclebound",
		"a curvy",
		decidedAndTrue(subjectFemale) ? "a tomboy" : "a feminine",
		decidedAndTrue(subjectFemale) ? "a flat-chested" : "an androgynous",
		decidedAndTrue(subjectFemale) ? "a shortstack" : "a short",
		"a gigantic",]);};
	var pussyName = randomFrom(["pussy", "vulva", "vagina"]);
	var dickName = randomFrom(["dick", "cock", "penis"]);

	var expansionTF = {
		makeTransformationText:function(){
			var growthWordSingular = ["swells", "grows"];
			var growthWordPlural = ["swell", "grow", "expand"];
			var breastSize = decidedAndTrue(stagesTF) ? "an additional cup size"
				: String.format("{0} {1}",
					randomFrom(["into head-sized",
						"into E-cup",
						"into G-cup",
						"into pillow-sized",
						"into watermelon-sized",
						"as silicon forms beneath %your/their% flesh, leaving %you/them% with giant, fake-looking"]),
					randomFrom(["tits", "breasts", "jugs", "boobs"]));
			var defaultSize = decidedAndTrue(stagesTF) ? "noticably larger"
				: randomFrom(["large enough to always create a noticable bulge",
					"to an inconvenient size",
					"until %your/their% pants no longer fit",
					"to freakish proportions",
					"so large, walking becomes a chore"]);
			var defaultSize2 = decidedAndTrue(stagesTF) ? "noticably larger"
				: randomFrom(["large enough to always create a noticable bulge",
					"to an inconvenient size",
					"until %your/their% pants no longer fit",
					"to freakish proportions",
					"so large, walking becomes a chore"]);
			var assSize = decidedAndTrue(stagesTF) ? "noticably larger"
				: randomFrom(["until %your/their% pants burst",
					"until %your/their% pants no longer fit",
					"to freakish proportions",
					"so large, walking becomes a chore"]);
			var penisSize = decidedAndTrue(stagesTF) ? "an additional inch"
				: randomFrom(["to the length of %your/their% forearm",
					"so large that no human could possibly take %you/them%",
					"large enough to make a stallion jealous",
					"large enough to hit %your/their% chin when %you/they%'re erect"]);
			var clitSize = decidedAndTrue(stagesTF) ? "an additional inch"
				: randomFrom(["to the size of %your/their% thumb",
					"large enough to stroke it like a penis",
					"large enough to penetrate a partner",
					"large enough that it makes a bump in %your/their% pants when %you/they%'re horny",
					"so large %you/they% can reach it with %your/their% mouth"]);
			var lipsSize = decidedAndTrue(stagesTF) ? "a bit bigger" : randomFrom([
				"to be unnaturally large",
				"and become an erogenous zone",
				"so large that everyone stares at %your/their% mouth when %you/they%'re speaking",
				"into a permanent, pillowy pucker",
			]);
			var passageSize = decidedAndTrue(stagesTF) ? "a little larger"
				: randomFrom(["unnaturally deep and large",
					"to be unnaturally accomodating, shifting %your/their% guts to make room",
					"large enough to easily take a fist",
					"large enough to leave a visible bulge in %your/their% pants"]);
			var bodypartGrowth = decidedAndTrue(subjectFemale) ? randomFrom([
					{a: "breasts", b: randomFrom(growthWordPlural.concat(["balloon", "expand"])), c: breastSize},
					{a: "ass", b: randomFrom(growthWordSingular.concat(["balloons", "expands"])), c: assSize},
					{a: "lips", b: randomFrom(growthWordPlural.concat(["balloon", "expand"])), c: lipsSize}
					])
				: randomFrom([
					{a: "asshole", b: randomFrom(growthWordSingular), c: passageSize},
					{a: "belly", b: randomFrom(growthWordSingular), c: defaultSize}
						]);
			var genitalGrowth = decidedAndTrue(subjectFemale) ? randomFrom([
					{a: "pussy", b: randomFrom(growthWordSingular), c: randomFrom([defaultSize2, passageSize])},
					{a: "clit", b: randomFrom(growthWordSingular), c: randomFrom([defaultSize2, clitSize])},
					])
				: decidedAndFalse(subjectFemale) ? randomFrom([
					{a: "penis", b: randomFrom(growthWordSingular), c: randomFrom([defaultSize2, penisSize])},
					{a: "balls", b: randomFrom(growthWordPlural), c: defaultSize2},
					{a: "cock and balls", b: randomFrom(growthWordPlural), c: defaultSize2}
					])
				: {a: "genitals", b: randomFrom(growthWordPlural), c: defaultSize2};
			var partAndGrowth = randomFrom([bodypartGrowth, genitalGrowth]);
			return randomFrom([
				String.format("%your/their% {0} {1} {2}",
					partAndGrowth.a,
					partAndGrowth.b,
					partAndGrowth.c),
				String.format("%your/their% {0} {1} {2}, and %your/their% {3} {4} {5}",
					bodypartGrowth.a, bodypartGrowth.b, bodypartGrowth.c,
					genitalGrowth.a, genitalGrowth.b, genitalGrowth.c)
			]);
		},
		subjectText: "",
		closingRemarkText: "Bigger, bigger bigger!",
		sets: [subjectIsHuman, doNotRenderSubject, subjectSexBecomesStartingSex, doNotAssignSubjectSex, isExpansionTF],
		requires: [canSupplySubject, humanOption, nsfw, noSpecificIndividualTarget]
	};
	// var sentientGenitals = {}
	//TODO: actually do these
	var cockTailTF = {
		makeTransformationText:function(){
			return "%you/they% grow a prehensile tail tipped with a functioning penis";
		},
		subjectText: "",
		makeAdditionalExplaination: function() {
			return randomFrom([
				"%Your/Their% tail has a pair of balls nestled at its base that jostle against %your/their% ass.",
				"%You/They% don't have any control over %your/their% tail, and it's very horny.",
				"%Your/Their% tail attempts to penetrate and rub against things when %you/they%'re horny.",
				"%You/They% can pee through %your/their% tail."
			]);
		},
		sets: [subjectIsHuman, doNotRenderSubject, subjectSexBecomesStartingSex, doNotAssignSubjectSex],
		requires: [canSupplySubject, lewd, humanOption, noSpecificIndividualTarget, tfAtomic]
	}
	var handFootMixupTF = {
		makeTransformationText:function(){
			return randomFrom([
				"%your/their% fingers shrink, %your/their% palms swell, and %you/they% are left with feet in the place of hands",
				"%your/their% feet transform into hands, and %your/their% hands transform into feet",
				"%your/their% toes twitch and stretch as %your/their% feet become copies of %your/their% hands"]);
		},
		subjectText: "",
		sets: [subjectIsHuman, doNotRenderSubject, subjectSexBecomesStartingSex, doNotAssignSubjectSex],
		requires: [canSupplySubject, humanOption, noSpecificIndividualTarget, tfAtomic, uncommon]
	}
	var lippleTF = {
		makeTransformationText:function(){
				return subjectFemale ?
				"%your/their% nipples invert, %your/their% areola reform into smacking lips, and %you/they% are left with fully-functioning mouths in the place of nipples"
			: "%you/they% grow a pair of breasts with fully-functioning mouths in the place of nipples";
		},
		subjectText: "",
		makeAdditionalExplaination: function() {
			return randomFrom([
				"%Your/Their% nipples catcall strangers.",
				"%You/They% can only speak using %your/their% lipples.",
				"%You/They% can't stop %your/their% nipples from speaking %your/their% dirty thoughts.",
				"Eating with %your/their% lipples is orgasmic.",
				"%Your/Their% lipples nurse anything %you/they% put near them."
			]);
		},
		sets: [subjectIsHuman, doNotRenderSubject, subjectSexBecomesStartingSex, doNotAssignSubjectSex],
		requires: [canSupplySubject, lewd, humanOption, noSpecificIndividualTarget, tfAtomic]
	};
	var subjectGenitalMouthTF = {
		makeTransformationText:function(){return specificTarget
			? String.format("%you/they% grow a copy of the {0}'s genitals in %your/their% mouth", curse.renderSubjectText())
			: String.format("%your/their% {0} transforms into the {1} of {2} {3}",
				decidedAndFalse(subjectFemale) ? "tongue" : "mouth",
				subjectFemale ? pussyName : dickName, subjectArticle,
				curse.renderGenderedSubjectText());},
		makeAdditionalExplaination: function() {
			return String.format("Whenever %you/they%'re aroused, %your/their% {0}.",
			decidedAndFalse(subjectFemale) ? "penis-tongue slides past %your/their% lips"
			: "mouth dribbles sexual fluids");
		},
		sets: [subjectSexBecomesSpecificTriggerSex, doNotRenderSubject, determinesRandomSex, becomingCreatureHybrid, allowBeastsIfHumanoid],
		requires: [lewd, subjectSexBecomesSpecificTriggerSex, humanoidOption],
	};

	var transformations = [
		// general transformations
		lippleTF,
		handFootMixupTF,
		cockTailTF,
		subjectGenitalMouthTF,
		expansionTF,
		{
			makeTransformationText:function(){return String.format("%you/they% transform into {0}", specificTarget ? "a copy of the" : subjectArticle);},
			requires: [subjectSexBecomesSpecificTriggerSex],
			sets: [subjectSexBecomesSpecificTriggerSex]
		},
		{
			makeTransformationText:function(){return String.format("%you/they% {0} shift into {1}",
						randomFrom(["pleasurably", "painfully", "quickly", "slowly", "violently", "noisily", "cartoonishly"]), specificTarget ? "a copy of the" : subjectArticle);},
			requires: [subjectSexBecomesSpecificTriggerSex],
			sets: [subjectSexBecomesSpecificTriggerSex]
		},
		{
			makeTransformationText:function(){return String.format("%you/they% become {0}", specificTarget ? "a copy of the" : subjectArticle);},
			requires: [subjectSexBecomesSpecificTriggerSex],
			sets: [subjectSexBecomesSpecificTriggerSex]
		},
		{
			makeTransformationText:function(){return specificTarget
				? "an additional head grows beside %your/their% own. It's that of the"
					: String.format("an additional head grows beside %your/their% own, and %your/their% original head changes to match. The heads are those of {0}", subjectArticle);},
			additionalExplaination: randomFrom([
				specificTarget ? "The new head retains its own mind." : "%You/They% have no control over %your/their% new head.",
				"%You/They% control the additional head fully.",
				"%Your/Their% personality is split between the heads. One gets %your/their% libido and passion, the other gets %your/their% logic and restraint.",
				"%You/They% get along with %your/their% new head like a sibling most of the time, but it's always making sexual advances."]),
			closingRemarkText: "It isn't always easy <a href=\"https://www.furaffinity.net/view/21328649/\">sharing a body with others</a>.",
			sets: [doNotAssignSubjectSex],
			requires: [tfAtomic, veryUncommon, humanoidOption],
		},
		{
			makeTransformationText:function(){return String.format("%your/their% head transforms into that of {0}", specificTarget ? "the" : subjectArticle);},
			sets: [doNotAssignSubjectSex, becomingCreatureHybrid],
			requires: [subjectInhuman, humanoidOrBeastOption, veryUncommon],
		},
		{
			makeTransformationText:function(){return String.format("%you/they% upside-down transform into {0}", specificTarget ? "a copy of the" : subjectArticle);},
			makeAdditionalExplaination: function(){return String.format(
				"The new head emerges from %your/their% crotch, while %your/their% own head is reduced to its new {0}. {1}",
				randomFrom([
					isDecided(subjectFemale) ? subjectFemale ? pussyName : dickName : "genitals",
					isDecided(subjectFemale) ? subjectFemale ? pussyName : dickName : "reproductive organs",
					isDecided(subjectFemale) ? subjectFemale ? pussyName : dickName : "backside",
					"asshole"]),
				randomFrom([
					"%Your/Their% consciousness remains confined to %your/their% new body's backside, leaving %you/them% a helpless passenger. %Your/Their% body's new owner is horny, mischevious, and has access to %your/their% memories.",
					"%Your/Their% consciousness remains confined to %your/their% new body's backside, leaving %you/them% a helpless passenger. %Your/Their% body's new owner appears to be a mental duplicate of %yourself/themselves% and has no idea %you/they% still exist.",
					"%Your/Their% consciousness remains confined to %your/their% new body's backside, but %you/they% can wrestle with %your/their% bodymate for control.",
					"The moment when %your/their% conciousness shifts from one head to the other is very disorienting.",
				]));},
			sets: [subjectSexBecomesSpecificTriggerSex],
			requires: [lewd, subjectSexBecomesSpecificTriggerSex, veryUncommon],
		},
		{
			makeTransformationText:function(){return String.format("%your/their% genitals transform into the mouth of {0}", specificTarget ? "the" : subjectArticle);},
			additionalExplaination: randomFrom([
				"%You/They% have no control over %your/their% new mouth.",
				"Whatever was between %your/their% legs before ends up incorporated into %your/their% new mouth.",
				"Whatever was between %your/their% legs before ends up incorporated into %your/their% original mouth.",
				"Eating is an orgasmic experience."]),
			sets: [doNotAssignSubjectSex, becomingCreatureHybrid, allowBeastsIfHumanoid],
			requires: [lewd, veryUncommon, humanoidOption]
		},
		{
			makeTransformationText:function(){return String.format("{0}", happensOnce
				? "%you/they% spend the next 24 hours transforming into" :
				randomFrom([
					String.format("%you/they% transform a little bit more into {0}",
						specificTarget ? "a copy of the" : subjectArticle),
					String.format("a new part of %your/their% body transforms into that of {0}",
						specificTarget ? "the" : subjectArticle)])
			);},
			durationText: happensOnce ? "" :
				randomFrom([
					"After each change, %your/their% new instincts overwhelm %you/them%, and %you/they% lose control for a while.",
					"If %you/they% focus, %you/they% can suppress the changes for up to an hour at a time.",
					nsfwSelected || lewdSelected ? "%You/They% can suppress the changes, but it makes %you/them% unbearably horny." : "%You/They% can suppress the changes, but it makes %you/them% unbearably hungry.",
					""
				]),
			closingRemarkText: "I looooove the slow burn.",
			requres: [subjectSexBecomesSpecificTriggerSex],
			sets: [subjectSexBecomesSpecificTriggerSex, tfInStages]
		},
		{
			transformationText: "%you/they% switch genders",
			additionalExplaination: randomFrom([
				"%You/They% absolutely love %your/their% new life.",
				"All %your/their% friends start hitting on %you/them%, and %you/they%'re tempted to start dating one of them.",
				"%You/They% look like an androgynous version of %your/their% old self, but the equipment between %your/their% legs is the real deal.",
				"%You/They% never quite feel comfortable as %your/their% new sex, and often \"crossdress\" to match %your/their% original gender.",
				"%You/They% find %yourself/themselves% hopelessly attracted to all %your/their% friends."]),
			subjectText: "",
			sets: [subjectIsHuman, doNotRenderSubject, transgenderTF],
			requires: [canSupplySubject, humanOption, tgOption]
		},
		{
			makeTransformationText:function(){return String.format("%you/they% become {0} taur version of {1}",
				Math.random() < 0.3 ? "a" : getBodyType(),
				subjectArticle);},
			sets: [subjectSexBecomesSpecificTriggerSex, becomingCreatureHybrid],
			requires: [humanoidOption, subjectSexBecomesSpecificTriggerSex],
		},
		{
			makeTransformationText:function(){return String.format("%you/they% become a sentient sex doll made to look like {0}",
				specificTarget ? "the" : subjectArticle);},
			additionalExplaination: randomFrom([
				"Mental conditioning makes fulfilling %your/their% duties a pleasure.",
				"Whenever anyone sees %you/them%, they have an urge to use %you/them%.",
				"%You/They% cannot refuse any command."]),
			sets: [subjectSexBecomesSpecificTriggerSex, subjectIsNonLiving],
			requires: [nsfw, inanimateOption, subjectSexBecomesSpecificTriggerSex]
		},
		{
			makeTransformationText:function(){return String.format("%you/they% become a {0} {1}",
				randomFrom(["stone statue of", "wooden carving of", "fountain shaped like", ]),
				specificTarget ? "the" : subjectArticle);},
			additionalExplaination: randomFrom([
				"%You/They% retain %your/their% senses.",
				"Time passes quickly.",]),
			sets: [subjectSexBecomesSpecificTriggerSex, subjectIsInanimate],
			requires: [nsfw, inanimateOption, subjectSexBecomesSpecificTriggerSex, uncommon]
		},
		{
			makeTransformationText:function(){return String.format("%your/their% skin hardens, %your/their% joints freeze, and %you/they% become a {0} %yourself/themselves%",
				randomFrom(["stone statue of ", "wooden carving of", "fountain shaped like"]));},
			additionalExplaination: randomFrom([
				"%You/They% retain %your/their% senses.",
				"Time passes quickly.",]),
			subjectText: "",
			sets: [subjectSexBecomesSpecificTriggerSex, doNotRenderSubject, subjectIsInanimate],
			requires: [nsfw, inanimateOption, canSupplySubject, subjectSexBecomesSpecificTriggerSex, uncommon]
		},
		{
			makeTransformationText: function() {return String.format("%your/their% {0} transform into {1} tentacles",
				randomFrom(["arms", "legs", "arms and legs", "arms, legs, and tailbone"]),
				randomFrom(["squid", "octopus", "alien", "muscular", "writhing", "thick and stubby"]))},
			additionalExplaination: randomFrom([
				"%You/They% have no control over %your/their% new tentacles.",
				"%Your/Their% tentacles constantly produce slime.",
				"%You/They% find controlling %your/their% new tentacles to be very intuitive.",
				"%Your/Their% tentacles dry out if %you/they% don't moisten them regularly.",
				nsfwSelected || lewdSelected ? "Whenever %you/they%'re not paying attention to %your/their% tentacles, they creep toward %your/their% privates and start massaging them."
					: "%Your/Their% new tentacles are exceptionally large.",
				lewdSelected ? "The tips of %your/their% tentacles are erogenous zones."
					: "%Your/Their% tentacles can't stay still for long."]),
			subjectText: "",
			sets: [doNotAssignSubjectSex, doNotRenderSubject, becomingCreatureHybrid],
			requires: [subjectInhuman, canSupplySubject, humanoidOption, noSpecificIndividualTarget, uncommon],
		},
		// Inhuman transformations
		{
			makeTransformationText:function(){return String.format("%you/they% transform into {0} anthro {1}",
				Math.random() < 0.3 ? "an" : getBodyType(),
				specificTarget ? "version of the" : "");},
			sets: [becomingCreatureHybrid],
			requires: [subjectInhuman, humanoidOption],
		},
		{
			makeTransformationText:function(){return String.format("%you/they% shift into {0} anthropomorphic {1}",
				Math.random() < 0.3 ? "an" : getBodyType(),
				specificTarget ? "version of the" : "");},
			sets: [becomingCreatureHybrid],
			requires: [subjectInhuman, humanoidOption],
		},
		{
			makeTransformationText:function(){return String.format("%you/they% transform into {0} {1} version of {2}",
				Math.random() < 0.3 ? "a" : getBodyType(),
				subjectFemale ? "monstergirl" : "monsterboy",
				specificTarget ? "the" : subjectArticle);},
			closingRemarkText: randomFrom([
				"Just inhuman enough for mass appeal.", "How kawaii!"]),
			sets: [becomingCreatureHybrid, determinesRandomSex],
			requires: [subjectInhuman, humanoidOption],
		},
		{
			makeTransformationText:function(){return String.format("%you/they% become an inflatable pool toy shaped like {0}", specificTarget ? "the" : subjectArticle);},
			closingRemarkText: randomFrom([
				"What are %you/they% going to do in the winter?",
				"Hopefully %you/they% can warn people ahead of time.",
				"I'd put my lips on %your/their% nozzle ;)",
				"I've always wondered what it feels like to get inflated. You'll have to tell me."]),
			makeAdditionalExplaination: function() {return randomFrom([
				"%You/They% go unconcious when deflated.",
				"%You/They% can still move when transformed.",
				"Everyone loves playing with %you/them%.",
				lewdSelected || nsfwSelected ? "%Your/Their% asshole turns into %your/their% new nozzle."
					: "%Your/Their% nozzle is in the place of %your/their% belly button.",
				"%Your/Their% valve is an erogenous zone."])},
			sets: [subjectIsInanimate, allowBeasts],
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
					"%your/their% limbs melt away, and %your/their% body shrinks and stiffens",
					"%your/their% body collapses into %your/their% genitals as they shift and reform"
				]);
				return String.format("{0}, reducing %you/them% to a {1}", tfText, sexToy);},
			closingRemarkText: randomFrom([
				"At least %you/they%'ll be able to bring joy to others.",
				]),
			makeAdditionalExplaination: function() {
				var matchingBodyPart = String.format("{0} of {1} {2}", !subjectFemale ? pussyName : dickName, subjectArticle,  renderOppositeSex(curse.renderGenderedSubjectText));
				return randomSelectionFrom([
				"%You/They% can still sense the world around %you/them% when transformed.",
				"While transformed, every touch brings unimaginable pleasure.",
				"%You/They% are constantly horny.",
				decidedAndTrue(subjectFemale) ? "%Your/Their% opening is always moist with its own synthetic lubricant."
					: "%You/They% leak a synthetic lubricant when touched.",
				"Anyone who picks %you/them% up has an irresistable urge to use %you/them%.",
				String.format("Any time someone touches %you/them%, their genitals reform into the {0}.",
					matchingBodyPart),
				"%You/They% can still move a little bit and even wriggle along the floor if given enough time."])
				.join(' ');},
			sets: [determinesRandomSex, doNotRenderSubject, subjectIsInanimate, oneSubject, allowBeasts],
			requires: [inanimateOption, lewd, tfAtomic],
		},
		{
			makeTransformationText:function(){return String.format("%your/their% {0} replaced with the {1} of {2}",
				decidedAndTrue(startingFemale) ? "pussy is" : decidedAndFalse(startingFemale) ? "penis is" : "genitals are",
				decidedAndTrue(subjectFemale) ? pussyName : decidedAndFalse(subjectFemale) ? dickName: "genitals",
				specificTarget ? "the" : subjectArticle);},
			additionalExplaination: beastsSelected ? randomFrom([
				"%You/They% adopt the donor's sexual urges.",
				"%You/They% adopt the donor's sexual preferences.",])
				: "At least %you/they%'re still mostly human.",
			requires: [nsfw, genitalReplacementAllowed, tfAtomic, subjectSexBecomesSpecificTriggerSex, humanoidOption],
			sets: [allowBeastsIfHumanoid, subjectSexBecomesSpecificTriggerSex, becomingCreatureHybrid],
		},
		{
			makeTransformationText:function(){return String.format("%you/they% grow the {0} of {1}",
				randomFrom([
					extremitiesName,
					facialFeatureName,
					nsfwSelected || lewdSelected
						? decidedAndTrue(subjectFemale) ? pussyName : decidedAndFalse(subjectFemale) ? dickName: "genitals"
						: "tail",
					"tail"]),
				subjectArticle);},
			makeComplicationText: function() {return happensOnce
				? "Over the next year, the rest of %your/their% body transforms to match."
				: String.format("Each time %you/they% transform, {0} changes.", randomFrom(["an additional bodypart also", "a different bodypart"]));},
			sets: [doNotAssignSubjectSex, becomingCreatureHybrid, tfInStages],
			requires: [subjectInhuman, beastOption, tfAtomic],
		},
		{
			makeTransformationText: function() {return String.format("%your/their% {0} and {1} transform into those of {2}",
				randomSelectionFrom(["arms", "hands", "torso", "legs", "head", "feet"]).join(', '),
				nsfwSelected ? "genitals" : "backside",
				specificTarget ? "the" : subjectArticle)},
			sets: [becomingCreatureHybrid],
			requires: [humanoidOption, subjectInhuman],
		},
		{
			makeTransformationText: function() {return String.format("%you/they% sprout the tail and {0} of {1}",
				randomFrom([facialFeatureName, extremitiesName]),
				specificTarget ? "the" : subjectArticle)},
			makeAdditionalExplaination: function() {return randomFrom([
				nsfwSelected || lewdSelected ? "%Your/Their% transformed parts are erogenous zones." : "Other people find %your/their% face hypnotically cute.",
				String.format("Animal noises slip out of %your/their% mouth when %you/they%'re {0}.", randomFrom(["nervous", "excited", nsfwSelected || lewdSelected ? "aroused" : "hungry"])),
				"Other people find %your/their% face hypnotically cute."
			])},
			sets: [doNotAssignSubjectSex, becomingCreatureHybrid],
			requires: [subjectInhuman, beastOption, tfAtomic],
		},
		{
			makeTransformationText:function(){return String.format("%you/they% become {0} {1} from the waist down",
				specificTarget ? "the" : subjectArticle, curse.renderGenderedSubjectText());},
			sets: [becomingCreatureHybrid, doNotRenderSubject, subjectSexBecomesSpecificTriggerSex],
			requires: [subjectInhuman, humanoidOption, subjectSexBecomesSpecificTriggerSex],
		},
		// touch transformations
		{
			makeTransformationText:function(){return randomFrom([
				"%you/they% merge with them, becoming a two-headed hybrid",
				String.format("%you/they% merge with them, becoming the {0} of a new taur",
					randomFrom(["top half", "bottom half"]))])
			},
			subjectText: "",
			closingRemarkText: "I hope %you/they% really liked them.",
			sets: [subjectSexBecomesTriggerSex, doNotRenderSubject, becomingCreatureHybrid],
			requires: [subjectSexBecomesTriggerSex, touchTransformation, tfAtomic, humanoidOption, canSupplySubject],
		},
		{
			makeTransformationText:function(){return String.format("%you/they% merge with them, becoming their new {0}",
				isUndecided(triggerFemale) ? "genitals" : triggerFemale ? pussyName : dickName);},
			additionalExplaination: randomFrom([
				"%You/They% don't lose %your/their% eyes when %you/they% merge. They remain above %your/their% host's junk, taking in the views and looking pretty upset.",
				"%You/They% can exert some control over %your/their% host's libido.",
				"%You/They% can communicate with %your/their% host mentally and access their senses.",
				"%Your/Their% new host doesn't remember the transformation."]),
			sets: [subjectSexBecomesTriggerSex, doNotRenderSubject],
			requires: [touchTransformation, lewd, tfAtomic, inanimateOption, subjectSexBecomesTriggerSex],
		},
		// mental transformations
		{
			makeTransformationText:function(){return String.format("%you/they% swap minds with {0}", specificTarget ? "the" : "the nearest");},
			requires: [extantCreaturesAllowed, tfAtomic, mentalOption, subjectIsAnimate, subjectSexBecomesTriggerSex],
			sets: [subjectSexBecomesTriggerSex, mundaneAnimalSubject, mentalOnly]
		},
		{
			makeTransformationText:function(){return String.format("%you/they% are possessed by the {0} spirit of {1}",
				randomFrom(["malevolent", "bubbly", "dominating", "mischievous", "jealous", "unpredictable", "horny"]), subjectArticle)},
			additionalExplaination: String.format("{0}, and {1}",
				randomFrom([
					"The spirit is always fighting %you/them% for control",
					"The spirit forcibly takes control if %you/they% don't sate their needs",
					"The spirit asserts itself by transforming parts of %your/their% body at inopportune times",
					"Control of %your/their% body swaps between %you/them% and the spirit at random intervals"]),
				randomFrom([
					nsfwSelected || lewdSelected ? "it compels %you/them% to breed." : "it compels %you/them% with an insatiable hunger.",
					"it compels %you/them% with an insatiable hunger.",
					"it just wants to party.",
					"it wants %you/them% to find it a better vessel.",
					"%you/they% black out when it is in control."])),
			sets: [mentalOnly, allowBeasts],
			requires: [mentalOption, nsfw, subjectIsAnimate, noSpecificIndividualTarget],
		},
		{
			makeTransformationText:function(){return String.format("{0}. {1} {2}",
				stagesTF ? String.format(
					"%your/their% skin becomes more like the rind of a {0}, and %your/their% body expands a little more",
					curse.renderSubjectText())
				: randomFrom([
					"%your/their% body expands, envoloping %your/their% limbs",
					String.format("%you/they% find %your/their% saliva tastes sweet like {0} juice. The rest of %your/their% bodily fluids follow, and %your/their% stomach inflates as the juices build up inside %you/them%",
						curse.renderSubjectText()),
				]),
				stagesTF ? "Eventually, %you/they%" : "%You/They%",
				"are left swollen up into a giant, humanoid");
			},
			subjectText: randomFrom(["watermelon", "blueberry", "peach", "pumpkin", "pear", "apple", "squash", "orange"]),
			chosen: function(){extremitiesName = "leaves"; renderSubjectGender = false},
			makeAdditionalExplaination: function(){return String.format("Being eaten is incredibly pleasurable, and %you/they% regenerate quickly. {0}",
				randomFrom([
					"%Your/Their% body is an aphrodesiac.",
					"%You/They% are absolutely delicious.",
					"%You/They% drool tasty juice.",
					"%Your/Their% smell makes people hungry.",
					"%You/They% can feel pieces of %your/their% body a while after they're separated from %you/them%.",
					"People have an urge to take bites from %you/them%.",
				]));},
			sets: [subjectInhuman, subjectIsInanimate, setPussyName("flower"), setDickName("flower"), setFacialFeature("leaves")],
			requires: [notBecomingHybrid, inanimateOption, noSpecificIndividualTarget, beingTransformed, canSupplySubject, uncommon],
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
		String.format("%You/They% have a {0} pair of {1} teats nestled above %your/their% crotch.{2}",
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
				" You're lactating, but %you/they% can never milk %yourself/themselves%.",
				" They bounce noticeably with every step.",
				" %Your/Their% milk is deeply addictive to others.",
				" Anyone who consumes %your/their% milk is also afflicted with %your/their% curse.",
				"",
			]))
		: randomFrom([
			String.format("%You/They% have the digestive system {0}of {1} {2}.",
				nsfwSelected || lewdSelected ? "and asshole " : "",
				subjectArticle,
				curse.renderSubjectText()),
			"Whenever %you/they%'re standing on grass, %you/they% forget that going to the bathroom in public is frowned upon.",
			"%You/They% find walking on all fours very natural."
			]);};


	var subjects = [
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "cow" : "bull" : "cow";}, //[sic] gender-neutral is "cattle" but everyone just calls them cows
			closingRemarkText: "Uhh. . . Moo?",
			makeAdditionalExplaination: function() {return randomFrom([
				decidedAndTrue(subjectFemale) ? "%You/They% also have an udder and give milk." : "%You/They% can always feel a 'moo' building in %your/their% throat, begging to be let out.",
				decidedAndTrue(subjectFemale) ? "%You/They% have pink fur and an udder that gives delicious strawberry-flavored milk." : "%You/They% can always feel a 'moo' building in %your/their% throat, begging to be let out.",
				decidedAndTrue(subjectFemale) ? "%You/They% have brown fur and an udder that gives delicious chochocolate milk." : "%You/They% can always feel a 'moo' building in %your/their% throat, begging to be let out.",
				decidedAndTrue(subjectFemale) ? "%You/They% also have an udder, and the milk is deeply addictive." : "%You/They% hate the color red, and %you/they% find cows strangely alluring.",
				"%You/They% can always feel a 'moo' building in %your/their% throat, begging to be let out."]);},
			sets: [determinesRandomSex, mundaneAnimalSubject, setPussyName("sloppy ".concat(pussyName)), setExtremitiesName("hooves"), setFacialFeature("clumsy snout")],
			requires: [beastOption],
		},
		{

			makeSubjectText: function(){return String.format("{0}{1}",
				breed1,
				isDecided(subjectFemale) ? subjectFemale ? " bitch" : " stud" : "");},
			closingRemarkText: randomFrom([
				"That's a solid breed.",
				"Now beg.",
				"Some people have a hard time <a href=\"https://www.furaffinity.net/view/31505769/\"> " +
					"resisting the urge to let their inner dog out</a>.",]),
			sets: [determinesRandomSex, mundaneAnimalSubject, setPussyName("puffy ".concat(pussyName)), setDickName("knotted ".concat(dickName)), setExtremitiesName("paws")],
			requires: [beastOption],
		},
		{

			makeSubjectText: function(){return String.format("{0}{1}",
				breed2,
				isDecided(subjectFemale) ? subjectFemale ? " bitch" : " stud" : "")},
			closingRemarkText: randomFrom(["That's a good doggy.","Are %you/they% going to pretend to be someone's pet?"]),
			sets: [determinesRandomSex, mundaneAnimalSubject, setPussyName("puffy ".concat(pussyName)), setDickName("knotted ".concat(dickName)), setExtremitiesName("paws")],
			requires: [beastOption],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "doe" : "buck" : "deer";},
			chosen: function(){extremitiesName = "hooves", facialFeatureName = "magnificent antlers";},
			closingRemarkText: "A noble animal with a great rack.",
			makeAdditionalExplaination: function(){return Math.random() < 0.5 ? "" : crotchBoobsDescription()},
			sets: [determinesRandomSex, mundaneAnimalSubject, setDickName("long and slender ".concat(dickName))],
			requires: [beastOption],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "female cat" : "tom cat" :  "cat";},
			chosen: function(){facialFeatureName = "whiskers";},
			sets: [determinesRandomSex, mundaneAnimalSubject, setExtremitiesName("paws")],
			requires: [beastOption],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? randomFrom(["fluffy ewe", "shaved ewe"]) : "ram" : "sheep";},
			chosen: function(){extremitiesName = "hooves", facialFeatureName = "curled, powerful horns";},
			makeAdditionalExplaination: function() {return randomFrom([
				String.format("%Your/Their% wool needs to be sheared regularly, but it makes great {0}.",
					randomFrom(["blankets", "sweaters", "yarn"])),
				crotchBoobsDescription(),]);},
			sets: [determinesRandomSex, mundaneAnimalSubject],
			requires: [beastOption],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "hen" : "rooster" : "chicken";},
			chosen: function(){extremitiesName = "talons", facialFeatureName = randomFrom(["beak", "plumage"]);},
			sets: [determinesRandomSex, mundaneAnimalSubject, setPussyName("cloaca"), setDickName("cloaca")],
			requires: [becomingCreatureHybrid, beastOption],
		},
		{
			subjectText: randomFrom(["rat", "mouse", "kangaroo mouse"]),
			chosen: function(){facialFeatureName = randomFrom(["whiskers", "pointed snout"]);},
			requires: [beastOption],
		},
		{
			makeSubjectText: function(){return randomFrom(["hawk",
				"bluebird",
				"crow",
				"seagull",
				"flamingo",
				"heron",
				"duck",
				"harpy eagle",
				isDecided(subjectFemale) ? subjectFemale ? "peahen" : "peacock" : "peafowl",
				"secretary bird"]);},
			chosen: function(){extremitiesName = "talons"; facialFeatureName = randomFrom(["beak", "plumage"]);},
			requires: [beastOption],
			sets: [mundaneAnimalSubject, setPussyName("cloaca"), setDickName("cloaca")],
		},
		{
			makeSubjectText: function(){return decidedAndTrue(subjectFemale) ? "vixen" : "fox";},
			closingRemarkText: randomFrom([
				"I've never understood the appeal of foxes, but I have a feeling %you/they%'ll appretiate this one.",
				"Foxes always remind me of <a href=\"https://www.furaffinity.net/view/29782152/\">the time I visited your house.</a>",]),
			sets: [determinesRandomSex, mundaneAnimalSubject, setDickName("knotted ".concat(dickName)), setExtremitiesName("paws")],
			requires: [beastOption],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "nanny goat" : "billy goat" : "goat";},
			chosen: function(){extremitiesName = "hooves"; facialFeatureName = "horns";},
			makeAdditionalExplaination: function(){return decidedAndTrue(subjectFemale)
				? "%You/They% have a swollen pair of dugs between %your/their% legs that must be milked twice a day."
				: "%Your/Their% pupils are horizontal, and %you/they% attract the attention of a lot of cultists.";},
			closingRemarkText: "Maybe it'll make %you/them% a better climber.",
			sets: [determinesRandomSex, mundaneAnimalSubject],
			requires: [beastOption],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "she-bear" : "male bear" : "bear";},
			requires: [beastOption],
			sets: [mundaneAnimalSubject, determinesRandomSex, setExtremitiesName("paws")],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "zebra mare" : "zebra stallion" : "zebra";},
			chosen: function(){extremitiesName = "hooves";},
			makeAdditionalExplaination: function(){return Math.random() < 0.5 ? "" : crotchBoobsDescription()},
			requires: [beastOption],
			sets: [mundaneAnimalSubject, determinesRandomSex, setPussyName("winking ".concat(pussyName)), setDickName("flared ".concat(dickName))],
		},
		{
			subjectText: randomFrom(["snow leopard", "leopard", "panther", "cougar", "cheetah"]),
			requires: [beastOption],
			sets: [mundaneAnimalSubject, setDickName("barbed ".concat(dickName)), setExtremitiesName("paws")],
		},
		{
			makeSubjectText: function() {return decidedAndTrue(subjectFemale) ? randomFrom(["tigress", "lioness"]) : randomFrom(["tiger", "lion"]);},
			requires: [beastOption],
			sets: [mundaneAnimalSubject, determinesRandomSex, setDickName("barbed ".concat(dickName)), setExtremitiesName("paws")],
		},
		{
			subjectText: "hyena",
			chosen: function(){facialFeatureName = randomFrom(["bonecrushing jaws", "paddle-like ears"]);},
			makeAdditionalExplaination: function(){return randomFrom([
				decidedAndTrue(subjectFemale)
					? "%You/They% have a pseudopenis, complete with a fatty sack standing in for testicles."
					: "Remember: male hyenas are submissive to the females.",
				"An infectious laughter spills out from between %your/their% lips when %you/they% least expect it.",])
				;},
			closingRemarkText: "<a href=\"https://www.furaffinity.net/view/32879967/\">Yeen Queen</a> is my favorite band!",
			requires: [beastOption],
			sets: [mundaneAnimalSubject, setPussyName("pseudopenis"), setExtremitiesName("paws")],
		},
		{
			subjectText: randomFrom(["squirrel", "flying squirrel"]),
			chosen: function(){facialFeatureName = randomFrom(["whiskers", "ears"]);},
			additionalExplaination: randomFrom([
				"%You/They% become twitchy and skittish.",
				lewdSelected || nsfwSelected ? "%You/They% develop a strange fascination with caressing, licking, and sucking people's nuts." : "%You/They% have a strange craving for nuts.",
				"%You/They% have a strange craving for nuts.",
				"%You/They% have tantalizingly soft fur.",
			]),
			requires: [becomingCreatureHybrid, beastOption, uncommon],
			sets: [mundaneAnimalSubject, setExtremitiesName("hand-like paws")],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "rabbit doe" : "rabbit buck" : randomFrom(["rabbit", "bunny"]);},
			chosen: function(){facialFeatureName = randomFrom(["buck teeth", "long ears"]);},
			additionalExplaination: randomFrom([
				decidedAndTrue(subjectFemale)
					? "Each hop causes a lot of jiggling."
					: "Walking and running become more difficult than hopping.",
				String.format("%You/They% are extraordinarily {0}.", isDecided(subjectFemale) ? subjectFemale ? "fertile" : "virile" : "fertile")
				]),
			requires: [beastOption],
			sets: [determinesRandomSex, mundaneAnimalSubject, setExtremitiesName("paws")],
		},
		{
			subjectText: randomFrom(["frog", "toad"]),
			chosen: function(){facialFeatureName = "long, sticky tongue";},
			makeAdditionalExplaination: function(){return decidedAndTrue(subjectFemale)
				? "Each hop causes a lot of jiggling."
				: "Walking and running become more difficult than hopping.";},
			requires: [beastOption, uncommon],
			sets: [mundaneAnimalSubject, setExtremitiesName("sticky pads")],
		},
		{
			subjectText: "kangaroo",
			chosen: function(){facialFeatureName = "pointed snout";},
			makeAdditionalExplaination: function(){return decidedAndTrue(subjectFemale)
				? "Each hop causes a lot of jiggling."
				: "Walking and running become more difficult than hopping.";},
			closingRemarkText: "G'day, mate!",
			requires: [beastOption],
			sets: [mundaneAnimalSubject, setDickName("upside-down dick"), setExtremitiesName("paws")],
		},
		{
			subjectText: randomFrom(["monkey", "baboon", "lemur"]),
			closingRemarkText: "Maybe %you/they% should try living in a treehouse.",
			requires: [beastOption],
			sets: [mundaneAnimalSubject, setExtremitiesName("hand-like feet")],
		},
		{
			subjectText: "squid",
			chosen: function(){extremitiesName = "spades", facialFeatureName = "beak";},
			requires: [becomingCreatureHybrid, beastOption],
			sets: [mundaneAnimalSubject, setPussyName("siphon")],
		},
		{
			subjectText: "skunk",
			chosen: function(){facialFeatureName = "furry muzzle";},
			closingRemarkText: "Do you smell something?",
			additionalExplaination: randomFrom([
				"%You/They% spray reflexively when startled.",
				"%You/They% find cats strangely alluring.",
				"%You/They% can't resist sharing %your/their% scent with those %you/they% love.",
				"%You/They% have tantalizingly soft fur.",
			]),
			requires: [beastOption],
			sets: [mundaneAnimalSubject, setExtremitiesName("paws")],
		},
		{
			subjectText: "otter",
			chosen: function(){subjectArticle = "an"},
			requires: [beastOption],
			sets: [mundaneAnimalSubject, setExtremitiesName("webbed paws")],
		},
		{
			subjectText: randomFrom(["ferret", "weasel", "raccoon"]),
			chosen: function(){facialFeatureName = "furry muzzle";},
			requires: [beastOption],
			sets: [mundaneAnimalSubject, setExtremitiesName("paws")],
		},
		{
			subjectText: "closest pet",
			closingRemarkText: "Is it better or worse if it's %your/their% own pet?",
			requires: [varyingSubject, beastOption, tfAtomic],
			sets: [mundaneAnimalSubject, specificIndividualTarget, setExtremitiesName("paws")],
		},
		{
			subjectText: randomFrom(["whale", "dolphin"]),
			chosen: function(){extremitiesName = "fins"; facialFeatureName = "dorsal fin";},
			makeAdditionalExplaination: function() {return randomFrom([
				"A fishy smell follows %you/them% around.",
				"%Your/Their% rubbery skin must be moistened regularly.",
				lewdSelected && decidedAndFalse(subjectFemale) ? "%Your/Their% penis is prehensile, but it often moves with a mind of its own." : ""]);},
			requires: [uncommon, becomingCreatureHybrid, beastOption],
			sets: [mundaneAnimalSubject, setPussyName("muscular vent"), setDickName("muscular penis")],
		},
		{
			subjectText: randomFrom(["goldfish", "catfish"]),
			chosen: function(){extremitiesName = "fins";},
			makeAdditionalExplaination: function() {return randomFrom([
				"A fishy smell follows %you/them% around.",
				"%You/They% have both gills and lungs, allowing %you/them% to live comfortably in the water and on land.",
				lewdSelected && decidedAndFalse(subjectFemale) ? "%You/They% cum whenever %you/they% smell fish eggs." : ""]);},
			requires: [becomingCreatureHybrid, beastOption, uncommon],
			sets: [mundaneAnimalSubject, setPussyName("vent"), setDickName("genital vent")],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "jenny" : "jackass": "donkey";},
			chosen: function(){extremitiesName = "hooves", facialFeatureName = "long ears";},
			makeAdditionalExplaination: function(){return Math.random() < 0.5 ? "%Your/Their% speech is interspersed with loud, ugly brays." : crotchBoobsDescription()},
			closingRemarkText: randomFrom([
				"Too bad it had to be such an awkward animal.",
				"Don't make an ass out of %yourself/themselves%."]),
			sets: [determinesRandomSex, mundaneAnimalSubject],
			requires: [beastOption],
		},
		{
			subjectText: randomFrom(["bee", "spider", "scorpion", "ant", "centipede", "wasp", "fly"]),
			chosen: function(){extremitiesName = "pointed legs"; facialFeatureName = "insectoid eyes";},
			closingRemarkText: "Becoming a buggo isn't <a href=\"https://www.furaffinity.net/view/30458776/\"> always so bad</a>.",
			requires: [uncommon, becomingCreatureHybrid, beastOption],
			sets: [mundaneAnimalSubject, setPussyName("gaster"), setDickName("gaster")],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "mare" : "stallion" : "horse";},
			chosen: function(){extremitiesName = "hooves";},
			makeAdditionalExplaination: function(){return Math.random() < 0.5 ? "" : crotchBoobsDescription()},
			sets: [determinesRandomSex, mundaneAnimalSubject, setPussyName("winking ".concat(pussyName)), setDickName("flared ".concat(dickName))],
			requires: [beastOption],
		},
		{
			subjectText: randomFrom(["komodo dragon", "skink", "newt", "alligator", "crocodile"]),
			chosen: function(){extremitiesName = "claws", facialFeatureName = "toothy snout";},
			requires: [becomingCreatureHybrid, beastOption],
			sets: [mundaneAnimalSubject, setPussyName("vent"), setDickName("hemipenes")],
		},
		{
			subjectText: randomFrom(["python", "pit viper", "cobra"]),
			chosen: function(){extremitiesName = "nothings", facialFeatureName = "fangs";},
			additionalExplaination: randomFrom([
				"%Your/Their% eyes have a deeply comforting quality about them.",
				"%You/They% produce a venom that acts as a powerful aphrodisiac.",
				"Bondage suddenly seems like a great pastime."
			]),
			closingRemarkText: "Just as I like 'em: thick and slithery.",
			requires: [beastOption],
			sets: [mundaneAnimalSubject, setPussyName("scaled vent"), setDickName("hemipenes")],
		},
		{
			subjectText: "last animal %you/they% touched",
			requires: [uncommon, varyingSubject, beastOption, tfAtomic],
			sets: [mundaneAnimalSubject, specificIndividualTarget, setExtremitiesName("paws"), doNotAssignSubjectSex],
		},
		{
			subjectText: "last animal %you/they% ate",
			closingRemarkText: randomFrom([
				"Sample any exotic meats lately?",
				"Mmm-mm. This beef tastes just like %you/them%."]),
			requires: [uncommon, varyingSubject, beastOption, tfAtomic],
			sets: [mundaneAnimalSubject, specificIndividualTarget, setExtremitiesName("hooves"), doNotAssignSubjectSex],
		},
		{
			subjectText: "last fantasy creature %you/they% killed in a video game",
			closingRemarkText: "Mana really does flow from computer monitors these days.",
			sets: [specificIndividualTarget, subjectInhuman, nonMundaneSubject, setExtremitiesName("paws"), doNotAssignSubjectSex],
			requires: [varyingSubject, nonMundaneSubject, beastOption, tfAtomic],
		},
		{
			subjectText: "current year's Chinese zodiac animal",
			sets: [specificIndividualTarget, subjectInhuman, nonMundaneSubject, setExtremitiesName("paws"), doNotAssignSubjectSex],
			requires: [uncommon, varyingSubject, nonMundaneSubject, beastOption],
		},
		{
			subjectText: "Chinese zodiac animal assigned to %you/they% at birth",
			sets: [specificIndividualTarget, subjectInhuman, nonMundaneSubject, setExtremitiesName("paws", doNotAssignSubjectSex)],
			requires: [uncommon, varyingSubject, nonMundaneSubject, beastOption],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "dire wolf bitch": "dire wolf stud" : "dire wolf";},
			sets: [subjectInhuman, determinesRandomSex, setPussyName("puffy ".concat(pussyName)), nonMundaneSubject, setExtremitiesName("paws")],
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
				lewdSelected ? "%You/They% can form fully-sensitive reproductive organs anywhere on %your/their% body."
					: "Holding %your/their% form takes a lot of concentration.",
				"Whenever %you/they% relax, %you/they% melt into a puddle.",
				nsfwSelected || lewdSelected ?  "Contact with %your/their% body causes arousal."
					: "Contact with %your/their% body causes drowsiness.",
				"%You/They% can alter %your/their% body shape, \"hair\", and facial features with a little effort.",
				"%You/They% control the viscosity of each part of %your/their% body individually.",
				]),
			closingRemarkText: "Seems kind of messy to me.",
			sets: [determinesRandomSex, subjectInhuman, setPussyName("gelatinous ".concat(pussyName)), setDickName("rubbery ".concat(dickName)), nonMundaneSubject],
			requires: [notBecomingHybrid, nonMundaneSubject, humanoidOption]
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "dragoness": "drake" : "dragon";},
			chosen: function(){extremitiesName = "claws", facialFeatureName = "majestic horns";},
			additionalExplaination: randomFrom([
				"%You/They% have a lust for hoarding treasure that is impossible to ignore.",
				"%You/They% become hopelessly narcissistic.",
				"%You/They% have an uncanny ability to get others to follow %your/their% orders.",
				"People who spend a lot of time near %you/them% slowly transform into obedient kobold slaves.",
				]),
			closingRemarkText: randomFrom([
				"I said %you/they% looked lucky, didn't I?",
				"Dragons are such sluts.",
				"Reminds me of that great story <a href=\"https://www.furaffinity.net/view/34314071/\">Mounted</a>"]),
			sets: [determinesRandomSex, nonMundaneSubject, subjectInhuman,
				setPussyName("powerful, scaled slit"),
				setDickName(randomFrom(["ridged ", "mighty ", "ribbed ", "massive "]).concat(dickName))],
			requires: [nonMundaneSubject, beastOption],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "unicorn mare": "unicorn stallion" : "unicorn";},
			chosen: function(){extremitiesName = "hooves", facialFeatureName = "horn";},
			makeAdditionalExplaination: function(){return Math.random() < 0.5 ? "" : crotchBoobsDescription()},
			sets: [determinesRandomSex, subjectInhuman, nonMundaneSubject],
			requires: [nonMundaneSubject, beastOption],
		},
		{
			subjectText: "kobold",
			chosen: function(){extremitiesName = "claws", facialFeatureName = "tiny horns";},
			additionalExplaination: randomFrom([
				"%You/They% have a hopeless need to be commanded by a powerful, preferably scaled master.",
				"When %you/they%'re upset, puffs of smoke erupt from %your/their% nostrils."
				]),
			closingRemarkText: randomFrom(["I think %you/they%'ll be adorable.", "I love those thick, lizardy tails!"]),
			sets: [nonMundaneSubject, subjectInhuman, setPussyName("scaled ".concat(pussyName))],
			requires: [nonMundaneSubject, beastOption],
		},
		{
			subjectText: "wyvern",
			chosen: function(){facialFeatureName = "frilly crest";},
			closingRemarkText: "Is trading %your/their% hands for the power of flight worth it?",
			sets: [subjectInhuman, nonMundaneSubject, setPussyName("scaled slit")],
			requires: [nonMundaneSubject, beastOption],
		},
		{
			subjectText: "sea serpent",
			sets: [subjectInhuman, setPussyName("vent"), nonMundaneSubject],
			requires: [nonMundaneSubject, beastOption, setExtremitiesName("fins")],
		},
		{
			makeSubjectText: function(){return isDecided(subjectFemale) ? subjectFemale ? "demoness": "demon" : "demon";},
			sets: [subjectInhuman, determinesRandomSex, nonMundaneSubject],
			requires: [nonMundaneSubject, humanoidOption],
			chosen: function(){extremitiesName = "claws"; facialFeatureName = "horns";},
		},
		{
			subjectText: "mammoth",
			chosen: function(){extremitiesName = "feet"; facialFeatureName = "furry trunk";},
			makeAdditionalExplaination: function(){return Math.random() < 0.5 ? "" : crotchBoobsDescription()},
			closingRemarkText: "What a majestic trumpet %you/they% have.",
			sets: [subjectInhuman, nonMundaneSubject],
			requires: [beastOption, nonMundaneSubject],
		},
		{
			subjectText: "giraffe",
			chosen: function(){extremitiesName = "hooves"; facialFeatureName = "long neck";},
			makeAdditionalExplaination: function(){return Math.random() < 0.5 ? "" : crotchBoobsDescription()},
			closingRemarkText: "%You/They%'ll always have a great view at concerts.",
			sets: [subjectInhuman, mundaneAnimalSubject],
			requires: [beastOption],
		},
		{
			subjectText: "last character %you/they% played in a video game",
			closingRemarkText: "Mana really does flow from computer monitors these days.",
			sets: [specificIndividualTarget, subjectInhuman, nonMundaneSubject],
			requires: [varyingSubject, notBecomingHybrid, nonMundaneSubject, tfAtomic, humanoidOption],
		},
		{
			subjectText: "goblin",
			chosen: function(){facialFeatureName = "vibrant hair";},
			additionalExplaination: randomFrom([
				String.format("%You/They% are extraordinarily {0}.", isDecided(subjectFemale) ? subjectFemale ? "fertile" : "virile" : "fertile"),
				"Wearing clothes seems ridiculous to %you/them%."]),
			sets: [subjectInhuman, nonMundaneSubject],
			requires: [notBecomingHybrid, nonMundaneSubject, humanoidOption],
		},
		{
			subjectText: randomFrom(["ilithid", "mind-flayer"]),
			chosen: function(){subjectArticle = "an";},
			additionalExplaination: randomFrom([
				"People who spend time around %you/them% become obsessed with %you/them%.",
				"%You/They% can read minds.",
				"%You/They% discover that %you/they% can influence the thoughts of others.",
			]),
			sets: [subjectInhuman, nonMundaneSubject, setFacialFeature("writhing tentacles"), setDickName("prehensile ".concat(dickName)), setPussyName("tentacle-crowned ".concat(pussyName))],
			requires: [notBecomingHybrid, nonMundaneSubject, humanoidOption],
		},
		{
			subjectText: randomFrom(["orc", "ogre"]),
			chosen: function(){subjectArticle = "an"; facialFeatureName = randomFrom(["horns", "tusks"]);},
			sets: [subjectInhuman, setPussyName("powerful ".concat(pussyName)), nonMundaneSubject],
			requires: [notBecomingHybrid, nonMundaneSubject, humanoidOption],
		},
		{
			subjectText: randomFrom(["oak tree", "redwood tree", "vine of ivy", "pine tree", "rose bush", "lilly plant", "hedge trimmed to look like %you/them%", "venus fly-trap", "pitcher-plant"]),
			chosen: function(){extremitiesName = "leaves"; renderSubjectGender = false},
			sets: [subjectInhuman, subjectIsInanimate, setPussyName("flower"), setDickName("flower"), setFacialFeature("leaves")],
			makeAdditionalExplaination: function(){return randomFrom([
					"%You/They% can feel %your/their% roots absorbing nutrients from the earth.",
					nsfwSelected || lewdSelected ? "Being touched by a human brings sexual pleasure." : "%You/They% enjoy being touched.",
					"%You/They%'re most aware when the sun is beating on %your/their% leaves.",
					"Bugs and squirrels make %you/them% their new home.",
					"%You/They%'re fully aware of %your/their% surroundings, but plants cannot move.",
				]);},
			closingRemarkText: "I hope %you/they% end up somewhere sunny.",
			requires: [notBecomingHybrid, inanimateOption, subjectIsLiving, beingTransformed, uncommon],
		},
		{
			subjectText: "sphinx",
			chosen: function(){facialFeatureName = "mane";},
			sets: [subjectInhuman, nonMundaneSubject, setExtremitiesName("paws")],
			requires: [notBecomingHybrid, nonMundaneSubject, beastOption],
		},
		{
			subjectText: "naga",
			chosen: function(){extremitiesName = "claws"; facialFeatureName = "crest";},
			additionalExplaination: randomFrom([
					"Holding a lover or helpless victim in %your/their% coils is such a delight.",
					"",
					]),
			closingRemarkText: "I hope %you/they% don't mind having a lisssp.",
			sets: [subjectInhuman, setPussyName("scaled ".concat(pussyName)), nonMundaneSubject],
			requires: [notBecomingHybrid, nonMundaneSubject, humanoidOption],
		},
		{
			subjectText: randomFrom(["cerberus", "hydra"]),
			chosen: function(){facialFeatureName = "horns";},
			sets: [subjectInhuman, nonMundaneSubject, setExtremitiesName("paws")],
			requires: [notBecomingHybrid, nonMundaneSubject, beastOption],
			closingRemarkText: "Stop fighting with yourself!",
		},
		{
			subjectText: "satyr",
			chosen: function(){extremitiesName = "hooves"; facialFeatureName = "horns";},
			sets: [subjectInhuman, nonMundaneSubject],
			requires: [notBecomingHybrid, nonMundaneSubject, humanoidOption],
		},
		{
			makeSubjectText: function(){return !isDecided(subjectFemale) ? "mer-person" : subjectFemale ? "mermaid": "merman";},
			chosen: function(){extremitiesName = "fins"; facialFeatureName = "frilly hair";},
			additionalExplaination: "%Your/Their% singing voice is mesmerizingly beautiful.",
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
			chosen: function(){subjectArticle = decidedAndTrue(subjectFemale) ? "a" : "an";},
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
				var usePrimary = Math.random() < 0.7;
				var useSecondary = Math.random() < 0.9;
				return String.format("{0}{1}{2}{3}{4}{5}",
					usePrimary ? randomFrom(primaryDescriptors) : "",
					usePrimary ? " " : "",
					useSecondary ? randomFrom(secondaryDescriptors) : "",
					useSecondary ? " " : "",
					isDecided(subjectFemale) ? subjectFemale ? "woman": "man" : "person",
					usePrimary ? "" : randomFrom(afterDescriptor));
			},
			sets: [determinesMostlyFemaleSex],
			requires: [humanOption, notBecomingHybrid],
		},
	]

	// =======================
	//        DURATIONS
	// =======================
	var durations = [
		{
			makeDurationText: function() {return decidedAndTrue(subjectInanimate) ? "%You/They% remain this way until someone has sex with %you/them%."
				: "%You/They% remain this way until %you/they% have sex.";},
			closingRemarkText: "Don't worry, I think %you/they%'re plenty charming. You'll be back to normal in no time.",
			requires: [nsfw]
		},
		{
			makeDurationText: function() {return decidedAndTrue(subjectInanimate) ? "%You/They% remain this way until someone kisses %you/them%."
				: "%You/They% remain this way until %you/they% can convince someone to kiss %you/them%.";},
			closingRemarkText: "%You/They%'re lucky I didn't say the person kissing had to be a princess."
		},
		{
			durationText: String.format("%You/They% remain this way until {0}.",
				randomFrom([
					"someone hugs %you/them% without %you/them% asking",
					"someone massages %you/them%",
					"someone slaps %your/their% ass",
					"someone spanks %you/them%",
				])),
			requires: [subjectIsAnimate],
		},
		{
			durationText: "%You/They% remain this way until %you/they% reveal %your/their% curse to someone new.",
			closingRemarkText: randomFrom(["Who will %you/they% show first?",
					"How many times before %you/they% run out of people %you/they% trust?",
					"I hope the people %you/they% tell don't use their knowledge against %you/them%."]),
			requires: [subjectIsAnimate],
		},
		{
			makeDurationText: function() {return String.format("%You/They% remain this way until {0}.",
				randomFrom([
					"someone has sex with %you/them%",
					isDecided(subjectFemale) ?
						subjectFemale ? "someone eats %you/them% out" : "someone gives %you/them% a blowjob"
						: "someone brings %you/them% to climax with their mouth",
				])
			);},
			requires: [subjectIsAnimate, nsfw],
		},
		{
			makeDurationText: function() {return String.format("%You/They% revert to %your/their% old self in {0} hours, but, if %you/they% {1}, the transformation becomes permanent.",
				randomFrom(["two", "four", "six", "twelve"]),
				randomFrom([
					decidedAndTrue(subjectInanimate) ? "are used by five humans" : "have sex",
					decidedAndTrue(subjectInanimate) ? "are used by a human" : decidedAndTrue(subjectFemale) ? "get pregnant" : "reproduce",
					decidedAndTrue(subjectInanimate) ? "are used by any creature" : "orgasm",
					"are recognized by someone else %you/they% know"]));},
			closingRemarkText: "I'm sure %you/they% won't have any trouble resisting the urge to stay that way forever.",
			requires: [nsfw],
		},
	]

	var longDurations = [
		{
			durationText: "%You/They% remain this way for 24 hours.",
			closingRemarkText: "%You/They% get to experience everything the day has to offer."
		},
		{
			durationText: "%You/They% return to normal after one week.",
			closingRemarkText: "I've noticed %you/they%'ve been taking a lot of one-week vacations lately. . ."
		},
		{
			durationText: String.format("%You/They% remain this way until %you/they% have been owned by a human for at least a {0}.",
				randomFrom(["week", "month", "year"])),
			closingRemarkText: "%You/They%'d better learn to follow commands and be docile. Don't want them to get rid of %you/them%.",
			requires: [mundaneAnimalSubject, notBecomingHybrid, beastOption],
		},
		{
			durationText: "%You/They% return to normal in one year.",
			closingRemarkText: "Just when %you/they% were getting used to living %your/their% new life, %you/they% turn back. I love it."
		},
		{
			durationText: "%You/They% return to normal after one day, but each transformation lasts twice as long as the last.",
			closingRemarkText: "The more %you/they% like it, the more dangerous it is."
		},
		{
			durationText: "%You/They% will return to normal in a week, but each time %you/they% orgasm, the duration is increased by a day.",
			requires: [nsfw, subjectIsAnimate]
		},
		{
			makeDurationText: function(){return isUndecided(subjectFemale) ? "%You/They% can only return to normal by reproducing." :
				subjectFemale ? "%You/They% can only return to normal by giving birth." : "%You/They% can only return to normal by siring young.";},
			requires: [nsfw, subjectIsLiving]
		},
		{
			makeDurationText: function(){return isUndecided(subjectFemale)
					? "%You/They% remain this way until %you/they% have sex with 5 different people."
				: subjectFemale ? "%You/They% can only return to normal once 5 people cum inside of %you/them%."
					: "%You/They% can only return to normal once %you/they% cum inside 5 people.";},
			requires: [lewd, subjectIsLiving]
		},
		{
			makeDurationText: function() {return String.format(
				"%You/They% remain this way until %you/they% have sex with {0} {1}.",
				subjectArticle,
				renderOppositeSex(curse.renderGenderedSubjectText));},
			closingRemarkText: randomFrom([
				"It's not really amoral if %you/they%'re the same species, right?",
				"It's okay. I don't think anyone will judge %you/them%."
			]),
			requires: [lewd, mundaneAnimalSubject, subjectIsAnimate],
		},
	]


	function makeTFComplication(transformation) {
		var lower = String.format("{0}.", transformation.makeTransformationText());
		return lower.charAt(0).toUpperCase() + lower.substring(1);
	};

	var complications = [
		{
			// Double complications
			makeComplicationText: function(){
				var comp1 = selectAnotherComplication(filterComponents(complications));
				var comp2 = selectAnotherComplication(filterComponents(complications));
				var compText1 = comp1.complicationText == null ? comp1.makeComplicationText() : comp1.complicationText;
				var compText2 = comp2.complicationText == null ? comp2.makeComplicationText() : comp2.complicationText;
				return String.format("<br></p><p>{0} {1}",
					compText1,
					compText2);
			},
			requires: [nsfw],

		},
		{ // expansion complication
			makeComplicationText: function(){
				return makeTFComplication(expansionTF);
			},
			requires: [chosenTFNotExpansion, subjectIsAnimate, nsfw],
		},
		{ //lipple complication
			makeComplicationText: function(){
				return makeTFComplication(lippleTF);
			},
			makeAdditionalExplaination: function(){return lippleTF.makeAdditionalExplaination()},
			requires: [subjectIsAnimate, lewd],
		},
		{ //cockTail complication
			makeComplicationText: function(){
				return makeTFComplication(cockTailTF);
			},
			makeAdditionalExplaination: function(){return cockTailTF.makeAdditionalExplaination()},
			requires: [subjectIsAnimate, lewd],
		},
		{ // genital mouth
			makeComplicationText: function(){
				if (Math.random() < 0.5) {
					return makeTFComplication(subjectGenitalMouthTF);
				} else {
					subjectFemale = !subjectFemale;
					var output = makeTFComplication(subjectGenitalMouthTF);
					subjectFemale = !subjectFemale;
					return output;
				}
			},
			requires: [subjectIsAnimate, lewd, usesStandardSubject],
		},
		{
			makeComplicationText: function(){return String.format("{0} must obey the orders of any human.",
				happensOnce ? "%You/They%" : "While transformed, %you/they%");},
			requires: [subjectIsAnimate],
		},
		{
			makeComplicationText: function(){return happensOnce
				? "No one remembers %you/them% being any other way."
				: "While transformed, everyone thinks %you/they%'ve always been this way.";},
			closingRemarkText: "But you and I will always know the truth. ;)",
		},
		{
			complicationText: "%Your/Their% sex drive and production of bodily fluids are greatly increased. When %you/they%'re hungry, %you/they% drool. When %you/they%'re horny, well. . .",
			closingRemarkText: "Does bodily fluids include sweat? That could be kinda gross.",
			requires: [nsfw, subjectIsLiving]
		},
		{
			makeComplicationText: function(){return String.format("%Your/Their% {0} constantly dripping {1}.",
				isUndecided(subjectFemale) ? "genitals are" : subjectFemale ? "pussy is" : "penis is",
				isUndecided(subjectFemale) ? "bodily fluids" : subjectFemale ? "fem-lube" : "pre-cum");},
				requires: [lewd, subjectIsLiving]
		},
		{
			complicationText: randomFrom(["%Your/Their% curse is sexually transmittable.", "People %you/they% come in contact with catch %your/their% curse like the common cold."]),
			closingRemarkText: "It won't be long before prospective lovers ask each other to get tested for it.",
			requires: [nsfw],
		},
		{
			complicationText: "%Your/Their% bodily fluids are a potent aphrodisiac, but %you/they% must trick %your/their% target into drinking something tainted with them.",
			requires: [nsfw, subjectIsLiving]
		},
		{
			complicationText: "%Your/Their% pheromones allow %you/them% to seduce any creature with a nose.",
			requires: [nsfw, subjectIsLiving]
		},
		{
			complicationText: "%You/They% produce a strong musk.",
			requires: [nsfw, subjectIsLiving]
		},
		{
			complicationText: String.format("Also, %you/they% must lay {0} every day.", randomFrom(["one large egg", "one fist-sized egg", "one melon-sized egg", "a dozen eggs", "six eggs"])),
			additionalExplaination: randomFrom([
				"The time of day when %you/they% lay %your/their% eggs is random. A shifting feeling in %your/their% belly gives %you/them% 30 seconds warning before %you/they% drop.",
				"The first time laying is painful. By the end of the first week, it starts to become pleasurable.",
				"%Your/Their% eggs can be fertilized by any creature. You can tell which ones are carrying young and have an urge to nest on them.",
				"Others who spend time around %your/their% eggs are compelled to take care of them."
				]),
			makeClosingRemarkText: function(){return String.format("Does that mean %you/they% have a cloaca now? {0}",
				randomFrom(["Weird.", "Cool!", "Fascinating.", "Gross.", "Huh.", "Delightful."]))},
			requires: [subjectIsLiving, humanoidOption],
		},
		{
			makeComplicationText: function() {return decidedAndTrue(subjectFemale) ? "Also, %you/they% grow an extra pair of breasts." : "Also, %you/they% grow a pair of breasts."},
			closingRemarkText: "An extra pair of tits never hurt anyone.",
			requires: [nsfw, subjectIsLiving]
		},
		{
			makeComplicationText: function(){return String.format("%You/They% grow {0} extra pairs of breasts. {1}",
				randomFrom(["two", "three", "four"]),
				randomFrom(["They're all the same size.", "Each additional pair is smaller than those above."]));},
			requires: [lewd, subjectIsLiving]
		},
		{
			makeComplicationText: function(){
				if (!tgSelected && decidedAndTrue(subjectFemale)) {
					return "An additional pussy opens beside %your/their% first."
				}
				return decidedAndTrue(subjectFemale) ? "A penis grows above %your/their% pussy." : "%You/They% grow an additional penis."
			},
			requires: [lewd, subjectIsAnimate],
		},
		{
			makeComplicationText: function() {
				if (!tgSelected && decidedAndFalse(subjectFemale)) {
					return "An additional penis sprouts beside %your/their% first."
				}
				return isUndecided(subjectFemale) ?
					"%You/They% grow a pussy." : subjectFemale ?
					"%You/They% grow an additional pussy next to %your/their% first." : "%Your/Their% taint splits open to reveal a freshly formed pussy.";},
			requires: [lewd, subjectIsAnimate, subjectCanBeFemale],
			sets: [subjectIsFemale]
		},
		{
			complicationText: "%Your/Their% wardrobe changes to accommodate %your/their% new form."
		},
		{
			complicationText: "%Your/Their% clothes are ruined by the transformation.",
			requires: [tfAtomic]
		},
		{
			complicationText: randomFrom([
				"No one seems to think %your/their% new curse is at all unusual.",
				"%You/They% refuse to believe that %your/their% curse isn't normal."
			]),
		},
		{
			complicationText: "%Your/Their% current romantic interest is afflicted with a similar curse.",
			closingRemarkText: "At least %you/they% have a friend.",
		},
		{
			makeComplicationText: function(){return String.format(
				"If %you/they% weren't before, %you/they% are now {0}.", randomFrom(["bisexual", "gay"]));},
			requires: [subjectIsAnimate],
		},
		{
			makeComplicationText: function(){return String.format(
				"{0} a hermaphrodite.", happensOnce ? "%You/They% become" : "While transformed, %you/they% are");},
			sets: [subjectIsFemale],
			requires: [lewd, subjectIsAnimate, tgOption]
		},
		{
			makeComplicationText: function(){return String.format(
				"{0} {1}", happensOnce ? "%You/They% become" : "While transformed, %you/they% are",
				isUndecided(subjectFemale) || subjectFemale ? "kinda, like, an air-headed bimbo." : "a meat-headed hunk.");},
			requires: [subjectIsAnimate],
		},
		{
			makeComplicationText: function(){return happensOnce
				? "%You/They% don't quite remember %your/their% life before the transformation."
				: "While transformed, %you/they% don't remember being any other way."}
		},
		{
			makeComplicationText: function(){return String.format("After %your/their% transformation, {0}",
				isUndecided(subjectFemale) ? "%you/they% feel compelled to reproduce until %you/they% are successful." :
					subjectFemale ? "%you/they% feel a kicking and realize %you/they%'re pregnant!"
					: "the nearest female becomes pregnant with %your/their% children.");},
			requires: [nsfw, subjectIsLiving]
		},
		{
			makeComplicationText: function(){return happensOnce
				? "%Your/Their% sex drive is supercharged." : "While transformed, %you/they% are always horny.";},
			requires: [nsfw]
		},
		{
			makeComplicationText: function(){return isUndecided(subjectFemale)
				? "%Your/Their% genitals are oversized." :
					subjectFemale ? String.format("%Your/Their% {0} is oversized and gets dripping wet whenever %you/they%'re aroused.", pussyName)
					: "%Your/Their% penis is exceptionally large, and there's no way to hide it.";},
			requires: [lewd, subjectIsLiving]
		},
		{
			complicationText: "%You/They% and the relevant species experience a mutual attraction.",
			requires: [nsfw, mundaneAnimalSubject, beastOption]
		},
		{
			complicationText: "%You/They% can speak to other members of the relevant species.",
			requires: [mundaneAnimalSubject, subjectIsAnimate, beastOption],
		},
		{
			makeComplicationText: function() {return String.format("If that wasn't bad enough, %you/they% soon realize %you/they%'re in {0}.",
				subjectFemale ? "heat" : "rut");},
			requires: [mundaneAnimalSubject, beastOption, subjectIsAnimate],
		},
		{
			makeComplicationText: function() {return String.format("The longer %you/they% remain transformed, the more %your/their% thoughts become the simple instincts of {0} {1}.",
				subjectArticle,
				curse.renderSubjectText());},
			requires: [mundaneAnimalSubject, beastOption, subjectIsAnimate],
		},
		{
			makeComplicationText: function() {return "The longer %you/they% remain transformed, the more %your/their% mind fades away.";},
			requires: [subjectIsInanimate],
		},
		{
			makeComplicationText: function(){return String.format(
				"{0} lose %your/their% ability to read and write.", happensOnce ? "%You/They%" : "While transformed, %you/they%");},
			requires: [mundaneAnimalSubject, subjectIsAnimate],
		},
		{
			complicationText: "%You/They% retain %your/their% ability to speak English.",
			requires: [mundaneAnimalSubject, subjectIsAnimate],
		},
		{
			complicationText: "%You/They% get all the instincts of the relevant species and can't resist acting on them.",
			requires: [mundaneAnimalSubject, subjectIsAnimate],
		},
		{
			makeComplicationText: function(){return happensOnce
				? "%You/They% are sold to a rich, private collector who uses %you/them% for his own entertainment."
				: "While in human form, %you/they% retain some parts of %your/their% other form.";},
			requires: [subjectInhuman, tfAtomic],
		},
		{
			makeComplicationText: function(){return happensOnce
				? "%You/They% are captured for scientific research. Most tests seem to be focused around reproduction." : "Each time %you/they% return to normal, %you/they% retain more of %your/their% cursed form.";},
			requires: [subjectInhuman, subjectIsAnimate],
		},
		{
			complicationText: "%You/They% gain the memories of the other person.",
			closingRemarkText: "Pilfer their dirty secrets.",
			requires: [subjectIsHuman, specificIndividualTarget],
		},
		{
			complicationText: "Whenever the other person becomes aroused, %you/they% are as well. And vice-versa.",
			requires: [nsfw, subjectIsHuman, specificIndividualTarget],
		},
		{
			complicationText: "Whenever the other person orgasms, so do %you/they%. And vice-versa.",
			requires: [nsfw, subjectIsHuman, specificIndividualTarget],
		},
		{
			complicationText: "%You/They% cannot refuse orders from the other person.",
			requires: [subjectIsHuman, specificIndividualTarget, subjectIsAnimate],
		},
	]

	var generalClosingRemarks = [
		{closingRemarkText: "That might be pretty difficult to hide. . ."},
		{closingRemarkText: "Do you think %you/they%'ll be able to live a normal life like that?"},
		{closingRemarkText: "So. . . are %you/they% going to tell anyone %you/they% know about it?"},
		{closingRemarkText: "How could %you/they% possibly adapt?"},
		{closingRemarkText: "I wonder if %you/they% can use that as a way to make money. . ."},
		{closingRemarkText: "Guess I was wrong about %you/them% being lucky."},
		{closingRemarkText: "Ooof. Well, not everyone gets off that easy."},
		{closingRemarkText: "I think I'll like %you/them% more this way."},
		{closingRemarkText: "I think people will like %you/them% more this way."},
		{closingRemarkText: "%You/They% may have to get a new job."},
		{closingRemarkText: "That might be kinda fun."},
		{closingRemarkText: "%You/They%'ll come around to it eventually."},
		{
			makeClosingRemarkText: function() {return String.format("The {0} might take some getting used to.", facialFeatureName);},
			requires: [subjectInhuman, nonDefaultFacialFeature],
		},
		{
			makeClosingRemarkText: function() {return String.format("The {0} might take some getting used to.", extremitiesName);},
			requires: [subjectInhuman, nonDefaultExtremities],
		},
	]

	// Code start
	//
	//
	if (!humansSelected && !humanoidsSelected && !beastsSelected && !inanimateSelected) {
		return {curseText: "%You/They% turn into nothing.", circeText: "What did you expect?"};
	}

    if (isCurse) {
	    var chosenTrigger = randomFrom(filterComponents(triggers));
	    updateCurse(curse, chosenTrigger);
    }

	var chosenTransformation = randomFrom(filterComponents(transformations));
	if (curse.renderTransformationText == null) {
		updateCurse(curse, chosenTransformation);
	}

	var chosenSubject = randomFrom(filterComponents(subjects));
	if (curse.renderSubjectText == null) {
		updateCurse(curse, chosenSubject);
	}

    if (isCurse) {
	    if (happensOnce) {
	    	updateCurse(curse, {durationText: "The transformation is permanent."});
	    }

	    var chosenDuration = randomFrom(buildDurations());
	    if (curse.renderDurationText == null) {
		    updateCurse(curse, chosenDuration);
	    }
    }

	var chosenComplication = null;
	if (curse.renderComplicationText == null) {
		var chance = lewdSelected ? 0.8 : nsfwSelected ? 0.35 : 0.15;
		if(Math.random() < chance) {
			chosenComplication = randomFrom(filterComponents(complications));
		} else {
			chosenComplication = {complicationText:""};
		}
		updateCurse(curse, chosenComplication);
	}
	if (curse.renderClosingRemarkText == null) {
		if(Math.random() < 0.3) {
			updateCurse(curse, randomFrom(filterComponents(generalClosingRemarks)));
		}
	}

	if (isUndecided(subjectFemale) && transformationAffectsSubjectSex && renderSubjectGender) {
		subjectFemale = Math.random() < 0.5; // 50% chance
	}
	if (renderSubjectGender && !specificTarget) {
		subjectArticle = "a";
	}

	return {curseText: fixPronouns(curse.renderText(), targetName), circeText: fixPronouns(curse.renderCirceText(), targetName)};
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
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

function fixPronouns(message, target) {
    if (target == SECOND_PERSON_ARG) {
        var output = message.replace(/%you\/they%/g, "you");
        var output = output.replace(/%You\/They%/g, "You");
        var output = output.replace(/%you\/them%/g, "you");
        var output = output.replace(/%You\/Them%/g, "You");
        var output = output.replace(/%your\/their%/g, "your");
        var output = output.replace(/%Your\/Their%/g, "Your");
        var output = output.replace(/%yours\/theirs%/g, "yours");
        var output = output.replace(/%Yours\/Theirs%/g, "Yours");
        var output = output.replace(/%yourself\/themselves%/g, "yourself");
        var output = output.replace(/%Yourself\/Themselves%/g, "Yourself");
        return output;
    } else {
        var output = message.replace(/%you\/they%/g, "they");
        var output = output.replace(/%You\/They%/g, "They");
        var output = output.replace(/%you\/them%/g, "them");
        var output = output.replace(/%You\/Them%/g, "Them");
        var output = output.replace(/%your\/their%/g, "their");
        var output = output.replace(/%Your\/Their%/g, "Their");
        var output = output.replace(/%yours\/theirs%/g, "theirs");
        var output = output.replace(/%Yours\/Theirs%/g, "Theirs");
        var output = output.replace(/%yourself\/themselves%/g, "themselves");
        var output = output.replace(/%Yourself\/Themselves%/g, "Themselves");
        return output;
    }
}
