/**
 * App mixin that provides the common components for page structure and forms
 */
import Componentry from "@metric-im/componentry";
import express from "express";

export default class CommonMixin extends Componentry.Module {
    constructor(connector) {
        super(connector,import.meta.url)
    }
    routes() {
        let router = express.Router();
        return router
    }
    get library() {
        return {
            'moment':'/moment/min/moment-with-locales.min.js',
            'moment-timezone':'/moment-timezone/builds/moment-timezone-with-data.js',
            'ace':'/ace-builds/src-noconflict/',
            'datepicker':'/js-datepicker/dist/datepicker.min.js',
            'zebratime':'/zebratime/zebratime.js',
            'xlsx':'/xlsx/dist/xlsx.full.min.js',
            'cronstrue':'/cronstrue/dist/cronstrue.min.js',
            'marked':'/marked/lib/marked.esm.js',
            'firemacro':'/@metric-im/firemacro/index.mjs'
        };
    }
}
