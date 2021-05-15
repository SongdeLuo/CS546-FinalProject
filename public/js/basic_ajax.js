(function($) {
    var billshow = $("#bill-show");
    var newBillChart;
    const changeTimeOption = (dateTs) => {
        const userid_form_page = $("#p_userId");
        const requestConfig = {
            method: 'GET',
            url: '/api/bills/getBillChart',
            contentType: 'application/json',
            data: {
                userId: userid_form_page.html(),
                dateTs
            }
        };

        $("#login_VerificationCode").click(function() {
            $(this)[0].src = 'http://www.localhost:3000/api/users/login_img_code?' + Math.random()
        })
        $("#addTestBtn").on('click', function(event) {
            console.log('new-bill-addTestBtn')
            const dateFormat = (fmt, date) => {
                let ret;
                const opt = {
                    "Y+": date.getFullYear().toString(),
                    "m+": (date.getMonth() + 1).toString(),
                    "d+": date.getDate().toString(),
                    "H+": date.getHours().toString(),
                    "M+": date.getMinutes().toString(),
                    "S+": date.getSeconds().toString()
                };
                for (let k in opt) {
                    ret = new RegExp("(" + k + ")").exec(fmt);
                    if (ret) {
                        fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
                    };
                };
                return fmt;
            }
            const sopeRandom = (min, max) => {
                if (!max) {
                    return Math.round(Math.random() * min)
                } else {
                    return (Math.random() * (max - min)) + min
                }
            }
            const today = new Date().getTime()
            const lastTwoMonth = today - 24 * 60 * 3600 * 1000 * 2
            const newBillList = [...Array(10).keys()].map((item, index) => {
                return {
                    date: dateFormat('YYYY-mm-dd', new Date(sopeRandom(lastTwoMonth, today))),
                    food: sopeRandom(100),
                    entertainment: sopeRandom(100),
                    transition: sopeRandom(100),
                    other: sopeRandom(100),
                    note: `This is a random record ${index}`
                }
            })

            $.ajax({
                method: "POST",
                url: "/api/bills/newBill",
                contentType: "application/json",
                data: JSON.stringify(newBillList),
            }).then(res => {
                changeTimeOption(Date.parse(new Date()) - 1000 * 60 * 60 * 24 * 7)
            })
        })



        $.ajax(requestConfig).then(res => {
            window.chartData = res.data
            newBillChart = echarts.init(document.getElementById('chartContainer01'));
            newBillChart.clear()
            const names = ['food', 'entertainment', 'transportation', 'other', 'total']
            const series = names.map(name => {
                console.log(name)
                const data = window.chartData.map(item => {
                    return item[name]
                })
                return {
                    name,
                    type: 'bar',
                    data
                }
            })
            const xData = window.chartData.map(item => {
                return item.date
            })
            const option = {
                title: {
                    text: ''
                },
                tooltip: {},
                series,
                legend: { data: names },
                yAxis: {},
                xAxis: { data: xData }
            };
            newBillChart.setOption(option);
        });

    }
    changeTimeOption(Date.parse(new Date()) - 1000 * 60 * 60 * 24 * 7)

    $('#billTimeOption').change(function() {
        if (this.value == 'week') {
            var dateTs = Date.parse(new Date()) - 1000 * 60 * 60 * 24 * 7;
        } else if (this.value == 'month') {
            var dateTs = Date.parse(new Date()) - 1000 * 60 * 60 * 24 * 30;
        } else if (this.value == 'year') {
            var dateTs = Date.parse(new Date()) - 1000 * 60 * 60 * 24 * 365;
        }
        changeTimeOption(dateTs)
    })


    $("#new-bill-addbtn").click(function(event) {
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

        $.ajax(requestConfig).then(function(responseMessage) {
            alert("Added Successfully！！！");
            console.log(JSON.stringify(responseMessage));
            var bill_data = $(responseMessage);

            newbill_date.val(""),
                newbill_food.val(""),
                newbill_entertainment.val(""),
                newbill_transition.val(""),
                newbill_other.val(""),
                newbill_note.val(""),
                billshow.empty();

            changeTimeOption(Date.parse(new Date()) - 1000 * 60 * 60 * 24 * 7)
        }, rej => {
            alert(rej.responseJSON.error)
        })
    });

    $('#billTypeOption').change(function() {
        const oldOption = newBillChart.getOption()
        const oldSeries = oldOption.series
        let newSeries;
        if (this.value === 'bar' || this.value === 'line') {
            newSeries = oldSeries.map((item, index) => {
                return {
                    ...item,
                    type: this.value,
                    stack: `stack${index}`
                }
            })
        } else if (this.value === 'stack') {
            const temp = []
            oldSeries.forEach(item => {
                if (item.name !== 'total') {
                    temp.push({
                        ...item,
                        type: 'bar',
                        stack: 'stack'
                    })
                }
            })
            newSeries = temp
        }
        newBillChart.clear()
        newBillChart.setOption({
            ...oldOption,
            series: newSeries
        })
    })

})(window.jQuery)