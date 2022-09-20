import prisma from "../../libs/prisma";
export default async function createPost(req, res) {
  const { img_url, authorEmail, title } = req.body;
  const result = await prisma.post.create({
    data: {
      img_url: img_url,
      title: title,
      author: {
        connect: { email: authorEmail },
      },
    },
  });

  res.json(result);
}
