/**
 * Created by madongfang on 2016/9/1.
 */

appControllers = angular.module("appControllers", ["ui.router"]);

appControllers.controller("MainController", ["$scope", "$state",
    function ($scope, $state) {
    }
]);

appControllers.controller("StocksController", ["$scope", "ApiStock", "$cacheFactory",
    function ($scope, ApiStock, $cacheFactory) {
        var stockCache = $cacheFactory.get("StockCache");
        if (!stockCache)
        {
            stockCache = $cacheFactory("StockCache");
        }

        $scope.stocks = stockCache.get("stocks");
        $scope.startYear = stockCache.get("startYear");
        $scope.minGrowthRate = stockCache.get("minGrowthRate");

        $scope.search = function ()
        {
            ApiStock.query(
                {
                    startYear:$scope.startYear,
                    minGrowthRate:$scope.minGrowthRate
                },
                function (data)
                {
                    $scope.stocks = data;
                    stockCache.put("stocks", $scope.stocks);
                    stockCache.put("startYear", $scope.startYear);
                    stockCache.put("minGrowthRate", $scope.minGrowthRate);
                },
                function (response) {
                    alert(response.data.returnMsg);
                }
            );
        };

    }
]);

appControllers.controller("StockInfoController", ["$scope", "$state", "$stateParams",
    "ApiEcharts", "ApiStock", "$cacheFactory",
    function ($scope, $state, $stateParams, ApiEcharts, ApiStock, $cacheFactory) {
        var stockInfoCache = $cacheFactory.get("StockInfoCache");
        if (!stockInfoCache)
        {
            stockInfoCache = $cacheFactory("StockInfoCache");
        }

        $scope.select = {beginDate:null, endDate:null};
        $scope.peEchartsOption =
        {
            title:{
                show: true,
                text: '',
                x:'center',
                textStyle:{
                    color:'#00f'
                }
            },
            legend: {
                data:[{name:'市盈率'},{name:'市营率'}],
                x:'left'
            },
            tooltip : {
                show: true
            },
            xAxis : [{type : 'time'}],
            yAxis : [{
                type : 'value'
            }],
            series : [
                {
                    name : '市盈率',
                    type : 'line',
                    symbolSize:1,
                    data : []
                },
                {
                    name : '市营率',
                    type : 'line',
                    symbolSize:1,
                    data : []
                }]
        };

        $scope.profitEchartsOption =
        {
            title:{
                show: true,
                text: '',
                x:'center',
                textStyle:{
                    color:'#0f0'
                }
            },
            legend: {
                data:[{name:'净利润'},{name:'营业利润'}]
            },
            tooltip : {
                show: true
            },
            xAxis : [{
                type : 'category',
                data: []
            }],
            yAxis : [{
                type : 'value'
            }],
            series : [
                {
                    name : '净利润',
                    type : 'bar',
                    label: {
                        normal: {
                            show: true,
                            rotate:90,
                            formatter:'{c}(万元)'
                        }
                    },
                    data : []
                },
                {
                    name : '营业利润',
                    type : 'bar',
                    label: {
                        normal: {
                            show: true,
                            rotate:90,
                            formatter:'{c}(万元)'
                        }
                    },
                    data : []
                }]
        };

        $scope.profitRateEchartsOption =
        {
            title:{
                show: true,
                text: '',
                x:'center',
                textStyle:{
                    color:'#0f0'
                }
            },
            legend: {
                data:[{name:'净利润增长率'},{name:'营业利润增长率'}]
            },
            tooltip : {
                show: true
            },
            xAxis : [{
                type : 'category',
                data: []
            }],
            yAxis : [{
                type : 'value'
            }],
            series : [
                {
                    name : '净利润增长率',
                    type : 'line',
                    data : []
                },
                {
                    name : '营业利润增长率',
                    type : 'line',
                    data : []
                }]
        };

        if ($stateParams.stockCode)
        {
            $scope.stockCode = $stateParams.stockCode;
            $scope.select.beginDate = stockInfoCache.get("beginDate");
            $scope.select.endDate = stockInfoCache.get("endDate");
            $scope.netProfit = stockInfoCache.get("netProfit");

            ApiStock.get({stockCode:$scope.stockCode},
                function (data)
                {
                    $scope.peEchartsOption = {
                        title:{text: data.name}
                    };
                },
                function (response) {
                    alert(response.data.returnMsg);
                }
            );

            ApiEcharts.getTimeDatas(
                {
                    type:"pe",
                    stock:$scope.stockCode,
                    beginDate:$scope.select.beginDate != null ? $scope.select.beginDate.getTime() : null,
                    endDate:$scope.select.endDate != null ? $scope.select.endDate.getTime() : null,
                    netProfit:$scope.netProfit
                },
                function (data)
                {
                    $scope.peEchartsOption = {
                        series : [ {
                            // 根据名字对应到相应的系列
                            name : '市盈率',
                            data : angular.fromJson(data.jsonString)
                        } ]
                    }
                },
                function (response) {
                    alert(response.data.returnMsg);
                }
            );

            ApiEcharts.getTimeDatas(
                {
                    type:"po",
                    stock:$scope.stockCode,
                    beginDate:$scope.select.beginDate != null ? $scope.select.beginDate.getTime() : null,
                    endDate:$scope.select.endDate != null ? $scope.select.endDate.getTime() : null
                },
                function (data)
                {
                    $scope.peEchartsOption = {
                        series : [ {
                            // 根据名字对应到相应的系列
                            name : '市营率',
                            data : angular.fromJson(data.jsonString)
                        } ]
                    }
                },
                function (response) {
                    alert(response.data.returnMsg);
                }
            );

            ApiEcharts.get(
                {
                    type:"profit",
                    stock:$scope.stockCode
                },
                function (data)
                {
                    $scope.profitEchartsOption = {
                        xAxis : [{
                            data: data.years
                        }],
                        series : [
                            {
                                name : '净利润',
                                data : data.netProfits
                            },
                            {
                                // 根据名字对应到相应的系列
                                name : '营业利润',
                                data : data.operatingProfits
                            }
                        ]
                    };

                    $scope.profitRateEchartsOption = {
                        xAxis : [{
                            data: data.years
                        }],
                        series : [
                            {
                                name : '净利润增长率',
                                data : data.netProfitRates
                            },
                            {
                                // 根据名字对应到相应的系列
                                name : '营业利润增长率',
                                data : data.operatingProfitRates
                            }
                        ]
                    };
                },
                function (response) {
                    alert(response.data.returnMsg);
                }
            );
        }

        $scope.search = function ()
        {
            stockInfoCache.put("stockCode", $scope.stockCode);
            stockInfoCache.put("beginDate", $scope.select.beginDate);
            stockInfoCache.put("endDate", $scope.select.endDate);
            stockInfoCache.put("netProfit", $scope.netProfit);

            $state.go("main.stockInfo", {stockCode:$scope.stockCode}, {reload:true});
        };

    }
]);

appControllers.controller("ImportController", ["$scope", "Upload",
    function ($scope, Upload)
    {
        $scope.importFile = function (file, fileType) {
            if (file)
            {
                Upload.upload({
                    url: testServerAddr + "api/import/"+fileType,
                    data: {zipFile:file}
                }).then(function (response) {
                        alert("导入成功");
                    }, function (response) {
                        alert(response.data.returnMsg);
                    }
                );
            }
        };
    }
]);