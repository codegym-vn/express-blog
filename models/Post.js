/**
 * Created by nhatnk on 7/17/17.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    title: String,
    content: String,
    feature: String,
    created_at: Schema.Types.Date,
    updated_at: Schema.Types.Date
});

module.exports = mongoose.model('Post', PostSchema);