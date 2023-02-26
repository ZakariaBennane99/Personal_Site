import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    readingTime: {
        type: String,
        required: true
    },
    featuredImg: {
        url: {
            type: String,
            require: true
        },
        alt: {
            type: String,
            required: true
        }
    },
    content: {
        type: String,
        required: true
    }
})

module.exports = mongoose.models.Post || mongoose.model('Post', PostSchema)
