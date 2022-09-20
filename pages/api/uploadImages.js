export default async function uploadImages(req, res){
    const response =
        await (await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ID}/images/v2/direct_upload`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGE_SECRET}`,
                },
            })).json()
    res.json({
           ...response.result,
        }
    )
}