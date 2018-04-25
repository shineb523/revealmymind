/**
 * 라우팅 모듈을 로딩하여 설정
 *
 * 라우팅 모듈 파일에 대한 정보는 config.js의 route_info 배열에 등록함
 *
 * @date 2016-11-10
 * @author Mike
 */

var route_config = require('../config/config');


// route_info에 정의된 라우팅 정보 처리
module.exports = function initRoutes(app, router) {
    var infoLen = route_config.route_info.length;
    console.log('설정에 정의된 라우팅 모듈의 수 : %d', infoLen);

    for (var i = 0; i < infoLen; i++) {
        var curItem = route_config.route_info[i];

		var cur_method = require(curItem.method_file_path);

        console.log('%s 파일에서 모듈함수를 읽어옴.', curItem.method_file_path);

        //  라우팅 처리
        if (curItem.type == 'get') {
            router.route(curItem.path).get(cur_method);
        } else if (curItem.type == 'post') {
            router.route(curItem.path).post(cur_method);
        } else {
			console.log('route_loader에서 type 예외 오류 발생.');
            return;
		}



        console.log('라우팅 경로 [%s]이(가) 설정됨.', curItem.path);
    }

    // 라우터 객체 등록
    app.use('/', router);
}
