/**
 * Created by Cormac Liston on 08/05/2017.
 */

/**
 * Function tidies up the text displayed on the select dropdown for Year
 */
function changeYearSelectText(){
    console.log('changing text');
    var optionArr = $('#menu-select').children('select').children('option');
    $(optionArr ).each(function(){
        var txt = $(this).text();
        if(txt!=="Select all"){
            txt = txt.substring(0,4);
        }
        $(this).text(txt);
    });
}

$(function() {
    $('#menu-select').on('click',changeYearSelectText);
});

