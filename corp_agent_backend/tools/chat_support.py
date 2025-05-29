from typing import Dict
import logging
import importlib.util
from config import settings

# Configure logging
logger = logging.getLogger("corp_ai.tools.chat_support")

# Check for required dependencies
support_retriever = None

try:
    # Check if sentence-transformers is available
    if importlib.util.find_spec("sentence_transformers") is None:
        logger.warning("sentence-transformers package not found. Support knowledge base will not be available.")
    else:
        from langchain.chains import RetrievalQA
        from langchain_chroma import Chroma
        from langchain_community.embeddings import HuggingFaceEmbeddings
        
        # Initialize embeddings for support knowledge base
        support_embeddings = HuggingFaceEmbeddings(model_name=settings.EMBEDDING_MODEL)
        
        # Initialize support knowledge base
        try:
            support_vectordb = Chroma(
                persist_directory=f"{settings.CHROMA_PERSIST_DIR}/support",
                embedding_function=support_embeddings
            )
            support_retriever = support_vectordb.as_retriever(search_kwargs={"k": 3})
            logger.info("Support knowledge base initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize support knowledge base: {str(e)}")
            support_retriever = None
except Exception as e:
    logger.error(f"Error setting up support knowledge base: {str(e)}")
    support_retriever = None

def handle_customer_query(query: str) -> Dict:
    """
    Respond to a customer support query using the LLM and support knowledge base.
    
    Args:
        query: The customer's support question
        
    Returns:
        Dict containing the original query and AI-generated response
    """
    logger.info(f"Processing customer query: {query[:50]}...")
    
    try:
        # Import here to avoid circular imports
        from corp_agent import llm
        
        # If we have a support knowledge base, use it for retrieval
        if support_retriever:
            # Create a retrieval chain for support-specific knowledge
            support_qa = RetrievalQA.from_chain_type(
                llm=llm,
                chain_type="stuff",
                retriever=support_retriever
            )
            
            # Get response from the support knowledge base
            answer = support_qa.run(query)
        else:
            # Fall back to direct LLM response if no knowledge base
            prompt = f"""You are a helpful customer support assistant for a business software platform.
            Answer the following customer query professionally and helpfully:
            
            Customer Query: {query}
            
            Your Response:"""
            
            answer = llm(prompt)
        
        logger.info(f"Generated response for customer query")
        return {
            "query": query,
            "response": answer,
            "source": "support_kb" if support_retriever else "llm_direct"
        }
        
    except Exception as e:
        logger.error(f"Error processing customer query: {str(e)}")
        return {
            "query": query,
            "response": "I apologize, but I'm experiencing technical difficulties. Please try again later or contact our support team directly.",
            "error": str(e)
        }