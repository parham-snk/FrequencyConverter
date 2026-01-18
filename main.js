const { exec, execSync } = require("child_process")
const { BrowserWindow, app, dialog, ipcMain } = require("electron")
const path = require("path")
let win;
const createWin = async () => {
    win = new BrowserWindow({
        width: 1000,
        height: 500,
        autoHideMenuBar: true,
        accentColor: "black",
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }

    })

    win.loadFile("./index.html")

}

app.whenReady().then(async () => {
    await createWin()
    let inDir, outdir;
    ipcMain.handle("dialog", async () => {
        const result = await dialog.showOpenDialog({
            properties: ['openDirectory']
        });
        if (!result.canceled) {
            inDir = result.filePaths[0]
            win.webContents.send("updateNode", { id: "in_dir", value: inDir })

        }
    })

    ipcMain.handle("outdir", async () => {
        const out = await dialog.showOpenDialog({
            properties: ["openDirectory"]
        })

        if (!out.canceled) {
            outdir = out.filePaths[0]
            win.webContents.send("updateNode", { id: "out_dir", value: outdir })
        }
    })

    ipcMain.handle("run", () => {
        exec(`dir /b \"${inDir}\"`, (err, std, stderr) => {
            if (err && stderr) {
                return console.log(err)
            }

            const files = std.split(/\r\n/).filter(item => {
                if (item.split(".").length > 1 && item.split(".")[(item.split(".").length) - 1] == "mp3") {
                    return item
                }
            }).map(item => item.trim())
            win.webContents.send("updateNode", { id: "qty", value: `( ${files.length} items)` })
            win.webContents.send("updateNode", { id: "total", value: files.length })
            // files.forEach(async (file, index) => {
            // const dir = path.join(inDir, file)
            // const output = path.join(outdir, file)
            // await execSync(`ffmpeg -i "${dir}" -af \"asetrate=44100*432/440\"  "${output}"`, (err, std, stderr) => {
            //     if (err || stderr) {
            //         // console.log(`err : ${err}`)
            //         // console.log(`stderr : ${stderr}`)
            //     }
            //     win.webContents.send("updateNode", { id: "passed", value: index })

            //     win.webContents.send("refresh", { name: file, dir: output })

            // })
            // })
            function generate(index) {
                if (index != files.length) {
                    const dir = path.join(inDir, files[index])
                    const output = path.join(outdir, files[index])
                    exec(`ffmpeg -i "${dir}" -af \"asetrate=44100*432/440\"  "${output}"`, (err, std, stderr) => {
                        if (err || stderr) {
                            // console.log(`err : ${err}`)
                            // console.log(`stderr : ${stderr}`)
                        }
                        win.webContents.send("updateNode", { id: "passed", value: (index+1) })

                        win.webContents.send("refresh", { name: files[index], dir: output })
                        index+=1
                        generate(index)
                    })
                }
            }
            generate(0)
        })
    })
})