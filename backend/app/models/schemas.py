from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class AnalyzeRequest(BaseModel):
    idea: str = Field(..., description="The startup idea to be analyzed")
    user_interests: Optional[str] = Field(None, description="User's hobbies/interests to help suggest pivots or alternative ideas")

class PitchMessage(BaseModel):
    role: str = Field(..., description="Either 'shark' or 'user'")
    content: str = Field(..., description="The content of the message")

class PitchCoachRequest(BaseModel):
    idea: str = Field(..., description="The startup idea being pitched")
    history: List[PitchMessage] = Field(default=[], description="The roleplay dialogue history")
    user_response: Optional[str] = Field(None, description="The user's response to the last question asked by the Shark")
