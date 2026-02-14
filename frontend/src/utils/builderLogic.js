export const generateBuild = async (budget, useCase) => {
    try {
        const response = await fetch('http://localhost:5000/api/build', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ budget, useCase }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate build');
        }

        const data = await response.json();
        return data; // Returns { totalPrice: 123, parts: [...] }

    } catch (error) {
        console.error("Build Generation Failed:", error);
        throw error;
    }
};
