import http from 'http'
import path from 'path'
import fs from 'fs'

import bodyParser from 'body-parser'

const app = new http.Server();
const urlencodedParser = bodyParser.urlencoded({extended: false});

function sendFile(file, res) {
  fs.readFile(file, (err, content) => {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(content)
  })
}

function showError(error) {
  console.log(error);

  response.writeHead(500);
  response.end('Internal Server Error');
}

app.on('request', (req, res) => {
  const file = path.normalize('.' + req.url)

  if (req.url === '/') {
    sendFile('index.html', res)
    return true
  } else if (req.url === '/register') {
    if (!req.body) {
      res.writeHead(400);
      res.end('Empty body');
    }
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify({'status': 'success'}))
  }

  fs.exists(file, function (exists) {
    if (exists) {
      fs.stat(file, function (error, stat) {
        let readStream

        if (error) {
          return showError(error);
        }

        if (stat.isDirectory()) {
          res.writeHead(403);
          res.end('Forbidden');
        }
        else {
          readStream = fs.createReadStream(file);

          readStream.on('error', showError);

          res.writeHead(200);
          readStream.pipe(res);
        }
      });
    }
    else {
      res.writeHead(404);
      res.end('Not found');
    }
  });
})
// app.get('*', function(req, res) {
//     res.render('index.html')
// });

// app.post('/register', urlencodedParser, (req, res) => {
//     if (!req.body) return res.sendStatus(400)
//     res.writeHead(200, {'Content-Type': 'application/json'});
//     res.end(JSON.stringify({'status': 'success'}));
// })

// app.post('/error', urlencodedParser, (req, res) => {
//     if (!req.body) return res.sendStatus(400)
//     res.end(JSON.stringify({
//         'status': 'error',
//         'reason': 'Server error'
//     }));
// })

// app.post('/timeout', urlencodedParser, (req, res) => {
//     if (!req.body) return res.sendStatus(400)
//     res.end(JSON.stringify({
//         'status': 'progress',
//         'timeout': 1000
//     }));
// })

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
});