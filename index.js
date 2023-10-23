'use strict';

/**
    * Developers: @KanzuWakazaki - @HarryWakazaki
    ** A few words about developer appstate security.
    *! Statement renouncing responsibility for the security of appstate encryption of the following operating systems: windows, Android, Linux operating systems,.. (maybe repl.it?),
    *! because the above operating systems are private (except rep.it if the fraudster does not own your account or invite link to join).
    *! If the intruder owns the computer, these private operating systems,the security of this fca cannot guarantee 100% of the time.
    ** If the grammar is wrong, please understand because I'm just a kid 🍵.
*/

/!-[ Global Set ]-!/

global.Fca = new Object({
    isThread: new Array(),
    isUser: new Array(),
    startTime: Date.now(),
    Setting: new Map(),
    Version: require('./package.json').version,
    Require: new Object({
        fs: require("fs"),
        Fetch: require('got'),
        log: require("npmlog"),
        utils: require("./utils"),
        logger: require('./logger'),
        languageFile: require('./Language/index.json'),
        Database: require("./Extra/Database"),
        Security: require('./Extra/Src/uuid')
    }),
    getText: function(/** @type {any[]} */...Data) {
        var Main = (Data.splice(0,1)).toString();
            for (let i = 0; i < Data.length; i++) Main = Main.replace(RegExp(`%${i + 1}`, 'g'), Data[i]);
        return Main;
    },
    Data: new Object({
        ObjPriyansh: {
            "Language": "en",
            "PreKey": "",
            "AutoUpdate": false,
            "MainColor": "#9900FF",
            "MainName": "[ FCA-PRIYANSH ]",
            "Logo": true,
            "Uptime": true,
            "Config": "default",
            "Login2Fa": false,
            "AutoLogin": false,
            "BroadCast": true,
            "AuthString": "SD4S XQ32 O2JA WXB3 FUX2 OPJ7 Q7JZ 4R6Z",
            "EncryptFeature": true,
            "ResetDataLogin": false,
            "AutoRestartMinutes": 0,
            "HTML": {   
                "HTML": true,
                "UserName": "Guest"
            }   
        },
        CountTime: function() {
            var fs = global.Fca.Require.fs;
            if (fs.existsSync(__dirname + '/CountTime.json')) {
                try {
                    var data = Number(fs.readFileSync(__dirname + '/CountTime.json', 'utf8')),
                    hours = Math.floor(data / (60 * 60));
                }
                catch (e) {
                    fs.writeFileSync(__dirname + '/CountTime.json', 0);
                    hours = 0;
                }
            }
            else {
                hours = 0;
            }
            return `${hours} Hours`;
        }
    }),
    AutoLogin: async function () {
        var Database = global.Fca.Require.Database;
        var logger = global.Fca.Require.logger;
        var Email = (await global.Fca.Require.Database.get('Account')).replace(RegExp('"', 'g'), ''); //hmm IDK
        var PassWord = (await global.Fca.Require.Database.get('Password')).replace(RegExp('"', 'g'), '');
        login({ email: Email, password: PassWord},async (error, api) => {
            if (error) {
                logger.Error(JSON.stringify(error,null,2), function() { logger.Error("AutoLogin Failed!", function() { process.exit(0); }) });
            }
            try {
                await Database.set("TempState", api.getAppState());
            }
            catch(e) {
                logger.Warning(global.Fca.Require.Language.Index.ErrDatabase);
                    logger.Error();
                process.exit(0);
            }
            process.exit(1);
        });
    }
});

/!-[ Check File To Run Process ]-!/

let Boolean_Fca = ["AutoUpdate","Uptime","BroadCast","EncryptFeature","AutoLogin","ResetDataLogin","Login2Fa","Logo"];
let String_Fca = ["MainName","PreKey","Language","AuthString","Config"]
let Number_Fca = ["AutoRestartMinutes"];
let All_Variable = Boolean_Fca.concat(String_Fca,Number_Fca);

try {
    if (!global.Fca.Require.fs.existsSync(process.cwd() + '/PriyanshFca.json')) {
        global.Fca.Require.fs.writeFileSync(process.cwd() + "/PriyanshFca.json", JSON.stringify(global.Fca.Data.ObjPriyansh, null, "\t"));
        process.exit(1);
    }

try {
    var DataLanguageSetting = require(process.cwd() + "/PriyanshFca.json");
}
catch (e) {
    global.Fca.Require.logger.Error('Detect Your FastConfigFca Settings Invalid!, Carry out default restoration');
    global.Fca.Require.fs.writeFileSync(process.cwd() + "/PriyanshFca.json", JSON.stringify(global.Fca.Data.ObjPriyansh, null, "\t"));     
    process.exit(1)
}
    if (global.Fca.Require.fs.existsSync(process.cwd() + '/PriyanshFca.json')) {
        try { 
            if (DataLanguageSetting.Logo != undefined) {
                    delete DataLanguageSetting.Logo
                global.Fca.Require.fs.writeFileSync(process.cwd() + "/PriyanshFca.json", JSON.stringify(DataLanguageSetting, null, "\t"));        
            }
        }
        catch (e) {
            console.log(e);
        }
        if (!global.Fca.Require.languageFile.some((/** @type {{ Language: string; }} */i) => i.Language == DataLanguageSetting.Language)) { 
            global.Fca.Require.logger.Warning("Not Support Language: " + DataLanguageSetting.Language + " Only 'en' and 'vi'");
            process.exit(0); 
        }
        var Language = global.Fca.Require.languageFile.find((/** @type {{ Language: string; }} */i) => i.Language == DataLanguageSetting.Language).Folder.Index;
        global.Fca.Require.Language = global.Fca.Require.languageFile.find((/** @type {{ Language: string; }} */i) => i.Language == DataLanguageSetting.Language).Folder;
    } else process.exit(1);
        for (let i in DataLanguageSetting) {
            if (Boolean_Fca.includes(i)) {
                if (global.Fca.Require.utils.getType(DataLanguageSetting[i]) != "Boolean") return logger.Error(i + " Is Not A Boolean, Need To Be true Or false !", function() { process.exit(0) });
                else continue;
            }
            else if (String_Fca.includes(i)) {
                if (global.Fca.Require.utils.getType(DataLanguageSetting[i]) != "String") return logger.Error(i + " Is Not A String, Need To Be String!", function() { process.exit(0) });
                else continue;
            }
            else if (Number_Fca.includes(i)) {
                if (global.Fca.Require.utils.getType(DataLanguageSetting[i]) != "Number") return logger.Error(i + " Is Not A Number, Need To Be Number !", function() { process.exit(0) });
                else continue;
            }
        }
        for (let i of All_Variable) {
            if (!DataLanguageSetting[All_Variable[i]] == undefined) {
                DataLanguageSetting[All_Variable[i]] = global.Fca.Data.ObjPriyansh[All_Variable[i]];
                global.Fca.Require.fs.writeFileSync(process.cwd() + "/PriyanshFca.json", JSON.stringify(DataLanguageSetting, null, "\t"));
            }
            else continue; 
        }
    global.Fca.Require.Priyansh = DataLanguageSetting;
}
catch (e) {
    console.log(e);
    global.Fca.Require.logger.Error();
}

/!-[ Require config and use ]-!/

if (global.Fca.Require.Priyansh.Config != 'default') {
    //do ssth
}

/!-[ Require All Package Need Use ]-!/

var utils = global.Fca.Require.utils,
    logger = global.Fca.Require.logger,
    fs = global.Fca.Require.fs,
    getText = global.Fca.getText,
    log = global.Fca.Require.log,
    Fetch = global.Fca.Require.Fetch,
    express = require("express")(),
    { join, resolve } = require('path'),
    cheerio = require("cheerio"),
    StateCrypt = {},
    { readFileSync } = require('fs-extra'),
    Database = require("./Extra/Database"),
    readline = require("readline"),
    chalk = require("chalk"),
    figlet = require("figlet"),
    os = require("os"),
    Security = require("./Extra/Security/Index");

/!-[ Set Variable For Process ]-!/

