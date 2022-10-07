const express = require('express');
const downloadController = require('../Controllers/downloadController');
const Router = express.Router();

Router.get('/databases', downloadController.database);
Router.post('/database', downloadController.tableByDb);
Router.get('/table', downloadController.table);
Router.post('/view', downloadController.viewByDb);
Router.post('/csv/', downloadController.downloadCsv);
Router.post('/pdf/', downloadController.downloadPdf);
Router.post('/json/', downloadController.downloadJson);
Router.post('/tsv/', downloadController.downloadTsv);
//Router.get('/tsv/', downloadController.downloadTsv);
//Router.get('/json/', downloadController.downloadPdf);


module.exports = Router;