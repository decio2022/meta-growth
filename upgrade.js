var BOOSTS = []

const types = [
    "log(log(x+1)+1)+1",
    "log(x+1)+1",
]

function color(B, baaa) {
    var str = new Decimal.slog(B.add(10)).times(200).toNumber()
    return `hsl(${str},${50}%,${100-baaa-10000/(100+str)}%)`
}

function gen_upg_box(U) {
    U = U.split("/").map(x => Number(x))
    if (U.length != 3 || U[0] % 1 != 0 || U[1] % 1 != 0 || U[2] % 1 != 0 || U[0]<0 || U[1]<0 || U[2]<0 || U[2]>=types.length || (U[0] == 0 & U[1] == 0) ) {
        T.innerHTML = "Invalid input"
        return
    }
    else {
        if (!Object.keys(player.upgs).includes(U.join("/"))) {
            var B = new Decimal(0)
        } else {
            var B = player.upgs[U.join("/")]
        }
            return `<button style="background-color: ${color(upg_cost(U.join("/"),new Decimal(0)))}" class="pres_upg" id="${U.join("/")}" onclick='pupg("${U.join("/")}")'></button>`
    }
}

function EC_upg_cost(id) {
    var J = id.split("/")
    //okay here's the plan
    //let id be a/b/c
    //b ==> receiver
    //a ==> input
    //a-b >=0 | a-b increase higher cost (lower layers more stuff)
    //a-b <=0 | a-b decrease higher cost (higher layers take more to unlock)
    var t = Math.abs(J[0] - J[1])
    var E = new Decimal(2)
    var B = new Decimal(1)
    if (J[0] >= J[1]) {
        var C = new Decimal(t).pow_base(2).pow_base(10)
        //10, 1e4, 1e16, 1e64, ...
        var E = E.add((t - 1) / 40)
    }
    else {
        var C = new Decimal(t).pow_base(2).times(7).pow_base(10)
        var E = E.add(0.125 + (t - 1) / 40)
    }
    if (J[2] == 0) {
        E = E.sub(1).div(2).add(1)
    } else {
        C = C.times(10)
    }
    return [E,C]
}

function upg_cost(id, bought) {
    var G = EC_upg_cost(id)
    var E = G[0]
    var C = G[1]
    var bought = new Decimal(bought)
    return bought.pow(E).pow_base(C.root(5)).times(C) //C.root(10) is probably one of the choices ever
}

function pupg(P, max = (document.getElementById("buy_text").innerHTML == "Max")) {
    if (!Object.keys(player.upgs).includes(P)) {
        var B = new Decimal(0)
    } else {
        var B = player.upgs[P]
    }
    var C = upg_cost(P, B)
        var Cr = P.split("/"); Cr = Math.max(Cr[0], Cr[1]);
    if (player.prestige_currency[Cr - 1].gte(C)) {
        if (!max) {
            if (B == 0) {
                player.upgs[P] = new Decimal(1)
            } else {
                player.upgs[P] = player.upgs[P].add(1)
            }
            player.prestige_currency[Cr - 1] = player.prestige_currency[Cr - 1].sub(C)
        }
        else {
            var G = EC_upg_cost(P)
            var E = G[0]
            var C = G[1]
            var B = C.root(5)
            var Cr = P.split("/"); Cr = Math.max(Cr[0], Cr[1]);
            var I = player.prestige_currency[Cr - 1]
            //SIX VARIABLES
            player.upgs[P] = I.div(C).add(1).log(B).root(E).ceil()
            player.prestige_currency[Cr - 1] = I.sub(upg_cost(P, player.upgs[P].sub(1))).max(1)
        }
    }
}

function get_currency(L) {
    if (L == 0) return player.points
    else return player.prestige_currency[L-1]
}

function calc_pp_boosts() {
    var p = []
    for (var i = 0; i < player.prestige_currency.length+2; i++){
        p = p.concat(new Decimal(1))
    }
    for (var i in player.upgs) {
        var key = i.split("/")
        //remember [0] = input, [1] = output (where in p it should store)
        //p[0] should be sth about points :3
        var eff = get_currency(key[0])
        if (key[2] == 0) { eff = eff.add(1).log10().add(1).log10().add(1).pow(player.upgs[i]) }
        else { eff = eff.add(1).log10().add(1).pow(player.upgs[i]) }
        p[key[1]] = p[key[1]].times(eff)
    }
    return p
}

function total_boost_display() {
    var e = ""
    for (var i in BOOSTS) {
        e = `${e} ${i==0?"Points":`P<sup>${i}</sup>`} x${format(BOOSTS[i])}<br>`
    }
    document.getElementById("total_boost").innerHTML = e
}

function gen_all_upgs(L) {
    document.getElementById("pupg").innerHTML = ""
    var L = L+1
    var req = []
    for (var i = 0; i <= L; i++){
        req = req.concat(`${i}/${L}/0`)
        req = req.concat(`${i}/${L}/1`)
    }
    for (var i = 0; i <= L-1; i++) {
        req = req.concat(`${L}/${i}/0`)
        req = req.concat(`${L}/${i}/1`)
    }
    for (var i in req) {
        document.getElementById("pupg").innerHTML = document.getElementById("pupg").innerHTML+gen_upg_box(req[i]) 
    }
}

function btn_name(i) {
    var U = i.split("/")
    return `P${U[1]} gain x${types[U[2]].replace("x", `P${U[0]}`)}`
}

function update_all_btns() {
    var C = document.getElementsByClassName("pres_upg")
    for (var i in C) {
        var id = C[i].id
        if (typeof(id)=="undefined") break
        var U = id.split("/")
        var B = player.upgs[id]
        C[i].innerHTML = `${btn_name(id)}
            <br>Cost: ${format(upg_cost(U.join("/"), B))} P<sup>${Math.max(U[0], U[1])}</sup>
            <br>Bought: ${format(B)}`
        var Cr = Math.max(U[0], U[1])
        var Bb = upg_cost(id, B).gte(player.prestige_currency[Cr - 1])
        C[i].style["background-color"] = color(upg_cost(id, new Decimal(0)), Bb ? 50 : 0)
        C[i].style["color"] = Bb ? "white" : "black"
    }
}

function buy_max_change() {
    document.getElementById("buy_text").innerHTML = document.getElementById("buy_text").innerHTML=="x1"?"Max":"x1"
}