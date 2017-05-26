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

    /*setTimeout(function() {
        console.log('hiding after 2 secs');
        hideGraphs();
    }, 2000);*/

   // $('.init-hide').hide();
    $('select.dc-select-menu').on('change',function(){
        console.log('selection changed');
        if($('select.dc-select-menu').val()==''){
            $('.init-hide').hide();
        }else{
            $('.init-hide').show();
        }
    });

    /*$('.init-hide').hide();
    $('select.dc-select-menu').change(function(){
        if($('select.dc-select-menu').val()==''){
            console.log('stay hidden');
            $('.init-hide').hide();
        }else if($('select.dc-select-menu').val()=='Ireland'){
            console.log('show');
            $('.init-hide').show();
        }
    });*/

});