log.maxRecordSize = 100;
var checkVerified = null;
var Boolean_Option = ['online','selfListen','listenEvents','updatePresence','forceLogin','autoMarkDelivery','autoMarkRead','listenTyping','autoReconnect','emitReady'];

/!-[ Set And Check Template HTML ]-!/

var css = readFileSync(join(__dirname, 'Extra', 'Html', 'Classic', 'style.css'));
var js = readFileSync(join(__dirname, 'Extra', 'Html', 'Classic', 'script.js'));

/!-[ Function Generate HTML Template ]-!/

/**
 * It returns a string of HTML code.
 * @param UserName - The username of the user
 * @param Type - The type of user, either "Free" or "Premium"
 * @param link - The link to the music you want to play
 * @returns A HTML file
 */

function ClassicHTML(UserName,Type,link) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Priyanshu Rajput Info</title>
    <!--font awasome icons-->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
    <!--my css file-->
    <link rel="stylesheet" href="style.css">
</head>
<body >
    <video autoplay muted plays-inline loop>
        <source src="https://imgur.com/aoGxVLX.mp4" type="video/mp4">
    </video>
    <div class="container">
        <button class="call"><i class="fa-solid fa-phone"></i></button>
    <div class="card move">
       <div class="imgbox">
          <img src="https://i.imgur.com/eDbdlvd.jpg" alt="">
       </div>
       <div class="name-job">
          <h3>Priyansh Rajput</h3>
          <h5>Web Developer</h5>
        </div>
        <div class="skills">
          <button class="btn-Follow"><a href="https://facebook.com/Priyanshu.Rajput.Official" target="_blank">Follow</a></button>
          <button class="btn-Message"><a href=" https://telegram.me/Priyanshrajput" target="_blank">Message!</a></button>
        </div>

        </div>
        <div class="icons">
            <div class="icon">
                <i class="fa-brands fa-twitter front"></i>
                <i class="fa-brands fa-twitter back"></i>
                <i class="fa-brands fa-twitter left"></i>
                <i class="fa-brands fa-twitter right"></i>
                <i class="fa-brands fa-twitter top"></i>
                <i class="fa-brands fa-twitter bottom"></i>
            </div>
            <div class="icon">
                <i class="fa-brands fa-youtube front"></i>
                <i class="fa-brands fa-youtube back"></i>
                <i class="fa-brands fa-youtube left"></i>
                <i class="fa-brands fa-youtube right"></i>
                <i class="fa-brands fa-youtube top"></i>
                <i class="fa-brands fa-youtube bottom"></i>
            </div>
            <div class="icon">
                <i class="fa-brands fa-facebook-f front"></i>
                <i class="fa-brands fa-facebook-f back"></i>
                <i class="fa-brands fa-facebook-f left"></i>
                <i class="fa-brands fa-facebook-f right"></i>
                <i class="fa-brands fa-facebook-f top"></i>
                <i class="fa-brands fa-facebook-f bottom"></i>
            </div>
            <div class="icon">
                <i class="fa-brands fa-whatsapp front"></i>
                <i class="fa-brands fa-whatsapp back"></i>
                <i class="fa-brands fa-whatsapp left"></i>
                <i class="fa-brands fa-whatsapp right"></i>
                <i class="fa-brands fa-whatsapp top"></i>
                <i class="fa-brands fa-whatsapp bottom"></i>
            </div>
        </div>
    </div>
</body>
</html>
<script>
    var container=document.querySelector('.container')
    var icons=document.querySelector('.icons')
    var call=document.querySelector('.call')
    var body =document.querySelector('body')
    var card=document.querySelector('.card')
    // body.addEventListener('onload',function(){
        setTimeout(function(){
        container.classList.add('move')
    },3000)
    // })
   setTimeout(function(){
    icons.style="opacity: 0"
    call.style="opacity: 0"
   },2000)
   setTimeout(function(){
    card.classList.remove('move')
    icons.style="opacity: 1"
    call.style="opacity: 1"
   },6000)
    
</script>

<style>/* @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300&display=swap'); */
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
}
:root {
    --width: 250px;
    --height: 260px;
    --i-width: calc(var(--height)*0.25 - 23px);
}

@media only screen and (min-width:64.1875em){
    video{
       height: 100%;
       width: 100%;
    }
   
}
@media only screen and (min-width:46.1875em) and (max-width:63.9375em){
    video{
        position: fixed;
        top:0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #000;
        height: 100%;
        display: block;
    }
}
@media only screen and (max-width:46.1875em){
    video{
        position: fixed;
        top:0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #000;
        height: 100%;
        display: block;
    }
   
}
body {
    height: 100vh;
    width: 100vw;
    background-color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    perspective: 600px;
    overflow: hidden;
}
body::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(#E91e63, #FF0);
    clip-path: circle(22% at 30% 22%);
    z-index: -1;
}
body::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(#FFF, #DA00FF);
    clip-path: circle(25% at 70% 80%);
    z-index: -1;
}
.container {
    position: fixed;
    transform-style: preserve-3d;

    display: none;

    z-index: 99;
   
    
}
@keyframes move{
    0%   {
        transform: scale(0);
        /* opacity: 0; */
        border-radius: 50%;
    }
  25%  {
    transform: scale(0.20);
    /* opacity: 0.3; */
    border-radius: 25%;
}
  50%  {
    transform: scale(0.50);
    /* opacity: 0,6; */
}
75%  {
    transform: scale(0.75);
    /* opacity: 0,6; */
}
  100% {
    transform: scale(1);
    /* opacity: 1; */
}
}
.container.move{
    animation: move linear 1.5s;
    display: block;
}
.container::before{
    content: "";
    position: absolute;
    top:-2px;
    left: -2px;
    width:calc(100% + 5px) ;
    height: calc(100% + 5px);
    border:3px solid linear-gradient(45deg,#e6fb04,#00ff66,#00ffff,#ff00ff
    ,#ff0099,#6e0dde,#ff3300,#099fff);
    /* background: linear-gradient(45deg,#e6fb04,#00ff66,#00ffff,#ff00ff
    ,#ff0099,#6e0dde,#ff3300,#099fff); */
    animation: animate 20s linear infinite;
    background-size: 400%;
    /* background:linear-gradient(transparent,#45f3ff,#45f3ff,#45f3ff,transparent); */
    z-index: -1;
    
}
/* .container::after{
    content: "";
    position: absolute;
    
    inset: 3px;
} */
@keyframes animate{
    0%{
        /* transform: translate(-50%,-50%) rotate(0deg); */

        background-position: 0 0;
    }
    50%{
        background-position:100% 0;
    }
    100%{
        /* transform: translate(-50%,-50%) rotate(360deg); */
        background-position: 0 0;
    }
}
.card {
    position: relative;
    width: var(--width);
    height: var(--height);
    background-color: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(9px);
    border-top: 1px solid #FFF2;
    border-left: 1px solid #FFF2;
    box-shadow: 4px 4px 12px #0004;
   
  
    color: #FFF;
    overflow: hidden;
    transition: transform 0.7s;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    transition: 1s linear;
}
.card.move{
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    padding: 0px;
    
}
.card.move .imgbox{
    transform: translateY(0);
}
.card.move.card:before{
    opacity: 0;
}
.card::before {
    content: '';
    position: absolute;
    left: -99%;
    width: 70px;
    height: 400px;
    background-color: #FFFB;
    transform: rotate(38deg) translateY(-25%);
    z-index: 1;
}
.container:hover .card:before {
    animation: brightness 0.8s 1 forwards;
}
@keyframes brightness {
    0% {
        left: -99%;
    }
    100% {
        left: 120%;
    }
}
.imgbox {
    width: 115px;
    height: 115px;
    border: 5px solid transparent;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.533);
    border-radius: 50%;
    overflow: hidden;
    text-align: center;
    transition: 1s;
    transform: translateY(10px);
}
.imgbox:hover{
    width: 100%;
    height: 100%;
    border: none;
    border-radius: unset;
    transform: translateY(0px);
}
.imgbox:hover.card{
    padding: 0;
}
.imgbox img {
    width: 100%;
    height: 100%;
    
}
.name-job {
    width: 100%;
    text-align: center;
    text-shadow: 1px 2px 2px #000;
    /* margin-bottom: 40px; */
    margin-top: 10px
}

