import type { ChatMessage } from '@/components/buyer/mock-conversations';

export type { ChatMessage };

/** A conversation thread between the current maker and a single buyer. */
export type BuyerConversation = {
  id: string;
  buyerId: string;
  buyerName: string;
  unread: boolean;
  messages: ChatMessage[];
};

export const makerConversations: BuyerConversation[] = [
  {
    id: 'buyer-jordan',
    buyerId: 'buyer-jordan',
    buyerName: 'Jordan M.',
    unread: true,
    messages: [
      {
        id: 'jordan-1',
        author: 'buyer',
        body: 'Hi! Is the classic sourdough still available for Saturday pickup?',
        sentAt: '2026-10-03T13:02:00-04:00',
      },
      {
        id: 'jordan-2',
        author: 'maker',
        body: 'Yes! I have a few loaves left — want me to set one aside?',
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
    id: 'buyer-priya',
    buyerId: 'buyer-priya',
    buyerName: 'Priya S.',
    unread: true,
    messages: [
      {
        id: 'priya-1',
        author: 'buyer',
        body: 'Could I pre-order two Michigan cherry pies for next weekend?',
        sentAt: '2026-10-03T11:20:00-04:00',
      },
      {
        id: 'priya-2',
        author: 'maker',
        body: 'Absolutely — cherries are peaking right now. I can have both ready Saturday.',
        sentAt: '2026-10-03T11:34:00-04:00',
      },
    ],
  },
  {
    id: 'buyer-marcus',
    buyerId: 'buyer-marcus',
    buyerName: 'Marcus T.',
    unread: false,
    messages: [
      {
        id: 'marcus-1',
        author: 'buyer',
        body: 'Do the chocolate chip cookies have nuts? Buying for a classroom.',
        sentAt: '2026-10-02T17:48:00-04:00',
      },
      {
        id: 'marcus-2',
        author: 'maker',
        body: 'No nuts — they are wheat, milk, and egg only. I bake them on a nut-free tray.',
        sentAt: '2026-10-02T18:02:00-04:00',
      },
      {
        id: 'marcus-3',
        author: 'buyer',
        body: 'Perfect, I will grab two 6-packs at Kerrytown Saturday.',
        sentAt: '2026-10-02T18:10:00-04:00',
      },
    ],
  },
  {
    id: 'buyer-lena',
    buyerId: 'buyer-lena',
    buyerName: 'Lena R.',
    unread: false,
    messages: [
      {
        id: 'lena-1',
        author: 'buyer',
        body: 'Is the strawberry jam shelf-stable or does it need refrigeration?',
        sentAt: '2026-10-01T09:30:00-04:00',
      },
      {
        id: 'lena-2',
        author: 'maker',
        body: 'Shelf-stable until opened, then keep it in the fridge. Good for about three weeks after that.',
        sentAt: '2026-10-01T09:52:00-04:00',
      },
    ],
  },
];

export function getBuyerConversation(buyerId: string): BuyerConversation | undefined {
  return makerConversations.find((conversation) => conversation.buyerId === buyerId);
}

export function lastBuyerMessage(conversation: BuyerConversation): ChatMessage {
  return conversation.messages[conversation.messages.length - 1];
}
