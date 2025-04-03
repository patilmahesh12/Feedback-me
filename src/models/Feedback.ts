import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  teacherId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  reportId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Report',
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  report: {
    message: {
      type: String,
      required: true
    }
  }
}, { timestamps: true });

export default mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);