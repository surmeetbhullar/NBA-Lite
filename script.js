let xp = 0;
let health = 100;
let gold = 50;
let currentMoves = 0;
let fighting;
let monsterHealth;
let inventory = ["Dribble"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const moves = [
	{
		name: "Layup",
		power: 5
	},
	{
		name: "Mid-Range",
		power: 30
	},
	{
		name: "Flop",
		power: 50
	},
	{
		name: "3-Pointer",
		power: 100
	}
];

const monsters = [
  {
    name: "LeBron James",
    level: 2,
    health: 15
  },
  {
    name: "De'Aaron Fox",
    level: 8,
    health: 60
  },
  {
    name: "Michael Jordan",
    level: 20,
    health: 300
  }
];

const locations = [
    {
        name: "town square",
        "button text": ["Go to Foot Locker", "Go to Arena", "Fight GOAT"],
        "button functions": [goStore, goArena, fightGOAT],
        text: "You are in the city. You see a sign that says \"Foot Locker.\""
    },
	{
		name: "store",
		"button text": ["Buy 10 health (10 gold)", "Buy a move (30 gold)", "Go to the City"],
		"button functions": [buyHealth, buyMove, goCity],
		text: "You enter the Foot Locker."
	},
	{
		name: "cave",
		"button text": ["Verse LeBron James", "Verse DeAaron Fox", "Go to the city"],
		"button functions": [fightSlime, fightBeast, goCity],
		text: "You enter the arena. You see some players."
	},
	{
		name: "fight",
		"button text": ["Attack", "Dodge", "Run"],
		"button functions": [attack, dodge, goCity],
		text: "You are versing a player."
	},
	{
		name: "kill monster",
		"button text": ["Go to the city", "Go to the city", "Go to the city"],
		"button functions": [goCity, goCity, easterEgg],
		text:  'He screams "Arg!" as he loses. You gain experience points and find gold.'
	},
	{
		name: "lose",
		"button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
		"button functions": [restart, restart, restart],
		text: "You die. ☠️"
	},
	{
		name: "win",
		"button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
		"button functions": [restart, restart, restart],
		text: "You defeat the GOAT! YOU WIN THE GAME! 🎉"
    },
	{
		name: "easter egg",
		"button text": ["2", "8", "Go to the City?"],
		"button functions": [pickTwo, pickEight, goCity],
		text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
	}
]


// initialize buttons
button1.onclick = goStore;
button2.onclick = goArena;
button3.onclick = fightGOAT;

function update(location) {
    monsterStats.style.display = "none";
	button1.innerText = location["button text"][0];
	button2.innerText = location["button text"][1];
	button3.innerText = location["button text"][2];
	button1.onclick = location["button functions"][0];
	button2.onclick = location["button functions"][1];
	button3.onclick = location["button functions"][2];
    text.innerText = location.text;    
}

function goCity() {
    update(locations[0]);
}

function goStore() {
    update(locations[1]);
}

function goArena() {
    update(locations[2]);
}

function buyHealth() {
    if (gold >= 10) {
        gold -= 10;
        health += 10;
        goldText.innerText = gold;
    	healthText.innerText = health;       
    } else {
        text.innerText = "You do not have enough gold to buy health.";
    }

}

function buyMove() {
    if (currentMoves < moves.length - 1) {
    	if (gold >= 30) {
            gold -= 30;
            currentMoves++;
            goldText.innerText = gold;
            let newMove = moves[currentMoves].name;
    		text.innerText = "You now have a " + newMove + ".";
            inventory.push(newMove);
            text.innerText += " In your inventory you have: " + inventory;
    	} else {
    		text.innerText = "You do not have enough gold to buy a move.";
    	} 
    } else {
		text.innerText = "You already have the most powerful move!";
        button2.innerText = "Sell move for 15 gold";
		button2.onclick = sellMove;
	}
}

function sellMove() {
	if (inventory.length > 1) {
		gold += 15;
		goldText.innerText = gold;
        let currentMove = inventory.shift();
        text.innerText = "You sold a " + currentMove + ".";
        text.innerText += " In your inventory you have: " + inventory;
	} else {
    	text.innerText = "Don't sell your only move!";
  	}
}

function fightSlime() {
	fighting = 0;
	goFight();
}

function fightBeast() {
	fighting = 1;
	goFight();    
}

function fightGOAT() {
	fighting = 2;
	goFight();
}

function goFight() {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterNameText.innerText = monsters[fighting].name;
	monsterHealthText.innerText = monsterHealth;
}

function attack() {
    text.innerText = monsters[fighting].name + " attacks.";
    text.innerText += " You attack him with your " + moves[currentMoves].name + ".";
    
    if (isMonsterHit()) {
        health -= getMonsterAttackValue(monsters[fighting].level);
    } else {
		text.innerText += " You miss.";
	}
    
    monsterHealth -= moves[currentMoves].power + Math.floor(Math.random() * xp) + 1;
	healthText.innerText = health;
	monsterHealthText.innerText = monsterHealth;   
	if (health <= 0) {
		lose();
	} else if (monsterHealth <= 0) {
		fighting === 2 ? winGame() : defeatMonster();
	}

	if (Math.random() <= .1 && inventory.length !== 1) {
        text.innerText += " Your " + inventory.pop() + " breaks.";
        currentMove--;
	}
}

function getMonsterAttackValue(level) {
    let hit = (level * 5) - (Math.floor(Math.random() * xp));
    console.log(hit);
    return hit;
}

function isMonsterHit() {
	return Math.random() > .2 || health < 20;
}


function dodge() {
    text.innerText = "You dodge the attack from " + monsters[fighting].name + ".";
}

function defeatMonster() {
    gold += Math.floor(monsters[fighting].level * 6.7)
    xp += monsters[fighting].level;
    goldText.innerText = gold;
	xpText.innerText = xp;
    update(locations[4]);
}

function lose() {
    update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
	xp = 0;
	health = 100;
	gold = 50;
	currentMove = 0;
	inventory = ["stick"];
	goldText.innerText = gold;
	healthText.innerText = health;
	xpText.innerText = xp;
	goCity();
}

function easterEgg() {
	update(locations[7]);
}

function pickTwo() {
 pick(2);
}

function pickEight() {
 pick(8);
}

function pick(guess) {
    let numbers = [];
    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11));
    }

    text.innerText = "You picked " + guess + ". Here are the random numbers:\n";

    for (let i = 0; i < 10; i++) {
        text.innerText += numbers[i] + "\n";
    }

    if (numbers.indexOf(guess) !== -1) {
        text.innerText += "Right! You win 20 gold!"
        gold += 20;
        goldText.innerText = gold;
    } else {
        text.innerText += "Wrong! You lose 10 health!"
        health -= 10;
        healthText.innerText = health
        if (health <= 0) {
          lose();
        }
    }
}