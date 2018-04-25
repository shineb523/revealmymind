// Module defining database schema.

var Schema = {};

Schema.createSchema = function(mongoose) {

    // Define schema.
    var mind_schema = mongoose.Schema({
        text: {
            type: String,
            required: true
        },
        created_at: {
            type: Date,
            required: true,
            'default': Date.now()
        }
    });

    console.log('user_account_schema 정의함.');

    return mind_schema;
};

// Directly assign mind_schema object to module.exports.

module.exports = Schema;
