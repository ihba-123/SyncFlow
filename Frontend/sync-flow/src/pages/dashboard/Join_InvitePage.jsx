import React from 'react'
import { useParams } from 'react-router-dom'

const Join_InvitePage = () => {
  const {token} = useParams() 
  console.log(token)
  return (
    <div>
      <h1>Joining the team project </h1>
    <p>invitetoken:{token}</p>
      <button>
        Join
      </button>
    </div>
  )
}

export default Join_InvitePage

