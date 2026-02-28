export type User = {
  id: string;
  email?: string;
  role?: string | null;
  employee?: { name?: string | null } | null;
  client?: { name?: string | null } | null;
};

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export type Conversation = {
  partner: User;
  conversation: Message[];
};

async function safeJson(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function fetchConversations(): Promise<Conversation[]> {
  const res = await fetch('/api/messages');
  if (!res.ok) throw new Error('Failed to load conversations');
  const body = await safeJson(res);
  return body?.data ?? [];
}

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch('/api/messages/contacts');
  if (!res.ok) throw new Error('Failed to load users');
  const body = await safeJson(res);
  return body?.data ?? [];
}

export async function getCurrentUser(): Promise<{ id: string; email?: string; role?: string } | null> {
  const res = await fetch('/api/auth/me');
  if (!res.ok) return null;
  return res.json();
}

export async function sendMessage(receiverId: string, message: string): Promise<Message> {
  const res = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ receiverId, message }),
  });
  if (!res.ok) throw new Error('Failed to send message');
  const body = await safeJson(res);
  return body.data;
}

export async function markMessageRead(id: string, read = true) {
  const res = await fetch('/api/messages', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, read }),
  });
  if (!res.ok) throw new Error('Failed to mark read');
  const body = await safeJson(res);
  return body.data;
}

export default {
  fetchConversations,
  fetchUsers,
  getCurrentUser,
  sendMessage,
  markMessageRead,
};
