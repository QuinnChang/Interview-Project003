let memberManager = {};
    memberManager.func = {};
    industrydataInMap = new Map();
    industrySeriesData =[];  
    drilldownData =[];
  
memberManager.func.init = function () {
    const url =  "https://apiservice.mol.gov.tw/OdService/download/A17050000J-000017-haT";
    $.getJSON(url,  function(data) {
        let seriesData = memberManager.func.makeSeriesData(data);
        let drilldownSeriseData = memberManager.func.makeDrilldownData(industrydataInMap);
        $('#container').highcharts({
            chart: {
                renderTo: 'container',
                type: 'pie'
            },
            title: {
                text: '勞工健康體能常模-肌力與肌耐力等級表',
                align: 'left'
                    },
            legend: {
                // enabled:false
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
                    },        
            xAxis: {
                showEmpty: false,
                type: 'category'
                    },       
            yAxis: {
                showEmpty: false
                    },
            tooltip: {
                valueSuffix: ' 筆'
        //         headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        // pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
                    },
            plotOptions: {
                    pie: {
                        dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                connectorColor: 'silver'
                            }
                        },
                    },
            series:  [{
                name: '產業別',
                colorByPoint: true,
                data: seriesData
            }],
            drilldown: {series:drilldownSeriseData}
        });
    });            
};

memberManager.func.makeSeriesData= function (data){
    for(let i=0; i<data.length; i++){
        if(industrydataInMap.has(data[i].行業別) == false)
            industrydataInMap.set(data[i].行業別,[data[i]]);
        else industrydataInMap.get(data[i].行業別).push(data[i]);
    }
    for (const industryKey of industrydataInMap.keys()){
        let obj1={
            "name" :industryKey,
            "drilldown":industryKey,
            "y":industrydataInMap.get(industryKey).length
            };
        industrySeriesData.push(obj1);
    }
    return industrySeriesData;
};


memberManager.func.makeDrilldownData = function (industrydataInMap){
    for(const industryKey of industrydataInMap.keys()){
        leveldataInMap = new Map();
        let industrydataInArr = industrydataInMap.get(industryKey);
        for(let i=0; i<industrydataInArr.length; i++){
            if(leveldataInMap.has(industrydataInArr[i].測試級別) == false)
                leveldataInMap.set(industrydataInArr[i].測試級別,[industrydataInArr[i]]); 
            else 
                leveldataInMap.get(industrydataInArr[i].測試級別).push(industrydataInArr[i]);  
        };
        levelSeriesData = new Array();   
        for(const levelKey of leveldataInMap.keys()){
            let objLevelSeries={
                "name" : levelKey,
                "drilldown": levelKey,
                "y":leveldataInMap.get(levelKey).length
            };
            levelSeriesData.push(objLevelSeries); 
            
            //Level three
            let leveldataInArr = leveldataInMap.get(levelKey);
            genderdataInMap = new Map();
            for(let i=0 ;i<leveldataInArr.length; i++){
                if (genderdataInMap.has(leveldataInArr[i].性別) == false)
                    genderdataInMap.set(leveldataInArr[i].性別,[leveldataInArr[i]]);
                else 
                    genderdataInMap.get(leveldataInArr[i].性別).push(leveldataInArr[i]); 
            };
            genderSeriesData = new Array();
            for(const genderkey of genderdataInMap.keys()){
                let objGenderSeries={
                    "name" :genderkey,
                    "drilldown":genderkey,
                    "y":genderdataInMap.get(genderkey).length
                };
                genderSeriesData.push(objGenderSeries);

                //Level four
                let genderdataInArr = genderdataInMap.get(genderkey);
                numberdataInMap = new Map();
                for(let i=0 ;i<genderdataInArr.length; i++){
                    if (numberdataInMap.has(genderdataInArr[i].測試方式) == false)
                        numberdataInMap.set(genderdataInArr[i].測試方式,[genderdataInArr[i]]);
                    else numberdataInMap.get(genderdataInArr[i].測試方式).push(genderdataInArr[i]); 
                };
                numberSeriesData = new Array();
                for(const numberKey of numberdataInMap.keys()){
                    let objNumberSeries={
                        "name" :numberKey,
                        "drilldown":numberKey,
                        "y":numberdataInMap.get(numberKey).length
                    };
                numberSeriesData.push(objNumberSeries);
                }
                let objNumber={
                    "type" :'column',
                    "id":genderkey,
                    "data":numberSeriesData
                };
                drilldownData.push(objNumber);    
            }
            let objGender={
                "type" :'column',
                "id":levelKey,
                "data":genderSeriesData
            };
            drilldownData.push(objGender);
        };
        let objLevel={
            "type" :'pie',
            "id":industryKey,
            "data":levelSeriesData
        };
        drilldownData.push(objLevel);
    }; 
    return drilldownData;
};


// memberManager.func.makeNumberSeriesData =function() {
//     for(const genderkey of genderdataInMap.keys()){
//         let genderdataInArr = genderdataInMap.get(genderkey);
//         numberdataInMap = new Map();
//         for(let i=0; i<genderdataInArr.length; i++){
//             if(numberdataInMap.has(genderdataInArr[i].測試方式) == false)
//                 numberdataInMap.set(genderdataInArr[i].測試方式,[genderdataInArr[i]]);
//             else numberdataInMap.get(genderdataInArr[i].測試方式).push(genderdataInArr[i]);
//         }
//         let obj={
//             "type" :'column',
//             "id":genderkey,
//             "data":numberSeriesData
//         };
//         drilldownDataThree.push(obj);    
//     }
//     console.log(numberdataInMap)
//     for(const key of numberdataInMap.keys()){
//         let obj={
//                 "name" :key,
//                 "drilldown":key,
//                 "y":numberdataInMap.get(key).length
//             };
//         numberSeriesData.push(obj);
      
//     };
//     return  drilldownDataThree;
// }

// series: [{
//     name: 'Brands',
//     colorByPoint: true,
//     data: 
//     [
//       {
//           name :'Chrome',
//           drilldown: 'Chrome_down',
//           y: 30
//       },
//       {
//           name :'Firefox',
//           drilldown: 'Firefox_down',
//           y: 20
//       }, 
//       {
//           name :'IE',
//           y: 10
//       }
//    ]
// }],
// drilldown: {
//     series: 
//     [
//         {
//         type: 'column',
//         id: 'Chrome_down',
//         data: 
//         [
//           {
//               name :'kid',
//               drilldown: 'b',
//               y: 5
//           },
//           {
//               name :'young',
//               y: 15
//             },
//           {
//               name :'old',
//               y: 25
//             }
//         ]
//         },
//       {
//         type: 'column',
//         id: 'Firefox_down',
//         data: 
//         [
//           {
//               name :'kid',
//               drilldown: 'b',
//               y: 5
//           },
//           {
//               name :'young',
//               y: 15
//             },
//           {
//               name :'old',
//               y: 25
//             }
//         ]
//         },
//       {
//         type: 'pie',
//         id: 'b',
//         data: [
//             {
//               name : 'girl',
//               y: 100
//           },
//           {
//               name : 'boy',
//               y: 80
//           }
//         ]
//         }
//     ]
// }
// });
// var mainObj = {};
// mainObj.type = 'pie';
// mainObj.id = "a";
// mainObj.data = [];
// var level1obj = {};
// level1obj.name = 'Quinn';
// level1obj.y=8;
// mainObj.data.push(level1obj);
















