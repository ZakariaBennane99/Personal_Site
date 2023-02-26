import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    title: {
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

module.exports = mongoose.models.Project || mongoose.model('Project', ProjectSchema)
