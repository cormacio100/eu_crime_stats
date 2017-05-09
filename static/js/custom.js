/**
 * Created by Cormac Liston on 08/05/2017.
 */

$(function() {
    console.log('page loading');

    $('#menu-select').children('select').on('change',function(){
        console.log('selection made');
        console.log( $(this).find(":selected").val() );
        //yearDim.filterExact("2010");
        //print_filter(indexedData);
    });
});

