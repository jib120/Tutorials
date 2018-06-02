const express = require('express');
const bodyParser = require('body-parser');

const compiler = require('./compiler/compiler');
const questionApi = require('./compiler/questionApi');

const app = express();
// Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// serve static files
app.use(express.static('dist'));

app.get('/api/task/:lang', (req, res) => {
  const lang = req.params.lang;
  console.log(lang);
  questionApi.getTask(lang, (content) => {
    const task = {
      lang: 'java',
      code: content,
    };
    res.send(JSON.stringify(task));
  });
});

app.post('/api/runc', (req, res) => {
  const question = req.body.question;
  console.log('question =');
  console.log(req.body);
  // compiler.clang('HelloC.c');
  compiler.clang('HelloC.c', (response) => {
    const result = {
      key: '0',
      message: response,
    };
    res.end(JSON.stringify(result));
  });
});
app.post('/api/runjava', (req, res) => {
  console.log(req.body);
  const task = req.body;
  console.log('task =');
  console.log(task);
  // compiler.java('HelloJava.java');
  questionApi.saveTask('HelloJava2.java', task.code, () => {
    compiler.java('HelloJava2.java', (response) => {
      const result = {
        key: '0',
        message: response,
      };
      res.end(JSON.stringify(result));
    });
  });
});
app.listen(8080, () => console.log('Listening on port 8080!'));
