$(function(){
    $("#form-total").steps({
        headerTag: "h2",
        bodyTag: "section",
        transitionEffect: "fade",
        enableAllSteps: true,
        autoFocus: true,
        transitionEffectSpeed: 500,
        titleTemplate : '<div class="title">#title#</div>',
        labels: {
            previous : '返回',
            next : '繼續',
            finish : '上傳',
            current : ''
        },
        onStepChanging: function (event, currentIndex, newIndex) { 
            var fullname = $('#first_name').val() + ' ' + $('#last_name').val();
            var types = $('#types').val();
            var day = $('#day').val();
            var address = $('#address').val();
            var id = $('#id').val();
            var birth = $('#birth').val();
            var gender = $('#gender').val();
            var phone = $('#phone').val();
            var video = $('#video').val();

            $('#fullname-val').text(fullname);
            $('#types-val').text(types);
            $('#day-val').text(day);
            $('#video-val').text(video);
            $('#address-val').text(address);
            $('#id-val').text(id);
            $('#birth-val').text(birth);
            $('#gender-val').text(gender);
            $('#phone-val').text(phone);

            return true;
        }
    });
    $("#day").datepicker({
        dateFormat: "yy/mm/dd",
        showOn: "both",
        buttonText : '<i class="zmdi zmdi-chevron-down"></i>',
    });
    $("#birth").datepicker({
        dateFormat: "yy/mm/dd",
        showOn: "both",
        buttonText : '<i class="zmdi zmdi-chevron-down"></i>',
    });
});
