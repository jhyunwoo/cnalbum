export default async function UploadImages(req, res){
    const response =
        await (await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ID}/images/v2/direct_upload`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGE_SECRET}`,
                },
            })).json()
    console.log(response)
    // console.log(response.json())
    // const json_response = JSON.parse(response)
    // console.log(json_response.result)
    res.json({
           ...response.result
        }
    )
}