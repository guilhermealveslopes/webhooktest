const express = require('express');
var fs = require('fs');
var path = process.cwd();

var http = require('http');
const bodyParser = require('body-parser');
const shell = require('shelljs');
const axios = require('axios');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


var buffer = fs.readFileSync("/opt/lampp/htdocs/gera/api/hook/producao/.git/refs/heads/master");
var actualDiff = buffer.toString().replace(/(\r\n|\n|\r)/gm, "");

//     shell.exec('/opt/lampp/htdocs/gera/api/hook/teste.sh');
//     res.send('iniciando deploy.....');

axios.get('https://api.github.com/repos/guilhermealveslopes/webhooktest/git/refs')
  .then(response => {
    var remoteDiff = response.data[0].object.sha;

    if(actualDiff != remoteDiff){
        console.log('ta diferente, cria um arquivo ai');
        terminalCommand = async(req, res, erro) =>{ 
            console.log('######################');
            await shell.exec('/opt/lampp/htdocs/gera/api/hook/git_pull.sh');
            console.log('######################');
            await shell.exec('/opt/lampp/htdocs/gera/api/hook/run_build.sh');
            console.log('######################');
            await shell.exec('/opt/lampp/htdocs/gera/api/hook/clone_build.sh');
            console.log('Script End');
        };

        terminalCommand();

    }else{
        console.log('de boa, ta igual');
    }
    
  })
  .catch(error => {
    console.log(error);
  });


app.listen(3001);