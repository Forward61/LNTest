define(['angular','NpfMobileConfig'], function (angular,NpfMobileConfig) {
    return angular.module('commonModule', [])
        .factory('NpayInfo', function () {
            return {
                uri: "",
                phone: "",
                name: "",
                is4G:false,
                jifen:0,
                provinceCode: "",
                cityCode: "",
                provinceName: "",
                cityName: "",
                fixProvinceCode: "",
                fixCityCode: "",
                fixProvinceName: "",
                fixCityName: "",
                broadProvCode:"",
                broadCityCode:"",
                currentProvName:"",
                currentCityName:"",
                payAmount: "",
                cardPwd: "",
                rechargeTime: "",
                sec: "",
                isOnlineProvince:false,
                isPost:false,//是否邮寄
                month:1,
                invoicerule : {},
                monthInvoice:[],
                payInvoice:[],
                cardList:[],
                chargeList:[],
                monthMoney:0,
                payMoney:0,
                cardMoney:0,
                paytype:{},
                certificateNum: "",
                invoiceHeader: "",
                invoiceTypeName: "",
                invoiceTypeCode: "",
                invoiceList: [],
                postInfo: {},
                postInvoiceList: [],
                selectedCard: "",
                invoiceDelOrCancelTag: "",
                postDelOrCancelName:"",
                phonePrev: "",
                provinceCodePrev: "",
                cardinfoList: [],
                selectedCardInfo: [],
                invoiceNorList: "",
                invoiceinfohide: "",
                invoiceNorMonthShow: "",
                invoiceMonthShow: "",
                invoiceConfig: "",
                orderInfo:"",
                clearPhone:"",
                historyNum: [],
                fixHistoryNum: [],
                broadBandHistoryNum:[],
                inputPhoneShow:"",
                inputBoradBandShow:"",
                invoiceType:"",
                mobBannersel:false,
                fixBannersel:false,
                broadBandBannersel:false,
                fixCode:"",
                fixNum:"",
                fixPhone:"",
                cardinfoFixList:"",
                cardinfoBroadList:[],//宽带卡列表
                fixCodePrev:"",
                fixProvCodePrev:"",
                invoiceFixConfig:"",
                isMobile:true,
                isWap:NpfMobileConfig.ISWAP,
                isLogin:true,
                isOtherAmount:false,
                bankchargeamount:true,
                activityFlag:false,// 广东活动，默认为false
                isNotBroadBand:true,
                isNewVersion:false,
                lotteryUrl:"",//广东活动链接
                broadBandNum:"",//宽带号码
                istest:NpfMobileConfig.istest,
                isBroadProvinceShow:false,
                isBroadNumTypeShow:false,
                numberType:"03",
                sxLimit:false,//山西宽带拨号账号缴费业务限制
                activityList:[],
                isUsePointShow:false, //使用积分 是否展示
                isPointShow:false, //积分输入框  是否展示
                userPoint : undefined,
                usePointNum : "", //用户输入的使用积分数
                usePointNumEqual : "0.00",//输入积分数抵扣金额
                canUsePoint : false, // 是否可以使用积分
                consumePointAmount : "", // 扣减完积分数后的金额
                isOpenIntegral : true, // 使用积分  图标样式
                cityCodePrev :"",//拉取折扣率上一个输入号码返回的地市编码
                fixCityCodePrev:"",//拉取折扣率
                getOfferate : false,
                cardMoney:"0",
                chargeMoney:"0",
                getCustomInvoice:""
            }
        })
        .controller('addressController', ['$scope', '$window', '$http', '$location', 'NpayInfo', '$anchorScroll',
            function ($scope, $window, $http, $location, NpayInfo, $anchorScroll) {
                var wHeight = $window.innerHeight;
                $(".listview").height(wHeight - 40);

                $scope.addressInfo = NpayInfo;
                $scope.addressInfo.choosenPhones = {};
                $scope.phoneInfo = { "contacts": [
                    {"key": "A", "values": [
                        {"contactId": 11, "displayName": "安心", "key": "A" },
                        {"contactId": 14, "displayName": "安静", "key": "A" }
                    ] },
                    {"key": "C", "values": [
                        {"contactId": 13, "displayName": "蔡芯", "key": "C" },
                        {"contactId": 15, "displayName": "曹操", "key": "C" }
                    ] },
                    {"key": "D", "values": [
                        {"contactId": 13, "displayName": "David", "key": "D" },
                        {"contactId": 15, "displayName": "大大", "key": "D" }
                    ] },
                    {"key": "J", "values": [
                        {"contactId": 12, "displayName": "John Doe", "key": "J"},
                        {"contactId": 19, "displayName": "Jane Doe", "key": "J"}
                    ] },
                    {"key": "K", "values": [
                        {"contactId": 17, "displayName": "Konur", "key": "K"},
                        {"contactId": 18, "displayName": "Kwan Kwazcski", "key": "K"}
                    ] },
                    {"key": "X", "values": [
                        {"contactId": 17, "displayName": "Xonur", "key": "X"},
                        {"contactId": 18, "displayName": "Xwan Kwazcski", "key": "X"}
                    ] },
                    {"key": "#", "values": [
                        {"contactId": 17, "displayName": "123", "key": "#"},
                        {"contactId": 18, "displayName": "3333", "key": "#"},
                        {"contactId": 17, "displayName": "443", "key": "#"},
                        {"contactId": 18, "displayName": "667", "key": "#"}
                    ] }
                ] };
                $scope.scrollToId = function (id) {
                    // set the location.hash to the id of the element you wish to scroll to.
                    var old = $location.hash();
                    $location.hash(id);
                    // call $anchorScroll()
                    $anchorScroll();
                    $location.hash(old);
                };

                // 取用户号码簿信息
//            $scope.url = '';
//            $http({method: 'get', url: $scope.url}).
//                success(function (data) {
//                    $scope.phoneInfo = data;
//                }).
//                error(function (data, status) {
//                });

                $scope.phones = [];
                $scope.chooseValue = function (value) {
                    // 取手机号
                    $scope.addressInfo.choosenPhones = value;
                    $scope.getPhones(value);
                    if ($scope.phones.length > 1) {
                        $scope.showChoosenAll(value);
                    }
                    else {
                        $scope.addressInfo.phone = $scope.phones[0] + " (" + value.displayName + ")";
                        $location.path($scope.addressInfo.uri);
                    }
                }

                $scope.getPhones = function (value) {
                    if (value.displayName == "安心") {
                        $scope.phones = ["18612837030", "13000006666", "15000008888"];
                    }
                    else if (value.displayName == "安静") {
                        $scope.phones = ["18600000000", "15000008888"];
                    }
                    else {
                        $scope.phones = ["18610737030"];
                    }
//                $scope.url = '';
//                $http({method: 'get', url: $scope.url,params:{contactId:value.contactId}}).
//                    success(function (data) {
//                        $scope.phoneInfo = data.phones;
//                    }).
//                    error(function (data, status) {
//                    });
                }

                $scope.chooseOthers = function (number) {
                    $scope.addressInfo.phone = number + " (" + $scope.addressInfo.choosenPhones.displayName + ")";
                    $location.path($scope.addressInfo.uri);
                }

                $scope.showChoosenAll = function (phone) {
                    $scope.addressInfo.choosenPhones = phone;
                    $(".thickdiv").fadeIn(300).attr('data-name', '1');
                    $(".name-num").slideDown(300);

                }

                $scope.cancelChoose = function () {
                    $(".thickdiv").fadeOut(300).attr('data-name', '');
                    $(".name-num").slideUp(300);
                }

                $scope.isSearching = false;
                $scope.prepareSearch = function () {
                    $scope.isSearching = true;
                    $scope.searchNumberFocus = true;
                    $(".thickdiv").fadeIn(300);
                }
                $scope.cancelSearch = function () {
                    $scope.isSearching = false;
                    $scope.searchNumberFocus = false;
                    $(".name-num").slideUp(300);
                    $(".thickdiv").fadeOut(300);
                    $scope.searchingList = false;
                }
                $scope.search = function () {
                    $(".thickdiv").fadeOut(300);
                    if ($scope.query != "" && $scope.query != undefined && $scope.query != null) {
                        $scope.searchingList = true;
                    }
                    else {
                        $scope.searchingList = false;
                    }
                }
                $scope.queryClass = function (type) {
                    $scope.queryClass = type;
                }
            }])
        .factory('UrlName', function () {
            return {
                GetRequest: function (reqname) {
                    var url = location.search; //获取url中"?"符后的字串
                    var theRequest = new Object();
                    if (url.indexOf("?") != -1) {
                        var str = url.substr(1);
                        var strs = str.split("&");
                        for (var i = 0; i < strs.length; i += 1) {
                            if (reqname == strs[i].split("=")[0]) {
                                return strs[i].split("=")[1];
                            }
                        }
                    }
                }
            };
        });
});