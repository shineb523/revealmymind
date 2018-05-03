// Module defining database schema.

var Schema = {};

Schema.createSchema = function(mongoose) {

    // Define schema.
    var think_schema = mongoose.Schema({
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

    console.log('Defined think_schema.');

    return think_schema;
};

// Directly assign think_schema object to module.exports.

module.exports = Schema;
