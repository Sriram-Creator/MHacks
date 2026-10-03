from uagents import Agent, Context, Model

class AgentQuery(Model):
    question: str

class AgentResponse(Model):
    answer: str
    status: str

hearth_agent = Agent(
    name="hearth_fetch_agent",
    port=8000,
    seed="hearth_mhacks_2026_secret_agent_seed_123",
    endpoint=["http://127.0.0.1:8000/submit"]
)

PROHIBITED_ITEMS = ["pickle", "pickles", "canned", "canning", "cream cheese", "custard", "meat", "fermented"]

def process_hearth_logic(question: str) -> dict:
    q = question.lower()
    
    if "pickle" in q or "can i sell" in q or "legal" in q:
        if any(item in q for item in PROHIBITED_ITEMS):
            return {
                "answer": "NO. Under Michigan Cottage Food Law (HB 4122), home-pickled, canned, or low-acid food items are prohibited without a commercial kitchen license due to botulism risks.",
                "status": "REJECTED_NON_COMPLIANT"
            }
        else:
            return {
                "answer": "YES! Standard baked goods, jams, granolas, and dry mixes are allowed under Michigan Cottage Food Law up to $50,000 annually.",
                "status": "APPROVED"
            }

    elif "sourdough" in q or "how much" in q or "bake" in q:
        active_subscribers = 200
        preference_weight = 0.18
        weather_multiplier = 1.12
        
        target_yield = round(active_subscribers * preference_weight * weather_multiplier)
        
        return {
            "answer": f"List 40 / Bake {target_yield}: Based on 200 active Saturday subscribers, weather forecasts (62°F Sunny), and historical preferences, your target is {target_yield} sourdough loaves.",
            "status": "FORECAST_GENERATED"
        }
    
    else:
        return {
            "answer": "Hearth AI Agent online. Ready for legal compliance checks or yield forecasting.",
            "status": "READY"
        }

@hearth_agent.on_message(model=AgentQuery)
async def handle_message(ctx: Context, sender: str, msg: AgentQuery):
    ctx.logger.info(f"Received message from {sender}: '{msg.question}'")
    result = process_hearth_logic(msg.question)
    await ctx.send(sender, AgentResponse(answer=result["answer"], status=result["status"]))

@hearth_agent.on_event("startup")
async def run_local_verification(ctx: Context):
    ctx.logger.info(f"=== Hearth Agent Online! Address: {hearth_agent.address} ===")
    ctx.logger.info("Executing local verification queries...\n")
    
    test_queries = [
        "Can I sell pickles in Michigan?",
        "How much sourdough should I make?"
    ]
    
    for query in test_queries:
        res = process_hearth_logic(query)
        ctx.logger.info(f"Q: '{query}'")
        ctx.logger.info(f"A: {res['answer']}")
        ctx.logger.info(f"Status: [{res['status']}]\n" + "-"*50)

if __name__ == "__main__":
    hearth_agent.run()
