(function($) {

    var billshow = $('#bill-show');

    //点击新建bill界面下面的add 按钮发送ajax请求，把bill数据加到数据库
    $('#new-bill-addbtn').click(function(event) {
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
                entertainment: newbill_entertainment.val(),
                transportation: newbill_transition.val(),
                other: newbill_other.val(),
                notes: newbill_note.val()
            })
        };

        $.ajax(requestConfig).then(function(responseMessage) {
            alert("添加成功！！！");
            newbill_date.val(''),
                newbill_food.val(''),
                newbill_entertainment.val(''),
                newbill_transition.val(''),
                newbill_other.val(''),
                newbill_note.val(''),
                billshow.empty();
        });
        billshow.append(newElement);
    });

    $('#bill-infor-year').click(function(event) {

        let requestConfig = {
            method: 'GET',
            url: '/api/bills/getBillyear',
            contentType: 'application/json'
        };

        $.ajax(requestConfig).then(function(responseMessage) {
            // console.log(responseMessage);
            let newElement = $(responseMessage);
            if (newElement) {
                billshow.empty();
            }
            billshow.append(newElement);
        });
    });

    $('#bill-infor-month').click(function(event) {

        let requestConfig = {
            method: 'GET',
            url: '/api/bills/getBillmonth',
            contentType: 'application/json'
        };

        $.ajax(requestConfig).then(function(responseMessage) {
            // console.log(responseMessage);
            let newElement = $(responseMessage);
            if (newElement) {
                billshow.empty();
            }
            billshow.append(newElement);
        });
    });

    $('#bill-infor-days').click(function(event) {

        let requestConfig = {
            method: 'GET',
            url: '/api/bills/getBillday',
            contentType: 'application/json'
        };

        $.ajax(requestConfig).then(function(responseMessage) {
            // console.log(responseMessage);
            let newElement = $(responseMessage);
            if (newElement) {
                billshow.empty();
            }
            billshow.append(newElement);
        });
    });

//切换三个不同的图表，ajax向后台请求数据，展示在三个不同的图表中。
    $("#heart").on("click", function() {
 
        $('.heart-car').show();
        $('.sleep-car').hide();
        $('.breathe-car').hide();
        $('.sport-car').hide();
 
    });
 
    $("#breathe").on("click", function() {
 
        $('.heart-car').hide();
        $('.sleep-car').hide();
        $('.breathe-car').show();
        $('.sport-car').hide();
    });
    $("#sport").on("click", function() {
 
        $('.heart-car').hide();
        $('.sleep-car').hide();
        $('.breathe-car').hide();
        $('.sport-car').show();
 
    });
    $("#sleep").on("click", function() {
 
        $('.heart-car').hide();
        $('.sleep-car').show();
        $('.breathe-car').hide();
        $('.sport-car').hide();
 
    });


    

})(window.jQuery);