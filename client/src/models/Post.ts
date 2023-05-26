export default interface Post{
    _id: string,
    title: string,
    text?: string,
    authorId: string,
    authorName: string,
    createdAt: string,
    updatedAt: string,
}