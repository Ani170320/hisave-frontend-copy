// axios removed, using native fetch

// Better to use native fetch for a standalone script to avoid dependency issues if not installed in root.

async function testSearchOffers() {
    const url = 'https://jmiazr2sjf.ap-south-1.awsapprunner.com/searchOffers';
    const payload = {
        searchPhrase: "food",
        banks: [],
        cardNetworks: [],
        lat: "12.9716",
        long: "77.5946",
        user_country: "India",
        paymentMethods: [],
        uid: "test_user"
    };

    console.log(`Testing API: ${url}`);
    console.log('Payload:', JSON.stringify(payload, null, 2));

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Response Status:', response.status);
        console.log('Data received:', JSON.stringify(data).substring(0, 200) + '...'); // logging first 200 chars

        if (data.matching_offers) {
            console.log(`Found ${data.matching_offers.length} offers.`);
        } else {
            console.log('No matching_offers field in response.');
        }

    } catch (error) {
        console.error('API Call Failed:', error.message);
        if (error.cause) console.error('Cause:', error.cause);
    }
}

testSearchOffers();
