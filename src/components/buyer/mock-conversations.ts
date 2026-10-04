export type MessageAuthor = 'buyer' | 'maker';

export type ChatMessage = {
  id: string;
  author: MessageAuthor;
  body: string;
  sentAt: string;
};

export type Conversation = {
  id: string;
  makerId: string;
  unread: boolean;
  messages: ChatMessage[];
};

export const mockConversations: Conversation[] = [
  {
    id: 'thread-night-oven',
    makerId: 'maker-night-oven',
    unread: true,
    messages: [
      {
        id: 'night-1',
        author: 'buyer',
        body: 'Hi — looking at the salted tahini cookies. Sesame is a problem for someone in my house. Is it just tahini in the dough, or seeds on top too?',
        sentAt: '2026-10-03T15:40:00-04:00',
      },
      {
        id: 'night-2',
        author: 'maker',
        body: 'Both, unfortunately. Tahini is mixed through the dough and I finish them with sesame seeds. I can leave the sprinkle off, but the dough itself still has tahini, so they are not sesame-free.',
        sentAt: '2026-10-03T15:52:00-04:00',
      },
      {
        id: 'night-3',
        author: 'buyer',
        body: 'Thanks for being clear. I will skip those. Can I still grab a 4-pack of brown butter chocolate chip at the downtown library Saturday morning?',
        sentAt: '2026-10-03T16:05:00-04:00',
      },
      {
        id: 'night-4',
        author: 'maker',
        body: 'Yes. AADL lobby, Saturday 9–10. I will put a labeled box on the pickup table with your name. The brown butter chips are wheat, milk, and egg — no sesame on that tray.',
        sentAt: '2026-10-03T16:18:00-04:00',
      },
    ],
  },
  {
    id: 'thread-maple-rye',
    makerId: 'maker-maple-rye',
    unread: true,
    messages: [
      {
        id: 'maple-1',
        author: 'buyer',
        body: 'Does the maple sandwich loaf have dairy? I need something without milk for my kid.',
        sentAt: '2026-10-03T10:12:00-04:00',
      },
      {
        id: 'maple-2',
        author: 'maker',
        body: 'It does — milk, butter, and eggs, plus wheat. The country sourdough is wheat, water, and salt only. No dairy or eggs. Seeded rye is the same, just with caraway and sunflower seeds.',
        sentAt: '2026-10-03T10:24:00-04:00',
      },
      {
        id: 'maple-3',
        author: 'buyer',
        body: 'Country sourdough it is. Any chance of a loaf if I come to Kerrytown Saturday, 10–11?',
        sentAt: '2026-10-03T10:41:00-04:00',
      },
      {
        id: 'maple-4',
        author: 'maker',
        body: '10–11 is open. I will pull one boule off the Friday bake and mark it with your name. Six left this week, so you are set.',
        sentAt: '2026-10-03T11:02:00-04:00',
      },
    ],
  },
  {
    id: 'thread-burns-granola',
    makerId: 'maker-burns-granola',
    unread: false,
    messages: [
      {
        id: 'granola-1',
        author: 'buyer',
        body: 'The classic cluster lists almonds. Could you do a nut-free bag of the cacao cherry for a school snack?',
        sentAt: '2026-10-02T18:15:00-04:00',
      },
      {
        id: 'granola-2',
        author: 'maker',
        body: 'Cacao cherry is already nut-free: oats, honey, cacao nibs, dried cherries, and sunflower seeds. I mix it on a separate tray from the maple pecan batch and bag it first.',
        sentAt: '2026-10-02T18:40:00-04:00',
      },
      {
        id: 'granola-3',
        author: 'buyer',
        body: 'That is exactly it. Can I get two bags, and is Saturday 10–11 at Kerrytown still your window?',
        sentAt: '2026-10-02T19:02:00-04:00',
      },
      {
        id: 'granola-4',
        author: 'maker',
        body: 'Two bags are on the list. I will have them by the farmers market clock, Saturday 10–11. These still have rolled oats, so tell me if you need them oat-free too.',
        sentAt: '2026-10-02T19:20:00-04:00',
      },
    ],
  },
  {
    id: 'thread-kerrytown-jam',
    makerId: 'maker-kerrytown-jam',
    unread: false,
    messages: [
      {
        id: 'jam-1',
        author: 'buyer',
        body: 'Are the jams made around nuts? Also, could you put up a small 4oz of blackberry sage as a gift?',
        sentAt: '2026-10-01T09:05:00-04:00',
      },
      {
        id: 'jam-2',
        author: 'maker',
        body: 'No nuts in the jam kitchen. Peach vanilla is peaches, sugar, vanilla bean, lemon, and pectin. I can do a 4oz blackberry sage if you order by Thursday — same fruit, shorter pot, $7.',
        sentAt: '2026-10-01T09:28:00-04:00',
      },
      {
        id: 'jam-3',
        author: 'buyer',
        body: 'Please do the 4oz. I will pick it up with a peach vanilla at Argus on Saturday, 10–11.',
        sentAt: '2026-10-01T09:44:00-04:00',
      },
      {
        id: 'jam-4',
        author: 'maker',
        body: 'Both jars will be on the Savor shelf at Argus, labeled. The 4oz is a one-off, so I will not have extras if someone else asks.',
        sentAt: '2026-10-01T10:10:00-04:00',
      },
    ],
  },
  {
    id: 'thread-honeycomb',
    makerId: 'maker-honeycomb-hills',
    unread: false,
    messages: [
      {
        id: 'honey-1',
        author: 'buyer',
        body: 'Do you sell anything bigger than the cut comb squares? I want a slab for a cheese board.',
        sentAt: '2026-09-28T14:10:00-04:00',
      },
      {
        id: 'honey-2',
        author: 'maker',
        body: 'Squares are the usual cut. I can set aside a half-frame slab — about $18 — if you can take it Saturday. It is fragile, so the safe exchange lot is easier than the market sheds.',
        sentAt: '2026-09-28T15:02:00-04:00',
      },
      {
        id: 'honey-3',
        author: 'buyer',
        body: 'Half-frame sounds right. Saturday 11–12 at the AAPD safe exchange works.',
        sentAt: '2026-09-28T15:20:00-04:00',
      },
      {
        id: 'honey-4',
        author: 'maker',
        body: 'Booked. I will wrap it in a tin so it does not weep in the car. If the frame is not capped in time I will message you here and move it a week.',
        sentAt: '2026-09-28T15:41:00-04:00',
      },
    ],
  },
];

function startOfDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
}

function dayDiff(iso: string, now: Date) {
  return Math.round((startOfDay(now) - startOfDay(new Date(iso))) / 86_400_000);
}

function clockTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function lastMessage(conversation: Conversation) {
  return conversation.messages[conversation.messages.length - 1];
}

export function formatInboxTime(iso: string, now = new Date()) {
  const diff = dayDiff(iso, now);
  if (diff <= 0) {
    return clockTime(iso);
  }
  if (diff === 1) {
    return 'Yesterday';
  }
  if (diff < 7) {
    return new Date(iso).toLocaleDateString('en-US', { weekday: 'short' });
  }
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatBubbleTime(iso: string, now = new Date()) {
  const time = clockTime(iso);
  const diff = dayDiff(iso, now);
  if (diff <= 0) {
    return time;
  }
  if (diff === 1) {
    return `Yesterday ${time}`;
  }
  if (diff < 7) {
    const weekday = new Date(iso).toLocaleDateString('en-US', { weekday: 'short' });
    return `${weekday} ${time}`;
  }
  const date = new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${date} ${time}`;
}
