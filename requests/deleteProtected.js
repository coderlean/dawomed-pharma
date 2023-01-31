export const deleteProtected = async (path, data) => {
    const token = localStorage.getItem("userToken")
    console.log({token});
    try {
        const request = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${path}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })

        const response = await request.json()
        return response
    } catch (error) {
        console.log({error});
    }
}