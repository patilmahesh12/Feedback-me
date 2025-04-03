import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  teacherId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);