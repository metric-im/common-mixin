/**
 * App mixin that provides the common components for page structure and forms
 */
class CommonMixin {
    constructor(connector) {
        this.connector = connector;
    }
    // routes() {
    //     const router = require('express').Router();
    //     router.all("/wiki/:docId?",async(req,res)=>{
    //         try {
    //             let result = await this[req.method.toLowerCase()](req.params.docId,req.query,req.body);
    //             res.json(result);
    //         } catch(e) {
    //             console.error(`Error invoking ${req.method} on data`,e);
    //             res.status(500).send(`Error invoking ${req.method} on data: ${e.message}`);
    //         }
    //     });
    //
    //     return router;
    // }
}
module.exports = CommonMixin;