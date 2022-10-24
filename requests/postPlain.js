export const postPlain = async (path, data) => {
    try {
        const request = await fetch(`http://localhost:5000/${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const response = await request.json()
        return response
    } catch (error) {
        console.log({error});
    }
}