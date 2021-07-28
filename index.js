const http = require("http");
const fs = require("fs");
const port = 3000; // 변경 가능

const cookieParser = (req) => {
  const list = req.headers.cookie.split(';');
  const cookies = [];
  
  list.map(item => {
    const [key, value] = item.split('=');
    cookies[key.trim()] = value;
  })
  return cookies;
}

http.createServer((req, res) => {
  const body = "";
  req.on("data", (chunk) => {
    body += chunk; // 필요한 경우 body 사용
  });
  console.log("request arrvied");

  req.on("end", () => {
    /* HTTP 버전이 1.1이 아닐 경우 사용자에게 적절한 응답 코드 보내 요청 거절하기 */
    if(req.httpVersion !== '1.1'){
      res.statusCode = 505;
      res.end();
      return;
    }

    /* 라우팅 */
    if(req.url == '/'){
      const isLogin = cookieParser(req).login == 'true';
      if(isLogin){
        fs.readFile('public/index.html', (err, html) => {
          res.end(html);
        })
      }
      else{
        res.writeHead(302, { Location: '/login' });
        res.end();
      }
    }
    else if(req.url == '/login' && req.method === 'GET'){
      fs.readFile('public/login.html', (err, html) => {
        res.end(html);
      })
    }
    else if(req.url == '/login' && req.method === 'POST'){
      res.writeHead(302, {
        'Set-Cookie': 'login=true; Max-Age=2592000',
        Location: '/'
      });
      res.end();
    }
    else if(req.url == '/logout'){
      res.writeHead(302, {
        'Set-Cookie': 'login=false; Max-Age=2592000',
        Location: '/login'
      });
      res.end();
    }
    else{
      fs.readFile('public/not-found.html', (err, html) => {
        res.statusCode = 404;
        res.end(html);
      })
    }
  });
}).listen(port, () => {
  console.log("Server listening on " + port);
});
