// Version 3.0.1

//Hero Name (added in 3.0.1)
var heroName = prompt("Name Your Hero", "");

//Hero and enemy character sheets
var hero = {
    hp: 20,
    baseHp: 20,
    mp: 5,
    baseMp: 5,
    heal: 5,
    baseHeal: 5,
	damage: 6,
	level: 1,
    //baseDamage added for leveling Damage per level
	baseDamage: 6,
    //baseAc & baseThac0 for leveling per hero level - AC & THAC0 added to have a hit or miss on attack
    ac: 10,
    thac0: 15,
    baseAc: 10,
    baseThac0: 15;

}
//AC and THAC0 also added in for monsters.
function Enemy(name, hp, damage, level, ac, thac0) {
	this.name = name;
	this.hp = hp;
	this.damage = damage;
	this.level = level;
	this.ac = ac;
	this.thac0 = thac0;
}

var slime = new Enemy('slime', 15, 3, 1, 10, 15);
var troll = new Enemy('troll', 30, 6, 2, 8, 14);
var dragon = new Enemy('dragon', 50, 9, 3, 6, 13);
//Added Impossible 4th Boss +++++++++++++++++ NEW FEATURE
var omega = new Enemy('omega_weapon', 90, 12, 4, 5, 5);

var monster;
var monsterCodex = [slime, troll, dragon, omega];

