import prisma from "../../libs/prisma";

export default async function addLike(req, res) {
    const { userEmail, postId  } = req.body;
    const json = [
        { name: 'Bob the dog' },
        { name: 'Claudine the cat' },
    ]
    // const update = await prisma.post.update({
    //     where: {
    //         id: postId,
    //     },
    //     data: {
    //         like: {
    //             create: {
    //                 userEmail: userEmail,
    //             }
    //         },
    //     },
    // })
    const update = await prisma.user.update({
        where: {
            userEmail: userEmail,
        },
        data: {
            posts: {
                update: {
                    where: {
                        id: postId,
                    },
                    data: {
                        like: json,
                    },
                },
            },
        },
    })
    console.log(update)
}