export const getPlain = async (path, data,) => {
    try {
        const request = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${path}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const response = await request.json()
        return response
    } catch (error) {
        console.log({error});
    }
}