import React, { useState, useMemo } from "react";
import { GoogleMap, Marker, useLoadScript  } from "@react-google-maps/api";
import { useSelector,useDispatch } from "react-redux";
import axios from "axios";
import { useParams } from "react-router-dom";
import { fetchNearbyStations, fetchSearchAddress } from "../store";



const Map = () => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyAyylWo4yRMjT_HSowB1jWsz5qwnPDSUWw',
    });
    const originCenter = useMemo(() => ({ lat: 41.8781, lng: -87.000 }), []);
    const [center,setCenter]= useState(null);
    const [myLocation, setMyLocation] = useState(null);
    const [searchInput,setSearchInput] = useState('');
    const [searchLocation, setSearchLocation] = useState(null);
    const [addressList,setAddressList] = useState([center]);
    const [EVSList,setEVSList] = useState(null);
    

    //test
    const dispatch = useDispatch();
    const {searchAddress, station} = useSelector(state => state);
    const {address} = useParams();


    React.useEffect(() => {
         dispatch(fetchSearchAddress(address));
       }, [address]);

    React.useEffect(() =>{
        setCenter(searchAddress.latLng);
        dispatch(fetchNearbyStations({address:searchAddress,inputRadius:1}));
    },[searchAddress]);

    React.useEffect(()=>{
      console.log('stations',station);
      setEVSList(station);
    },[station])
      
    
    
   

    
/// use this to set current location
    React.useEffect(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const userLocation = { lat: latitude, lng: longitude };
              setMyLocation(userLocation);
              //setCenter(userLocation);
              setAddressList((prevAddressList) => [...prevAddressList, userLocation]);
            },
            (error) => {
              console.error(error.message);
            }
          );
        }
      }, []);


    // const handleLocalLocation = () => {
    //     if (navigator.geolocation) {
    //       navigator.geolocation.getCurrentPosition(
    //         (position) => {
    //           const { latitude, longitude } = position.coords;
    //           console.log(`Latitude: ${latitude}`, typeof latitude);
    //           console.log(`Longitude: ${longitude}`);
    //           const newLocation = { lat: latitude, lng: longitude };
    //           setMyLocation(newLocation);
    //           setAddressList((prevAddressList) => [...prevAddressList, newLocation]);
    //           setCenter(newLocation);
    //         },
    //         (error) => {
    //           console.error(error.message);
    //         }
    //       );
    //     }
    //   };
      
      console.log('searchAddress',searchAddress);
      
      

  //   const handleEVStations = async (zipcode) => {
  //     try {
  //         const response = await axios.get('https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.geojson', {
  //             params: {
  //                 api_key:'bN0UmPUvm6d9Wqhwl3E4HHigDM8P393YnX30oPdI',
  //                 fuel_type: 'ELEC',
  //                 location:zipcode,
  //                 radius:1,
  //                 limit:'all'
  //             },
  //         });
  //         setEVSList(response.data.features);
  //         console.log('response',response);
  //         console.log('features:',response.data.features)
  //         console.log(EVSList);

  //         // setEVSList(response.data.fuel_stations);
  //         // console.log(EVSList);
          
  //     } catch (ex) {
  //         console.log(ex);
  //     }
  // };

     
    // const handleSearchGeo = async (ev) => {
    //     ev.preventDefault();
    //     try {
    //         console.log('searchInput:',searchInput)
    //         const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    //             params: {
    //             address: searchInput,
    //             key: 'AIzaSyAyylWo4yRMjT_HSowB1jWsz5qwnPDSUWw', // Replace with your own API key
    //             },
    //         });
    //         // console.log('search address:',response.data);
    //         const addressArr = response.data.results[0].formatted_address.split(',');
    //         const tempAddressARR =addressArr[addressArr.length-2].split(' ');
    //         const zipcode = tempAddressARR[tempAddressARR.length-1];
    //         const mySearchLocation = response.data.results[0].geometry.location;//get latitude and longitude
    //         console.log(response.data);
    //         handleEVStations(zipcode);
    //         setSearchLocation(mySearchLocation);
    //         setCenter(mySearchLocation);
    //         setAddressList((prevAddressList) => [...prevAddressList, mySearchLocation]);
    //     } catch (ex) {
    //         console.log(ex);
    //     }
    // };

    const onChange = (ev)=>{
        setSearchInput(ev.target.value);
    } 
    const mapOptions = {
        streetViewControl: false
      };


return (
  <div className="Map">
    <h1> address: {address}</h1>

    {/*
      return (
          <form onSubmit={handleSearchGeo}>
            <input placeholder=" search city, place or address" value={searchInput} onChange={onChange}/>
            <button>search</button>
          </form>
      )
     */}   

  {!isLoaded ? (
      <h1>Loading...</h1>
  ) : (
      <GoogleMap
      mapContainerClassName="map-container"
      center={center}
      zoom={15}
      options={mapOptions}
      >
          <Marker 
              position={center} 
              icon={"http://maps.google.com/mapfiles/ms/icons/green-dot.png"}
          />
          {myLocation?
          ( <Marker 
              position={myLocation} />
          )
          :(null)}

          {searchLocation?
          ( <Marker 
              position={searchLocation} 
              icon={"http://maps.google.com/mapfiles/ms/icons/pink-dot.png"}/>
          )
          :(null)
          }
          {
            EVSList?
            (
              EVSList.map((s)=>{
              //console.log(`here,latitude:${s.geometry.coordinates[1]},longitude:${s.geometry.coordinates[0]}`);
              let location = {lat:s.geometry.coordinates[1],lng:s.geometry.coordinates[0]};
              //console.log(location);
                return(
                    <Marker
                    position={location}
                    icon={"http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"}
                    key={s.properties.id}
                    />
                )
              })
            ):(null)
          }
          
      </GoogleMap>
  )}
  {
    /*
      <button className="map-button" onClick={handleLocalLocation}>My Location</button>
      <button onClick={handleSearchGeo}>getGeoCode</button>
      <button onClick ={handleEVStations}>getEVStations</button>
    */
  }
  
  </div>
);
};
export default Map;