(function ($) {
  var billshow = $("#bill-show");
  var myChart = echarts.init(document.getElementById("main"));
  //点击新建bill界面下面的add 按钮发送ajax请求，把bill数据加到数据库
  $("#new-bill-addbtn").click(function (event) {
    let newbill_date = $("#new-bill-date");
    let newbill_food = $("#new-bill-food");
    let newbill_entertainment = $("#new-bill-entertainment");
    let newbill_transition = $("#new-bill-transition");
    let newbill_other = $("#new-bill-other");
    let newbill_note = $("#new-bill-note");

    let requestConfig = {
      method: "POST",
      url: "/api/bills/newBill",
      contentType: "application/json",

      data: JSON.stringify({
        date: newbill_date.val(),
        food: newbill_food.val(),
        entertainment: newbill_entertainment.val(),
        transportation: newbill_transition.val(),
        other: newbill_other.val(),
        notes: newbill_note.val(),
      }),
    };

    $.ajax(requestConfig).then(function (responseMessage) {
      alert("添加成功！！！");
      console.log(JSON.stringify(responseMessage));
      var bill_data = $(responseMessage);
      myChart.setOption({
        legend: {},
        tooltip: {},
        dataset: { source: bill_data[0], source: bill_data[1] },

        // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
        xAxis: { type: "category" },
        // 声明一个 Y 轴，数值轴。
        yAxis: {},
        // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
        series: [
          { type: "bar" },
          { type: "bar" },
          { type: "bar" },
          { type: "bar" },
        ],
      });

      newbill_date.val(""),
        newbill_food.val(""),
        newbill_entertainment.val(""),
        newbill_transition.val(""),
        newbill_other.val(""),
        newbill_note.val(""),
        billshow.empty();
    });
    //billshow.append(newElement);
    // $.ajax({
        //     type: "get",
        //     url: '/api/bills/newBill',
        //     success: function (data) {
        //         var bill = $(data);
        //         console.log(bill);
                
                
        //     }
        // });
  });

  // $("#bill-infor-year").click(function (event) {
  //   let requestConfig = {
  //     method: "GET",
  //     url: "/api/bills/getBillyear",
  //     contentType: "application/json",
  //   };

  //   $.ajax(requestConfig).then(function (responseMessage) {
  //     // console.log(responseMessage);
  //     let newElement = $(responseMessage);
  //     if (newElement) {
  //       billshow.empty();
  //       echarts.init(document.getElementById("main")).setOption({
  //         legend: {},
  //         tooltip: {},
  //         dataset: {
  //           // 提供一份数据。
  //           // source: [
  //           //     ['bill', 'first day', 'second day', 'third day'],
  //           //     ['Food', 43.3, 85.8, 93.7],
  //           //     ['Entertainment', 83.1, 73.4, 55.1],
  //           //     ['Transition', 86.4, 65.2, 82.5],
  //           //     ['Other', 72.4, 53.9, 39.1]
  //           // ]
  //           source: [
  //             ["bill", "Food", "Entertainment", "Transition", "Other"],
  //             newElement[0],
  //             //['一月', 43.3, 85.8, 93.7,0],
  //             newElement[1],
  //             //['二月', 83.1, 73.4,0, 55.1],
  //             newElement[2],
  //             //['third day', 86.4, 65.2, 78,82.5],
  //             newElement[3],
  //             //['first day', 43.3, 85.8, 93.7,0],
  //             newElement[4],
  //             //['second day', 83.1, 73.4,0, 55.1],
  //             newElement[5],
  //             //['third day', 86.4, 65.2, 78,82.5],
  //             newElement[6],
  //             //['first day', 43.3, 85.8, 93.7,0],
  //             newElement[7],
  //             //['second day', 83.1, 73.4,0, 55.1],
  //             newElement[8],
  //             //['third day', 86.4, 65.2, 78,82.5],
  //             newElement[9],
  //             //['first day', 43.3, 85.8, 93.7,0],
  //             newElement[10],
  //             //['second day', 83.1, 73.4,0, 55.1],
  //             newElement[11],
  //             //['third day', 86.4, 65.2, 78,82.5],
  //           ],
  //         }, // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
  //         xAxis: { type: "category" }, // 声明一个 Y 轴，数值轴。
  //         yAxis: {}, // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
  //         series: [
  //           { type: "bar" },
  //           { type: "bar" },
  //           { type: "bar" },
  //           { type: "bar" },
  //         ],
  //       });
  //     }
  //   });
  // });

  // $("#bill-infor-month").click(function (event) {
  //   let requestConfig = {
  //     method: "GET",
  //     url: "/api/bills/getBillmonth",
  //     contentType: "application/json",
  //   };

  //   $.ajax(requestConfig).then(function (responseMessage) {
  //     // console.log(responseMessage);
  //     let newElement = $(responseMessage);
  //     if (newElement) {
  //       billshow.empty();
  //       echarts.init(document.getElementById("main")).setOption({
  //         legend: {},
  //         tooltip: {},
  //         dataset: {
  //           // 提供一份数据。
  //           // source: [
  //           //     ['bill', 'first day', 'second day', 'third day'],
  //           //     ['Food', 43.3, 85.8, 93.7],
  //           //     ['Entertainment', 83.1, 73.4, 55.1],
  //           //     ['Transition', 86.4, 65.2, 82.5],
  //           //     ['Other', 72.4, 53.9, 39.1]
  //           // ]
  //           source: [
  //             ["bill", "Food", "Entertainment", "Transition", "Other"],
  //             newElement[0],
  //             //['first week', 43.3, 85.8, 93.7,0],
  //             newElement[1],
  //             //['second week', 83.1, 73.4,0, 55.1],
  //             newElement[2],
  //             //['third week', 86.4, 65.2, 78,82.5],
  //             newElement[3],
  //             //['forth week', 86.4, 65.2, 78,82.5],
  //           ],
  //         }, // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
  //         xAxis: { type: "category" }, // 声明一个 Y 轴，数值轴。
  //         yAxis: {}, // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
  //         series: [
  //           { type: "bar" },
  //           { type: "bar" },
  //           { type: "bar" },
  //           { type: "bar" },
  //         ],
  //       });
  //     }
  //   });
  // });

  $("#bill-infor-weeks").click(function (event) {
    let requestConfig = {
      method: "GET",
      url: "/api/bills/getBillday",
      contentType: "application/json",
    };

    $.ajax(requestConfig).then(function (responseMessage) {
      // console.log(responseMessage);
      let newElement = $(responseMessage);
      if (newElement) {
        billshow.empty();
        echarts.init(document.getElementById("main")).setOption({
          legend: {},
          tooltip: {},
          dataset: {
            // 提供一份数据。
            // source: [
            //     ['bill',11],
            //     ['Food', 43.3],
            //     ['Entertainment', 83.1],
            //     ['Transition', 86.4],
            //     ['Other', 72.4]
            // ]
            source: [
              ["bill", "Food", "Entertainment", "Transition", "Other"],
              newElement[0],
              //['first day', 43.3, 85.8, 93.7,0],
              newElement[1],
              //['second day', 83.1, 73.4,0, 55.1],
              newElement[2],
              //['third day', 86.4, 65.2, 78,82.5],
            ],
          }, // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
          xAxis: { type: "category" }, // 声明一个 Y 轴，数值轴。
          yAxis: {}, // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
          series: [
            { type: "bar" },
            { type: "bar" },
            { type: "bar" },
            { type: "bar" },
          ],
        });
      }
    });
  });

  $('#bill_option').change(function(){
    //console.log(this.value);
    //alert(this.value);
    if(this.value == 'week'){
    var  dateTs = Date.parse(new Date()) - 1000*60*60*24*7;
      //alert(dateTs);
      //alert("week  check");
    }else if(this.value == 'month'){
      var  dateTs = Date.parse(new Date()) - 1000*60*60*24*30;
     // alert(dateTs);
     // alert("month check");
    }else if(this.value == 'year'){
      var  dateTs = Date.parse(new Date()) - 1000*60*60*24*365;
      //alert(dateTs);
     // alert("year check")
    }
    let userid_form_page = $("#p_userId");
    alert(userid_form_page.html());
    let requestConfig = {
      method:'GET',
      url:'/api/bills/getBillChart',
      contentType:'application/json',
      data:{
          userId: userid_form_page.html(),
          dateTs: dateTs
      }
  };
  $.ajax(requestConfig).then(res =>{
    // console.log("后端已经返回数据看看这里拿到了吗");
    // console.log(res)
    // window.chartData = res
    // const chart = $('#LAST MONTH')
    // //let chartCells = ''
    // res.forEach(item => {
    //   ['bill', 'Food', 'Entertainment', 'Other'],
    //   [, 43.3, 85.8, 93.7],
    //   ['', 83.1, 73.4, 55.1],
    //   ['Transition', 86.4, 65.2, 82.5],
    //    ['', 72.4, 53.9, 39.1]
    // })
   console.log(responseMessage);   //这里的console 是网页控制台打印
});

  })

})(window.jQuery)
