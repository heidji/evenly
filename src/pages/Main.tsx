import React, {useState} from 'react';
import Loader from '../components/loader';
import * as apis from '../providers/apis';
import {Photo, Place} from '../providers/types';
import GoogleMapReact from 'google-map-react';
import {Box, Typography, IconButton} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';

// lazy copy
const StartLocation = () => {
  return (
    <Box sx={{position: 'relative', width: 0, height: 0, overflow: 'visible', zIndex: 2}}>
      <Box sx={{display: 'flex', flexDirection: 'column', position: 'absolute', top: '-42px', left: '-16px'}}>
        <Box
          sx={{background: 'red', width: '100%', textAlign: 'center', lineHeight: '20px', pt: '3px', color: 'white'}}>
          <StarIcon/>
        </Box>
        <Box sx={{
          width: 0,
          height: 0,
          borderStyle: 'solid',
          borderWidth: '10px 16px 0 16px',
          borderColor: 'red transparent transparent transparent'
        }}>
        </Box>
      </Box>
    </Box>
  )
}

const placeCategories = (place: Place) => {
  let t: string = '';
  place.categories.forEach((cat: any, i: number) => {
    if(i>0)
      t += ' / ';
    t += cat.name;
  })
  return t;
}

function Main() {

  const [data, setData] = useState<Array<Place>>([]);
  const [preview, setPreview] = useState<Place | boolean>(false);
  const [center, setCenter] = useState(null);

  const Preview = () => {
    return (
      <Box sx={{
        height: '300px',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'text.primary',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{position: 'absolute', right: 0}}>
          <IconButton
            onClick={() => window.open('https://foursquare.com/v/' + preview.name.trim().toLowerCase().replace(' ', '-') + '/' + preview.fsq_id)}
            sx={{color: 'white'}}>
            <OpenInBrowserIcon/>
          </IconButton>
          <IconButton onClick={() => setPreview(false)} sx={{color: 'white'}}>
            <CloseIcon/>
          </IconButton>
        </Box>
        <Box sx={{width: '80%'}}>
          <Typography variant={'h5'} color={'white'}>
            {preview.name}
          </Typography>
          <Box component={'span'} color={'white'}>
            {preview.address}
          </Box>
        </Box>
        {!preview.photos ? <Loader/> : (
          <Box sx={{display: 'flex', flexDirection: 'row', overflowX: 'scroll', pt: '10px'}}>
            {preview.photos.map((e: Photo) => (
              <Box sx={{mr: '10px'}} component={'img'} src={e.prefix + '200x200' + e.suffix}
                   onClick={() => window.open(e.prefix + e.width + 'x' + e.height + e.suffix)}/>
            ))}
          </Box>
        )}
      </Box>
    )
  }

  const openPreview = (place: Place) => {
    setPreview(place)
    let photos: Photo[] = [];
    apis
      .photos(place.fsq_id)
      .then((response) => response.json())
      .then((json) => {
        json.forEach((e: any) => {
          let temp: Photo = {
            prefix: e.prefix,
            suffix: e.suffix,
            width: e.width,
            height: e.height
          };
          photos.push(temp)
        })
        let p: Place = {...place, photos: photos}
        setPreview(p)
      })
      .catch((error) => {
        let p: Place = {...place, photos: photos}
        setPreview(p)
      });
  }

  const location = (place: Place) => {
    return (
      <Box lat={place.position.latitude} lng={place.position.longitude}
           sx={{position: 'relative', width: 0, height: 0, overflow: 'visible'}}>
        <Box sx={{display: 'flex', flexDirection: 'column', position: 'absolute', top: '-42px', left: '-16px'}}
             onClick={() => openPreview(place)}>
          <Box component={'img'}
               src={place.categories[0].icon.prefix + '32' + place.categories[0].icon.suffix}
               sx={{background: 'purple'}}
          />
          <Box sx={{
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: '10px 16px 0 16px',
            borderColor: 'purple transparent transparent transparent'
          }}>
          </Box>
        </Box>
      </Box>
    )
  }

  if (data.length === 0) {
    apis
      .find()
      .then((response) => response.json())
      .then((json) => {
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
        setData(places);
      })
      .catch((error) => {
        // do nothing
      });
    return (
      <Loader/>
    );
  } else
    return (
      <Box sx={{width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column', height: '100vh', overflow: 'hidden'}}>
        <Box sx={{position: 'relative', height: {xs: '500px', md: '500px'}, width: {xs: '100%', lg: '700px'}}}>
          <GoogleMapReact
            bootstrapURLKeys={{key: atob('QUl6YVN5QTA5Nkh5eXhZejVLYWJYUzJIejJmNWxFcUVzYVY5TVRN')}} // disposable key
            defaultCenter={{
              lat: 52.500342,
              lng: 13.425170
            }}
            defaultZoom={15}
            center={center}
            options={{
              streetViewControl: false,
              fullscreenControl: false
            }}
          >
            <StartLocation lat={52.500342} lng={13.425170}/>
            {data.map(place => {
              return location(place);
            })}
          </GoogleMapReact>
          {preview ? <Preview/> : null}
        </Box>
        <Box sx={{position: 'relative', maxHeight: {xs: '500px', md: '500px'}, width: {xs: '100%', lg: '700px'}, overflowY: 'scroll'}}>
          {data.map((place: Place) => (
            <Box sx={{height: '100px', display: 'flex', flexDirection: 'row'}} onClick={() => {
              setCenter([place.position.latitude, place.position.longitude]);
              openPreview(place)
            }}>
              <Box component={'img'}
                   src={place.categories[0].icon.prefix + '88' + place.categories[0].icon.suffix}
                   sx={{background: 'purple', padding: '10px', border: '3px solid white'}}
              />
              <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Typography variant={'h6'} color={'black'}>
                  {place.name}
                </Typography>
                <Box component={'span'} color={'black'} sx={{fontStyle: 'italic'}}>
                  {place.address}
                </Box>
                <Box component={'span'} color={'black'}>
                  {placeCategories(place)}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    )
}

export default Main;
