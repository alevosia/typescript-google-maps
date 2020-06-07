import axios from 'axios'

const form = document.querySelector('form')!
const addressInput = document.getElementById('address')! as HTMLInputElement

const GOOGLE_API = 'https://maps.googleapis.com/maps/api/geocode/json'
const GOOGLE_API_KEY = '<YOUR_API_KEY>'

type GeocoderResponse = {
    results: google.maps.GeocoderResult[]
    status: google.maps.GeocoderStatus
}

function searchAddressHandler(event: Event) {
    event.preventDefault()

    const enteredAddress = addressInput.value
    const request = GOOGLE_API + `?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`

    axios.get<GeocoderResponse>(request)
        .then((response) => {
            if (response.data.status !== "OK" || response.data.results.length === 0) {
                throw new Error('No results.')
            }

            const data = response.data.results[0] as google.maps.GeocoderResult
            const coordinates = data.geometry.location
            console.log(coordinates)

            const map = new google.maps.Map(document.getElementById('map')!, {
                center: coordinates,
                zoom: 18
            });

            new google.maps.Marker({ 
                map,
                position: coordinates,   
            })
        })
        .catch((error) => {
            console.error(error)
            alert(error)
        })
}

form.addEventListener('submit', searchAddressHandler)