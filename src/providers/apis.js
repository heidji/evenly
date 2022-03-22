const uri =
  'https://api.foursquare.com/v3/';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export function testAuth(auth) {
  return fetch(uri + 'places/search', {
    method: 'GET',
    headers: {...headers, Authorization: auth}
  });
}

export function find() {
  return fetch(uri + 'places/search?' + new URLSearchParams({
    ll: '52.500342,13.425170',
    limit: 50
  }), {
    method: 'GET',
    headers: {...headers, Authorization: window.auth}
  });
}

export function photos(fsq_id) {
  return fetch(uri + 'places/' + fsq_id + '/photos', {
    method: 'GET',
    headers: {...headers, Authorization: window.auth}
  });
}
