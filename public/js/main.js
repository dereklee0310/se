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
            var fullname = $('#fullname').val();
            var type = $('#type').val();
            if(type == 't23'){
                type = '手指拍打';
            }
            else if(type == 't24'){
                type = '手掌握合';
            }
            else if(type == 't25'){
                type = '前臂迴旋';
            }
            else{
                type = '抬腳';
            }
            var taken_date = $('#taken_date').val();
            var taken_location = $('#taken_location').val();
            var pid = $('#pid').val();
            var birth = $('#birth').val();
            var gender = $('#gender').val();
            var phone = $('#phone').val();
            var file = $("#video").val();
            var fileName = getFileName(file);
            function getFileName(o){
                var pos=o.lastIndexOf("\\");
                return o.substring(pos+1);  
            }

            $('#fullname-val').text(fullname);
            $('#type-val').text(type);
            $('#taken_date-val').text(taken_date);
            $('#video-val').text(fileName);
            $('#taken_location-val').text(taken_location);
            $('#pid-val').text(pid);
            $('#birth-val').text(birth);
            $('#gender-val').text(gender);
            $('#phone-val').text(phone);

            return true;
        }
    });
    $("#taken_date").datepicker({
        dateFormat: "yy-mm-dd",
        showOn: "both",
        buttonText : '<i class="zmdi zmdi-chevron-down"></i>',
    });
    $("#birth").datepicker({
        dateFormat: "yy-mm-dd",
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
