export const putProtected = async (path, data) => {
    const token = localStorage.getItem("userToken")
    console.log({token});
    try {
        const request = await fetch(`http://localhost:5000/${path}`, {
            method: 'PUT',
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