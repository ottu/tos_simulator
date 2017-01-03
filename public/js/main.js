;(function(){
    $("select").select2();

    var bonusTable = [
        { "lv": 500, "bonus": 185, "step": 1 },
        { "lv": 300, "bonus":  85, "step": 2 },
        { "lv": 150, "bonus":  35, "step": 3 },
        { "lv":  50, "bonus":  10, "step": 4 },
        { "lv":   0, "bonus":   0, "step": 5 }
    ];

    function calcTotal(identify){
        console.log("calcTotal");

        var preID = "#stats_" + identify;
        var pointID = preID + "_point";
        var baseID = preID + "_base";
        var bonusID = preID + "_bonus";
        var totalID = preID + "_total";

        var point = Number($(pointID).val());
        var base = Number($(baseID).val());

        var temp = point + base;

        var i = 0;
        var bonus = 0;
        var sum = 0;
        while(i<bonusTable.length) {
            var table = bonusTable[i];
            if (temp<table["lv"]) {
                i = i + 1;
                continue;
            };

            var rest = temp - table["lv"];
            var step = table["step"];
            bonus = table["bonus"] + Math.floor( rest / step );

            break;
        };

        var totalStat = point + base + bonus;

        // rank status bonus
        if (["str", "int"].indexOf(identify) >= 0) {
            var rank = Number($("#stats_rank").val());
            var coefficient = 1 + ( (rank-1) * 0.1 );

            var additionalBonus = Math.floor(totalStat * coefficient) - totalStat;
            bonus += additionalBonus;
            totalStat += additionalBonus;
        }

        $(bonusID).val(bonus);
        $(totalID).val(totalStat);
    };

    function calcStatsPoint() {
        console.log("calcStatsPoint");

        var strength = $("#stats_str_point").val();
        var constitution = $("#stats_con_point").val();
        var intelligence = $("#stats_int_point").val();
        var spirit = $("#stats_spr_point").val();
        var dexterity = $("#stats_dex_point").val();

        var lv = Number($("#stats_level").val());
        var asp = Number($("#stats_additional_status_point").val());

        $("#stats_point").val(
            lv - 1 + asp -
            strength -
            constitution -
            intelligence -
            spirit -
            dexterity
        );
    }

    function calcParameters() {
        console.log("calcParameters");
        // stats total
        var strength = Number($("#stats_str_total").val());
        var constitution = Number($("#stats_con_total").val());
        var intelligence = Number($("#stats_int_total").val());
        var spirit = Number($("#stats_spr_total").val());
        var dexterity = Number($("#stats_dex_total").val());

        var job_opt = $("#stats_job option:selected");
        var lv_input = $("#stats_level");
        var hp_mod = Number(job_opt.data("hp"));
        var sp_mod = Number(job_opt.data("sp"));
        var lv = Number(lv_input.val());

        // HP
        var hp = hp_mod * ((lv - 1) * 17) + constitution * 85;
        $("#hp_param").val(Math.floor(hp));

        // SP
        // TODO: Buggy
        var sp = sp_mod * ((lv - 1) * 6.7) + spirit * 13;
        if (job_opt.data("id") == 4) {
            sp = sp + lv * 1.675;
        }
        $("#sp_param").val(Math.floor(sp));

        // HP Recovery
        // TODO: Buggy
        //var hp_recover = lv * 0.5 + constitution;
        var hp_recover = lv * 1.6 + constitution;
        $("#hp_recover_param").val(Math.floor(hp_recover));

        // SP Recover
        // TODO: Buggy
        var sp_recover = lv * 0.5 + spirit;
        if (job_opt.data("id") == 4) {
            sp_recover = sp_recover + lv * 0.25;
        }
        $("#sp_recover_param").val(Math.floor(sp_recover));

        // Physical Attack
        var pa = strength + lv;
        $("#physical_attack_param").val(pa);

        // Magic Attack
        var ma = intelligence + lv;
        $("#magic_attack_param").val(ma);

        // Physical Defence
        // TODO: Buggy
        var pd = Math.floor(lv/2) + Math.floor(lv/4);
        $("#physical_defence_param").val(pd);

        // Magic Defence
        // TODO: Buggy
        var md = Math.floor(lv/2) + Math.floor(lv/4) + Math.floor(spirit/5);
        $("#magic_defence_param").val(md);

        // Accuracy
        var acc = dexterity + lv;
        if (job_opt.data("id") == 3) {
            acc = acc + Math.floor( (lv + 4) / 4 );
        }
        $("#accuracy_param").val(acc);

        // Evasion
        var ev = dexterity + lv;
        if (job_opt.data("id") == 3) {
            ev = ev + Math.floor(lv / 8);
        }
        $("#evasion_param").val(ev);

        // Critical Attack
        var ca = strength;
        $("#critical_attack_param").val(ca);

        // Critical Rate
        var cra = dexterity;
        if (job_opt.data("id") == 3) {
            cra = cra + Math.floor(lv / 5);
        }
        $("#critical_rate_param").val(cra);

        // Critical Resistance
        var cre = constitution;
        $("#critical_resistance_param").val(cre);

        // Block Penetration
        var bp = Math.floor(lv * 0.5) + strength;
        $("#block_penetration").val(bp);

        // Block

        // Weight Limit
        var wl = 5000 + strength * 5 + constitution * 5;
        $("#weight_limit_param").val(wl);
    }

    function resetStatPoints() {
        console.log("resetStatPoints");

        $("#stats_str_point").val(0).change();
        $("#stats_con_point").val(0).change();
        $("#stats_int_point").val(0).change();
        $("#stats_spr_point").val(0).change();
        $("#stats_dex_point").val(0).change();

        calcParameters();
    }

    $("#stats_job").change(function(){
        var opt = $("#stats_job option:selected");

        $("#stats_level").val(1);
        $("#stats_point").val(0);
        $("#stats_str_base").val(opt.data("str"));
        $("#stats_con_base").val(opt.data("con"));
        $("#stats_int_base").val(opt.data("int"));
        $("#stats_spr_base").val(opt.data("spr"));
        $("#stats_dex_base").val(opt.data("dex"));

        resetStatPoints();
    });

    $("#stats_rank").change(function(){
        $("#stats_str_point").change();
        $("#stats_int_point").change();
    });

    $("#stats_level").change(function(){
        resetStatPoints();
    });

    $("#stats_additional_status_point").change(function(){
        resetStatPoints();
    })

    function calcTotalCallback(name) {
        console.log("calcTotalCallback");
        console.log(name);
        calcTotal(name);
        calcStatsPoint();
        calcParameters();
    }

    $("#stats_str_point").change(function(){calcTotalCallback("str")});
    $("#stats_con_point").change(function(){calcTotalCallback("con")});
    $("#stats_int_point").change(function(){calcTotalCallback("int")});
    $("#stats_spr_point").change(function(){calcTotalCallback("spr")});
    $("#stats_dex_point").change(function(){calcTotalCallback("dex")});

    $("#stats_rank").val(1);
    $("#stats_level").val(1);
    $("#stats_additional_status_point").val(0);
    $("#stats_job").change();
})(jQuery)
