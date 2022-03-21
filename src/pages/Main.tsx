import React, {useState} from 'react';
import Loader from '../components/loader';
import * as apis from '../providers/apis';
import {Place} from '../providers/types';
import GoogleMapReact from 'google-map-react';

function Main() {

  const [data, setData] = useState<Array<Place>>([]);

  if (data.length === 0) {
    apis
      .find()
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        let places: Place[] = [];
        json.results.forEach((e: any) => {
          let temp: Place = {
            fsq_id: e.fsq_id,
            name: e.name,
            categories: [],
            position: {
              latitude: e.geocodes.main.latitude,
              longitude: e.geocodes.main.longitude,
            },
            address: e.location.address
          };
          e.categories.forEach((e: any) => {
            temp.categories.push({
              name: e.name,
              icon: {
                prefix: e.icon.prefix,
                suffix: e.icon.suffix
              }
            })
          })
          places.push(temp)
        })
        console.log(places);
      })
      .catch((error) => {
        console.error(error);
      });
    return (
      <Loader/>
    );
  } else return null
    /*return (
      <div style={{height: '100vh', width: '100%'}}>
        <GoogleMapReact
          bootstrapURLKeys={{key: 'AIzaSyA096HyyxYz5KabXS2Hz2f5lEqEsaV9MTM'}} // disposable key
          defaultCenter={{
            lat: 52.500342,
            lng: 13.425170
          }}
          defaultZoom={11}
        >
        </GoogleMapReact>
      </div>
    )*/
}

export default Main;