//Let's rock!
var battle = function () {
    //Make sure action buttons are active
    $('#btn-fight').removeClass().addClass('show');
    $('#btn-run').removeClass().addClass('show');
    $('#btn-heal').removeClass().addClass('show');

    //Total hit points
    $('#heroname').html(heroName);
    $('#herohp-total').html(hero.hp);
    $('#heromp-total').html(hero.mp);
    $('#herolevel').html(hero.level);
    $('#monstername').html(monster.name.toUpperCase());
    $('#monsterhp-total').html(monster.hp);

    //Hide unnecessary buttons
    $('#btn-reload').removeClass().addClass('hide');
    $('#btn-nextbattle').removeClass().addClass('hide');

    //Monster Image
    $('#monster-image').addClass(monster.name);


    //Battle damage display

    function displayHeroName() {
        $('#heroname').html(heroName);
    }
    function displayHeroHP() {
        if (hero.hp < 1) {
            $('#herohp').html(0);  //Prevents showing negative HP
        } else {
            $('#herohp').html(hero.hp);
        }
    }

    function displayHeroMP() {
        if (hero.mp < 1) {
            $('#heromp').html(0);  //Prevents showing negative MP
        } else {
            $('#heromp').html(hero.mp);
        }
    }

    function displayMonsterHP() {
        if (monster.hp < 1) {
            $('#monsterhp').html(0);  //Prevents showing negative HP
        } else {
            $('#monsterhp').html(monster.hp);
        }
    }

    //Critical Hit Rolls
    var heroDamageCrit = hero.damage;
    var monsterDamageCrit = monster.damage;


    //BEGIN BATTLE
    displayHeroName()
    displayHeroHP();
    displayHeroMP();
    displayMonsterHP();

    $('#battle-text-hero').html("A " + monster.name.toUpperCase() + " approaches!");
    $('#battle-text-enemy').html("");
    $('#battle-text-extra').html("");

    //HEAL

    document.getElementById('btn-heal').onclick = function () {
        var monsterDamage = Math.random() * monster.damage + 1 | 0;
        healHero();
        function healHero() {
            if (hero.mp >= 5) {
                hero.hp = hero.hp + hero.heal;
                hero.mp = hero.mp - 5;
                hero.hp = hero.hp - monsterDamage;
                displayHeroHP();
                displayHeroMP();
                $('#battle-text-hero').html(heroName + " Heals for " + hero.heal + ".");
                $('#battle-text-enemy').html("");
                $('#battle-text-enemy').html("The " + monster.name.toUpperCase() + " attacks " + heroName + " for " + monsterDamage + " damage.");
            } else {
                $('#battle-text-hero').html(heroName + " Doesn't have enough MP ");
                $('#battle-text-enemy').html(monster.name.toUpperCase() + " laughs at " + heroName + " For Being a NEWB.");
            }
            if (hero.hp < 1) {
                $('#battle-text-extra').html(heroName + " HAS DIED, GAME OVER!");

                $('#btn-fight').removeClass().addClass('hide');
                $('#btn-run').removeClass().addClass('hide');
                $('#btn-heal').removeClass().addClass('hide');
                $('#container').css('background', '#222 none');

                $('#btn-reload').removeClass().addClass('show')
            }
        }
    }

    //FIGHT
    document.getElementById('btn-fight').onclick = function () {
        //Attack Power
        var heroDamage = Math.random() * hero.damage + 1 | 0;
        var monsterDamage = Math.random() * monster.damage + 1 | 0;
        var heroThac0Roll = Math.random() * 20 + 1 | 0;
        var monsterThac0Roll = Math.random() * 20 + 1 | 0;
        //Hero Minimum Dmg +1 per level +++++++++++++++++++ NEW FEATURE
        if (heroDamage < hero.level) {
            heroDamage = heroDamage + (hero.level - 1);
        }
        //Attack Damage
        function attackMonster() {
            // THAC0 Roll to hit Monster
            if (heroThac0Roll >= (hero.thac0 - monster.ac)) {
                // If hit
                monster.hp = monster.hp - heroDamage;
                $('#attack-animation').removeClass().addClass('hit');
                setTimeout(function () {
                    $('#attack-animation').removeClass().addClass(monster.name);
                }, 500)
            } else {
                //If Miss
                $('#battle-text-hero').html(heroName + " misses " + monster.name.toUpperCase() + ".");
                $('#battle-text-enemy').html("");
            }
        }

        function attackHero() {
            // THAC0 Roll to hit hero
            if (monsterThac0Roll >= (monster.thac0 - hero.ac)) {
                // If hit
                hero.hp = hero.hp - monsterDamage;
                $('#monster-image').removeClass().addClass(monster.name + "-attack");
                setTimeout(function () {
                    $('#monster-image').removeClass().addClass(monster.name);
                }, 500)
            } else {
                //If Miss
                $('#battle-text-hero').html("The " + monster.name.toUpperCase() + " misses " + heroName + ".");
                $('#battle-text-enemy').html("");
            }
        }

        //Will attack be critical? The attack is only critial if you roll the max damage as hero ie: 6 and it will be doubled to 12.
        if (heroDamage === heroDamageCrit) {
            heroDamage = heroDamage * 2;
            $('#battle-text-hero').html("CRITICAL HIT! " + heroName + " attacks for " + heroDamage + " damage.");
            $('#battle-text-enemy').html("");
        } else {
            $('#battle-text-hero').html(heroName + " attacks for " + heroDamage + " damage.");
            $('#battle-text-enemy').html("");
        }

        //Attack enemy
        attackMonster();

        //Update monster HP display
        displayMonsterHP();

        //If monster dies - LEVEL UP!!!!
        if (monster.hp < 1 && monster.level < monsterCodex.length) {
            hero.level += 1;
            difficulty += 1;
            hero.hp = hero.baseHp + (10 * (hero.level - 1));
            //Hero Max Damage +1 Per Level +++++++++++++++++++ NEW FEATURE
            hero.damage = hero.baseDamage + (hero.level - 1);
            hero.ac = hero.baseAc - (hero.level - 1);
            hero.thac0 = hero.baseThac0 - (hero.level - 1);
            hero.mp = hero.baseMp + (5 * (hero.level - 1));
            hero.heal = hero.baseHeal + (5 * (hero.level - 1));


            $('#herohp').html(hero.hp);
            $('#herohp-total').html(hero.hp);
            $('#herolevel').html(hero.level);

            $('#battle-text-enemy').html(heroName + " HAS DEFEATED THE " + monster.name.toUpperCase() + " and reached LEVEL " + hero.level + "!");
            $('#battle-text-extra').html("Get ready for the next battle!");
            $('#monster-image').removeClass();
            $('#btn-nextbattle').removeClass().addClass('show');

            $('#btn-fight').removeClass().addClass('hide');
            $('#btn-run').removeClass().addClass('hide');
            $('#btn-heal').removeClass().addClass('hide');
        }

        if (monster.hp < 1 && monster.level === monsterCodex.length) {
            $('#battle-text-enemy').html(heroName + " HAS DEFEATED THE " + monster.name.toUpperCase() + "!");
            $('#battle-text-extra').html("YOU WIN!!!");
            $('#monster-image').removeClass();

            $('#btn-fight').removeClass().addClass('hide');
            $('#btn-run').removeClass().addClass('hide');
            $('#btn-heal').removeClass().addClass('hide');
            $('#btn-nextbattle').removeClass().addClass('hide');
            $('#btn-reload').removeClass().addClass('show');
        }

        //If the monster didn't die
        setTimeout(function () {
            if (monster.hp > 0) {
                if (monsterDamage === monsterDamageCrit) {
                    monsterDamage = monsterDamage * 2;
                    $('#battle-text-enemy').html("CRITICAL HIT! The " + monster.name.toUpperCase() + " attacks " + heroName + " for " + monsterDamage + " damage.");
                } else {
                    $('#battle-text-enemy').html("The " + monster.name.toUpperCase() + " attacks " + heroName + " for " + monsterDamage + " damage.");
                }

                attackHero();

                //Update Hero HP display
                displayHeroHP();

                //If hero dies
                if (hero.hp < 1) {
                    $('#battle-text-extra').html(heroName + " HAS DIED, GAME OVER!");

                    $('#btn-fight').removeClass().addClass('hide');
                    $('#btn-run').removeClass().addClass('hide');
                    $('#btn-heal').removeClass().addClass('hide');
                    $('#container').css('background', '#222 none');

                    $('#btn-reload').removeClass().addClass('show')
                }
            }
        }, 1500) //1.5 second delay after hero attacks
    } //end of fight
}                     //end of battle

