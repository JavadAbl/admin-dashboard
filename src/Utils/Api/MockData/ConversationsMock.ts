export interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
}

export interface Conversation {
  id: number;
  name: string;
  avatar: string;
  online: boolean;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: Message[];
  userId?: string; // link to User.id when conversation started from user list
}

export const conversations: Conversation[] = [
  {
    id: 1,
    name: "علی محمدی",
    avatar: "ع",
    online: true,
    lastMessage: "سلام، پروژه رو ببین لطفاً",
    lastTime: "۱۰:۳۰",
    unread: 2,
    userId: "user-1",
    messages: [
      { id: 1, sender: "other", text: "سلام، خوبی؟", time: "۱۰:۰۰" },
      { id: 2, sender: "me", text: "سلام! ممنون، تو چطوری؟", time: "۱۰:۰۵" },
      {
        id: 3,
        sender: "other",
        text: "سلام، پروژه رو ببین لطفاً",
        time: "۱۰:۳۰",
      },
    ],
  },
  {
    id: 2,
    name: "سارا احمدی",
    avatar: "س",
    online: false,
    lastMessage: "فایل رو فرستادم",
    lastTime: "دیروز",
    unread: 0,
    userId: "user-2",
    messages: [
      { id: 1, sender: "other", text: "فایل رو فرستادم", time: "۱۸:۲۰" },
    ],
  },
  {
    id: 3,
    name: "رضا کریمی",
    avatar: "ر",
    online: true,
    lastMessage: "جلسه ساعت چنده؟",
    lastTime: "۹:۱۵",
    unread: 1,
    userId: "user-3",
    messages: [
      { id: 1, sender: "me", text: "سلام رضا", time: "۹:۰۰" },
      { id: 2, sender: "other", text: "جلسه ساعت چنده؟", time: "۹:۱۵" },
    ],
  },
];
