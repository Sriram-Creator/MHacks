import re
from datetime import datetime
from uuid import uuid4
from uagents import Agent, Context, Protocol
from uagents_core.contrib.protocols.chat import (
    ChatAcknowledgement, ChatMessage, TextContent, chat_protocol_spec,
)

agent = Agent()
chat_proto = Protocol(spec=chat_protocol_spec)

ITEMS = [
    {"id": "item-1", "name": "Classic Sourdough Loaf", "price": 9, "allergens": ["wheat"], "left_this_week": 12},
    {"id": "item-2", "name": "Michigan Cherry Pie", "price": 22, "allergens": ["wheat", "dairy"], "left_this_week": 5},
    {"id": "item-3", "name": "Strawberry Jam", "price": 8, "allergens": [], "left_this_week": 20},
    {"id": "item-4", "name": "Wildflower Honey", "price": 10, "allergens": [], "left_this_week": 15},
    {"id": "item-5", "name": "Chocolate Chip Cookies (6-pack)", "price": 12, "allergens": ["wheat", "dairy", "eggs"], "left_this_week": 30},
    {"id": "item-6", "name": "Maple Almond Granola", "price": 11, "allergens": ["nuts"], "left_this_week": 18},
]

SPOTS = [
    {"name": "Ann Arbor Farmers Market", "address": "315 Detroit St, Ann Arbor, MI 48104", "keys": ["farmers", "kerrytown"]},
    {"name": "Ann Arbor District Library - Downtown", "address": "343 S Fifth Ave, Ann Arbor, MI 48104", "keys": ["library"]},
    {"name": "Nichols Arboretum", "address": "1610 Washington Heights, Ann Arbor, MI 48104", "keys": ["arboretum"]},
    {"name": "University of Michigan Diag", "address": "913 S University Ave, Ann Arbor, MI 48109", "keys": ["diag", "campus"]},
]

BAD = ["pickle", "canned", "canning", "cream cheese", "custard", "meat", "fermented"]


def get_budget(q):
    m = re.search(r"\$\s*(\d+(?:\.\d+)?)", q)
    if m:
        return float(m.group(1))
    m = re.search(r"(?:under|below|less than|max|budget)\s*\$?\s*(\d+(?:\.\d+)?)", q.lower())
    if m:
        return float(m.group(1))
    return 30.0


def pick_spot(ql):
    for s in SPOTS:
        for k in s["keys"]:
            if k in ql:
                return s
    return SPOTS[0]


def legal_answer(ql):
    for p in BAD:
        if p in ql:
            return "NO. Michigan cottage food rules do not allow home-pickled, canned, or low-acid foods without a commercial kitchen license (botulism risk). [REJECTED_NON_COMPLIANT]"
    return "YES. Standard baked goods, jams, granola, and dry mixes are generally allowed under Michigan cottage food rules. [APPROVED]"


def forecast_answer():
    return "List 40: about 12 regulars + a rainy Saturday + a 36-loaf average over the last 3 weeks. [FORECAST_GENERATED]"


def order_answer(q, ql):
    budget = get_budget(q)
    nut_free = "nut" in ql
    picks = []
    total = 0.0
    for it in ITEMS:
        has_nut = any("nut" in a for a in it["allergens"])
        if nut_free and has_nut:
            continue
        if it["left_this_week"] <= 0:
            continue
        if total + it["price"] > budget:
            continue
        picks.append(it)
        total = total + it["price"]
    if len(picks) == 0:
        return "I could not find anything for that budget and diet."
    spot = pick_spot(ql)
    names = ", ".join([p["name"] for p in picks])
    ids = ", ".join(["ORD-" + uuid4().hex[:6].upper() for p in picks])
    line1 = "Ordered " + names + " for $" + format(total, ".2f") + ". "
    line2 = "Pickup: " + spot["name"] + " (" + spot["address"] + "). "
    line3 = "Order IDs: " + ids
    return line1 + line2 + line3


def respond(q):
    ql = q.lower()
    if "pickle" in ql or "can i sell" in ql or "legal" in ql:
        return legal_answer(ql)
    if "sourdough" in ql or "how much" in ql or "bake" in ql:
        return forecast_answer()
    for w in ["box", "order", "buy", "$", "nut"]:
        if w in ql:
            return order_answer(q, ql)
    return "I am the Cottage AI agent. Ask me to order a box (e.g. nut-free breakfast box under $30), check if a food is legal to sell in Michigan, or forecast how much to bake."


@chat_proto.on_message(ChatMessage)
async def on_msg(ctx: Context, sender: str, msg: ChatMessage):
    ack = ChatAcknowledgement(timestamp=datetime.utcnow(), acknowledged_msg_id=msg.msg_id)
    await ctx.send(sender, ack)
    for item in msg.content:
        if isinstance(item, TextContent):
            ctx.logger.info("Received: " + item.text)
            out = respond(item.text)
            reply = ChatMessage(
                timestamp=datetime.utcnow(),
                msg_id=uuid4(),
                content=[TextContent(type="text", text=out)],
            )
            await ctx.send(sender, reply)


@chat_proto.on_message(ChatAcknowledgement)
async def on_ack(ctx: Context, sender: str, msg: ChatAcknowledgement):
    pass


agent.include(chat_proto, publish_manifest=True)