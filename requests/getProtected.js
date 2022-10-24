export const getProtected = async (path, data) => {
    const token = localStorage.getItem("userToken")
    console.log({token});
    try {
        const request = await fetch(`http://localhost:5000/${path}`, {
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