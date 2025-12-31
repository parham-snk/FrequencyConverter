const { exec, execSync } = require("child_process")

let files;
// exec("cd .. && dir /b *.mp3", (err, std, stderr) => {
//     files = (std.split(/\r\n/g)).filter(item => item.split(".")[1] == "mp3")

//     console.log(err, files, stderr)
//     files.forEach(async file => {
//         exec(`ffmpeg -i \"../${file}\" -af \"asetrate=44100*432/440\" \"./dist/${file}\"`, (err, std, stderr) => {
//             console.log(err, stderr)

//         })
//     })
// })
exec("dir D:",(err,std,stder)=>{
    console.log(err,std,stder)
})
