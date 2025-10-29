import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import type { User } from '~/types'

const Watchers = ({watchers}:{watchers:User[]}) => {
    console.log(watchers)
  return (
    <div>
      <h1 className=' text-slate-700 font-semibold'>Watchers:</h1>
      <div>
        {watchers?.length>2?(
            watchers.map((w)=>(
                <div key={w._id} className=' flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={w.profilepicture}/>
                        <AvatarFallback>
                            {w.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>
            ))
        ):(<p>No Watchers</p>
        )}
      </div>
    </div>
  )
}

export default Watchers
