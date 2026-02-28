"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Button from './ui/Button';
import { toast } from 'sonner';
import messageService, { Conversation, Message, User } from '@/app/lib/messageService';

export default function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<{ id: string; email?: string; role?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [newMsg, setNewMsg] = useState('');
  const [showNewDropdown, setShowNewDropdown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([messageService.fetchConversations(), messageService.fetchUsers(), messageService.getCurrentUser()])
      .then(([convos, userList, me]) => {
        setConversations(convos || []);
        setUsers(userList || []);
        setCurrentUser(me || null);
        if (convos && convos.length > 0) setSelectedPartnerId(convos[0].partner?.id ?? null);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load messages');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedPartnerId, conversations]);

  const selectedConversation = useMemo(() => conversations.find((c) => c.partner.id === selectedPartnerId) ?? null, [conversations, selectedPartnerId]);

  function getDisplayName(u: User) {
    console.log(u.employee?.name, "from getname")
    return u.employee?.name || u.client?.name || u.email || 'User';
  }

  function getInitial(u: User) {
    const name = getDisplayName(u);
    return (name || 'U')[0].toUpperCase();
  }

  function roleClass(role?: string | null) {
    switch (role) {
      case 'ADMIN':
        return 'bg-blue-500 text-white';
      case 'EMPLOYEE':
        return 'bg-green-500 text-white';
      case 'CLIENT':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-300 text-black';
    }
  }

  function openOrCreateConversation(user: User) {
    setShowNewDropdown(false);
    const exists = conversations.find((c) => c.partner.id === user.id);
    if (exists) {
      setSelectedPartnerId(user.id);
      return;
    }
    const newConv: Conversation = { partner: user, conversation: [] };
    setConversations((prev) => [newConv, ...prev]);
    setSelectedPartnerId(user.id);
  }

  async function handleSend() {
    if (!selectedPartnerId) return toast.error('Select a conversation');
    if (!newMsg.trim()) return;
    try {
      const created: Message = await messageService.sendMessage(selectedPartnerId, newMsg.trim());
      setConversations((prev) =>
        prev.map((c) => (c.partner.id === selectedPartnerId ? { ...c, conversation: [created, ...c.conversation] } : c))
      );
      setNewMsg('');
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to send');
    }
  }

  if (loading) return <div className="p-4">Loading messages...</div>;

  return (
    <div className="flex h-150  shadow-[0_0_20px_20px_#f3f3f3] rounded overflow-hidden">
      <div className="w-80 shadow inset-shadow-zinc-950 p-3 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Messages</h3>
          <div className="relative">
            <Button
              onClick={() => setShowNewDropdown((s) => !s)}
              width='lg'
              padding='3'
              rounded='full'
            >
              +
            </Button>
            {showNewDropdown && (
              <div className="absolute right-0 mt-2 w-76 bg-white shadow-cyan-950 scroll-bar rounded-lg shadow-lg z-20 max-h-64 overflow-auto">
                {users
                  .filter((u) => u.id !== currentUser?.id)
                  .map((u) => (
                    <div
                      key={u.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer w-full flex items-center gap-3"
                      onClick={() => openOrCreateConversation(u)}
                    >
                      <div className="min-w-8 min-h-8 rounded-full bg-gray-300 flex items-center justify-center">{getInitial(u)}</div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{getDisplayName(u)}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </div>
                      <div className={`text-xs px-2 py-0.5 rounded ${roleClass(u.role)}`}>{u.role ?? 'USER'}</div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {conversations.length === 0 && <div className="text-sm text-gray-500">No conversations yet.</div>}
          {conversations.map((c) => {
            const last = c.conversation[0];
            return (
              <div
                key={c.partner.id}
                onClick={() => setSelectedPartnerId(c.partner.id)}
                className={`p-2 rounded flex items-center gap-3 hover:bg-gray-100 cursor-pointer  ${selectedPartnerId === c.partner.id ? 'bg-gray-200 hover:bg-sky-100 border-l-4 border-sky-500' : 'hover:bg-gray-100'}`}
              >
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full ${roleClass(c.partner.client?.name)} flex items-center justify-center text-lg font-semibold`}>{getInitial(c.partner)}</div>
                  {/* <div className="absolute top-0 right-0">
                    <div className={`text-xs px-2 py-0.5 rounded ${roleClass(c.partner.employee?.name ? "EMPLOYEE" : (c.partner.client?.name ? "CLIENT" : "ADMIN"))}`}>{c.partner.client?.name}</div>
                  </div> */}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium truncate">{getDisplayName(c.partner)}</div>
                    <div className="text-xs text-gray-400 w-16">{last ? new Date(last.createdAt).toLocaleString() : ''}</div>
                  </div>
                  <div className="text-sm text-gray-500 truncate">{last?.message ?? 'No messages yet'}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {!selectedConversation ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">Select a conversation to view messages</div>
        ) : (
          <>
            <div className=" shadow-[0px_-10px_2px_10px_#00000] p-3 flex items-center gap-3">
              <div className="w-10 h-10 min-size-10 rounded-full bg-indigo-200 flex items-center justify-center font-semibold">{getInitial(selectedConversation.partner)}</div>
              <div>
                <div className="font-medium">{getDisplayName(selectedConversation.partner)}</div>
                <div className="text-xs text-gray-500">{selectedConversation.partner.employee?.name ? ( "EMPLOYEE") : (selectedConversation.partner.client?.name ? "CLIENT" : "Admin")}</div>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-auto bg-gray-200">
              <div className="flex flex-col gap-3">
                {[...selectedConversation.conversation]
                  // .slice()
                  .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                  .map((m) => {
                    const mine = m.senderId === currentUser?.id;
                    return (
                      <div key={m.id} className={`w-full flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] ${mine ? 'ml-auto mr-2' : 'mr-auto ml-2'}`}>
                          <div className={`px-4 py-2 rounded-lg break-words shadow-sm ${mine ? 'bg-sky-600 text-white' : 'bg-white text-black'}`}>
                            {m.message}
                          </div>
                          <div className={`text-xs text-gray-400 mt-1 ${mine ? 'text-right' : 'text-left'}`}>{new Date(m.createdAt).toLocaleString()}</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3  flex items-center gap-2">
              <input
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-2 focus:outline-none ring ring-gray-500 rounded px-3 py-2"
                placeholder="Write a message..."
              />
              <Button width='md' onClick={handleSend}>Send</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}