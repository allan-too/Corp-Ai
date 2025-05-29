import os
import logging
import importlib.util
from config import settings

# Configure logging
logger = logging.getLogger("corp_ai.agent")

# Check for required dependencies
HAS_TRANSFORMERS = importlib.util.find_spec("transformers") is not None
HAS_TORCH = importlib.util.find_spec("torch") is not None
HAS_LANGCHAIN = importlib.util.find_spec("langchain") is not None

# Define a dummy LLM for fallback
class DummyLLM:
    """A simple fallback LLM that returns predefined responses."""
    def __call__(self, prompt):
        return "I'm sorry, but the AI model is not available at the moment. Please try again later."
    
    def run(self, prompt):
        return self.__call__(prompt)

# Load the fine-tuned LLM model
def load_llm():
    if not (HAS_TRANSFORMERS and HAS_TORCH and HAS_LANGCHAIN):
        missing = []
        if not HAS_TRANSFORMERS: missing.append("transformers")
        if not HAS_TORCH: missing.append("torch")
        if not HAS_LANGCHAIN: missing.append("langchain")
        logger.error(f"Missing required dependencies: {', '.join(missing)}")
        return DummyLLM()
    
    try:
        # Import dependencies here to avoid errors if they're missing
        from langchain_community.llms import HuggingFacePipeline
        from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
        import torch
        
        # Load model and tokenizer from the path specified in settings
        model_path = settings.CORP_LLM_PATH
        logger.info(f"Loading LLM from {model_path}")
        
        # Check if model path exists
        if not os.path.exists(model_path):
            logger.warning(f"Model path {model_path} does not exist. Using fallback model.")
            # Fallback to a simpler model
            from langchain.llms import HuggingFaceHub
            return HuggingFaceHub(
                repo_id="google/flan-t5-base",
                model_kwargs={"temperature": 0.7, "max_length": 512}
            )
        
        tokenizer = AutoTokenizer.from_pretrained(model_path)
        model = AutoModelForCausalLM.from_pretrained(
            model_path,
            torch_dtype=torch.float16,
            device_map="auto",
            load_in_8bit=True  # For memory efficiency
        )
        
        # Create a text generation pipeline
        pipe = pipeline(
            "text-generation",
            model=model,
            tokenizer=tokenizer,
            max_length=2048,
            temperature=0.7,
            top_p=0.95,
            repetition_penalty=1.15
        )
        
        # Wrap the pipeline in a LangChain LLM
        llm = HuggingFacePipeline(pipeline=pipe)
        logger.info("LLM loaded successfully")
        return llm
    except Exception as e:
        logger.error(f"Error loading LLM: {str(e)}")
        # Return dummy LLM if everything fails
        return DummyLLM()

# Initialize the LLM
llm = load_llm()

# Import tools based on available dependencies
tools = []

# Import tools
from tools.crm import create_lead
from tools.sales_forecast import forecast_sales
from tools.chat_support import handle_customer_query
from tools.marketing import send_campaign
from tools.social_media import post_social
from tools.analytics import generate_report
from tools.hr_assistant import create_job_post
from tools.contract_review import review_contract
from tools.finance_planner import plan_budget
from tools.supply_chain import optimize_inventory
from tools.scheduler import schedule_appointment
from tools.review_management import respond_review
from tools.accounting import generate_invoice
from tools.inventory import update_stock
from tools.legal_crm import create_case
from tools.notification import send_notification
from tools.reservation import make_reservation

