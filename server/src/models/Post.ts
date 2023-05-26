import { Schema, InferSchemaType, model } from "mongoose"

const postsSchema = new Schema({
    authorId: { type: Schema.Types.ObjectId, required: true },
    title: {type: String, required: true},
    text: {type: String, required: true},
    authorName: { type: String, required: true}
}, {timestamps: true})

type Post = InferSchemaType<typeof postsSchema>

export default model<Post>('Post', postsSchema)