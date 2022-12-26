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
            if(types == 'finger tap'){
                types = '手指拍打';
            }
            else if(types == 'palm grip'){
                types = '手掌握合';
            }
            else if(types == 'forearm rotation'){
                types = '前臂迴旋';
            }
            else{
                types = '抬腳';
            }
            var day = $('#day').val();
            var address = $('#address').val();
            var id = $('#id').val();
            var birth = $('#birth').val();
            var gender = $('#gender').val();
            if(gender == 'Male'){
                gender = '男';
            }
            else{
                gender = '女';
            }
            var phone = $('#phone').val();
            var file = $("#video").val();
            var fileName = getFileName(file);
            function getFileName(o){
                var pos=o.lastIndexOf("\\");
                return o.substring(pos+1);  
            }

            $('#fullname-val').text(fullname);
            $('#types-val').text(types);
            $('#day-val').text(day);
            $('#video-val').text(fileName);
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
    $("#video").on('change','.video', function(){
        var names = [];
        var length = $(this).get(0).files.length;
         for (var i = 0; i < $(this).get(0).files.length; ++i) {
             names.push($(this).get(0).files[i].name);
         }
         // $("input[name=file]").val(names);
         if(length>2){
           var fileName = names.join(', ');
           $(this).closest('.form-group').find('.form-control').attr("value",length+" files selected");
         }
         else{
             $(this).closest('.form-group').find('.form-control').attr("value",names);
         }
    });
});
