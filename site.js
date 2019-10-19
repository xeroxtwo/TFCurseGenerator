// I apologize for this in advance.

var generation = 0;
var circeTexts = [
	"Alright, here's your curse! Enjoy.",
	"God, you mortals are so picky. Here, how's this one?"
]
var sfw = "SFW";
var nsfw = "NSFW";
var lewd = "LEWD";
var explicitness = nsfw;


$(document).ready(function() {
    $("#goButton").click(function(){
		updateExplicitSuggestion();
		$("#circePre").html(getCircePreText());
		generation = generation + 1;
		var curseOutput = generateCurse();
		
		$("#goButton").html("Wait, can I get a different one?");
		$("#output").html(curseOutput.curseText);
		$("#circePost").html(curseOutput.circeText);
		$("#secretCopyField").html(String.format("{0}\n\n\"{1}\"", curseOutput.curseText, curseOutput.circeText));
		$(".curseRow").css("display", "block");
		$(".circeOnlyOnce").css("display", "none");	
    }); 
});

function updateExplicitSuggestion() {
	var radios = document.getElementsByName('inlineRadioOptions');
	for (var i = 0, length = radios.length; i < length; i++) {
		if (radios[i].checked) {
			if (i == 0) {
				explicitness = sfw;
			} else if (i == 1) {
				explicitness = nsfw;
			} else {
				explicitness = lewd;
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
	// Methods
	function buildTransformations(specificTarget, personSubject, touchTrigger) {
		var output = generalTransformations;
		if (!personSubject) {
			output = output.concat(inhumanTransformations);
		}
		if (touchTrigger) {
			output = output.concat(touchTransformations);
		}
		return filterNSFW(output);
	}
	
	function buildSubjects(imaginarySpeciesAllowed) {
		var output = generalSubjects;
		if (imaginarySpeciesAllowed) {
			output = output.concat(imaginarySubjects);
			if (!becomingHybrid) {
				output = output.concat(imaginaryNonHybridable);
			}
		}
		return filterNSFW(output);
	}
	
	function buildDurations() {
		var output = durations;
		if (!shortDurationOnly) {
			output = output.concat(longDurations);
		}
		return filterNSFW(output);
	}
	
	function buildComplications(imaginarySpeciesAllowed, personSubject) {
		var output = generalComplications;
		if (!personSubject) {
			output = output.concat(inhumanComplications);
			if (!imaginarySpeciesAllowed) {
				output = output.concat(mundaneAnimalComplications);
			}
		} else {
			output = output.concat(personSubjectComplications);
		}
		return filterNSFW(output);
	}
	
	function filterNSFW(inputData) {
		output = [];
		for (var i = 0; i < inputData.length; i++) {
			if (inputData[i].tags != null) {
				if (explicitness == sfw) {
					if (inputData[i].tags.includes(nsfw) || inputData[i].tags.includes(lewd)) {
						continue;
					}
				} else if (explicitness == nsfw) {
					if (inputData[i].tags.includes(lewd)) {
						continue;
					}
				}
			}
			output.push(inputData[i]);
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
		
		renderCirceText: function() {
			if(this.renderClosingRemarkText != null) {
				return String.format("{0}", this.renderClosingRemarkText());
			} else {
				return "";
			}
		},
		
		renderText : function() {
			return String.format("{0} {1}{2}{3}. {4} {5}{6}",
				this.renderTriggerText(),
				this.renderTransformationText(),
				shouldRenderSubjectText ? " " : "",
				shouldRenderSubjectText ? this.renderSubjectText() : "",
				this.renderDurationText(),
				this.renderComplicationText(),
				this.renderAdditionalExplainations());
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
	var touchTrigger = false;
	var shouldRenderSubjectText = true;
	var shortDurationOnly = false;
	var extemitiesName = "paws";
	var becomingHybrid = false;
	
	// DATA
	// instead of static text, you can specify a "make" function that will be called at render time.
	var triggers = [
		{makeTriggerText: function(){return happensOnce ? "If you ever catch sight of the full moon" : "Each full moon";},},
		{makeTriggerText: function(){return happensOnce ? "The next time you're splashed with water" : "Each time you're splashed with water";},},
		{makeTriggerText: function(){return happensOnce ? "In one week" : String.format("Every {0}", randomFrom(["Monday", "Saturday", "Friday"]));},
				chosen: function(){shortDurationOnly = true;}},
		{triggerText: "Immediately,", durationText: "The transformation is permanent.", chosen: function(){happensOnce = true;},
				closingRemarkText: randomFrom([
						"I hope you're sitting at home in front of your desktop right now.",
						"Who's going to find you like that?",
						"This might be awkward if you're out in public.",
						"Surprise!",
						"If you don't send me feedback, I'll know why.",
						"I hope whatever clothes you're wearing don't get damaged."])},
		{makeTriggerText: function(){return happensOnce ? "If you happen to touch an animal" : "Whenever you touch an animal";},
				subjectText: "touched animal", chosen: function(){specificTarget = true; sexUndecided = true; touchTrigger = true;}},
		{makeTriggerText: function(){return happensOnce ? "If you ever touch a male animal" : "Whenever you touch a male animal";},
				subjectText: "touched animal", chosen: function(){specificTarget = true; triggerFemale = false; subjectFemale = true; touchTrigger = true;}},
		{makeTriggerText: function(){return happensOnce ? "If you ever eat meat or another animal product," : "Whenever you eat meat or another animal product,";},
				subjectText: "consumed species", chosen: function(){specificTarget = true;}},
		{makeTriggerText: function(){return happensOnce ? "When you next touch a man": "Whenever you touch a man";},
				subjectText: "touched man", chosen: function(){specificTarget = true; personSubject = true; triggerFemale = false; touchTrigger = true;}},
		{makeTriggerText: function(){return happensOnce ? "When you next touch a woman": "Whenever you touch a woman";},
				subjectText: "touched woman", chosen: function(){specificTarget = true; personSubject = true; triggerFemale = true; touchTrigger = true;}},
		{makeTriggerText: function(){return happensOnce ? "When you next touch someone": "Whenever you touch someone";},
				subjectText: "touched person", chosen: function(){specificTarget = true; personSubject = true;sexUndecided = true; touchTrigger = true;}},
		{makeTriggerText: function(){return happensOnce ? "The next time someone sees your privates,": "Whenever anyone sees your privates";}, 
				closingRemarkText: randomFrom([
						"I don't think this is what they were expecting when you said \"I'll show you mine.\"",
						"I hope you don't get pantsed anytime soon.",]),
				tags: [nsfw]},
		{makeTriggerText: function(){return happensOnce 
				? "There exists a phrase, and, if you ever hear it," : "You have a secret key phrase, and whenever you hear it";},
				additionalExplaination: randomFrom([
						"You can't resist dropping hints about the curse's trigger phrase.",
						"You have the curse's trigger phrase tattooed above your ass.",
						"Your rival knows the curse's trigger phrase.",
						"The trigger phrase is your own name."]),},
		{makeTriggerText: function(){return happensOnce ? "The next time you orgasm" : "Each time you orgasm";},
				additionalExplaination: "You transform partially when you're aroused.",
				tags: [nsfw]},
		{makeTriggerText: function(){return happensOnce ? "Immediately after the next time you have sex," : "Each time you have sex,";},
				chosen: function(){this.closingRemarkText = randomFrom([
						"Welp, that's going to be awkward.",
						"How's that for an afterglow?",
						"Hopefully your partner doesn't die of surprise."]);
						touchTrigger = true;},
				tags: [nsfw]},
		{makeTriggerText: function(){return happensOnce ? "The next time you see an animal" : "Whenever you see an animal,";},
				subjectText: "sighted animal", chosen: function(){specificTarget = true;sexUndecided = true;},},
		{makeTriggerText: function(){return happensOnce ? "Tomorrow morning" : String.format("Every {0},", randomFrom(["sunrise", "sunset", "night at midnight"]));},
				chosen: function(){shortDurationOnly = true;},
				closingRemarkText: randomFrom(["You just have to find a new routine.", "I hope you're at your own house.", "That's not that long from now!"])},
	];
	
	var generalTransformations = [
		{makeTransformationText:function(){return String.format("you transform into {0}", specificTarget ? "a copy of the" : subjectArticle);},
				chosen: function(){if(triggerFemale != null){subjectFemale = triggerFemale;}}},
		{makeTransformationText:function(){return String.format("you upside-down transform into {0}", specificTarget ? "a copy of the" : subjectArticle);},
				chosen: function(){if(triggerFemale != null){subjectFemale = triggerFemale;}},
				tags: [lewd]},
		{makeTransformationText:function(){return String.format("you {0} shift into {1}", randomFrom(["pleasurably", "painfully", "instantly", "slowly"]), specificTarget ? "a copy of the" : subjectArticle);},
				chosen: function(){if(triggerFemale != null){subjectFemale = triggerFemale;}}},
		{makeTransformationText:function(){return String.format("you become {0}", specificTarget ? "a copy of the" : subjectArticle);}, 
			chosen: function(){if(triggerFemale != null){subjectFemale = triggerFemale;}}},
		randomFrom([ // make head transformations a little less common.
				{makeTransformationText:function(){return specificTarget 
						? "an additional head grows beside your own. It's that of the" : "an additional head grows beside your own, and your original head changes to match. The heads are that of a";},
						additionalExplaination: randomFrom([
								specificTarget ? "The new head retains its own mind." : "You have no control over your new head.",
								"You control the additional head fully.",
								"Your personality is split between the heads. One gets your libido and passion, the other gets your logic and restraint.",
								"You get along with your new head like a sibling most of the time, but it's always making sexual advances."]),},			
				{makeTransformationText:function(){return String.format("your head transforms into that of {0}", specificTarget ? "the" : subjectArticle);},
						chosen: function(){becomingHybrid = true; sexUndecided = true;}},]),
		{makeTransformationText:function(){return String.format("{0} into {1}", happensOnce 
				? "you spend the next 24 hours transforming" : "you transform a little bit more",
				specificTarget ? "a copy of the" : subjectArticle);}, durationText: "",
				chosen: function(){if(triggerFemale != null){subjectFemale = triggerFemale;}},
				closingRemarkText: "I looooove the slow burn."},
		{makeTransformationText:function(){return String.format("your genitals are replaced by those of {0}", specificTarget ? "the" : subjectArticle);},
				additionalExplaination: randomFrom([
						"You adopt the donor's sex drive.",
						"You obtain your new privates via a swap.",
						"Your new genitals are not resized to match your body."]),
				tags: [nsfw]},
		{transformationText: "you switch genders", chosen: function(){shouldRenderSubjectText = false;}},
		{makeTransformationText:function(){return String.format("you become a taur version of {0}", specificTarget ? "the" : subjectArticle);},
			chosen: function(){if(triggerFemale != null){subjectFemale = triggerFemale;}}},
		{makeTransformationText:function(){return specificTarget ? String.format("you grow a copy of the {0}'s genitals in your mouth", curse.renderSubjectText()) : 
				String.format("your {0} transforms into the {1} of {2} {3}", subjectFemale ? "mouth" : "tongue", subjectFemale ? "pussy" : "penis", subjectArticle, curse.renderSubjectText());},
				tags: [lewd],
				chosen: function(){shouldRenderSubjectText = false;},},
		{makeTransformationText:function(){return String.format("you become an sentient sex doll made to look like {0}",
				specificTarget ? "the" : subjectArticle);},
				additionalExplaination: randomFrom([
						"Mental conditioning makes fufilling your duties a pleasure.",
						"Whenever anyone sees you, they have an urge to use you.",
						"You cannot refuse any command."]),
				tags: [nsfw]},
		{makeTransformationText:function(){return String.format("you swap minds with {0}", specificTarget ? "the" : "the nearest");},
				chosen: function(){imaginarySpeciesAllowed = false; if(triggerFemale != null){subjectFemale = triggerFemale;};}},
		{makeTransformationText:function(){return String.format("your genitals transform into the mouth of {0}", specificTarget ? "the" : subjectArticle);},
				additionalExplaination: randomFrom([
						"You have no control over your new mouth.",
						"Whatever was between your legs before ends up incorperated into your new mouth.",
						"Whatever was between your legs before ends up incorperated into your original mouth.",
						"Eating is an orgasmic experience."]),
				tags: [lewd]},
		{makeTransformationText: function() {return String.format("your {0}, and legs transform into those of {1}", 
				randomSelectionFrom(["head", "arms", "hands", "backside"]).join(', '),
				specificTarget ? "the" : subjectArticle)}},
		{makeTransformationText: function() {return String.format("your {0} transform into {1} tentacles", 
				randomFrom(["arms", "legs", "arms and legs", "arms, legs, and tailbone"]),
				randomFrom(["squid", "octopus", "alien"]))},
				additionalExplaination: randomFrom([
						"You have no control over your new tentacles.",
						"Your tentacles constantly produce slime.",
						"You find controlling your new tentacles to be very intuitive.",
						"Your tentacles dry out if you don't moisten them regularly.",
						explicitness == nsfw || explicitness == lewd ? "Whenever you're not paying attention to your tentacles, they creep toward your privates and start massaging them." 
							: "Your new tentacles are exceptionally large.",
						explicitness == lewd ? "The tips of your tentacles are erogenous zones." 
							: "Your tentacles can't stay still for long."]),
				chosen: function(){shouldRenderSubjectText = false;}},
				
	];
	var inhumanTransformations = [
		{makeTransformationText:function(){return String.format("you transform into an anthro version of {0}", specificTarget ? "the" : subjectArticle);},
				chosen: function(){becomingHybrid = true;}},
		{makeTransformationText:function(){return String.format("you grow the tail of {0}", specificTarget ? "the" : subjectArticle);},
				chosen: function(){becomingHybrid = true;}},
		{makeTransformationText:function(){return String.format("you transform into a kemono version of {0}", specificTarget ? "the" : subjectArticle);
				closingRemarkText: randomFrom([
					"A kemono is one of those anime characters with the ears and the tail, right?", "How kawaii!"])},
				chosen: function(){becomingHybrid = true;}},
		{makeTransformationText:function(){return String.format("you become an inflatable pool toy shaped like {0}", specificTarget ? "the" : subjectArticle);},
				closingRemarkText: randomFrom([
					"What are you going to do in the winter?", 
					"Hopefully you can warn people ahead of time.",
					"I'd put my lips on your nozzle ;)",
					"I've always wondered what it feels like to get inflated. You'll have to tell me."]),
					additionalExplaination: randomFrom(["You go unconcious when deflated.", "You can still move when transformed.", "Your valve is an erogenous zone"]),},
		{makeTransformationText:function(){return randomFrom([
				String.format("your {0} turn into the {1} of {2}", randomFrom(["hands", "feet"]), extemitiesName, specificTarget ? "the" : subjectArticle),
				String.format("you sprout the tail of {0}", specificTarget ? "the" : subjectArticle)]);},
				additionalExplaination: happensOnce ? "Over the next year, the rest of your body transforms to match." : "Each time you transform, an additional bodypart also changes.",
				chosen: function(){becomingHybrid = true;}},
		{makeTransformationText:function(){return String.format("you become {0} {1} from the waist down", specificTarget ? "the" : subjectArticle, curse.renderSubjectText());},
				chosen: function(){shouldRenderSubjectText = false; becomingHybrid = true;}},
	];
	var touchTransformations = [
		{makeTransformationText:function(){return String.format("you merge with {0} {1}, becoming a two-headed hybrid",specificTarget ? "the" : "", curse.renderSubjectText());},
			subjectText: "them",
			chosen: function(){shouldRenderSubjectText = false; if(triggerFemale != null){subjectFemale = triggerFemale;}},
			closingRemarkText: "I hope you really liked them."},
		{makeTransformationText:function(){return String.format("you merge with {0} {1}, becoming their new {2}",
				specificTarget ? "the" : "", curse.renderSubjectText(), sexUndecided ? "genitals" : triggerFemale ? "pussy" : "penis");},
			additionalExplaination: randomFrom([
								"You don't lose your eyes when you merge. They remain above your host's junk, taking in the views and looking pretty upset.",
								"You can exert some control over your host's libido.",
								"You can communicate with your host mentally and access their senses.",
								"Your new host doesn't remember the transformation."]),
			chosen: function(){shouldRenderSubjectText = false; if(triggerFemale != null){subjectFemale = triggerFemale;}},
			subjectText: "them",
			tags: [lewd]},
	]
	
	var generalSubjects = [
		{subjectText: "member of your favorite species"},
		{makeSubjectText: function(){return subjectFemale ? "cow" : "bull";}, closingRemarkText: "Uhh. . . Moo?",
				chosen: function(){extemitiesName = "hooves";},
				makeAdditionalExplaination: function(){return subjectFemale ? "You also have an udder and give milk." : "You hate the color red, and you find cows strangely alluring.";}},
		{makeSubjectText: function(){return subjectFemale ? "rottweiler bitch" : "rottweiler stud";},
				closingRemarkText: randomFrom(["That's a solid breed.","Beg for the biscuit!"])},
		{makeSubjectText: function(){return subjectFemale ? "german shepherd bitch" : "german shepherd stud";},
				closingRemarkText: randomFrom(["Do you know any tricks?","Are you going to pretend to be someone's pet?"])},
		{makeSubjectText: function(){return subjectFemale ? "doe" : "buck";},
				chosen: function(){extemitiesName = "hooves";},
				closingRemarkText: "A noble animal with a great rack."},
		{makeSubjectText: function(){return subjectFemale ? "cat" : "tom cat";}},
		{makeSubjectText: function(){return subjectFemale ? "ewe" : "ram";},
				chosen: function(){extemitiesName = "hooves"; subjectArticle = subjectFemale ? "an" :"a"}},
		{makeSubjectText: function(){return subjectFemale ? "hen" : "rooster";},
				chosen: function(){extemitiesName = "talons";}},
		{subjectText: "hawk", chosen: function(){extemitiesName = "talons";}},
		{makeSubjectText: function(){return subjectFemale ? "vixen" : "fox";}},
		{makeSubjectText: function(){return subjectFemale ? "nanny goat" : "billy goat";},
				chosen: function(){extemitiesName = "hooves";},
				closingRemarkText: "Maybe it'll make you a better climber."},
		{subjectText: "zebra", chosen: function(){extemitiesName = "hooves";}},
		{subjectText: "snow leopard"},
		{subjectText: "tiger"},
		{subjectText: "hyena"},
		{subjectText: "bunny"},
		{subjectText: "skunk",
			closingRemarkText: "Do you smell something?"},
		{subjectText: "otter", chosen: function(){extemitiesName = "webbed paws"; subjectArticle = "an"}},
		{subjectText: "squirrel"},
		{subjectText: "lizard", chosen: function(){extemitiesName = "claws";}},
		{subjectText: "closest pet", chosen: function(){specificTarget = true;},
			closingRemarkText: "Is it better or worse if it's your own pet?"},
		{subjectText: "kangaroo"},
		{subjectText: "whale", chosen: function(){extemitiesName = "fins";}},
		{subjectText: "donkey", chosen: function(){extemitiesName = "hooves";},
			closingRemarkText: randomFrom([
					"Too bad it had to be such an awkward animal.", "Don't make an ass out of yourself."])},
		{subjectText: randomFrom(["monkey", "baboon", "lemur"])},
		{subjectText: randomFrom(["squid", "worm", "lemur"])},
		{subjectText: randomFrom(["bee", "spider", "scorpion"]), chosen: function(){extemitiesName = "pointed extremities";}},
		{makeSubjectText: function(){return subjectFemale ? "mare" : "stallion";}, chosen: function(){extemitiesName = "hooves";}},
		{subjectText: "komodo dragon", chosen: function(){extemitiesName = "claws";}},
		{subjectText: "anaconda", chosen: function(){subjectArticle = "an"; extemitiesName = "nothings";},
			closingRemarkText: "Just as I like 'em: thick and slithery."},
		{subjectText: "last animal you touched", chosen: function(){specificTarget = true;}},
		{subjectText: "the last animal you ate", chosen: function(){specificTarget = true;},
		closingRemarkText: randomFrom([
					"Sample any exotic meats lately?", "Mmm-mm. This beef tastes just like you."])},
	];
	var imaginarySubjects = [
		{subjectText: "last fantasy creature you killed in a video game", chosen: function(){specificTarget = true;},
			closingRemarkText: "Mana really does flow from computer monitors these days."},
		{subjectText: "current year's zodiac animal", chosen: function(){specificTarget = true;}},
		{makeSubjectText: function(){return subjectFemale ? "dire wolf bitch": "dire wolf stud";}},
		{subjectText: "zodiac animal assigned to you at birth", chosen: function(){specificTarget = true;}},
		{subjectText: "dragon", additionalExplaination: "You have a lust for hoarding treasure that is impossible to ignore.",
				closingRemarkText: "I said you looked lucky, didn't I?"},
		{subjectText: "unicorn", chosen: function(){extemitiesName = "hooves";}},
		{subjectText: "warg",
				closingRemarkText: "What a majestic creature you've become."},
		{subjectText: "kobold",
			closingRemarkText: randomFrom(["I think you'll be adorable.", "I love those thick, lizardy tails!"])},
		{subjectText: "wyvern"},
	];
	var imaginaryNonHybridable = [
		{subjectText: "demon", function(){extemitiesName = "claws";}},
		{subjectText: "sphinx"},
		{subjectText: "drider", function(){extemitiesName = "spider legs";}},
		{subjectText: "giant", function(){extemitiesName = "hands";}},
		{makeSubjectText: function(){return subjectFemale ? "succubus": "minotaur";}},
		{makeSubjectText: function(){return subjectFemale ? "gorgon": "incubus";}},
	]
	
	var durations = [
		{durationText: "You remain this way until you have sex.", tags: [nsfw]},
		{durationText: "You remain this way until you can convince someone to kiss you.",
			closingRemarkText: "You're lucky I didn't say the person kissing had to be a princess."},
		{durationText: "You remain this way until you reveal your curse to someone new.",
			closingRemarkText: randomFrom(["Who will you show first?",
					"How many times before you run out of people you trust?", 
					"I hope the people you tell don't use their knowledge against you."])},
		{durationText: "You remain this way until you have sex with someone.", tags: [nsfw]},
		{durationText: "You remain this way for 23 hours.",
			closingRemarkText: "That's enough time for a full day and a full night's sleep while you're transformed."},
	]
	var longDurations = [
		{durationText: "You return to normal after one week.",
				closingRemarkText: "I've noticed you've been taking a lot of one-week vacations lately. . ."},
		{durationText: "You return to normal after one day, but each transformation lasts twice as long as the last.",
				closingRemarkText: "The more you like it, the more dangerous it is."},
		{durationText: "You will return to normal in a week, but each time you orgasm, the duration is increased by a day.", tags: [nsfw]},
		{makeDurationText: function(){return sexUndecided ? "Your original form can only be restored by reproducing." : 
				subjectFemale ? "Your original form can only be restored by giving birth." : "Your original form can only be restored by siring young.";},
				tags: [nsfw]},
		{makeDurationText: function(){return sexUndecided ? "You remain this way until you have sex with 10 different people." : 
				subjectFemale ? "You will be restored to your original form once 10 people cum inside of you." 
						: "You will be restored to your original form once you cum inside 10 people";},
				tags: [lewd]},
	]

	var generalComplications = [
		{makeComplicationText: function(){return String.format("{0} must obey the orders of any human.", happensOnce ? "You" : "While transformed, you");}},
		{makeComplicationText: function(){return happensOnce ? "No one remembers you being any other way." : "While transformed, everyone thinks you've always been this way.";}},
		{complicationText: "Your sex drive and production of bodily fluids are greatly increased.",
				closingRemarkText: "Does bodily fluids include sweat? That could be kinda gross.",
				tags: [nsfw]},
		{makeComplicationText: function(){return String.format("Your {0} is constantly dripping {1}.", subjectFemale ? "pussy" : "penis", subjectFemale ? "fem-lube" : "pre-cum");},
				tags: [lewd]},
		{complicationText: "Your curse is sexually transmittable.",
			closingRemarkText: "It won't be long before prospective lovers ask each other to get tested for it.",
			tags: [nsfw]},
		{complicationText: "Your bodily fluids are a potent aphrodesiac when consumed",
			tags: [nsfw]},
		{complicationText: "Your pheromones allow you to seduce almost any creature.",
			tags: [nsfw]},
		{complicationText: "Also, you must lay one large egg every day.",
			additionalExplaination: randomFrom([
								"The time of day when you lay your egg is random. A shifting feeling in your belly gives you 30 seconds warning before you drop.",
								"The first time laying is painful. By the end of the first week, it starts to become pleasurable.",
								"Your eggs are capable of carrying young."]),
			makeClosingRemarkText: function(){return String.format("Does that mean you have a cloaca now? {0}", 
			randomFrom(["Weird.", "Cool!", "Fascinating.", "Gross.", "Huh."]))}},
		{complicationText: "Also, you grow an extra pair of breasts.",
			closingRemarkText: "An extra pair of tits never hurt anyone.",
			tags: [nsfw]},
		{makeComplicationText: function(){return String.format("You grow {0} extra pairs of breasts.", randomFrom(["two", "three", "four", "five"]));},
				tags: [lewd]},
		{complicationText: "You grow an extra penis.", tags: [lewd]},
		{complicationText: "You grow an extra vagina.", tags: [lewd]},
		{complicationText: "Your wardrobe changes to accomodate your new form."},
		{complicationText: "No one seems to think your new curse is at all unusual."},
		{complicationText: "Your current romantic interest is also afflicted with the same curse."},
		{complicationText: "If you weren't before, you are now bisexual."},
		{makeComplicationText: function(){return String.format("{0} a hermaphrodite.", happensOnce ? "You become" : "While transformed, you are");},
			tags: [nsfw]},
		{makeComplicationText: function(){return String.format("{0} a hermaphrodite.", happensOnce ? "You become" : "While transformed, you are");},
			tags: [lewd]},
		{makeComplicationText: function(){return String.format("{0} {1}", happensOnce ? "You become" : "While transformed, you are",
			subjectFemale ? "kinda, like, an air-headed bimbo." : "a meat-headed hunk.");}},
		{makeComplicationText: function(){return happensOnce ? "You don't quite remember your life before the transformation" : "While 	transformed, you don't remember being any other way."}},
		{makeComplicationText: function(){return String.format("Immediately after your transformation {0}",
				sexUndecided ? "You feel compelled to reproduce until you are successful." : 
						subjectFemale ? "you feel a kicking and realize you're pregnant!" : "the nearest female becomes pregnant with your children.");},
				tags: [nsfw]},
		{makeComplicationText: function(){return happensOnce ? "Your sex drive is supercharged." : "While transformed, you are always horny.";},
				tags: [nsfw]},
		{makeComplicationText: function(){return sexUndecided ? "Your genitals are oversized." : 
				subjectFemale ? "Your pussy is oversized and gets dripping wet whenever you're aroused." : "Your penis is exceptionally large.";},
				tags: [nsfw]},
		{makeComplicationText: function(){return sexUndecided ? "Your genitals are massively oversized." : 
				subjectFemale ? "Your pussy is absolutely enormous, impossible to hide, and is constantly dripping wet." 
				: "Your penis is absolutely enormous.";},
				tags: [lewd]},
	]
	var mundaneAnimalComplications = [
		{complicationText: "You and the relevant species experience a mutual attraction.",
				tags: [nsfw]},
		{complicationText: "You can speak to other members of the relevant species."},
	]
	var inhumanComplications = [
		{makeComplicationText: function(){return String.format("{0} lose your ability to read and write", happensOnce ? "You" : "While transformed, you");}},
		{complicationText: "You retain your ability to speak English."},
		{complicationText: "You get all the instincts of the relevant species and can't resist acting on them."},
		{makeComplicationText: function(){return happensOnce ? "You are sold to a rich, private collector." : "While in human form, you retain some parts of your other form.";}},
		{makeComplicationText: function(){return happensOnce ? "You are captured for scientific research." : "Each time you revert to human, you retain more parts of your other form.";}},
	]
	var personSubjectComplications = [
		{complicationText: "You gain the memories of the other person.",
				closingRemarkText: "Pilfer their dirty secrets."},
		{complicationText: "Whenever the other person becomes aroused, you are as well. And vice-versa.",
			tags: [nsfw]},
		{complicationText: "Whenever the other person orgasms, so do you. And vice-versa.",
			tags: [nsfw]},
		{complicationText: "You cannot refuse orders from the other person."},
	]
	
	var generalClosingRemarks = [
		{closingRemarkText: "That might be pretty difficult to hide. . ."},
		{closingRemarkText: "Do you think you'll be able to live a normal life like that?"},
		{closingRemarkText: "So. . . are you going to tell anyone you know about it?"},
		{closingRemarkText: "How could you possibly adapt?"},
		{closingRemarkText: "I wonder if you can use that as a way to make money. . ."},
		{closingRemarkText: "Guess I was wrong about you being lucky."},
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
	
	updateCurse(curse, randomFrom(filterNSFW(triggers)));
	if (curse.renderTransformationText == null) {
		updateCurse(curse, randomFrom(buildTransformations(specificTarget, personSubject, touchTrigger)));
	}
	if (curse.renderSubjectText == null) {
		updateCurse(curse, randomFrom(buildSubjects(imaginarySpeciesAllowed)));
	}
	if (curse.renderDurationText == null) {
		updateCurse(curse, randomFrom(buildDurations()));
	}
	if (curse.renderComplicationText == null) {
		var chance = explicitness == lewd ? .8 : explicitness == nsfw ? .35 : .15;
		if(Math.random() < chance) {
			updateCurse(curse, randomFrom(buildComplications(imaginarySpeciesAllowed, personSubject)));
		} else {
			updateCurse(curse, {complicationText: ""});
		}
	}
	if (curse.renderClosingRemarkText == null) {
		if(Math.random() < .3) {
			updateCurse(curse, randomFrom(filterNSFW(generalClosingRemarks)));
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