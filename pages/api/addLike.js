import prisma from "../../libs/prisma";

export default async function addLike(req, res) {
    const { userEmail, postId  } = req.body;
    const liked = await prisma.post.findUnique({
        where: {
            id: postId
        },
        include:{
            like: true
        }
    })
    let likedPersonArray = []
    let step
    for(step=0; step<liked.like.length; step++){
        likedPersonArray.push(liked.like[step].likedPerson)
    }
     if (likedPersonArray.includes(userEmail)){
        const update = await prisma.post.update({
            where: {
                id: postId,
            },
            data: {
                like: {
                    deleteMany: [{ likedPerson: userEmail }],
                },
            },
        })
        res.json(update)
    } else {
        const update = await prisma.post.update({
            where: {
                id: postId,
            },
            data: {
                like: {
                    create: {
                        likedPerson: userEmail
                    }
                }
            }
        })
        res.json(update)
    }

}