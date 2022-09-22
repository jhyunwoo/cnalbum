import prisma from "../../libs/prisma";

export default async function deletePost(req, res) {
  const { postId } = req.body;
  const delPost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      like: {
        deleteMany: {},
      },
    },
  });
  const delPostLike = await prisma.post.delete({
    where: {
      id: postId,
    },
  });
  res.json({
    ok: true,
  });
}
