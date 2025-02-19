import mongoose, { Document, Schema, Model } from 'mongoose';
import { Types } from "mongoose";

interface IComment extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    question_id: Types.ObjectId;
    text: string;
    likes: Number;
}

const CommentSchema = new Schema<IComment>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    question_id: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    text: { type: String, required: true },
    likes: {type: Number, required: true}
}, { timestamps: true });

const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema, "comments");

export default Comment;