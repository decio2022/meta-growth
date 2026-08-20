function exp() {
    var J = new Decimal(0)
    J = J.add(player.basic_upgrades[2].div(100))
    return J
}
function log_exp() {
    var J = new Decimal(0)
    J = J.add(player.basic_upgrades[0])
    return J
}
function mul() {
    var J = new Decimal(1)
    J = J.add(player.basic_upgrades[1])
    return J
}

function get_gain() {
    var B = player.points.add(1).log10().add(1).pow(log_exp()).times(player.points.add(1).pow(exp())).times(mul())
    B = B.times(pts_prestige_booost()).times(BOOSTS[0])
    //sps boost 2
    if (player.score.gte(1e4)) {
        var M = new Decimal(1)
        for (var i in player.prestige_currency) {
            M = M.times(player.prestige_currency[i].add(1))
        }
        B = B.times(M.pow(sp_boost_2()))
    }
    return B
}


function cost_bu1(x = player.basic_upgrades[0]) { return x.pow(2).div(2).pow_base(8).times(10) }
//inverse: sqrt(log8(x/10)*2)
function cost_bu2(x = player.basic_upgrades[1]) { return x.pow_base(1.25).times(100).times(x.add(1)) }
//remove the .times(x) in a future upgrade because i dont want to deal with lambert W
//inverse: we're not caring abt time times(x) lol...
function cost_bu3(x = player.basic_upgrades[2]) {
    if (x.lte(75)) {
        return x.pow_base(1.1).pow_base(2).times(50)
    } else {
        return Decimal.dInf
    }
}
//inverse: log1.1(log2(x/50))

function bu1() {
    if (player.points.gte(cost_bu1())) {
        player.points = player.points.sub(cost_bu1());
        player.basic_upgrades[0] = player.basic_upgrades[0].add(1)
    }
}
function bu2() {
    if (player.points.gte(cost_bu2())) {
        player.points = player.points.sub(cost_bu2());
        player.basic_upgrades[1] = player.basic_upgrades[1].add(1)
    }
}
function bu3() {
    if (player.points.gte(cost_bu3())) {
        player.points = player.points.sub(cost_bu3());
        player.basic_upgrades[2] = player.basic_upgrades[2].add(1)
    }
}

function prestige(L) {
    if (player.unlocked_layers < L+1) {
        player.unlocked_layers = L+1
    }
    //L = 0: ...
    var G = prestige_gain(L)
    if (G.gte(1)) {
        if (player.prestige_currency.length <= L) { player.prestige_currency[L] = G }
        else { player.prestige_currency[L] = player.prestige_currency[L].add(G) }
        player.basic_upgrades = [new Decimal(0), new Decimal(0), new Decimal(0)]
        player.points = new Decimal(0)
        if (L >= 1) {
            for (var i = 0; i < L; i++) {
                player.prestige_currency[i] = new Decimal(0)
            }
            for (var i in player.upgs) {
                var key = i.split("/")
                if (Math.max(key[0], key[1]) <= L) {
                    player.upgs[i] = new Decimal(0)
                }
            }
        }
    }
}

const mysterious_constant_that_nobody_shall_understand_its_meaning = (Math.log10(2) * 1024 / 25)**0.5

function pres_req(L) {
    return new Decimal(L).pow_base(mysterious_constant_that_nobody_shall_understand_its_meaning).times(25).pow_base(10)
}

function prestige_gain(L) {
    var b = L >= 1 ? player.prestige_currency[L - 1] : player.points
    b = b.div(pres_req(L)).add(1).log10()
    b = b.times(BOOSTS[L + 1])
    var PB = new Decimal(1)
    for (var i = L+1; i < player.prestige_currency.length; i++){
        PB = PB.times(prestige_boost(i))
    }
    b = b.times(PB)
    b = b.pow(sp_boost())
    return b
}

function prestige_boost(L) {
    if (player.prestige_currency.length>L) {
        var b = player.prestige_currency[L]
        return b.add(1).log10().add(1).pow(2)
    }
    else {return new Decimal(1)}
}

function pts_prestige_booost() {
    var m = new Decimal(1)
    for (var i in player.prestige_currency) {
        m = m.times(prestige_boost(Number(i)))
    }
    return m
}


function update(dt) {
    //the player, dt = delta time    
    BOOSTS = calc_pp_boosts()
    player.points = player.points.add(get_gain().times(dt / 1000))
    player.total_points = player.total_points.add(get_gain().times(dt / 1000))
    
    total_boost_display()
    update_all_btns()

    if (player.prestige_currency[0].gte(1000)) {
        player.autobuy_basic = true
    }
    if (player.autobuy_basic) {
        player.basic_upgrades[0] = player.points.div(10).add(1).log(8).times(2).sqrt(2)
        player.basic_upgrades[1] = player.points.div(100).add(1).log(1.25)
        player.basic_upgrades[2] = player.points.div(50).add(1).log(2).add(1).log(1.1).min(76)
    }

    if (player.unlocked_layers >= 1) {
        for (var i = 0; i <= player.unlocked_layers; i++){
            player.prestige_currency[i] = player.prestige_currency[i].add(prestige_gain(i).times(dt/1000))
        }
    }

    player.score = player.score.add(sps().times(dt).div(1000))

    auto_logic()


}

function sps() {
    var S = player.points.add(1).log10().add(1).log10().add(1)
    for (var i in player.prestige_currency) {
        S = S.times(player.prestige_currency[i].add(1).log10().add(1).log10().add(1))
    }
    if (player.score.gte(1e5)) {
        S = S.times(sp_boost_3())
    }
    return S.sub(1).div(1000)
}

function sp_boost() { return player.score.div(30).add(1).log10().add(1) }
function sp_boost_2() { return player.score.div(1e4).add(1).log10() }
function sp_boost_3() {return player.score.div(1e5).add(1).sqrt()}


ct = Date.now()
let loop = setInterval(function () {

    var t = Date.now() - ct
    ct = Date.now()
    update(typeof (t) == "undefined" ? 0 : t)

    
},50)
