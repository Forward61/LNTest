define(['angular', 'NpfMobileConfig', 'invoiceself/js/invoice','commonModule','areaModule','messagetipsModule','dateModule','commonFuncModule'],
    function (angular, NpfMobileConfig, invoice) {
        invoice.controller('choosePostInfo', ['$scope', '$http','$location', 'NpayInfo','MessagetipsUtils','DateUtil','commonUtil','AreaUtils',
                function ($scope,$http,$location,NpayInfo,MessagetipsUtils,DateUtil,commonUtil,AreaUtils) {
                    document.title = "收件信息";
                    $scope.invoice = NpayInfo;
                    $scope.invoice.postList = [];
                    $scope.editAddr = function(postInfo) {
                        $scope.invoice.postInfo = postInfo;
                        $location.path('/editPostInfo');
                    }
                    $scope.delAddr = function(postInfo) {
                        $scope.delInvoiceInfo(postInfo.postId);
                    }
                    $scope.addDddr = function() {
                        $scope.invoice.postInfo = {};
                        $location.path('/editPostInfo');
                    }
                    $scope.fillPostParam = function(id) {
                        var param = {};
                        param["commonBean.channelType"] = NpfMobileConfig.CHANNEL_TYPE;
                        param["operate_type"] = "del";
                        param["post_id"] = id;
                        return param;
                    }
                    $scope.delInvoiceInfo = function(id) {/** 调后台修改邮寄信息  modtype:del,modify,add */
                    $http({
                        method: 'post',
                        url: NpfMobileConfig.serviceInvoiceURL + 'Invoice/editCustHistoryPost.action',
                        params: $scope.fillPostParam(id)
                    })
                        .success(function (data, status, headers, config) {
                            if(data.length>0) {
                                $scope.fillHisPostInfo(data);
                            } else {
                                var removeflag = false;
                                for(var i=0;i<$scope.invoice.postInvoiceList.length;i++) {
                                    if($scope.invoice.postInvoiceList[i].postId == id) {
                                        $scope.invoice.postInvoiceList[i] = $scope.invoice.postInvoiceList[i+1];
                                        removeflag = true;
                                    }
                                    if(removeflag && i<$scope.invoice.postInvoiceList.length-1) {
                                        $scope.invoice.postInvoiceList[i] = $scope.invoice.postInvoiceList[i+1];
                                    }
                                }
                            }
                        })
                        .error(function (data, status, headers, config) {
                            //
                        });
                    }
                    $scope.fillHisPostInfo = function(data) {
                        if(data.length > 0) $scope.invoice.postInvoiceList = [];
                        for(var i=0;i<data.length;i++) {
                            data[i].postProviceCode = AreaUtils.getEssProvinceCode(data[i].provinceCode);
                            data[i].postCityCode = AreaUtils.getEssCityCode(data[i].provinceCode,data[i].cityCode);
                            data[i].postRegionCode = data[i].districtCode;
                            data[i].postname = data[i].receiverName;
                            data[i].postphone = data[i].mobilePhone;
                            data[i].postcode = data[i].postCode;
                            data[i].adressAreaInfo = (AreaUtils.municipality.indexOf(data[i].postProviceCode)>=0?"":(data[i].provinceName  + " ")) + data[i].cityName + " " +  data[i].districtName;
                            data[i].postaddr = data[i].postAddr;
                            $scope.invoice.postInvoiceList.push(data[i]);
                        }
                    }
                    $scope.getHistoryPostInfo = function() {
                        $http({
                            method: 'post',
                            url: NpfMobileConfig.serviceInvoiceURL + 'Invoice/getCustHistoryPost.action',
                            params: {'commonBean.channelType': NpfMobileConfig.CHANNEL_TYPE}
                        })
                            .success(function (data, status, headers, config) {
                                if(data.length > 0) {
                                    $scope.fillHisPostInfo(data);
                                }
                            })
                            .error(function (data, status, headers, config) {
                            });
                    }
                    $scope.chooseAddr = function(postInfo) {
                        if($scope.invoice.postInfo.postId != postInfo.postId) {
                            $scope.invoice.postInfo = postInfo;
                            $scope.invoice.paytype = {};
                        }
                        $location.path('/payInfo');
                    }
                    //页面初始化
                    if(undefined == $scope.invoice.invoicerule["01"]) $location.path('/invoice');
                    $scope.getHistoryPostInfo();

//                $scope.servieType = "reinvoiceFinish";
//                MessagetipsUtils.fillMessagetips($scope.servieType);

                    $scope.goBack = function() {
                        $location.path('/payInfo');
                    }
                }])
            .controller('editPostInfo', ['$scope', '$http','$location', 'NpayInfo','MessagetipsUtils','DateUtil','commonUtil','AreaUtils',
                function ($scope,$http,$location,NpayInfo,MessagetipsUtils,DateUtil,commonUtil,AreaUtils) {
                    document.title = "收件信息";
                    $scope.invoice = NpayInfo;
                    $scope.invoice.postInfo.provinceName = "";
                    $scope.invoice.postInfo.cityName = "";

                    $scope.invoice.provinceList = allArea.PROVINCE_LIST;
                    $scope.chooseProvince = function(province) {
                        $scope.invoice.postInfo.postCityCode = "";
                        $scope.invoice.postInfo.postRegionCode = "";
                        $scope.invoice.cityList = [];
                        $scope.invoice.areaList = [];
                        $scope.invoice.postInfo.adressAreaInfo = "";

                        if(commonUtil.judgeEmpty(province)) return;
                        $scope.invoice.postInfo.provinceName = AreaUtils.municipality.indexOf($scope.invoice.postInfo.postProviceCode)>=0 ? "" : province.PROVINCE_NAME;
                        $scope.invoice.cityList = allArea.PROVINCE_MAP[province.PROVINCE_CODE];
                        $scope.invoice.areaList = [];
                    }
                    $scope.changeProvince = function() {
                        if(commonUtil.judgeEmpty($scope.invoice.postInfo.postProviceCode)) {
                            $scope.chooseProvince("");
                            return;
                        }
                        $scope.chooseProvince(AreaUtils.getProvinceBy3Code($scope.invoice.postInfo.postProviceCode));
                    }
                    $scope.chooseCity = function(city) {
                        $scope.invoice.postInfo.postRegionCode = "";
                        $scope.invoice.areaList = [];

                        if(commonUtil.judgeEmpty(city)) return;
                        $scope.invoice.postInfo.cityName = (!commonUtil.judgeEmpty($scope.invoice.postInfo.adressAreaInfo) ? " " : "") + city.CITY_NAME;
                        $scope.invoice.areaList = allArea.CITY_MAP[city.CITY_CODE];
                    }
                    $scope.changeCity = function() {
                        if(commonUtil.judgeEmpty($scope.invoice.postInfo.postCityCode)) {
                            $scope.chooseCity("");
                            return;
                        }
                        $scope.chooseCity(AreaUtils.getCityBy3Code(AreaUtils.get6ProvinceCode($scope.invoice.postInfo.postProviceCode),$scope.invoice.postInfo.postCityCode));
                    }
                    $scope.chooseArea = function(area) {
                        if(commonUtil.judgeEmpty(area)) return;
                        $scope.invoice.postInfo.adressAreaInfo = $scope.invoice.postInfo.provinceName + $scope.invoice.postInfo.cityName + " " + area.DISTRICT_NAME;
                    }
                    $scope.changeRegionCode = function() {
                        if(commonUtil.judgeEmpty($scope.invoice.postInfo.postRegionCode)) {
                            $scope.chooseArea("");
                            return;
                        }
                        $scope.chooseArea(
                            AreaUtils.getAreaBy3Code(AreaUtils.get6CityCode(AreaUtils.get6ProvinceCode($scope.invoice.postInfo.postProviceCode),$scope.invoice.postInfo.postCityCode),
                                $scope.invoice.postInfo.postRegionCode));
                    }
                    $scope.checkPostInfo = function() {
                        if(commonUtil.judgeEmpty($scope.invoice.postInfo.postname) || /^.*[,\^\*\?#<>&\!@%`+\$}{'"\\\/\[\]+].*$/.test($scope.invoice.postInfo.postname)
                            || /^.*[\u005f\u003d\uff5b\uff5d\u3001\u007c\uff5c\u003b\uff1b\uff1f\uff01\uffe5\u2026\u201c\u201d\u2018\u2019].*$/.test($scope.invoice.postInfo.postname)) {
                            $scope.invoiceErrorMsg = "请正确输入收件人！";
                            return false;
                        }
                        if(commonUtil.judgeEmpty($scope.invoice.postInfo.postphone) || !/^(\d{11})$/.test($scope.invoice.postInfo.postphone)) {
                            $scope.invoiceErrorMsg = "请正确输入联系电话！";
                            return false;
                        }
                        if(commonUtil.judgeEmpty($scope.invoice.postInfo.postProviceCode) || commonUtil.judgeEmpty($scope.invoice.postInfo.postCityCode)) {
                            $scope.invoiceErrorMsg = "请选择省份地市！";
                            return false;
                        }
                        if(commonUtil.judgeEmpty($scope.invoice.postInfo.postRegionCode)) {
                            $scope.invoiceErrorMsg = "请选择区县！";
                            return false;
                        }
                        if(commonUtil.judgeEmpty($scope.invoice.postInfo.postcode) || !/^(\d{6})$/.test($scope.invoice.postInfo.postcode)) {
                            $scope.invoiceErrorMsg = "请正确填写邮编！";
                            return false;
                        }
                        if(commonUtil.judgeEmpty($scope.invoice.postInfo.postaddr) || /^.*[,\^\*\?<>&)\!@%`+\$}{('"\\\/\[\]+].*$/.test($scope.invoice.postInfo.postaddr)
                            || /^.*[\u005f\u003d\uff5b\uff5d\u3001\u007c\uff5c\u003b\uff1b\uff1f\uff01\uffe5\u2026\u201c\u201d\u2018\u2019].*$/.test($scope.invoice.postInfo.postaddr)) {
                            $scope.invoiceErrorMsg = "请正确填写详细地址！";
                            return false;
                        }
                        return true;
                    }
                    $scope.fillPostParam = function(modtype) {
                        var param = {};
                        param["commonBean.channelType"] = NpfMobileConfig.CHANNEL_TYPE;
                        param["operate_type"] = modtype;
                        param["post_id"] = $scope.invoice.postInfo.postId;
                        param["receiver_name"] = commonUtil.removeSpace($scope.invoice.postInfo.postname);
                        param["mobile_phone"] = commonUtil.removeSpace($scope.invoice.postInfo.postphone);
                        param["fix_phone"] = "";
                        param["post_code"] = commonUtil.removeSpace($scope.invoice.postInfo.postcode);
                        param["province_code"] = AreaUtils.get6ProvinceCode($scope.invoice.postInfo.postProviceCode);
                        param["city_code"] = AreaUtils.get6CityCode(param["province_code"],$scope.invoice.postInfo.postCityCode);
                        param["district_code"] = $scope.invoice.postInfo.postRegionCode;
                        param["post_addr"] = commonUtil.removeSpace($scope.invoice.postInfo.postaddr);
                        param["email"] = "";
                        return param;
                    }
                    $scope.operateInvoiceInfo = function(modtype) {/** 调后台修改邮寄信息  modtype:del,modify,add */
                        $http({
                             method: 'post',
                            url: NpfMobileConfig.serviceInvoiceURL + 'Invoice/editCustHistoryPost.action',
                            params: $scope.fillPostParam(modtype)
                        })
                        .success(function (data, status, headers, config) {
                            if(data.length<=0) {
                                $scope.invoice.postInvoiceList = [];
                                $scope.invoice.postInvoiceList.push($scope.invoice.postInfo);
                            }
                            $scope.goBack();
                        })
                        .error(function (data, status, headers, config) {
                            //
                        });
                    }
                    $scope.confirmPost = function() {
                        if(!$scope.checkPostInfo()) {
                            return;
                        }
                        $scope.operateInvoiceInfo(commonUtil.judgeEmpty($scope.invoice.postInfo.postId) ? "add" : "modify");
                    }
                    $scope.cancelEditPost = function() {
                        $scope.invoice.postInfo = {};
                        $scope.goBack();
                    }
                    //初始化页面
                    if(undefined == $scope.invoice.invoicerule["01"]) $location.path('/invoice');
                    if(!commonUtil.judgeEmpty($scope.invoice.postInfo.postProviceCode)) {
                        $scope.chooseProvince(AreaUtils.getProvinceBy3Code($scope.invoice.postInfo.postProviceCode));
                    }
                    if(!commonUtil.judgeEmpty($scope.invoice.postInfo.postCityCode)) {
                        $scope.chooseCity(AreaUtils.getCityBy3Code(AreaUtils.get6ProvinceCode($scope.invoice.postInfo.postProviceCode),$scope.invoice.postInfo.postCityCode));
                    }
//                $scope.servieType = "reinvoiceFinish";
//                MessagetipsUtils.fillMessagetips($scope.servieType);

                    $scope.goBack = function() {
                        $location.path('/choosePostInfo');
                    }
                }])
            .controller('invoiceWithoutCallbackStateController', ['$scope','$location', 'NpayInfo','MessagetipsUtils', function ($scope,$location, NpayInfo,MessagetipsUtils) {
                document.title = "领取发票完成";
                $scope.invoice = NpayInfo;
                $scope.isNotNull = function(param){
                    return param.trim()!="" && param !=undefined;
                }
                $scope.goFirstPage = function() {
                    window.location.href = "../invoiceself/index.html";
                }
                $scope.goQuery = function() {
                    window.location.href = "../invoiceselfQuery/index.html";
                }
            //    $scope.servieType = "invoiceFinish";
             //   MessagetipsUtils.fillMessagetips($scope.servieType);
            }])
    });