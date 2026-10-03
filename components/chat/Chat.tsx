'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Send } from 'lucide-react'
import { toast } from 'sonner'

type Message = {
  id: string
  contract_id: string
  sender_id: string
  content: string
  created_at: string
}

export default function Chat({
  contractId,
  currentUserId,
  otherName,
}: {
  contractId: string
  currentUserId: string
  otherName: string
}) {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mounted = true

    supabase
      .from('messages')
      .select('*')
      .eq('contract_id', contractId)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (!mounted) return
        if (error) {
          toast.error(error.message)
          return
        }
        setMessages(data ?? [])
      })

    const channel = supabase
      .channel(`contract-${contractId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `contract_id=eq.${contractId}`,
        },
        (payload) => {
          const msg = payload.new as Message
          setMessages((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev
            return [...prev, msg]
          })
        }
      )
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [contractId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    const content = text.trim()
    if (!content) return

    setSending(true)
    setText('')

    const { error } = await supabase.from('messages').insert({
      contract_id: contractId,
      sender_id: currentUserId,
      content,
    })

    setSending(false)
    if (error) {
      toast.error(error.message)
      setText(content)
    }
  }

  return (
    <div className="border rounded-2xl bg-white overflow-hidden flex flex-col h-[600px]">
      <div className="border-b px-5 py-3 bg-gray-50">
        <div className="font-semibold">Chat with {otherName}</div>
        <div className="text-xs text-gray-500">Messages update in real time</div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-10">
            No messages yet — say hello 👋
          </p>
        )}

        {messages.map((m) => {
          const mine = m.sender_id === currentUserId
          return (
            <div
              key={m.id}
              className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words ${
                  mine
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
              >
                {m.content}
                <div
                  className={`text-[10px] mt-1 ${
                    mine ? 'text-indigo-200' : 'text-gray-400'
                  }`}
                >
                  {new Date(m.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="border-t p-3 flex gap-2 bg-gray-50">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 border rounded-lg p-3 bg-white"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="bg-indigo-600 text-white px-5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  )
}