import prisma from "../../libs/prisma";
export default async function handle(req, res) {
  const { img_url, authorEmail } = req.body;
  const result = await prisma.post.create({
    data: {
      img_url: img_url,
      author: {
        connect: { email: authorEmail },
      },
    },
  });
  res.json(result);
}
