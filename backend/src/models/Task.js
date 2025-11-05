import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'complete'],
    },
    completeAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true, // createAt và updateAt tự động thêm vào
});

const Task = mongoose.model('Task', taskSchema);
export default Task;