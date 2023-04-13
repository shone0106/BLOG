export default interface Post{
    _id: string,
    title: string,
    text?: string,
    authorId: string,
    createdAt: string,
    updatedAt: string,
}