var database = require('../../database/database_loader');

var article_database_check = function(params, callback) {
    console.log('jsonRPC article_database_check is called.');

    if (database) {
        console.log('database object is successfully referred.');

        database.think_model.find({},
            function(err, result) {
                if (err) {
                    console.log(err);
                    console.log('Error is occured while requiring find function.');
                    throw err;
                    return;
                }
                var output = result;

                callback(null, output);
                return;

            });

    } else {
        console.log('Failed to refer database object.');
        callback({
            code: 410,
            message: 'Failed to refer database object.'
        }, null);
        return;
    }

};

module.exports = article_database_check;
