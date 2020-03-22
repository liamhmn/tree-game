var game = {
    x: {
        amount: new Decimal(0)
    },
    y: {
        amount: new Decimal(0)
    },
    upgrades: [],
    theme: 0,
    notation: 0,
    version: 3
}

// i actually have no clue

function ge(e) {
	return document.getElementById(e) || document.createElement("div");
}

function gc(e, f, o=0) {
	l = document.getElementsByClassName(e);
	for(var i = o; i < l.length + o; i++) {
		f(l[i % l.length], i); // pass the element and the position of the element in the array to function for each element
	}
}

const childList = {
    15: [25, 26, 16],
  	25: [24],
	24: [14, 23],
    26: [35, 27],
    14: [13],
    35: [45, 36],
    45: [44]
}

function showTab(name) {
	gc("tab", function(e) {
		e.style.display = "none";
	})
	ge(name + "Tab").style.display = "";
    currentTab = name;
    resizeCanvas()
}

// set default notation
var not = new ADNotations.ScientificNotation();

var ata;
var currentTab;

// buy an upgrade

function buybtn(id, cost, costCurr) {
    // reject the purchase of the upgrade if you already have it
    if (game.upgrades.includes(id)) return;
    // reject the purchase of the upgrade if it's too expensive
    if (cost.gt(game[costCurr].amount)) return;
    // reject the purchase of the upgrade if it's parent is not purchased
    if (document.getElementById(id).classList.contains("btn-locked")) return;
    // subtract cost from currency
    game[costCurr].amount = game[costCurr].amount.sub(cost)
    // update classes
    document.getElementById(id).classList.remove("btn-unbought")
    document.getElementById(id).classList.add("btn-bought")
    // store the fact that it's purchased
	game.upgrades.push(id)
    // tell it's children that it's been purchased
    // wait no, that sounds wrong
    if (childList[id]) {
        childList[id].forEach(el => {
            document.getElementById(el).classList.remove("btn-locked")
            document.getElementById(el).classList.add("btn-unbought")
        })
    }
}

// obtain a new currency, see previous func for some docs

function buyCurrency(id, cost, costCurr, curr) {
	if (game.upgrades.includes(id)) return;
    if (cost.gt(game[costCurr].amount)) return;
    if (document.getElementById(id).classList.contains("btn-locked")) return;
    game[costCurr].amount = game[costCurr].amount.sub(cost)
    document.getElementById(id).classList.remove("btn-unbought")
    document.getElementById(id).classList.add("btn-bought")
	game.upgrades.push(id)
	document.querySelector("#" + curr).style.display = "inline-block"
    if (childList[id]) {
        childList[id].forEach(el => {
            document.getElementById(el).classList.remove("btn-locked")
            document.getElementById(el).classList.add("btn-unbought")
        })
	}
	resizeCanvas()
}

function update() {
    // update currency display
	document.querySelector("#x").textContent = "x: " + not.format(game.x.amount, 2, 0)
	document.querySelector("#y").textContent = "y: " + not.format(game.y.amount, 2, 0)
}

// show intial tab so everything isn't on one screen

showTab('upgrades')

// give currencies

window.setInterval(() => {
        // Brute force. Yipee!
        var u = game.upgrades
        if (u.includes(15)) {
            ata = new Decimal(1)

            if (u.includes(25)) ata = ata.add(5)
            if (u.includes(16)) ata = ata.add(10)
            if (u.includes(14)) ata = ata.add(25)
            if (u.includes(24)) ata = ata.pow(2)
            if (u.includes(13)) ata = ata.pow(1.5)
			if (u.includes(35)) ata = ata.times(game.y.amount.pow(1/6))
            if (u.includes(23)) ata = ata.times(10)
            if (u.includes(36)) ata = ata.times(5)
		  
			game.x.amount = game.x.amount.add(ata)
		}
		
		if (u.includes(26)) {
			ata = new Decimal(1)

			if (u.includes(27)) ata = ata.times(5)
			if (u.includes(45)) ata = ata.times(2)
            if (u.includes(44)) ata = ata.pow(2)

			game.y.amount = game.y.amount.add(ata)
		}

        update()
}, 1000)

// save loop

window.setInterval(() => {
    save()
}, 10000)