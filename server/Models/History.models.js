import mongoose from "mongoose";

const SearchHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    diseaseName:{
        type: String,
        default: null
    },
    imageUrl: {
        type: String,
        required: true,
    },
    blipDescription: { type: String, default: null },
    diseaseDescription: { type: String, default: null },
    isLeafImage: { type: Boolean, required: true },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const SearchHistory = mongoose.models.SearchHistory || mongoose.model("SearchHistory", SearchHistorySchema);
export default SearchHistory;