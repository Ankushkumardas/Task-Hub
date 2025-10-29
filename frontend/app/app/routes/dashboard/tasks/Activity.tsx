import { useQuery } from '@tanstack/react-query'
import { AnimatePresence,motion } from 'framer-motion'
import React from 'react'
import { ScrollArea } from '~/components/ui/scroll-area'
import { fetchdata } from '~/lib/fetchutil'

const Activity = ({resourceid}:{resourceid:string}) => {
    const {data,isPending}=useQuery({
        queryKey:['task-activity',resourceid],
        queryFn:()=>fetchdata(`/tasks/${resourceid}/activity`)
    })
    const activity=data?.activity;
    if(isPending){
      return  <div className="w-full h-screen flex items-center justify-center bg-white">
        <AnimatePresence>
          <motion.div
            initial={{ rotate: 0, opacity: 0 }}
            animate={{ rotate: 360, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1,
              ease: "linear",
              repeat: Infinity,
            }}
            className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full"
          />
        </AnimatePresence>
      </div>
    }
    const getActionIcon = (actiontype: string) => {
      switch (actiontype) {
      case 'created_task':
      case 'created_suntask':
      case 'created_project':
      case 'created_workspace':
        return '🟢';
      case 'updated_task':
      case 'updated_task_description':
      case 'updated_task_status':
      case 'updated_task_assignee':
      case 'updated_task_priority':
      case 'updated_suntask':
      case 'updated_project':
      case 'updated_workspace':
      case 'transferred_workspace_ownership':
        return '📝';
      case 'completed_suntask':
      case 'completed_task':
      case 'completed_project':
        return '✅';
      case 'added_member':
      case 'joined_workspace':
        return '➕';
      case 'removed_member':
        return '➖';
      case 'added_comment':
        return '💬';
      case 'added_attachment':
        return '📎';
      default:
        return '❔';
      }
    }
  return (
    <ScrollArea className=' h-[300px]'>

      {activity && activity.length > 0 ? (
        activity.map((a: any, idx: number) => (
          <div
          key={idx}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
          className='shadow rounded-md p-2'
          >
        <span style={{ fontSize: '1.2rem' }}>{getActionIcon(a.action)}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, color: '#334155' }}>
          {a.user?.name} - {a.action.replace(/_/g, ' ')}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
          {a.detail?.title} • {new Date(a.createdAt).toLocaleString()}
          </div>
        </div>
        </div>
      ))
    ) : (
      <div>No activity found.</div>
    )}
    
  </ScrollArea>
  )
}

export default Activity
