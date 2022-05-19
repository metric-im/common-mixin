/**
 * App mixin that provides the common components for page structure and forms
 */
import fs from 'fs';
import express from 'express';
import path from "path";
import {fileURLToPath} from "url";
export default class CommonMixin {
    constructor(connector) {
        this.connector = connector;
        this.rootPath = path.dirname(fileURLToPath(import.meta.url));
        this.library = {
            'moment':this.rootPath+'/node_modules/moment/moment.js',
            'ace':this.rootPath+'/node_modules/ace-builds/src-noconflict/',
            'firemacro':this.rootPath+'/node_modules/@geistm/firemacro/index.js',
            'chartjs':this.rootPath+'/node_modules/chart.js/dist/chart.js',
            'datepicker':this.rootPath+'/node_modules/js-datepicker/dist/datepicker.min.js',
            'zebratime':this.rootPath+'/node_modules/zebratime/zebratime.js',
            'xlsx':this.rootPath+'/node_modules/xlsx/dist/xlsx.full.min.js',
            'cronstrue':this.rootPath+'/node_modules/cronstrue/dist/cronstrue.min.js',
            'marked':this.rootPath+'/node_modules/marked/lib/marked.esm.js'
        };
        this.componentPath = this.rootPath+'/components';
    }
}
