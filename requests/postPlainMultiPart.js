export const postPlainMultiPart = async (path, data) => {

    try {
        const request = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${path}`, {
            method: 'POST',
            body: data
        })

        const response = await request.json()
        return response
    } catch (error) {
        console.log({error});
    }
}