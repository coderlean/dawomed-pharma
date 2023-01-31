export const postProtectedMultiPart = async (path, data) => {
    const token = localStorage.getItem("userToken")

    try {
        const request = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${path}`, {
            method: 'POST',
            headers: {
                "authorization": `Bearer ${token}`
            },
            body: data
        })

        const response = await request.json()
        return response
    } catch (error) {
        console.log({error});
    }
}