const fs = require("fs");

/**
 * App mixin that provides the common components for page structure and forms
 */
class CommonMixin {
    constructor(connector) {
        this.connector = connector;
        this.library = {
            'moment':'/node_modules/moment/moment.js',
            'ace':'/node_modules/ace-builds/src-noconflict/',
            'identifier':'/node_modules/@metric-im/identifier/index.js',
            'firemacro':'/node_modules/@geistm/firemacro/index.js',
            'chartjs':'/node_modules/chart.js/dist/chart.js',
            'datepicker':'/node_modules/js-datepicker/dist/datepicker.min.js',
            'zebratime':'/node_modules/zebratime/zebratime.js',
            'xlsx':'/node_modules/xlsx/dist/xlsx.full.min.js',
            'cronstrue':'/node_modules/cronstrue/dist/cronstrue.min.js',
            'marked':'/node_modules/marked/lib/marked.esm.js'
        };
    }
    routes() {
        const router = require('express').Router();
        router.get('/lib/:module/:path?',(req,res)=>{
            let path = this.library[req.params.module];
            if (req.params.path) path += req.params.path;
            if (!path) return res.status(404).send();
            res.set("Content-Type","text/javascript");
            if (['firemacro','identifier'].includes(req.params.module)) {
                // rewrite module notation
                let js = fs.readFileSync(__dirname+path).toString();
                js = js.replace(/^module\.exports.*?=/m,"export default");
                res.send(js);
            } else {
                // push file as is
                res.sendFile(__dirname+path);
            }
        });

        return router;
    }
}
module.exports = CommonMixin;