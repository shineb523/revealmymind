// write_article_post page.
module.exports = function(req, res) {

        console.log('/write_article_post path is required.');

        var database = req.app.get('database');

        var think_data= req.body.think;

        // Create and save model instance object.
        var user = new database.think_model({
            'text': think_data
        });

        user.save(function(err) {
                if (err) {
                    throw err;
                }

                console.log("Saved article.");

                res.redirect('/');
                return;
            });
        }
