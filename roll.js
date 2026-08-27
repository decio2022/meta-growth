function roll(L) {
    if (player.score.gte(1)) {
        console.log("i have no fucking idea")
        player.score = player.score.sub(new Decimal(L).pow_base(10))
        var eff = 1 / (Math.random())
        var str = `${Math.floor(Math.random() * 4)}/${eff}`
        player.extra_boosts[L] = str;
        prestige(Number(L)+1,true)
    }
}

const boost_labels = ["Prestige Gain ^x","Layer boost ^x","All upgrades Cost root x","(L+1) gain ^x","Effective upgrades ^x"]

function display_extra_boosts() {
    var text = ""
    for (var i in player.extra_boosts) {
        var j = player.extra_boosts[i].split("/")
        var B = get_boost_mag(player.extra_boosts[i])
        text = text+`L${Number(i)+1}: ${boost_labels[j[0]].replace("x",format(B,4))}<br>`
    }
    return text
}

const expos = [0.125,0.75,0.125,0.0625,0.125]

function get_boost_mag(x) {
    var j = x.split("/")
    var x = new Decimal(j[1])
    return x.pow(expos[j[0]]) //rip switch case
}

//type 0: Prestige Gain ^x
//type 1: Layer boost ^x
//type 2: All upgrades cost root X
//type 3: Boost (L+1) gain ^x
//type 4: Effective upgrades *x