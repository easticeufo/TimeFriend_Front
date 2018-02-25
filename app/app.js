/**
 * Created by madongfang on 2016/9/1.
 */

//testServerAddr = "http://localhost:8082/"; // 开发测试时使用
//testServerAddr = "http://116.62.200.17/TimeFriend/"; // 开发测试时使用
testServerAddr = ""; // 发布时使用

var eastApp = angular.module("eastApp", ["ui.router", "restfulApiService", "appControllers", "appFilters",
    "ui.bootstrap", "angularEcharts", "ngFileUpload"]);

eastApp.config(["$stateProvider", "$urlRouterProvider",
    function ($stateProvider, $urlRouterProvider)
    {
        $urlRouterProvider.otherwise("/main");

        $stateProvider
            .state("main", {
                url: "/main",
                templateUrl: "templates/main.html",
                controller: "MainController"
            })
            .state("main.stocks", {
                url: "/stocks",
                templateUrl: "templates/stocks.html",
                controller: "StocksController"
            })
            .state("main.stockInfo", {
                url: "/stocks/{stockCode}",
                templateUrl: "templates/stockInfo.html",
                controller: "StockInfoController"
            })
            .state("main.import", {
                url: "/import",
                templateUrl: "templates/import.html",
                controller: "ImportController"
            })
            .state("main.about", {
                url: "/about",
                templateUrl: "templates/about.html"
            });
    }
]);
