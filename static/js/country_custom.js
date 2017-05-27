/**
 * Created by Cormac Liston on 08/05/2017.
 */

function hideGraphs(){
    console.log('hiding graphs');
    $('.init-hide').hide();
    $('select.dc-select-menu').on('change',function(){
        console.log('selection changed');
        if($('select.dc-select-menu').val()==''){
            $('.init-hide').hide();
        }else{
            $('.init-hide').show();
        }
    });
}

$(function() {
    //  HIDE INDIVIDUAL LINE CHARTS
    $('#hidden').remove();
    //  HIDE GRAPHS ON PAGE LOAD UNTIL A COUNTRY IS CHOSEN
    /*$('.init-hide').hide();
    $('select.dc-select-menu').on('change',function(){
        console.log('selection changed');
        if($('select.dc-select-menu').val()==''){
            $('.init-hide').hide();
        }else{
            $('.init-hide').show();
        }
    });*/

});

