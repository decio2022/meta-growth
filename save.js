function initPlayer() {
    return {
        points: new Decimal(0),
        version: "alpha",
        basic_upgrades: [new Decimal(0), new Decimal(0), new Decimal(0)],
        prestige_currency: [new Decimal(0)],
        upgs: {"1/1/0":new Decimal(0),"1/1/1": new Decimal(0),"1/0/0": new Decimal(0)},

        unlocked_layers: 0,
        page: 0,

        autobuy_basic: false,

        automatons: new Decimal(0),
        automated: [],

        total_points: new Decimal(0),
        score: new Decimal(0),
        extra_boosts: []
    }
}

NAME = "meta-growth" //place you want to direct your local storage thing



player = initPlayer()

const player_vars_d = ["points","automatons","score", "total_points"]
const player_vars_l = ["basic_upgrades", "prestige_currency", "upgs"]
const player_vars_str = ["unlocked_layers", "page", "autobuy_basic","automated","extra_boosts"]

function detectNaN() {
    for (var i in player_vars_d) {
        if (player[player_vars_d[i]].isNan()) { player[player_vars_d[i]] = initPlayer()[player_vars_d[i]] }
    }
    for (var i in player_vars_l) {
        for (var j in player[player_vars_l[i]]) {
            if (player[player_vars_l[i]][j].isNan()) {
                console.log(player[player_vars_l[i]][j])
                player[player_vars_l[i]][j] = initPlayer()[player_vars_l[i]][j]
            }
        }
    }
    for (var i in player_vars_str) {
        if (player[player_vars_str[i]] == NaN) { player[player_vars_str[i]] = initPlayer()[player_vars_str[i]] }
    }
}



function save() {
    detectNaN()
    localStorage.setItem(NAME, JSON.stringify(player))
}

s = setInterval(save, 1000, 1)

function load() {
    var u = JSON.parse(localStorage.getItem(NAME))
    console.log(JSON.parse(localStorage.getItem(NAME)))
    for (var i in player_vars_d) {
        player[player_vars_d[i]] = new Decimal(u[player_vars_d[i]])
    }
    for (var i in player_vars_l) {
        player[player_vars_l[i]] = initPlayer()[player_vars_l[i]]
        for (var j in u[player_vars_l[i]]) {
            player[player_vars_l[i]][j] = new Decimal(u[player_vars_l[i]][j])
        }
    }
    for (var i in player_vars_str) {
        player[player_vars_str[i]] = u[player_vars_str[i]]
        if (player[player_vars_str[i]] == undefined) {
            if (player_vars_str[i] == "version") { //old save revert
                //idk
            }
            else {
                player[player_vars_str[i]] = initPlayer()[player_vars_str[i]]
            }
        }
    }
}


const banks =
    [
            ]

load()

player.version = "alpha"

function bank(num) {
    if (confirm("Are you sure you want to use this save? This will OVERRIDE your progress!")) {
        clearInterval(s)
        localStorage.setItem(NAME, banks[num])
        location.reload()
    }
}

function import_player(data) {
    console.log(data)
    if (confirm("Are you sure you want to use this save to override the previous save?")) {
        clearInterval(s)
        localStorage.setItem(NAME, data)
        location.reload()
    }
}