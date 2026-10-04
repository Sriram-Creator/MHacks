import type { Conversation } from '@/components/buyer/mock-conversations';

export type BuyerPeer = {
  id: string;
  name: string;
  photo: string;
};

export const mockBuyers: BuyerPeer[] = [
  {
    id: 'buyer-jordan',
    name: 'Jordan M.',
    photo: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200',
  },
  {
    id: 'buyer-alex',
    name: 'Alex Chen',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
  },
  {
    id: 'buyer-sam',
    name: 'Sam Rivera',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
  },
  {
    id: 'buyer-priya',
    name: 'Priya N.',
    photo: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200',
  },
];

/**
 * Same Conversation shape as the buyer inbox (`makerId` holds the other
 * party's id so ConversationRow / lastMessage stay reusable).
 */
export const mockMakerConversations: Conversation[] = [
  {
    id: 'thread-jordan-sourdough',
    makerId: 'buyer-jordan',
    unread: true,
    messages: [
      {
        id: 'jordan-1',
        author: 'buyer',
        body: 'Hi! Is the sourdough still available for Saturday pickup?',
        sentAt: '2026-10-03T13:02:00-04:00',
      },
      {
        id: 'jordan-2',
        author: 'maker',
        body: 'Yes — I have a few loaves left. Want me to set one aside?',
        sentAt: '2026-10-03T13:05:00-04:00',
      },
      {
        id: 'jordan-3',
        author: 'buyer',
        body: 'Please do. Is it dairy-free?',
        sentAt: '2026-10-03T13:06:00-04:00',
      },
    ],
  },
  {
    id: 'thread-alex-pie',
    makerId: 'buyer-alex',
    unread: true,
    messages: [
      {
        id: 'alex-1',
        author: 'buyer',
        body: 'Can I preorder two Michigan cherry pies for Saturday? Allergen question — is there dairy in the crust?',
        sentAt: '2026-10-03T11:20:00-04:00',
      },
      {
        id: 'alex-2',
        author: 'maker',
        body: 'Crust is butter + wheat, filling is fruit and sugar. I can hold two if you confirm by Thursday night.',
        sentAt: '2026-10-03T11:34:00-04:00',
      },
      {
        id: 'alex-3',
        author: 'buyer',
        body: 'Confirmed. Kerrytown 10–11 works.',
        sentAt: '2026-10-03T11:41:00-04:00',
      },
    ],
  },
  {
    id: 'thread-sam-jam',
    makerId: 'buyer-sam',
    unread: false,
    messages: [
      {
        id: 'sam-1',
        author: 'buyer',
        body: 'Do you still have strawberry jam? I want a jar as a host gift.',
        sentAt: '2026-10-02T18:10:00-04:00',
      },
      {
        id: 'sam-2',
        author: 'maker',
        body: 'Yes — shelf-stable, fruit + sugar + lemon. I will put a 8oz on the Saturday table with your name.',
        sentAt: '2026-10-02T18:22:00-04:00',
      },
    ],
  },
  {
    id: 'thread-priya-cookies',
    makerId: 'buyer-priya',
    unread: false,
    messages: [
      {
        id: 'priya-1',
        author: 'buyer',
        body: 'The chocolate chip 6-pack — any chance of a nut-free tray this weekend?',
        sentAt: '2026-10-01T09:15:00-04:00',
      },
      {
        id: 'priya-2',
        author: 'maker',
        body: 'This batch is wheat, dairy, and egg only — no nuts on that tray. I mix it before the granola so it stays separate.',
        sentAt: '2026-10-01T09:28:00-04:00',
      },
      {
        id: 'priya-3',
        author: 'buyer',
        body: 'Perfect. I will grab a pack at the library lobby Saturday.',
        sentAt: '2026-10-01T09:40:00-04:00',
      },
    ],
  },
];

export function getBuyer(id: string): BuyerPeer | undefined {
  return mockBuyers.find((buyer) => buyer.id === id);
}
