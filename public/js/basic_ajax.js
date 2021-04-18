(function ($) {

    //点击新建bill界面下面的add 按钮发送ajax请求，把bill数据加到数据库
    $('#new-bill-addbtn').click(function (event) {
        let newbill_date = $('#new-bill-date');
        let newbill_food = $('#new-bill-food');
        let newbill_entertainment = $('#new-bill-entertainment');
        let newbill_transition = $('#new-bill-transition');
        let newbill_other = $('#new-bill-other');
        let newbill_note = $('#new-bill-note');

        let requestConfig = {
            method: 'POST',
            url: '/api/bills/newBill',
            contentType: 'application/json',
            data: JSON.stringify({
                date: newbill_date.val(),
                food: newbill_food.val(),
                entertainment:newbill_entertainment.val(),
                transportation:newbill_transition.val(),
                other:newbill_other.val(),
                notes:newbill_note.val()
            })
        };

        $.ajax(requestConfig).then(function(responseMessage) {
           alert("添加成功！！！");
            newbill_date.val(''),
            newbill_food.val(''),
            newbill_entertainment.val(''),
           newbill_transition.val(''),
           newbill_other.val(''),
           newbill_note.val('')
        });
       
    });













})(window.jQuery);