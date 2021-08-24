import { useEffect, useState } from 'react';
import ReactMapGL,{Marker,Popup} from 'react-map-gl';
import {Room,Star} from '@material-ui/icons'
import './app.css'
import {format} from "timeago.js"
import Register from './components/Register';
import Login from './components/Login';
import axios from 'axios';

function App() {
  const myStorage = window.localStorage;
  const [currentUser,setCurrentUser] = useState(myStorage.getItem('User'));
  const [pins,setPins] = useState([]);
  const [currentPlaceId,setCurrentPlaceId] = useState(null);
  const [newPlace,setnewPlace] = useState(null);
  const [title,setTitle] = useState(null);
  const [desc,setDesc] = useState(null);
  const [rating,setRating] = useState(0);
  const [showregister,setShowregister] = useState(false);
  const [showlogin,setShowlogin] = useState(false);
  const [viewport, setViewport] = useState({
    width:'100vw',
    height:'100vh',
    latitude: 36.80013863059345,
    longitude: 10.17341295148003,
    zoom: 8
  });
const handleMarkerClick = (id,lat,long) =>{
  setCurrentPlaceId(id);
  setViewport({...viewport,latitude:lat,longitude:long})
}


  useEffect(()=>{
    const getpins = async () => {
      try {
        const res = await axios.get('/pins');
        setPins(res.data);
      } catch (err) {
        console.log(err)
      }
    }
    getpins();
  },[])

const handleAddClick = (e) =>{
const [long,lat] = e.lngLat;
  setnewPlace({
    lat,
    long,
  })

}
const handlelogout = () => {
  myStorage.removeItem('User');
  setCurrentUser(null);
}
const handleSubmit = async (e)=>{
  e.preventDefault();
  const newPin = {
    username:currentUser,
    title,
    desc,
    rating,
    lat:newPlace.lat,
    long:newPlace.long
  }

  try {
    const res = await axios.post("/pins",newPin);
    setPins([...pins,res.data])
    setnewPlace(null);
  } catch (err) {
    console.log(err)
  }
}
  return (
    <div className="App">
     <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={(viewport) => setViewport(viewport)}
        mapStyle="mapbox://styles/aymenouerghui/cksi3rp382ot017r3i5k3q13w"
        onDblClick={handleAddClick}
 
   >
       
      {
        pins.map(p =>(
          <>
          <Marker latitude={p.lat} longitude={p.long} offsetLeft={-viewport.zoom * 3.5} offsetTop={-viewport.zoom * 7}>
        <Room onClick={()=>handleMarkerClick(p._id,p.lat,p.long)} style={{fontSize:viewport.zoom * 7, color: p.username === currentUser ? 'tomato' : 'slateblue', cursor:'pointer'}} />
      </Marker>
      {p._id === currentPlaceId &&
          <Popup
          latitude={p.lat}
          longitude={p.long}
          closeButton={true}
          closeOnClick={false}
             anchor="left"
             onClose={()=>setCurrentPlaceId(null)}
          
          >
    <div className="card" >
      <label>Place</label>
      <h4 className="place" >{p.title}</h4>
    <label>Review</label>
    <p className="desc" >{p.desc}</p>
    <label>Rating</label>
    <div className="stars" >
      {Array(p.rating).fill(<Star className="star" />)}

    </div>
    <label>Information</label>
    <span className="username" >Created by <b>{p.username}</b> </span>
    <span className="date" >{format(p.createdAt)} </span>
    </div>
          </Popup>

}
          </>
        ))
      }
      {newPlace && (
   <Popup
   latitude={newPlace.lat}
   longitude={newPlace.long}
   closeButton={true}
   closeOnClick={false}
      anchor="left"
      onClose={()=>setnewPlace(null)}
   
   >
     <div>
       <form onSubmit={handleSubmit} >
         <label>Title</label>
         <input placeholder="Enter a title" onChange={(e)=>setTitle(e.target.value)} />
         <label>Review</label>
         <textarea onChange={(e)=>setDesc(e.target.value)} placeholder="Say us something about this place." />
         <label>Rating</label>
        <select onChange={(e)=>setRating(e.target.value)} >
          <option value="1" >1</option>
          
          <option value="2" >2</option>
          
          <option value="3" >3</option>
          
          <option value="4" >4</option>
          
          <option value="5" >5</option>
          
        </select>
        <button className="submitButton" type="submit" >Add Pin</button>
       </form>
     </div>

   </Popup>
      )}
      {currentUser ? (  <button className="button Logout" onClick={handlelogout} >Log out</button>
       ) : (  <div className="buttons" >

       <button className="button Login" onClick={()=>setShowlogin(true)}>Login</button>
       <button className="button Register" onClick={()=>setShowregister(true)}>Register</button>

      </div>)}
      {showregister && <Register setShowregister={setShowregister} />}
      {showlogin && <Login myStorage={myStorage} setCurrentUser={setCurrentUser} setShowlogin={setShowlogin} />}
      
       </ReactMapGL>
    </div>
  );
}

export default App;