.name-job h3 {
    margin-bottom: 0.1em;
}
.name-job h5 {
    color: rgb(36, 219, 36);
    line-height: 25px;
}
.info {
    grid-column: 2 / 4;
    grid-row: 1 / 3;
    padding: 7px;
    line-height: 1.8;
    font-weight: 200;
}
.skills {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 6px;
}
.skills button{
    padding: 5px 10px;
    width: 85px;
    margin: 5px;
   
   
    cursor: pointer;
}
.btn-Follow a{
    text-decoration: none;
    color: black;
}
.btn-Follow{
    background-color: rgb(36, 219, 36);
    border-radius: 1px;
    border: none;
}
.btn-Follow:hover{
    background-color:  rgb(2, 250, 2);
    
}
.btn-Message a{
    text-decoration: none;
    color: rgb(36, 219, 36);
}
.btn-Message a:hover{
    color: #000;
}
.btn-Message{
    border: 1px solid rgb(36, 219, 36);
    border-radius: 3px;
    background-color: transparent;
    color: #fff;
}
.btn-Message:hover{
    background-color:  rgb(2, 250, 2);
    color: red;
}
.skills .fa-brands {
    cursor: pointer;
    position: relative;
    width: 45px;
    height: 45px;
    background-color: #FFF5;
    box-shadow: 0px 2px 4px #0008, 0px -1px 1px #FFF;
    display: grid;
    place-content: center;
    font-size: 1.22em;
    border-radius: 50%;
    transition: 0.3s;
}
.skills .fa-brands:hover {
    background-color: #FFF;
    color: #222;
}
.call {
    cursor: pointer;
    position: absolute;
    left: 10px;
    top: 10px;
    width: 40px;
    height: 40px;
    background-color: #555;
    color: #FFF;
    border: 2px solid #FFF;
    display: grid;
    place-content: center;
    border-radius: 50%;
    z-index: 1;
    transition: 0.4s;
}
.call:focus {
    transform: rotateY(45deg) translateX(120px) translateZ(-70px);
}
.call:focus ~ .card {
    transform: rotateY(45deg) translateX(140px) translateZ(-120px);
}
.call:focus ~ .icons {
    height: var(--height);
    transform: translateZ(var(--i-width)) translateY(-50%);
}
.icon {
    position: relative;
    width: var(--i-width);
    height: var(--i-width);
    transform-style: preserve-3d;
    transform: rotateX(-40deg) rotateY(45deg);
    transition: 0.7s;
}
.icons {
    position: absolute;
    left: 5px;
    top: 50%;
    width: var(--i-width);
    height: calc(var(--i-width)*4);
    transition: 0.6s;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transform: translateZ(calc(var(--i-width) * -1)) translateY(-50%);
    transform-style: preserve-3d;
}
.icon .fa-brands {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #222;
    color: #0FF;
    border: 1px dashed #0FF;
    display: grid;
    place-content: center;
    font-size: 1.2em;
    transition: 0.5s;
}
.call:hover {
    border-color: #222;
    color: #000;
    background-color: #FC0;
}
.icon:hover {
    cursor: pointer;
    transform: rotateX(-40deg) rotateY(315deg);
}
.icon:hover .fa-brands {
    border-color: inherit;
    background-color: #FFF;
}
.icon:hover .fa-facebook-f {
    color: #0000dd;
}
.icon:hover .fa-twitter {
    color: #002fff;
}
.icon:hover .fa-youtube {
    color: #F00;
}
.icon:hover .fa-whatsapp {
    color: #0F0;
}
.front {
    transform: translateZ(calc(var(--i-width)*0.5));
}
.back {
    transform: translateZ(calc(var(--i-width)* -0.5));
}
.left {
    transform: rotateY(-90deg) translateZ(calc(var(--i-width)* 0.5));
}
.right {
    transform: rotateY(90deg) translateZ(calc(var(--i-width)* 0.5));
}
.bottom {
    transform: rotateX(-90deg) translateZ(calc(var(--i-width)* 0.5));
}
.top {
    transform: rotateX(90deg) translateZ(calc(var(--i-width)* 0.5));
}</style>`
    //lazy to change
}

/!-[ Stating Http Infomation ]-!/

express.set('DFP', (process.env.PORT || process.env.port || 1932));
express.use(function(req, res, next) {
    switch (req.url.split('?')[0]) {
        case '/script.js': {
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
                res.write(js);
            break;
        }
        case '/style.css': {
            res.writeHead(200, { 'Content-Type': 'text/css' });
                res.write(css);
            break;
        }
        // case '/History': {
        //     if (req.query.PassWord == process.env.REPL_OWNER) {
        //         res.writeHead(200, { 'Content-Type': 'application/json charset=utf-8' });
        //         res.write(JSON.stringify(console.history,null,2),'utf8');
        //         res.end();
        //     }
        //     else res.json({
        //         Status: false,
        //         Error: "Thiếu Params ?PassWord=PassWordCuaBan =))"
        //     });
        //     break;
        // }
        default: {
            res.writeHead(200, "OK", { "Content-Type": "text/html" });
            res.write(ClassicHTML(global.Fca.Require.Priyansh.HTML.UserName, global.Fca.Data.PremText.includes("Premium") ? "Premium": "Free", global.Fca.Require.Priyansh.HTML.MusicLink));
        }
    }
    res.end();
})

global.Fca.Require.Web = express;

/!-[ Function setOptions ]-!/

/**
 * @param {{ [x: string]: boolean; selfListen?: boolean; listenEvents?: boolean; listenTyping?: boolean; updatePresence?: boolean; forceLogin?: boolean; autoMarkDelivery?: boolean; autoMarkRead?: boolean; autoReconnect?: boolean; logRecordSize: any; online?: boolean; emitReady?: boolean; userAgent: any; logLevel?: any; pageID?: any; proxy?: any; }} globalOptions
 * @param {{ [x: string]: any; logLevel?: any; forceLogin?: boolean; userAgent?: any; pauseLog?: any; logRecordSize?: any; pageID?: any; proxy?: any; }} options
 */

function setOptions(globalOptions, options) {
    Object.keys(options).map(function(key) {
        switch (Boolean_Option.includes(key)) {
            case true: {
                globalOptions[key] = Boolean(options[key]);
                break;
            }
            case false: {
                switch (key) {
                    case 'pauseLog': {
                        if (options.pauseLog) log.pause();
                            else log.resume();
                        break;
                    }
                    case 'logLevel': {
                        log.level = options.logLevel;
                            globalOptions.logLevel = options.logLevel;
                        break;
                    }
                    case 'logRecordSize': {
                        log.maxRecordSize = options.logRecordSize;
                            globalOptions.logRecordSize = options.logRecordSize;
                        break;
                    }
                    case 'pageID': {
                        globalOptions.pageID = options.pageID.toString();
                        break;
                    }
                    case 'userAgent': {
                        globalOptions.userAgent = (options.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36');
                        break;
                    }
                    case 'proxy': {
                        if (typeof options.proxy != "string") {
                            delete globalOptions.proxy;
                            utils.setProxy();
                        } else {
                            globalOptions.proxy = options.proxy;
                            utils.setProxy(globalOptions.proxy);
                        }
                        break;
                    }
                    default: {
                        log.warn("setOptions", "Unrecognized option given to setOptions: " + key);
                        break;
                    }
                }
            break;
            }
        }
    });
}

/!-[ Function BuildAPI ]-!/

/**
 * @param {any} globalOptions
 * @param {string} html
 * @param {{ getCookies: (arg0: string) => any[]; }} jar
 */

function buildAPI(globalOptions, html, jar) {
    var maybeCookie = jar.getCookies("https://www.facebook.com").filter(function(/** @type {{ cookieString: () => string; }} */val) { return val.cookieString().split("=")[0] === "c_user"; });

    if (maybeCookie.length === 0) {
        switch (global.Fca.Require.Priyansh.AutoLogin) {
            case true: {
                global.Fca.Require.logger.Warning(global.Fca.Require.Language.Index.AutoLogin, function() {
                    return global.Fca.AutoLogin();
                });
                break;
            }
            case false: {
                throw { error: global.Fca.Require.Language.Index.ErrAppState };
                
            }
        }
    }

    if (html.indexOf("/checkpoint/block/?next") > -1) log.warn("login", Language.CheckPointLevelI);

    var userID = maybeCookie[0].cookieString().split("=")[1].toString();
    process.env['UID'] = logger.Normal(getText(Language.UID,userID), userID);

    try {
        clearInterval(checkVerified);
    } catch (e) {
        console.log(e);
    }

    var clientID = (Math.random() * 2147483648 | 0).toString(16);

    var CHECK_MQTT = {
        oldFBMQTTMatch: html.match(/irisSeqID:"(.+?)",appID:219994525426954,endpoint:"(.+?)"/),
        newFBMQTTMatch: html.match(/{"app_id":"219994525426954","endpoint":"(.+?)","iris_seq_id":"(.+?)"}/),
        legacyFBMQTTMatch: html.match(/(\["MqttWebConfig",\[\],{fbid:")(.+?)(",appID:219994525426954,endpoint:")(.+?)(",pollingEndpoint:")(.+?)(3790])/)
    }

    let Slot = Object.keys(CHECK_MQTT);
    
    var mqttEndpoint,region,irisSeqID;
    Object.keys(CHECK_MQTT).map(function(MQTT) {
        if (CHECK_MQTT[MQTT] && !region) {
            switch (Slot.indexOf(MQTT)) {
                case 0: {
                    irisSeqID = CHECK_MQTT[MQTT][1];
                        mqttEndpoint = CHECK_MQTT[MQTT][2];
                        region = new URL(mqttEndpoint).searchParams.get("region").toUpperCase();
                    return;
                }
                case 1: {
                    irisSeqID = CHECK_MQTT[MQTT][2];
                        mqttEndpoint = CHECK_MQTT[MQTT][1].replace(/\\\//g, "/");
                        region = new URL(mqttEndpoint).searchParams.get("region").toUpperCase();
                    return;
                }
                case 2: {
                    mqttEndpoint = CHECK_MQTT[MQTT][4];
                        region = new URL(mqttEndpoint).searchParams.get("region").toUpperCase();
                    return;
                }
            }
        return;
        }
    });    

    var ctx = {
        userID: userID,
        jar: jar,
        clientID: clientID,
        globalOptions: globalOptions,
        loggedIn: true,
        access_token: 'NONE',
        clientMutationId: 0,
        mqttClient: undefined,
        lastSeqId: irisSeqID,
        syncToken: undefined,
        mqttEndpoint: mqttEndpoint,
        region: region,
        firstListen: true
    };

    var api = {
        setOptions: setOptions.bind(null, globalOptions),
        getAppState: function getAppState() {
            return utils.getAppState(jar);
        }
    };

    if (region && mqttEndpoint) {
        //do sth
    }
    else {
        log.warn("login", getText(Language.NoAreaData));
        api["htmlData"] = html;
    }

    var defaultFuncs = utils.makeDefaults(html, userID, ctx);

    fs.readdirSync(__dirname + "/src").filter((/** @type {string} */File) => File.endsWith(".js") && !File.includes('Dev_')).map((/** @type {string} */File) => api[File.split('.').slice(0, -1).join('.')] = require('./src/' + File)(defaultFuncs, api, ctx));

    return {
        ctx,
        defaultFuncs, 
        api
    };
}

/!-[ Function makeLogin ]-!/

/**
 * @param {{ setCookie: (arg0: any, arg1: string) => void; }} jar
 * @param {any} email
 * @param {any} password
 * @param {{ forceLogin: any; }} loginOptions
 * @param {(err: any, api: any) => any} callback
 * @param {any} prCallback
 */

function makeLogin(jar, email, password, loginOptions, callback, prCallback) {
    return function(/** @type {{ body: any; }} */res) {
        var html = res.body,$ = cheerio.load(html),arr = [];

        $("#login_form input").map((i, v) => arr.push({ val: $(v).val(), name: $(v).attr("name") }));

        arr = arr.filter(function(v) {
            return v.val && v.val.length;
        });

        var form = utils.arrToForm(arr);
            form.lsd = utils.getFrom(html, "[\"LSD\",[],{\"token\":\"", "\"}");
            form.lgndim = Buffer.from("{\"w\":1440,\"h\":900,\"aw\":1440,\"ah\":834,\"c\":24}").toString('base64');
            form.email = email;
            form.pass = password;
            form.default_persistent = '0';
            form.locale = 'en_US';     
            form.timezone = '240';
            form.lgnjs = ~~(Date.now() / 1000);

        html.split("\"_js_").slice(1).map((/** @type {any} */val) => {
            jar.setCookie(utils.formatCookie(JSON.parse("[\"" + utils.getFrom(val, "", "]") + "]"), "facebook"),"https://www.facebook.com")
        });

        logger.Normal(Language.OnLogin);
        return utils
            .post("https://www.facebook.com/login/device-based/regular/login/?login_attempt=1&lwv=110", jar, form, loginOptions)
            .then(utils.saveCookies(jar))
            .then(function(/** @type {{ headers: any; }} */res) {
                var headers = res.headers;  
                if (!headers.location) throw { error: Language.InvaildAccount };

                // This means the account has login approvals turned on.
                if (headers.location.indexOf('https://www.facebook.com/checkpoint/') > -1) {
                    logger.Warning(Language.TwoAuth);
                    var nextURL = 'https://www.facebook.com/checkpoint/?next=https%3A%2F%2Fwww.facebook.com%2Fhome.php';

                    return utils
                        .get(headers.location, jar, null, loginOptions)
                        .then(utils.saveCookies(jar))
                        .then(async function(/** @type {{ body: any; }} */res) {
                            if (!await Database.get('ThroughAcc')) {
                                await Database.set('ThroughAcc', email);
                            }
                            else {
                                if (String((await Database.get('ThroughAcc'))).replace(RegExp('"','g'), '') != String(email).replace(RegExp('"','g'), '')) {
                                    await Database.set('ThroughAcc', email);
                                    if (await Database.get('Through2Fa')) {
                                        await Database.delete('Through2Fa');
                                    }
                                }
                            }
                            var html = res.body,$ = cheerio.load(html), arr = [];
                            $("form input").map((i, v) => arr.push({ val: $(v).val(), name: $(v).attr("name") }));
                            arr = arr.filter(v => { return v.val && v.val.length });
                            var form = utils.arrToForm(arr);
                            if (html.indexOf("checkpoint/?next") > -1) {
                                setTimeout(() => {
                                    checkVerified = setInterval((_form) => {}, 5000, {
                                        fb_dtsg: form.fb_dtsg,
                                        jazoest: form.jazoest,
                                        dpr: 1
                                    });
                                }, 2500);  
                                switch (global.Fca.Require.Priyansh.Login2Fa) {
                                    case true: {
                                        try {
                                            const question = question => {
                                                const rl = readline.createInterface({
                                                    input: process.stdin,
                                                    output: process.stdout
                                                });
                                                return new Promise(resolve => {
                                                    rl.question(question, answer => {
                                                        rl.close();
                                                        return resolve(answer);
                                                    });
                                                });
                                            };
                                            async function EnterSecurityCode() {
                                                try {
                                                    var Through2Fa = await Database.get('Through2Fa');
                                                    if (Through2Fa) {
                                                        Through2Fa.map(function(/** @type {{ key: string; value: string; expires: string; domain: string; path: string; }} */c) {
                                                            let str = c.key + "=" + c.value + "; expires=" + c.expires + "; domain=" + c.domain + "; path=" + c.path + ";";
                                                            jar.setCookie(str, "http://" + c.domain);
                                                        })
                                                        var from2 = utils.arrToForm(arr);
                                                            from2.lsd = utils.getFrom(html, "[\"LSD\",[],{\"token\":\"", "\"}");
                                                            from2.lgndim = Buffer.from("{\"w\":1440,\"h\":900,\"aw\":1440,\"ah\":834,\"c\":24}").toString('base64');
                                                            from2.email = email;
                                                            from2.pass = password;
                                                            from2.default_persistent = '0';
                                                            from2.locale = 'en_US';     
                                                            from2.timezone = '240';
                                                            from2.lgnjs = ~~(Date.now() / 1000);
                                                        return utils
                                                            .post("https://www.facebook.com/login/device-based/regular/login/?login_attempt=1&lwv=110", jar, from2, loginOptions)
                                                            .then(utils.saveCookies(jar))
                                                            .then(function(/** @type {{ headers: any; }} */res) {
                                                        var headers = res.headers;  
                                                        if (!headers['set-cookie'][0].includes('deleted')) {
                                                            logger.Warning(Language.ErrThroughCookies, async function() {
                                                                await Database.delete('Through2Fa');
                                                            });
                                                            process.exit(1);
                                                        }
                                                            if (headers.location && headers.location.indexOf('https://www.facebook.com/checkpoint/') > -1) {
                                                                return utils
                                                                    .get(headers.location, jar, null, loginOptions)
                                                                    .then(utils.saveCookies(jar))
                                                                    .then(function(/** @type {{ body: any; }} */res) {
                                                                        var html = res.body,$ = cheerio.load(html), arr = [];
                                                                        $("form input").map((i, v) => arr.push({ val: $(v).val(), name: $(v).attr("name") }));
                                                                        arr = arr.filter(v => { return v.val && v.val.length });
                                                                        var from2 = utils.arrToForm(arr);
                                                                        
                                                                        if (html.indexOf("checkpoint/?next") > -1) {
                                                                            setTimeout(() => {
                                                                                checkVerified = setInterval((_form) => {}, 5000, {
                                                                                    fb_dtsg: from2.fb_dtsg,
                                                                                    jazoest: from2.jazoest,
                                                                                    dpr: 1
                                                                                });
                                                                            }, 2500);
                                                                            if (!res.headers.location && res.headers['set-cookie'][0].includes('checkpoint')) {
                                                                                try {
                                                                                    delete from2.name_action_selected;
                                                                                    from2['submit[Continue]'] = $("#checkpointSubmitButton").html();
                                                                                    return utils
                                                                                        .post(nextURL, jar, from2, loginOptions)
                                                                                        .then(utils.saveCookies(jar))
                                                                                        .then(function() {
                                                                                            from2['submit[This was me]'] = "This was me";
                                                                                            return utils.post(nextURL, jar, from2, loginOptions).then(utils.saveCookies(jar));
                                                                                        })
                                                                                        .then(function() {
                                                                                            delete from2['submit[This was me]'];
                                                                                            from2.name_action_selected = 'save_device';
                                                                                            from2['submit[Continue]'] = $("#checkpointSubmitButton").html();
                                                                                            return utils.post(nextURL, jar, from2, loginOptions).then(utils.saveCookies(jar));
                                                                                        })
                                                                                        .then(async function(/** @type {{ headers: any; body: string | string[]; }} */res) {
                                                                                            var headers = res.headers;
                                                                                            if (!headers.location && res.headers['set-cookie'][0].includes('checkpoint')) throw { error: "wtf ??:D" };
                                                                                            var appState = utils.getAppState(jar,false);
                                                                                            await Database.set('Through2Fa', appState);
                                                                                            return loginHelper(appState, email, password, loginOptions, callback);
                                                                                        })
                                                                                    .catch((/** @type {any} */e) => callback(e));
                                                                                }
                                                                                catch (e) {
                                                                                    console.log(e)
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            return utils.get('https://www.facebook.com/', jar, null, loginOptions).then(utils.saveCookies(jar));
                                                        }).catch((/** @type {any} */e) => console.log(e));
                                                    }
                                                }
                                                catch (e) {
                                                    await Database.delete('Through2Fa');
                                                }
                                            var code = await question(Language.EnterSecurityCode);
                                                try {
                                                    form.approvals_code = code;
                                                    form['submit[Continue]'] = $("#checkpointSubmitButton").html();
                                                    var prResolve,prReject;
                                                    var rtPromise = new Promise((resolve, reject) => { prResolve = resolve; prReject = reject; });
                                                    if (typeof code == "string") { //always strings
                                                        utils
                                                            .post(nextURL, jar, form, loginOptions)
                                                            .then(utils.saveCookies(jar))
                                                            .then(function(/** @type {{ body: string | Buffer; }} */res) {
                                                                var $ = cheerio.load(res.body);
                                                                var error = $("#approvals_code").parent().attr("data-xui-error");
                                                                if (error) {
                                                                        logger.Warning(Language.InvaildTwoAuthCode,function() { EnterSecurityCode(); }); //bruh loop
                                                                    };
                                                                })
                                                            .then(function() {
                                                                delete form.no_fido;delete form.approvals_code;
                                                                form.name_action_selected = 'save_device'; //'save_device' || 'dont_save;
                                                                return utils.post(nextURL, jar, form, loginOptions).then(utils.saveCookies(jar));
                                                            })  
                                                            .then(async function(/** @type {{ headers: any; body: string | string[]; }} */res) {
                                                                var headers = res.headers;
                                                                if (!headers.location && res.headers['set-cookie'][0].includes('checkpoint')) {
                                                                    try {
                                                                        delete form.name_action_selected;
                                                                        form['submit[Continue]'] = $("#checkpointSubmitButton").html();
                                                                        return utils
                                                                            .post(nextURL, jar, form, loginOptions)
                                                                            .then(utils.saveCookies(jar))
                                                                            .then(function() {
                                                                                form['submit[This was me]'] = "This was me";
                                                                                return utils.post(nextURL, jar, form, loginOptions).then(utils.saveCookies(jar));
                                                                            })
                                                                            .then(function() {
                                                                                delete form['submit[This was me]'];
                                                                                form.name_action_selected = 'save_device';
                                                                                form['submit[Continue]'] = $("#checkpointSubmitButton").html();
                                                                                return utils.post(nextURL, jar, form, loginOptions).then(utils.saveCookies(jar));
                                                                            })
                                                                            .then(async function(/** @type {{ headers: any; body: string | string[]; }} */res) {
                                                                                var headers = res.headers;
                                                                                if (!headers.location && res.headers['set-cookie'][0].includes('checkpoint')) throw { error: "wtf ??:D" };
                                                                                var appState = utils.getAppState(jar,false);
                                                                                await Database.set('Through2Fa', appState);
                                                                                return loginHelper(appState, email, password, loginOptions, callback);
                                                                            })
                                                                        .catch((/** @type {any} */e) => callback(e));
                                                                    }
                                                                    catch (e) {
                                                                        console.log(e)
                                                                    }
                                                                }
                                                                var appState = utils.getAppState(jar,false);
                                                                if (callback === prCallback) {
                                                                    callback = function(/** @type {any} */err, /** @type {any} */api) {
                                                                        if (err) return prReject(err);
                                                                        return prResolve(api);
                                                                    };
                                                                }
                                                                await Database.set('Through2Fa', appState);
                                                                return loginHelper(appState, email, password, loginOptions, callback);
                                                            })
                                                            .catch(function(/** @type {any} */err) {
                                                                if (callback === prCallback) prReject(err);
                                                                else callback(err);
                                                            });
                                                    } else {
                                                        utils
                                                            .post("https://www.facebook.com/checkpoint/?next=https%3A%2F%2Fwww.facebook.com%2Fhome.php", jar, form, loginOptions, null, { "Referer": "https://www.facebook.com/checkpoint/?next" })
                                                            .then(utils.saveCookies(jar))
                                                            .then(async function(/** @type {{ body: string; }} */res) {
                                                                try { 
                                                                    JSON.parse(res.body.replace(/for\s*\(\s*;\s*;\s*\)\s*;\s*/, ""));
                                                                } catch (ex) {
                                                                    clearInterval(checkVerified);
                                                                    logger.Warning(Language.VerifiedCheck);
                                                                    if (callback === prCallback) {
                                                                        callback = function(/** @type {any} */err, /** @type {any} */api) {
                                                                            if (err) return prReject(err);
                                                                            return prResolve(api);
                                                                        };
                                                                    }
                                                                    let appState = utils.getAppState(jar,false);
                                                                    return loginHelper(appState, email, password, loginOptions, callback);
                                                                }
                                                            })
                                                            .catch((/** @type {any} */ex) => {
                                                                log.error("login", ex);
                                                                if (callback === prCallback) prReject(ex);
                                                                else callback(ex);
                                                            });
                                                    }
                                                    return rtPromise;  
                                                }
                                                catch (e) {
                                                    logger.Error(e)
                                                    logger.Error()
                                                    process.exit(0)
                                                }
                                            }
                                            await EnterSecurityCode()
                                        }
                                        catch (e) {
                                            logger.Error(e)
                                            logger.Error();
                                            process.exit(0);
                                        }
                                    } 
                                        break;
                                    case false: {
                                        throw {
                                            error: 'login-approval',
                                            continue: function submit2FA(/** @type {any} */code) {
                                                form.approvals_code = code;
                                                form['submit[Continue]'] = $("#checkpointSubmitButton").html(); //'Continue';
                                                var prResolve,prReject;
                                                var rtPromise = new Promise((resolve, reject) => { prResolve = resolve; prReject = reject; });
                                                if (typeof code == "string") {
                                                    utils
                                                        .post(nextURL, jar, form, loginOptions)
                                                        .then(utils.saveCookies(jar))
                                                        .then(function(/** @type {{ body: string | Buffer; }} */res) {
                                                            var $ = cheerio.load(res.body);
                                                            var error = $("#approvals_code").parent().attr("data-xui-error");
                                                            if (error) {
                                                                throw {
                                                                    error: 'login-approval',
                                                                    errordesc: Language.InvaildTwoAuthCode,
                                                                    lerror: error,
                                                                    continue: submit2FA
                                                                };
                                                            }
                                                        })
                                                        .then(function() {
                                                            delete form.no_fido;delete form.approvals_code;
                                                            form.name_action_selected = 'dont_save'; //'save_device' || 'dont_save;
                                                            return utils.post(nextURL, jar, form, loginOptions).then(utils.saveCookies(jar));
                                                        })
                                                        .then(function(/** @type {{ headers: any; body: string | string[]; }} */res) {
                                                            var headers = res.headers;
                                                            if (!headers.location && res.headers['set-cookie'][0].includes('checkpoint')) throw { error: Language.ApprovalsErr };
                                                            var appState = utils.getAppState(jar,false);
                                                            if (callback === prCallback) {
                                                                callback = function(/** @type {any} */err, /** @type {any} */api) {
                                                                    if (err) return prReject(err);
                                                                    return prResolve(api);
                                                                };
                                                            }
                                                            return loginHelper(appState, email, password, loginOptions, callback);
                                                        })
                                                        .catch(function(/** @type {any} */err) {
                                                            if (callback === prCallback) prReject(err);
                                                            else callback(err);
                                                        });
                                                } else {
                                                    utils
                                                        .post("https://www.facebook.com/checkpoint/?next=https%3A%2F%2Fwww.facebook.com%2Fhome.php", jar, form, loginOptions, null, { "Referer": "https://www.facebook.com/checkpoint/?next" })
                                                        .then(utils.saveCookies(jar))
                                                        .then((/** @type {{ body: string; }} */res) => {
                                                            try { 
                                                                JSON.parse(res.body.replace(/for\s*\(\s*;\s*;\s*\)\s*;\s*/, ""));
                                                            } catch (ex) {
                                                                clearInterval(checkVerified);
                                                                logger.Warning(Language.VerifiedCheck);
                                                                if (callback === prCallback) {
                                                                    callback = function(/** @type {any} */err, /** @type {any} */api) {
                                                                        if (err) return prReject(err);
                                                                        return prResolve(api);
                                                                    };
                                                                }
                                                                return loginHelper(utils.getAppState(jar,false), email, password, loginOptions, callback);
                                                            }
                                                        })
                                                        .catch((/** @type {any} */ex) => {
                                                            log.error("login", ex);
                                                            if (callback === prCallback) prReject(ex);
                                                            else callback(ex);
                                                        });
                                                    }
                                                return rtPromise;
                                            }
                                        };
                                    }
                                }
                            } else {
                                if (!loginOptions.forceLogin) throw { error: Language.ForceLoginNotEnable };

                                if (html.indexOf("Suspicious Login Attempt") > -1) form['submit[This was me]'] = "This was me";
                                else form['submit[This Is Okay]'] = "This Is Okay";

                                return utils
                                    .post(nextURL, jar, form, loginOptions)
                                    .then(utils.saveCookies(jar))
                                    .then(function() {
                                        form.name_action_selected = 'dont_save';

                                        return utils.post(nextURL, jar, form, loginOptions).then(utils.saveCookies(jar));
                                    })
                                    .then(function(/** @type {{ headers: any; body: string | string[]; }} */res) {
                                        var headers = res.headers;

                                        if (!headers.location && res.body.indexOf('Review Recent Login') > -1) throw { error: "Something went wrong with review recent login." };

                                        var appState = utils.getAppState(jar,false);

                                        return loginHelper(appState, email, password, loginOptions, callback);
                                    })
                                    .catch((/** @type {any} */e) => callback(e));
                            }
                        });
                }
            return utils.get('https://www.facebook.com/', jar, null, loginOptions).then(utils.saveCookies(jar));
        });
    };
}

/!-[ Function backup ]-!/

/**
 * @param {string} data
 * @param {any} globalOptions
 * @param {any} callback
 * @param {any} prCallback
 */

function backup(data,globalOptions, callback, prCallback) {
    try {
        var appstate;
        try {
            appstate = JSON.parse(data)
        }
        catch(e) {
            appstate = data;
        }
            logger.Warning(Language.BackupNoti);
        try {
            loginHelper(appstate,null,null,globalOptions, callback, prCallback)
        }
        catch (e) {
            logger.Error(Language.ErrBackup);
            process.exit(0);
        }
    }
    catch (e) {
        return logger.Error();
    }
}

/!-[ async function loginHelper ]-!/

/**
 * @param {string | any[]} appState
 * @param {any} email
 * @param {any} password
 * @param {{ selfListen?: boolean; listenEvents?: boolean; listenTyping?: boolean; updatePresence?: boolean; forceLogin?: boolean; autoMarkDelivery?: boolean; autoMarkRead?: boolean; autoReconnect?: boolean; logRecordSize?: number; online?: boolean; emitReady?: boolean; userAgent?: string; pageID?: any; }} globalOptions
 * @param {(arg0: any, arg1: undefined) => void} callback
 * @param {(error: any, api: any) => any} [prCallback]
 */

async function loginHelper(appState, email, password, globalOptions, callback, prCallback) {
    var mainPromise = null;
    var jar = utils.getJar();

    if (fs.existsSync('./backupappstate.json')) {
        fs.unlinkSync('./backupappstate.json');
    }

try {
    if (appState) {
        logger.Normal(Language.OnProcess);
            switch (await Database.has("FBKEY")) {
                case true: {
                    process.env.FBKEY = await Database.get("FBKEY");
                }
                    break;
                case false: {
                    const SecurityKey = global.Fca.Require.Security.create().apiKey;
                        process.env['FBKEY'] = SecurityKey;
                    await Database.set('FBKEY', SecurityKey);
                }
                    break;
                default: {
                    const SecurityKey = global.Fca.Require.Security.create().apiKey;
                        process.env['FBKEY'] = SecurityKey;
                    await Database.set('FBKEY', SecurityKey);
                }
            }
            try {
                switch (global.Fca.Require.Priyansh.EncryptFeature) {
                    case true: {
                        appState = JSON.parse(JSON.stringify(appState, null, "\t"));
                        switch (utils.getType(appState)) {
                            case "Array": {
                                switch (utils.getType(appState[0])) {
                                    case "Object": {
                                        logger.Normal(Language.NotReadyToDecrypt);
                                    }
                                        break;
                                    case "String": {
                                        appState = Security(appState,process.env['FBKEY'],'Decrypt');
                                        logger.Normal(Language.DecryptSuccess);
                                    }
                                }
                            }
                                break;
                            case "Object": {
                                try {
                                    appState = StateCrypt.decryptState(appState, process.env['FBKEY']);
                                    logger.Normal(Language.DecryptSuccess);
                                }
                                catch (e) {
                                    if (process.env.Backup != undefined && process.env.Backup) {
                                    await backup(process.env.Backup,globalOptions, callback, prCallback);
                                }
                                else {
                                    try {
                                        if (await Database.has('Backup')) {
                                            return await backup(await Database.get('Backup'),globalOptions, callback, prCallback);
                                        }
                                        else {
                                            logger.Normal(Language.ErrBackup);
                                            process.exit(0);
                                        }
                                    }
                                    catch (e) {
                                        logger.Warning(Language.ErrBackup);
                                        logger.Error();
                                        process.exit(0);
                                    }
                                }
                                    logger.Warning(Language.DecryptFailed);
                                    return logger.Error();
                                }
                            }
                                break;
                            case "String": {
                                try {
                                    appState = StateCrypt.decryptState(appState, process.env['FBKEY']);
                                    logger.Normal(Language.DecryptSuccess);
                                }
                                catch (e) {
                                    if (process.env.Backup != undefined && process.env.Backup) {
                                    await backup(process.env.Backup,globalOptions, callback, prCallback);
                                }
                                else {
                                    try {
                                        if (await Database.has('Backup')) {
                                            return await backup(await Database.get('Backup'),globalOptions, callback, prCallback);
                                        }
                                        else {
                                            logger.Normal(Language.ErrBackup);
                                            process.exit(0);
                                        }
                                    }
                                    catch (e) {
                                        logger.Warning(Language.ErrBackup);
                                        logger.Error();
                                        process.exit(0);
                                    }
                                }
                                    logger.Warning(Language.DecryptFailed);
                                    return logger.Error();
                                } 
                            }
                                break;
                            default: {
                                logger.Warning(Language.InvaildAppState);
                                process.exit(0)
                            }
                        } 
                    }
                        break;
                    case false: {
                        switch (utils.getType(appState)) { 
                            case "Array": {
                                logger.Normal(Language.EncryptStateOff);
                            }
                                break;
                            case "Object": {
                                logger.Normal(Language.EncryptStateOff);
                                try {
                                    appState = StateCrypt.decryptState(appState, process.env['FBKEY']);
                                    logger.Normal(Language.DecryptSuccess);
                                }
                                catch (e) {
                                    if (process.env.Backup != undefined && process.env.Backup) {
                                        await backup(process.env.Backup,globalOptions, callback, prCallback);
                                    }
                                else {
                                    try {
                                        if (await Database.has('Backup')) {
                                            return await backup(await Database.get('Backup'),globalOptions, callback, prCallback);
                                        }
                                        else {
                                            logger.Warning(Language.ErrBackup);
                                            process.exit(0);
                                        }
                                    }
                                    catch (e) {
                                        logger.Warning(Language.ErrBackup);
                                        logger.Error();
                                        process.exit(0);
                                    }
                                }
                                    logger.Warning(Language.DecryptFailed);
                                    return logger.Error();
                                }
                            }
                                break;
                            default: {
                                logger.Warning(Language.InvaildAppState);
                                process.exit(0)
                            }
                        } 
                    }
                        break;
                    default: {
                        logger.Warning(getText(Language.IsNotABoolean,global.Fca.Require.Priyansh.EncryptFeature))
                        process.exit(0);
                    }
                }
            }
            catch (e) {
                console.log(e);
            }

        try {
            appState = JSON.parse(appState);
        }
        catch (e) {
            try {
                appState = appState;
            }
            catch (e) {
                return logger.Error();
            }
        }
        try {
            global.Fca.Data.AppState = appState;
                appState.map(function(/** @type {{ key: string; value: string; expires: string; domain: string; path: string; }} */c) {
                    var str = c.key + "=" + c.value + "; expires=" + c.expires + "; domain=" + c.domain + "; path=" + c.path + ";";
                    jar.setCookie(str, "http://" + c.domain);
                });
                process.env.Backup = appState;
                await Database.set('Backup', appState);
            mainPromise = utils.get('https://www.facebook.com/', jar, null, globalOptions, { noRef: true }).then(utils.saveCookies(jar));
        } catch (e) {
            console.log(e)
            if (process.env.Backup != undefined && process.env.Backup) {
                return await backup(process.env.Backup,globalOptions, callback, prCallback);
            }
            try {
                if (await Database.has('Backup')) {
                    return await backup(await Database.get('Backup'),globalOptions, callback, prCallback);
                }
                else {
                    logger.Warning(Language.ErrBackup);
                    process.exit(0);
                }
            }
            catch (e) {
                logger.Warning(Language.ErrBackup);
                process.exit(0);
            }
        return logger.Warning(Language.ErrBackup); // unreachable 👑 
    }
} else {
    mainPromise = utils
        .get("https://www.facebook.com/", null, null, globalOptions, { noRef: true })
            .then(utils.saveCookies(jar))
            .then(makeLogin(jar, email, password, globalOptions, callback, prCallback))
            .then(function() {
                return utils.get('https://www.facebook.com/', jar, null, globalOptions).then(utils.saveCookies(jar));
            });
        }
    } catch (e) {
        console.log(e);
    }
        var ctx,api;
            mainPromise = mainPromise
                .then(function(/** @type {{ body: string; }} */res) {
                    var reg = /<meta http-equiv="refresh" content="0;url=([^"]+)[^>]+>/,redirect = reg.exec(res.body);
                        if (redirect && redirect[1]) return utils.get(redirect[1], jar, null, globalOptions).then(utils.saveCookies(jar));
                    return res;
                })
                .then(function(/** @type {{ body: any; }} */res) {
                    var html = res.body,Obj = buildAPI(globalOptions, html, jar);
                        ctx = Obj.ctx;
                        api = Obj.api;
                        process.env.api = Obj.api;
                    return res;
                });
            if (globalOptions.pageID) {
                mainPromise = mainPromise
                    .then(function() {
                        return utils.get('https://www.facebook.com/' + ctx.globalOptions.pageID + '/messages/?section=messages&subsection=inbox', ctx.jar, null, globalOptions);
                    })
                    .then(function(/** @type {{ body: any; }} */resData) {
                        var url = utils.getFrom(resData.body, 'window.location.replace("https:\\/\\/www.facebook.com\\', '");').split('\\').join('');
                        url = url.substring(0, url.length - 1);
                        return utils.get('https://www.facebook.com' + url, ctx.jar, null, globalOptions);
                    });
            }
        mainPromise
            .then(function() {
                const { execSync } = require('child_process');
                    Fetch('https://raw.githubusercontent.com/corazoncary/fca/main/package.json').then(async (/** @type {{ body: { toString: () => string; }; }} */res) => {
                        const localVersion = global.Fca.Version;
                            if (Number(localVersion.replace(/\./g,"")) < Number(JSON.parse(res.body.toString()).version.replace(/\./g,"")) ) {
                                log.warn("[ FCA-PRIYANSH ] •",getText(Language.NewVersionFound,global.Fca.Version,JSON.parse(res.body.toString()).version));
                                if (global.Fca.Require.Priyansh.AutoUpdate == true) { 
                                    log.warn("[ FCA-PRIYANSH ] •",Language.AutoUpdate);
                                        try {
                                            execSync('npm install fca-priyansh@latest', { stdio: 'inherit' });
                                                logger.Success(Language.UpdateSuccess)
                                                    logger.Normal(Language.RestartAfterUpdate);
                                                    await new Promise(resolve => setTimeout(resolve,5*1000));
                                                console.clear();process.exit(1);
                                            }
                                        catch (err) {
                                            log.warn('Error Update: ' + err);
                                                logger.Normal(Language.UpdateFailed);
                                            try {
                                                const fs = require('fs-extra')
                                                    try {
                                                logger.Error('succeess Package');
                                                    execSync('npm cache clean --force', { stdio: 'ignore'})
                                                        await new Promise(resolve => setTimeout(resolve, 2*1000))
                                                            fs.removeSync('../fca-priyansh');
                                                                // why stdio is not studio :v 
                                                            await new Promise(resolve => setTimeout(resolve, 2*1000))
                                                        execSync('npm i fca-priyansh@latest', { stdio: 'inherit'})
                                                    logger.Success("success Restart");
                                                process.exit(1);
                                            }
                                            catch (e) {
                                                logger.Warning("Error Please Enter The Following Code In Console To Fix !");
                                                    logger.Warning("rmdir -rf ./node_modules/fca-priyansh && npm i fca-priyansh@latest && npm start");
                                                    logger.Warning("Please Copy All The Above Words, Need To Do It 100% Correctly Otherwise Your File Will Be Discolored ✨")
                                                process.exit(0);
                                            }
                                            }
                                            catch (e) {
                                                logger.Error(Language.NotiAfterUseToolFail)
                                                    logger.Warning("rmdir ./node_modules after type npm i && npm start");
                                                process.exit(0);
                                            }
                                        }
                                    }
                                }
                    else {
                        logger.Normal(getText(Language.LocalVersion,localVersion));
                            logger.Normal(getText(Language.CountTime,global.Fca.Data.CountTime()))   
                                logger.Normal(Language.WishMessage[Math.floor(Math.random()*Language.WishMessage.length)]);
                                require('./Extra/ExtraUptimeRobot')();
                            DataLanguageSetting.HTML.HTML==true? global.Fca.Require.Web.listen(global.Fca.Require.Web.get('DFP')) : global.Fca.Require.Web = null;
                        callback(null, api);
                    };
                }).catch(async function(e) {
                    console.log(e)
                    logger.Warning(Language.AutoCheckUpdateFailure)
                        logger.Normal(getText(Language.LocalVersion,global.Fca.Version));
                            logger.Normal(getText(Language.CountTime,global.Fca.Data.CountTime()))   
                        logger.Normal(Language.WishMessage[Math.floor(Math.random()*Language.WishMessage.length)]);
                        require('./Extra/ExtraUptimeRobot')();
                    DataLanguageSetting.HTML.HTML==true? global.Fca.Require.Web.listen(global.Fca.Require.Web.get('DFP')) : global.Fca.Require.Web = null;
                callback(null, api);
                });
            }).catch(function(/** @type {{ error: any; }} */e) {
            log.error("login", e.error || e);
        callback(e);
    });
}

/**
 * It asks the user for their account and password, and then saves it to the database.
 */

function setUserNameAndPassWord() {
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    let localbrand2 = global.Fca.Version
    console.clear();
    console.log(figlet.textSync('Horizon', {font: 'ANSI Shadow',horizontalLayout: 'default',verticalLayout: 'default',width: 0,whitespaceBreak: true }));
    console.log(chalk.bold.hex('#9900FF')("[</>]") + chalk.bold.yellow(' => ') + "Operating System: " + chalk.bold.red(os.type()));
    console.log(chalk.bold.hex('#9900FF')("[</>]") + chalk.bold.yellow(' => ') + "Machine Version: " + chalk.bold.red(os.version()));
    console.log(chalk.bold.hex('#9900FF')("[</>]") + chalk.bold.yellow(' => ') + "Fca Version: " + chalk.bold.red(localbrand2) + '\n');
    try {
        rl.question(Language.TypeAccount, (Account) => {
            if (!Account.includes("@") && global.Fca.Require.utils.getType(parseInt(Account)) != "Number") return logger.Normal(Language.TypeAccountError, function () { process.exit(1) }); //Very Human
                else rl.question(Language.TypePassword,async function (Password) {
                    rl.close();
                    try {
                        await Database.set("Account", Account);
                        await Database.set("Password", Password);
                    }
                    catch (e) {
                        logger.Warning(Language.ErrDataBase);
                            logger.Error();
                        process.exit(0);
                    }
                    if (global.Fca.Require.Priyansh.ResetDataLogin) {
                        global.Fca.Require.Priyansh.ResetDataLogin = false;
                        global.Fca.Require.fs.writeFileSync(process.cwd() + '/PriyanshFca.json', JSON.stringify(global.Fca.Require.Priyansh, null, 4));
                    }
                logger.Success(Language.SuccessSetData);
                process.exit(1);
            });
        })
    }
    catch (e) {
        logger.Error(e)
    }
}

/**
 * @param {{ email: any; password: any; appState: any; }} loginData
 * @param {{}} options
 * @param {(error: any, api: any) => any} callback
 */

function login(loginData, options, callback) {

    if (utils.getType(loginData) == "Array") {
        if (loginData.length == 3) {
            options = loginData[1];
            callback = loginData[2];
            loginData = loginData[0]
        }
        else if (loginData.length == 2) {
            options = loginData[1];
            loginData = loginData[0]
        }
        else {
            loginData = loginData[0]
        }
    }

    if (utils.getType(options) === 'Function' || utils.getType(options) === 'AsyncFunction') {
        callback = options;
        options = {};
    }

    var globalOptions = {
        selfListen: true,
        listenEvents: true,
        listenTyping: true,
        updatePresence: false,
        forceLogin: false,
        autoMarkDelivery: true,
        autoMarkRead: true,
        autoReconnect: true,
        logRecordSize: 100,
        online: true,
        emitReady: false,
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.1.2 Safari/603.3.8"
    };
    
    if (loginData.email && loginData.password) {
        setOptions(globalOptions, {
            logLevel: "silent",
            forceLogin: true,
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36"
        });
    }
    else if (loginData.appState) {
        setOptions(globalOptions, options);
    }

    var prCallback = null;
    if (utils.getType(callback) !== "Function" && utils.getType(callback) !== "AsyncFunction") {
        var rejectFunc = null;
        var resolveFunc = null;
        var returnPromise = new Promise(function(resolve, reject) {
            resolveFunc = resolve;
            rejectFunc = reject;
        }); 
        prCallback = function(/** @type {any} */error, /** @type {any} */api) {
            if (error) return rejectFunc(error);
            return resolveFunc(api);
        };
        callback = prCallback;
    }
    
    (async function() {
        var Premium = require("./Extra/Src/Premium");
        global.Fca.Data.PremText = await Premium(global.Fca.Require.Security.create().uuid) || "Bạn Đang Sài Phiên Bản: Free !";
        if (!loginData.email && !loginData.password) {
            switch (global.Fca.Require.Priyansh.AutoLogin) {
                case true: {
                    if (global.Fca.Require.Priyansh.ResetDataLogin) return setUserNameAndPassWord();
                    else {
                        try {
                            if (await Database.get("TempState")) { 
                                try {
                                    loginData.appState = JSON.parse(await Database.get("TempState"));
                                }
                                catch (_) {
                                    loginData.appState = await Database.get("TempState");
                                }
                                await Database.delete("TempState");
                            }
                        }
                        catch (e) {
                            console.log(e)
                            await Database.delete("TempState");
                                logger.Warning(Language.ErrDataBase);
                                logger.Error();
                            process.exit(0);
                        }
                        try {
                            if (await Database.has('Account') && await Database.has('Password')) return loginHelper(loginData.appState, loginData.email, loginData.password, globalOptions, callback, prCallback);
                            else return setUserNameAndPassWord();
                        }
                        catch (e) {
                            console.log(e)
                            logger.Warning(Language.ErrDataBase);
                                logger.Error();
                            process.exit(0);
                        }
                    }
                }
                case false: {
                    loginHelper(loginData.appState, loginData.email, loginData.password, globalOptions, callback, prCallback);
                }
            }
        }
        else loginHelper(loginData.appState, loginData.email, loginData.password, globalOptions, callback, prCallback);
    })()
    return returnPromise;
}

module.exports = login;