# Only create tools if LangChain is available
if HAS_LANGCHAIN:
    from langchain.agents import Tool # type: ignore
    
    tools = [
        Tool(name="CRM", func=create_lead, description="Manage leads and follow-ups."),
        Tool(name="SalesForecast", func=forecast_sales, description="Generate sales forecasts."),
        Tool(name="ChatSupport", func=handle_customer_query, description="AI customer support chatbot."),
        Tool(name="MarketingCampaign", func=send_campaign, description="Create and send marketing campaigns."),
        Tool(name="SocialMedia", func=post_social, description="Schedule social media posts."),
        Tool(name="Analytics", func=generate_report, description="Generate BI reports."),
        Tool(name="HRAssistant", func=create_job_post, description="Recruiting and onboarding."),
        Tool(name="ContractReview", func=review_contract, description="Contract analysis and summary."),
        Tool(name="FinancePlanner", func=plan_budget, description="Budgeting and cashflow insights."),
        Tool(name="SupplyChain", func=optimize_inventory, description="Optimize inventory levels."),
        Tool(name="Scheduler", func=schedule_appointment, description="Appointment scheduling."),
        Tool(name="ReviewManagement", func=respond_review, description="Respond to online reviews."),
        Tool(name="Accounting", func=generate_invoice, description="Generate invoices and track payments."),
        Tool(name="Inventory", func=update_stock, description="Manage inventory and stock levels."),
        Tool(name="LegalCRM", func=create_case, description="Track legal cases and generate documents."),
        Tool(name="Notification", func=send_notification, description="Send email and SMS notifications."),
        Tool(name="Reservation", func=make_reservation, description="Handle reservations for services."),
    ]

# Initialize knowledge base and retrieval QA if dependencies are available
qa_chain = None
if HAS_LANGCHAIN and importlib.util.find_spec("sentence_transformers") is not None:
    try:
        from langchain_chroma import Chroma # type: ignore
        from langchain_community.embeddings import HuggingFaceEmbeddings # type: ignore
        from langchain.chains import RetrievalQA # type: ignore

        # initialize embeddings & vector store
        logger.info("Initializing embeddings and vector store")
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        vectordb = Chroma(persist_directory="db/chroma", embedding_function=embeddings)
        retriever = vectordb.as_retriever(search_kwargs={"k": 5})
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=retriever
        )

        # register as a tool
        if qa_chain:
            tools.append(
                Tool(
                    name="KnowledgeBaseQA",
                    func=lambda q: qa_chain.run(q),
                    description="Answer questions from company documents."
                )
            )
            logger.info("Knowledge base QA tool added successfully")
    except Exception as e:
        logger.error(f"Error initializing knowledge base: {str(e)}")

# Initialize the agent with the LLM and tools
agent = None
if HAS_LANGCHAIN and tools:
    try:
        from langchain.agents import initialize_agent
        from langchain.memory import ConversationBufferMemory
        from langchain.prompts import PromptTemplate

        # Create a memory for the agent to maintain conversation context
        memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

        # Custom prompt template for the agent
        template = """You are CORP AI, a comprehensive business assistant designed to streamline operations.
You have access to various business tools and a knowledge base to help answer questions.

TOOLS:
------
You have access to the following tools:
{tools}

To use a tool, please use the following format:
```
Thought: I need to use a tool to help with this query.
Action: tool_name
Action Input: the input to the tool
```

When you have a response to say to the Human, you MUST use the format:
```
Thought: I know the answer to this.
Final Answer: the final answer to the human
```

CHAT HISTORY:
-------------
{chat_history}

QUESTION:
---------
{input}

Begin!
Thought: """

        # Initialize the agent
        agent = initialize_agent(
            tools=tools,
            llm=llm,
            agent="chat-conversational-react-description",
            verbose=True,
            memory=memory,
            prompt=PromptTemplate(
                input_variables=["tools", "chat_history", "input"],
                template=template
            ),
            handle_parsing_errors=True
        )
        logger.info("Agent initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing agent: {str(e)}")

# Create fallback agent function if initialization failed
if agent is None:
    def agent(query):
        return "I'm sorry, but I'm experiencing technical difficulties. The agent could not be initialized properly."
    logger.warning("Using fallback agent function")

# Export the agent for use in the API
__all__ = ["agent", "llm", "tools"]