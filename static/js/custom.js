/**
 * Created by Cormac Liston on 08/05/2017.
 */

$(function() {
    $('.carousel-control').hide();
    $('#hidden').hide();
    //$('#select-country select option:first').text('Select a Country');
    console.log('selecting a country');

    $('#select-country select option[value="Ireland"]').click();
});

