export const postProtectedMultiPart = async (path, data) => {
    const token = localStorage.getItem("userToken")

    try {
        const request = await fetch(`http://localhost:5000/${path}`, {
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