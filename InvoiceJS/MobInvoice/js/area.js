define(['angular'], function (angular) {
    return angular.module('areaModule', [])
        .factory('AreaUtils', function () {
            var province = [
                {"id": "011", "name": "北京", "code": "011"},
                {"id": "013", "name": "天津", "code": "013"},
                {"id": "018", "name": "河北", "code": "018"},
                {"id": "019", "name": "山西", "code": "019"},
                {"id": "010", "name": "内蒙古", "code": "010"},
                {"id": "091", "name": "辽宁", "code": "091"},
                {"id": "090", "name": "吉林", "code": "090"},
                {"id": "097", "name": "黑龙江", "code": "097"},
                {"id": "031", "name": "上海", "code": "031"},
                {"id": "034", "name": "江苏", "code": "034"},
                {"id": "036", "name": "浙江", "code": "036"},
                {"id": "030", "name": "安徽", "code": "030"},
                {"id": "038", "name": "福建", "code": "038"},
                {"id": "075", "name": "江西", "code": "075"},
                {"id": "017", "name": "山东", "code": "017"},
                {"id": "076", "name": "河南", "code": "076"},
                {"id": "071", "name": "湖北", "code": "071"},
                {"id": "074", "name": "湖南", "code": "074"},
                {"id": "051", "name": "广东", "code": "051"},
                {"id": "059", "name": "广西", "code": "059"},
                {"id": "050", "name": "海南", "code": "050"},
                {"id": "083", "name": "重庆", "code": "083"},
                {"id": "081", "name": "四川", "code": "081"},
                {"id": "085", "name": "贵州", "code": "085"},
                {"id": "086", "name": "云南", "code": "086"},
                {"id": "079", "name": "西藏", "code": "079"},
                {"id": "084", "name": "陕西", "code": "084"},
                {"id": "087", "name": "甘肃", "code": "087"},
                {"id": "070", "name": "青海", "code": "070"},
                {"id": "088", "name": "宁夏", "code": "088"},
                {"id": "089", "name": "新疆", "code": "089"}
            ];
            var city = {"074": [
                {"id": "741", "ccode": "0731", "name": "长沙", "pno": "074"},
                {"id": "742", "ccode": "0731", "name": "株洲", "pno": "074"},
                {"id": "743", "ccode": "0731", "name": "湘潭", "pno": "074"},
                {"id": "744", "ccode": "0734", "name": "衡阳", "pno": "074"},
                {"id": "745", "ccode": "0730", "name": "岳阳", "pno": "074"},
                {"id": "747", "ccode": "0737", "name": "益阳", "pno": "074"},
                {"id": "748", "ccode": "0735", "name": "郴州", "pno": "074"},
                {"id": "749", "ccode": "0736", "name": "常德", "pno": "074"},
                {"id": "791", "ccode": "0738", "name": "娄底", "pno": "074"},
                {"id": "792", "ccode": "0739", "name": "邵阳", "pno": "074"},
                {"id": "793", "ccode": "0743", "name": "湘西", "pno": "074"},
                {"id": "794", "ccode": "0744", "name": "张家界", "pno": "074"},
                {"id": "795", "ccode": "0745", "name": "怀化", "pno": "074"},
                {"id": "796", "ccode": "0746", "name": "永州", "pno": "074"},
                {"id": "746", "ccode": "0731", "name": "浏阳", "pno": "074"}
            ], "091": [
                {"id": "910", "ccode": "024", "name": "沈阳", "pno": "091"},
                {"id": "940", "ccode": "0411", "name": "大连", "pno": "091"},
                {"id": "912", "ccode": "0412", "name": "鞍山", "pno": "091"},
                {"id": "913", "ccode": "024", "name": "抚顺", "pno": "091"},
                {"id": "914", "ccode": "024", "name": "本溪", "pno": "091"},
                {"id": "915", "ccode": "0415", "name": "丹东", "pno": "091"},
                {"id": "916", "ccode": "0416", "name": "锦州", "pno": "091"},
                {"id": "917", "ccode": "0417", "name": "营口", "pno": "091"},
                {"id": "918", "ccode": "0418", "name": "阜新", "pno": "091"},
                {"id": "919", "ccode": "0419", "name": "辽阳", "pno": "091"},
                {"id": "911", "ccode": "024", "name": "铁岭", "pno": "091"},
                {"id": "920", "ccode": "0421", "name": "朝阳", "pno": "091"},
                {"id": "921", "ccode": "0427", "name": "盘锦", "pno": "091"},
                {"id": "922", "ccode": "0429", "name": "葫芦岛", "pno": "091"}
            ], "076": [
                {"id": "760", "ccode": "0371", "name": "郑州", "pno": "076"},
                {"id": "761", "ccode": "0379", "name": "洛阳", "pno": "076"},
                {"id": "762", "ccode": "0371", "name": "开封", "pno": "076"},
                {"id": "763", "ccode": "0391", "name": "焦作", "pno": "076"},
                {"id": "764", "ccode": "0373", "name": "新乡", "pno": "076"},
                {"id": "765", "ccode": "0374", "name": "许昌", "pno": "076"},
                {"id": "766", "ccode": "0395", "name": "漯河", "pno": "076"},
                {"id": "767", "ccode": "0372", "name": "安阳", "pno": "076"},
                {"id": "768", "ccode": "0370", "name": "商丘", "pno": "076"},
                {"id": "769", "ccode": "0375", "name": "平顶山", "pno": "076"},
                {"id": "770", "ccode": "0394", "name": "周口", "pno": "076"},
                {"id": "771", "ccode": "0396", "name": "驻马店", "pno": "076"},
                {"id": "772", "ccode": "0398", "name": "三门峡", "pno": "076"},
                {"id": "773", "ccode": "0393", "name": "濮阳", "pno": "076"},
                {"id": "774", "ccode": "0392", "name": "鹤壁", "pno": "076"},
                {"id": "775", "ccode": "0391", "name": "济源", "pno": "076"},
                {"id": "776", "ccode": "0376", "name": "信阳", "pno": "076"},
                {"id": "777", "ccode": "0377", "name": "南阳", "pno": "076"}
            ], "019": [
                {"id": "190", "ccode": "0351", "name": "太原", "pno": "019"},
                {"id": "193", "ccode": "0352", "name": "大同", "pno": "019"},
                {"id": "192", "ccode": "0353", "name": "阳泉", "pno": "019"},
                {"id": "195", "ccode": "0355", "name": "长治", "pno": "019"},
                {"id": "194", "ccode": "0356", "name": "晋城", "pno": "019"},
                {"id": "199", "ccode": "0349", "name": "朔州", "pno": "019"},
                {"id": "198", "ccode": "0350", "name": "忻州", "pno": "019"},
                {"id": "191", "ccode": "0354", "name": "晋中", "pno": "019"},
                {"id": "200", "ccode": "0358", "name": "吕梁", "pno": "019"},
                {"id": "197", "ccode": "0357", "name": "临汾", "pno": "019"},
                {"id": "196", "ccode": "0359", "name": "运城", "pno": "019"}
            ], "038": [
                {"id": "380", "ccode": "0591", "name": "福州", "pno": "038"},
                {"id": "390", "ccode": "0592", "name": "厦门", "pno": "038"},
                {"id": "480", "ccode": "0595", "name": "泉州", "pno": "038"},
                {"id": "395", "ccode": "0596", "name": "漳州", "pno": "038"},
                {"id": "386", "ccode": "0593", "name": "宁德", "pno": "038"},
                {"id": "385", "ccode": "0594", "name": "莆田", "pno": "038"},
                {"id": "387", "ccode": "0599", "name": "南平", "pno": "038"},
                {"id": "389", "ccode": "0598", "name": "三明", "pno": "038"},
                {"id": "384", "ccode": "0597", "name": "龙岩", "pno": "038"}
            ], "075": [
                {"id": "750", "ccode": "0791", "name": "南昌", "pno": "075"},
                {"id": "755", "ccode": "0792", "name": "九江", "pno": "075"},
                {"id": "757", "ccode": "0793", "name": "上饶", "pno": "075"},
                {"id": "759", "ccode": "0794", "name": "抚州", "pno": "075"},
                {"id": "756", "ccode": "0795", "name": "宜春", "pno": "075"},
                {"id": "751", "ccode": "0796", "name": "吉安", "pno": "075"},
                {"id": "752", "ccode": "0797", "name": "赣州", "pno": "075"},
                {"id": "740", "ccode": "0798", "name": "景德镇", "pno": "075"},
                {"id": "758", "ccode": "0799", "name": "萍乡", "pno": "075"},
                {"id": "753", "ccode": "0790", "name": "新余", "pno": "075"},
                {"id": "754", "ccode": "0701", "name": "鹰潭", "pno": "075"}
            ], "070": [
                {"id": "700", "ccode": "0971", "name": "西宁", "pno": "070"},
                {"id": "701", "ccode": "0972", "name": "海东", "pno": "070"},
                {"id": "702", "ccode": "0979", "name": "格尔木", "pno": "070"},
                {"id": "704", "ccode": "0977", "name": "海西洲", "pno": "070"},
                {"id": "706", "ccode": "0970", "name": "海北洲", "pno": "070"},
                {"id": "705", "ccode": "0974", "name": "海南洲", "pno": "070"},
                {"id": "707", "ccode": "0973", "name": "黄南州", "pno": "070"},
                {"id": "708", "ccode": "0975", "name": "果洛州", "pno": "070"},
                {"id": "709", "ccode": "0976", "name": "玉树州", "pno": "070"},
                {"id": "703", "ccode": "0977", "name": "德令哈", "pno": "070"}
            ], "036": [
                {"id": "360", "ccode": "0571", "name": "杭州", "pno": "036"},
                {"id": "470", "ccode": "0577", "name": "温州", "pno": "036"},
                {"id": "468", "ccode": "0570", "name": "衢州", "pno": "036"},
                {"id": "362", "ccode": "0572", "name": "湖州", "pno": "036"},
                {"id": "363", "ccode": "0573", "name": "嘉兴", "pno": "036"},
                {"id": "365", "ccode": "0575", "name": "绍兴", "pno": "036"},
                {"id": "476", "ccode": "0576", "name": "台州", "pno": "036"},
                {"id": "469", "ccode": "0578", "name": "丽水", "pno": "036"},
                {"id": "367", "ccode": "0579", "name": "金华", "pno": "036"},
                {"id": "364", "ccode": "0580", "name": "舟山", "pno": "036"},
                {"id": "370", "ccode": "0574", "name": "宁波", "pno": "036"}
            ], "034": [
                {"id": "340", "ccode": "025", "name": "南京", "pno": "034"},
                {"id": "450", "ccode": "0512", "name": "苏州", "pno": "034"},
                {"id": "330", "ccode": "0510", "name": "无锡", "pno": "034"},
                {"id": "440", "ccode": "0519", "name": "常州", "pno": "034"},
                {"id": "430", "ccode": "0514", "name": "扬州", "pno": "034"},
                {"id": "343", "ccode": "0511", "name": "镇江", "pno": "034"},
                {"id": "358", "ccode": "0513", "name": "南通", "pno": "034"},
                {"id": "350", "ccode": "0516", "name": "徐州", "pno": "034"},
                {"id": "445", "ccode": "0523", "name": "泰州", "pno": "034"},
                {"id": "348", "ccode": "0515", "name": "盐城", "pno": "034"},
                {"id": "354", "ccode": "0517", "name": "淮安", "pno": "034"},
                {"id": "346", "ccode": "0518", "name": "连云港", "pno": "034"},
                {"id": "349", "ccode": "0527", "name": "宿迁", "pno": "034"}
            ], "071": [
                {"id": "710", "ccode": "027", "name": "武汉", "pno": "071"},
                {"id": "711", "ccode": "0717", "name": "宜昌", "pno": "071"},
                {"id": "712", "ccode": "0716", "name": "荆州", "pno": "071"},
                {"id": "726", "ccode": "0728", "name": "潜江", "pno": "071"},
                {"id": "725", "ccode": "0728", "name": "天门", "pno": "071"},
                {"id": "713", "ccode": "0728", "name": "江汉", "pno": "071"},
                {"id": "728", "ccode": "0728", "name": "仙桃", "pno": "071"},
                {"id": "714", "ccode": "0713", "name": "黄冈", "pno": "071"},
                {"id": "715", "ccode": "0714", "name": "黄石", "pno": "071"},
                {"id": "716", "ccode": "0710", "name": "襄樊", "pno": "071"},
                {"id": "717", "ccode": "0712", "name": "孝感", "pno": "071"},
                {"id": "718", "ccode": "0711", "name": "鄂州", "pno": "071"},
                {"id": "719", "ccode": "0715", "name": "咸宁", "pno": "071"},
                {"id": "722", "ccode": "0719", "name": "神农架", "pno": "071"},
                {"id": "721", "ccode": "0719", "name": "十堰", "pno": "071"},
                {"id": "723", "ccode": "0722", "name": "随州", "pno": "071"},
                {"id": "724", "ccode": "0724", "name": "荆门", "pno": "071"},
                {"id": "727", "ccode": "0718", "name": "恩施", "pno": "071"}
            ], "059": [
                {"id": "591", "ccode": "0771", "name": "南宁", "pno": "059"},
                {"id": "593", "ccode": "0772", "name": "柳州", "pno": "059"},
                {"id": "592", "ccode": "0773", "name": "桂林", "pno": "059"},
                {"id": "594", "ccode": "0774", "name": "梧州", "pno": "059"},
                {"id": "595", "ccode": "0775", "name": "玉林", "pno": "059"},
                {"id": "596", "ccode": "0776", "name": "百色", "pno": "059"},
                {"id": "597", "ccode": "0777", "name": "钦州", "pno": "059"},
                {"id": "598", "ccode": "0778", "name": "河池", "pno": "059"},
                {"id": "599", "ccode": "0779", "name": "北海", "pno": "059"},
                {"id": "590", "ccode": "0770", "name": "防城港", "pno": "059"},
                {"id": "589", "ccode": "0775", "name": "贵港", "pno": "059"},
                {"id": "588", "ccode": "0774", "name": "贺州", "pno": "059"},
                {"id": "600", "ccode": "0771", "name": "崇左", "pno": "059"},
                {"id": "601", "ccode": "0772", "name": "来宾", "pno": "059"}
            ], "097": [
                {"id": "971", "ccode": "0451", "name": "哈尔滨", "pno": "097"},
                {"id": "973", "ccode": "0452", "name": "齐齐哈尔", "pno": "097"},
                {"id": "988", "ccode": "0453", "name": "牡丹江", "pno": "097"},
                {"id": "976", "ccode": "0454", "name": "佳木斯", "pno": "097"},
                {"id": "989", "ccode": "0455", "name": "绥化", "pno": "097"},
                {"id": "981", "ccode": "0459", "name": "大庆", "pno": "097"},
                {"id": "991", "ccode": "0467", "name": "鸡西", "pno": "097"},
                {"id": "990", "ccode": "0456", "name": "黑河", "pno": "097"},
                {"id": "996", "ccode": "0458", "name": "伊春", "pno": "097"},
                {"id": "994", "ccode": "0469", "name": "双鸭山", "pno": "097"},
                {"id": "993", "ccode": "0468", "name": "鹤岗", "pno": "097"},
                {"id": "992", "ccode": "0464", "name": "七台河", "pno": "097"},
                {"id": "995", "ccode": "0457", "name": "大兴安岭", "pno": "097"}
            ], "013": [
                {"id": "130", "ccode": "022", "name": "天津", "pno": "013"}
            ], "011": [
                {"id": "110", "ccode": "010", "name": "北京", "pno": "011"}
            ], "017": [
                {"id": "170", "ccode": "0531", "name": "济南", "pno": "017"},
                {"id": "166", "ccode": "0532", "name": "青岛", "pno": "017"},
                {"id": "150", "ccode": "0533", "name": "淄博", "pno": "017"},
                {"id": "157", "ccode": "0632", "name": "枣庄", "pno": "017"},
                {"id": "156", "ccode": "0546", "name": "东营", "pno": "017"},
                {"id": "161", "ccode": "0535", "name": "烟台", "pno": "017"},
                {"id": "155", "ccode": "0536", "name": "潍坊", "pno": "017"},
                {"id": "158", "ccode": "0537", "name": "济宁", "pno": "017"},
                {"id": "172", "ccode": "0538", "name": "泰安", "pno": "017"},
                {"id": "152", "ccode": "0631", "name": "威海", "pno": "017"},
                {"id": "154", "ccode": "0633", "name": "日照", "pno": "017"},
                {"id": "160", "ccode": "0634", "name": "莱芜", "pno": "017"},
                {"id": "153", "ccode": "0539", "name": "临沂", "pno": "017"},
                {"id": "173", "ccode": "0534", "name": "德州", "pno": "017"},
                {"id": "174", "ccode": "0635", "name": "聊城", "pno": "017"},
                {"id": "151", "ccode": "0543", "name": "滨州", "pno": "017"},
                {"id": "159", "ccode": "0530", "name": "菏泽", "pno": "017"}
            ], "018": [
                {"id": "188", "ccode": "0311", "name": "石家庄", "pno": "018"},
                {"id": "181", "ccode": "0315", "name": "唐山", "pno": "018"},
                {"id": "182", "ccode": "0335", "name": "秦皇岛", "pno": "018"},
                {"id": "186", "ccode": "0310", "name": "邯郸", "pno": "018"},
                {"id": "185", "ccode": "0319", "name": "邢台", "pno": "018"},
                {"id": "187", "ccode": "0312", "name": "保定", "pno": "018"},
                {"id": "184", "ccode": "0313", "name": "张家口", "pno": "018"},
                {"id": "189", "ccode": "0314", "name": "承德", "pno": "018"},
                {"id": "183", "ccode": "0316", "name": "廊坊", "pno": "018"},
                {"id": "180", "ccode": "0317", "name": "沧州", "pno": "018"},
                {"id": "720", "ccode": "0318", "name": "衡水", "pno": "018"}
            ], "090": [
                {"id": "901", "ccode": "0431", "name": "长春", "pno": "090"},
                {"id": "902", "ccode": "0432", "name": "吉林", "pno": "090"},
                {"id": "909", "ccode": "0433", "name": "延边", "pno": "090"},
                {"id": "903", "ccode": "0434", "name": "四平", "pno": "090"},
                {"id": "905", "ccode": "0435", "name": "通化", "pno": "090"},
                {"id": "907", "ccode": "0436", "name": "白城", "pno": "090"},
                {"id": "906", "ccode": "0437", "name": "辽源", "pno": "090"},
                {"id": "904", "ccode": "0438", "name": "松原", "pno": "090"},
                {"id": "908", "ccode": "0439", "name": "白山", "pno": "090"}
            ], "010": [
                {"id": "101", "ccode": "0471", "name": "呼和浩特", "pno": "010"},
                {"id": "102", "ccode": "0472", "name": "包头", "pno": "010"},
                {"id": "106", "ccode": "0473", "name": "乌海", "pno": "010"},
                {"id": "107", "ccode": "0476", "name": "赤峰", "pno": "010"},
                {"id": "108", "ccode": "0470", "name": "呼伦贝尔", "pno": "010"},
                {"id": "113", "ccode": "0482", "name": "兴安盟", "pno": "010"},
                {"id": "109", "ccode": "0475", "name": "通辽", "pno": "010"},
                {"id": "111", "ccode": "0479", "name": "锡林郭勒盟", "pno": "010"},
                {"id": "103", "ccode": "0474", "name": "乌兰察布盟", "pno": "010"},
                {"id": "104", "ccode": "0477", "name": "鄂尔多斯", "pno": "010"},
                {"id": "105", "ccode": "0478", "name": "巴彦淖尔", "pno": "010"},
                {"id": "114", "ccode": "0483", "name": "阿拉善盟", "pno": "010"}
            ], "031": [
                {"id": "310", "ccode": "021", "name": "上海", "pno": "031"}
            ], "050": [
                {"id": "501", "ccode": "0898", "name": "海口", "pno": "050"},
                {"id": "504", "ccode": "0898", "name": "琼海", "pno": "050"},
                {"id": "505", "ccode": "0898", "name": "文昌", "pno": "050"},
                {"id": "508", "ccode": "0898", "name": "万宁", "pno": "050"},
                {"id": "509", "ccode": "0898", "name": "定安", "pno": "050"},
                {"id": "511", "ccode": "0898", "name": "澄迈", "pno": "050"},
                {"id": "519", "ccode": "0898", "name": "屯昌", "pno": "050"},
                {"id": "514", "ccode": "0898", "name": "琼中", "pno": "050"},
                {"id": "502", "ccode": "0898", "name": "三亚", "pno": "050"},
                {"id": "516", "ccode": "0898", "name": "乐东", "pno": "050"},
                {"id": "513", "ccode": "0898", "name": "陵水", "pno": "050"},
                {"id": "515", "ccode": "0898", "name": "保亭", "pno": "050"},
                {"id": "507", "ccode": "0898", "name": "五指山", "pno": "050"},
                {"id": "503", "ccode": "0898", "name": "儋州", "pno": "050"},
                {"id": "506", "ccode": "0898", "name": "东方", "pno": "050"},
                {"id": "512", "ccode": "0898", "name": "临高", "pno": "050"},
                {"id": "517", "ccode": "0898", "name": "昌江", "pno": "050"},
                {"id": "518", "ccode": "0898", "name": "白沙", "pno": "050"}
            ], "030": [
                {"id": "302", "ccode": "0556", "name": "安庆", "pno": "030"},
                {"id": "301", "ccode": "0552", "name": "蚌埠", "pno": "030"},
                {"id": "318", "ccode": "0558", "name": "亳州", "pno": "030"},
                {"id": "309", "ccode": "0565", "name": "巢湖", "pno": "030"},
                {"id": "317", "ccode": "0566", "name": "池州", "pno": "030"},
                {"id": "312", "ccode": "0550", "name": "滁州", "pno": "030"},
                {"id": "306", "ccode": "0558", "name": "阜阳", "pno": "030"},
                {"id": "305", "ccode": "0551", "name": "合肥", "pno": "030"},
                {"id": "314", "ccode": "0561", "name": "淮北", "pno": "030"},
                {"id": "307", "ccode": "0554", "name": "淮南", "pno": "030"},
                {"id": "316", "ccode": "0559", "name": "黄山", "pno": "030"},
                {"id": "304", "ccode": "0564", "name": "六安", "pno": "030"},
                {"id": "300", "ccode": "0555", "name": "马鞍山", "pno": "030"},
                {"id": "313", "ccode": "0557", "name": "宿州", "pno": "030"},
                {"id": "308", "ccode": "0562", "name": "铜陵", "pno": "030"},
                {"id": "303", "ccode": "0553", "name": "芜湖", "pno": "030"},
                {"id": "311", "ccode": "0563", "name": "宣城", "pno": "030"}
            ], "051": [
                {"id": "510", "ccode": "020", "name": "广州", "pno": "051"},
                {"id": "540", "ccode": "0755", "name": "深圳", "pno": "051"},
                {"id": "620", "ccode": "0756", "name": "珠海", "pno": "051"},
                {"id": "560", "ccode": "0754", "name": "汕头", "pno": "051"},
                {"id": "558", "ccode": "0751", "name": "韶关", "pno": "051"},
                {"id": "670", "ccode": "0762", "name": "河源", "pno": "051"},
                {"id": "528", "ccode": "0753", "name": "梅州", "pno": "051"},
                {"id": "570", "ccode": "0752", "name": "惠州", "pno": "051"},
                {"id": "525", "ccode": "0660", "name": "汕尾", "pno": "051"},
                {"id": "580", "ccode": "0769", "name": "东莞", "pno": "051"},
                {"id": "556", "ccode": "0760", "name": "中山", "pno": "051"},
                {"id": "550", "ccode": "0750", "name": "江门", "pno": "051"},
                {"id": "530", "ccode": "0757", "name": "佛山", "pno": "051"},
                {"id": "565", "ccode": "0662", "name": "阳江", "pno": "051"},
                {"id": "520", "ccode": "0759", "name": "湛江", "pno": "051"},
                {"id": "568", "ccode": "0668", "name": "茂名", "pno": "051"},
                {"id": "536", "ccode": "0758", "name": "肇庆", "pno": "051"},
                {"id": "535", "ccode": "0763", "name": "清远", "pno": "051"},
                {"id": "531", "ccode": "0768", "name": "潮州", "pno": "051"},
                {"id": "526", "ccode": "0663", "name": "揭阳", "pno": "051"},
                {"id": "538", "ccode": "0766", "name": "云浮", "pno": "051"},
                {"id": "533", "ccode": "0754", "name": "潮阳", "pno": "051"},
                {"id": "678", "ccode": "0757", "name": "顺德", "pno": "051"}
            ], "079": [
                {"id": "790", "ccode": "0891", "name": "拉萨", "pno": "079"},
                {"id": "797", "ccode": "0892", "name": "日喀则", "pno": "079"},
                {"id": "798", "ccode": "0893", "name": "山南", "pno": "079"},
                {"id": "799", "ccode": "0894", "name": "林芝", "pno": "079"},
                {"id": "800", "ccode": "0895", "name": "昌都", "pno": "079"},
                {"id": "801", "ccode": "0896", "name": "那曲", "pno": "079"},
                {"id": "802", "ccode": "0897", "name": "阿里", "pno": "079"}
            ], "087": [
                {"id": "870", "ccode": "0931", "name": "兰州", "pno": "087"},
                {"id": "931", "ccode": "0937", "name": "酒泉", "pno": "087"},
                {"id": "873", "ccode": "0934", "name": "庆阳", "pno": "087"},
                {"id": "877", "ccode": "0938", "name": "天水", "pno": "087"},
                {"id": "874", "ccode": "0935", "name": "武威", "pno": "087"},
                {"id": "878", "ccode": "0930", "name": "临夏", "pno": "087"},
                {"id": "879", "ccode": "0943", "name": "白银", "pno": "087"},
                {"id": "871", "ccode": "0932", "name": "定西", "pno": "087"},
                {"id": "872", "ccode": "0933", "name": "平凉", "pno": "087"},
                {"id": "960", "ccode": "0939", "name": "陇南", "pno": "087"},
                {"id": "875", "ccode": "0936", "name": "张掖", "pno": "087"},
                {"id": "876", "ccode": "0937", "name": "嘉峪关", "pno": "087"},
                {"id": "930", "ccode": "0935", "name": "金昌", "pno": "087"},
                {"id": "961", "ccode": "0941", "name": "甘南", "pno": "087"}
            ], "086": [
                {"id": "731", "ccode": "0875", "name": "保山", "pno": "086"},
                {"id": "864", "ccode": "0878", "name": "楚雄", "pno": "086"},
                {"id": "862", "ccode": "0872", "name": "大理", "pno": "086"},
                {"id": "730", "ccode": "0692", "name": "德宏", "pno": "086"},
                {"id": "735", "ccode": "0887", "name": "迪庆", "pno": "086"},
                {"id": "861", "ccode": "0873", "name": "红河", "pno": "086"},
                {"id": "860", "ccode": "0871", "name": "昆明", "pno": "086"},
                {"id": "863", "ccode": "0888", "name": "丽江", "pno": "086"},
                {"id": "733", "ccode": "0883", "name": "临沧", "pno": "086"},
                {"id": "734", "ccode": "0886", "name": "怒江", "pno": "086"},
                {"id": "866", "ccode": "0874", "name": "曲靖", "pno": "086"},
                {"id": "869", "ccode": "0879", "name": "普洱", "pno": "086"},
                {"id": "732", "ccode": "0876", "name": "文山", "pno": "086"},
                {"id": "736", "ccode": "0691", "name": "西双版纳", "pno": "086"},
                {"id": "865", "ccode": "0877", "name": "玉溪", "pno": "086"},
                {"id": "867", "ccode": "0870", "name": "昭通", "pno": "086"},
                {"id": "868", "ccode": "0691", "name": "景洪", "pno": "086"}
            ], "085": [
                {"id": "850", "ccode": "0851", "name": "贵阳", "pno": "085"},
                {"id": "787", "ccode": "0851", "name": "遵义", "pno": "085"},
                {"id": "789", "ccode": "0851", "name": "安顺", "pno": "085"},
                {"id": "788", "ccode": "0854", "name": "黔南", "pno": "085"},
                {"id": "786", "ccode": "0855", "name": "黔东南", "pno": "085"},
                {"id": "785", "ccode": "0856", "name": "铜仁", "pno": "085"},
                {"id": "851", "ccode": "0857", "name": "毕节", "pno": "085"},
                {"id": "853", "ccode": "0858", "name": "六盘水", "pno": "085"},
                {"id": "852", "ccode": "0859", "name": "黔西南", "pno": "085"}
            ], "084": [
                {"id": "841", "ccode": "029", "name": "西安", "pno": "084"},
                {"id": "844", "ccode": "029", "name": "咸阳", "pno": "084"},
                {"id": "843", "ccode": "0913", "name": "渭南", "pno": "084"},
                {"id": "840", "ccode": "0917", "name": "宝鸡", "pno": "084"},
                {"id": "849", "ccode": "0916", "name": "汉中", "pno": "084"},
                {"id": "842", "ccode": "0911", "name": "延安", "pno": "084"},
                {"id": "845", "ccode": "0912", "name": "榆林", "pno": "084"},
                {"id": "846", "ccode": "0919", "name": "铜川", "pno": "084"},
                {"id": "848", "ccode": "0915", "name": "安康", "pno": "084"},
                {"id": "847", "ccode": "0914", "name": "商洛", "pno": "084"}
            ], "083": [
                {"id": "831", "ccode": "023", "name": "重庆", "pno": "083"},
                {"id": "832", "ccode": "023", "name": "涪陵", "pno": "083"},
                {"id": "833", "ccode": "023", "name": "万县", "pno": "083"},
                {"id": "834", "ccode": "023", "name": "黔江", "pno": "083"},
                {"id": "835", "ccode": "023", "name": "巫山", "pno": "083"}
            ], "081": [
                {"id": "810", "ccode": "028", "name": "成都", "pno": "081"},
                {"id": "813", "ccode": "0812", "name": "攀枝花", "pno": "081"},
                {"id": "815", "ccode": "0830", "name": "泸州", "pno": "081"},
                {"id": "825", "ccode": "0838", "name": "德阳", "pno": "081"},
                {"id": "824", "ccode": "0816", "name": "绵阳", "pno": "081"},
                {"id": "826", "ccode": "0839", "name": "广元", "pno": "081"},
                {"id": "821", "ccode": "0825", "name": "遂宁", "pno": "081"},
                {"id": "816", "ccode": "0832", "name": "内江", "pno": "081"},
                {"id": "814", "ccode": "0833", "name": "乐山", "pno": "081"},
                {"id": "822", "ccode": "0817", "name": "南充", "pno": "081"},
                {"id": "817", "ccode": "0831", "name": "宜宾", "pno": "081"},
                {"id": "823", "ccode": "0826", "name": "广安", "pno": "081"},
                {"id": "820", "ccode": "0818", "name": "达州", "pno": "081"},
                {"id": "827", "ccode": "0827", "name": "巴中", "pno": "081"},
                {"id": "811", "ccode": "0835", "name": "雅安", "pno": "081"},
                {"id": "819", "ccode": "028", "name": "眉山", "pno": "081"},
                {"id": "830", "ccode": "028", "name": "资阳", "pno": "081"},
                {"id": "829", "ccode": "0837", "name": "阿坝", "pno": "081"},
                {"id": "828", "ccode": "0836", "name": "甘孜", "pno": "081"},
                {"id": "812", "ccode": "0834", "name": "凉山", "pno": "081"},
                {"id": "818", "ccode": "0813", "name": "自贡", "pno": "081"}
            ], "061": [
                {"id": "610", "ccode": "0", "name": "香港", "pno": "061"}
            ], "088": [
                {"id": "880", "ccode": "0951", "name": "银川", "pno": "088"},
                {"id": "884", "ccode": "0952", "name": "石嘴山", "pno": "088"},
                {"id": "883", "ccode": "0953", "name": "吴忠", "pno": "088"},
                {"id": "885", "ccode": "0954", "name": "固原", "pno": "088"},
                {"id": "886", "ccode": "0955", "name": "中卫", "pno": "088"}
            ], "089": [
                {"id": "890", "ccode": "0991", "name": "乌鲁木齐", "pno": "089"},
                {"id": "891", "ccode": "0994", "name": "昌吉", "pno": "089"},
                {"id": "893", "ccode": "0993", "name": "石河子", "pno": "089"},
                {"id": "892", "ccode": "0992", "name": "奎屯", "pno": "089"},
                {"id": "952", "ccode": "0901", "name": "塔城", "pno": "089"},
                {"id": "899", "ccode": "0990", "name": "克拉玛依", "pno": "089"},
                {"id": "898", "ccode": "0999", "name": "伊犁", "pno": "089"},
                {"id": "951", "ccode": "0909", "name": "博乐", "pno": "089"},
                {"id": "953", "ccode": "0906", "name": "阿勒泰", "pno": "089"},
                {"id": "894", "ccode": "0995", "name": "吐鲁番", "pno": "089"},
                {"id": "900", "ccode": "0902", "name": "哈密", "pno": "089"},
                {"id": "895", "ccode": "0996", "name": "巴州", "pno": "089"},
                {"id": "896", "ccode": "0997", "name": "阿克苏", "pno": "089"},
                {"id": "897", "ccode": "0998", "name": "喀什", "pno": "089"},
                {"id": "955", "ccode": "0903", "name": "和田", "pno": "089"},
                {"id": "954", "ccode": "0908", "name": "克州", "pno": "089"}
            ]};
            return {
                getProvinceName: function (provinceCode) {
                    for (var pindex = 0; pindex < province.length; pindex++) {
                        var codeFromList = province[pindex]["code"];
                        if (provinceCode == codeFromList) {
                            return province[pindex]["name"];
                        }
                    }
                },
                getCityName: function (provinceCode, cityCode) {
                    if (provinceCode.length == 2) {
                        provinceCode = '0' + provinceCode;
                    }
                    var citys = city[provinceCode];
                    for (var pindex = 0; pindex < citys.length; pindex++) {
                        var codeFromList = citys[pindex]["id"];
                        if (cityCode == codeFromList) {
                            return citys[pindex]["name"];
                        }
                    }
                },
                getAreaCode: function (prvoinceCode,cityCode){
                    if (prvoinceCode.length == 2) {
                        prvoinceCode = '0' + prvoinceCode;
                    }
                    var citys = city[prvoinceCode];
                    for (var pindex = 0; pindex < citys.length; pindex++) {
                        var codeFromList = citys[pindex]["id"];
                        if (cityCode == codeFromList) {
                            return citys[pindex]["ccode"];
                        }
                    }
                },
                getProvinceCodeByAreaCode: function (areacode) {
                    if(areacode.length<3){
                        return false;
                    }
                    for (var pindex=0; pindex<province.length; pindex++){
                        var provId=province[pindex]["id"];
                        var citys=city[provId];
                        for(var cindex=0; cindex<citys.length; cindex++){
                            if(areacode==citys[cindex]["ccode"]){
                                return citys[cindex];
                            }
                        }
                    }
                    return false;
                },
                municipality : "011，013，031，083",
                provinces : province ,
                cities :city,
                getCitiesByPorv : function (provinceCode){
                    return city[provinceCode];
                },
                getEssProvinceCode : function(provinceCode) {/**六位省份编码转3位省份编码*/
                    var provinceList = allArea.PROVINCE_LIST;
                    for(var i=0;i<provinceList.length;i++) {
                        var province = provinceList[i];
                        if(provinceCode == province.PROVINCE_CODE) {
                            return "0" + province.ESS_PROVINCE_CODE;
                        }
                    }
                },
                getEssCityCode : function(provinceCode,cityCode) {/**六位地市编码转3位地市编码  传入参数(六位省份编码,六位地市编码)*/
                    var cityList = allArea.PROVINCE_MAP[provinceCode];
                    for(var i=0;i<cityList.length;i++) {
                        var city = cityList[i];
                        if(cityCode == city.CITY_CODE) {
                            return city.ESS_CITY_CODE;
                        }
                    }
                },
                get6ProvinceCode : function(provinceCode) {/**3位省份编码转6位省份编码*/
                    var provinceList = allArea.PROVINCE_LIST;
                    for(var i=0;i<provinceList.length;i++) {
                        var province = provinceList[i];
                        if(provinceCode == "0"+province.ESS_PROVINCE_CODE) {
                            return province.PROVINCE_CODE;
                        }
                    }
                },
                get6CityCode : function(provinceCode,cityCode) {/**3位地市编码转6位地市编码  传入参数(6位省份编码,3位地市编码)*/
                    var cityList = allArea.PROVINCE_MAP[provinceCode];
                    for(var i=0;i<cityList.length;i++) {
                        var city = cityList[i];
                        if(cityCode == city.ESS_CITY_CODE) {
                            return city.CITY_CODE;
                        }
                    }
                },
                getProvinceBy3Code : function(provinceCode) {/**通过3位省分编码找对应省分信息*/
                var provinceList = allArea.PROVINCE_LIST;
                    for(var i=0;i<provinceList.length;i++) {
                        var province = provinceList[i];
                        if(provinceCode == "0"+province.ESS_PROVINCE_CODE) {
                            return province;
                        }
                    }
                },
                getCityBy3Code : function(provinceCode,cityCode) {/**通过6位省分编码和3位地市编码找对应地市信息*/
                var cityList = allArea.PROVINCE_MAP[provinceCode];
                    for(var i=0;i<cityList.length;i++) {
                        var city = cityList[i];
                        if(cityCode == city.ESS_CITY_CODE) {
                            return city;
                        }
                    }
                },
                getAreaBy3Code : function(cityCode,regionCode) {/**通过6位地市编码及区县编码找对应地市信息*/
                    var cityList = allArea.CITY_MAP[cityCode];
                    for(var i=0;i<cityList.length;i++) {
                        var region = cityList[i];
                        if(regionCode == region.DISTRICT_CODE) {
                            return region;
                        }
                    }
                }
            }

        });
});

