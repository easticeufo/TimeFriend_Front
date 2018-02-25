/**
 * Created by madongfang on 17/6/21.
 */

var angularEcharts = angular.module("angularEcharts", []);

angularEcharts.directive("angularEcharts", function ()
    {
        return {
            restrict: "E",
            replace: true,
            scope:
            {
                option: "=",
                echartsClick: "&"
            },
            template: "<div></div>",
            link: function (scope, element, attrs)
            {
                var chart = echarts.init(element[0]);
                chart.on("click", function (params)
                {
                    scope.echartsClick({params:params});
                });
                scope.$watch("option", function ()
                    {
                        if (angular.isObject(scope.option))
                        {
                            chart.setOption(scope.option);
                        }
                    },
                    true
                );
            }
        };
    }
);