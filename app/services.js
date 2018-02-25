/**
 * Created by madongfang on 2016/9/1.
 */

var restfulApiService = angular.module("restfulApiService", ["ngResource"]);

restfulApiService.config(["$resourceProvider",
    function ($resourceProvider)
    {
        $resourceProvider.defaults.actions = {
            get: {method: 'GET', withCredentials: true},
            create: {method: 'POST', withCredentials: true},
            exec: {method: 'POST', withCredentials: true},
            query: {method: 'GET', isArray: true, withCredentials: true},
            update: {method: 'PUT', withCredentials: true},
            delete: {method: 'DELETE', withCredentials: true}
        };
    }
]);

restfulApiService.factory("ApiEcharts", ["$resource",
    function ($resource) {
        return $resource(testServerAddr + "api/echarts", null,
            {
                getTimeDatas:
                {
                    method: "GET",
                    url:testServerAddr + "api/echarts/timeDatas",
                    withCredentials: true,
                    transformResponse: function (data, headersGetter, status)
                    {
                        if (status == 200)
                        {
                            // $resource会将数组的数组转成对象数组,导致echarts折线图提示信息无法正确显示,所以在这里只传字符串
                            return {jsonString: data};
                        }
                        else
                        {
                            return angular.fromJson(data);
                        }
                    }
                }
            }
        );
    }
]);

restfulApiService.factory("ApiStock", ["$resource",
    function ($resource) {
        return $resource(testServerAddr + "api/stocks/:stockCode");
    }
]);
