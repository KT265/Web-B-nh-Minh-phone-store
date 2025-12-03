import mongoose from "mongoose";
const reviewSchema = mongoose.Schema(
    {
        name: { type: String, required: true },//ten nguoi dung
        rating: { type: Number, required: true },//so sao
        comment: { type: String, required: true },//Binh luan
        user:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Customer',//tham chieu den nguoi dung da review
        },
    },
    {
        timestamps: true,
    }
);
const productSchema = mongoose.Schema(
    {
        name: {type: String, required : true},
        image: {type: String, required: true},// url toi hinh anh
        brand: {type: String, required: true},//hang (samsung, apple,...)
        category: {type: String, required: true},//danh muc: iphone, phu kien...
        description: {type:String, required: true},
        specifications: {
            ram: {type: String},
            storage: {type: String},
            display: {type: String},
            battery: {type: String},
            chip: {type: String}
        },
        price: {type: Number,required: true, default: 0},
        //danh gia san pham
        reviews: [reviewSchema],
        rating:{
            type: Number,
            required: true,
            default: 0,
        },
        numReviews:{
            //tong so luot danh gia
            type: Number,
            required: true,
            default: 0,
        },
        //seo
        metaTitle: { type: String }, 
        metaDescription: { type: String },
        metaKeywords: { type: String },
    },
    {
        timestamps: true, //tu dong tao createdAt va updateAt
    }
);
const Product = mongoose.model('Product', productSchema);
export default Product;