//RUN
$('#btn-run').click(function () {
//CANNOT RUN IF YOU ARE FACING OMEGA WEAPON +++++++++++++++++ NEW FEATURE ADDED
    if (monster.name === 'omega weapon') {
        $('#battle-text-hero').html(heroName + " cannot run, " + monster.name.toUpperCase() + " bars the way.");
        $('#battle-text-enemy').html("");
        $('#battle-text-extra').html("");
    } else {
        $('#battle-text-hero').html(heroName + " runs away.");
        $('#battle-text-enemy').html(monster.name.toUpperCase() + " knew you were a coward.");
        $('#battle-text-extra').html("");
        $('#btn-fight').removeClass().addClass('hide');
        $('#btn-run').removeClass().addClass('hide');
        $('#btn-heal').removeClass().addClass('hide');

        $('#btn-reload').removeClass().addClass('show');
        $('#btn-nextbattle').removeClass().addClass('hide');
    }
});

//Set initial difficulty to 1
var difficulty = 1;

var difficultyGrid = function() {
	switch (difficulty) {
		case 1:
			monster = monsterCodex[0];
			battle();
			break;
		case 2:
			monster = monsterCodex[1];
			battle();
			break;
		case 3:
			monster = monsterCodex[2];
			battle();
			break;
        case 4:
            monster = monsterCodex[3];
            battle();
            break;
		default:
			document.getElementById('battle-text-hero').innerHTML = "<span style='color:red'>I AM ERROR.</span>";
			document.getElementById('battle-text-enemy').innerHTML = "";
			document.getElementById('battle-text-extra').innerHTML = "";
			break;
	}
}

//Select first monster
difficultyGrid();

//Additional monsters
document.getElementById('btn-nextbattle').onclick = function() {
	difficultyGrid();
}
