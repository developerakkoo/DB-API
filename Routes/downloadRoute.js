const express = require('express');
const downloadController = require('../Controllers/downloadController');
const Router = express.Router();

Router.get('/databases', downloadController.database);
Router.post('/database', downloadController.tableByDb);
Router.get('/table', downloadController.table);
Router.post('/view', downloadController.viewByDb);
Router.post('/csv/multi', downloadController.downloadCsv);
Router.post('/xls/multi', downloadController.downloadXls);
Router.post('/json/multi', downloadController.downloadJson);
Router.post('/tsv/multi', downloadController.downloadTsv);
Router.post('/csv/', downloadController.singleCsv);
Router.post('/tsv/', downloadController.singleTsv);
Router.post('/json/', downloadController.singleJson);
Router.post('/xls/', downloadController.singleXls);



module.exports = Router;