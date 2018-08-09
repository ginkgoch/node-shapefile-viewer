const AV = require('leancloud-storage');
AV.init('yeqsBIYWYlwqRjFiy3o76aPO-gzGzoHsz', 'gRGNmsiwQKFRzLVytGDE3E5h');

module.exports = AV.Object.extend('Message_Board');