const { ipcRenderer, contextBridge } = require("electron")

contextBridge.exposeInMainWorld("api", {
    dialog: () => ipcRenderer.invoke("dialog"),
    outdir: () => ipcRenderer.invoke("outdir"),
    run: () => ipcRenderer.invoke("run"),
    refresh: (callback) => {
        return ipcRenderer.on("refresh", (e, value) => {
            console.log(value)
            callback(value)

        })
    },
    updateNode: (callback) => {
        ipcRenderer.on("updateNode", (e, value) => {
            return callback(value)
        })
    }
})