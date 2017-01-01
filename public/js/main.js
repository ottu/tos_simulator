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

        $(bonusID).val(bonus);
        $(totalID).val(point + base + bonus);
    };

    function calcStatsPoint() {
        var strength = $("#stats_str_point").val();
        var constitution = $("#stats_con_point").val();
        var intelligence = $("#stats_int_point").val();
        var spirit = $("#stats_spr_point").val();
        var dexterity = $("#stats_dex_point").val();

        $("#stats_point").val(
            $("#stats_level").val() - 1 -
            strength -
            constitution -
            intelligence -
            spirit -
            dexterity
        );
    }

    function resetStatPoints() {
        $("#stats_str_point").val(0).change();
        $("#stats_con_point").val(0).change();
        $("#stats_int_point").val(0).change();
        $("#stats_spr_point").val(0).change();
        $("#stats_dex_point").val(0).change();

        calcTotal("str");
        calcTotal("con");
        calcTotal("int");
        calcTotal("spr");
        calcTotal("dex");
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

    $("#stats_level").change(function(){
        var val = $(this).val();
        $("#stats_point").val(val-1);

        resetStatPoints();
    });

    $("#stats_str_point").change(function(){
        calcTotal("str");
        calcStatsPoint();
    });
    $("#stats_con_point").change(function(){
        calcTotal("con");
        calcStatsPoint();
    });
    $("#stats_int_point").change(function(){
        calcTotal("int");
        calcStatsPoint();
    });
    $("#stats_spr_point").change(function(){
        calcTotal("spr");
        calcStatsPoint();
    });
    $("#stats_dex_point").change(function(){
        calcTotal("dex");
        calcStatsPoint();
    });

    $("#stats_job").change();
})(jQuery)
