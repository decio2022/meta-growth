var app = new Vue({
    el: "#app",
    data: {
        player,
        format,
        format_time,

        mul,
        exp,
        log_exp,
        get_gain,

        cost_bu1,
        cost_bu2,
        cost_bu3,

        prestige_gain,
        prestige_boost,
        pres_req,

        upg_cost,

        auto_cost,
        sps,
        display_extra_boosts
    }
}
)

gen_all_upgs(player.page)