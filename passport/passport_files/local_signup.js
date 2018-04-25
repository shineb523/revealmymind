/**
 * 패스포트 설정 파일
 *
 * 로컬 인증방식에서 회원가입에 사용되는 패스포트 설정
 *
 * @date 2016-11-10
 * @author Mike
 */

var LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({
    usernameField: 'userid',
    passwordField: 'userpassword',
    passReqToCallback: true // 이 옵션을 설정하면 아래 콜백 함수의 첫번째 파라미터로 req 객체 전달됨
}, function(req, userid, userpassword, done) {

    console.log('passport의 local-signup 호출됨 : ' + userid + ', ' + userpassword);

    process.nextTick(function() {

        var database = req.app.get('database');
        database.user_account_model.findOne({
            'id': userid
        }, function(err, user) {
            // 에러 발생 시
            if (err) {
                return done(err);
            }

            // 기존에 사용자 정보가 있는 경우
            if (user) {
                console.log('기존에 계정이 있음.');
                return done(null, false, req.flash('signupMessage', '계정이 이미 있습니다.')); // 검증 콜백에서 두 번째 파라미터의 값을 false로 하여 인증 실패한 것으로 처리
            } else {
                // 모델 인스턴스 객체 만들어 저장
                var user = new database.user_account_model({
                    'id': userid,
                    'password': userpassword
                });
                user.save(function(err) {
                    if (err) {
                        throw err;
                    }

                    console.log("사용자 데이터 추가함.");
                    return done(null, user); // 검증 콜백에서 두 번째 파라미터의 값을 user 객체로 넣어 인증 성공한 것으로 처리
                });
            }



        });

    });

});
