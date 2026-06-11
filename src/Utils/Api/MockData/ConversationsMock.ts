export interface Message {
  id: number;
  sender: "me" | "other";
  text: string;
  time: string;
}

export interface Conversation {
  id: number;
  name: string;
  avatar: string; // emoji or image URL
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

export const conversations: Conversation[] = [
  {
    id: 1,
    name: "سارا محمدی",
    avatar: "👩",
    lastMessage: "ممنون از پیگیری شما",
    lastTime: "۱۰:۴۵",
    unread: 3,
    online: true,
    messages: [
      { id: 1, sender: "other", text: "سلام، وقت بخیر", time: "۱۰:۳۰" },
      {
        id: 2,
        sender: "me",
        text: "سلام، چطور میتونم کمک کنم؟",
        time: "۱۰:۳۲",
      },
      {
        id: 3,
        sender: "other",
        text: "در مورد سفارش شماره ۴۵۶۷ سوال داشتم",
        time: "۱۰:۳۳",
      },
      { id: 4, sender: "me", text: "بله، بفرمایید", time: "۱۰:۳۵" },
      { id: 5, sender: "other", text: "ممنون از پیگیری شما", time: "۱۰:۴۵" },
    ],
  },
  {
    id: 2,
    name: "علی رضایی",
    avatar: "👨",
    lastMessage: "فایل قرارداد رو ارسال کردم",
    lastTime: "دیروز",
    unread: 0,
    online: false,
    messages: [
      {
        id: 1,
        sender: "other",
        text: "فایل قرارداد رو ارسال کردم",
        time: "دیروز ۱۸:۲۰",
      },
    ],
  },
  {
    id: 3,
    name: "تیم پشتیبانی",
    avatar: "🎧",
    lastMessage: "کاربر جدید ثبت‌نام کرد",
    lastTime: "دوشنبه",
    unread: 1,
    online: true,
    messages: [
      {
        id: 1,
        sender: "other",
        text: "کاربر جدید ثبت‌نام کرد",
        time: "دوشنبه ۹:۱۵",
      },
      { id: 2, sender: "me", text: "اطلاعاتش رو بفرستید", time: "دوشنبه ۹:۲۰" },
    ],
  },
];
