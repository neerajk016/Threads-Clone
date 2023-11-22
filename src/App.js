import { useState,useEffect } from 'react'

import Nav from './components/Nav'
import Header from "./components/Header"
import Feed from "./components/Feed"
import PopUp from "./components/PopUp"
import WriteIcon from './components/WriteIcon'

const App=()=>{

  const [user,setUser]=useState(null);

  const [threads,setThreads]=useState(null);

  const [viewThreadsFeed,setViewThreadsFeed]=useState(true);

  const [filteredThreads,setFilteredThreads]=useState("");

  const [openPopUp,setOpenPopUp]=useState(false);

  const [interactingThread,setInteractingThread]=useState(null);

  const [popUpFeedThreads,setPopUpFeedThreads]=useState(null);

  const [text,setText]=useState("")

  const userId="c2d47d86-1c90-4369-803b-23b9fd032dae";



  const getuser=async()=>{
    try{
      const response=await fetch(`http://localhost:3000/users?${userId}`);
      const data= await response.json()
      setUser(data[0]);
    }catch(error){
      console.error(error);
    }
  }



  const getThreads=async()=>{
    try{
      const response=await fetch(`http://localhost:3000/threads?thread_from=${userId}`)
      const data=await response.json();
      setThreads(data);
    }catch(error){
      console.error(error);
    }
  }


  const getThreadsFeed=()=>{

    if(viewThreadsFeed){
      const standAloneThreads=threads?.filter(thread=>thread.reply_to===null);
      setFilteredThreads(standAloneThreads)
    }

    if(!viewThreadsFeed){
      const replyThreads=threads?.filter(thread=>thread.reply_to!==null);
      setFilteredThreads(replyThreads)
    }

  }


  const getReplies=async()=>{
    try {
      const response=await fetch(`http://localhost:3000/threads?reply_to=${interactingThread?.id}`)
      const data=await response.json();
      setPopUpFeedThreads(data);
    } catch (error) {
      console.log(error)
      
    }
  }

  const postThread=async()=>{

    const thread={
      
      "timestamp": new Date(),
      "thread_from": user.user_uuid,
      "thread_to": user.user_uuid||null,
      "reply_to": interactingThread?.id||null,
      "text": text,
      "likes": []

    }

    try {
      const response=await fetch(`http://localhost:3000/threads`,{
        method:'POST',
        headers:{
          "content-Type":"application/json"
        },
        body:JSON.stringify(thread)
      })
      const result =await response.json();
      console.log(result);
      getThreads();
      getReplies();
      setText("")
    } catch (error) {
      console.log(error)
      
    }

  }

  const handleclick=()=>{
    setPopUpFeedThreads(null);
    setInteractingThread(null);
    setOpenPopUp(true);
  }



  useEffect(()=>{
    getReplies();
  },[interactingThread])


    useEffect(()=>{
      getuser();
      getThreads();
      
    },[])


    useEffect(()=>{
      getThreadsFeed();

    },[user,threads,viewThreadsFeed])


    // console.log(user);
    // console.log(threads);

    // console.log(viewThreadsFeed)

    // console.log(filteredThreads);

    // console.log("int",interactingThread)

    // console.log(popUpFeedThreads)










  return(

    <>
      {user&&<div className="app">

          <Nav url={user.instagram_url}/>

          <Header user={user} viewThreadsFeed={viewThreadsFeed} setViewThreadsFeed={setViewThreadsFeed}/>

          {/* {filteredThreads&&<Feed user={user} filteredThreads={filteredThreads} />} */}
          <Feed user={user} filteredThreads={filteredThreads} setOpenPopUp={setOpenPopUp} getThreads={getThreads} setInteractingThread={setInteractingThread} />

          {openPopUp&&<PopUp setOpenPopUp={setOpenPopUp} popUpFeedThreads={popUpFeedThreads} text={text} setText={setText} postThread={postThread} user={user} /> }

          <div onClick={()=>{setOpenPopUp(true)}}>
            <WriteIcon/>
          </div>

          </div> }
        
    </>
  )



}

export default App;

