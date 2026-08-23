import classNames from 'classnames'
import React from 'react'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
dayjs.extend(isToday)

export interface ChatMessageProps {
  children?: React.ReactNode
  className?: string
  isMe?: boolean
  sentAt: string | number
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  children,
  className,
  isMe = false,
  sentAt,
}) => {
  const date = dayjs(sentAt)

  return (
    <div>
      <div
        className={classNames(
          'max-w-[80%] rounded-lg w-max border border-transparent',
          isMe
            ? 'bg-foreground text-background ml-auto'
            : 'bg-background-dark border-foreground/5 mr-auto',
          className,
        )}
      >
        {children}
      </div>
      <p
        className={classNames(
          'text-xs mt-1 mx-2',
          isMe ? 'text-foreground/50 text-right' : 'text-foreground/50',
        )}
      >
        {date.isToday()
          ? date.format('HH:mm')
          : date.year() === dayjs().year()
          ? date.format('DD/MM HH:mm')
          : date.format('DD/MM/YYYY HH:mm')}
      </p>
    </div>
  )
}

export default ChatMessage
