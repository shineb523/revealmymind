/**
 * 패스포트 사용하기
 *
 * 패스포트 모듈에서 로그인 인증을 처리하도록 함
 * 페이스북으로 로그인, 트위터로 로그인, 구글로 로그인 기능 포함
 *
 * @date 2016-11-10
 * @author Mike
 */


// Express 기본 모듈 불러오기
var express = require('express'),
    http = require('http'),
    path = require('path');

// Express의 미들웨어 불러오기
var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    static = require('serve-static'),
    errorHandler = require('errorhandler');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// Session 미들웨어 불러오기
var expressSession = require('express-session');


//===== Passport 사용 =====//
var passport = require('passport');
var flash = require('connect-flash');


// 모듈로 분리한 설정 파일 불러오기
var config = require('./config/config');

// 모듈로 분리한 데이터베이스 파일 불러오기
var database = require('./database/database_loader');

// 모듈로 분리한 라우팅 파일 불러오기
var route_loader = require('./routes/route_loader');

var handler_loader = require('./handlers/handler_loader');

var jayson = require('jayson');

var socketio = require('socket.io');

var cors = require('cors');

// 익스프레스 객체 생성
var app = express();

app.use(cors());

//===== 뷰 엔진 설정 =====//
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
console.log('뷰 엔진이 ejs로 설정되었습니다.');


//===== 서버 변수 설정 및 static으로 public 폴더 설정  =====//
console.log('config.server_port : %d', config.server_port);
app.set('port', process.env.PORT || 3000);


// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({
    extended: false
}))

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())

// public 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));

// cookie-parser 설정
app.use(cookieParser());

// 세션 설정
app.use(expressSession({
    key: 'sid',
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));


//===== Passport 사용 설정 =====//
// Passport의 세션을 사용할 때는 그 전에 Express의 세션을 사용하는 코드가 있어야 함
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



//라우팅 정보를 읽어들여 라우팅 설정
var router = express.Router();
route_loader(app, router);


// 패스포트 설정
var configPassport = require('./passport/passport_init');
configPassport(app, router, passport);


var jsonrpc_api_path = config.jsonrpc_api_path || '/api';
handler_loader(jayson, app, jsonrpc_api_path);
console.log('JSON-RPC를 [' + jsonrpc_api_path + '] 패스에서 사용하도록 설정함.');

//===== 404 에러 페이지 처리 =====//
var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);


//===== 서버 시작 =====//

//확인되지 않은 예외 처리 - 서버 프로세스 종료하지 않고 유지함
process.on('uncaughtException', function(err) {
    console.log('uncaughtException 발생함 : ' + err);
    console.log('서버 프로세스 종료하지 않고 유지함.');

    console.log(err);
});

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function() {
    console.log("프로세스가 종료됩니다.");
    app.close();
});

app.on('close', function() {
    console.log("Express 서버 객체가 종료됩니다.");
    if (database.db) {
        database.db.close();
    }
});

// 시작된 서버 객체를 리턴받도록 합니다.
var server = http.createServer(app).listen(app.get('port'), function() {
    console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));

    // 데이터베이스 초기화
    database.init(app, config);

});
