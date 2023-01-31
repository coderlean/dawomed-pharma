export const getProtected = async (path, data,) => {
    const token = localStorage.getItem("userToken")

    console.log({serverUrl: process.env.NEXT_PUBLIC_SERVER_URL});

    try {
        const request = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${path}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "authorization": `Bearer ${token}`
            },
        })

        const response = await request.json()
        return response
    } catch (error) {
        console.log({error});
    }
}